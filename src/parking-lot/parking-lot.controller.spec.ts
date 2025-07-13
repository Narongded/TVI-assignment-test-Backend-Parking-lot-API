import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/parking-lot.dto';
import { ParkingLotEntity } from './entities/parking-lot.entity';

describe('ParkingLotController', () => {
  let controller: ParkingLotController;
  let mockParkingLotService: Partial<jest.Mocked<ParkingLotService>>;

  beforeEach(async () => {
    mockParkingLotService = {
      createParkingLot: jest.fn(),
      getStatus: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingLotController],
      providers: [
        ParkingLotService,
        {
          provide: ParkingLotService,
          useValue: mockParkingLotService,
        },
      ],
    }).compile();

    controller = module.get<ParkingLotController>(ParkingLotController);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createParkingLot', () => {
    it('should create a new parking lot', async () => {
      const createBody: CreateParkingLotDto = {
        name: 'Main Parking Lot',
        totalSlot: 100,
      };
      const createParkingData: ParkingLotEntity = {
        id: 1,
        adminUser: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        availableSlot: createBody.totalSlot,
        createdBy: 1,
        parkingSlot: [],
        ...createBody,
      };
      mockParkingLotService.createParkingLot.mockResolvedValue({
        ...createParkingData,
      });
      const result = await controller.create(createBody);
      expect(mockParkingLotService.createParkingLot).toHaveBeenCalledWith(
        createBody,
      );
      expect(result).toEqual({ ...createParkingData });
    });
    it('should throw an error if createParkingLot fails', async () => {
      const createBody: CreateParkingLotDto = {
        name: 'Main Parking Lot',
        totalSlot: 100,
      };
      const throwError = new Error('Create parking lot failed');
      mockParkingLotService.createParkingLot.mockRejectedValue(throwError);
      await expect(controller.create(createBody)).rejects.toThrow(throwError);
    });
  });

  describe('getStatus', () => {
    it('should return the status of a parking lot', async () => {
      const mockId = 1;
      const mockStatus = { availableSlots: 50, totalSlot: 100 };
      mockParkingLotService.getStatus.mockResolvedValue(mockStatus);
      const result = await controller.getStatus(mockId);
      expect(mockParkingLotService.getStatus).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockStatus);
    });
    it('should throw an error if getStatus fails', async () => {
      const mockId = 1;
      const throwError = new Error('Parking lot not found');
      mockParkingLotService.getStatus.mockRejectedValue(throwError);
      await expect(controller.getStatus(mockId)).rejects.toThrow(throwError);
    });
  });
});
