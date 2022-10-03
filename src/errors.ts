
export class ReAuthError extends Error { }

export class RateLimitError extends Error { }

export class ConnectionError extends Error { }

export enum PlatformErrorName {
  'ReAuthError' = 'ReAuthError',
  'RateLimitError' = 'RateLimitError',
  'ConnectionError' = 'ConnectionError',
}
