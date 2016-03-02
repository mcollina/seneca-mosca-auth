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

suite('authorizePublish', function () {

  var server;
  var seneca;

  before(function (cb) {
    Helper.createServer(function (err, a, b) {
      server = a
      seneca = b
      cb(err)
    })
  })

  after(function (cb) {
    server.close(cb)
  })

  test('authorized', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    server.on('published', function (packet) {
      var topic = packet.topic
      var payload = packet.payload
      if (topic === 'hello' && payload.toString() === 'world') {
        done()
      }
    })

    client.publish('hello', 'world')
    client.on('error', done)
  })

  test('authorized #', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    server.on('published', function (packet) {
      var topic = packet.topic
      var payload = packet.payload
      if (topic === 'a/b/c' && payload.toString() === 'world') {
        done()
      }
    })

    client.publish('a/b/c', 'world')
    client.on('error', done)
  })

  test('authorized +', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    server.on('published', function (packet) {
      var topic = packet.topic
      var payload = packet.payload
      if (topic === 'b/c' && payload.toString() === 'world') {
        done()
      }
    })

    client.publish('b/c', 'world')
    client.on('error', done)
  })

  test('negated', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    server.on('published', function (packet) {
      var topic = packet.topic
      var payload = packet.payload
      if (topic === 'wrong' && payload.toString() === 'world') {
        client.removeAllListeners('error')
        client.on('error', noop)
        done(new Error('this should never happen'))
      }
    })

    client.publish('wrong', 'world')
    client.on('error', done)
    client.on('offline', function () {
      client.end()
      client.removeAllListeners('error')
      client.on('error', noop)
      done()
    })
  })

  test('negated +', function (done) {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    server.on('published', function (packet) {
      var topic = packet.topic
      var payload = packet.payload
      if (topic === 'b/c/d' && payload.toString() === 'world') {
        client.removeAllListeners('error')
        client.on('error', noop)
        done(new Error('this should never happen'))
      }
    })

    client.publish('b/c/d', 'world')
    client.on('error', done)
    client.on('offline', function () {
      client.end()
      client.removeAllListeners('error')
      client.on('error', noop)
      done()
    })
  })
})

function noop () {}
