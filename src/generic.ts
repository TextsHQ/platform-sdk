export type Identifiable = {
  id: string
}

export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]
  ?
  : never
}
export type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

export type Awaitable<T> = T | PromiseLike<T>

export type Size = {
  width: number
  height: number
}

export type Paginated<T> = {
  items: T[]
  hasMore: boolean
  oldestCursor?: string
  newestCursor?: string
}

export type PartialWithID<T> = Partial<T> & { id: string }
