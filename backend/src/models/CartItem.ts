import {
  Table, Column, Model, ForeignKey, BelongsTo,
  DataType, PrimaryKey, Default,
} from "sequelize-typescript";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Table({
  tableName: "cart_items",
  timestamps: true,
})
export class CartItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  cart_id!: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 },
  })
  quantity!: number;

  @BelongsTo(() => Cart, "cart_id")
  cart!: Cart;

  @BelongsTo(() => Product, "product_id")
  product!: Product;
}
