export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'ERROR', 500);
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500);
};

// NOTE: the web app's version of this file also installed global
// `error`/`unhandledrejection` listeners at module scope. That's left to the
// host app — it's a side effect on import, and the two platforms need different
// mechanisms (window events vs. ErrorUtils.setGlobalHandler).
