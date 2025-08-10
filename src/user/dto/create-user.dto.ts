import { Role } from '../../auth/enums/role.enum';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  info?: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    address?: string;
  };
  @IsOptional()
  role: Role;
}
