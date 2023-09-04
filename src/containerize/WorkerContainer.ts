import type { Worker } from 'worker_threads'

import { texts } from '..'
import type { Container, ContainerToMainMessage, MainToContainerMessage } from './types'

export default class WorkerContainer implements Container {
  private worker: Worker

  constructor(
    entryPointJSPath: string,
    env: Record<string, string>,
  ) {
    Object.assign(process.env, env)
    this.worker = texts.runWorker(entryPointJSPath, { noSentry: true })
  }

  onMessage(handler: (msg: ContainerToMainMessage) => void) {
    this.worker.on('message', handler)
  }

  postMessage(msg: MainToContainerMessage) {
    this.worker.postMessage(msg)
  }

  dispose() {
    this.worker.terminate()
  }
}
