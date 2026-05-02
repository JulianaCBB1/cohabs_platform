import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { initializeServices } from './services/instances';
import { globalErrorHandler } from './middleware/errorHandler';
import authRouter from './routes/auth';
import housesRouter from './routes/houses';
import roomRouter from './routes/rooms';
import leaseRouter from './routes/leases';
import userRouter from './routes/users';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get('/health', (_req, res) => {
  console.log('received request');
  res.json({ status: 'ok', timestamp: new Date() });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');

    initializeServices();

    app.use('/auth', authRouter);
    app.use('/houses', housesRouter);
    app.use('/houses/:houseId/rooms', roomRouter);
    app.use('/leases', leaseRouter);
    app.use('/users', userRouter);

    app.use(globalErrorHandler);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })

  .catch((err: any) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
