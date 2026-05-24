export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';
export type SortOrder = 'newest' | 'oldest';

export interface ICreateIssue {
  title: string;
  description: string;
  type: IssueType;
  reporter_id: number;
}

export interface IUpdateIssue {
  title?: string;
  description?: string;
  type?: IssueType;
}

export interface IIssueFilters {
  sort?: SortOrder;
  type?: IssueType;
  status?: IssueStatus;
}
