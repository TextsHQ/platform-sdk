# platform-sdk

### Loading an external platform on Texts.app

1. Create a file `~/.texts-conf.json`

2. Paste in:

```json
{
  "developer_mode": true,
  "external_platforms": [
    "/Users/kishan/Dropbox/Kishan/Texts/packages/platform-random/dist"
  ]
}
```

3. Each string in the `external_platforms` array is a path to a platform. This directory path should point to the JavaScript files (not TypeScript) and contain an `index.js` file and an `info.js` file.

4. Restart or launch Texts.app
