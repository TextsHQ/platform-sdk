const PREFIX = 'BEGIN:VCARD'
const POSTFIX = 'END:VCARD'

type Value = {
  value: string | string[]
  meta?: Record<string, string[]>
  namespace?: string
}
/**
 * Return json representation of vCard
 */
export function parseVCard(string: string) {
  const result: Record<string, Value[]> = {}
  const lines = string.split(/\r\n|\r|\n/)
  const count = lines.length

  /**
   * Check that next line continues current
   */
  const isValueContinued = (i: number) => i + 1 < count && (lines[i + 1][0] === ' ' || lines[i + 1][0] === '\t')

  for (let i = 0; i < count; i++) {
    if (lines[i] === '') {
      continue
    }
    if (lines[i].toUpperCase() === PREFIX || lines[i].toUpperCase() === POSTFIX) {
      continue
    }
    let data = lines[i]

    // handle multiline properties (i.e. photo).
    // next line should start with space or tab character
    if (isValueContinued(i)) {
      while (isValueContinued(i)) {
        data += lines[i + 1].trim()
        i++
      }
    }

    const pieces = data.split(':')
    let key = pieces.shift()!
    let value: string | string[] = pieces.join(':')
    let namespace = ''
    const meta: Record<string, string[]> = {}

    // meta fields in property
    if (key.match(/;/)) {
      key = key
        .replace(/\\;/g, 'ΩΩΩ')
        .replace(/\\,/, ',')
      const metaArr = key.split(';').map(item => item.replace(/ΩΩΩ/g, ';'))
      key = metaArr.shift()!
      metaArr.forEach(item => {
        const arr = item.split('=')
        arr[0] = arr[0].toLowerCase()
        if (arr[0].length === 0) return
        meta[arr[0]] ||= []
        meta[arr[0]].push(arr[1])
      })
    }

    // values with \n
    value = value
      .replace(/\\n/g, '\n')

    value = tryToSplit(value)

    // Grouped properties
    if (key.match(/\./)) {
      const arr = key.split('.');
      [namespace, key] = arr
    }

    const newValue: Value = { value }
    if (Object.keys(meta).length) {
      newValue.meta = meta
    }
    if (namespace) {
      newValue.namespace = namespace
    }

    if (!key.startsWith('X-')) {
      key = key.toLowerCase()
    }

    result[key] ||= []
    result[key].push(newValue)
  }

  return result
}

const HAS_SEMICOLON_SEPARATOR = /[^\\];|^;/
const HAS_COMMA_SEPARATOR = /[^\\],|^,/

/**
 * Split value by "," or ";" and remove escape sequences for this separators
 */
function tryToSplit(value: string): string | string[] {
  if (value.match(HAS_SEMICOLON_SEPARATOR)) {
    const replaced = value.replace(/\\,/g, ',')
    return splitValue(replaced, ';')
  }
  if (value.match(HAS_COMMA_SEPARATOR)) {
    const replaced = value.replace(/\\;/g, ';')
    return splitValue(replaced, ',')
  }
  return value
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
}
/**
* Split vcard field value by separator
*/
function splitValue(value: string, separator: string): string | string[] {
  const separatorRegexp = new RegExp(separator)
  const escapedSeparatorRegexp = new RegExp('\\\\' + separator, 'g')
  // easiest way, replace it with really rare character sequence
  const replaced = value.replace(escapedSeparatorRegexp, 'ΩΩΩ')
  if (replaced.match(separatorRegexp)) {
    return replaced.split(separator).map(item => item.replace(/ΩΩΩ/g, separator))
  }
  return replaced.replace(/ΩΩΩ/g, separator)
}
