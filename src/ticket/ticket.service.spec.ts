import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from './repositories/ticket.repository';
import { CarService } from '../car/car.service';
import { CarRepository } from '../car/repositories/car.repository';
import { ParkingLotRepository } from '../parking-lot/repositories/parking-lot.repository';
import { ParkingSlotRepository } from '../parking-slot/repositories/parking-slot.repository';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTicketDto, LeaveParkingDTO } from './dto/ticket.dto';
import { ECarSize } from '../car/enums/car.enum';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import { IsNull } from 'typeorm';

describe('TicketService', () => {
  let service: TicketService;
  let mockTicketRepository: Partial<jest.Mocked<TicketRepository>>;
  let mockCarService: Partial<jest.Mocked<CarService>>;
  let mockCarRepository: Partial<jest.Mocked<CarRepository>>;
  let mockParkingLotRepository: Partial<jest.Mocked<ParkingLotRepository>>;
  let mockParkingSlotRepository: Partial<jest.Mocked<ParkingSlotRepository>>;
  let mockActivityLogService: Partial<jest.Mocked<ActivityLogService>>;
  let mockConfigService: Partial<jest.Mocked<ConfigService>>;

  beforeEach(async () => {
    mockTicketRepository = {
      findOneRelationByWhere: jest.fn(),
      createEntity: jest.fn(),
      updateEntity: jest.fn(),
    };

    mockCarService = {
      createCar: jest.fn(),
    };

    mockCarRepository = {
      findOneByWhere: jest.fn(),
      findAndRelationByWhere: jest.fn(),
    };

    mockParkingLotRepository = {
      findOneByWhere: jest.fn(),
      updateEntity: jest.fn(),
    };

    mockParkingSlotRepository = {
      findOneByWhereAndOrder: jest.fn(),
      updateEntity: jest.fn(),
      findAndRelationByWhere: jest.fn(),
    };

    mockActivityLogService = {
      createActivityLog: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: TicketRepository,
          useValue: mockTicketRepository,
        },
        {
          provide: CarService,
          useValue: mockCarService,
        },
        {
          provide: CarRepository,
          useValue: mockCarRepository,
        },
        {
          provide: ParkingLotRepository,
          useValue: mockParkingLotRepository,
        },
        {
          provide: ParkingSlotRepository,
          useValue: mockParkingSlotRepository,
        },
        {
          provide: ActivityLogService,
          useValue: mockActivityLogService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTicket', () => {
    const mockCreateTicketDto: CreateTicketDto = {
      plateNumber: 'ABC-1234',
      size: ECarSize.SMALL,
      parkingLotId: 1,
    };

    const mockParkingLot = {
      id: 1,
      name: 'Main Parking Lot',
      capacity: 100,
      availableSlot: 50,
    } as any;

    const mockAvailableSlot = {
      id: 1,
      slotNumber: 'A01',
      isParking: false,
      distanceFromEntry: 10,
      parkingLotId: 1,
    } as any;

    const mockCar = {
      id: 1,
      plateNumber: 'ABC-1234',
      size: ECarSize.SMALL,
    } as any;

    const mockTicket = {
      id: 1,
      parkingLotId: 1,
      parkingSlotId: 1,
      carId: 1,
      entryTime: new Date(),
    } as any;

    beforeEach(() => {
      mockConfigService.get.mockReturnValue('test-secret');
    });

    it('should create a ticket successfully with existing car', async () => {
      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(null);
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findOneByWhereAndOrder.mockResolvedValue(
        mockAvailableSlot,
      );
      mockCarRepository.findOneByWhere.mockResolvedValue(mockCar);
      mockTicketRepository.createEntity.mockResolvedValue(mockTicket);
      mockParkingSlotRepository.updateEntity.mockResolvedValue({} as any);
      mockParkingLotRepository.updateEntity.mockResolvedValue({} as any);
      mockActivityLogService.createActivityLog.mockResolvedValue(undefined);

      const result = await service.createTicket(mockCreateTicketDto);

      expect(mockTicketRepository.findOneRelationByWhere).toHaveBeenCalledWith(
        {
          car: { plateNumber: mockCreateTicketDto.plateNumber },
          exitTime: IsNull(),
        },
        { car: true },
      );
      expect(mockParkingLotRepository.findOneByWhere).toHaveBeenCalledWith({
        id: mockCreateTicketDto.parkingLotId,
      });
      expect(
        mockParkingSlotRepository.findOneByWhereAndOrder,
      ).toHaveBeenCalledWith(
        {
          parkingLotId: mockCreateTicketDto.parkingLotId,
          isParking: false,
        },
        { distanceFromEntry: 'ASC' },
      );
      expect(mockCarRepository.findOneByWhere).toHaveBeenCalledWith({
        plateNumber: mockCreateTicketDto.plateNumber,
      });
      expect(mockCarService.createCar).not.toHaveBeenCalled();
      expect(mockTicketRepository.createEntity).toHaveBeenCalledWith({
        ...mockCreateTicketDto,
        parkingSlotId: mockAvailableSlot.id,
        carId: mockCar.id,
      });

      expect(result).toHaveProperty('ticketData');
      expect(result).toHaveProperty('ticketToken');
      expect(result.ticketData).toEqual({
        id: mockTicket.id,
        plateNumber: mockCar.plateNumber,
        size: mockCar.size,
        slotNumber: mockAvailableSlot.slotNumber,
      });
    });

    it('should create a ticket successfully with new car', async () => {
      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(null);
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findOneByWhereAndOrder.mockResolvedValue(
        mockAvailableSlot,
      );
      mockCarRepository.findOneByWhere.mockResolvedValue(null);
      mockCarService.createCar.mockResolvedValue(mockCar);
      mockTicketRepository.createEntity.mockResolvedValue(mockTicket);
      mockParkingSlotRepository.updateEntity.mockResolvedValue({} as any);
      mockParkingLotRepository.updateEntity.mockResolvedValue({} as any);
      mockActivityLogService.createActivityLog.mockResolvedValue(undefined);

      const result = await service.createTicket(mockCreateTicketDto);

      expect(mockCarService.createCar).toHaveBeenCalledWith({
        plateNumber: mockCreateTicketDto.plateNumber,
        size: mockCreateTicketDto.size,
      });

      expect(result).toHaveProperty('ticketData');
      expect(result).toHaveProperty('ticketToken');
    });

    it('should throw BadRequestException when car is already parked', async () => {
      const existingTicket = {
        id: 1,
        car: { plateNumber: 'ABC-1234' },
        exitTime: null,
      };

      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(
        existingTicket as any,
      );

      await expect(service.createTicket(mockCreateTicketDto)).rejects.toThrow(
        new BadRequestException('Car is already parked'),
      );
    });

    it('should throw NotFoundException when parking lot not found', async () => {
      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(null);
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(null);

      await expect(service.createTicket(mockCreateTicketDto)).rejects.toThrow(
        new NotFoundException('Parking lot not found'),
      );
    });

    it('should throw BadRequestException when parking lot is full', async () => {
      const fullParkingLot = { ...mockParkingLot, availableSlot: 0 };

      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(null);
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(fullParkingLot);

      await expect(service.createTicket(mockCreateTicketDto)).rejects.toThrow(
        new BadRequestException('Parking lot is full'),
      );
    });

    it('should throw BadRequestException when no available slot found', async () => {
      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(null);
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findOneByWhereAndOrder.mockResolvedValue(null);

      await expect(service.createTicket(mockCreateTicketDto)).rejects.toThrow(
        new BadRequestException('No available parking slot found'),
      );
    });
  });

  describe('leaveParking', () => {
    const mockLeaveParkingDto: LeaveParkingDTO = {
      id: 1,
      plateNumber: 'ABC-1234',
      size: ECarSize.SMALL,
      slotNumber: 'A01',
    };

    const mockTicketWithRelations = {
      id: 1,
      parkingSlotId: 1,
      car: { id: 1, plateNumber: 'ABC-1234' },
      parkingSlot: {
        id: 1,
        parkingLot: {
          id: 1,
          availableSlot: 49,
        },
      },
    } as any;

    it('should process leaving parking successfully', async () => {
      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(
        mockTicketWithRelations,
      );
      mockTicketRepository.updateEntity.mockResolvedValue({} as any);
      mockParkingSlotRepository.updateEntity.mockResolvedValue({} as any);
      mockParkingLotRepository.updateEntity.mockResolvedValue({} as any);
      mockActivityLogService.createActivityLog.mockResolvedValue(undefined);

      const result = await service.leaveParking(mockLeaveParkingDto);

      expect(mockTicketRepository.findOneRelationByWhere).toHaveBeenCalledWith(
        {
          id: mockLeaveParkingDto.id,
          car: { plateNumber: mockLeaveParkingDto.plateNumber },
          exitTime: IsNull(),
        },
        {
          car: true,
          parkingSlot: {
            parkingLot: true,
          },
        },
      );

      expect(mockTicketRepository.updateEntity).toHaveBeenCalledWith(
        { id: mockLeaveParkingDto.id },
        { exitTime: expect.any(Date) },
      );

      expect(mockParkingSlotRepository.updateEntity).toHaveBeenCalledWith(
        { id: mockTicketWithRelations.parkingSlotId },
        { isParking: false },
      );

      expect(mockParkingLotRepository.updateEntity).toHaveBeenCalledWith(
        { id: mockTicketWithRelations.parkingSlot.parkingLot.id },
        { availableSlot: 50 },
      );

      expect(mockActivityLogService.createActivityLog).toHaveBeenCalledWith({
        action: EActivityLogAction.LEAVE_PARKING,
        carId: mockTicketWithRelations.car.id,
      });

      expect(result).toBe('Car has left the parking successfully');
    });

    it('should throw NotFoundException when ticket not found', async () => {
      mockTicketRepository.findOneRelationByWhere.mockResolvedValue(null);

      await expect(service.leaveParking(mockLeaveParkingDto)).rejects.toThrow(
        new NotFoundException('Ticket or car not found or already exited'),
      );
    });
  });

  describe('getRegistrationPlateNumberList', () => {
    const mockQuery = {
      parkingLotId: 1,
      carSize: ECarSize.SMALL,
    };

    it('should return list of plate numbers successfully', async () => {
      const mockParkingLot = { id: 1, name: 'Main Parking Lot' } as any;
      const mockCars = [
        { plateNumber: 'ABC-1234' },
        { plateNumber: 'XYZ-5678' },
      ] as any[];

      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockCarRepository.findAndRelationByWhere.mockResolvedValue(mockCars);

      const result = await service.getRegistrationPlateNumberList(mockQuery);

      expect(mockParkingLotRepository.findOneByWhere).toHaveBeenCalledWith({
        id: mockQuery.parkingLotId,
      });

      expect(result).toEqual(['ABC-1234', 'XYZ-5678']);
    });

    it('should throw NotFoundException when parking lot not found', async () => {
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(null);

      await expect(
        service.getRegistrationPlateNumberList(mockQuery),
      ).rejects.toThrow(new NotFoundException('Parking lot not found'));
    });
  });

  describe('getRegistrationAllocatedSlotNumberList', () => {
    const mockQuery = {
      parkingLotId: 1,
      carSize: ECarSize.SMALL,
    };

    it('should return list of slot numbers successfully', async () => {
      const mockParkingLot = { id: 1, name: 'Main Parking Lot' } as any;
      const mockSlots = [{ slotNumber: 'A01' }, { slotNumber: 'A02' }] as any[];

      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findAndRelationByWhere.mockResolvedValue(
        mockSlots,
      );

      const result = await service.getRegistrationAllocatedSlotNumberList(
        mockQuery,
      );

      expect(mockParkingLotRepository.findOneByWhere).toHaveBeenCalledWith({
        id: mockQuery.parkingLotId,
      });

      expect(result).toEqual(['A01', 'A02']);
    });

    it('should throw NotFoundException when parking lot not found', async () => {
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(null);

      await expect(
        service.getRegistrationAllocatedSlotNumberList(mockQuery),
      ).rejects.toThrow(new NotFoundException('Parking lot not found'));
    });
  });
});
