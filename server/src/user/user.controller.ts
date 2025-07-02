import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('urls')
  getPaginatedUrls(
    @Req() req: RequestWithUser,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    const parsedLimit = Math.min(parseInt(limit ?? '5', 10), 100);
    const parsedOffset = parseInt(offset ?? '0', 10);

    return this.userService.getUserUrlsPaginated(
      req.user.sub,
      isNaN(parsedLimit) ? 5 : parsedLimit,
      isNaN(parsedOffset) ? 0 : parsedOffset,
    );
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
