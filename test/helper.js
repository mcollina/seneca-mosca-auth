'use strict'

const Seneca = require('seneca')
const Mosca = require('mosca')
const MoscaAuth = require('../')

module.exports.createServer = function (cb) {
  var seneca = Seneca()
  seneca.use(MoscaAuth)
  var server = new Mosca.Server({}, (err) => {
    if (err) {
      return cb(err)
    }

    MoscaAuth.setup(seneca, server)

    seneca.act({
      role: 'mosca-auth',
      cmd: 'register',
      nick: 'mydevice',
      email: 'matteo.collina@nearform.com',
      password: 'mypassword',
      publishPatterns: ['hello', 'a/#', 'b/+'],
      subscribePatterns: ['hello', 'a/#', 'b/+']
    }, (err) => {
      cb(err, server, seneca)
    })
  })
}
