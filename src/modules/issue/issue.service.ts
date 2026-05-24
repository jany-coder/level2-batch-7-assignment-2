import { pool } from '../../db';
import type {
  ICreateIssue,
  IIssueFilters,
  IUpdateIssue,
} from './issue.interface';

const ISSUE_COLUMNS =
  'id, title, description, type, status, reporter_id, created_at, updated_at';

const attachReporters = async (issues: any[]) => {
  if (issues.length === 0) return [];

  const ids = [...new Set(issues.map((i) => i.reporter_id))];
  const reporters = await pool.query(
    'SELECT id, name, role FROM users WHERE id = ANY($1::int[])',
    [ids]
  );

  const reporterMap = new Map<number, any>(reporters.rows.map((r) => [r.id, r]));

  return issues.map(({ reporter_id, ...rest }) => ({
    ...rest,
    reporter: reporterMap.get(reporter_id) ?? null,
  }));
};

const createIssueIntoDB = async (payload: ICreateIssue) => {
  const { title, description, type, reporter_id } = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING ${ISSUE_COLUMNS}`,
    [title, description, type, reporter_id]
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (filters: IIssueFilters) => {
  const { sort = 'newest', type, status } = filters;
  const direction = sort === 'oldest' ? 'ASC' : 'DESC';

  const result = await pool.query(
    `SELECT ${ISSUE_COLUMNS}
     FROM issues
     WHERE ($1::text IS NULL OR type = $1)
       AND ($2::text IS NULL OR status = $2)
     ORDER BY created_at ${direction}`,
    [type ?? null, status ?? null]
  );

  return attachReporters(result.rows);
};

const getIssueById = async (id: number) => {
  const result = await pool.query(
    `SELECT ${ISSUE_COLUMNS} FROM issues WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
};

const getIssueWithReporter = async (id: number) => {
  const issue = await getIssueById(id);
  if (!issue) return null;
  const [withReporter] = await attachReporters([issue]);
  return withReporter ?? null;
};

const updateIssueIntoDB = async (id: number, payload: IUpdateIssue) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `UPDATE issues
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         updated_at = NOW()
     WHERE id = $4
     RETURNING ${ISSUE_COLUMNS}`,
    [title ?? null, description ?? null, type ?? null, id]
  );

  return result.rows[0];
};

const deleteIssueFromDB = async (id: number) => {
  const result = await pool.query('DELETE FROM issues WHERE id = $1', [id]);
  return result.rowCount;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getIssueById,
  getIssueWithReporter,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
