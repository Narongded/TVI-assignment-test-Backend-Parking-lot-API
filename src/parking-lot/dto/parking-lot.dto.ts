import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParkingLotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  totalSlot: number;
}
