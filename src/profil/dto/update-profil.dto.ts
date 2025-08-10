import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class InfoDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  postcode: string;

  avatar?: string;
}

export class ImageDto {
  @IsString()
  fileName: string;

  @IsString()
  base64: string;
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
