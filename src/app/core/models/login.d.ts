export interface ILoginRequest {
  userId: string;
  passId: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  expiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}
