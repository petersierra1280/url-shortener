import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('urls')
  getUrls(@Req() req: RequestWithUser) {
    return this.userService.getUserUrls(req.user.sub);
  }
}

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  getDashboardSummary(@Req() req: RequestWithUser) {
    return this.userService.getTopVisitedUrls(req.user.sub);
  }
}
