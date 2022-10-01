import type { ID, Identifiable, Paginated } from './generic'
import type { Attachment } from './Attachment'

export type StickerPackID = ID
export type StickerID = ID

export interface StickerPack extends Identifiable {
  id: StickerPackID
  preview: Attachment
  name: string
  publisher?: string
  description?: string
  stickers: Paginated<Attachment>
}
