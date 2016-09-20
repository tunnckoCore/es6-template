'use strict'

var utils = require('lazy-cache')(require)
var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign, no-global-assign

/**
 * Lazily required module dependencies
 */

require('gana')
require('is-buffer')
require('isobject', 'isObject')
require = fn // eslint-disable-line no-undef, no-native-reassign, no-global-assign

utils.tryCatch = function tryCatch (fn, cb) {
  var ret = null
  try {
    ret = fn()
  } catch (err) {
    cb(err)
    return
  }
  cb(null, ret)
}

/**
 * Expose `utils` modules
 */

module.exports = utils
