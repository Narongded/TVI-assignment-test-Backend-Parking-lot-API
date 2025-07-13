import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { IResponseLogin } from './interface/auth.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<jest.Mocked<AuthService>>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      validateUser: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('login', () => {
    it('should return a login response', async () => {
      const mockAdminUser: Partial<AdminUserEntity> = {
        id: 1,
        email: 'test@email.com',
        firstName: 'narongded',
        lastName: 'pinprechachai',
      };
      const mockResponseLogin: IResponseLogin = {
        accessToken: 'mockAccess',
        user: mockAdminUser,
      };
      const mockReq = {
        user: mockAdminUser,
      };
      mockAuthService.login.mockResolvedValue(mockResponseLogin);
      const result = await controller.login(mockReq);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockAdminUser);
      expect(result).toEqual(mockResponseLogin);
    });
  });
});
