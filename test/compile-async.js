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

test('async okey: .compile(template, cb): passes compileFn to callback res', function (done) {
  var ret = es6template.compile('foo ${bar} baz', function (err, fn) {
    test.ifError(err)
    test.strictEqual(typeof fn, 'function')
    test.strictEqual(fn({
      bar: 'barry'
    }), 'foo barry baz')
    done()
  })
  test.strictEqual(ret, undefined)
})

test('async fail: .compile(template, cb): TypeError if compileFn get non-object locals', function (done) {
  var ret = es6template.compile('foo ${bar} baz', function (err, fn) {
    test.ifError(err)
    test.strictEqual(typeof fn, 'function')

    function fixture () {
      fn(1234)
    }

    test.throws(fixture, TypeError)
    test.throws(fixture, /expect `locals` to be an object/)
    done()
  })
  test.strictEqual(ret, undefined)
})

test('async fail: .compile(template, cb): ReferenceError if not in locals', function (done) {
  var ret = es6template.compile('foo ${bar} baz', function (err, fn) {
    test.ifError(err)
    test.strictEqual(typeof fn, 'function')

    function fixture () {
      fn({
        abc: 'foo'
      })
    }

    test.throws(fixture, ReferenceError)
    test.throws(fixture, /bar is not defined/)
    done()
  })
  test.strictEqual(ret, undefined)
})
