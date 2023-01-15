import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Min, MinLength } from 'class-validator';

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
  cost: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  amountAvailable: string;
}
