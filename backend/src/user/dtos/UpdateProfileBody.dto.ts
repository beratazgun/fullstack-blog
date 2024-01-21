import { IsStringOrNull } from '@src/core/decorators/IsStringOrNull';
import { ValidateIf } from 'class-validator';

export class UpdateProfileBodyDto {
  @IsStringOrNull()
  @ValidateIf((o) => o.firstName !== undefined)
  firstName: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.lastName !== undefined)
  lastName: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.bio !== undefined)
  bio: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.websiteLink !== undefined)
  websiteLink: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.facebookLink !== undefined)
  facebookLink: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.twitterLink !== undefined)
  twitterLink: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.githubLink !== undefined)
  githubLink: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.linkedinLink !== undefined)
  linkedinLink: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.instagramLink !== undefined)
  instagramLink: string | null;

  @IsStringOrNull()
  @ValidateIf((o) => o.youtubeLink !== undefined)
  youtubeLink: string | null;
}
