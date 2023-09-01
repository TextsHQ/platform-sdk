export type ContainerToMainMessage = {
  reqID: number
  type: 'method-result'
  result?: any
  error?: { name: string, message: string }
} | {
  type: 'callback'
  methodName: string
  args: any[]
}

export type MainToContainerMessage = {
  reqID: number
  type: 'call-method'
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
