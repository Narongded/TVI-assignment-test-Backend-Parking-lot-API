import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParkingSlotDto {
  @IsString()
  @IsNotEmpty()
  slotNumber: string;

  @IsNumber()
  @IsNotEmpty()
  distanceFromEntry: number;

  @IsNumber()
  @IsNotEmpty()
  parkingLotId: number;
}
