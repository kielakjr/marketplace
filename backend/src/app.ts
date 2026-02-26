import 'reflect-metadata';
import express from 'express';
import sequelize from './db';
import productRoutes from './routes/products';

const app = express();

app.use(express.json());
app.use('/products', productRoutes);

const initialize = async () => {
  try {
    await sequelize.sync();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

initialize();

export default app;
