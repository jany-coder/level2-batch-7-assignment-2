import type { Request, Response } from 'express';
import { authService } from './auth.service';
import sendResponse from '../../utility/sendResponse';

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupIntoDB(req.body);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error: any) {
    if (error?.code === '23505') {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Email already exists',
        errors: error.message,
      });
    }
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || 'Internal server error',
      errors: error.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginFromDB(req.body);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: error.message || 'Invalid credentials',
      errors: error.message,
    });
  }
};

export const authControllers = {
  signup,
  login,
};
