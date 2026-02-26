import app from './app';
import { connectDB } from './db';
import { env } from './config/env';

async function startServer() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
}

startServer();
