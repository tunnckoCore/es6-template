/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var template = require('./index')

test('should match es6 template delimiters in a string', function (done) {
  var str = 'foo ${bar} baz ${quux}'
  var data = {bar: 'AAA', quux: 'BBB'}
  test.strictEqual(template(str, data), 'foo AAA baz BBB')
  done()
})

test('should accept and merge multiple `data` arguments', function (done) {
  var str = 'foo ${bar} baz ${quux}'
  test.strictEqual(template(str, {bar: 'AAA'}, {quux: 'BBB'}), 'foo AAA baz BBB')
  done()
})

test('should returned fn from .compile() accept multiple `data` arguments', function (done) {
  var fn = template.compile('foo ${bar} baz ${qux.name}')
  test.strictEqual(fn({bar: 'bar'}, {qux: {name: 'Charlike'}}), 'foo bar baz Charlike')
  done()
})

test('should work with dot property paths like `a.b.c`', function (done) {
  var str = 'Hello ${foo} and ${user.name}!'
  var data = {
    foo: 'bar',
    user: {
      name: 'Charlike'
    }
  }
  test.strictEqual(template(str, data), 'Hello bar and Charlike!')
  done()
})

test('should es6template.compile() return function', function (done) {
  var fn = template.compile('foo ${bar} baz')
  test.strictEqual(fn({bar: 'BAR'}), 'foo BAR baz')
  done()
})

test('should es6template.render() be same as es6template()', function (done) {
  var actual = template.render('foo ${bar} baz', {bar: 'QUUX'})
  test.strictEqual(actual, 'foo QUUX baz')
  done()
})

test('should be able to escape dot property paths', function (done) {
  var actual = template.render('foo ${foo\\.bar} baz', {'foo.bar': '~BAR~'})
  test.strictEqual(actual, 'foo ~BAR~ baz')
  done()
})

test('should render empty strings correctly', function (done) {
  var actual = template.render('hello ${name}!', {name: ''})
  test.strictEqual(actual, 'hello !')
  done()
})
