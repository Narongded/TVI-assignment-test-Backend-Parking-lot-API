import { AdminUserEntity } from '../../admin-user/entities/admin-user.entity';
import { ParkingLotEntity } from '../../parking-lot/entities/parking-lot.entity';
import { TicketEntity } from '../../ticket/entities/ticket.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('parking_slot')
@Unique('unique_slot_per_parking_lot', ['slotNumber', 'parkingLotId'])
export class ParkingSlotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'slot_number', type: 'varchar', length: 20 })
  slotNumber: string;

  @Column({ name: 'is_parking', type: 'boolean' })
  isParking: boolean;

  @Column({ name: 'distance_from_entry', type: 'int' })
  distanceFromEntry: number;

  @Column({ name: 'parking_lot_id', type: 'int' })
  parkingLotId: number;

  @Column({ name: 'created_by', type: 'int' })
  createdBy: number;

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

  @ManyToOne(() => ParkingLotEntity, (parkingLot) => parkingLot.parkingSlot)
  @JoinColumn({ name: 'parking_lot_id', referencedColumnName: 'id' })
  parkingLot: ParkingLotEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.parkingSlot)
  tickets: TicketEntity[];

  @ManyToOne(() => AdminUserEntity, (adminUser) => adminUser.parkingSlot)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  adminUser: AdminUserEntity;
}
