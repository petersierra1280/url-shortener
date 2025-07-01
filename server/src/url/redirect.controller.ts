import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { UseInterceptors } from '@nestjs/common';

@Controller('r')
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @UseInterceptors()
  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
    const originalUrl = await this.urlService.findBySlug(slug, {
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
    });
    return res.redirect(originalUrl);
  }
}
