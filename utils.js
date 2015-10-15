/* jshint asi:true */

'use strict'

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require) // eslint-disable-line no-undef, no-native-reassign
var fn = require

require = utils // eslint-disable-line no-undef, no-native-reassign
require('es6-template-regex', 'regex')
require('extend-shallow')
require('get-value')
require('sliced')
require = fn // eslint-disable-line no-undef, no-native-reassign

/**
 * Expose `utils` modules
 */

module.exports = utils
