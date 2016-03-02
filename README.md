# seneca-mosca-auth

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]

Authentication and Authorization for [Mosca](http://npm.im/mosca) using [Seneca](http://npm.im/seneca) and [Seneca User](http://npm.im/seneca-user).

This is a specialization of [Seneca User](http://npm.im/seneca-user)
for this specific use case. Go there and have a look for the full
docs. The default role is changed from `'user'` to `'mosca-auth'`.

## Install

```
npm i mosca seneca-mosca-auth --save
```

## Usage

```js
'use strict'

const Mosca = require('mosca')
const Seneca = require('seneca')
const MoscaAuth = require('seneca-mosca-auth')

var seneca = Seneca()
seneca.use(MoscaAuth)
var server = new Mosca.Server()

// configures Mosca to authenticate via seneca
MoscaAuth.setup(seneca, server)

// register a user
seneca.act({
  role: 'mosca-auth',
  cmd: 'register',
  nick: 'mydevice',
  email: 'matteo.collina@nearform.com',
  password: 'mypassword',
  publishPatterns: ['hello', 'a/#', 'b/+'],
  subscribePatterns: ['hello', 'a/#', 'b/+']
})
```

<a name="acknowledgements"></a>
## Acknowledgements

This project was kindly sponsored by [nearForm](http://nearform.com).

## License

MIT

[npm-badge]: https://badge.fury.io/js/seneca-mosca-auth.svg
[npm-url]: https://badge.fury.io/js/seneca-mosca-auth
[travis-badge]: https://api.travis-ci.org/mcollina/seneca-mosca-auth.svg
[travis-url]: https://travis-ci.org/mcollina/seneca-mosca-auth
