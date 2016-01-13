require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"is-extendable":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"_process":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){

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


},{}],8:[function(require,module,exports){
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

},{"es6-template-regex":1,"extend-shallow":2,"get-value":3,"lazy-cache":5,"sliced":7}],"es6-template":[function(require,module,exports){
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

},{"./utils":8}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZXM2LXRlbXBsYXRlLXJlZ2V4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2V4dGVuZC1zaGFsbG93L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dldC12YWx1ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1leHRlbmRhYmxlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xhenktY2FjaGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3NsaWNlZC9pbmRleC5qcyIsInV0aWxzLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBlczYtdGVtcGxhdGUtcmVnZXggPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2VzNi10ZW1wbGF0ZS1yZWdleD5cbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBKb24gU2NobGlua2VydCwgMjAxNCBMby1EYXNoIDIuNC4xIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKlxuICogVXNlZCB0byBtYXRjaCBFUyB0ZW1wbGF0ZSBkZWxpbWl0ZXJzXG4gKiBTZWU6IGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRlbXBsYXRlLWxpdGVyYWwtbGV4aWNhbC1jb21wb25lbnRzXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlczZyZWdleCgpIHtcbiAgcmV0dXJuIC9cXCRcXHsoW15cXFxcfV0qKD86XFxcXC5bXlxcXFx9XSopKilcXH0vZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2lzLWV4dGVuZGFibGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRlbmQoby8qLCBvYmplY3RzKi8pIHtcbiAgaWYgKCFpc09iamVjdChvKSkgeyBvID0ge307IH1cblxuICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBvYmogPSBhcmd1bWVudHNbaV07XG5cbiAgICBpZiAoaXNPYmplY3Qob2JqKSkge1xuICAgICAgYXNzaWduKG8sIG9iaik7XG4gICAgfVxuICB9XG4gIHJldHVybiBvO1xufTtcblxuZnVuY3Rpb24gYXNzaWduKGEsIGIpIHtcbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoaGFzT3duKGIsIGtleSkpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGBrZXlgIGlzIGFuIG93biBwcm9wZXJ0eSBvZiBgb2JqYC5cbiAqL1xuXG5mdW5jdGlvbiBoYXNPd24ob2JqLCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG59XG4iLCIvKiFcbiAqIGdldC12YWx1ZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvZ2V0LXZhbHVlPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCwgYSwgYiwgYykge1xuICBpZiAoIWlzT2JqZWN0KG9iaikgfHwgIXByb3ApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgcHJvcCA9IHRvU3RyaW5nKHByb3ApO1xuXG4gIC8vIGFsbG93aW5nIGZvciBtdWx0aXBsZSBwcm9wZXJ0aWVzIHRvIGJlIHBhc3NlZCBhc1xuICAvLyBhIHN0cmluZyBvciBhcnJheSwgYnV0IG11Y2ggZmFzdGVyICgzLTR4KSB0aGFuIGRvaW5nXG4gIC8vIGBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylgXG4gIGlmIChhKSBwcm9wICs9ICcuJyArIHRvU3RyaW5nKGEpO1xuICBpZiAoYikgcHJvcCArPSAnLicgKyB0b1N0cmluZyhiKTtcbiAgaWYgKGMpIHByb3AgKz0gJy4nICsgdG9TdHJpbmcoYyk7XG5cbiAgaWYgKHByb3AgaW4gb2JqKSB7XG4gICAgcmV0dXJuIG9ialtwcm9wXTtcbiAgfVxuXG4gIHZhciBzZWdzID0gcHJvcC5zcGxpdCgnLicpO1xuICB2YXIgbGVuID0gc2Vncy5sZW5ndGg7XG4gIHZhciBpID0gLTE7XG5cbiAgd2hpbGUgKG9iaiAmJiAoKytpIDwgbGVuKSkge1xuICAgIHZhciBrZXkgPSBzZWdzW2ldO1xuICAgIHdoaWxlIChrZXlba2V5Lmxlbmd0aCAtIDFdID09PSAnXFxcXCcpIHtcbiAgICAgIGtleSA9IGtleS5zbGljZSgwLCAtMSkgKyAnLicgKyBzZWdzWysraV07XG4gICAgfVxuICAgIG9iaiA9IG9ialtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbCkge1xuICBpZiAoIXZhbCkgcmV0dXJuICcnO1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuIHZhbC5qb2luKCcuJyk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cbiIsIi8qIVxuICogaXMtZXh0ZW5kYWJsZSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtZXh0ZW5kYWJsZT5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEpvbiBTY2hsaW5rZXJ0LlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0V4dGVuZGFibGUodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgIT09IG51bGxcbiAgICAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENhY2hlIHJlc3VsdHMgb2YgdGhlIGZpcnN0IGZ1bmN0aW9uIGNhbGwgdG8gZW5zdXJlIG9ubHkgY2FsbGluZyBvbmNlLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgdXRpbHMgPSByZXF1aXJlKCdsYXp5LWNhY2hlJykocmVxdWlyZSk7XG4gKiAvLyBjYWNoZSB0aGUgY2FsbCB0byBgcmVxdWlyZSgnYW5zaS15ZWxsb3cnKWBcbiAqIHV0aWxzKCdhbnNpLXllbGxvdycsICd5ZWxsb3cnKTtcbiAqIC8vIHVzZSBgYW5zaS15ZWxsb3dgXG4gKiBjb25zb2xlLmxvZyh1dGlscy55ZWxsb3coJ3RoaXMgaXMgeWVsbG93JykpO1xuICogYGBgXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IGBmbmAgRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBvbmx5IG9uY2UuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gRnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHRvIGdldCB0aGUgY2FjaGVkIGZ1bmN0aW9uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxhenlDYWNoZShmbikge1xuICB2YXIgY2FjaGUgPSB7fTtcbiAgdmFyIHByb3h5ID0gZnVuY3Rpb24obW9kLCBuYW1lKSB7XG4gICAgbmFtZSA9IG5hbWUgfHwgY2FtZWxjYXNlKG1vZCk7XG5cbiAgICAvLyBjaGVjayBib3RoIGJvb2xlYW4gYW5kIHN0cmluZyBpbiBjYXNlIGBwcm9jZXNzLmVudmAgY2FzZXMgdG8gc3RyaW5nXG4gICAgaWYgKHByb2Nlc3MuZW52LlVOTEFaWSA9PT0gJ3RydWUnIHx8IHByb2Nlc3MuZW52LlVOTEFaWSA9PT0gdHJ1ZSB8fCBwcm9jZXNzLmVudi5UUkFWSVMpIHtcbiAgICAgIGNhY2hlW25hbWVdID0gZm4obW9kKTtcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJveHksIG5hbWUsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGdldHRlclxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZ2V0dGVyKCkge1xuICAgICAgaWYgKGNhY2hlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBjYWNoZVtuYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoY2FjaGVbbmFtZV0gPSBmbihtb2QpKTtcbiAgICB9XG4gICAgcmV0dXJuIGdldHRlcjtcbiAgfTtcbiAgcmV0dXJuIHByb3h5O1xufVxuXG4vKipcbiAqIFVzZWQgdG8gY2FtZWxjYXNlIHRoZSBuYW1lIHRvIGJlIHN0b3JlZCBvbiB0aGUgYGxhenlgIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGBzdHJgIFN0cmluZyBjb250YWluaW5nIGBfYCwgYC5gLCBgLWAgb3Igd2hpdGVzcGFjZSB0aGF0IHdpbGwgYmUgY2FtZWxjYXNlZC5cbiAqIEByZXR1cm4ge1N0cmluZ30gY2FtZWxjYXNlZCBzdHJpbmcuXG4gKi9cblxuZnVuY3Rpb24gY2FtZWxjYXNlKHN0cikge1xuICBpZiAoc3RyLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBzdHIgPSBzdHIucmVwbGFjZSgvXltcXFdfXSt8W1xcV19dKyQvZywgJycpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvW1xcV19dKyhcXHd8JCkvZywgZnVuY3Rpb24oXywgY2gpIHtcbiAgICByZXR1cm4gY2gudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59XG5cbi8qKlxuICogRXhwb3NlIGBsYXp5Q2FjaGVgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBsYXp5Q2FjaGU7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIlxuLyoqXG4gKiBBbiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpIGFsdGVybmF0aXZlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFyZ3Mgc29tZXRoaW5nIHdpdGggYSBsZW5ndGhcbiAqIEBwYXJhbSB7TnVtYmVyfSBzbGljZVxuICogQHBhcmFtIHtOdW1iZXJ9IHNsaWNlRW5kXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3MsIHNsaWNlLCBzbGljZUVuZCkge1xuICB2YXIgcmV0ID0gW107XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcblxuICBpZiAoMCA9PT0gbGVuKSByZXR1cm4gcmV0O1xuXG4gIHZhciBzdGFydCA9IHNsaWNlIDwgMFxuICAgID8gTWF0aC5tYXgoMCwgc2xpY2UgKyBsZW4pXG4gICAgOiBzbGljZSB8fCAwO1xuXG4gIGlmIChzbGljZUVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuID0gc2xpY2VFbmQgPCAwXG4gICAgICA/IHNsaWNlRW5kICsgbGVuXG4gICAgICA6IHNsaWNlRW5kXG4gIH1cblxuICB3aGlsZSAobGVuLS0gPiBzdGFydCkge1xuICAgIHJldFtsZW4gLSBzdGFydF0gPSBhcmdzW2xlbl07XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG4iLCIvKiBqc2hpbnQgYXNpOnRydWUgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogTGF6aWx5IHJlcXVpcmVkIG1vZHVsZSBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCdsYXp5LWNhY2hlJykocmVxdWlyZSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiwgbm8tbmF0aXZlLXJlYXNzaWduXG52YXIgZm4gPSByZXF1aXJlXG5cbnJlcXVpcmUgPSB1dGlscyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmLCBuby1uYXRpdmUtcmVhc3NpZ25cbnJlcXVpcmUoJ2VzNi10ZW1wbGF0ZS1yZWdleCcsICdyZWdleCcpXG5yZXF1aXJlKCdleHRlbmQtc2hhbGxvdycpXG5yZXF1aXJlKCdnZXQtdmFsdWUnKVxucmVxdWlyZSgnc2xpY2VkJylcbnJlcXVpcmUgPSBmbiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmLCBuby1uYXRpdmUtcmVhc3NpZ25cblxuLyoqXG4gKiBFeHBvc2UgYHV0aWxzYCBtb2R1bGVzXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1dGlsc1xuIiwiLyohXG4gKiBlczYtdGVtcGxhdGUgPGh0dHBzOi8vZ2l0aHViLmNvbS90dW5uY2tvQ29yZS9lczYtdGVtcGxhdGU+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IENoYXJsaWtlIE1pa2UgUmVhZ2VudCA8QHR1bm5ja29Db3JlPiAoaHR0cDovL3d3dy50dW5uY2tvY29yZS50aylcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpXG5cbi8qKlxuICogPiBBY3RzIGxpa2UgYC5yZW5kZXJgIGJ5IGRlZmF1bHQuXG4gKiBSZW5kZXJzIGdpdmVuIGBzdHJgIHdpdGggYGxvY2Fsc2AuXG4gKlxuICogKipFeGFtcGxlKipcbiAqXG4gKiBgYGBqc1xuICogZXM2dGVtcGxhdGUoJ2ZvbyAke2Jhcn0gYmF6ICR7cXV1eH0nLCB7YmFyOiAnQkFSJ30sIHtxdXV4OiAnUVVVWCd9KVxuICogLy89PiAnZm9vIEJBUiBiYXogUVVVWCdcbiAqIGBgYFxuICpcbiAqIEBuYW1lICAgZXM2dGVtcGxhdGVcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmAgdGVtcGxhdGUgdG8gcG9wdWxhdGUgd2l0aCBgbG9jYWxzYFxuICogQHBhcmFtICB7T2JqZWN0fSBgbG9jYWxzYCBsb2NhbHMgb2JqZWN0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJlbmRlcmVkIHN0cmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xudmFyIHRlbXBsYXRlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlczZ0ZW1wbGF0ZSAoc3RyLCBsb2NhbHMpIHtcbiAgcmV0dXJuIHRlbXBsYXRlRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG4vKipcbiAqID4gIFJlbmRlcnMgZ2l2ZW4gYHN0cmAgd2l0aCBgbG9jYWxzYC4gWW91IGNhbiBnaXZlIHVubGltaXRlZFxuICogbnVtYmVyIG9mIG9iamVjdCBhcmd1bWVudHMgYWZ0ZXIgdGhlIGZpcnN0IC0gdGhleSB3aWxsIGJlXG4gKiBtZXJnZWQgYW5kIHBhc3NlZCBhcyBzaW5nbGUgbG9jYWxzIG9iamVjdC5cbiAqXG4gKiAqKkV4YW1wbGUqKlxuICpcbiAqIGBgYGpzXG4gKiBlczZ0ZW1wbGF0ZS5yZW5kZXIoJ0hlbGxvICR7cGxhY2V9IGFuZCAke3VzZXIubmFtZX0hJywge1xuICogICBwbGFjZTogJ3dvcmxkJyxcbiAqICAgdXNlcjoge1xuICogICAgIG5hbWU6ICdDaGFybGlrZSdcbiAqICAgfVxuICogfSlcbiAqIC8vPT4gJ0hlbGxvIHdvcmxkIGFuZCBDaGFybGlrZSEnXG4gKiBgYGBcbiAqXG4gKiBAbmFtZSAgIC5yZW5kZXJcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmAgdGVtcGxhdGUgdG8gcG9wdWxhdGUgd2l0aCBgbG9jYWxzYFxuICogQHBhcmFtICB7T2JqZWN0fSBgbG9jYWxzYCBsb2NhbHMgb2JqZWN0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJlbmRlcmVkIHN0cmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xudGVtcGxhdGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyIChzdHIsIGxvY2Fscykge1xuICByZXR1cm4gdGVtcGxhdGVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbi8qKlxuICogPiBDb21waWxlcyBnaXZlbiBzdHJpbmcgYW5kIHJldHVybnMgZnVuY3Rpb24gd2hpY2ggYWNjZXB0c1xuICogdW5saW1pdGVkIG51bWJlciBvZiBgbG9jYWxzYCBvYmplY3QgYXJndW1lbnRzLlxuICpcbiAqICoqRXhhbXBsZSoqXG4gKlxuICogYGBganNcbiAqIHZhciBmbiA9IGVzNnRlbXBsYXRlLmNvbXBpbGUoJ0hlbGxvICR7cGxhY2V9IGFuZCAke3VzZXIubmFtZX0hJylcbiAqIGZuKHtwbGFjZTogJ3dvcmxkJywgdXNlcjoge25hbWU6ICdDaGFybGlrZSd9fSlcbiAqIC8vPT4gJ0hlbGxvIHdvcmxkIGFuZCBDaGFybGlrZSEnXG4gKiBgYGBcbiAqXG4gKiBAbmFtZSAgIC5jb21waWxlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGBzdHJgIHRlbXBsYXRlIHRvIHBvcHVsYXRlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gd2hpY2ggYWNjZXB0cyBgbG9jYWxzYCBvYmplY3RzXG4gKiBAYXBpIHB1YmxpY1xuICovXG50ZW1wbGF0ZS5jb21waWxlID0gZnVuY3Rpb24gY29tcGlsZSAoc3RyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAobG9jYWxzKSB7XG4gICAgdXRpbHMuc2xpY2VkKGFyZ3VtZW50cykuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgICBsb2NhbHMgPSB1dGlscy5leHRlbmRTaGFsbG93KGxvY2Fscywgb2JqKVxuICAgIH0pXG4gICAgcmV0dXJuIHRlbXBsYXRlRm4oc3RyLCBsb2NhbHMpXG4gIH1cbn1cblxuLyoqXG4gKiBNYWluIHRlbXBsYXRlIHJlbmRlciBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdGVtcGxhdGVGbiAoc3RyKSB7XG4gIHZhciBkYXRhID0ge31cbiAgdXRpbHMuc2xpY2VkKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG4gICAgZGF0YSA9IHV0aWxzLmV4dGVuZFNoYWxsb3coZGF0YSwgb2JqKVxuICB9KVxuICByZXR1cm4gc3RyLnJlcGxhY2UodXRpbHMucmVnZXgoKSwgZnVuY3Rpb24gKG0sIHByb3ApIHtcbiAgICBpZiAocHJvcCAmJiBwcm9wLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB1dGlscy5nZXRWYWx1ZShkYXRhLCBwcm9wKVxuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIGRhdGFbcHJvcF0gIT09ICd1bmRlZmluZWQnID8gZGF0YVtwcm9wXSA6ICcnXG4gIH0pXG59XG4iXX0=
