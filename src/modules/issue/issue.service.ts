import pool from '../../db';
import type { ICreateIssue } from './issue.interface';

const createIssueIntoDB = async (payload: ICreateIssue) => {
  const { title, description, type, reporter_id } = payload;

  const reporter = await pool.query(`SELECT id FROM users WHERE id = $1`, [reporter_id]);
  if (reporter.rowCount === 0) {
    throw new Error('Reporter not found');
  }

  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, reporter_id]
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
};
