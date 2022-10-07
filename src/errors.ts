
export class ReAuthError extends Error { }
ReAuthError.prototype.name = 'ReAuthError'

export class RateLimitError extends Error { }
RateLimitError.prototype.name = 'RateLimitError'

export class ConnectionError extends Error { }
ConnectionError.prototype.name = 'ConnectionError'

export enum PlatformErrorName {
  'ReAuthError' = 'ReAuthError',
  'RateLimitError' = 'RateLimitError',
  'ConnectionError' = 'ConnectionError',
}
