import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserEntity } from '../entities/admin-user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class AdminUserRepository {
  private readonly logger = new Logger(AdminUserRepository.name);
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly repository: Repository<AdminUserEntity>,
  ) {}

  async findOneByWhere(
    where: FindOptionsWhere<AdminUserEntity>,
  ): Promise<AdminUserEntity> {
    try {
      const result = await this.repository.findOne({ where });
      return result;
    } catch (error) {
      this.logger.error(
        {
          method: 'findOneByWhere',
          message: error.message,
        },
        error.stack,
      );
      throw error;
    }
  }
}
