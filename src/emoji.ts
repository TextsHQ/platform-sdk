import getEmojiRegex from 'emoji-regex'

export const emojiRegex = getEmojiRegex()
const whitespaceRegexGlobal = /[\s\u200B-\u200D\uFEFF]+/g

// export const isEmojiOnlyString = (string: string) =>
//   typeof string === 'string'
//     && string.replace(emojiRegex, '')
//       .length === 0

export const isEmojiOrSpacesOnlyString = (string: string): boolean =>
  typeof string === 'string'
    && string.length > 0
    && string
      .replace(emojiRegex, '')
      .replace(whitespaceRegexGlobal, '')
      .length === 0
