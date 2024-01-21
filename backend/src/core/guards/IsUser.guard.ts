import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from './enums/Role.enums';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IsUserGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const next = context.switchToHttp().getNext();
    const role = request['user'];

    if (!role) {
      return next(new UnauthorizedException('User role is not defined.'));
    }

    const checkRole = await this.prismaService.roles.findUnique({
      where: {
        id: role.roleID,
      },
    });

    if (!checkRole) {
      throw new InternalServerErrorException(
        'Something went wrong while checking user role.',
      );
    }

    if (checkRole.role !== Role.user) {
      throw new UnauthorizedException('you are not authorized to do this.');
    }

    return true;
  }
}
