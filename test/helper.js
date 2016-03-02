'use strict'

var Seneca = require('seneca')
var Mosca = require('mosca')
var MoscaAuth = require('../')

module.exports.createServer = function (cb) {
  var seneca = Seneca()
  seneca.use(MoscaAuth)
  var server = new Mosca.Server({}, function (err) {
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
      publishPatterns: ['hello', 'a/#', 'b/+']
    }, function (err) {
      cb(err, server, seneca)
    })
  })
}
