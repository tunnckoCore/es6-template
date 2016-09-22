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

test('async okey: es6template(template, locals, callback)', function (done) {
  es6template('foo ${name} bar', {
    name: 'charlike'
  }, function (err, str) {
    test.ifError(err)
    test.strictEqual(str, 'foo charlike bar')
    done()
  })
})

test('async okey: render correctly the 0, null and undefined', function (done) {
  es6template('count ${cnt}! ${foo}ed? and ${undef}', {
    cnt: 0,
    foo: null,
    undef: undefined
  }, function (err, str) {
    test.ifError(err)
    test.strictEqual(str, 'count 0! nulled? and undefined')
    done()
  })
})

test('async fail: es6template(): ReferenceError if not in `locals`', function (done) {
  es6template('some not existing ${bar} here', {
    qux: 'charlike'
  }, function (err, str) {
    test.ifError(!err)
    test.strictEqual(err.name, 'ReferenceError')
    test.strictEqual(err.message, 'bar is not defined')
    done()
  })
})

test('async fail: es6template(123, cb): throws TypeError if `template` not a string', function (done) {
  es6template(123, function (err) {
    test.ifError(!err)
    test.strictEqual(err.name, 'TypeError')
    test.ok(/expect `template` to be a string/.test(err.message))
    done()
  })
})

test('async fail: es6template(str, 123, cb): throws TypeError if `locals` not an object', function (done) {
  es6template('foo bar', 123, function (err) {
    test.ifError(!err)
    test.strictEqual(err.name, 'TypeError')
    test.ok(/expect `locals` to be an object/.test(err.message))
    done()
  })
})
