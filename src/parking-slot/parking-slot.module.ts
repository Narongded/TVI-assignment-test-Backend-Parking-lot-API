import { Module } from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotController } from './parking-slot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotEntity } from './entities/parking-slot.entity';
import { ParkingSlotRepository } from './repositories/parking-slot.repository';
import { ParkingLotModule } from '../parking-lot/parking-lot.module';

@Module({
  imports: [ParkingLotModule, TypeOrmModule.forFeature([ParkingSlotEntity])],
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService, ParkingSlotRepository],
  exports: [ParkingSlotRepository],
})
export class ParkingSlotModule {}
