<h1 align="center"><img src="https://user-images.githubusercontent.com/739984/31306827-f257e8d6-ab57-11e7-89da-a1bc7489a6d8.png" width="350" alt="Mono Push"/></h1>

> MonoPush module for [Mono](https://github.com/terrajs/mono)

[![npm version](https://img.shields.io/npm/v/mono-push.svg)](https://www.npmjs.com/package/mono-push)
[![Travis](https://img.shields.io/travis/terrajs/mono-push/master.svg)](https://travis-ci.org/terrajs/mono-push)
[![Coverage](https://img.shields.io/codecov/c/github/terrajs/mono-push/master.svg)](https://codecov.io/gh/terrajs/mono-push.js)
[![license](https://img.shields.io/github/license/terrajs/mono-push.svg)](https://github.com/terrajs/mono-push/blob/master/LICENSE)

## Installation

```bash
npm install --save mono-push
```

Then, in your configuration file of your Mono application (example: `conf/application.js`):

```js
module.exports = {
  mono: {
    modules: [
      'mono-mongodb',
      'mono-push'
    ]
  }
}
```

mono-push requires [mono-mongodb](https://github.com/terrajs/mono-mongodb), so it must be installed and declared before mono-push because modules are loaded synchronously

## Configuration

mono-push will use the `push` property of your configuration:

- `io`: Activate push event via [socket.io](https://socket.io)
  - Type: `boolean`
  - Default: `false`
  - Requires: [mono-io](https://github.com/terrajs/mono-io)
- `collectionName`: Collection name in [MongoDB](https://www.mongodb.com)
  - Type: `string`
  - Default: `'mono-pushes'`

Example of activating `socket.io` and writing events in `pushs` collection (`conf/application.js`):

```js
module.exports = {
  mono: {
    modules: [
      'mono-mongodb', // Required by mono-push
      'mono-io', // Required by mono-push when io is true
      'mono-push'
    ],
    push: {
      io: true,
      collectionName: 'pushes'
    }
  }
}
```

## Usage

In your files, you can access `send` helper like this:

`send(event: string, query: object = {}, payload: object = {})`

Example:

```js
const { send } = require('mono-push')

await send('new-push', { userId: '...' }, { message: 'Welcome!' })
```

With conf `io: true`, mono-push will emit an event to every socket connected that matches the query.

On client-side, the user must connect with the [socket.io-client](https://github.com/socketio/socket.io-client):

> TODO
