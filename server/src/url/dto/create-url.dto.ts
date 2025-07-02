import { IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'Must be a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Slug must be alphanumeric and 4-20 characters (a-z, A-Z, 0-9, _ or -)',
  })
  slug?: string;
}
