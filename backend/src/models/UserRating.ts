// models/UserRating.ts
import {
  Table, Column, Model, DataType, Default,
  PrimaryKey, BelongsTo, ForeignKey, Min, Max
} from 'sequelize-typescript';
import { User } from './User';
import { Order } from './Order';

@Table({
  tableName: 'user_ratings',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['reviewer_id', 'order_id'],
    }
  ]
})
export class UserRating extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  reviewee_id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  reviewer_id!: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  order_id!: string;

  @Min(1)
  @Max(5)
  @Column({ type: DataType.INTEGER, allowNull: false })
  rating!: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  comment?: string;

  @BelongsTo(() => User, 'reviewee_id')
  reviewee!: User;

  @BelongsTo(() => User, 'reviewer_id')
  reviewer!: User;

  @BelongsTo(() => Order)
  order!: Order;
}
