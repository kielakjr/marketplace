import { Sequelize } from 'sequelize';
import { env } from '../config/env';

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
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
