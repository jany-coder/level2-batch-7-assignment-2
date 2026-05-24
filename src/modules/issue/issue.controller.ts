import type { Request, Response } from 'express';
import { issueService } from './issue.service';
import sendResponse from '../../utility/sendResponse';

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB({
      ...req.body,
      reporter_id: req.user!.id,
    });
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Issue created successfully',
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Failed to create issue',
      error: error.message || error,
    });
  }
};

export const issueControllers = {
  createIssue,
};
