export default interface IUser {
  user: {
    id?: any | null,
    email?: string,
    username?: string,
    role?: string
    full_name?: string,
    deposit?: number,
  },
  access_token: string
}
