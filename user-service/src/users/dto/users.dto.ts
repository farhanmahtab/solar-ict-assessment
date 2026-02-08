import { IsEmail, IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];
}

export class ChangeRoleDto {
  @IsEnum(Role)
  role: Role;
}
