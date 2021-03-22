export type User = {
  id: string
  username?: string
  /**
   * should start with "+" and not contain any spaces, like "+14151231234"
   */
  phoneNumber?: string
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
