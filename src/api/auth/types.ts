export interface AuthUser {
  _id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface ApiEnvelope<T> {
  data: T;
  status: number;
  success: boolean;
}

export interface GoogleLoginResponseData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
}
