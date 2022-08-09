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
