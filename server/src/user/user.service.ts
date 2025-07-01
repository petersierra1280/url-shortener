import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserUrls(userId: string) {
    return this.prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
