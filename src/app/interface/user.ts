export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  date: Date;
  last_login: Date;
  is_blocked: boolean;
  selected: boolean;
}
