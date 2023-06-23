# platform-sdk

### Loading an external platform on Texts.app

Either:

1. Hit ⌘ J (or Ctrl+J on Windows/Linux)
2. Type "install platform"
3. Click "Load platform directory" (directory should point to the JavaScript files)
4. Relaunch Texts.app

Or:

1. Create a file `~/.texts-conf.json` (`touch ~/.texts-conf.json`) and open it in an editor

2. Paste in:

```json
{
  "developer_mode": true,
  "external_platforms": [
    "/Users/kb/Dropbox/Texts/packages/platform-random"
  ]
}
```

3. Each string in the `external_platforms` array is a path to a platform's entry point which should export a `Platform` object. This directory path should point to the JavaScript files (not TypeScript).

4. Restart or launch Texts.app

### Logs

Run this in Terminal.app:
```
/Applications/Texts.app/Contents/MacOS/Texts --log-level=dev
```

## Creating a platform integration

A platform integration can be roughly divided into three parts:

1. the network layer, responsible for sending network requests and subscribing to real-time events (code for this go into `network-api.ts` or are imported from a third party module)
2. the mapping layer, which converts the original platform data structures into structures that Texts understands (`mappers.ts`)
3. the `PlatformAPI` [interface](https://github.com/TextsHQ/platform-sdk/blob/master/src/types.ts#:~:text=PlatformAPI), which binds the network layer, mapping layer and implements an interface that Texts can call (`api.ts`).

Information and attributes about the platform go into the `info.ts` file.

### Getting started

1. It's important to get the network layer working first to avoid complicating things. Write a simple CLI script that connects to the platform, fetches the threads/messages and prints it to the console, and run it using `node dist/script.js` 
2. Once it's working with node, test if it runs with Electron using `electron dist/script.js` — this will work fine unless there are native dependencies.
3. After getting the network layer working well, you can proceed with creating the integration. Here's [a boilerplate](https://github.com/TextsHQ/platform-boilerplate).

There are four main objects defined by the SDK:

`Message`: a single message belonging to a thread

`Thread`: a thread that can contain many messages and many participants along with pagination information

`User`: a user present on the platform

`Participant`: a `User` extended with properties like `isAdmin` or `hasExited`, belonging to a thread

### Building

While developing, run `tsc --watch` to automatically transpile TypeScript files to JavaScript on changes.

### Prioritized order of implementing `PlatformAPI` functionality

- Authentication (`init`, `getCurrentUser`, `login`, `serializeSession`)
- `getThreads`
- `getMessages`
- `sendMessage`
- ...

TypeScript typings do not need to be implemented manually for data structures returned by the server unless provided by a library.

**User-Agent**

`platform-sdk` exports a `texts` object. `texts.constants.USER_AGENT` provides the `User-Agent` to use for all network interactions. The browser login window will use this `User-Agent` constant as well.

**Cookie jar**

`platform-sdk` exports a `texts` object. We recommend using methods exposed by `texts.createHttpClient` for all network interactions since it handles the cookie jar automatically – new cookies sent by the server will automatically be updated in the jar. This jar should be serialized by `serializeSession` so that it's persisted.

`**ReAuthError**`

When the user logs out from all sessions using a regular web browser, the session will be invalid and throw an error. This error must be handled gracefully and instead `ReAuthError` should be thrown. This will cause Texts to ask the user to re-authenticate the account.

### Electron intricacies

This is only relevant if you're depending on native dependencies. 

Native deps must be recompiled for Electron since Electron ships with a patched version of Node.js. [electron-rebuild](https://github.com/electron/electron-rebuild) lets you do this. Native deps depending on N-API don't need recompilation / electron-rebuild.

The Electron desktop app runs three processes/threads:

- Main process (no platform code is loaded)
- Renderer process (`PlatformInfo` is loaded from `info.ts`)
- Worker thread (`PlatformAPI` is loaded from `api.ts`)
