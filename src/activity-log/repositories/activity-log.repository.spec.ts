import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogRepository } from './activity-log.repository';
import { mockRepository } from '../../common/constants/test.constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivityLogEntity } from '../entities/activity-log.entity';
import { EActivityLogAction } from '../../common/enum/activity-log.enum';

describe('ActivityLogRepository', () => {
  let service: ActivityLogRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogRepository,
        {
          provide: getRepositoryToken(ActivityLogEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ActivityLogRepository>(ActivityLogRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEntity', () => {
    it('should create a new activity log entity', async () => {
      const mockData = {
        action: EActivityLogAction.LOGIN,
        userId: 1,
        ipAddress: '0.0.0.1',
      };
      const mockCreatedEntity = {
        ...mockData,
      };

      const mockSavedEntity = {
        ...mockCreatedEntity,
        id: 1,
        createdAt: new Date(),
      };
      mockRepository.create.mockReturnValue(mockCreatedEntity);
      mockRepository.save.mockResolvedValue(mockSavedEntity);

      const result = await service.createEntity(mockData);
      expect(mockRepository.create).toHaveBeenCalledWith(mockData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCreatedEntity);
      expect(result).toEqual(mockSavedEntity);
    });
    it('should throw an error if saving fails', async () => {
      const mockData = {
        action: EActivityLogAction.LOGIN,
        userId: 1,
        ipAddress: '0.0.0.1',
      };
      const queryError = new Error('Something went wrong');
      mockRepository.create.mockReturnValue(mockData);
      mockRepository.save.mockRejectedValue(queryError);
      await expect(service.createEntity(mockData)).rejects.toThrow(queryError);
    });
  });
});
