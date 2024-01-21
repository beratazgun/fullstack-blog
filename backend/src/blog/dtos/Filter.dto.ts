import { IsString, ValidateIf } from 'class-validator';

export class FilterDto {
  @ValidateIf((o) => o.page !== undefined)
  @IsString()
  public page?: string;

  @ValidateIf((o) => o.limit !== undefined)
  @IsString()
  public limit?: string;

  @ValidateIf((o) => o.blogCode !== undefined)
  @IsString()
  blogCode?: string;

  @ValidateIf((o) => o.userName !== undefined)
  @IsString()
  userName?: string;

  @ValidateIf((o) => o.tagSlug !== undefined)
  @IsString()
  tagSlug?: string;

  @ValidateIf((o) => o.isPublished !== undefined)
  @IsString()
  isPublished?: string;

  @ValidateIf((o) => o.isDeleted !== undefined)
  @IsString()
  isDeleted?: string;
}
