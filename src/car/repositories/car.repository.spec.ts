import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../../common/unit-test/common.interface';
import { CarRepository } from './car.repository';
import { CarEntity } from '../entities/car.entity';
import { ECarSize } from '../enums/car.enum';
import { FindOptionsWhere } from 'typeorm';

describe('CarRepository', () => {
  let service: CarRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarRepository,
        {
          provide: getRepositoryToken(CarEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CarRepository>(CarRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEntity', () => {
    it('should create a new car entity', async () => {
      const createBody = {
        plateNumber: 'ABC123',
        size: ECarSize.MEDIUM,
      };
      const mockSaveData = {
        id: 1,
        ...createBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.create.mockReturnValue(mockSaveData);
      mockRepository.save.mockResolvedValue(mockSaveData);

      const result = await service.createEntity(createBody);
      expect(mockRepository.create).toHaveBeenCalledWith(createBody);
      expect(mockRepository.save).toHaveBeenCalledWith(mockSaveData);
      expect(result).toEqual(mockSaveData);
    });
    it('should throw an error if save fails', async () => {
      const createBody = {
        plateNumber: 'ABC123',
        size: ECarSize.MEDIUM,
      };
      const throwError = new Error('save failed');
      mockRepository.create.mockReturnValue(createBody);
      mockRepository.save.mockRejectedValue(throwError);

      await expect(service.createEntity(createBody)).rejects.toThrow(
        throwError,
      );
    });
  });

  describe('findOneByWhere', () => {
    it('should return car entity', async () => {
      const mockCarSize = ECarSize.MEDIUM;
      const mockWhere: FindOptionsWhere<CarEntity> = {
        size: mockCarSize,
      };
      const mockFindOne: Partial<CarEntity> = {
        id: 1,
        size: mockCarSize,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.findOne.mockResolvedValue(mockFindOne);
      const result = await service.findOneByWhere(mockWhere);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: mockWhere,
      });
      expect(result).toEqual(mockFindOne);
    });
    it('should throw an error if findOne fails', async () => {
      const mockWhere: FindOptionsWhere<CarEntity> = {
        size: ECarSize.SMALL,
      };
      const throwError = new Error('findOne failed');
      mockRepository.findOne.mockRejectedValue(throwError);
      await expect(service.findOneByWhere(mockWhere)).rejects.toThrow(
        throwError,
      );
    });
  });
});
