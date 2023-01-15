import { IsDivisibleBy, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class ProductCreateRequest {
  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  @IsDivisibleBy(5)
  cost: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  amountAvailable: number;
}
