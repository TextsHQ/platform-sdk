import { setTimeout as sleep } from 'timers/promises'
import WebSocket from 'ws'
import { debounce } from 'lodash'
import { Awaitable, texts } from '.'

const MAX_RETRY_ATTEMPTS = Infinity
const getRetryTimeout = (attempt: number) => // 60s after 16 attempts
  Math.min(Math.floor(100 + (2 ** attempt + (Math.random() * 100))), 60_000)

export type WebSocketClientOptions = WebSocket.ClientOptions

const WAIT_DELAY_MS = 50
// similar to texts-app-desktop/src/renderer/ws-transport.ts
export default class PersistentWS {
  private ws: WebSocket | undefined

  private disposing = false

  private retryAttempt = 0

  private connectTimeout: ReturnType<typeof setTimeout> | undefined

  private lastOpen: Date | undefined

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
      texts.error('[PersistentWS] connect dispose error', err)
    }
    const retry = debounce(() => { // this debounce may be unnecessary
      if (++this.retryAttempt <= MAX_RETRY_ATTEMPTS) {
        const retryAfter = getRetryTimeout(this.retryAttempt)
        texts.log('[PersistentWS] will retry after', retryAfter, 'ms')
        clearTimeout(this.connectTimeout!)
        this.connectTimeout = setTimeout(this.connect, retryAfter)
      } else {
        this.disposing = true
      }
    }, 25)
    const { endpoint, options } = await this.getConnectionInfo()
    texts.log(`[PersistentWS] ${this.lastOpen ? 're' : ''}connecting`, endpoint)
    this.ws = new WebSocket(endpoint, options)
    this.ws
      .on('open', () => {
        texts.log('[PersistentWS] open', this.lastOpen ? `${(this.lastOpen.getTime() - Date.now()) / 1_000}s` : '')
        this.lastOpen = new Date()
        this.disposing = false
        this.retryAttempt = 0
        this.onOpen?.()
      })
      .on('message', this.onMessage)
      .on('close', code => {
        texts.log('[PersistentWS] close', { code })
        if (this.disposing) this.disposing = false
        else retry()
        this.onClose?.()
      })
      .on('error', error => {
        console.error('[PersistentWS] error', error)
        if (this.disposing) this.disposing = false
        else retry()
      })
  }

  /**
   * Note: this isn't always accurate, the internet could be down/turned off and this may still return true
   * */
  get connected() {
    return this.ws && this.ws?.readyState === this.ws?.OPEN
  }

  private readonly waitAndSend = async (data: any): Promise<void> => {
    while (!this.connected) {
      if (this.disposing) return // we're dropping this data since we're disposing
      texts.log(`[PersistentWS] waiting ${WAIT_DELAY_MS}ms`)
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
    this.lastOpen = undefined
    this.disposing = true
    this.ws!.close()
  }
}
