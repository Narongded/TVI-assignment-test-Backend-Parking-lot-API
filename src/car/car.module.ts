import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarEntity } from './entities/car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarRepository } from './repositories/car.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  providers: [CarService, CarRepository],
  exports: [CarService, CarRepository],
})
export class CarModule {}
