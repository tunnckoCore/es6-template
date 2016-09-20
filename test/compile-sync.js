/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var test = require('mukla')
var es6template = require('../index')

/* eslint-disable no-template-curly-in-string */

test('sync okey: .compile(template) returns function', function (done) {
  var fn = es6template.compile('foo ${bar} baz')
  var str = fn({
    bar: 'barry'
  })
  test.strictEqual(str, 'foo barry baz')
  done()
})

test('sync fail: .compile(123): throw TypeError if `template` not a string', function (done) {
  function fixture () {
    es6template.compile(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `template` to be a string/)
  done()
})

test('sync fail: .compile(template)(123): throw TypeError if `locals` not an object', function (done) {
  var fn = es6template.compile('foo ${bar} baz')
  function fixture () {
    fn(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `locals` to be an object/)
  done()
})

test('sync fail: .compile(template)(object): throw ReferenceError if not in locals', function (done) {
  var fn = es6template.compile('foo ${bar} baz')
  function fixture () {
    fn({
      qux: 'yea'
    })
  }
  test.throws(fixture, ReferenceError)
  test.throws(fixture, /bar is not defined/)
  done()
})

test('.compile(file): able to accept Vinyl-like file as first arg', function (done) {
  var file = {
    contents: 'support ${filetype} files'
  }
  var fn = es6template.compile(file)
  var str = fn({
    filetype: 'vinyl-like'
  })
  test.strictEqual(str, 'support vinyl-like files')
  done()
})
