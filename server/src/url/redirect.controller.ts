import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';

@Controller('r')
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    try {
      const destination = await this.urlService.findBySlug(slug);
      return res.redirect(destination);
    } catch (err) {
      throw new NotFoundException('Slug not found');
    }
  }
}
