import express, { type Request, type Application, type Response } from 'express';
import { authRoute } from './modules/auth/auth.route';
import { issueRoute } from './modules/issue/issue.route';

const app: Application = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Express Server',
    author: 'Jony Coder',
  });
});

app.use('/api/auth', authRoute);
app.use('/api/issues', issueRoute);

export default app;
