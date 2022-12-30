import type { TextEntity } from './TextAttributes'

export function parseMessageTemplate(text: string, senderID: string): TextEntity[] {
  const regex = /{{(.*?)}}/g
  const toScalarIndex = (idx: number) => Array.from(text.substring(0, idx)).length
  return [...text.matchAll(regex)].map<TextEntity>(m => ({
    from: toScalarIndex(m.index!),
    to: toScalarIndex(m.index! + m[0].length),
    mentionedUser: { id: m[1] === 'sender' ? senderID : m[1] },
  }))
}
