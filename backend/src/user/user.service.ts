import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GeneratorManager } from '@src/core/libs/GeneratorManager';
import Hashmanager from '@src/core/libs/HashManager';
import { PrismaService } from '@src/prisma/prisma.service';
import { map, omit } from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '@src/core/libs/JwtManager';
import bcrypt from 'bcryptjs';
import {
  DeleteProfileImageDto,
  ForgotPasswordEmailBodyDto,
  ResetPasswordBodyDto,
  SigninBodyDto,
  SignupBodyDto,
  UpdateEmailBodyDTo,
  UpdatePasswordBodyDto,
  UpdateProfileBodyDto,
} from './dtos/dtos';
import { AwsS3Service } from '@src/aws/aws-s3/aws-s3.service';
import EmailManagerService from '@src/core/services/EmailManager';
import { redisClient } from '@src/core/libs/redisClient';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordEmailInterface } from '@src/core/interfaces/email-interfaces/ForgotPasswordEmail.interface';
import { ConfirmEmailForSignupInterface } from '@src/core/interfaces/email-interfaces/ConfirmEmailForSignup.interface';
import { EmailUpdateInterface } from '@src/core/interfaces/email-interfaces/EmailUpdate.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
    private readonly jwtService: JwtService,
    private readonly emailManagerService: EmailManagerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @method signup
   * @param body | (firstName, lastName, email, password, passwordConfirmation)
   * @param res | Response
   * @returns void
   * @description
   * This method creates a new user account.
   */
  async signup(body: SignupBodyDto, res: Response): Promise<void> {
    const confirmToken = GeneratorManager.generateRandomId({
      length: 48,
      type: 'textAndNumber',
    });

    const readingListCode = GeneratorManager.generateRandomId({
      length: 10,
      type: 'number',
      prefix: 'RLID',
    });

    await this.prismaService.$transaction(async (prisma: PrismaClient) => {
      const roleID = await prisma.roles.findFirst({
        where: {
          role: 'user',
        },
      });

      const user = await prisma.users.create({
        data: {
          ...omit(body, ['password', 'passwordConfirmation']),
          password: await Hashmanager.hashPassword(body.password),
          roleID: roleID.id,
          userCode: GeneratorManager.generateRandomId({
            length: 12,
            type: 'number',
            prefix: 'USID',
          }),
        },
      });

      await this.prismaService.readingList.create({
        data: {
          readingListCode: readingListCode,
          readingListName: 'reading list',
          readingListNameSlug: `reading-list-${readingListCode}`,
          userID: user.id,
          isDeletable: false,
        },
      });

      await redisClient.set(
        GeneratorManager.generateRedisKey({
          prefix: 'confirm-account',
          suffix: confirmToken,
        }),
        JSON.stringify({
          userCode: user.userCode,
          confirmToken: confirmToken,
        }),
        'EX',
        10 * 60,
      );

      this.emailManagerService.sendEmail<ConfirmEmailForSignupInterface>({
        to: user.email,
        subject: 'Confirm your email address',
        template: 'confirmEmailForSignup',
        data: {
          firstName: user.firstName,
          email: user.email,
          confirmLink: `${this.configService.get<string>(
            'CLIENT_URL',
          )}/verify/confirm-email/${confirmToken}`,
        },
      });
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message:
        'You have successfully signed up. Please check your email and confirm your account.',
    });
  }

  /**
   * @method confirmEmailForSignup
   * @param token | string
   * @param res | Response
   * @param next | NextFunction
   * @returns void
   * @description
   * This method is used to confirm user's email address.
   */
  async confirmEmailForSignup(
    token: string,
    res: Response,
    next: NextFunction,
  ) {
    const redisKey = GeneratorManager.generateRedisKey({
      prefix: 'confirm-account',
      suffix: token,
    });

    const getUserAccountVerificationData = JSON.parse(
      await redisClient.get(redisKey),
    );

    if (!getUserAccountVerificationData) {
      return next(
        new UnauthorizedException(
          'Your account verification token has been expired',
        ),
      );
    }

    const user = await this.prismaService.users.findUnique({
      where: {
        userCode: getUserAccountVerificationData.userCode,
        isAccountConfirmed: false,
      },
    });

    if (!user) {
      return next(
        new UnauthorizedException(
          'User not found. Please contact our support team for more information',
        ),
      );
    }

    await this.prismaService.users.update({
      where: {
        userCode: getUserAccountVerificationData.userCode,
      },
      data: {
        isAccountConfirmed: true,
        accountConfirmedAt: new Date(Date.now()),
      },
    });

    redisClient.del(redisKey);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'You have successfully d your email.',
    });
  }

  /**
   * Signin
   * @param body - Request body (email, password)
   * @param res - Response object
   * @param next - Next function
   * @description This method is used to signin user. It will return jwt token in cookie.
   */
  async signin(body: SigninBodyDto, res: Response, next: NextFunction) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email: body.email,
      },
      include: {
        Roles: true,
      },
    });

    if (
      !user ||
      !(await Hashmanager.comparePassword(body.password, user.password))
    ) {
      return next(
        new UnauthorizedException('Your email or password is wrong.'),
      );
    }

    if (!user.isAccountConfirmed) {
      return next(
        new UnauthorizedException(
          'Your account is not confirmed. Please check your email and confirm your account.',
        ),
      );
    }

    if (user.isAccountBlocked) {
      return next(
        new UnauthorizedException(
          'Your account is blocked. Plaese contact with us.',
        ),
      );
    }

    if (user.isAccountDeleted) {
      return next(
        new UnauthorizedException(
          'Your account is deleted. You can not sign in.',
        ),
      );
    }

    if (!user.isAccountActive) {
      return next(
        new UnauthorizedException(
          'Your account is not active. Please check your email and activate your account.',
        ),
      );
    }

    const jwtManager = new JwtManager();

    const jwtToken = await jwtManager.createAuthJwtToken(
      omit({ ...user, role: user.Roles.role }, ['password', 'Roles']),
    );

    jwtManager.sendAuthJwtToken(res, jwtToken);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'You are successfully signed in',
    });
  }

  /**
   * Get me
   * @param req - Request object
   * @param res - Response object
   * @description This method is used to get user's profile. It will return user's profile without password, id, roleID, createdAt, updatedAt, deletedAt.
   */
  async getMe(req: Request, res: Response) {
    const user = await this.prismaService.users.findFirst({
      where: {
        userCode: req['user'].userCode,
      },
      include: {
        Roles: {
          select: {
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      payload: {
        ...omit(user, [
          'password',
          'id',
          'roleID',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'Roles',
        ]),
        role: user.Roles.role,
      },
    });
  }

  /**
   * Signout
   * @param res
   * @description This method is used to signout user. It will clear jwt token from cookie.
   */
  async signout(res: Response) {
    res.clearCookie('jwt');

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'You are successfully signed out',
    });
  }

  /**
   * Send forgot password email
   * @param body - Request body (email)
   * @param res - Response object
   * @param next - Next function
   * @description This method is used to send forgot password email to user's email address.
   */
  async sendForgotPasswordEmail(
    body: ForgotPasswordEmailBodyDto,
    res: Response,
    next: NextFunction,
  ) {
    const chechEmail = await this.prismaService.users.findUnique({
      where: {
        email: body.email,
      },
    });

    console.log(chechEmail);

    if (chechEmail) {
      const resetToken = GeneratorManager.generateRandomId({
        length: 48,
        type: 'textAndNumber',
      });

      this.emailManagerService.sendEmail<ForgotPasswordEmailInterface>({
        to: chechEmail.email,
        subject: 'Reset your password',
        template: 'forgotPassword',
        data: {
          firstName: chechEmail.firstName,
          email: chechEmail.email,
          resetPasswordLink: `${this.configService.get<string>(
            'CLIENT_URL',
          )}/reset-password/${resetToken}`,
        },
      });

      redisClient.set(
        GeneratorManager.generateRedisKey({
          prefix: 'reset-password',
          suffix: resetToken,
        }),
        JSON.stringify({
          userCode: chechEmail.userCode,
          resetToken,
        }),
        'EX',
        10 * 60,
      );
    }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your reset password email has been sent successfully.',
    });
  }

  /**
   * Reset password
   * @param token - Token will be taken from the url | (resetToken)
   * @param body - Request body (newPassword, newPasswordConfirmation)
   * @param res - Response object
   * @param next - Next function
   * @description This method is used to reset renter's password.
   */
  async resetPassword(
    token: string,
    body: ResetPasswordBodyDto,
    res: Response,
    next: NextFunction,
  ) {
    const redisKey = GeneratorManager.generateRedisKey({
      prefix: 'reset-password',
      suffix: token,
    });
    const getResetPswDataFromRedis = JSON.parse(
      await redisClient.get(redisKey),
    );

    if (
      !getResetPswDataFromRedis ||
      getResetPswDataFromRedis.resetToken !== token
    ) {
      return next(
        new UnauthorizedException(
          'Your password reset token has been expired.',
        ),
      );
    }

    await this.prismaService.users.update({
      where: {
        userCode: getResetPswDataFromRedis.userCode,
      },
      data: {
        password: await bcrypt.hash(body.newPassword, 12),
      },
    });

    redisClient.del(redisKey);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your password has been reset successfully.',
    });
  }

  /**
   * Update password
   * @param body - Request body (currentPassword, newPassword, newPasswordConfirmation)
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function
   * @description This method is used to update user's password. user must provide current password to update password.
   */
  async updatePassword(
    body: UpdatePasswordBodyDto,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user = await this.prismaService.users.findFirst({
      where: {
        userCode: req['user'].userCode,
      },
    });

    if (!(await bcrypt.compare(body.currentPassword, user.password))) {
      return next(
        new BadRequestException(
          'Your current password is wrong. Please try again.',
        ),
      );
    }

    await this.prismaService.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: await bcrypt.hash(body.newPassword, 12),
        updatedAt: new Date(Date.now()),
      },
    });

    res.clearCookie('jwt');

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your password has been updated successfully.',
    });
  }

  /**
   * Deactivate account
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function
   * @description This method is used to deactivate user's account. user can not signin after deactivating account.
   */
  async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    const user = await this.prismaService.users.findFirst({
      where: {
        userCode: req['user'].userCode,
      },
    });

    if (!user) {
      return next(new BadRequestException('user not found.'));
    }

    await this.prismaService.users.update({
      where: {
        id: user.id,
      },
      data: {
        isAccountActive: false,
        accountDeactivatedAt: new Date(Date.now()),
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your account has been deactivated successfully.',
    });
  }

  /**
   * Upload profile image
   * @param body - Request body (profileImage)
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function
   * @description This method is used to upload user's profile image. If user has already uploaded a profile image, then it will be replaced by new one.
   */
  async uploadProfileImage(
    file: Express.Multer.File,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const metadata = await this.awsS3Service.uploadImage(file, next);

    if (!metadata) {
      return;
    }

    const user = await this.prismaService.users.findFirst({
      where: {
        userCode: req['user'].userCode,
      },
    });

    if (!user) {
      return next(new BadRequestException('user not found.'));
    }

    await this.prismaService.users.update({
      where: {
        id: user.id,
      },
      data: {
        profileImage: metadata.location,
        updatedAt: new Date(Date.now()),
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your profile image has been uploaded successfully.',
      payload: {
        profileImage: metadata.location,
      },
    });
  }

  async deleteProfileImage(
    body: DeleteProfileImageDto,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user = await this.prismaService.users.findUnique({
      where: {
        userCode: req['user'].userCode,
      },
    });

    if (user.profileImage === null) {
      return next(
        new BadRequestException('You have not uploaded any profile image.'),
      );
    }

    await this.prismaService.users.update({
      where: {
        userCode: req['user'].userCode,
      },
      data: {
        profileImage: null,
      },
    });

    await this.awsS3Service.deleteImageFromS3(body.imageUrl, next);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your profile image has been deleted successfully.',
    });
  }

  /**
   * Upload profile image
   * @param body - Request body (UpdateProfileBodyDto)
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function
   * @description This method is used to update user's profile.
   */
  async updateProfile(
    body: UpdateProfileBodyDto,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user = await this.prismaService.users.findFirst({
      where: {
        userCode: req['user'].userCode,
      },
    });

    if (!user) {
      return next(new BadRequestException('user not found.'));
    }

    await this.prismaService.users.update({
      where: {
        id: user.id,
      },
      data: {
        ...omit(body, ['profileImage']),
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your profile has been updated successfully.',
    });
  }

  /**
   * Update email
   * @param body - Request body (UpdateEmailBodyDTo)
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function
   * @description This method will send an email to user's new email address to confirm email token. This method will not update user's email address.
   */
  async sendEmailForUpdateEmail(
    body: UpdateEmailBodyDTo,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const checkIfEmailIsAlreadyTaken = await this.prismaService.users.findFirst(
      {
        where: {
          email: body.email,
        },
      },
    );

    console.log(checkIfEmailIsAlreadyTaken);

    if (checkIfEmailIsAlreadyTaken) {
      return next(
        new BadRequestException('This email address is already taken.'),
      );
    }

    const checkIfUserHasAlreadyRequestedForUpdateEmail = await redisClient.get(
      GeneratorManager.generateRedisKey({
        prefix: 'verify-email',
        suffix: req['user'].userCode,
      }),
    );

    if (checkIfUserHasAlreadyRequestedForUpdateEmail) {
      return next(
        new BadRequestException(
          'You have already requested for update email. Please check your email or try again after 3 minutes.',
        ),
      );
    }

    const verifyEmailToken = GeneratorManager.generateRandomId({
      length: 6,
      type: 'number',
    });

    await redisClient.set(
      GeneratorManager.generateRedisKey({
        prefix: 'verify-email',
        suffix: req['user'].userCode,
      }),
      JSON.stringify({
        userCode: req['user'].userCode,
        verifyEmailToken,
        newEmail: body.email,
      }),
      'EX',
      3 * 60,
    );

    this.emailManagerService.sendEmail<EmailUpdateInterface>({
      to: body.email,
      subject: 'Confirm your email address',
      template: 'confirmEmailForUpdateEmail',
      data: {
        firstName: req['user'].firstName,
        email: body.email,
        verifyEmailToken,
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your confirmation email has been sent successfully.',
    });
  }

  async confirmEmailForUpdateEmail(
    body: UpdateEmailBodyDTo,
    token: string,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const redisKey = GeneratorManager.generateRedisKey({
      prefix: 'verify-email',
      suffix: req['user'].userCode,
    });

    const getVerifyEmailData = JSON.parse(await redisClient.get(redisKey));

    if (!getVerifyEmailData) {
      return next(
        new UnauthorizedException(
          'Your email verification token has been expired.',
        ),
      );
    }

    if (getVerifyEmailData.newEmail !== body.email) {
      return next(
        new UnauthorizedException('Something went wrong. Please try again.'),
      );
    }

    if (getVerifyEmailData.verifyEmailToken !== token) {
      return next(
        new UnauthorizedException(
          'Your email verification token is wrong. Please try again.',
        ),
      );
    }

    await this.prismaService.users.update({
      where: {
        userCode: req['user'].userCode,
      },
      data: {
        email: body.email,
        updatedAt: new Date(Date.now()),
      },
    });

    redisClient.del(redisKey);
    res.clearCookie('jwt');

    const jwtManager = new JwtManager();

    jwtManager.sendAuthJwtToken(
      res,
      await jwtManager.createAuthJwtToken({
        ...req['user'],
        email: body.email,
      }),
    );

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'Your email has been updated successfully.',
    });
  }

  /**
   * @method followUser
   * @param userCode | string
   * @param req | Request
   * @param res | Response
   * @param next | NextFunction
   * @description This method is used to follow a user. If user is already following this user, then it will return an error.
   */
  async followUser(
    userCode: string,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userToFollow = await this.prismaService.users.findUnique({
      where: {
        userCode,
      },
    });

    if (!userToFollow) {
      return next(new BadRequestException('user not found.'));
    }

    if (userToFollow.id === req['user'].id) {
      return next(new BadRequestException('You can not follow yourself.'));
    }

    const isUserAlreadyFollowingThisUser =
      await this.prismaService.following.findFirst({
        where: {
          userID: req['user'].id,
          followingID: userToFollow.id,
        },
      });

    if (isUserAlreadyFollowingThisUser) {
      return next(
        new BadRequestException('You are already following this user.'),
      );
    } else {
      this.prismaService.$transaction(async (prisma: PrismaClient) => {
        await prisma.users.update({
          where: {
            userCode: req['user'].userCode,
            Following: {
              none: {
                followingID: userToFollow.id,
              },
            },
          },
          data: {
            followingCount: {
              increment: 1,
            },
          },
        });

        await prisma.users.update({
          where: {
            userCode,
            Followers: {
              none: {
                followerID: req['user'].id,
              },
            },
          },
          data: {
            followersCount: {
              increment: 1,
            },
          },
        });

        await prisma.following.create({
          data: {
            userID: req['user'].id,
            followingID: userToFollow.id,
          },
        });

        await prisma.followers.create({
          data: {
            userID: userToFollow.id,
            followerID: req['user'].id,
          },
        });
      });

      res.status(200).json({
        status: 'success',
        statusCode: 200,
        isSuccess: true,
        message: 'You have successfully followed this user.',
      });
    }
  }

  /**
   * @method unfollowUser
   * @param userCode | string
   * @param req | Request
   * @param res | Response
   * @param next | NextFunction
   * @description This method is used to unfollow a user. If user is not following this user, then it will return an error.
   */
  async unfollowUser(
    userCode: string, // 17b1e41b-5955-4422-8cf4-7d0c590cb874 <|> USID992386301410 <|> stephen grider
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const findUserToUnFollow = await this.prismaService.users.findUnique({
      where: {
        userCode,
        isAccountActive: true,
        isAccountConfirmed: true,
        isAccountBlocked: false,
        isAccountDeleted: false,
      },
    });
    // req['user'].id <|> 9fda0f4e-d111-4a5f-b885-6db2afd2dfbb <|> USID731677164416 <|> berat azgun
    if (!findUserToUnFollow) {
      return next(new BadRequestException('User not found.'));
    }

    if (findUserToUnFollow.id === req['user'].id) {
      return next(new BadRequestException('You can not unfollow yourself.'));
    }

    const isUserAlreadyFollowingThisUser =
      await this.prismaService.following.findFirst({
        where: {
          userID: req['user'].id,
          followingID: findUserToUnFollow.id,
        },
      });

    if (!isUserAlreadyFollowingThisUser) {
      return next(new BadRequestException('You are not following this user.'));
    } else {
      await this.prismaService.$transaction(async (prisma: PrismaClient) => {
        await prisma.users.update({
          where: {
            userCode: req['user'].userCode,
          },
          data: {
            followingCount: {
              decrement: 1,
            },
          },
        });

        await prisma.users.update({
          where: {
            userCode: findUserToUnFollow.userCode,
          },
          data: {
            followersCount: {
              decrement: 1,
            },
          },
        });

        await prisma.following.deleteMany({
          where: {
            userID: req['user'].id,
            followingID: findUserToUnFollow.id,
          },
        });

        await prisma.followers.deleteMany({
          where: {
            userID: findUserToUnFollow.id,
            followerID: req['user'].id,
          },
        });
      });
    }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'You have successfully unfollowed this user.',
    });
  }

  async removeUserOnFollowers(
    userCode: string,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const findUserToUnFollow = await this.prismaService.users.findUnique({
      where: {
        userCode,
        isAccountActive: true,
        isAccountConfirmed: true,
        isAccountBlocked: false,
        isAccountDeleted: false,
      },
    });

    if (!findUserToUnFollow) {
      return next(new BadRequestException('User not found.'));
    }

    if (findUserToUnFollow.id === req['user'].id) {
      return next(new BadRequestException('You can not unfollow yourself.'));
    }

    const isUserAlreadyFollowingThisUser =
      await this.prismaService.following.findFirst({
        where: {
          userID: req['user'].id,
          followingID: findUserToUnFollow.id,
        },
      });

    if (!isUserAlreadyFollowingThisUser) {
      return next(new BadRequestException('You are not following this user.'));
    } else {
      await this.prismaService.$transaction(async (prisma: PrismaClient) => {
        // Kullanıcıyı takipten çıkarma işlemleri
        await prisma.users.update({
          where: {
            userCode: req['user'].userCode,
          },
          data: {
            followingCount: {
              decrement: 1,
            },
          },
        });

        await prisma.users.update({
          where: {
            userCode: findUserToUnFollow.userCode,
          },
          data: {
            followersCount: {
              decrement: 1,
            },
          },
        });

        await prisma.following.deleteMany({
          where: {
            userID: req['user'].id,
            followingID: findUserToUnFollow.id,
          },
        });

        await prisma.followers.deleteMany({
          where: {
            userID: findUserToUnFollow.id,
            followerID: req['user'].id,
          },
        });
      });
    }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      message: 'You have successfully unfollowed this user.',
    });
  }

  /**
   * @method getFollowers
   * @param userCode | string
   * @param req | Request
   * @param res | Response
   * @param next | NextFunction
   * @description This method is used to get followers of a user.
   */
  async getFollowers(userCode: string, res: Response, next: NextFunction) {
    const user = await this.prismaService.users.findUnique({
      where: {
        userCode,
      },
    });

    if (!user) {
      return next(new BadRequestException('user not found.'));
    }

    const followers = await this.prismaService.followers.findMany({
      where: {
        userID: user.id,
      },
      include: {
        Followers: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            userCode: true,
            userName: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      payload: {
        length: followers.length,
        docs: map(followers, (follower) => {
          return {
            ...follower.Followers,
          };
        }),
      },
    });
  }

  /**
   * @method getUserByUsername
   * @param username | string
   * @param res | Response
   * @param next | NextFunction
   * @description This method is used to get followers of a user.
   */
  async getUserByUsername(
    username: string,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let isUserFollowingThisUser: boolean = false;
    const isThereLoggedInUser =
      req.headers.authorization &&
      !!(req.headers.authorization.split(' ')[1] !== 'undefined');

    const user = await this.prismaService.users.findUnique({
      where: {
        userName: username,
      },
      include: {
        Roles: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return next(
        new BadRequestException('The user you were looking for was not found'),
      );
    }

    if (isThereLoggedInUser) {
      const loggedInUser = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );

      const userFollowing = await this.prismaService.following.findFirst({
        where: {
          userID: loggedInUser.id,
          followingID: user.id,
        },
      });

      if (userFollowing) {
        isUserFollowingThisUser = true;
      } else {
        isUserFollowingThisUser = false;
      }
    }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      payload: {
        ...omit(user, [
          'password',
          'id',
          'roleID',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'Roles',
        ]),
        isUserFollowingThisUser,
        role: user.Roles.role,
      },
    });
  }

  /**
   * @method getFollowing
   * @param userCode | string
   * @param req | Request
   * @param res | Response
   * @param next | NextFunction
   * @description This method is used to get following of a user.
   */
  async getFollowings(userCode: string, res: Response, next: NextFunction) {
    const user = await this.prismaService.users.findUnique({
      where: {
        userCode,
      },
    });

    if (!user) {
      return next(new BadRequestException('user not found.'));
    }

    const following = await this.prismaService.following.findMany({
      where: {
        userID: user.id,
      },
      include: {
        Following: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            userCode: true,
            userName: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      isSuccess: true,
      payload: {
        length: following.length,
        docs: map(following, (follow) => {
          return {
            ...follow.Following,
          };
        }),
      },
    });
  }
}
