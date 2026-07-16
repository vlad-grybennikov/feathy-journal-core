import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getConfig } from '../config';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth/tokens';

export const apiClient: AxiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// baseURL is resolved per-request rather than at create() time, because
// configure() runs at app boot — after this module is imported.
apiClient.interceptors.request.use((config) => {
  config.baseURL = getConfig().apiUrl;
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try to refresh the access token once, then retry the original request.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      await clearTokens();
      getConfig().onAuthFailure?.();
      return Promise.reject(error);
    }

    try {
      // Bare axios call so we don't recurse through these interceptors.
      const { data } = await axios.post(`${getConfig().apiUrl}/v1/auth/refresh`, {
        refreshToken,
      });
      const tokens = data.data as { accessToken: string; refreshToken: string };
      await setTokens(tokens);
      original.headers = { ...original.headers, Authorization: `Bearer ${tokens.accessToken}` };
      return apiClient(original);
    } catch (refreshError) {
      await clearTokens();
      getConfig().onAuthFailure?.();
      return Promise.reject(refreshError);
    }
  },
);
