import type { Identifiable } from './generic'

export interface CustomEmoji extends Identifiable {
  id: string
  url: string
}
