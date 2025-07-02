import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserUrlsPaginated(userId: string, limit = 20, offset = 0) {
    const [urls, total] = await this.prisma.$transaction([
      this.prisma.url.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.url.count({ where: { userId } }),
    ]);

    return {
      total,
      limit,
      offset,
      data: urls,
    };
  }

  async getTopVisitedUrls(userId: string) {
    return this.prisma.url.findMany({
      where: { userId },
      orderBy: { visitCount: 'desc' },
      take: 5,
      select: {
        slug: true,
        originalUrl: true,
        visitCount: true,
        createdAt: true,
      },
    });
  }
}
