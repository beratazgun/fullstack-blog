import {
  Body,
  Controller,
  Get,
  Next,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  DeleteProfileImageDto,
  ResetPasswordBodyDto,
  SigninBodyDto,
  SignupBodyDto,
  UpdateEmailBodyDTo,
  UpdatePasswordBodyDto,
  UpdateProfileBodyDto,
} from './dtos/dtos';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '@src/core/guards/Auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageManager } from '@src/core/libs/upload/UploadImageManager';
import { ImageSizeReducerPipe } from '@src/core/pipes/ImageSizeReducer.pipe';
import { UserService } from './user.service';
import { IsUserGuard } from '@src/core/guards/IsUser.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @method signup
   */
  @Post('/auth/signup')
  signup(
    @Body() body: SignupBodyDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.signup(body, res);
  }

  /**
   * @method signin
   */
  @Post('/auth/signin')
  signin(
    @Body() body: SigninBodyDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.signin(body, res, next);
  }

  /**
   * @method confirmEmailForSignup
   */
  @Post('/verify/confirm-email/:token')
  confirmEmailForSignup(
    @Param('token') token: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.confirmEmailForSignup(token, res, next);
  }

  /**
   * @method sendForgotPasswordEmail
   */
  @Post('/auth/forgot-password')
  sendForgotPasswordEmail(
    @Body() body: any,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.sendForgotPasswordEmail(body, res, next);
  }

  /**
   * @method getMe
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Get('/account/me')
  getMe(@Req() req: Request, @Res() res: Response) {
    return this.userService.getMe(req, res);
  }

  /**
   * @method resetPassword
   */
  @Post('/auth/reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordBodyDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.resetPassword(token, body, res, next);
  }

  /**
   * @method signout
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/account/signout')
  signout(@Res() res: Response) {
    return this.userService.signout(res);
  }

  /**
   * @method updatePassword
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/account/update-password')
  updatePassword(
    @Body() body: UpdatePasswordBodyDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.updatePassword(body, req, res, next);
  }

  /**
   * @method deactivateAccount
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/account/deactivate')
  deactivateAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.deactivateAccount(req, res, next);
  }

  /**
   * @method uploadProfileImage
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/account/upload-profile-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: UploadImageManager.multerStorage(
        (req: Request, file: Express.Multer.File) => {
          return `${file.originalname.split('.')[0]}.jpg`;
        },
      ),
    }),
  )
  uploadProfileImage(
    @UploadedFile(ImageSizeReducerPipe) file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.uploadProfileImage(file, req, res, next);
  }

  /**
   * @method deleteProfileImage
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/account/delete-profile-image')
  deleteProfileImage(
    @Body() body: DeleteProfileImageDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.deleteProfileImage(body, req, res, next);
  }

  /**
   * @method updateProfile
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/account/update-profile')
  updateProfile(
    @Body() body: UpdateProfileBodyDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.updateProfile(body, req, res, next);
  }

  /**
   * @method sendEmailForUpdateEmail
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/account/send-update-email')
  sendEmailForUpdateEmail(
    @Body() body: UpdateEmailBodyDTo,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.sendEmailForUpdateEmail(body, req, res, next);
  }

  /**
   * @method confirmEmailForUpdateEmail
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/verify/update-email/:token')
  confirmEmailForUpdateEmail(
    @Body() body: UpdateEmailBodyDTo,
    @Param('token') token: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.confirmEmailForUpdateEmail(
      body,
      token,
      req,
      res,
      next,
    );
  }

  /**
   * @method followUser
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/follow/:userCode')
  followUser(
    @Param('userCode') userCode: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.followUser(userCode, req, res, next);
  }

  /**
   * @method unfollowUser
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/unfollow/:userCode')
  unfollowUser(
    @Param('userCode') userCode: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.unfollowUser(userCode, req, res, next);
  }

  /**
   * @method removeUserOnFollowers
   */
  @UseGuards(AuthGuard, IsUserGuard)
  @Post('/remove-follower/:userCode')
  removeUserOnFollowers(
    @Param('userCode') userCode: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.removeUserOnFollowers(userCode, req, res, next);
  }

  /**
   * @method getUserByUsername
   *
   */
  @Get('/get-by/:username')
  async getUserByUsername(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.getUserByUsername(username, req, res, next);
  }

  /**
   * @method getFollowers
   */
  @Get('/:userCode/followers')
  getFollowers(
    @Param('userCode') userCode: string,

    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.getFollowers(userCode, res, next);
  }

  /**
   * @method getFollowings
   */
  @Get('/:userCode/followings')
  getFollowings(
    @Param('userCode') userCode: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.userService.getFollowings(userCode, res, next);
  }

  /**
   * @method test
   */
  @Get('/test')
  async testTemplate(@Res() res: Response) {
    res.render(
      'email/forgotPasswordEmail.ejs',
      { firstName: 'Bero', resetPasswordLink: process.env.CLIENT_URL },
      (err, html) => {
        console.log(err);
        res.send(html);
      },
    );
  }
}
