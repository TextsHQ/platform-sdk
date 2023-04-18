import type { CookieJar } from 'tough-cookie'
import type SentryNode from '@sentry/node'
import type React from 'react'
import type ReactDOM from 'react-dom'
import type { Worker } from 'worker_threads'
import type { FetchFunction, FetchOptions, FetchResponse, FetchStreamFunction } from './fetch'
import type { FSPath } from './generic'
import type { BrowserWindowProps } from './PlatformInfo'

export type TextsGlobals = {
  IS_DEV: boolean
  isLoggingEnabled: boolean

  log: (...args: any[]) => void
  error: (...args: any[]) => void

  constants: {
    USER_AGENT: string
    APP_VERSION: string
    BUILD_DIR_PATH: FSPath
  }

  Sentry: typeof SentryNode

  React?: typeof React
  ReactDOM?: typeof ReactDOM

  trackPlatformEvent?: (data: any) => Promise<void>
  runWorker?: (workerFilePath: FSPath, workerData: any) => Worker

  getOriginalObject?: (platformName: string, accountID: string, args: [string, string]) => string

  openBrowserWindow: (props: BrowserWindowProps) => Promise<{
    lastURL: string
    cookieJar: CookieJar.Serialized
    jsCodeResult?: any
  }>

  fetch?: FetchFunction
  fetchStream?: FetchStreamFunction
  createHttpClient: () => {
    requestAsString: (url: string, opts?: FetchOptions) => Promise<FetchResponse<string>>
    requestAsBuffer: (url: string, opts?: FetchOptions) => Promise<FetchResponse<Buffer>>
  }
}
