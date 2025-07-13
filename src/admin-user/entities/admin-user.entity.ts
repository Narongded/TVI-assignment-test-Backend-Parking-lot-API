import { ParkingLotEntity } from '../../parking-lot/entities/parking-lot.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ParkingSlotEntity } from '../../parking-slot/entities/parking-slot.entity';
import { ActivityLogEntity } from '../../activity-log/entities/activity-log.entity';

@Entity('admin_user')
export class AdminUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ name: 'email', unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ActivityLogEntity, (activityLog) => activityLog.adminUser)
  activityLog: ActivityLogEntity[];

  @OneToMany(() => ParkingLotEntity, (parkingLot) => parkingLot.adminUser)
  parkingLot: ParkingLotEntity[];

  @OneToMany(() => ParkingSlotEntity, (parkingSlot) => parkingSlot.adminUser)
  parkingSlot: ParkingSlotEntity[];
}
