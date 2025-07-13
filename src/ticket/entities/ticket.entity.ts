import { CarEntity } from '../../car/entities/car.entity';
import { ParkingSlotEntity } from '../../parking-slot/entities/parking-slot.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ticket')
export class TicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parking_slot_id', type: 'int' })
  parkingSlotId: number;

  @Column({ name: 'car_id', type: 'int' })
  carId: number;

  @Column({
    name: 'entry_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  entryTime: Date;

  @Column({
    name: 'exit_time',
    type: 'timestamp',
    nullable: true,
  })
  exitTime: Date;

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

  @ManyToOne(() => ParkingSlotEntity, (parkingSlot) => parkingSlot.tickets)
  @JoinColumn({ name: 'parking_slot_id', referencedColumnName: 'id' })
  parkingSlot: ParkingSlotEntity;

  @ManyToOne(() => CarEntity, (car) => car.tickets)
  @JoinColumn({ name: 'car_id', referencedColumnName: 'id' })
  car: CarEntity;
}
