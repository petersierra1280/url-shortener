import { IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class UpdateSlugDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Slug must be alphanumeric (4-20 chars)',
  })
  newSlug: string;
}
