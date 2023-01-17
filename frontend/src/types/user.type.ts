export default interface IUser {
  user: {
    id?: any | null,
    email?: string,
    role?: string
    full_name?: string,
  },
  access_token: string
}
