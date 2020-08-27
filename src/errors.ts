const createError = (name: string, parent = Error) => class extends parent {
  constructor(message?: string) {
    super(message)
    this.name = name
  }
}

export const ReAuthError = createError('ReAuthError')

export const RateLimitError = createError('RateLimitError')

export const ConnectionError = createError('ConnectionError')

export enum PlatformErrorName {
  'ReAuthError' = 'ReAuthError',
  'RateLimitError' = 'RateLimitError',
  'ConnectionError' = 'ConnectionError',
}
