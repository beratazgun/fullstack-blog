import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { omit } from 'lodash';

export class JwtManager {
  protected jwtService: JwtService = new JwtService();
  protected configService: ConfigService = new ConfigService();

  /**
   * Create a JWT token
   */
  async createAuthJwtToken(payload: any) {
    return this.jwtService.sign(
      {
        ...omit(payload, ['password']),
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
  }

  /**
   * Verify a JWT token asynchronously
   */
  async verifyAsyncJwtToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Send a JWT token server to client
   */
  async sendAuthJwtToken(res: Response, jwtToken: string) {
    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      maxAge: this.configService.get<number>('JWT_EXPIRATION'),
      expires: new Date(
        Date.now() + this.configService.get<number>('JWT_EXPIRATION') * 1000,
      ),
      sameSite: 'lax',
    });
  }
}
