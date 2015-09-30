/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var sliced = require('sliced')
var extend = require('extend-shallow')
var regex = require('es6-template-regex')
var get = require('get-value')

/**
 * > Acts like `.render` by default.
 * Renders given `str` with `locals`.
 *
 * **Example**
 *
 * ```js
 * es6template('foo ${bar} baz ${quux}', {bar: 'BAR'}, {quux: 'QUUX'})
 * //=> 'foo BAR baz QUUX'
 * ```
 *
 * @name   es6template
 * @param  {String} `str` template to populate with `locals`
 * @param  {Object} `locals` locals object
 * @return {String} rendered string
 * @api public
 */
var template = module.exports = function es6template (str, locals) {
  return templateFn.apply(this, arguments)
}

/**
 * >  Renders given `str` with `locals`. You can give unlimited
 * number of object arguments after the first - they will be
 * merged and passed as single locals object.
 *
 * **Example**
 *
 * ```js
 * es6template.render('Hello ${place} and ${user.name}!', {
 *   place: 'world',
 *   user: {
 *     name: 'Charlike'
 *   }
 * })
 * //=> 'Hello world and Charlike!'
 * ```
 *
 * @name   .render
 * @param  {String} `str` template to populate with `locals`
 * @param  {Object} `locals` locals object
 * @return {String} rendered string
 * @api public
 */
template.render = function render (str, locals) {
  return templateFn.apply(this, arguments)
}

/**
 * > Compiles given string and returns function which accepts
 * unlimited number of `locals` object arguments.
 *
 * **Example**
 *
 * ```js
 * var fn = es6template.compile('Hello ${place} and ${user.name}!')
 * fn({place: 'world', user: {name: 'Charlike'}})
 * //=> 'Hello world and Charlike!'
 * ```
 *
 * @name   .compile
 * @param  {String} `str` template to populate
 * @return {Function} which accepts `locals` objects
 * @api public
 */
template.compile = function compile (str) {
  return function (locals) {
    sliced(arguments).forEach(function (obj) {
      locals = extend(locals, obj)
    })
    return templateFn(str, locals)
  }
}

/**
 * Main template render function
 *
 * @param  {String} `str`
 * @return {String}
 */
function templateFn (str) {
  var data = {}
  sliced(arguments, 1).forEach(function (obj) {
    data = extend(data, obj)
  })
  return str.replace(regex(), function (m, prop) {
    if (prop && prop.indexOf('.') !== -1) {
      return get(data, prop, true)
    }
    return data[prop] || prop
  })
}
