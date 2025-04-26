import { AutoIncrement, Column, CreatedAt, DataType, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Hotel } from "./hotel.model.js";

@Table({ timestamps: true, tableName: 'payments', modelName: 'Payment'})
export class Payment extends Model<Payment> {

    @PrimaryKey
    @AutoIncrement
    @Column({type: DataType.BIGINT, autoIncrement: true, allowNull: false})
    declare id: number

    @Column({type: DataType.STRING, allowNull: false})
    declare name: string

    @CreatedAt
    @Column(DataType.DATE)
    declare createdAt: Date

    @UpdatedAt
    @Column(DataType.DATE)
    declare updatedAt: Date

    @HasMany(() => Hotel)
    declare hotels: Hotel[]
}