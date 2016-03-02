'use strict'

var SenecaUser = require('seneca-user')

var defaults = {
  role: 'mosca-auth'
}

var senecaUserDefaults = {}

module.exports = function (opts) {

  var seneca = this

  opts = seneca.util.deepextend(defaults, opts)

  var userOpts = seneca.util.deepextend(senecaUserDefaults, opts)

  if (userOpts.role === 'mosca-auth') {
    userOpts.role = 'mosca-user'
  }

  seneca.use(SenecaUser, userOpts)
}

module.exports.setup = function (seneca, server) {
  server.authenticate = function authenticate (client, user, pass, cb) {
    if (!user || !pass) {
      cb(null, false)
      return
    }

    seneca.act({
      role: 'mosca-user',
      cmd: 'login',
      nick: user,
      password: pass.toString()
    }, (err, out) => {
      if (err) {
        cb(err)
        return
      }

      cb(null, out.ok)
    })
  }
}
