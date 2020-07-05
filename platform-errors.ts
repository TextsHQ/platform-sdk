const createError = (name: string, parent = Error) => class extends parent {
  constructor(message?: string) {
    super(message)
    this.name = name
  }
}

export const ReAuthError = createError('ReAuthError')

export const RateLimitError = createError('RateLimitError')

export enum PlatformError {
  'ReAuthError' = 'ReAuthError',
  'RateLimitError' = 'RateLimitError',
}
