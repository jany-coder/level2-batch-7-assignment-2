import { Router } from 'express';
import { issueControllers } from './issue.controller';
import auth from '../../middleware/auth';

const router = Router();

router.get('/', issueControllers.getAllIssues);
router.get('/:id', issueControllers.getSingleIssue);
router.post('/', auth(), issueControllers.createIssue);
router.patch('/:id', auth(), issueControllers.updateIssue);
router.delete('/:id', auth('maintainer'), issueControllers.deleteIssue);

export const issueRoute = router;
