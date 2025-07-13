import { Injectable, Logger } from '@nestjs/common';
import { CreateCarDto } from './dto/car.dto';
import { CarRepository } from './repositories/car.repository';

@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);

  constructor(private readonly carRepository: CarRepository) {}

  async createCar(createCarDto: CreateCarDto) {
    try {
      const createBody = {
        ...createCarDto,
      };
      const saveData = await this.carRepository.createEntity(createBody);
      return saveData;
    } catch (error) {
      this.logger.error(
        {
          method: 'createCar',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }
}
