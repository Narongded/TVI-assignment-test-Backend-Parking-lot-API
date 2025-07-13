import { AdminUserEntity } from '../../admin-user/entities/admin-user.entity';
import { ParkingSlotEntity } from '../../parking-slot/entities/parking-slot.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('parking_lot')
export class ParkingLotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'total_slot', type: 'int' })
  totalSlot: number;

  @Column({ name: 'available_slot', type: 'int' })
  availableSlot: number;

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

  @OneToMany(() => ParkingSlotEntity, (parkingSlot) => parkingSlot.parkingLot)
  parkingSlot: ParkingSlotEntity[];

  @ManyToOne(() => AdminUserEntity, (adminUser) => adminUser.parkingLot)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  adminUser: AdminUserEntity;
}
