import type React from 'react'
import type { MessageDeletionMode, Attribute } from './enums'
import type { PlatformAPI, LoginCreds, LoginResult } from './PlatformAPI'
import type { Participant } from './User'

export type BrowserLogin = {
  loginURL: string
  label?: string
  description?: string

  /** User-Agent to use for all requests in the window */
  userAgent?: string

  /** Closes the browser login window when a cookie with this name is found */
  authCookieName?: string

  /** Closes the browser login window when the page is redirected to a URL matching the regex */
  closeOnRedirectRegex?: string

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

export type AuthProps = {
  isReauthing?: boolean
  api?: PlatformAPI
  login?: (creds?: LoginCreds) => Promise<LoginResult>
  meContact?: {
    fullName?: string
    phoneNumbers?: string[]
    emailAddresses?: string[]
  }

  nmp?: any
  Tooltip?: React.FC<any>
}

export type PlatformInfo = {
  name: string
  version?: string
  displayName: string
  /** HTML of an SVG */
  icon: string
  tags?: string[]

  loginMode: LoginMode
  autofillHostnames?: string[]
  /** @deprecated use `browserLogins` */
  browserLogin?: BrowserLogin
  browserLogins?: BrowserLogin[]
  auth?: React.LazyExoticComponent<React.FC<AuthProps>> | React.FC<AuthProps>

  reactions?: {
    supported: Record<string, SupportedReaction>
    supportsDynamicReactions?: boolean
    canReactWithAllEmojis?: boolean
    allowsMultipleReactionsToSingleMessage?: boolean
  }
  deletionMode: MessageDeletionMode
  attributes: Set<Attribute>

  maxMessageLength?: number
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

    /** max sendable attachment size in bytes */
    maxSize?: {
      image?: number
      video?: number
      audio?: number
      files?: number
    }
  }

  prefs?: Record<string, Pref>

  extra?: any

  getUserProfileLink?: (participant: Participant) => string
}
