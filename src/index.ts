export * from './platform-enums'
export * from './platform-errors'
export * from './platform-types'

export type TextsGlobals = {
  IS_DEV: boolean
  log: (...args: any[]) => void
}

export const texts: TextsGlobals = ((typeof window === 'undefined' ? global : window) as any).texts
