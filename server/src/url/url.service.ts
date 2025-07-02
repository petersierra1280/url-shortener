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
    const url = await this.prisma.url.findUnique({ where: { slug: oldSlug } });

    if (!url || url.userId !== userId) {
      throw new NotFoundException('URL not found or access denied');
    }

    const existingSlug = await this.prisma.url.findUnique({
      where: { slug: dto.newSlug },
    });

    if (existingSlug) {
      throw new ConflictException('Slug already taken');
    }

    return this.prisma.url.update({
      where: { slug: oldSlug },
      data: { slug: dto.newSlug },
    });
  }

  async getVisitsBySlug(userId: string, slug: string) {
    const url = await this.prisma.url.findUnique({
      where: { slug },
      include: { visits: { orderBy: { createdAt: 'desc' } } },
    });

    if (!url || url.userId !== userId) {
      throw new NotFoundException('URL not found or access denied');
    }

    return url.visits;
  }

  async getUrlStats(userId: string, slug: string) {
    const url = await this.prisma.url.findUnique({
      where: { slug },
      include: {
        visits: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        },
      },
    });

    if (!url || url.userId !== userId) {
      throw new NotFoundException('URL not found or access denied');
    }

    return {
      slug: url.slug,
      originalUrl: url.originalUrl,
      visitCount: url.visitCount,
      lastVisit: url.visits[0]?.createdAt ?? null,
    };
  }

  async deleteUrl(userId: string, slug: string) {
    const url = await this.prisma.url.findUnique({
      where: { slug },
    });

    if (!url || url.userId !== userId) {
      throw new NotFoundException('URL not found or access denied');
    }

    await this.prisma.visit.deleteMany({ where: { urlId: url.id } });
    await this.prisma.url.delete({ where: { slug } });

    return { message: 'URL deleted successfully' };
  }
}
