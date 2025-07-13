import { registerAs } from '@nestjs/config';
import { ActivityLogEntity } from '../activity-log/entities/activity-log.entity';
import { AdminUserEntity } from '../admin-user/entities/admin-user.entity';
import { CarEntity } from '../car/entities/car.entity';
import { ParkingLotEntity } from '../parking-lot/entities/parking-lot.entity';
import { ParkingSlotEntity } from '../parking-slot/entities/parking-slot.entity';
import { TicketEntity } from '../ticket/entities/ticket.entity';

export default registerAs('database', () => ({
  type: process.env.TYPEORM_CONNECTION || 'mysql',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: process.env.TYPEORM_PORT || 3306,
  username: process.env.TYPEORM_USERNAME || 'devuser',
  password: process.env.TYPEORM_PASSWORD || 'devpassword',
  database: process.env.TYPEORM_DATABASE || 'dev',
  logger: process.env.TYPEORM_LOGGER || 'file',
  logging: process.env.TYPEORM_LOGGING === 'true' || 'query',
  entities: [
    ActivityLogEntity,
    AdminUserEntity,
    CarEntity,
    ParkingLotEntity,
    ParkingSlotEntity,
    TicketEntity,
  ],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  ssl: process.env.TYPEORM_SSL === 'true',
  schema: process.env.TYPEORM_SCHEMA,
}));
