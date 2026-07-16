import { apiClient } from '../client';
import { setTokens } from './tokens';
import {
  ApiEnvelope,
  AuthUser,
  GoogleLoginResponseData,
  RefreshResponseData,
} from './types';

/**
 * Exchange a Google ID token (credential) for app tokens, and persist them.
 */
export const googleLogin = async (idToken: string): Promise<AuthUser> => {
  const response = await apiClient.post<ApiEnvelope<GoogleLoginResponseData>>(
    '/v1/auth/google',
    { idToken }
  );
  const { user, accessToken, refreshToken } = response.data.data;
  await setTokens({ accessToken, refreshToken });
  return user;
};

/**
 * Exchange a refresh token for a fresh token pair.
 * Note: the axios interceptor handles refresh-on-401 automatically; this is
 * exported for explicit use if needed.
 */
export const refreshTokens = async (refreshToken: string): Promise<RefreshResponseData> => {
  const response = await apiClient.post<ApiEnvelope<RefreshResponseData>>(
    '/v1/auth/refresh',
    { refreshToken }
  );
  const tokens = response.data.data;
  await setTokens(tokens);
  return tokens;
};

/**
 * Fetch the currently authenticated user.
 */
export const getMe = async (): Promise<AuthUser> => {
  const response = await apiClient.get<ApiEnvelope<AuthUser>>('/v1/auth/me');
  return response.data.data;
};
