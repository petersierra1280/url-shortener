import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateSlugDto } from './dto/update-slug.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { Delete } from '@nestjs/common';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateUrlDto) {
    return this.urlService.create(req.user['sub'], dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':slug')
  updateSlug(@Req() req: RequestWithUser, @Param('slug') slug: string, @Body() dto: UpdateSlugDto) {
    return this.urlService.updateSlug(req.user['sub'], slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug/visits')
  getVisits(@Req() req: RequestWithUser, @Param('slug') slug: string) {
    return this.urlService.getVisitsBySlug(req.user.sub, slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug/stats')
  getStats(@Req() req: RequestWithUser, @Param('slug') slug: string) {
    return this.urlService.getUrlStats(req.user.sub, slug);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  deleteUrl(@Req() req: RequestWithUser, @Param('slug') slug: string) {
    return this.urlService.deleteUrl(req.user.sub, slug);
  }
}
