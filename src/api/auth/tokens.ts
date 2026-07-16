import { getConfig } from '../../config';

const ACCESS_TOKEN_KEY = 'mj_access_token';
const REFRESH_TOKEN_KEY = 'mj_refresh_token';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * In-memory mirror of the persisted tokens.
 *
 * The axios request interceptor needs a *synchronous* read on every request,
 * but React Native's secure storage is async. So this module keeps the tokens
 * in memory as the in-process source of truth and treats `TokenStorage` as
 * persistence only. `hydrateTokens()` fills the mirror at boot; writes update
 * it synchronously and persist in the background.
 */
let accessToken: string | null = null;
let refreshToken: string | null = null;

/**
 * Load persisted tokens into memory. Call once at boot and await it *before*
 * rendering anything that makes API calls — otherwise the first requests go
 * out unauthenticated.
 */
export const hydrateTokens = async (): Promise<void> => {
  const { storage } = getConfig();
  const [storedAccess, storedRefresh] = await Promise.all([
    storage.get(ACCESS_TOKEN_KEY),
    storage.get(REFRESH_TOKEN_KEY),
  ]);
  accessToken = storedAccess;
  refreshToken = storedRefresh;
};

export const getAccessToken = (): string | null => accessToken;

export const getRefreshToken = (): string | null => refreshToken;

/**
 * The mirror is updated synchronously, so `getAccessToken()` is correct the
 * moment this returns — awaiting only guarantees the tokens reached storage.
 */
export const setTokens = async ({
  accessToken: nextAccess,
  refreshToken: nextRefresh,
}: AuthTokens): Promise<void> => {
  accessToken = nextAccess;
  refreshToken = nextRefresh;
  const { storage } = getConfig();
  await Promise.all([
    storage.set(ACCESS_TOKEN_KEY, nextAccess),
    storage.set(REFRESH_TOKEN_KEY, nextRefresh),
  ]);
};

export const clearTokens = async (): Promise<void> => {
  accessToken = null;
  refreshToken = null;
  const { storage } = getConfig();
  await Promise.all([
    storage.remove(ACCESS_TOKEN_KEY),
    storage.remove(REFRESH_TOKEN_KEY),
  ]);
};
