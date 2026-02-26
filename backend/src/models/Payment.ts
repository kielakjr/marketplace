import { Table, Column, Model, ForeignKey, BelongsTo, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { Order } from './Order';

@Table({
  tableName: 'payments',
  timestamps: true,
})
export class Payment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status!: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payment_gateway_id?: string;

  @ForeignKey(() => Order)
  @Column(DataType.UUID)
  order_id!: string;

  @BelongsTo(() => Order, 'order_id')
  order!: Order;
}
