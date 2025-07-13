import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserEntity } from './entities/admin-user.entity';
import { AdminUserRepository } from './repositories/admin-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [AdminUserRepository],
  exports: [AdminUserRepository],
})
export class AdminUserModule {}
