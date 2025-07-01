import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{4,20}$/)
  slug?: string;
}
