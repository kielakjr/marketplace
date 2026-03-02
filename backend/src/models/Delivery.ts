import { Table, Column, Model, ForeignKey, BelongsTo, DataType, Default, PrimaryKey } from 'sequelize-typescript';
import { Order } from './Order';
import { Address } from './Address';

@Table({
  tableName: 'deliveries',
  timestamps: true,
})
export class Delivery extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  tracking_number?: string;

  @Column({
    type: DataType.ENUM('PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'FAILED_DELIVERY'),
    allowNull: false,
    defaultValue: 'PREPARING',
  })
  status!: 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED_DELIVERY';

  @ForeignKey(() => Order)
  @Column(DataType.UUID)
  order_id!: string;

  @BelongsTo(() => Order, 'order_id')
  order!: Order;

  @ForeignKey(() => Address)
  @Column(DataType.UUID)
  address_id!: string;

  @BelongsTo(() => Address, 'address_id')
  address!: Address;
}
