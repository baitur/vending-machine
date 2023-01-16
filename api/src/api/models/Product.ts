import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '@api/models/User';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column()
  cost: number;

  @Column()
  amountAvailable: number;

  @Column({ name: 'owner_id', type: 'bigint' })
  ownerId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  @Exclude()
  deletedAt: Date;
}
