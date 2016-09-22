/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var gana = require('gana')
var tryCatch = require('try-catch-callback')

/**
 * > Render `template` with `locals` and optionally
 * pass a `cb` callback. If no callback is passed,
 * the rendered `string` is returned. It is alias
 * of and acts like `.render` method.
 *
 * **Example**
 *
 * ```js
 * var es6template = require('es6-template')
 *
 * var template = 'Hello ${ucfirst(author.name)} and have a ${mood} day!'
 * var locals = {
 *   author: {
 *     name: 'charlike'
 *   },
 *   mood: 'nice',
 *   ucfirst: function ucfirst (val) {
 *     return val.charAt(0).toUpperCase() + val.slice(1)
 *   }
 * }
 *
 * // synchronous
 * var str = es6template(template, locals)
 * console.log(str)
 * // => 'Hello Charlike and have a nice day!'
 *
 * // async
 * es6template(template, locals, function cb (err, res) {
 *   if (err) return console.error(err)
 *
 *   console.log(res)
 *   // => 'Hello Charlike and have a nice day!'
 * })
 * ```
 *
 * @name   es6template
 * @param  {String}   `<template>` string to be rendered.
 * @param  {Object}   `<locals>` data to be used in `template`.
 * @param  {Function} `[cb]` callback with `cb(err, res)` signature.
 * @return {String} if no `cb` is passed.
 * @api public
 */
var es6template = module.exports = function es6template (template, locals, cb) {
  return es6template.render(template, locals, cb)
}

/**
 * > Compile a `template` to a function that
 * can accept `locals` object to render a string.
 * If `cb` is passed, it pass a `compileFn` as result.
 * It's a [gana][] mirror, so if there's a problem,
 * so please report it in the [gana][]'s issue tracker.
 *
 * **Example**
 *
 * ```js
 * var es6template = require('es6-template')
 *
 * var template = 'You, ${uppercase(name)}, are awesome ${person}!'
 * var locals = {
 *   name: 'charlike',
 *   person: 'developer',
 *   uppercase: function uppercase (val) {
 *     return val.toUpperCase()
 *   }
 * }
 *
 * // sync
 * var compileFn = es6template.compile(template)
 * var result = compileFn(locals)
 * console.log(result)
 * // => 'You, CHARLIKE, are awesome developer!'
 *
 * // asynchronous, gives you `compileFn` in the callback
 * es6template.compile(template, function cb (err, compileFn) {
 *   if (err) return console.error(err)
 *
 *   var result = compileFn(locals)
 *   console.log(result)
 *   // => 'You, CHARLIKE, are awesome developer!'
 * })
 * ```
 *
 * @name   .compile
 * @param  {String}   `<template>` string to be compile to a function.
 * @param  {Function} `[cb]` callback with `cb(err, compileFn)` signature.
 * @return {Function} if no `cb` is passed.
 * @api public
 */
es6template.compile = function compile (template, cb) {
  return gana(template, cb)
}

/**
 * > Renders a `template` with `locals`.
 * If no `cb` is passed, returns a rendered string,
 * otherwise pass the result to `cb` callback function.
 * Acts like a `es6template()` which is mirror of this one.
 * If there are some problems, please report them to
 * the [gana][] or [gana-compile][] issue trackers, because
 * this basically is `gana(template)(locals)`.
 *
 * **Example**
 *
 * ```js
 * var es6template = require('es6-template')
 *
 * var str = es6template.render('Hello ${name}.', { name: 'Charlike' })
 * console.log(str)
 * // => 'Hello Charlike.'
 * ```
 *
 * @name   .render
 * @param  {String}   `<template>` string to be rendered.
 * @param  {Object}   `<locals>` data to be used in `template`.
 * @param  {Function} `[cb]` callback with `cb(err, res)` signature.
 * @return {String} if no `cb` is passed.
 * @api public
 */
es6template.render = function render (template, locals, cb) {
  if (typeof locals === 'function') {
    cb = locals
    locals = false
  }
  if (typeof cb === 'function') {
    es6template.compile(template, function (err, fn) {
      if (err) return cb(err)
      tryCatch(function () {
        return fn(locals)
      }, cb)
    })
    return
  }
  return gana(template)(locals)
}
