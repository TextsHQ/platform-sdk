import type { CookieJar } from 'tough-cookie'
import type { Readable } from 'stream'
import type { IncomingHttpHeaders } from 'http'

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE'
  headers?: Record<string, string>
  searchParams?: Record<string, number | string>
  form?: Record<string, number | string>
  body?: string | Buffer | Readable
  cookieJar?: CookieJar
}

export type FetchResponse = {
  statusCode: number
  headers: IncomingHttpHeaders
  body: Buffer
}

export type FetchFunction = (url: string, opts?: FetchOptions) => Promise<FetchResponse>

export type FetchStreamFunction = (url: string, opts?: FetchOptions) => Promise<Readable>
