import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import { authRoute } from './modules/auth/auth.route';
import { issueRoute } from './modules/issue/issue.route';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'DevPulse API',
    author: 'Jony Coder',
  });
});

app.use('/api/auth', authRoute);
app.use('/api/issues', issueRoute);

export default app;
