'use strict'

var Mqtt = require('mqtt')

var Helper = require('./helper')
var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var suite = lab.suite
var test = lab.test
var before = lab.before
var after = lab.after
var expect = Code.expect

suite('authenticate', () => {

  var server;
  var seneca;

  before((cb) => {
    Helper.createServer((err, a, b) => {
      server = a
      seneca = b
      cb(err)
    })
  })

  after((cb) => {
    server.close(cb)
  })

  test('successful', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    client.on('error', done)

    client.on('connect', () => {
      client.end()
      client.removeAllListeners('error')
      client.on('error', noop)
      done()
    })
  })

  test('missing user', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      password: 'mypassword'
    })

    client.on('error', () => {
      // error expected
      done()
      client.removeAllListeners('error')
      client.on('error', noop)
    })
  })

  test('missing password', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice'
    })

    client.on('error', () => {
      // error expected
      done()
      client.removeAllListeners('error')
      client.on('error', noop)
    })
  })

  test('wrong password', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'wrong'
    })

    client.on('error', () => {
      // error expected
      done()
      client.removeAllListeners('error')
      client.on('error', noop)
    })
  })
})

function noop () {}
