import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './url/url.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UrlModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
