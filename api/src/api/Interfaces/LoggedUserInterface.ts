export interface LoggedUserInterface {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
