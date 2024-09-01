import type { TextsNodeGlobals, TextsRendererGlobals } from './TextsGlobals'
import { SocksProxyAgent } from 'socks-proxy-agent'

export * from './enums'
export * from './errors'
export * from './constants'
export * from './fetch'
export * from './generic'
export * from './CustomEmoji'
export * from './Message'
export * from './Attachment'
export * from './Notifications'
export * from './PhoneNumber'
export * from './Platform'
export * from './PlatformAPI'
export * from './PlatformInfo'
export * from './ServerEvent'
export * from './TextAttributes'
export * from './Thread'
export * from './ThreadFolderName'
export * from './User'
export * from './StickerPack'
export * from './IAsyncSqlite'
export * from './util'
export type { ProxyConfig, PlatformConfig } from './Platform';

// Ensure the globalThis texts is of correct type
export const texts = (globalThis as any).texts as TextsNodeGlobals
export const textsRenderer = (globalThis as any).texts as TextsRendererGlobals



// // Wrap the original createHttpClient method
// const originalCreateHttpClient = texts.createHttpClient.bind(texts)

// // Define a new createHttpClient method with proxy support
// texts.createHttpClient = (options: any & { proxy?: ProxyConfig }) => {
//   // Check if proxy options are provided
//   if (options.proxy) {
//     const { protocol, host, port, auth } = options.proxy
//     const proxyUrl = `${protocol}://${auth ? `${auth.username}:${auth.password}@` : ''}${host}:${port}`
    
//     // Set the appropriate agent based on the protocol
//     if (protocol === 'socks4' || protocol === 'socks5') {
//       options.agent = new SocksProxyAgent(proxyUrl)
//     } else {
//       options.agent = new HttpsProxyAgent(proxyUrl)
//     }
//   }

//   // Call the original createHttpClient with the updated options
// //   return originalCreateHttpClient(options)
// }
