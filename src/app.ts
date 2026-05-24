import express, { type Request, type Application, type Response } from 'express';
import authRouter from './modules/auth/auth.route';

const app: Application = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Express Server',
    author: 'Jony Coder',
  });
});

app.use('/api/auth', authRouter);

export default app;
