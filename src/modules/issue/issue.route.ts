import { Router } from 'express';
import { issueControllers } from './issue.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth(), issueControllers.createIssue);

export const issueRoute = router;
