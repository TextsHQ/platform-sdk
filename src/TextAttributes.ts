import type { Size } from './generic'

export type ReplaceWithMediaEntity = {
  mediaType: 'img' | 'video'
  srcURL: string
  size?: Size
  loop?: boolean
}

export type TextEntity = {
  from: number
  to: number

  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  pre?: boolean
  codeLanguage?: string

  replaceWith?: string
  replaceWithMedia?: ReplaceWithMediaEntity
  link?: string
  mentionedUser?: { username?: string, id?: string }
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
