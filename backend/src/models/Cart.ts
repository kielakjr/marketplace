import {
  Table, Column, Model, ForeignKey, BelongsTo,
  HasMany, DataType, PrimaryKey, Default,
  setIndexes,
} from "sequelize-typescript";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Table({
  tableName: "carts",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["user_id", "seller_id"],
    },
  ],
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
    unique: false,
  })
  user_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  seller_id!: string;

  @BelongsTo(() => User, "user_id")
  user!: User;

  @BelongsTo(() => User, "seller_id")
  seller!: User;

  @HasMany(() => CartItem, "cart_id")
  items!: CartItem[];


}
