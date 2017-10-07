<h1 align="center"><img src="https://user-images.githubusercontent.com/739984/31306827-f257e8d6-ab57-11e7-89da-a1bc7489a6d8.png" width="350" alt="Mono Push"/></h1>

> MonoPush module for [Mono](https://github.com/terrajs/mono)

[![npm version](https://img.shields.io/npm/v/@terrajs/mono-push.svg)](https://www.npmjs.com/package/@terrajs/mono-push)
[![Travis](https://img.shields.io/travis/terrajs/mono-push/master.svg)](https://travis-ci.org/terrajs/mono-push)
[![Coverage](https://img.shields.io/codecov/c/github/terrajs/mono-push/master.svg)](https://codecov.io/gh/terrajs/mono-push.js)
[![license](https://img.shields.io/github/license/terrajs/mono-push.svg)](https://github.com/terrajs/mono-push/blob/master/LICENSE)

## Installation

```bash
npm install --save @terrajs/mono-push
```

Then, in your configuration file of your Mono application (example: `conf/application.js`):

```js
module.exports = {
  mono: {
    modules: [
      '@terrajs/mono-mongodb',
      '@terrajs/mono-push'
    ]
  }
}
```

mono-push requires [mono-mongodb](https://github.com/terrajs/mono-mongodb), so it must be installed and declared before mono-push because modules are loaded synchronously

## Configuration

mono-push will use the `push` property of your configuration (example: `conf/development.js`):

```js
module.exports = {
  mono: {
    push: {
      io: true
    }
  }
}
```

When using `io: true`, mono-push requires [mono-io](https://github.com/terrajs/mono-io), so it must be installed and declared (example: `conf/application.js`):

```js
module.exports = {
  mono: {
    modules: [
      '@terrajs/mono-mongodb',
      '@terrajs/mono-io',
      '@terrajs/mono-push'
    ]
  }
}
```

## Usage

In your modules files, you can access `send` helper like this:

`send(event: string, query: object = {}, payload: object = {})`

Example:

```js
const { send } = require('@terrajs/mono-push')

await send('new-push', { userId: '...' }, { message: 'Welcome!' })
```

With conf `io: true`, mono-push will emit an event to every socket connected that matches the query
