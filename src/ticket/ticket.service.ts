import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTicketDto,
  getRegistrationDataList,
  LeaveParkingDTO,
} from './dto/ticket.dto';
import { TicketRepository } from './repositories/ticket.repository';
import { IsNull } from 'typeorm';
import { CarService } from '../car/car.service';
import { CarRepository } from '../car/repositories/car.repository';
import { ParkingLotRepository } from '../parking-lot/repositories/parking-lot.repository';
import { ParkingSlotRepository } from '../parking-slot/repositories/parking-slot.repository';
import { ParkingLotEntity } from '../parking-lot/entities/parking-lot.entity';
import { ParkingSlotEntity } from '../parking-slot/entities/parking-slot.entity';
import { CarEntity } from '../car/entities/car.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TicketEntity } from './entities/ticket.entity';
@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);
  constructor(
    private readonly carService: CarService,
    private readonly configService: ConfigService,
    private readonly carRepository: CarRepository,
    private readonly activityService: ActivityLogService,
    private readonly ticketRepository: TicketRepository,
    private readonly parkingLotRepository: ParkingLotRepository,
    private readonly parkingSlotRepository: ParkingSlotRepository,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    try {
      await this.validateTicketCreation(createTicketDto);

      const parkingLot = await this.getParkingLot(createTicketDto.parkingLotId);
      const availableSlot = await this.getAvailableSlot(
        createTicketDto.parkingLotId,
      );

      let car = await this.carRepository.findOneByWhere({
        plateNumber: createTicketDto.plateNumber,
      });
      if (!car) {
        car = await this.carService.createCar({
          plateNumber: createTicketDto.plateNumber,
          size: createTicketDto.size,
        });
      }
      const ticket = await this.executeTicketCreation(
        createTicketDto,
        parkingLot,
        availableSlot,
        car,
      );
      const ticketData = {
        id: ticket.id,
        plateNumber: car.plateNumber,
        size: car.size,
        slotNumber: availableSlot.slotNumber,
      };
      const ticketToken = jwt.sign(
        ticketData,
        this.configService.get<string>('ticket.ticketSecret'),
      );

      await this.activityService.createActivityLog({
        action: EActivityLogAction.CREATE_TICKET,
        carId: car.id,
      });
      return { ticketData, ticketToken };
    } catch (error) {
      this.logger.error(
        {
          method: 'createTicket',
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

  async validateTicketCreation(
    createTicketDto: CreateTicketDto,
  ): Promise<void> {
    try {
      const existingTicket = await this.ticketRepository.findOneRelationByWhere(
        {
          car: { plateNumber: createTicketDto.plateNumber },
          exitTime: IsNull(),
        },
        { car: true },
      );

      if (existingTicket) {
        throw new BadRequestException('Car is already parked');
      }
    } catch (error) {
      this.logger.error(
        {
          method: 'validateTicketCreation',
          message: error.message,
        },
        error.stack,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async getParkingLot(parkingLotId: number) {
    try {
      const parkingLot = await this.parkingLotRepository.findOneByWhere({
        id: parkingLotId,
      });

      if (!parkingLot) {
        throw new NotFoundException('Parking lot not found');
      }

      if (parkingLot.availableSlot === 0) {
        throw new BadRequestException('Parking lot is full');
      }

      return parkingLot;
    } catch (error) {
      this.logger.error(
        {
          method: 'getParkingLot',
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

      throw error;
    }
  }

  private async getAvailableSlot(parkingLotId: number) {
    const parkingSlot = await this.parkingSlotRepository.findOneByWhereAndOrder(
      {
        parkingLotId,
        isParking: false,
      },
      { distanceFromEntry: 'ASC' },
    );

    if (!parkingSlot) {
      throw new BadRequestException('No available parking slot found');
    }

    return parkingSlot;
  }

  private async executeTicketCreation(
    createTicketDto: CreateTicketDto,
    parkingLot: ParkingLotEntity,
    availableSlot: ParkingSlotEntity,
    car: CarEntity,
  ): Promise<TicketEntity> {
    try {
      const result = await this.ticketRepository.createEntity({
        ...createTicketDto,
        parkingSlotId: availableSlot.id,
        carId: car.id,
      });
      await this.parkingSlotRepository.updateEntity(
        { id: availableSlot.id },
        { isParking: true },
      );
      await this.parkingLotRepository.updateEntity(
        { id: parkingLot.id },
        {
          availableSlot: parkingLot.availableSlot - 1,
        },
      );
      return result;
    } catch (error) {
      this.logger.error(
        {
          method: 'executeTicketCreation',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }

  async leaveParking(leaveParkingDto: LeaveParkingDTO) {
    try {
      const ticket = await this.ticketRepository.findOneRelationByWhere(
        {
          id: leaveParkingDto.id,
          car: { plateNumber: leaveParkingDto.plateNumber },
          exitTime: IsNull(),
        },
        {
          car: true,
          parkingSlot: {
            parkingLot: true,
          },
        },
      );
      if (!ticket) {
        throw new NotFoundException(
          'Ticket or car not found or already exited',
        );
      }
      await this.ticketRepository.updateEntity(
        { id: leaveParkingDto.id },
        {
          exitTime: new Date(),
        },
      );
      await this.parkingSlotRepository.updateEntity(
        { id: ticket.parkingSlotId },
        { isParking: false },
      );
      await this.parkingLotRepository.updateEntity(
        { id: ticket.parkingSlot.parkingLot.id },
        {
          availableSlot: ticket.parkingSlot.parkingLot.availableSlot + 1,
        },
      );
      await this.activityService.createActivityLog({
        action: EActivityLogAction.LEAVE_PARKING,
        carId: ticket.car.id,
      });
      return 'Car has left the parking successfully';
    } catch (error) {
      this.logger.error(
        {
          method: 'createTicket',
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

  async getRegistrationPlateNumberList(
    query: getRegistrationDataList,
  ): Promise<string[]> {
    try {
      const parkingLot = await this.parkingLotRepository.findOneByWhere({
        id: query.parkingLotId,
      });
      if (!parkingLot) {
        throw new NotFoundException('Parking lot not found');
      }
      const result = await this.carRepository.findAndRelationByWhere(
        {
          size: query.carSize,
          tickets: {
            exitTime: IsNull(),
            parkingSlot: {
              parkingLotId: query.parkingLotId,
            },
          },
        },
        {
          tickets: {
            parkingSlot: {
              parkingLot: true,
            },
          },
        },
      );
      const plateNumberList = result.map((car) => car.plateNumber);
      return plateNumberList;
    } catch (error) {
      this.logger.error(
        {
          method: 'getRegistrationPlateNumberList',
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

  async getRegistrationAllocatedSlotNumberList(
    query: getRegistrationDataList,
  ): Promise<string[]> {
    try {
      const parkingLot = await this.parkingLotRepository.findOneByWhere({
        id: query.parkingLotId,
      });
      if (!parkingLot) {
        throw new NotFoundException('Parking lot not found');
      }
      const result = await this.parkingSlotRepository.findAndRelationByWhere(
        {
          parkingLotId: query.parkingLotId,
          isParking: true,
          tickets: {
            car: { size: query.carSize },
            exitTime: IsNull(),
          },
        },
        {
          tickets: {
            car: true,
          },
        },
      );
      const slotNumberList = result.map(
        (parkingSlot) => parkingSlot.slotNumber,
      );
      return slotNumberList;
    } catch (error) {
      this.logger.error(
        {
          method: 'getRegistrationAllocatedSlotNumberList',
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
