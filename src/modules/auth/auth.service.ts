import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { ILogin, ISignup } from './auth.interface';
import { pool } from '../../db';
import config from '../../config';

const signupIntoDB = async (payload: ISignup) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashPassword, role]
  );

  return result.rows[0];
};

const loginFromDB = async (payload: ILogin) => {
  const { email, password } = payload;

  const userData = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userData.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error('Invalid email or password');
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: config.jwt_expires_in,
  } as SignOptions);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

export const authService = {
  signupIntoDB,
  loginFromDB,
};
