import { IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from 'class-validator';

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
  cost: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  amountAvailable: string;
}
