import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserUpdateRequest {
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsOptional()
  firstName: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsOptional()
  password: string;
}
