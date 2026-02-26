import 'reflect-metadata';
import express from 'express';
import sequelize from './db';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const initialize = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

initialize();

export default app;
