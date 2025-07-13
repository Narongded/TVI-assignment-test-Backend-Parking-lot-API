import { EActivityLogAction } from '../../common/enum/activity-log.enum';

export interface ICreateActivityLog {
  carId?: number;
  adminUserId?: number;
  action: EActivityLogAction;
}
