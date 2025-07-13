import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { ParkingLotEntity } from '../entities/parking-lot.entity';

@Injectable()
export class ParkingLotRepository {
  private readonly logger = new Logger(ParkingLotRepository.name);
  constructor(
    @InjectRepository(ParkingLotEntity)
    private readonly repository: Repository<ParkingLotEntity>,
  ) {}

  async createEntity(
    parkingLot: Partial<ParkingLotEntity>,
  ): Promise<ParkingLotEntity> {
    try {
      const newActivityLog = this.repository.create(parkingLot);
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

  async updateEntity(
    updateBy: FindOptionsWhere<ParkingLotEntity>,
    updateData: Partial<ParkingLotEntity>,
  ): Promise<UpdateResult> {
    try {
      const result = await this.repository.update(updateBy, updateData);
      return result;
    } catch (error) {
      this.logger.error(
        {
          method: 'updateEntity',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }

  async findOneByWhere(
    where: FindOptionsWhere<ParkingLotEntity>,
  ): Promise<ParkingLotEntity> {
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

  async findOneAndSelectByWhere(
    where: FindOptionsWhere<ParkingLotEntity>,
    select: FindOptionsSelect<ParkingLotEntity>,
  ): Promise<ParkingLotEntity> {
    try {
      const result = await this.repository.findOne({ where, select });
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
