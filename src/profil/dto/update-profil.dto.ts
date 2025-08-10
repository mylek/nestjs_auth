import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class InfoDto {
  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  avatar?: string;
}

export class ImageDto {
  @IsString()
  fileName?: string;

  @IsString()
  base64?: string;
}

export class UpdateProfilDto {
  @ValidateNested()
  @Type(() => InfoDto)
  info: InfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageDto)
  image?: ImageDto;
}
