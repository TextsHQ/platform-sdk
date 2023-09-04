import { parentPort } from 'worker_threads'
import { ConstructiblePlatformAPI } from '../PlatformAPI'
import { MessageType, ContainerToMainMessage, MainToContainerMessage } from './types'

const DEBUG = !!process.env.DEBUG

const callParent = parentPort
  ? (message: ContainerToMainMessage) => { parentPort!.postMessage(message) }
  : (message: ContainerToMainMessage) => { process.send!(message) }

process.on('uncaughtException', err => {
  console.error('[Container Unhandled Exception]', err)
})
process.on('unhandledRejection', err => {
  console.error('[Container Unhandled Promise Rejection]', err)
})

export default function registerWorkerHandlers(accountID: string, PAPI: ConstructiblePlatformAPI) {
  const papi = new PAPI(accountID)
  const onMessageHandler = async (msg: 'cleanup' | 'powermonitor-on-resume' | MainToContainerMessage) => {
    if (msg === 'cleanup' || msg === 'powermonitor-on-resume') return
    if (DEBUG) console.log('message from parent:', msg)
    switch (msg.type) {
      case MessageType.CallMethod: {
        const { reqID, methodName, args, isCallback } = msg
        try {
          const method = papi[methodName as keyof ConstructiblePlatformAPI] as Function
          const result = await (isCallback
            ? method?.((...cbArgs: any[]) => {
              callParent({
                type: MessageType.Callback,
                methodName,
                args: cbArgs,
              })
            })
            : method?.(...args))
          callParent({
            type: MessageType.MethodResult,
            reqID,
            result,
          })
        } catch (err: any) {
          console.error('container-entry error', { methodName, args }, err)
          callParent({
            type: MessageType.MethodResult,
            reqID,
            error: { name: err.name, message: err.message },
          })
        }
        return
      }
      default:
        console.log(msg)
        throw Error('unknown message')
    }
  }

  (parentPort ?? process).on('message', onMessageHandler)
}
