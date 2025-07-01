import { IsString, Matches } from 'class-validator';

export class UpdateSlugDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{4,20}$/)
  newSlug: string;
}
