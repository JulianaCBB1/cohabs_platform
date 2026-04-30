import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRouter from './routes/auth';
import { initializeServices } from './services/instances';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/health', (_req, res) => {
  console.log('received request');
  res.json({ status: 'ok', timestamp: new Date() });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');

    initializeServices();

    app.use('/auth', authRouter);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });
