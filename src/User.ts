import type { PhoneNumber } from './PhoneNumber'
import type { AttributedText } from './TextAttributes'

export type UsersOrCount = {
  userIDs?: string[]
  count?: number
}

export type UserSocialAttributes = {
  coverImgURL?: string
  bio?: AttributedText
  website?: string

  followers?: UsersOrCount
  followingUsers?: UsersOrCount
  friends?: UsersOrCount

  /** does the logged in user follow them */
  following?: boolean
  /** is the logged in user followed by them */
  followedBy?: boolean
}

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

  social?: UserSocialAttributes
}

export type CurrentUser = User & {
  displayText: string
}

export type Participant = User & {
  isAdmin?: boolean
  hasExited?: boolean
}
