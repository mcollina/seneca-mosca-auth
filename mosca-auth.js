'use strict'

var SenecaUser = require('seneca-user')
var Qlobber = require('qlobber').Qlobber

var defaults = {
  role: 'mosca-auth',
  user: {
    fields: {
      publishPatterns: [],
      subscribePatterns: []
    }
  }
}

var qlobberDefaults = {
  separator: '/',
  wildcard_one: '+',
  wildcard_some: '#'
}

module.exports = function (opts) {

  var seneca = this

  opts = seneca.util.deepextend(defaults, opts)

  var role = opts.role

  seneca.use(SenecaUser, opts)

  //seneca.add({
  //  role: role,
  //  cmd: 'publish-patterns'
  //}, function (args, cb) {
  //  var seneca = this
  //  var deviceent = seneca.make(deviceCanon)
  //  var device = deviceent.make$()

  //  cb()
  //})
}

module.exports.setup = function (seneca, server, opts) {
  opts = opts || {}
  var role = opts.role || defaults.role
  server.authenticate = function authenticate (client, user, pass, cb) {
    if (!user || !pass) {
      cb(null, false)
      return
    }

    seneca.act({
      role: role,
      cmd: 'login',
      nick: user,
      password: pass.toString()
    }, (err, out) => {
      if (err) {
        cb(err)
        return
      }
      var user = out.user
      if (user) {
        client.publishPatterns = new Qlobber(qlobberDefaults)
        ;(user.publishPatterns || []).forEach(addPattern, client.publishPatterns)
        client.subscribePatterns = new Qlobber(qlobberDefaults)
        ;(user.subscribePatterns || []).forEach(addPattern, client.subscribePatterns)
      }

      cb(null, out.ok)
    })
  }

  server.authorizePublish = function authorizePublish (client, topic, payload, cb) {
    cb(null, client.publishPatterns.match(topic).length > 0)
  }

  server.authorizeSubscribe = function authorizeSubscribe (client, topic, cb) {
    cb(null, client.publishPatterns.match(topic).length > 0)
  }
}

function addPattern (pattern) {
  this.add(pattern, true)
}
