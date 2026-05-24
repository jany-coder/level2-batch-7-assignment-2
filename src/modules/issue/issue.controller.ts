import type { Request, Response } from 'express';
import { issueService } from './issue.service';
import sendResponse from '../../utility/sendResponse';
import type { IIssueFilters } from './issue.interface';

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
      message: error.message || 'Failed to create issue',
      errors: error.message,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;
    const filters: IIssueFilters = {};
    if (sort === 'newest' || sort === 'oldest') filters.sort = sort;
    if (type === 'bug' || type === 'feature_request') filters.type = type;
    if (status === 'open' || status === 'in_progress' || status === 'resolved') {
      filters.status = status;
    }

    const result = await issueService.getAllIssuesFromDB(filters);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issues retrived successfully',
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || 'Failed to retrieve issues',
      errors: error.message,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const issue = await issueService.getIssueWithReporter(id);
    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Issue not found',
      });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue retrived successfully',
      data: issue,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || 'Failed to retrieve issue',
      errors: error.message,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await issueService.getIssueById(id);
    if (!existing) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Issue not found',
      });
    }

    const user = req.user!;
    if (user.role !== 'maintainer') {
      if (existing.reporter_id !== user.id) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: 'Forbidden: you can only update your own issues',
        });
      }
      if (existing.status !== 'open') {
        return sendResponse(res, {
          statusCode: 409,
          success: false,
          message: 'Cannot update an issue that is not open',
        });
      }
    }

    const result = await issueService.updateIssueIntoDB(id, req.body);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue updated successfully',
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || 'Failed to update issue',
      errors: error.message,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await issueService.deleteIssueFromDB(id);
    if (!deleted) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Issue not found',
      });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || 'Failed to delete issue',
      errors: error.message,
    });
  }
};

export const issueControllers = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
