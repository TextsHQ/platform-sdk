# platform-sdk

### Loading an external platform on Texts.app

1. Create a file `~/.texts-conf.json` (`touch ~/.texts-conf.json`) and open it in an editor

2. Paste in:

```json
{
  "developer_mode": true,
  "external_platforms": [
    "/Users/kishan/Dropbox/Kishan/Texts/packages/platform-random/dist"
  ]
}
```

3. Each string in the `external_platforms` array is a path to a platform's entry point which should export a `Platform` object. This directory path should point to the JavaScript files (not TypeScript).

4. Restart or launch Texts.app
