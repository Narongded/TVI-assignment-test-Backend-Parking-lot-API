import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserRepository } from './admin-user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../../common/unit-test/common.interface';
import { FindOptionsWhere } from 'typeorm';
import { AdminUserEntity } from '../entities/admin-user.entity';

describe('AdminUserRepository', () => {
  let service: AdminUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUserRepository,
        {
          provide: getRepositoryToken(AdminUserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AdminUserRepository>(AdminUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findOneByWhere', () => {
    it('should return admin user entity', async () => {
      const email = 'test@email.com';
      const where: FindOptionsWhere<AdminUserEntity> = {
        email,
      };
      const mockFindOne = {
        id: 1,
        email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.findOne.mockResolvedValue(mockFindOne);
      const result = await service.findOneByWhere(where);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where,
      });
      expect(result).toEqual(mockFindOne);
    });
    it('should throw an error if findOne fails', async () => {
      const where: FindOptionsWhere<AdminUserEntity> = {
        email: '',
      };
      const throwError = new Error('findOne failed');
      mockRepository.findOne.mockRejectedValue(throwError);
      await expect(service.findOneByWhere(where)).rejects.toThrow(throwError);
    });
  });
});
