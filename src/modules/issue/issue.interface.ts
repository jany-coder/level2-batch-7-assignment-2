export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface ICreateIssue {
  title: string;
  description: string;
  type: IssueType;
  reporter_id: number;
}

export interface ICreateIssuePayload {
  title: string;
  description: string;
  type: IssueType;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: string;
  updated_at: string;
}
