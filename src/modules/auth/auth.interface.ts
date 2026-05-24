export interface ISignup {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}
