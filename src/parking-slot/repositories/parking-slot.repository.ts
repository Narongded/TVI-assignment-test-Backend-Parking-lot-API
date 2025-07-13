import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { ParkingSlotEntity } from '../entities/parking-slot.entity';

@Injectable()
export class ParkingSlotRepository {
  private readonly logger = new Logger(ParkingSlotRepository.name);
  constructor(
    @InjectRepository(ParkingSlotEntity)
    private readonly repository: Repository<ParkingSlotEntity>,
  ) {}

  async createEntity(
    parkingSLot: Partial<ParkingSlotEntity>,
  ): Promise<ParkingSlotEntity> {
    try {
      const newActivityLog = this.repository.create(parkingSLot);
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
    updateBy: FindOptionsWhere<ParkingSlotEntity>,
    updateData: Partial<ParkingSlotEntity>,
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
    where: FindOptionsWhere<ParkingSlotEntity>,
  ): Promise<ParkingSlotEntity> {
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

  async findOneByWhereAndOrder(
    where: FindOptionsWhere<ParkingSlotEntity>,
    order: FindOptionsOrder<ParkingSlotEntity>,
  ): Promise<ParkingSlotEntity> {
    try {
      const result = await this.repository.findOne({ where, order });
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
    where: FindOptionsWhere<ParkingSlotEntity>,
    relations: FindOptionsRelations<ParkingSlotEntity>,
  ): Promise<ParkingSlotEntity[]> {
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
