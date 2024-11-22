import type { ChildProcess, ForkOptions } from 'child_process'
import type { Worker } from 'worker_threads'
import type { Readable } from 'stream'
import type { CookieJar } from 'tough-cookie'
import type React from 'react'
import type ReactDOM from 'react-dom'
import type ReactJSXRuntime from 'react/jsx-runtime'
import type { FetchFunction, FetchOptions, FetchResponse, FetchStreamFunction } from './fetch'
import type { Awaitable, FSPath } from './generic'
import type { BrowserWindowProps, PlatformInfo } from './PlatformInfo'

export interface TextsGlobalsCommon {
  IS_DEV: boolean
  isLoggingEnabled: boolean

  log: (...args: any[]) => void
  error: (...args: any[]) => void

  constants: {
    USER_AGENT: string
    APP_VERSION: string
  }

  Sentry: {
    captureMessage: Function
    captureException: Function
    startTransaction: Function
  }

  getBinariesDirPath: (platformName: PlatformInfo['name']) => FSPath
  trackPlatformEvent: (data: any) => Awaitable<void>
}

export interface TextsRendererGlobals extends TextsGlobalsCommon {
  React: typeof React
  ReactDOM: typeof ReactDOM
  ReactJSXRuntime: typeof ReactJSXRuntime
}

export interface TextsNodeGlobals extends TextsGlobalsCommon {
  runWorker: (entryFilePath: FSPath, workerData: any) => Worker
  forkChildProcess: (entryFilePath: FSPath, options: ForkOptions, initData: any) => ChildProcess

  getOriginalObject: (platformName: string, accountID: string, args: [string, string]) => string

  openBrowserWindow: (accountID: string, props: BrowserWindowProps) => Promise<{
    lastURL: string
    cookieJar: CookieJar.Serialized
    jsCodeResult?: any
    headers?: Record<string, string> | string
  }>

  fetch: FetchFunction
  fetchStream: FetchStreamFunction
  nativeFetch: (accountID: string, url: string, opts?: FetchOptions) => Promise<FetchResponse<Buffer>>
  nativeFetchStream: (accountID: string, url: string, opts?: FetchOptions) => Promise<Readable>
  createHttpClient: () => {
    requestAsString: (url: string, opts?: FetchOptions) => Promise<FetchResponse<string>>
    requestAsBuffer: (url: string, opts?: FetchOptions) => Promise<FetchResponse<Buffer>>
  }
}
