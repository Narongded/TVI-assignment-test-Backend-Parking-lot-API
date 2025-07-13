import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../../common/unit-test/common.interface';
import { TicketRepository } from './ticket.repository';
import { TicketEntity } from '../entities/ticket.entity';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

describe('TicketRepository', () => {
  let service: TicketRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketRepository,
        {
          provide: getRepositoryToken(TicketEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TicketRepository>(TicketRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEntity', () => {
    it('should create a new ticket entity', async () => {
      const createBody = {
        parkingLotId: 1,
        parkingSlotId: 1,
        carId: 1,
        entryTime: new Date(),
      };

      const mockCreateData = {
        ...createBody,
      };
      const mockSaveData = {
        id: 1,
        ...createBody,
        exitTime: null,
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
        parkingLotId: 1,
        parkingSlotId: 1,
        carId: 1,
        entryTime: new Date(),
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
    it('should update a ticket entity', async () => {
      const mockUpdateBy: FindOptionsWhere<TicketEntity> = { id: 1 };
      const mockUpdateData = { exitTime: new Date() };
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
      const mockUpdateBy: FindOptionsWhere<TicketEntity> = { id: 1 };
      const mockUpdateData = { exitTime: new Date() };
      const throwError = new Error('update failed');
      mockRepository.update.mockRejectedValue(throwError);

      await expect(
        service.updateEntity(mockUpdateBy, mockUpdateData),
      ).rejects.toThrow(throwError);
    });
  });

  describe('findOneByWhere', () => {
    it('should find a ticket entity by where condition', async () => {
      const mockWhere: FindOptionsWhere<TicketEntity> = { id: 1 };
      const mockFindResult = {
        id: 1,
        parkingLotId: 1,
        parkingSlotId: 1,
        carId: 1,
        entryTime: new Date(),
        exitTime: null,
      };

      mockRepository.findOne.mockResolvedValue(mockFindResult);

      const result = await service.findOneByWhere(mockWhere);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: mockWhere });
      expect(result).toEqual(mockFindResult);
    });

    it('should throw an error if find fails', async () => {
      const mockWhere: FindOptionsWhere<TicketEntity> = { id: 1 };
      const throwError = new Error('find failed');
      mockRepository.findOne.mockRejectedValue(throwError);

      await expect(service.findOneByWhere(mockWhere)).rejects.toThrow(
        throwError,
      );
    });
  });

  describe('findOneRelationByWhere', () => {
    it('should find a ticket entity with relations by where condition', async () => {
      const mockWhere: FindOptionsWhere<TicketEntity> = { id: 1 };
      const mockRelations: FindOptionsRelations<TicketEntity> = {
        car: true,
        parkingSlot: true,
      };
      const mockFindResult = {
        id: 1,
        parkingLotId: 1,
        parkingSlotId: 1,
        carId: 1,
        entryTime: new Date(),
        exitTime: null,
        car: {
          id: 1,
          plateNumber: 'ABC-1234',
          size: 'S',
        },
        parkingSlot: {
          id: 1,
          slotNumber: 'A01',
          isParking: true,
        },
      };

      mockRepository.findOne.mockResolvedValue(mockFindResult);

      const result = await service.findOneRelationByWhere(
        mockWhere,
        mockRelations,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: mockWhere,
        relations: mockRelations,
      });
      expect(result).toEqual(mockFindResult);
    });

    it('should throw an error if find with relations fails', async () => {
      const mockWhere: FindOptionsWhere<TicketEntity> = { id: 1 };
      const mockRelations: FindOptionsRelations<TicketEntity> = {
        car: true,
        parkingSlot: true,
      };
      const throwError = new Error('find with relations failed');
      mockRepository.findOne.mockRejectedValue(throwError);

      await expect(
        service.findOneRelationByWhere(mockWhere, mockRelations),
      ).rejects.toThrow(throwError);
    });
  });
});
