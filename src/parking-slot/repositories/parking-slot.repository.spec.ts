import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../../common/unit-test/common.interface';
import { ParkingSlotRepository } from './parking-slot.repository';
import { ParkingSlotEntity } from '../entities/parking-slot.entity';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

describe('ParkingSlotRepository', () => {
  let service: ParkingSlotRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingSlotRepository,
        {
          provide: getRepositoryToken(ParkingSlotEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ParkingSlotRepository>(ParkingSlotRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEntity', () => {
    it('should create a new parking slot entity', async () => {
      const createBody = {
        slotNumber: 'A01',
        isParking: false,
        parkingLotId: 1,
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
      expect(mockRepository.create).toHaveBeenCalledWith(createBody);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCreateData);
      expect(result).toEqual(mockSaveData);
    });

    it('should throw an error if save fails', async () => {
      const createBody = {
        slotNumber: 'A01',
        isOccupied: false,
        parkingLotId: 1,
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
    it('should update a parking slot entity', async () => {
      const mockUpdateBy: FindOptionsWhere<ParkingSlotEntity> = { id: 1 };
      const mockUpdateData = { isParking: true };
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
      const mockUpdateBy: FindOptionsWhere<ParkingSlotEntity> = { id: 1 };
      const mockUpdateData = { isParking: true };
      const throwError = new Error('update failed');
      mockRepository.update.mockRejectedValue(throwError);

      await expect(
        service.updateEntity(mockUpdateBy, mockUpdateData),
      ).rejects.toThrow(throwError);
    });
  });

  describe('findOneByWhere', () => {
    it('should find a parking slot entity by where condition', async () => {
      const mockWhere: FindOptionsWhere<ParkingSlotEntity> = { id: 1 };
      const mockFindResult = {
        id: 1,
        slotNumber: 'A01',
        isParking: false,
        parkingLotId: 1,
      };

      mockRepository.findOne.mockResolvedValue(mockFindResult);

      const result = await service.findOneByWhere(mockWhere);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: mockWhere });
      expect(result).toEqual(mockFindResult);
    });

    it('should throw an error if find fails', async () => {
      const mockWhere: FindOptionsWhere<ParkingSlotEntity> = { id: 1 };
      const throwError = new Error('find failed');
      mockRepository.findOne.mockRejectedValue(throwError);

      await expect(service.findOneByWhere(mockWhere)).rejects.toThrow(
        throwError,
      );
    });
  });

  describe('findOneByWhereAndOrder', () => {
    it('should find a parking slot entity by where condition with order', async () => {
      const mockWhere: FindOptionsWhere<ParkingSlotEntity> = {
        parkingLotId: 1,
      };
      const mockOrder: FindOptionsOrder<ParkingSlotEntity> = {
        slotNumber: 'ASC',
      };
      const mockFindResult = {
        id: 1,
        slotNumber: 'A01',
        isParking: false,
        parkingLotId: 1,
      };

      mockRepository.findOne.mockResolvedValue(mockFindResult);

      const result = await service.findOneByWhereAndOrder(mockWhere, mockOrder);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: mockWhere,
        order: mockOrder,
      });
      expect(result).toEqual(mockFindResult);
    });

    it('should throw an error if find with order fails', async () => {
      const mockWhere: FindOptionsWhere<ParkingSlotEntity> = {
        parkingLotId: 1,
      };
      const mockOrder: FindOptionsOrder<ParkingSlotEntity> = {
        slotNumber: 'ASC',
      };
      const throwError = new Error('find with order failed');
      mockRepository.findOne.mockRejectedValue(throwError);

      await expect(
        service.findOneByWhereAndOrder(mockWhere, mockOrder),
      ).rejects.toThrow(throwError);
    });
  });

  describe('findAndRelationByWhere', () => {
    it('should find parking slot entities with relations by where condition', async () => {
      const mockWhere: FindOptionsWhere<ParkingSlotEntity> = {
        parkingLotId: 1,
      };
      const mockRelations: FindOptionsRelations<ParkingSlotEntity> = {
        parkingLot: true,
      };
      const mockFindResult = [
        {
          id: 1,
          slotNumber: 'A01',
          isParking: false,
          parkingLotId: 1,
          parkingLot: {
            id: 1,
            name: 'Main Parking Lot',
            capacity: 100,
          },
        },
        {
          id: 2,
          slotNumber: 'A02',
          isParking: true,
          parkingLotId: 1,
          parkingLot: {
            id: 1,
            name: 'Main Parking Lot',
            capacity: 100,
          },
        },
      ];

      mockRepository.find.mockResolvedValue(mockFindResult);

      const result = await service.findAndRelationByWhere(
        mockWhere,
        mockRelations,
      );
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: mockWhere,
        relations: mockRelations,
      });
      expect(result).toEqual(mockFindResult);
    });

    it('should throw an error if find with relations fails', async () => {
      const mockWhere: FindOptionsWhere<ParkingSlotEntity> = {
        parkingLotId: 1,
      };
      const mockRelations: FindOptionsRelations<ParkingSlotEntity> = {
        parkingLot: true,
      };
      const throwError = new Error('find with relations failed');
      mockRepository.find.mockRejectedValue(throwError);

      await expect(
        service.findAndRelationByWhere(mockWhere, mockRelations),
      ).rejects.toThrow(throwError);
    });
  });
});
