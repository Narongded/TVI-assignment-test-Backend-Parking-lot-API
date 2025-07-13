import { Test, TestingModule } from '@nestjs/testing';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotRepository } from './repositories/parking-slot.repository';
import { ParkingLotRepository } from '../parking-lot/repositories/parking-lot.repository';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ClsService } from 'nestjs-cls';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateParkingSlotDto } from './dto/parking-slot.dto';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import { ParkingLotEntity } from '../parking-lot/entities/parking-lot.entity';

describe('ParkingSlotService', () => {
  let service: ParkingSlotService;
  let mockParkingSlotRepository: Partial<jest.Mocked<ParkingSlotRepository>>;
  let mockParkingLotRepository: Partial<jest.Mocked<ParkingLotRepository>>;
  let mockActivityLogService: Partial<jest.Mocked<ActivityLogService>>;
  let mockClsService: Partial<jest.Mocked<ClsService>>;

  beforeEach(async () => {
    mockParkingSlotRepository = {
      findOneByWhere: jest.fn(),
      createEntity: jest.fn(),
      findByWhere: jest.fn(),
    };

    mockParkingLotRepository = {
      findOneByWhere: jest.fn(),
      updateEntity: jest.fn(),
    };

    mockActivityLogService = {
      createActivityLog: jest.fn(),
    };

    mockClsService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingSlotService,
        {
          provide: ParkingSlotRepository,
          useValue: mockParkingSlotRepository,
        },
        {
          provide: ParkingLotRepository,
          useValue: mockParkingLotRepository,
        },
        {
          provide: ActivityLogService,
          useValue: mockActivityLogService,
        },
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    service = module.get<ParkingSlotService>(ParkingSlotService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createParkingSlot', () => {
    const mockCreateParkingSlotDto: CreateParkingSlotDto = {
      slotNumber: 'A01',
      distanceFromEntry: 10,
      parkingLotId: 1,
    };

    const mockUser = {
      sub: 1,
      email: 'test@email.com',
    };

    const mockParkingLot: ParkingLotEntity = {
      id: 1,
      name: 'Main Parking Lot',
      availableSlot: 99,
      parkingSlot: [],
      adminUser: null,
      totalSlot: 100,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockCreatedSlot = {
      id: 1,
      slotNumber: 'A01',
      distanceFromEntry: 10,
      parkingLotId: 1,
      isParking: false,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      parkingLot: null,
      tickets: [],
      adminUser: null,
    };
    const mockParkingSlotList = [
      {
        id: 3,
        slotNumber: 'A01',
        distanceFromEntry: 10,
        parkingLotId: 1,
        isParking: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        parkingLot: null,
        tickets: [],
        adminUser: null,
      },
      {
        id: 4,
        slotNumber: 'A01',
        distanceFromEntry: 10,
        parkingLotId: 1,
        isParking: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        parkingLot: null,
        tickets: [],
        adminUser: null,
      },
    ];

    beforeEach(() => {
      mockClsService.get.mockReturnValue({ user: mockUser });
    });

    it('should create a parking slot successfully', async () => {
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findByWhere.mockResolvedValue(
        mockParkingSlotList,
      );
      mockParkingSlotRepository.findOneByWhere.mockResolvedValue(null);
      mockParkingLotRepository.updateEntity.mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: [],
      });
      mockParkingSlotRepository.createEntity.mockResolvedValue(mockCreatedSlot);
      mockActivityLogService.createActivityLog.mockResolvedValue(undefined);

      const result = await service.createParkingSlot(mockCreateParkingSlotDto);

      expect(mockParkingLotRepository.findOneByWhere).toHaveBeenCalledWith({
        id: mockCreateParkingSlotDto.parkingLotId,
      });
      expect(mockParkingSlotRepository.findByWhere).toHaveBeenCalledWith({
        parkingLotId: mockCreateParkingSlotDto.parkingLotId,
      });
      expect(mockParkingSlotRepository.findOneByWhere).toHaveBeenCalledWith({
        slotNumber: mockCreateParkingSlotDto.slotNumber,
        parkingLotId: mockCreateParkingSlotDto.parkingLotId,
      });
      expect(mockParkingLotRepository.updateEntity).toHaveBeenCalledWith(
        { id: mockParkingLot.id },
        {
          availableSlot: mockParkingLot.availableSlot + 1,
        },
      );
      expect(mockParkingSlotRepository.createEntity).toHaveBeenCalledWith({
        ...mockCreateParkingSlotDto,
        isParking: false,
        createdBy: mockUser.sub,
      });
      expect(mockActivityLogService.createActivityLog).toHaveBeenCalledWith({
        action: EActivityLogAction.CREATE_PARKING_SLOT,
        adminUserId: mockUser.sub,
      });
      expect(result).toEqual(mockCreatedSlot);
    });

    it('should throw BadRequestException when parking lot is full', async () => {
      mockParkingLotRepository.findOneByWhere.mockResolvedValue({
        ...mockParkingLot,
        totalSlot: mockParkingSlotList.length,
      });
      mockParkingSlotRepository.findByWhere.mockResolvedValue(
        mockParkingSlotList,
      );

      await expect(
        service.createParkingSlot(mockCreateParkingSlotDto),
      ).rejects.toThrow(new BadRequestException('Parking lot is full'));

      expect(mockParkingLotRepository.findOneByWhere).toHaveBeenCalledWith({
        id: mockCreateParkingSlotDto.parkingLotId,
      });
      expect(mockParkingSlotRepository.findByWhere).toHaveBeenCalledWith({
        parkingLotId: mockCreateParkingSlotDto.parkingLotId,
      });
    });

    it('should throw NotFoundException when parking lot is not found', async () => {
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(null);

      await expect(
        service.createParkingSlot(mockCreateParkingSlotDto),
      ).rejects.toThrow(new NotFoundException('Parking lot not found'));

      expect(mockParkingLotRepository.findOneByWhere).toHaveBeenCalledWith({
        id: mockCreateParkingSlotDto.parkingLotId,
      });
      expect(mockParkingSlotRepository.findOneByWhere).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when parking slot number already exists', async () => {
      const existingSlot = {
        id: 2,
        slotNumber: 'A01',
        parkingLotId: 1,
        isParking: false,
        distanceFromEntry: 10,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        parkingLot: null,
        tickets: [],
        adminUser: null,
      } as any;

      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findOneByWhere.mockResolvedValue(existingSlot);

      await expect(
        service.createParkingSlot(mockCreateParkingSlotDto),
      ).rejects.toThrow(
        new BadRequestException('Parking slot number already exists'),
      );

      expect(mockParkingLotRepository.findOneByWhere).toHaveBeenCalledWith({
        id: mockCreateParkingSlotDto.parkingLotId,
      });
      expect(mockParkingSlotRepository.findOneByWhere).toHaveBeenCalledWith({
        slotNumber: mockCreateParkingSlotDto.slotNumber,
        parkingLotId: mockCreateParkingSlotDto.parkingLotId,
      });
      expect(mockParkingSlotRepository.createEntity).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when repository createEntity fails', async () => {
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findOneByWhere.mockResolvedValue(null);
      mockParkingSlotRepository.findByWhere.mockResolvedValue(
        mockParkingSlotList,
      );
      mockParkingSlotRepository.createEntity.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.createParkingSlot(mockCreateParkingSlotDto),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockParkingSlotRepository.createEntity).toHaveBeenCalledWith({
        ...mockCreateParkingSlotDto,
        isParking: false,
        createdBy: mockUser.sub,
      });
    });

    it('should throw InternalServerErrorException when activity log creation fails', async () => {
      mockParkingLotRepository.findOneByWhere.mockResolvedValue(mockParkingLot);
      mockParkingSlotRepository.findOneByWhere.mockResolvedValue(null);
      mockParkingSlotRepository.createEntity.mockResolvedValue(mockCreatedSlot);
      mockParkingSlotRepository.findByWhere.mockResolvedValue(
        mockParkingSlotList,
      );
      mockActivityLogService.createActivityLog.mockRejectedValue(
        new Error('Activity log error'),
      );

      await expect(
        service.createParkingSlot(mockCreateParkingSlotDto),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockActivityLogService.createActivityLog).toHaveBeenCalledWith({
        action: EActivityLogAction.CREATE_PARKING_SLOT,
        adminUserId: mockUser.sub,
      });
    });
  });
});
