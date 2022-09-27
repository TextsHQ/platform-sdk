import type { ID, Identifiable, Paginated, Size } from './generic'

export type StickerPackID = ID

export interface Sticker extends Identifiable {
  id: StickerPackID
  url: string
  type: 'img' | 'video'
  size: Size
  mimeType?: string
  emojis?: string
}

export interface StickerPack extends Identifiable {
  id: StickerPackID
  imgURL: string
  name: string
  publisher?: string
  description?: string
  stickers: Paginated<Sticker>
}
