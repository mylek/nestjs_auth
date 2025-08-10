import { Role } from '../../auth/enums/role.enum';
import { IsString, IsEnum, IsNotEmpty, IsEmail } from 'class-validator';

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

  info: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    address?: string;
  };
  role: Role;
}
