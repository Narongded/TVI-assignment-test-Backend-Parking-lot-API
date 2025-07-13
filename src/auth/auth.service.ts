import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AdminUserRepository } from '../admin-user/repositories/admin-user.repository';
import * as bcrypt from 'bcrypt';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { JwtService } from '@nestjs/jwt';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { EActivityLogAction } from '../common/enum/activity-log.enum';
import { IResponseLogin } from './interface/auth.interface';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly activityLogService: ActivityLogService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AdminUserEntity | boolean> {
    try {
      const user = await this.adminUserRepository.findOneByWhere({
        email,
      });
      if (!user) {
        return false;
      }
      const isPasswordValid = await bcrypt.compare(password, user?.password);
      if (!isPasswordValid) {
        return false;
      }
      delete user.password;

      return user;
    } catch (error) {
      this.logger.error(
        {
          method: 'validateUser',
          message: error.message,
        },
        error.stack,
      );
      return false;
    }
  }

  async login(user: AdminUserEntity): Promise<IResponseLogin> {
    try {
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);
      await this.activityLogService.createActivityLog({
        adminUserId: user.id,
        action: EActivityLogAction.LOGIN,
      });
      return {
        accessToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } catch (error) {
      this.logger.error(
        {
          method: 'login',
          message: error.message,
        },
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
