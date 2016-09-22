/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var gana = require('gana')

var es6template = module.exports = function es6template (template, locals, cb) {
  return es6template.render(template, locals, cb)
}

es6template.compile = function compile (template, cb) {
  return gana(template, cb)
}

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

/**
 * try/catch block with callback
 *
 * @param  {Function} `fn`
 * @param  {Function} `cb`
 * @api private
 */

function tryCatch (fn, cb) {
  var ret = null
  try {
    ret = fn()
  } catch (err) {
    cb(err)
    return
  }
  cb(null, ret)
}
