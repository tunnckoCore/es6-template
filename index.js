/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var sliced = require('sliced')
var extend = require('extend-shallow')
var get = require('get-value')
var re = require('es6-template-regex')

function template (str) {
  var data = {}
  sliced(arguments, 1).forEach(function (obj) {
    data = extend(data, obj)
  })
  return str.replace(re(), function (m, prop) {
    if (prop && prop.indexOf('.') !== -1) {
      return get(data, prop)
    }
    return data[prop] || prop
  })
}

template.render = template
template.compile = function compile (str) {
  return function (data) {
    sliced(arguments).forEach(function (obj) {
      data = extend(data, obj)
    })
    return template(str, data)
  }
}

module.exports = template
