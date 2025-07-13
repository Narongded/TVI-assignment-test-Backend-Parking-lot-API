import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../../common/constants/test.constants';
import { FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { ParkingLotEntity } from '../entities/parking-lot.entity';
import { ParkingLotRepository } from './parking-lot.repository';

describe('ParkingLotRepository', () => {
  let service: ParkingLotRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingLotRepository,
        {
          provide: getRepositoryToken(ParkingLotEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ParkingLotRepository>(ParkingLotRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createEntity', () => {
    it('should create a new parking lot entity', async () => {
      const createBody = {
        name: 'Main Parking Lot',
        capacity: 100,
      };

      const mockCreateData = {
        ...createBody,
      };
      const mockSaveData = {
        id: 1,
        ...createBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.create.mockReturnValue(mockCreateData);
      mockRepository.save.mockResolvedValue(mockSaveData);

      const result = await service.createEntity(createBody);
      expect(mockRepository.create).toHaveBeenCalledWith(mockCreateData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCreateData);
      expect(result).toEqual(mockSaveData);
    });

    it('should throw an error if save fails', async () => {
      const createBody = {
        name: 'Main Parking Lot',
        capacity: 100,
      };
      const throwError = new Error('save failed');
      mockRepository.create.mockReturnValue(createBody);
      mockRepository.save.mockRejectedValue(throwError);

      await expect(service.createEntity(createBody)).rejects.toThrow(
        throwError,
      );
    });
  });

  describe('updateEntity', () => {
    it('should update a parking lot entity', async () => {
      const mockUpdateBy: FindOptionsWhere<ParkingLotEntity> = { id: 1 };
      const mockUpdateData = { name: 'Updated Parking Lot' };
      const mockUpdateResult = { affected: 1, generatedMaps: [], raw: [] };

      mockRepository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.updateEntity(mockUpdateBy, mockUpdateData);
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockUpdateBy,
        mockUpdateData,
      );
      expect(result).toEqual(mockUpdateResult);
    });

    it('should throw an error if update fails', async () => {
      const mockUpdateBy: FindOptionsWhere<ParkingLotEntity> = { id: 1 };
      const mockUpdateData = { name: 'Updated Parking Lot' };
      const throwError = new Error('update failed');
      mockRepository.update.mockRejectedValue(throwError);

      await expect(
        service.updateEntity(mockUpdateBy, mockUpdateData),
      ).rejects.toThrow(throwError);
    });
  });

  describe('findOneByWhere', () => {
    it('should find a parking lot entity by where condition', async () => {
      const mockWhere: FindOptionsWhere<ParkingLotEntity> = { id: 1 };
      const mockFindResult = {
        id: 1,
        name: 'Main Parking Lot',
        capacity: 100,
        availableSlot: 50,
      };

      mockRepository.findOne.mockResolvedValue(mockFindResult);

      const result = await service.findOneByWhere(mockWhere);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: mockWhere });
      expect(result).toEqual(mockFindResult);
    });

    it('should throw an error if find fails', async () => {
      const mockWhere: FindOptionsWhere<ParkingLotEntity> = { id: 1 };
      const throwError = new Error('find failed');
      mockRepository.findOne.mockRejectedValue(throwError);

      await expect(service.findOneByWhere(mockWhere)).rejects.toThrow(
        throwError,
      );
    });
  });

  describe('findOneAndSelectByWhere', () => {
    it('should find a parking lot entity with selected fields by where condition', async () => {
      const mockWhere: FindOptionsWhere<ParkingLotEntity> = { id: 1 };
      const mockSelect: FindOptionsSelect<ParkingLotEntity> = {
        id: true,
        name: true,
      };
      const mockFindResult = {
        id: 1,
        name: 'Main Parking Lot',
      };

      mockRepository.findOne.mockResolvedValue(mockFindResult);

      const result = await service.findOneAndSelectByWhere(
        mockWhere,
        mockSelect,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: mockWhere,
        select: mockSelect,
      });
      expect(result).toEqual(mockFindResult);
    });

    it('should throw an error if find with select fails', async () => {
      const mockWhere: FindOptionsWhere<ParkingLotEntity> = { id: 1 };
      const mockSelect: FindOptionsSelect<ParkingLotEntity> = {
        id: true,
        name: true,
      };
      const throwError = new Error('find with select failed');
      mockRepository.findOne.mockRejectedValue(throwError);

      await expect(
        service.findOneAndSelectByWhere(mockWhere, mockSelect),
      ).rejects.toThrow(throwError);
    });
  });
});
