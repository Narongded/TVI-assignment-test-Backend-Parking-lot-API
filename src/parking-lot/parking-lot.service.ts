import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateParkingLotDto } from './dto/parking-lot.dto';
import { ParkingLotRepository } from './repositories/parking-lot.repository';
import { ClsService } from 'nestjs-cls';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ParkingLotEntity } from './entities/parking-lot.entity';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import { IAppCls } from '../common/interface/common.interface';

@Injectable()
export class ParkingLotService {
  private readonly logger = new Logger(ParkingLotService.name);

  constructor(
    private readonly parkingLotRepository: ParkingLotRepository,
    private readonly activityLogService: ActivityLogService,
    private readonly cls: ClsService,
  ) {}
  async createParkingLot(
    createParkingLotDto: CreateParkingLotDto,
  ): Promise<ParkingLotEntity> {
    try {
      const clsData = this.cls.get<IAppCls>();
      const user = clsData.user;
      const result = await this.parkingLotRepository.createEntity({
        ...createParkingLotDto,
        availableSlot: createParkingLotDto.totalSlot,
        createdBy: user.sub,
      });
      await this.activityLogService.createActivityLog({
        action: EActivityLogAction.CREATE_PARKING_LOT,
        adminUserId: user.sub,
      });
      return result;
    } catch (error) {
      this.logger.error(
        {
          method: 'createParkingLot',
          message: error.message,
        },
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getStatus(id: number): Promise<Partial<ParkingLotEntity>> {
    try {
      const result = await this.parkingLotRepository.findOneAndSelectByWhere(
        { id },
        { availableSlot: true, totalSlot: true },
      );
      if (!result) {
        throw new NotFoundException('Parking lot not found');
      }
      return result;
    } catch (error) {
      this.logger.error(
        {
          method: 'getStatus',
          message: error.message,
        },
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
