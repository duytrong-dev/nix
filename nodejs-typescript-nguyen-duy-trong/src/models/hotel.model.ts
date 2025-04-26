import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
    ForeignKey,
} from 'sequelize-typescript';
import { Payment } from './payment.model.js';
  
@Table({ timestamps: true, tableName: 'hotels', modelName: 'Hotel' })
export class Hotel extends Model<Hotel> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.BIGINT, autoIncrement: true, allowNull: false, primaryKey: true })
    declare id: number;
  
    @Column({type: DataType.STRING, allowNull: false})
    declare name_of_client: string;
  
    @Column({type: DataType.STRING, allowNull: false})
    declare phone: string;

    @Column({type: DataType.DATE, allowNull: false})
    declare start_date: Date;

    @ForeignKey(() => Payment)
    @Column({type: DataType.BIGINT, allowNull: false})
    declare payment_id: number;

    @Column({type: DataType.STRING, allowNull: false})
    declare note: string;
  
    @CreatedAt
    @Column(DataType.DATE)
    declare createdAt: Date;
  
    @UpdatedAt
    @Column(DataType.DATE)
    declare updatedAt: Date;

    @BelongsTo(() => Payment)
    declare payment: Payment;
}
