<h1 align="center"><img src="https://user-images.githubusercontent.com/904724/31862570-6cab4562-b740-11e7-8cb2-c608548cbc31.png" width="350" alt="Mono Push"/></h1>

> Push module for [Mono](https://github.com/terrajs/mono)

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

Example of activating `socket.io` and writing events in `pushes` collection (`conf/application.js`):

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

In your files, you can access the `push` and `pushAll` methods like this:

### Push an event to authenticated user matching a query

`push(event: string, query: object = {}, payload: object = {})`

### Push an event to all connected sockets

`pushAll(event: string, payload: object = {})`

## Example

```js
const { push, pushAll } = require('mono-push')

await push('notification', { userId: '...' }, { type: 'email' })
// userId will be matched against authenticated users

await pushAll('message', { message: 'Welcome!' })
// Send it to all connected devices
```

With conf `io: true`, mono-push will emit an event to every socket connected that matches the query.

On client-side, the user must connect with the [socket.io-client](https://github.com/socketio/socket.io-client):

```js
import io from 'socket.io-client'

const socket = io('http://localhost:8000/push')

const token = '...' // JWT generate by await jwt.generateJWT(session), see Mono

socket.on('connect', () => {
  socket
    .emit('authenticate', { token })
    .on('authenticated', function () {
      console.log('Authenticated')
    })
    .on('unauthorized', function (msg) {
      console.log('Unauthorized')
    })

  // Listen on push events
  socket.on('my-event', (event) {
    // event is { message: 'Welcome!' }
  })
})
```
