import { IsIn, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class DepositRequest {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsIn([5, 10, 20, 50, 100])
  coin: number;
}
