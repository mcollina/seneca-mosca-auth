'use strict'

const SenecaUser = require('seneca-user')
const Qlobber = require('qlobber').Qlobber

const defaults = {
  role: 'mosca-auth',
  user: {
    fields: {
      publishPatterns: [],
      subscribePatterns: []
    }
  }
}

const qlobberDefaults = {
  separator: '/',
  wildcard_one: '+',
  wildcard_some: '#'
}

module.exports = function (opts) {
  const seneca = this
  opts = seneca.util.deepextend(defaults, opts)
  seneca.use(SenecaUser, opts)
}

module.exports.setup = function (seneca, server, opts) {
  opts = opts || {}
  const role = opts.role || defaults.role
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
      const user = out.user
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
    cb(null, client.subscribePatterns.match(topic).length > 0)
  }
}

function addPattern (pattern) {
  this.add(pattern, true)
}
