import { EActivityLogAction } from '../../common/enum/common.enum';

export interface ICreateActivityLog {
  carId?: number;
  adminUserId?: number;
  action: EActivityLogAction;
}
