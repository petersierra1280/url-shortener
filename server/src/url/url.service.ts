import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateSlugDto } from './dto/update-slug.dto';
import { generateSlug } from './url.utils';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateUrlDto) {
    const slug = dto.slug || generateSlug();

    const exists = await this.prisma.url.findUnique({ where: { slug } });
    if (exists) {
      throw new ConflictException('Slug already in use');
    }

    try {
      new URL(dto.originalUrl);
    } catch {
      throw new ConflictException('Invalid URL');
    }

    const parsedUrl = new URL(dto.originalUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new ConflictException('Only http and https protocols are supported');
    }

    return this.prisma.url.create({
      data: {
        slug,
        originalUrl: dto.originalUrl,
        userId,
      },
    });
  }

  async findBySlug(slug: string, meta?: { ip?: string; userAgent?: string }) {
    const url = await this.prisma.url.findUnique({
      where: { slug },
    });

    if (!url) throw new NotFoundException('Short URL not found');

    // Increment visit count
    await this.prisma.url.update({
      where: { slug },
      data: { visitCount: { increment: 1 } },
    });

    // Log visit
    await this.prisma.visit.create({
      data: {
        urlId: url.id,
        ip: meta?.ip || null,
        userAgent: meta?.userAgent || null,
        userId: null,
      },
    });

    return url.originalUrl;
  }

  async updateSlug(userId: string, oldSlug: string, dto: UpdateSlugDto) {
    const existing = await this.prisma.url.findUnique({ where: { slug: dto.newSlug } });
    if (existing) throw new ConflictException('New slug is already taken');

    const url = await this.prisma.url.findUnique({ where: { slug: oldSlug } });
    if (!url || url.userId !== userId) throw new NotFoundException('URL not found or forbidden');

    return this.prisma.url.update({
      where: { slug: oldSlug },
      data: { slug: dto.newSlug },
    });
  }
}
