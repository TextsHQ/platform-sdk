import type SentryNode from '@sentry/node'

export * from './enums'
export * from './errors'
export * from './types'
export * from './constants'

export type TextsGlobals = {
  IS_DEV: boolean
  log: (...args: any[]) => void
  error: (...args: any[]) => void
  constants: {
    USER_AGENT: string,
    USER_DATA_DIR_PATH: string,
    APP_VERSION: string,
  },
  Sentry: typeof SentryNode,
}

export const texts = (globalThis as any).texts as TextsGlobals
