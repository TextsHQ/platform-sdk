import { parentPort } from 'worker_threads'
import { ConstructiblePlatformAPI } from '../PlatformAPI'
import type { BridgeToMainMessage, MainToBridgeMessage } from './types'

const DEBUG = !!process.env.DEBUG

const callParent = parentPort
  ? (message: BridgeToMainMessage) => { parentPort!.postMessage(message) }
  : (message: BridgeToMainMessage) => { process.send!(message) }

process.on('uncaughtException', err => {
  console.error('[Bridge Unhandled Exception]', err)
})
process.on('unhandledRejection', err => {
  console.error('[Bridge Unhandled Promise Rejection]', err)
})

export default function registerWorkerHandlers(accountID: string, PAPI: ConstructiblePlatformAPI) {
  const papi = new PAPI(accountID)
  const onMessageHandler = async (msg: 'cleanup' | 'powermonitor-on-resume' | MainToBridgeMessage) => {
    if (msg === 'cleanup' || msg === 'powermonitor-on-resume') return
    if (DEBUG) console.log('message from parent:', msg)
    switch (msg.type) {
      case 'call-method': {
        const { reqID, methodName, args, isCallback } = msg
        try {
          const method = papi[methodName as keyof ConstructiblePlatformAPI] as Function
          const result = await (isCallback
            ? method?.((...cbArgs: any[]) => {
              callParent({
                type: 'callback',
                methodName,
                args: cbArgs,
              })
            })
            : method?.(...args))
          callParent({
            type: 'method-result',
            reqID,
            result,
          })
        } catch (err: any) {
          console.error('bridge-entry error', { methodName, args }, err)
          callParent({
            type: 'method-result',
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
