import type { CookieJar } from 'tough-cookie'
import type { MessageDeletionMode, Attribute } from './enums'
import type { ExtraProp } from './generic'
import type { NotificationsInfo } from './Notifications'
import type { Participant } from './User'

export type BrowserWindowProps = {
  url: string

  /** User-Agent to use for all requests in the window */
  userAgent?: string

  /** Closes the browser window when a cookie with this name is found */
  authCookieName?: string

  /** Closes the browser window when the page is redirected to a URL matching the regex */
  closeOnRedirectRegex?: string

  runJSOnLaunch?: string
  runJSOnNavigate?: string
  runJSOnClose?: string

  windowTitle?: string
  windowWidth?: number
  windowHeight?: number

  /** Existing cookies to be set */
  cookieJar?: CookieJar.Serialized

  /** Domains to get cookies for when stealing cookies from installed browsers */
  cookieDomains?: string[]

  isHidden?: boolean
}

export type BrowserLogin = {
  label?: string
  description?: string
} & BrowserWindowProps

export type LoginMode = 'browser-extension' | 'browser' | 'manual' | 'custom'

export type SupportedReaction = {
  /** user friendly string to show, like "Laugh" */
  title: string
  /** string to display for reaction, like "😂". either `render` or `imgURL` must be specified */
  render?: string
  /** URL to the reaction's image. either `render` or `imgURL` must be specified */
  imgURL?: string
  /** hide reaction from list */
  disabled?: boolean
}

export type Pref = {
  label: string
  description?: string
  type: 'select' | 'checkbox'
  default: boolean | string
}

export interface OverridablePlatformInfo {
  reactions?: {
    supported: Record<string, SupportedReaction>
    canReactWithAllEmojis?: boolean
    allowsMultipleReactionsToSingleMessage?: boolean
  }
  attachments?: {
    noSupport?: boolean
    noSupportForImage?: boolean
    noSupportForVideo?: boolean
    noSupportForAudio?: boolean
    noSupportForFiles?: boolean

    supportsCaption?: boolean
    supportsStickers?: boolean
    recordedAudioMimeType?: string
    gifMimeType?: string

    /** max sendable attachment size in bytes */
    maxSize?: {
      image?: number
      video?: number
      audio?: number
      files?: number
    }
  }
}

export interface PlatformInfo extends OverridablePlatformInfo, ExtraProp {
  name: string
  version?: string
  displayName: string
  /** HTML of an SVG */
  icon: string
  tags?: string[]

  loginMode: LoginMode | LoginMode[]
  autofillHostnames?: string[]
  /** @deprecated use `browserLogins` */
  browserLogin?: BrowserLogin
  browserLogins?: BrowserLogin[]

  deletionMode: MessageDeletionMode
  attributes: Set<Attribute>

  maxMessageLength?: number
  maxGroupTitleLength?: number
  typingDurationMs?: number

  notifications?: NotificationsInfo

  prefs?: Record<string, Pref>

  getUserProfileLink?: (participant: Participant) => string
  generateUniqueMessageID?: () => string
}
