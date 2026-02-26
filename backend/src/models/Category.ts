import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { Product } from './Product';

@Table({
  tableName: 'categories',
  timestamps: false,
})
export class Category extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @HasMany(() => Product, 'category_id')
  products!: Product[];
}
