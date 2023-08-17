export type BridgeToMainMessage = {
  reqID: number
  type: 'method-result'
  result?: any
  error?: { name: string, message: string }
} | {
  type: 'callback'
  methodName: string
  args: any[]
}

export type MainToBridgeMessage = {
  reqID: number
  type: 'call-method'
  methodName: string
  args: any[]
  isCallback: boolean
}
