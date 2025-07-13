import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './car.service';
import { CarRepository } from './repositories/car.repository';
import { CarEntity } from './entities/car.entity';
import { ECarSize } from './enums/car.enum';

describe('CarService', () => {
  let service: CarService;
  let mockCarRepository: Partial<jest.Mocked<CarRepository>>;

  beforeEach(async () => {
    mockCarRepository = {
      createEntity: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: CarRepository,
          useValue: mockCarRepository,
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCar', () => {
    it('should create a new car', async () => {
      const createCarDto = { plateNumber: 'ABC123', size: ECarSize.MEDIUM };
      const mockSaveData: CarEntity = {
        id: 1,
        ...createCarDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        tickets: [],
        activityLog: [],
      };
      mockCarRepository.createEntity.mockResolvedValue(mockSaveData);

      const result = await service.createCar(createCarDto);
      expect(mockCarRepository.createEntity).toHaveBeenCalledWith(createCarDto);
      expect(result).toEqual(mockSaveData);
    });

    it('should throw an error if create fails', async () => {
      const createCarDto = { plateNumber: 'ABC123', size: ECarSize.MEDIUM };
      const throwError = new Error('create failed');
      mockCarRepository.createEntity.mockRejectedValue(throwError);

      await expect(service.createCar(createCarDto)).rejects.toThrow(throwError);
    });
  });
});
