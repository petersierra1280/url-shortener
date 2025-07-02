import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RateLimitMiddleware } from './common/middlewares/rate-limit.middleware';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UrlModule, UserModule, PrismaModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes(
      'auth/login',
      'auth/register',
      'url',
      'r', // redirect handler
    );
  }
}
