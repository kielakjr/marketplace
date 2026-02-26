import { Table, Column, Model, ForeignKey, BelongsTo, HasOne, BelongsToMany, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { User } from './User';
import { Product } from './Product';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';
import { Delivery } from './Delivery';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  })
  total_amount!: number;

  @Column({
    type: DataType.ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status!: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id!: string;

  @BelongsTo(() => User, 'user_id')
  buyer!: User;

  @HasOne(() => Payment, 'order_id')
  payment!: Payment;

  @HasOne(() => Delivery, 'order_id')
  delivery!: Delivery;

  @BelongsToMany(() => Product, () => OrderItem)
  products!: Product[];
}
