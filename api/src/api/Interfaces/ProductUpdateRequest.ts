import { IsDivisibleBy, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class ProductUpdateRequest {
  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsOptional()
  productName: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @IsDivisibleBy(5)
  cost: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  amountAvailable: number;
}
