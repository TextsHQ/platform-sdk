import type SentryNode from '@sentry/node'
import type React from 'react'
import type { Worker } from 'worker_threads'
import type { FetchFunction, FetchStreamFunction } from './fetch'

export type TextsGlobals = {
  IS_DEV: boolean

  log: (...args: any[]) => void
  error: (...args: any[]) => void

  constants: {
    USER_AGENT: string
    APP_VERSION: string
    BUILD_DIR_PATH: string
  }

  Sentry: typeof SentryNode
  React?: typeof React

  trackPlatformEvent?: (data: any) => Promise<void>
  runWorker?: (workerFilePath: string, workerData: any) => Worker

  fetch?: FetchFunction
  fetchStream?: FetchStreamFunction
}
