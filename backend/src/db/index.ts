import { Sequelize } from 'sequelize-typescript';
import { env } from '../config/env';
import { User, Product, Order, OrderItem, Payment, Delivery, Category } from '../models';

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  models: [User, Product, Order, OrderItem, Payment, Delivery, Category],
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
