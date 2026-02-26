import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Order } from './Order';
import { Product } from './Product';

@Table({
  tableName: 'order_items',
  timestamps: false,
})
export class OrderItem extends Model {
  @ForeignKey(() => Order)
  @Column(DataType.UUID)
  order_id!: string;

  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  product_id!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price_per_unit!: number;
}
