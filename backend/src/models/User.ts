import { Table, Column, Model, HasMany, DataType, Default, PrimaryKey, HasOne } from 'sequelize-typescript';
import { Product } from './Product';
import { Order } from './Order';
import { Cart } from './Cart';
import { UserRating } from './UserRating';

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

  @Column({
  type: DataType.DECIMAL(3, 2),
  allowNull: true,
  defaultValue: null,
  })
  avg_rating!: number | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  ratings_count!: number;

  @HasMany(() => UserRating, 'reviewee_id')
  receivedRatings!: UserRating[];

  @HasMany(() => UserRating, 'reviewer_id')
  givenRatings!: UserRating[];

  @HasMany(() => Product, 'user_id')
  products!: Product[];

  @HasMany(() => Order, 'user_id')
  orders!: Order[];

  @HasOne(() => Cart, "user_id")
  cart!: Cart;
}
