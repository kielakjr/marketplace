import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { Delivery } from './Delivery';

@Table({
  tableName: 'addresses',
  timestamps: true,
})
export class Address extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  street!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  street_number!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  postal_code!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  city!: string;

  @HasMany(() => Delivery)
  deliveries!: Delivery[];
}
