# Google Spreadsheet to JSON

## Setup

### 1. Google Cloud Project

To use Apps Script API, please enable Apps Script API with your Google account.
https://script.google.com/home/usersettings

### 2. Create clasp.json

Please put your scriptId to clasp.json.example and rename it to clasp.json.

### Install modules

`npm install`

### Login to Google (necessary to publish from your local)

`npx clasp login`

or, if you don't have browser on local env,

`npx clasp login --no-localhost`

This command will show a url to login to google. Please login with your google account.

And then, paste a credential which shown in the browser into shell.

## Deploy

```
npm run deploy
```

##### only push

```
npm run push
```

- Run test
- Push to transpiled code to App Script Project
- Deploy as library which referred by each SpreadSheet
