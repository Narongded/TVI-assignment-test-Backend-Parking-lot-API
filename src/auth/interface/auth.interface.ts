import { AdminUserEntity } from '../../admin-user/entities/admin-user.entity';

export interface IResponseLogin {
  accessToken: string;
  user: Partial<AdminUserEntity>;
}
