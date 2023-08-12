export interface Identifiable {
  id: string
}

export interface ExtraProp {
  extra?: any
}

export interface OriginalProp {
  _original?: string
}

export interface CursorProp extends Identifiable {
  cursor?: string
}

export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
}
export type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

export type Awaitable<T> = T | PromiseLike<T>

export type Size = {
  width: number
  height: number
}

export type PaginatedWithCursors<T> = {
  items: T[]
  hasMore: boolean
  oldestCursor: string
  newestCursor?: string
}

export type Paginated<T extends CursorProp> = {
  items: T[]
  hasMore: boolean
}

export type PartialWithID<T> = Partial<T> & { id: string }

export type FSPath = string

export type ID = string

export type Button = {
  label: string
  linkURL: string
}
