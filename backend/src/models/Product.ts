import { Table, Column, Model, ForeignKey, BelongsTo, BelongsToMany, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { User } from './User';
import { Category } from './Category';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  image_url?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  quantity_available!: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id!: string;

  @BelongsTo(() => User, 'user_id')
  seller!: User;

  @ForeignKey(() => Category)
  @Column
  category_id!: number;

  @BelongsTo(() => Category, 'category_id')
  category!: Category;

  @BelongsToMany(() => Order, () => OrderItem)
  orders!: Order[];
}
