import { Test, TestingModule } from '@nestjs/testing';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlotService } from './parking-slot.service';
import { CreateParkingSlotDto } from './dto/parking-slot.dto';

describe('ParkingSlotController', () => {
  let controller: ParkingSlotController;
  let mockParkingSlotService: Partial<jest.Mocked<ParkingSlotService>>;

  beforeEach(async () => {
    mockParkingSlotService = {
      createParkingSlot: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingSlotController],
      providers: [
        {
          provide: ParkingSlotService,
          useValue: mockParkingSlotService,
        },
      ],
    }).compile();

    controller = module.get<ParkingSlotController>(ParkingSlotController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a parking slot', async () => {
      const createParkingSlotDto: CreateParkingSlotDto = {
        slotNumber: 'A01',
        distanceFromEntry: 10,
        parkingLotId: 1,
      };

      const mockResult = {
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

      mockParkingSlotService.createParkingSlot.mockResolvedValue(mockResult);

      const result = await controller.create(createParkingSlotDto);

      expect(mockParkingSlotService.createParkingSlot).toHaveBeenCalledWith(
        createParkingSlotDto,
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle service errors', async () => {
      const createParkingSlotDto: CreateParkingSlotDto = {
        slotNumber: 'A01',
        distanceFromEntry: 10,
        parkingLotId: 1,
      };

      const error = new Error('Service error');
      mockParkingSlotService.createParkingSlot.mockRejectedValue(error);

      await expect(controller.create(createParkingSlotDto)).rejects.toThrow(
        error,
      );

      expect(mockParkingSlotService.createParkingSlot).toHaveBeenCalledWith(
        createParkingSlotDto,
      );
    });
  });
});
