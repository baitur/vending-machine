import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '@api/models/User';
import { Product } from '@api/models/Product';

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'buyer_id' })
  buyerId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @Column({ name: 'product_id' })
  productId: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  cost: number;

  @Column()
  amountAvailable: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  @Exclude()
  deletedAt: Date;
}
