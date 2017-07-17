# Content Bot v2.0
A rewrite of Content Bot featuring ES6 classes and Commando. 

## About
Why did I make this? I was bored and wanted something to do. Bots are fun, right?

## Requirements
- `Node v8`
- (Optional) `yarn`
- `ffmpeg`

## Installation
1. You will need to create a file in the root called `secret.json` that looks like this:

```json
{
    "token": "your secret token here",
    "github": {
      "username": "you",
      "password": "pass"
    },
    "imgur": {
      "clientID": "your imgur client ID"
    },
    "youtube": {
      "api_key": "your youtube API key"
    }
}
```

2. Run `npm install` or `yarn`.

3. Run `npm start`.

## Contributing

Read the contribution guide for more information.