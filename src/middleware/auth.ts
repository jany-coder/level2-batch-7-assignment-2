import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config';
import sendResponse from '../utility/sendResponse';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const auth = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Unauthorized: token missing',
      });
    }

    try {
      const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload & AuthUser;

      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: 'Forbidden: insufficient role',
        });
      }

      next();
    } catch {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Unauthorized: invalid or expired token',
      });
    }
  };
};

export default auth;
