export type UserAgentHeaders = {
  'Sec-Ch-Prefers-Color-Scheme': 'light' | 'dark'
  'Sec-Ch-Ua': string
  'Sec-Ch-Ua-Full-Version-List': string
  'Sec-Ch-Ua-Mobile': string
  'Sec-Ch-Ua-Platform': string
  'Sec-Ch-Ua-Platform-Version': string
  'Viewport-Width': string
  'Dpr': string
}

export type UserAgentClientHints = {
  brands?: { brand: string, version: string }[]
  fullVersionList?: { brand: string, version: string }[]
  mobile: boolean
  model: string
  platform: string
  platformVersion: string
}
