import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BuyRequest {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  amount: number;
}
