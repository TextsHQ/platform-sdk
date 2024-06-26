export const getDataURI = (buffer: Buffer, mimeType = '') =>
  `data:${mimeType};base64,${buffer.toString('base64')}`

const isArray = <T>(x: T) => Array.isArray(x)

const isString = <T>(x: T) => typeof x === 'string'

const isObject = <T>(x: T) => typeof x === 'object' && x !== null

const isBufferLike = (x: any) => isObject(x) && x.type === 'Buffer' && (isArray(x.data) || isString(x.data))

/* handles `Buffer`s and `BigInt`s better */
export const smartJSONStringify = (obj: unknown, space?: string | number) =>
  JSON.stringify(obj, (key: string, value: any) => {
    if (typeof value === 'bigint') return value.toString()
    if (isBufferLike(value)) return getDataURI(Buffer.from(value.data))
    return value
  }, space)

export function tryParseJSON<FallbackType>(json: string, fallback?: FallbackType) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export const htmlTitleRegex = /<title[^>]*>(.*?)<\/title>/

export class ExpectedJSONGotHTMLError extends Error {
  constructor(statusCode: number, html: string) {
    const [, title] = htmlTitleRegex.exec(html) || []
    super(`expected json, got html, status code=${statusCode}, title=${title}`)
  }
}
