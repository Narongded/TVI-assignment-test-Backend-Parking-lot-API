import { AdminUserEntity } from '../../admin-user/entities/admin-user.entity';
import { CarEntity } from '../../car/entities/car.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity_log')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'car_id', type: 'int', nullable: true })
  carId: number;

  @Column({ name: 'admin_user_id', type: 'int', nullable: true })
  adminUserId: number;

  @Column({ name: 'action', type: 'varchar', length: 50 })
  action: string;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => CarEntity, (car) => car.activityLog)
  @JoinColumn({ name: 'car_id', referencedColumnName: 'id' })
  car: CarEntity;

  @ManyToOne(() => AdminUserEntity, (adminUser) => adminUser.activityLog)
  @JoinColumn({ name: 'admin_user_id', referencedColumnName: 'id' })
  adminUser: AdminUserEntity;
}
