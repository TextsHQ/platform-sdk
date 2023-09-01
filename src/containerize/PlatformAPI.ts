import { promises as fs } from 'fs'
import { parentPort } from 'worker_threads'

import { PlatformAPI, ClientContext, SerializedSession } from '..'
import type { Container, ContainerToMainMessage, MainToContainerMessage } from './types'

// this is like PlatformAPIRelayer
class ContainerizedPlatformAPI implements Partial<PlatformAPI> {
  private container: Container | undefined

  private readonly requestQueue = new Map<number, { resolve: Function, reject: Function }>()

  // key: methodName, value: callback
  private readonly callbacks = new Map<string, Function>()

  private requestId = 0

  private callMethod<T>(methodName: string, args: any[], isCallback = false) {
    return new Promise<T>((resolve, reject) => {
      const reqID = ++this.requestId
      this.requestQueue.set(reqID, { resolve, reject })
      this.container!.postMessage({
        type: 'call-method',
        reqID,
        methodName,
        args,
        isCallback,
      } as MainToContainerMessage)
    })
  }

  private readonly handleWorkerCleanupMessage = (value: any) => {
    if (value === 'cleanup') {
      this.dispose()
    }
  }

  private async initContainer(dataDirPath: string) {
    await fs.mkdir(dataDirPath, { recursive: true })
    parentPort?.on('message', this.handleWorkerCleanupMessage)
    this.container = this.containerConstructor(dataDirPath)
    await this.container.initPromise
    this.container.onMessage((msg: ContainerToMainMessage) => {
      switch (msg.type) {
        case 'method-result': {
          const { reqID, result, error } = msg
          if (this.requestQueue.has(reqID)) {
            const promise = this.requestQueue.get(reqID)
            if (promise) {
              if (error) {
                promise.reject(new Error(error.name + ' ' + error.message))
              } else { // result can be undefined
                promise.resolve(result)
              }
            }
            this.requestQueue.delete(reqID)
          } else {
            throw Error('unknown method-result message')
          }
          return
        }
        case 'callback': {
          const { methodName, args } = msg
          this.callbacks.get(methodName)?.(...args)
          break
        }
        default:
          console.log(msg)
          throw Error('unknown ContainerToMainMessage')
      }
    })
  }

  constructor(private readonly containerConstructor: (dataDirPath: string) => Container) {
    // eslint-disable-next-line no-constructor-return
    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) return (target as any)[prop]
        return (...args: any[]) => {
          if (typeof args[0] === 'function') {
            target.callbacks.set(prop as string, args[0])
            return target.callMethod(prop as string, [], true)
          }
          return target.callMethod(prop as string, args)
        }
      },
      has: () => true,
    })
  }

  readonly init = async (session: SerializedSession, clientContext: ClientContext) => {
    await this.initContainer(clientContext.dataDirPath)
    return this.callMethod<void>('init', [session, clientContext])
  }

  readonly dispose = async () => {
    await this.callMethod('dispose', [])
    this.container?.dispose()
    parentPort?.off('message', this.handleWorkerCleanupMessage)
  }
}

export default ContainerizedPlatformAPI
