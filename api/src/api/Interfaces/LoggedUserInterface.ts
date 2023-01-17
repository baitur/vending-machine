export interface LoggedUserInterface {
  userId: number;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}
