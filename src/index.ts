export * from './enums'
export * from './errors'
export * from './types'

export type TextsGlobals = {
  IS_DEV: boolean
  log: (...args: any[]) => void
  error: (...args: any[]) => void
  constants: {
    USER_AGENT: string
  }
}

export const texts = (globalThis as any).texts as TextsGlobals
