import type { Size } from './generic'
import type { UserID } from './User'

export type ReplaceWithMediaEntity = {
  mediaType: 'img' | 'video'
  srcURL: string
  size?: Size
  loop?: boolean
  rounded?: boolean
}

export type TextEntity = {
  from: number
  to: number

  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  quote?: boolean
  spoiler?: boolean

  code?: boolean
  pre?: boolean
  codeLanguage?: string

  markdown?: string

  replaceWith?: string
  replaceWithMedia?: ReplaceWithMediaEntity
  link?: string
  mentionedUser?: { username?: string, id?: UserID }
}

export type TextAttributes = {
  entities?: TextEntity[]
  /**
   * decode HTML entities like > (&gt;)
   */
  heDecode?: boolean
}

export type AttributedText = {
  text: string
  attributes?: TextAttributes
}
