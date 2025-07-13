import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ActivityLogRepository } from './repositories/activity-log.repository';
import { ICreateActivityLog } from './interface/activity-log.interface';
import { ActivityLogEntity } from './entities/activity-log.entity';
import { ClsService } from 'nestjs-cls';
import { IAppCls } from '../common/interface/common.interface';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);
  constructor(
    private readonly activityLogRepository: ActivityLogRepository,
    private readonly cls: ClsService,
  ) {}

  async createActivityLog(
    body: ICreateActivityLog,
  ): Promise<ActivityLogEntity> {
    try {
      const cls = this.cls.get<IAppCls>();
      const ipAddress = cls.ipAddress;
      const createBody = {
        ...body,
        ipAddress,
      };
      const saveData = await this.activityLogRepository.createEntity(
        createBody,
      );
      return saveData;
    } catch (error) {
      this.logger.error(
        {
          method: 'createActiveLog',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }
}
