import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

interface ConnectionConfig {
  port: number;
  host: string;
  password?: string;
}

const configService = new ConfigService();

class RedisConnection {
  private static instance: Redis;

  public static connect(config: ConnectionConfig): Redis {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new Redis({
        port: Number(config.port),
        host: config.host as string,
        [config.password ? 'password' : null]: config.password
          ? config.password
          : undefined,
      });
    }
    return RedisConnection.instance;
  }
}

const redisClient = RedisConnection.connect({
  port: configService.get<number>('REDIS_PORT'),
  host: configService.get<string>('REDIS_HOST'),
  // port: Number(process.env.REDIS_PORT),
  // host: process.env.REDIS_HOST,
});

export { redisClient };
