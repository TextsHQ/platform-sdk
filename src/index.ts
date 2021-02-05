import type SentryNode from '@sentry/node'
import type React from 'react'
import type { Worker } from 'worker_threads'

export * from './enums'
export * from './errors'
export * from './types'
export * from './constants'

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
}

export const texts = (globalThis as any).texts as TextsGlobals
