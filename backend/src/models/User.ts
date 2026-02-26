import { Table, Column, Model, HasMany, DataType, Default, PrimaryKey } from 'sequelize-typescript';
import { Product } from './Product';
import { Order } from './Order';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password_hash!: string;

  @Column({
    type: DataType.ENUM('USER', 'ADMIN'),
    allowNull: false,
    defaultValue: 'USER',
  })
  role!: 'USER' | 'ADMIN';

  @HasMany(() => Product, 'user_id')
  products!: Product[];

  @HasMany(() => Order, 'user_id')
  orders!: Order[];
}
