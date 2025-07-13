import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLotService } from './parking-lot.service';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import { InternalServerErrorException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ParkingLotRepository } from './repositories/parking-lot.repository';
import { ParkingLotEntity } from './entities/parking-lot.entity';

describe('ParkingLotService', () => {
  let service: ParkingLotService;
  let mockParkingLotRepository: Partial<jest.Mocked<ParkingLotRepository>>;
  let mockActivityLogService: Partial<jest.Mocked<ActivityLogService>>;
  let mockClsService: Partial<jest.Mocked<ClsService>>;

  beforeEach(async () => {
    mockParkingLotRepository = {
      createEntity: jest.fn(),
      findOneAndSelectByWhere: jest.fn(),
    };
    mockActivityLogService = {
      createActivityLog: jest.fn(),
    };
    mockClsService = {
      get: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingLotService,
        {
          provide: 'ParkingLotRepository',
          useValue: mockParkingLotRepository,
        },
        {
          provide: 'ActivityLogService',
          useValue: mockActivityLogService,
        },
        {
          provide: 'ClsService',
          useValue: mockClsService,
        },
      ],
    }).compile();

    service = module.get<ParkingLotService>(ParkingLotService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createParkingLot', () => {
    it('should create a new parking lot', async () => {
      const createBody = {
        name: 'Main Parking Lot',
        totalSlot: 100,
      };
      const mockClsUser = {
        sub: 5,
      };
      const mockCreateData = {
        ...createBody,
        createdBy: mockClsUser.sub,
        availableSlot: 0,
      };
      const mockSaveData: ParkingLotEntity = {
        id: 1,
        ...createBody,
        createdAt: new Date(),
        updatedAt: new Date(),
        availableSlot: createBody.totalSlot,
        createdBy: mockClsUser.sub,
        parkingSlot: [],
        adminUser: null,
      };
      const mockCreateActivityLogBody = {
        adminUserId: mockClsUser.sub,
        action: EActivityLogAction.CREATE_PARKING_LOT,
      };

      mockClsService.get.mockReturnValue({
        user: mockClsUser,
      });
      mockParkingLotRepository.createEntity.mockResolvedValue(mockSaveData);

      const result = await service.createParkingLot(createBody);
      expect(mockActivityLogService.createActivityLog).toHaveBeenCalledWith(
        mockCreateActivityLogBody,
      );
      expect(mockParkingLotRepository.createEntity).toHaveBeenCalledWith(
        mockCreateData,
      );
      expect(result).toEqual(mockSaveData);
    });
    it('should throw an error if createEntity fails', async () => {
      const createBody = {
        name: 'Main Parking Lot',
        totalSlot: 100,
      };
      const throwError = new InternalServerErrorException();
      mockClsService.get.mockReturnValue({
        user: {
          sub: 1,
        },
      });
      mockParkingLotRepository.createEntity.mockRejectedValue(throwError);

      await expect(service.createParkingLot(createBody)).rejects.toThrow(
        throwError,
      );
    });
  });

  describe('getStatus', () => {
    it('should return parking lot status', async () => {
      const mockId = 1;
      const mockParkingLot: ParkingLotEntity = {
        id: mockId,
        name: 'Main Parking Lot',
        totalSlot: 100,
        availableSlot: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        parkingSlot: [],
        adminUser: null,
      };
      mockParkingLotRepository.findOneAndSelectByWhere.mockResolvedValue(
        mockParkingLot,
      );

      const result = await service.getStatus(mockId);
      expect(
        mockParkingLotRepository.findOneAndSelectByWhere,
      ).toHaveBeenCalledWith(
        { id: mockId },
        { availableSlot: true, totalSlot: true },
      );
      expect(result).toEqual(mockParkingLot);
    });

    it('should throw NotFoundException if parking lot does not exist', async () => {
      const mockId = 1;
      mockParkingLotRepository.findOneAndSelectByWhere.mockResolvedValue(null);

      await expect(service.getStatus(mockId)).rejects.toThrow(
        'Parking lot not found',
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const mockId = 1;
      const throwError = new Error('Database error');
      mockParkingLotRepository.findOneAndSelectByWhere.mockRejectedValue(
        throwError,
      );

      await expect(service.getStatus(mockId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
