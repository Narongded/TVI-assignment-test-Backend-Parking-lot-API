import { ECarSize } from '../../car/enums/car.enum';

export interface ITicketBody {
  id: number;
  plateNumber: string;
  size: ECarSize;
  slotNumber: string;
}
