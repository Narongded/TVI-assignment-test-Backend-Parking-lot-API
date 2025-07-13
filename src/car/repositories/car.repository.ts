import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CarEntity } from '../entities/car.entity';

@Injectable()
export class CarRepository {
  private readonly logger = new Logger(CarRepository.name);
  constructor(
    @InjectRepository(CarEntity)
    private readonly repository: Repository<CarEntity>,
  ) {}

  async createEntity(car: Partial<CarEntity>): Promise<CarEntity> {
    try {
      const newActivityLog = this.repository.create(car);
      const saveData = await this.repository.save(newActivityLog);
      return saveData;
    } catch (error) {
      this.logger.error(
        {
          method: 'createEntity',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }

  async findOneByWhere(where: FindOptionsWhere<CarEntity>): Promise<CarEntity> {
    try {
      const result = await this.repository.findOne({ where });
      return result;
    } catch (error) {
      this.logger.error(
        {
          method: 'findOneByWhere',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }

  async findAndRelationByWhere(
    where: FindOptionsWhere<CarEntity>,
    relations: FindOptionsRelations<CarEntity>,
  ): Promise<CarEntity[]> {
    try {
      const result = await this.repository.find({ where, relations });
      return result;
    } catch (error) {
      this.logger.error(
        {
          method: 'findOneByWhere',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }
}
