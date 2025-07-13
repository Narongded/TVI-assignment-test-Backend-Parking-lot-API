import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogRepository } from './repositories/activity-log.repository';
import { ClsService } from 'nestjs-cls';
import { EActivityLogAction } from '../common/enum/activity-log.enum';

describe('ActivityLogService', () => {
  let service: ActivityLogService;
  let mockActivityLogRepository: Partial<jest.Mocked<ActivityLogRepository>>;
  let mockClsService: Partial<jest.Mocked<ClsService>>;

  beforeEach(async () => {
    mockActivityLogRepository = {
      createEntity: jest.fn(),
    };
    mockClsService = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogService,
        {
          provide: ActivityLogRepository,
          useValue: mockActivityLogRepository,
        },
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    service = module.get<ActivityLogService>(ActivityLogService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createActivityLog', () => {
    it('should create a new activity log', async () => {
      const mockIpAddress = '0.0.0.1';
      const body = {
        action: EActivityLogAction.LOGIN,
        userId: 1,
      };
      const expectedResult = {
        id: 1,
        carId: null,
        adminUserId: body.userId,
        ...body,
        ipAddress: mockIpAddress,
        createdAt: new Date('2025-01-01'),
        car: null,
        adminUser: null,
      };
      mockClsService.get.mockReturnValue({ ipAddress: mockIpAddress });
      mockActivityLogRepository.createEntity.mockResolvedValue(expectedResult);
      const result = await service.createActivityLog(body);
      expect(mockClsService.get).toHaveBeenCalledWith();
      expect(mockActivityLogRepository.createEntity).toHaveBeenCalledWith({
        ...body,
        ipAddress: mockIpAddress,
      });
      expect(result).toEqual(expectedResult);
    });
    it('should throw an error if createEntity fails', async () => {
      const mockIpAddress = '0.0.0.1';
      const body = {
        action: EActivityLogAction.LOGIN,
        userId: 1,
      };

      const mockError = new Error('Database error');
      mockClsService.get.mockReturnValue({ ipAddress: mockIpAddress });
      mockActivityLogRepository.createEntity.mockRejectedValue(mockError);
      await expect(service.createActivityLog(body)).rejects.toThrow(mockError);
    });
  });
});
