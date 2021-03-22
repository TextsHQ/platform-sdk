import type { PlatformAPI } from './PlatformAPI'
import type { PlatformInfo } from './PlatformInfo'

export interface Platform {
  info: PlatformInfo
  api: PlatformAPI
}
