import type { TextEntity } from './TextAttributes'

export function parseMessageTemplate(text: string, senderID: string): TextEntity[] {
  const regex = /{{(.*?)}}/g
  return [...text.matchAll(regex)]
    .map<TextEntity>(m => ({ from: m.index!, to: m.index! + m[0].length, mentionedUser: { id: m[1] === 'sender' ? senderID : m[1] } }))
}
