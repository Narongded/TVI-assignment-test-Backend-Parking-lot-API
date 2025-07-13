import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotRepository } from './repositories/parking-lot.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLotEntity } from './entities/parking-lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLotEntity])],
  controllers: [ParkingLotController],
  providers: [ParkingLotService, ParkingLotRepository],
  exports: [ParkingLotRepository],
})
export class ParkingLotModule {}
