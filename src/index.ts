import type { TextsGlobals } from './TextsGlobals'

export * from './enums'
export * from './errors'
export * from './constants'

export * from './generic'
export * from './Message'
export * from './PhoneNumber'
export * from './Platform'
export * from './PlatformAPI'
export * from './PlatformInfo'
export * from './ServerEvent'
export * from './TextAttributes'
export * from './Thread'
export * from './User'

export const texts = (globalThis as any).texts as TextsGlobals
