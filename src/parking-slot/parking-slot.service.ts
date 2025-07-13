import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ParkingSlotRepository } from './repositories/parking-slot.repository';
import { ClsService } from 'nestjs-cls';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import { IAppCls } from '../common/interface/common.interface';
import { CreateParkingSlotDto } from './dto/parking-slot.dto';
import { ParkingSlotEntity } from './entities/parking-slot.entity';
import { ParkingLotRepository } from '../parking-lot/repositories/parking-lot.repository';

@Injectable()
export class ParkingSlotService {
  private readonly logger = new Logger(ParkingSlotService.name);
  constructor(
    private readonly parkingLotRepository: ParkingLotRepository,
    private readonly parkingSlotRepository: ParkingSlotRepository,
    private readonly activityLogService: ActivityLogService,
    private readonly cls: ClsService,
  ) {}
  async createParkingSlot(
    createParkingLotDto: CreateParkingSlotDto,
  ): Promise<ParkingSlotEntity> {
    try {
      const clsData = this.cls.get<IAppCls>();
      const user = clsData.user;
      const parkingLot = await this.parkingLotRepository.findOneByWhere({
        id: createParkingLotDto.parkingLotId,
      });
      if (!parkingLot) {
        throw new NotFoundException('Parking lot not found');
      }
      const existingSlot = await this.parkingSlotRepository.findOneByWhere({
        slotNumber: createParkingLotDto.slotNumber,
        parkingLotId: createParkingLotDto.parkingLotId,
      });
      if (existingSlot) {
        throw new BadRequestException('Parking slot number already exists');
      }
      const parkingSlotList = await this.parkingSlotRepository.findByWhere({
        parkingLotId: createParkingLotDto.parkingLotId,
      });

      if (parkingSlotList.length >= parkingLot.totalSlot) {
        throw new BadRequestException('Parking lot is full');
      }
      await this.parkingLotRepository.updateEntity(
        { id: parkingLot.id },
        {
          availableSlot: parkingLot.availableSlot + 1,
        },
      );
      const result = await this.parkingSlotRepository.createEntity({
        ...createParkingLotDto,
        isParking: false,
        createdBy: user.sub,
      });
      await this.activityLogService.createActivityLog({
        action: EActivityLogAction.CREATE_PARKING_SLOT,
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
