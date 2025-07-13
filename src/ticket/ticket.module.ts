import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketRepository } from './repositories/ticket.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from './entities/ticket.entity';
import { CarModule } from '../car/car.module';
import { ParkingLotModule } from '../parking-lot/parking-lot.module';
import { ParkingSlotModule } from '../parking-slot/parking-slot.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    CarModule,
    PassportModule,
    ParkingLotModule,
    ParkingSlotModule,
    TypeOrmModule.forFeature([TicketEntity]),
  ],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
})
export class TicketModule {}
