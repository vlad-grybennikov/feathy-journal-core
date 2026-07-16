/**
 * Host-app configuration.
 *
 * This package is consumed by both the Next.js web app and the React Native
 * app, so the three things that used to be web globals are injected instead:
 *
 * - `apiUrl`        replaces `process.env.NEXT_PUBLIC_API_URL`
 * - `storage`       replaces `window.localStorage`
 * - `onAuthFailure` replaces `window.location.href = '/login'`
 */

/**
 * Token persistence. Async because React Native's Keychain/AsyncStorage are —
 * the web adapter just wraps the synchronous localStorage in resolved promises.
 */
export interface TokenStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface CoreConfig {
  /** Base URL including the `/api` prefix, e.g. `http://localhost:9002/api`. */
  apiUrl: string;
  storage: TokenStorage;
  /**
   * Called when the session is unrecoverable (no refresh token, or the refresh
   * itself failed). The host decides what that means — a redirect on web, an
   * auth-state flip on native.
   */
  onAuthFailure?: () => void;
}

let config: CoreConfig | null = null;

/** Must be called once at app boot, before any API call. */
export const configure = (next: CoreConfig): void => {
  config = next;
};

export const getConfig = (): CoreConfig => {
  if (!config) {
    throw new Error(
      '@feathy/journal-core: configure() must be called before using the API.',
    );
  }
  return config;
};

export const isConfigured = (): boolean => config !== null;
