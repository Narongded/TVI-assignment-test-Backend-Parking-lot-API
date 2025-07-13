import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ECarSize } from '../enums/car.enum';
import { TicketEntity } from '../../ticket/entities/ticket.entity';
import { ActivityLogEntity } from '../../activity-log/entities/activity-log.entity';

@Entity('car')
export class CarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'plate_number', unique: true, type: 'varchar', length: 20 })
  plateNumber: string;

  @Column({ name: 'size', enum: ECarSize, type: 'enum' })
  size: ECarSize;

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

  @OneToMany(() => TicketEntity, (ticket) => ticket.car)
  tickets: TicketEntity[];

  @OneToMany(() => ActivityLogEntity, (activityLog) => activityLog.car)
  activityLog: ActivityLogEntity[];
}
