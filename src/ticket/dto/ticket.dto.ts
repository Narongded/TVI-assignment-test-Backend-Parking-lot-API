import { ECarSize } from '../../car/enums/car.enum';
import { CreateCarDto } from '../../car/dto/car.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ITicketBody } from '../interface/ticket.interface';
import { Transform } from 'class-transformer';

export class CreateTicketDto implements CreateCarDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsEnum(ECarSize)
  @IsNotEmpty()
  size: ECarSize;

  @IsNumber()
  @IsNotEmpty()
  parkingLotId: number;
}

export class LeaveParkingDTO implements ITicketBody {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsEnum(ECarSize)
  @IsNotEmpty()
  size: ECarSize;

  @IsString()
  @IsNotEmpty()
  slotNumber: string;
}

export class getRegistrationDataList {
  @IsNotEmpty()
  @IsEnum(ECarSize)
  carSize: ECarSize;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  parkingLotId: number;
}
