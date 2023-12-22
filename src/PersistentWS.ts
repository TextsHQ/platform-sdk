import { setTimeout as sleep } from 'timers/promises'
import WebSocket from 'ws'
import { debounce } from 'lodash'
import { Awaitable, texts } from '.'

const MAX_RETRY_ATTEMPTS = Infinity
const getRetryTimeout = (attempt: number) =>
  Math.min(100 + (2 ** attempt + Math.random() * 100), 60_000)

export type WebSocketClientOptions = WebSocket.ClientOptions

const WAIT_DELAY_MS = 50
// similar to texts-app-desktop/src/renderer/ws-transport.ts
export default class PersistentWS {
  private ws: WebSocket | undefined

  private disposing = false

  private retryAttempt = 0

  private connectTimeout: ReturnType<typeof setTimeout> | undefined

  constructor(
    private readonly getConnectionInfo: () => Awaitable<{ endpoint: string, options?: WebSocket.ClientOptions }>,
    private readonly onMessage: (msg: Buffer) => void,
    private readonly onOpen?: () => void,
    private readonly onClose?: () => void,
  ) {}

  readonly connect = async () => {
    try {
      this.dispose()
    } catch (err) {
      texts.error('[PersistentWS] connect', err)
    }
    const retry = debounce(() => {
      if (++this.retryAttempt <= MAX_RETRY_ATTEMPTS) {
        clearTimeout(this.connectTimeout!)
        this.connectTimeout = setTimeout(this.connect, getRetryTimeout(this.retryAttempt))
      } else {
        this.disposing = true
      }
    }, 25)
    const { endpoint, options } = await this.getConnectionInfo()
    texts.log('[PersistentWS] connecting', endpoint)
    this.ws = new WebSocket(endpoint, options)
    this.ws
      .on('open', () => {
        texts.log('[PersistentWS] open')
        this.disposing = false
        this.retryAttempt = 0
        this.onOpen?.()
      })
      .on('message', this.onMessage)
      .on('close', code => {
        texts.log('[PersistentWS] close', { code })
        if (!this.disposing) retry()
        else this.disposing = false
        this.onClose?.()
      })
      .on('error', error => {
        console.error('[PersistentWS] error', error)
        if (!this.disposing) retry()
        else this.disposing = false
      })
  }

  get connected() {
    return this.ws && this.ws?.readyState === this.ws?.OPEN
  }

  private readonly waitAndSend = async (data: any): Promise<void> => {
    while (!this.connected) {
      if (this.disposing) return // we're dropping this data since we're disposing
      texts.log(`[PersistentWS] waiting ${WAIT_DELAY_MS}ms`, data)
      await sleep(WAIT_DELAY_MS)
    }
    this.send(data)
  }

  readonly send = (data: any): Promise<void> | undefined => {
    if (!this.connected) return this.waitAndSend(data)
    this.ws!.send(data)
  }

  dispose() {
    if (!this.ws) return
    this.disposing = true
    this.ws!.close()
  }
}
