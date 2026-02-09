import { IsEmail, IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];
}

export class ChangeRoleDto {
  @IsEnum(Role)
  role: Role;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class AdminResetPasswordDto {
  @IsString()
  newPassword: string;
}
