import type React from 'react'
import type { PhoneNumber } from './PhoneNumber'
import type { PlatformAPI, LoginCreds, LoginResult } from './PlatformAPI'
import type { PlatformInfo } from './PlatformInfo'


export type AuthProps = {
  isReauthing?: boolean
  api?: PlatformAPI
  login?: (creds?: LoginCreds) => Promise<LoginResult>
  meContact?: {
    fullName?: string
    phoneNumbers?: PhoneNumber[]
    emailAddresses?: string[]
  }

  nmp?: any
  Tooltip?: React.FC<any>
  children?: React.ReactNode
}

export interface Platform {
  info: PlatformInfo
  api: PlatformAPI
  auth?: React.LazyExoticComponent<React.FC<AuthProps> | React.ComponentClass<AuthProps>>
  proxyConfig?: ProxyConfig;
}
export interface ProxyConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https' | 'socks4' | 'socks5';
  auth?: {
    username: string;
    password: string;
  };
}

export interface PlatformConfig {
  proxyConfig?: ProxyConfig;
}