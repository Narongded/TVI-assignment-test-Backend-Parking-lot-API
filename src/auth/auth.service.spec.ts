import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AdminUserRepository } from '../admin-user/repositories/admin-user.repository';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let mockAdminUserRepository: Partial<jest.Mocked<AdminUserRepository>>;
  let mockActivityLogService: Partial<jest.Mocked<ActivityLogService>>;
  let mockJwtService: Partial<jest.Mocked<JwtService>>;
  beforeEach(async () => {
    mockAdminUserRepository = {
      findOneByWhere: jest.fn(),
    };
    mockActivityLogService = {
      createActivityLog: jest.fn(),
    };
    mockJwtService = {
      sign: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AdminUserRepository,
          useValue: mockAdminUserRepository,
        },
        {
          provide: ActivityLogService,
          useValue: mockActivityLogService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validateUser', () => {
    it('should return user if email and password are valid', async () => {
      const mockEmail = 'test@gmail.com';
      const mockPassword = 'password';
      const mockUser = {
        id: 1,
        email: mockEmail,
        password: 'hashedPassword',
        firstName: 'narongded',
        lastName: 'pinprechachai',
      } as AdminUserEntity;
      mockAdminUserRepository.findOneByWhere.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      const result = await service.validateUser(mockEmail, mockPassword);
      expect(mockAdminUserRepository.findOneByWhere).toHaveBeenCalledWith({
        email: mockEmail,
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      });
    });
    it('should return false if user not found', async () => {
      const mockEmail = 'invalidEmail@email.com';
      const password = 'password';
      mockAdminUserRepository.findOneByWhere.mockResolvedValue(null);
      mockedBcrypt.compare.mockResolvedValue(false as never);
      const result = await service.validateUser(mockEmail, password);
      expect(result).toBe(false);
    });
    it('should return false if error ', async () => {
      const mockEmail = '';
      const password = 'password';
      const thrownError = new Error('Database error');
      mockAdminUserRepository.findOneByWhere.mockRejectedValue(thrownError);
      const result = await service.validateUser(mockEmail, password);
      expect(result).toBe(false);
    });
  });
  describe('login', () => {
    it('should return access token and user info on successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        firstName: 'narongded',
        lastName: 'pinprechachai',
      } as AdminUserEntity;
      const mockAccessToken = 'mockAccessToken';
      const mockActivityLog = {
        adminUserId: mockUser.id,
        action: EActivityLogAction.LOGIN,
      };
      mockJwtService.sign.mockReturnValue(mockAccessToken);
      const result = await service.login(mockUser);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(mockActivityLogService.createActivityLog).toHaveBeenCalledWith(
        mockActivityLog,
      );
      expect(result).toEqual({
        accessToken: mockAccessToken,
        user: mockUser,
      });
    });
    it('should throw InternalServerErrorException on error', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        firstName: 'narongded',
        lastName: 'pinprechachai',
      } as AdminUserEntity;
      const mockAccessToken = 'mockAccessToken';
      const throwError = new Error('Database error');
      mockJwtService.sign.mockReturnValue(mockAccessToken);
      mockActivityLogService.createActivityLog.mockRejectedValue(throwError);
      await expect(service.login(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
