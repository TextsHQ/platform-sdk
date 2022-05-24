export type WebNotifications = {
  // if there's a vapid key, we use FCM; otherwise we use a custom endpoint
  vapidKey?: string
}

export type AndroidNotifications = {
  senderID: string
}

export type AppleNotifications = {}

/** A platform may support multiple notification delivery mechanisms */
export type NotificationsInfo = {
  web?: WebNotifications
  apple?: AppleNotifications
  android?: AndroidNotifications
}
