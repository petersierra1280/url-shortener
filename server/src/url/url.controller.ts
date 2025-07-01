import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateSlugDto } from './dto/update-slug.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateUrlDto) {
    return this.urlService.create(req.user['sub'], dto);
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string) {
    const url = await this.urlService.findBySlug(slug);
    return { destination: url };
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
}
