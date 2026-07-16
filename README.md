# @feathy/journal-core

The platform-agnostic half of Feathy Journal — the `/api/v1` client, the shared React contexts, and the domain logic. Consumed by both `feathy-journal-fe` (Next.js) and `feathy-journal-mobile` (React Native).

Only `axios` at runtime, with `react` as a peer dependency. Nothing here touches the DOM, `window`, `localStorage`, `next/*`, or React Native.

## Install

Consumed as a git dependency, pinned to a tag:

```json
{
  "dependencies": {
    "@feathy/journal-core": "github:<owner>/feathy-journal-core#v0.1.0"
  }
}
```

npm runs the `prepare` script on git dependencies, so the package builds itself on install. The published entrypoint is compiled CommonJS + `.d.ts` under `dist/`, which both Metro and Next consume without extra config.

## Configure

`configure()` must be called once at boot, before any API call. It injects the three things that used to be web globals:

| Injected | Replaces |
|---|---|
| `apiUrl` | `process.env.NEXT_PUBLIC_API_URL` |
| `storage` | `window.localStorage` |
| `onAuthFailure` | `window.location.href = '/login'` |

Web:

```ts
import { configure } from '@feathy/journal-core';

configure({
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  storage: {
    get: async (k) => window.localStorage.getItem(k),
    set: async (k, v) => window.localStorage.setItem(k, v),
    remove: async (k) => window.localStorage.removeItem(k),
  },
  onAuthFailure: () => { window.location.href = '/login'; },
});
```

React Native:

```ts
import * as Keychain from 'react-native-keychain';

configure({
  apiUrl: API_URL,
  storage: { /* Keychain-backed get/set/remove */ },
  onAuthFailure: () => navigationRef.resetRoot({ routes: [{ name: 'Login' }] }),
});
```

## Tokens

`api/auth/tokens.ts` keeps an **in-memory mirror** of the tokens, because the axios request interceptor needs a synchronous read on every request while React Native's secure storage is async. `TokenStorage` is persistence only; the mirror is the in-process source of truth.

**`hydrateTokens()` must be awaited at boot, before rendering anything that makes API calls** — otherwise the first requests go out unauthenticated. `AuthProvider` already does this in its restore effect, so mounting it is enough.

Writes update the mirror synchronously and return a promise that resolves once storage has caught up — so `getAccessToken()` is correct the moment `setTokens()` returns, whether or not you await it.

## What's here

- `api/` — the whole `/api/v1` client. 4-file slices (`tasks`, `routines`, `categories`, `auth`, `users`, `common`) and flat modules (`food`, `foods`, `ingredients`, `recipes`, `measurements`, `sources`, `providers`). Every response is the `{ data, status, success }` envelope; mappers unwrap it.
- `contexts/` — `AuthContext`, `CategoriesContext`, `ProvidersContext`.
- `hooks/` — `useWeekCompletion`.
- `models/` — shared domain types.
- `utils/` — `rrule`, `healthModel`, `taskHierarchy`, `mealWindows`, `weekDates`, `timeFormatter`, `recipe`, `errors`.

Deliberately **not** here: `cn()`/`tailwind-merge` (view-layer), and the global `error`/`unhandledrejection` listeners that `utils/errors.ts` used to install at module scope — the host app owns those, since the two platforms need different mechanisms.

## Develop

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run build       # tsc -> dist/
```

Cut a release by bumping `version`, committing, and tagging `vX.Y.Z`; consumers move by bumping the `#tag` in their `package.json`.

> **Status:** `feathy-journal-fe` still has its own copy of this code and has not yet migrated onto the package — so until it does, a backend contract change means editing both. The mobile app consumes this package from day one.
