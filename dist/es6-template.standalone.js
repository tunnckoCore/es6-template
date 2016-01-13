(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.es6Template = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

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
    utils.sliced(arguments).forEach(function (obj) {
      locals = utils.extendShallow(locals, obj)
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
  utils.sliced(arguments, 1).forEach(function (obj) {
    data = utils.extendShallow(data, obj)
  })
  return str.replace(utils.regex(), function (m, prop) {
    if (prop && prop.indexOf('.') !== -1) {
      return utils.getValue(data, prop)
    }
    return typeof data[prop] !== 'undefined' ? data[prop] : ''
  })
}

},{"./utils":9}],2:[function(require,module,exports){
/*!
 * es6-template-regex <https://github.com/jonschlinkert/es6-template-regex>
 * Copyright (c) 2014-2015, Jon Schlinkert, 2014 Lo-Dash 2.4.1 <http://lodash.com/>
 * Licensed under the MIT License.
 *
 * Used to match ES template delimiters
 * See: http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components
 */

module.exports = function es6regex() {
  return /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
};

},{}],3:[function(require,module,exports){
'use strict';

var isObject = require('is-extendable');

module.exports = function extend(o/*, objects*/) {
  if (!isObject(o)) { o = {}; }

  var len = arguments.length;
  for (var i = 1; i < len; i++) {
    var obj = arguments[i];

    if (isObject(obj)) {
      assign(o, obj);
    }
  }
  return o;
};

function assign(a, b) {
  for (var key in b) {
    if (hasOwn(b, key)) {
      a[key] = b[key];
    }
  }
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

},{"is-extendable":5}],4:[function(require,module,exports){
/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function(obj, prop, a, b, c) {
  if (!isObject(obj) || !prop) {
    return obj;
  }

  prop = toString(prop);

  // allowing for multiple properties to be passed as
  // a string or array, but much faster (3-4x) than doing
  // `[].slice.call(arguments)`
  if (a) prop += '.' + toString(a);
  if (b) prop += '.' + toString(b);
  if (c) prop += '.' + toString(c);

  if (prop in obj) {
    return obj[prop];
  }

  var segs = prop.split('.');
  var len = segs.length;
  var i = -1;

  while (obj && (++i < len)) {
    var key = segs[i];
    while (key[key.length - 1] === '\\') {
      key = key.slice(0, -1) + '.' + segs[++i];
    }
    obj = obj[key];
  }
  return obj;
};

function isObject(val) {
  return val !== null && (typeof val === 'object' || typeof val === 'function');
}

function toString(val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val.join('.');
  }
  return val;
}

},{}],5:[function(require,module,exports){
/*!
 * is-extendable <https://github.com/jonschlinkert/is-extendable>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isExtendable(val) {
  return typeof val !== 'undefined' && val !== null
    && (typeof val === 'object' || typeof val === 'function');
};

},{}],6:[function(require,module,exports){
(function (process){
'use strict';

/**
 * Cache results of the first function call to ensure only calling once.
 *
 * ```js
 * var utils = require('lazy-cache')(require);
 * // cache the call to `require('ansi-yellow')`
 * utils('ansi-yellow', 'yellow');
 * // use `ansi-yellow`
 * console.log(utils.yellow('this is yellow'));
 * ```
 *
 * @param  {Function} `fn` Function that will be called only once.
 * @return {Function} Function that can be called to get the cached function
 * @api public
 */

function lazyCache(fn) {
  var cache = {};
  var proxy = function(mod, name) {
    name = name || camelcase(mod);

    // check both boolean and string in case `process.env` cases to string
    if (process.env.UNLAZY === 'true' || process.env.UNLAZY === true || process.env.TRAVIS) {
      cache[name] = fn(mod);
    }

    Object.defineProperty(proxy, name, {
      enumerable: true,
      configurable: true,
      get: getter
    });

    function getter() {
      if (cache.hasOwnProperty(name)) {
        return cache[name];
      }
      return (cache[name] = fn(mod));
    }
    return getter;
  };
  return proxy;
}

/**
 * Used to camelcase the name to be stored on the `lazy` object.
 *
 * @param  {String} `str` String containing `_`, `.`, `-` or whitespace that will be camelcased.
 * @return {String} camelcased string.
 */

function camelcase(str) {
  if (str.length === 1) {
    return str.toLowerCase();
  }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  return str.replace(/[\W_]+(\w|$)/g, function(_, ch) {
    return ch.toUpperCase();
  });
}

/**
 * Expose `lazyCache`
 */

module.exports = lazyCache;

}).call(this,require('_process'))

},{"_process":7}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){

/**
 * An Array.prototype.slice.call(arguments) alternative
 *
 * @param {Object} args something with a length
 * @param {Number} slice
 * @param {Number} sliceEnd
 * @api public
 */

module.exports = function (args, slice, sliceEnd) {
  var ret = [];
  var len = args.length;

  if (0 === len) return ret;

  var start = slice < 0
    ? Math.max(0, slice + len)
    : slice || 0;

  if (sliceEnd !== undefined) {
    len = sliceEnd < 0
      ? sliceEnd + len
      : sliceEnd
  }

  while (len-- > start) {
    ret[len - start] = args[len];
  }

  return ret;
}


},{}],9:[function(require,module,exports){
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

},{"es6-template-regex":2,"extend-shallow":3,"get-value":4,"lazy-cache":6,"sliced":8}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtdGVtcGxhdGUtcmVnZXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXh0ZW5kLXNoYWxsb3cvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ2V0LXZhbHVlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLWV4dGVuZGFibGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbGF6eS1jYWNoZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc2xpY2VkL2luZGV4LmpzIiwidXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBlczYtdGVtcGxhdGUgPGh0dHBzOi8vZ2l0aHViLmNvbS90dW5uY2tvQ29yZS9lczYtdGVtcGxhdGU+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IENoYXJsaWtlIE1pa2UgUmVhZ2VudCA8QHR1bm5ja29Db3JlPiAoaHR0cDovL3d3dy50dW5uY2tvY29yZS50aylcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG5cbi8qKlxuICogPiBBY3RzIGxpa2UgYC5yZW5kZXJgIGJ5IGRlZmF1bHQuXG4gKiBSZW5kZXJzIGdpdmVuIGBzdHJgIHdpdGggYGxvY2Fsc2AuXG4gKlxuICogKipFeGFtcGxlKipcbiAqXG4gKiBgYGBqc1xuICogZXM2dGVtcGxhdGUoJ2ZvbyAke2Jhcn0gYmF6ICR7cXV1eH0nLCB7YmFyOiAnQkFSJ30sIHtxdXV4OiAnUVVVWCd9KVxuICogLy89PiAnZm9vIEJBUiBiYXogUVVVWCdcbiAqIGBgYFxuICpcbiAqIEBuYW1lICAgZXM2dGVtcGxhdGVcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmAgdGVtcGxhdGUgdG8gcG9wdWxhdGUgd2l0aCBgbG9jYWxzYFxuICogQHBhcmFtICB7T2JqZWN0fSBgbG9jYWxzYCBsb2NhbHMgb2JqZWN0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJlbmRlcmVkIHN0cmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xudmFyIHRlbXBsYXRlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlczZ0ZW1wbGF0ZSAoc3RyLCBsb2NhbHMpIHtcbiAgcmV0dXJuIHRlbXBsYXRlRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG4vKipcbiAqID4gIFJlbmRlcnMgZ2l2ZW4gYHN0cmAgd2l0aCBgbG9jYWxzYC4gWW91IGNhbiBnaXZlIHVubGltaXRlZFxuICogbnVtYmVyIG9mIG9iamVjdCBhcmd1bWVudHMgYWZ0ZXIgdGhlIGZpcnN0IC0gdGhleSB3aWxsIGJlXG4gKiBtZXJnZWQgYW5kIHBhc3NlZCBhcyBzaW5nbGUgbG9jYWxzIG9iamVjdC5cbiAqXG4gKiAqKkV4YW1wbGUqKlxuICpcbiAqIGBgYGpzXG4gKiBlczZ0ZW1wbGF0ZS5yZW5kZXIoJ0hlbGxvICR7cGxhY2V9IGFuZCAke3VzZXIubmFtZX0hJywge1xuICogICBwbGFjZTogJ3dvcmxkJyxcbiAqICAgdXNlcjoge1xuICogICAgIG5hbWU6ICdDaGFybGlrZSdcbiAqICAgfVxuICogfSlcbiAqIC8vPT4gJ0hlbGxvIHdvcmxkIGFuZCBDaGFybGlrZSEnXG4gKiBgYGBcbiAqXG4gKiBAbmFtZSAgIC5yZW5kZXJcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmAgdGVtcGxhdGUgdG8gcG9wdWxhdGUgd2l0aCBgbG9jYWxzYFxuICogQHBhcmFtICB7T2JqZWN0fSBgbG9jYWxzYCBsb2NhbHMgb2JqZWN0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJlbmRlcmVkIHN0cmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xudGVtcGxhdGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyIChzdHIsIGxvY2Fscykge1xuICByZXR1cm4gdGVtcGxhdGVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbi8qKlxuICogPiBDb21waWxlcyBnaXZlbiBzdHJpbmcgYW5kIHJldHVybnMgZnVuY3Rpb24gd2hpY2ggYWNjZXB0c1xuICogdW5saW1pdGVkIG51bWJlciBvZiBgbG9jYWxzYCBvYmplY3QgYXJndW1lbnRzLlxuICpcbiAqICoqRXhhbXBsZSoqXG4gKlxuICogYGBganNcbiAqIHZhciBmbiA9IGVzNnRlbXBsYXRlLmNvbXBpbGUoJ0hlbGxvICR7cGxhY2V9IGFuZCAke3VzZXIubmFtZX0hJylcbiAqIGZuKHtwbGFjZTogJ3dvcmxkJywgdXNlcjoge25hbWU6ICdDaGFybGlrZSd9fSlcbiAqIC8vPT4gJ0hlbGxvIHdvcmxkIGFuZCBDaGFybGlrZSEnXG4gKiBgYGBcbiAqXG4gKiBAbmFtZSAgIC5jb21waWxlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGBzdHJgIHRlbXBsYXRlIHRvIHBvcHVsYXRlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gd2hpY2ggYWNjZXB0cyBgbG9jYWxzYCBvYmplY3RzXG4gKiBAYXBpIHB1YmxpY1xuICovXG50ZW1wbGF0ZS5jb21waWxlID0gZnVuY3Rpb24gY29tcGlsZSAoc3RyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAobG9jYWxzKSB7XG4gICAgdXRpbHMuc2xpY2VkKGFyZ3VtZW50cykuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgICBsb2NhbHMgPSB1dGlscy5leHRlbmRTaGFsbG93KGxvY2Fscywgb2JqKVxuICAgIH0pXG4gICAgcmV0dXJuIHRlbXBsYXRlRm4oc3RyLCBsb2NhbHMpXG4gIH1cbn1cblxuLyoqXG4gKiBNYWluIHRlbXBsYXRlIHJlbmRlciBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdGVtcGxhdGVGbiAoc3RyKSB7XG4gIHZhciBkYXRhID0ge31cbiAgdXRpbHMuc2xpY2VkKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgZGF0YSA9IHV0aWxzLmV4dGVuZFNoYWxsb3coZGF0YSwgb2JqKVxuICB9KVxuICByZXR1cm4gc3RyLnJlcGxhY2UodXRpbHMucmVnZXgoKSwgZnVuY3Rpb24gKG0sIHByb3ApIHtcbiAgICBpZiAocHJvcCAmJiBwcm9wLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB1dGlscy5nZXRWYWx1ZShkYXRhLCBwcm9wKVxuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIGRhdGFbcHJvcF0gIT09ICd1bmRlZmluZWQnID8gZGF0YVtwcm9wXSA6ICcnXG4gIH0pXG59XG4iLCIvKiFcbiAqIGVzNi10ZW1wbGF0ZS1yZWdleCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvZXM2LXRlbXBsYXRlLXJlZ2V4PlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEpvbiBTY2hsaW5rZXJ0LCAyMDE0IExvLURhc2ggMi40LjEgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqXG4gKiBVc2VkIHRvIG1hdGNoIEVTIHRlbXBsYXRlIGRlbGltaXRlcnNcbiAqIFNlZTogaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdGVtcGxhdGUtbGl0ZXJhbC1sZXhpY2FsLWNvbXBvbmVudHNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVzNnJlZ2V4KCkge1xuICByZXR1cm4gL1xcJFxceyhbXlxcXFx9XSooPzpcXFxcLlteXFxcXH1dKikqKVxcfS9nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnaXMtZXh0ZW5kYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZChvLyosIG9iamVjdHMqLykge1xuICBpZiAoIWlzT2JqZWN0KG8pKSB7IG8gPSB7fTsgfVxuXG4gIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIG9iaiA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGlmIChpc09iamVjdChvYmopKSB7XG4gICAgICBhc3NpZ24obywgb2JqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG87XG59O1xuXG5mdW5jdGlvbiBhc3NpZ24oYSwgYikge1xuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChoYXNPd24oYiwga2V5KSkge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gYGtleWAgaXMgYW4gb3duIHByb3BlcnR5IG9mIGBvYmpgLlxuICovXG5cbmZ1bmN0aW9uIGhhc093bihvYmosIGtleSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn1cbiIsIi8qIVxuICogZ2V0LXZhbHVlIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9nZXQtdmFsdWU+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBwcm9wLCBhLCBiLCBjKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSB8fCAhcHJvcCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBwcm9wID0gdG9TdHJpbmcocHJvcCk7XG5cbiAgLy8gYWxsb3dpbmcgZm9yIG11bHRpcGxlIHByb3BlcnRpZXMgdG8gYmUgcGFzc2VkIGFzXG4gIC8vIGEgc3RyaW5nIG9yIGFycmF5LCBidXQgbXVjaCBmYXN0ZXIgKDMtNHgpIHRoYW4gZG9pbmdcbiAgLy8gYFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKWBcbiAgaWYgKGEpIHByb3AgKz0gJy4nICsgdG9TdHJpbmcoYSk7XG4gIGlmIChiKSBwcm9wICs9ICcuJyArIHRvU3RyaW5nKGIpO1xuICBpZiAoYykgcHJvcCArPSAnLicgKyB0b1N0cmluZyhjKTtcblxuICBpZiAocHJvcCBpbiBvYmopIHtcbiAgICByZXR1cm4gb2JqW3Byb3BdO1xuICB9XG5cbiAgdmFyIHNlZ3MgPSBwcm9wLnNwbGl0KCcuJyk7XG4gIHZhciBsZW4gPSBzZWdzLmxlbmd0aDtcbiAgdmFyIGkgPSAtMTtcblxuICB3aGlsZSAob2JqICYmICgrK2kgPCBsZW4pKSB7XG4gICAgdmFyIGtleSA9IHNlZ3NbaV07XG4gICAgd2hpbGUgKGtleVtrZXkubGVuZ3RoIC0gMV0gPT09ICdcXFxcJykge1xuICAgICAga2V5ID0ga2V5LnNsaWNlKDAsIC0xKSArICcuJyArIHNlZ3NbKytpXTtcbiAgICB9XG4gICAgb2JqID0gb2JqW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKTtcbn1cblxuZnVuY3Rpb24gdG9TdHJpbmcodmFsKSB7XG4gIGlmICghdmFsKSByZXR1cm4gJyc7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXR1cm4gdmFsLmpvaW4oJy4nKTtcbiAgfVxuICByZXR1cm4gdmFsO1xufVxuIiwiLyohXG4gKiBpcy1leHRlbmRhYmxlIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9pcy1leHRlbmRhYmxlPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzRXh0ZW5kYWJsZSh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICYmIHZhbCAhPT0gbnVsbFxuICAgICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2FjaGUgcmVzdWx0cyBvZiB0aGUgZmlyc3QgZnVuY3Rpb24gY2FsbCB0byBlbnN1cmUgb25seSBjYWxsaW5nIG9uY2UuXG4gKlxuICogYGBganNcbiAqIHZhciB1dGlscyA9IHJlcXVpcmUoJ2xhenktY2FjaGUnKShyZXF1aXJlKTtcbiAqIC8vIGNhY2hlIHRoZSBjYWxsIHRvIGByZXF1aXJlKCdhbnNpLXllbGxvdycpYFxuICogdXRpbHMoJ2Fuc2kteWVsbG93JywgJ3llbGxvdycpO1xuICogLy8gdXNlIGBhbnNpLXllbGxvd2BcbiAqIGNvbnNvbGUubG9nKHV0aWxzLnllbGxvdygndGhpcyBpcyB5ZWxsb3cnKSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gYGZuYCBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIG9ubHkgb25jZS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBGdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgdG8gZ2V0IHRoZSBjYWNoZWQgZnVuY3Rpb25cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbGF6eUNhY2hlKGZuKSB7XG4gIHZhciBjYWNoZSA9IHt9O1xuICB2YXIgcHJveHkgPSBmdW5jdGlvbihtb2QsIG5hbWUpIHtcbiAgICBuYW1lID0gbmFtZSB8fCBjYW1lbGNhc2UobW9kKTtcblxuICAgIC8vIGNoZWNrIGJvdGggYm9vbGVhbiBhbmQgc3RyaW5nIGluIGNhc2UgYHByb2Nlc3MuZW52YCBjYXNlcyB0byBzdHJpbmdcbiAgICBpZiAocHJvY2Vzcy5lbnYuVU5MQVpZID09PSAndHJ1ZScgfHwgcHJvY2Vzcy5lbnYuVU5MQVpZID09PSB0cnVlIHx8IHByb2Nlc3MuZW52LlRSQVZJUykge1xuICAgICAgY2FjaGVbbmFtZV0gPSBmbihtb2QpO1xuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm94eSwgbmFtZSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZ2V0dGVyXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBnZXR0ZXIoKSB7XG4gICAgICBpZiAoY2FjaGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlW25hbWVdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChjYWNoZVtuYW1lXSA9IGZuKG1vZCkpO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0dGVyO1xuICB9O1xuICByZXR1cm4gcHJveHk7XG59XG5cbi8qKlxuICogVXNlZCB0byBjYW1lbGNhc2UgdGhlIG5hbWUgdG8gYmUgc3RvcmVkIG9uIHRoZSBgbGF6eWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmAgU3RyaW5nIGNvbnRhaW5pbmcgYF9gLCBgLmAsIGAtYCBvciB3aGl0ZXNwYWNlIHRoYXQgd2lsbCBiZSBjYW1lbGNhc2VkLlxuICogQHJldHVybiB7U3RyaW5nfSBjYW1lbGNhc2VkIHN0cmluZy5cbiAqL1xuXG5mdW5jdGlvbiBjYW1lbGNhc2Uoc3RyKSB7XG4gIGlmIChzdHIubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIHN0ciA9IHN0ci5yZXBsYWNlKC9eW1xcV19dK3xbXFxXX10rJC9nLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFxXX10rKFxcd3wkKS9nLCBmdW5jdGlvbihfLCBjaCkge1xuICAgIHJldHVybiBjaC50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBFeHBvc2UgYGxhenlDYWNoZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxhenlDYWNoZTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiXG4vKipcbiAqIEFuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykgYWx0ZXJuYXRpdmVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYXJncyBzb21ldGhpbmcgd2l0aCBhIGxlbmd0aFxuICogQHBhcmFtIHtOdW1iZXJ9IHNsaWNlXG4gKiBAcGFyYW0ge051bWJlcn0gc2xpY2VFbmRcbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJncywgc2xpY2UsIHNsaWNlRW5kKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuXG4gIGlmICgwID09PSBsZW4pIHJldHVybiByZXQ7XG5cbiAgdmFyIHN0YXJ0ID0gc2xpY2UgPCAwXG4gICAgPyBNYXRoLm1heCgwLCBzbGljZSArIGxlbilcbiAgICA6IHNsaWNlIHx8IDA7XG5cbiAgaWYgKHNsaWNlRW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICBsZW4gPSBzbGljZUVuZCA8IDBcbiAgICAgID8gc2xpY2VFbmQgKyBsZW5cbiAgICAgIDogc2xpY2VFbmRcbiAgfVxuXG4gIHdoaWxlIChsZW4tLSA+IHN0YXJ0KSB7XG4gICAgcmV0W2xlbiAtIHN0YXJ0XSA9IGFyZ3NbbGVuXTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbiIsIi8qIGpzaGludCBhc2k6dHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCdcblxuLyoqXG4gKiBMYXppbHkgcmVxdWlyZWQgbW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ2xhenktY2FjaGUnKShyZXF1aXJlKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmLCBuby1uYXRpdmUtcmVhc3NpZ25cbnZhciBmbiA9IHJlcXVpcmVcblxucmVxdWlyZSA9IHV0aWxzIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYsIG5vLW5hdGl2ZS1yZWFzc2lnblxucmVxdWlyZSgnZXM2LXRlbXBsYXRlLXJlZ2V4JywgJ3JlZ2V4JylcbnJlcXVpcmUoJ2V4dGVuZC1zaGFsbG93JylcbnJlcXVpcmUoJ2dldC12YWx1ZScpXG5yZXF1aXJlKCdzbGljZWQnKVxucmVxdWlyZSA9IGZuIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYsIG5vLW5hdGl2ZS1yZWFzc2lnblxuXG4vKipcbiAqIEV4cG9zZSBgdXRpbHNgIG1vZHVsZXNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzXG4iXX0=
