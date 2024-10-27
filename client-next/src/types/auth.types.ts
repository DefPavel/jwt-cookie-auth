export interface IAuthResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface IFormData {
  email: string;
  password: string;
}
