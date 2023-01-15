import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserCreateRequest {
  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  @MinLength(2)
  email: string;

  @MaxLength(48)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
}
