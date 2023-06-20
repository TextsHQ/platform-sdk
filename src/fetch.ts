import type FormData from 'form-data'
import type { CookieJar } from 'tough-cookie'
import type { Readable } from 'stream'
import type { IncomingHttpHeaders } from 'http'

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE'
  headers?: Record<string, string>
  searchParams?: Record<string, number | string>
  form?: Record<string, number | string>
  body?: string | Buffer | FormData | Readable
  cookieJar?: CookieJar
  /** @default true */
  followRedirect?: boolean
}

export type FetchResponse<T> = {
  statusCode: number
  headers: IncomingHttpHeaders
  body: T
}

export type FetchFunction = (url: string, opts?: FetchOptions) => Promise<FetchResponse<Buffer>>

export type FetchStreamFunction = (url: string, opts?: FetchOptions) => Promise<Readable>
