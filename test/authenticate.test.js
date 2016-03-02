'use strict'

var Seneca = require('seneca')
var Mosca = require('Mosca')
var Mqtt = require('mqtt')
var moscaAuth = require('../')

var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var suite = lab.suite
var test = lab.test
var before = lab.before
var after = lab.after
var expect = Code.expect

suite('authenticate', function () {

  var server;
  var seneca;

  before(function (cb) {
    seneca = Seneca()
    seneca.use('../mosca-auth')
    server = new Mosca.Server({}, function (err) {
      if (err) { return cb(err) }

      moscaAuth.setup(seneca, server)

      seneca.act({
        role: 'mosca-user',
        cmd: 'register',
        nick: 'mydevice',
        email: 'matteo.collina@nearform.com',
        password: 'mypassword'
      }, cb)
    })
  })

  after(function (cb) {
    server.close(cb)
  })

  test('successful', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    client.on('error', done)

    client.on('connect', function () {
      client.end()
      done()
    })
  })

  test('missing user', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      password: 'mypassword'
    })

    client.on('error', function () {
      // error expected
      done()
    })
  })

  test('missing password', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice'
    })

    client.on('error', function () {
      // error expected
      done()
    })
  })

  test('wrong password', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'wrong'
    })

    client.on('error', function () {
      // error expected
      done()
    })
  })
})
