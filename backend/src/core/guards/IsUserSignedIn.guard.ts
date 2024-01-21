import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { JwtManager } from '@src/core/libs/JwtManager';
import { omit } from 'lodash';

@Injectable()
export class IsUserSignedInGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      this.configService.get<string>('JWT_SECRET'),
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (token && token !== null) {
      try {
        const jwtManager = new JwtManager();
        const payload = await jwtManager.verifyAsyncJwtToken(token);

        request['user'] = omit(payload, ['iat', 'exp']);
      } catch (error) {
        console.log(error);
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' && token !== null ? token : undefined;
  }
}
