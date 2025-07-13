import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ECarSize } from '../enums/car.enum';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsEnum(ECarSize)
  @IsNotEmpty()
  size: ECarSize;
}
