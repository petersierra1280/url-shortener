import { Module } from '@nestjs/common';
import { UserController, DashboardController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, DashboardController],
  providers: [UserService],
})
export class UserModule {}
