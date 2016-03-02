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

suite('authorizeSubscribe', () => {
  var server

  before((cb) => {
    Helper.createServer((err, a, b) => {
      server = a
      cb(err)
    })
  })

  after((cb) => {
    server.close(cb)
  })

  test('authorized', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    client.subscribe('hello', (err, granted) => {
      if (err) {
        return done(err)
      }
      expect(granted).to.deep.equal([{
        topic: 'hello',
        qos: 0
      }])
      client.end()
      done()
    })
    client.on('error', done)
  })

  test('negated', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    client.subscribe('wrong', (err, granted) => {
      if (err) {
        return done(err)
      }
      expect(granted).to.deep.equal([{
        topic: 'wrong',
        qos: 128
      }])
      client.end()
      done()
    })
    client.on('error', done)
  })

  test('successful with #', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    client.subscribe('a/#', (err, granted) => {
      if (err) {
        return done(err)
      }
      expect(granted).to.deep.equal([{
        topic: 'a/#',
        qos: 0
      }])
      client.end()
      done()
    })
    client.on('error', done)
  })

  test('successful with # bis', (done) => {
    var client = Mqtt.connect('mqtt://localhost', {
      username: 'mydevice',
      password: 'mypassword'
    })

    client.subscribe('a/b', (err, granted) => {
      if (err) {
        return done(err)
      }
      expect(granted).to.deep.equal([{
        topic: 'a/b',
        qos: 0
      }])
      client.end()
      done()
    })
    client.on('error', done)
  })
})
