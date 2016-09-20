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

test('sync okey: .render(template, locals)', function (done) {
  var str = es6template.render('foo ${bar} qux', {
    bar: 'tunnckoCore'
  })
  test.strictEqual(str, 'foo tunnckoCore qux')
  done()
})

test('sync throw: .render(123): throws Error if no 2 arguments', function (done) {
  function fixture () {
    es6template.render(123)
  }
  test.throws(fixture, Error)
  test.throws(fixture, /expect at least 2 arguments/)
  done()
})

test('sync throw: .render(123, locals): throws TypeError if `template` not a string', function (done) {
  function fixture () {
    es6template(123, {foo: 'bar'})
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `template` to be a string/)
  done()
})

test('sync throw: .render(str, 123): throws TypeError if `locals` not an object', function (done) {
  function fixture () {
    es6template.render('foo bar baz', 123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `locals` to be an object/)
  done()
})

test('sync throw: .render(): ReferenceError if not in `locals`', function (done) {
  function fixture () {
    es6template.render('not existing ${xyz} here', {
      qux: 'foo'
    })
  }
  test.throws(fixture, ReferenceError)
  test.throws(fixture, /xyz is not defined/)
  done()
})
