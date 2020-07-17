import { PlatformAPI, PlatformMetadata, Message, Participant, ReactObject } from './types'

export * from './enums'
export * from './errors'
export * from './types'

export type TextsGlobals = {
  IS_DEV: boolean
  log: (...args: any[]) => void
}
export type Platform<MyCredsType, MyThreadType, MyMessageType, MyContactType> = {
  api: PlatformAPI<MyCredsType, MyThreadType, MyMessageType, MyContactType>
  metadata: PlatformMetadata,
  /** Map the given message to a native `Texts` type */
  mapMessage: (message: MyMessageType) => Message,
  /** Map the given thread to a native `Texts` type */
  mapThread: (thread: MyThreadType) => Message,
  /** Map the given contact to a native `Texts` type */
  mapContact: (contact: MyContactType) => Participant
}
/** Singleton instance exposing relevant `Texts` types */
export const texts: TextsGlobals = ((typeof window === 'undefined' ? global : window) as any).texts
