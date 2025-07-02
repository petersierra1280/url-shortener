import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitInfo {
  count: number;
  expiresAt: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

const ipTracker = new Map<string, RateLimitInfo>();

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    const now = Date.now();
    const record = ipTracker.get(ip);

    if (record && record.expiresAt > now) {
      if (record.count >= MAX_REQUESTS) {
        throw new HttpException(
          'Rate limit exceeded. Try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      record.count++;
    } else {
      ipTracker.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    }

    next();
  }
}
