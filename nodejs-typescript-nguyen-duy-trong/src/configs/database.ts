import { Sequelize } from 'sequelize-typescript';
import { Hotel } from '~/models/hotel.model.js';
import dotenv from 'dotenv';
import { Payment } from '~/models/payment.model.js';
dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    models: [Hotel, Payment], 
    logging: false,
});

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        try {
            await sequelize.sync({ alter: true }) // xóa hết tạo lại
            console.log('✅ Database synced') 
        } catch (error) {
            console.error('❌ Sync failed', error);
        }
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

