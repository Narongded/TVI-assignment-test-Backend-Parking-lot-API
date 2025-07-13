import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { TicketEntity } from '../entities/ticket.entity';

@Injectable()
export class TicketRepository {
  private readonly logger = new Logger(TicketRepository.name);
  constructor(
    @InjectRepository(TicketEntity)
    private readonly repository: Repository<TicketEntity>,
  ) {}

  async createEntity(ticket: Partial<TicketEntity>): Promise<TicketEntity> {
    try {
      const newActivityLog = this.repository.create(ticket);
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
    updateBy: FindOptionsWhere<TicketEntity>,
    updateData: Partial<TicketEntity>,
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
    where: FindOptionsWhere<TicketEntity>,
  ): Promise<TicketEntity> {
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
  async findOneRelationByWhere(
    where: FindOptionsWhere<TicketEntity>,
    relations: FindOptionsRelations<TicketEntity>,
  ): Promise<TicketEntity> {
    try {
      const result = await this.repository.findOne({
        where,
        relations,
      });
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
