import type { MessageDeletionMode, Attribute } from './enums'
import type { Participant } from './User'

type ReactComponent = React.ReactNode | (() => JSX.Element) | ((props: any) => JSX.Element)

export type BrowserLogin = {
  loginURL: string
  label?: string
  description?: string
  authCookieName?: string
  runJSOnLaunch?: string
  runJSOnNavigate?: string
  runJSOnClose?: string
  windowWidth?: number
  windowHeight?: number
}

export type LoginMode = 'browser' | 'manual' | 'custom'

export type SupportedReaction = {
  /** user friendly string to show, like "Laugh" */
  title: string
  /** string to display for reaction, like "😂" */
  render: string
  disabled?: boolean
}

export type Pref = {
  label: string
  description?: string
  type: 'select' | 'checkbox'
  default: boolean | string
}

export type PlatformInfo = {
  name: string
  version?: string
  displayName: string
  /** HTML of an SVG */
  icon: string
  tags?: string[]

  loginMode: LoginMode
  /** @deprecated use `browserLogins` */
  browserLogin?: BrowserLogin
  browserLogins?: BrowserLogin[]
  auth?: ReactComponent | any

  reactions?: {
    supported: Record<string, SupportedReaction>
    supportsDynamicReactions?: boolean
    canReactWithAllEmojis?: boolean
    allowsMultipleReactionsToSingleMessage?: boolean
  }
  deletionMode: MessageDeletionMode
  attributes: Set<Attribute>

  maxGroupTitleLength?: number
  typingDurationMs?: number
  attachments?: {
    noSupport?: boolean
    noSupportForImage?: boolean
    noSupportForVideo?: boolean
    noSupportForAudio?: boolean
    noSupportForFiles?: boolean
    supportsCaption?: boolean
    recordedAudioMimeType?: string
    gifMimeType?: string
  }

  prefs?: Record<string, Pref>

  extra?: any

  getUserProfileLink?: (participant: Participant) => string
}
