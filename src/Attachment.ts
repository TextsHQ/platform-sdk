import type { AttachmentType, PlayStatus } from './enums'
import type { ExtraProp, ID, Identifiable, Size, XOR } from './generic'

export type AttachmentID = ID

export interface AttachmentBase extends Identifiable, ExtraProp {
  id: AttachmentID
  type: AttachmentType
  size?: Size
  posterImg?: string
  mimeType?: string
  fileName?: string
  fileSize?: number

  loading?: boolean

  isGif?: boolean
  isSticker?: boolean
  isVoiceNote?: boolean

  playStatus?: PlayStatus

  /** @deprecated */
  caption?: string
}

export type AttachmentWithURL = AttachmentBase & { srcURL: string }
export type AttachmentWithBuffer = AttachmentBase & { data: Buffer }
export type Attachment = XOR<AttachmentWithURL, AttachmentWithBuffer>

/** @deprecated renamed to Attachment */
export type MessageAttachment = Attachment
