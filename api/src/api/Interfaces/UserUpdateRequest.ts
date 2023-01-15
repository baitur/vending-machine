import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserUpdateRequest {
  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsOptional()
  firstName: string;

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  @MaxLength(191)
  @MinLength(2)
  email: string;

  @MaxLength(48)
  @MinLength(6)
  @IsString()
  @IsOptional()
  password: string;
}
