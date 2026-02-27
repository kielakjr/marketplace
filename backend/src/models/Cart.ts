import {
  Table, Column, Model, ForeignKey, BelongsTo,
  HasMany, DataType, PrimaryKey, Default,
} from "sequelize-typescript";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Table({
  tableName: "carts",
  timestamps: true,
})
export class Cart extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  user_id!: string;

  @BelongsTo(() => User, "user_id")
  user!: User;

  @HasMany(() => CartItem, "cart_id")
  items!: CartItem[];
}
