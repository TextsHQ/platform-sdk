const PREFIX = 'BEGIN:VCARD'
const POSTFIX = 'END:VCARD'

/**
 * Return json representation of vCard
 */
export function parseVCard(string: string) {
  const result = {}
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
    let key = pieces.shift()
    let value: string | string[] = pieces.join(':')
    let namespace = ''
    const meta = {}

    // meta fields in property
    if (key.match(/;/)) {
      key = key
        .replace(/\\;/g, 'ΩΩΩ')
        .replace(/\\,/, ',')
      const metaArr = key.split(';').map(item => item.replace(/ΩΩΩ/g, ';'))
      key = metaArr.shift()
      metaArr.forEach(item => {
        const arr = item.split('=')
        arr[0] = arr[0].toLowerCase()
        if (arr[0].length === 0) {
          return
        }
        if (meta[arr[0]]) {
          meta[arr[0]].push(arr[1])
        } else {
          meta[arr[0]] = [arr[1]]
        }
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

    const newValue: any = {
      value,
    }
    if (Object.keys(meta).length) {
      newValue.meta = meta
    }
    if (namespace) {
      newValue.namespace = namespace
    }

    if (key.indexOf('X-') !== 0) {
      key = key.toLowerCase()
    }

    if (typeof result[key] === 'undefined') {
      result[key] = [newValue]
    } else {
      result[key].push(newValue)
    }
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
    value = value.replace(/\\,/g, ',')
    return splitValue(value, ';')
  } if (value.match(HAS_COMMA_SEPARATOR)) {
    value = value.replace(/\\;/g, ';')
    return splitValue(value, ',')
  }
  return value
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
}
/**
* Split vcard field value by separator
* @param {string|string[]} value
*/
function splitValue(value: any, separator: string): string | string[] {
  const separatorRegexp = new RegExp(separator)
  const escapedSeparatorRegexp = new RegExp('\\\\' + separator, 'g')
  // easiest way, replace it with really rare character sequence
  value = value.replace(escapedSeparatorRegexp, 'ΩΩΩ')
  if (value.match(separatorRegexp)) {
    value = value.split(separator)
    value = value.map(item => item.replace(/ΩΩΩ/g, separator))
  } else {
    value = value.replace(/ΩΩΩ/g, separator)
  }
  return value
}
