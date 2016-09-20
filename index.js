/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */
'use strict'

var utils = require('./utils')

var es6template = module.exports = function es6template (template, locals, cb) {
  template = utils.isObject(template) && !utils.isBuffer(template)
    ? template.contents
    : template
  template = utils.isBuffer(template) ? template.toString() : template

  if (typeof locals === 'function') {
    cb = locals
    locals = null
  }
  if (typeof cb === 'function') {
    utils.tryCatch(function () {
      return utils.gana(template)
    }, function (err, fn) {
      if (err) return cb(err)
      utils.tryCatch(function () {
        return fn(locals)
      }, cb)
    })
    return
  }

  return es6template.returnCompileFn
    ? utils.gana(template)
    : utils.gana(template)(locals)
}

es6template.render = function render (template, locals, cb) {
  if (arguments.length < 2) {
    throw new Error('es6template.render: expect at least 2 arguments')
  }
  es6template.returnCompileFn = false
  return es6template(template, locals, cb)
}

es6template.compile = function compile (template, cb) {
  es6template.returnCompileFn = true

  if (typeof cb === 'function') {
    utils.tryCatch(function () {
      return es6template(template)
    }, cb)
    return
  }
  return es6template(template)
}
