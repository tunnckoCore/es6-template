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

test('sync okey: es6template(template, locals)', function (done) {
  var str = es6template('foo ${bar} qux', {
    bar: 'tunnckoCore'
  })
  test.strictEqual(str, 'foo tunnckoCore qux')
  done()
})

test('sync throw: es6template(123): throws TypeError if `template` not a string', function (done) {
  function fixture () {
    es6template(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `template` to be a string/)
  done()
})

test('sync throw: es6template(str, 123): throws TypeError if `locals` not an object', function (done) {
  function fixture () {
    es6template('foo bar baz', 123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `locals` to be an object/)
  done()
})

test('sync throw: es6template(): ReferenceError if not in `locals`', function (done) {
  function fixture () {
    es6template('not existing ${xyz} here', {
      qux: 'foo'
    })
  }
  test.throws(fixture, ReferenceError)
  test.throws(fixture, /xyz is not defined/)
  done()
})

test('should be able to accept Vinyl-like file as first arg', function (done) {
  var file = {
    contents: 'support ${filetype} files'
  }
  var str = es6template(file, {
    filetype: 'vinyl-like'
  })
  test.strictEqual(str, 'support vinyl-like files')
  done()
})
