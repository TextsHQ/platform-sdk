export * from './enums'
export * from './errors'
export * from './types'

export type TextsGlobals = {
  IS_DEV: boolean
  log: (...args: any[]) => void
}

export const texts: TextsGlobals = ((typeof window === 'undefined' ? global : window) as any).texts
