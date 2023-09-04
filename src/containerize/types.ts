export const enum MessageType {
  MethodResult,
  Callback,
  CallMethod,
}

export type ContainerToMainMessage = {
  reqID: number
  type: MessageType.MethodResult
  result?: any
  error?: { name: string, message: string }
} | {
  type: MessageType.Callback
  methodName: string
  args: any[]
}

export type MainToContainerMessage = {
  reqID: number
  type: MessageType.CallMethod
  methodName: string
  args: any[]
  isCallback: boolean
}

export interface Container {
  // new(entryPointJSPath: string, dataDir: string, env: Record<string, string>): this
  readonly initPromise?: Promise<void>

  onMessage: (handler: (msg: ContainerToMainMessage) => void) => void
  postMessage: (msg: MainToContainerMessage) => void
  dispose: () => void
}
