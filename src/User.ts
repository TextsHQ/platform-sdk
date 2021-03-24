import type { PhoneNumber } from './PhoneNumber'

export type User = {
  id: string
  username?: string
  phoneNumber?: PhoneNumber
  email?: string

  fullName?: string
  nickname?: string
  imgURL?: string
  isVerified?: boolean

  cannotMessage?: boolean
  isSelf?: boolean
}

export type CurrentUser = User & {
  displayText: string
}

export type Participant = User & {
  isAdmin?: boolean
  hasExited?: boolean
}
