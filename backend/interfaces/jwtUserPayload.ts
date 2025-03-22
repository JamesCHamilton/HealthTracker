export interface JwtUserPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
}