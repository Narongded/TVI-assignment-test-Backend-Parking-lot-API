import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogEntity } from '../entities/activity-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityLogRepository {
  protected readonly logger = new Logger(ActivityLogRepository.name);
  constructor(
    @InjectRepository(ActivityLogEntity)
    private readonly repository: Repository<ActivityLogEntity>,
  ) {}

  async createEntity(
    activityLog: Partial<ActivityLogEntity>,
  ): Promise<ActivityLogEntity> {
    try {
      const newActivityLog = this.repository.create(activityLog);
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
}
