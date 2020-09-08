"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.bind = exports.debounce = exports.memoize = void 0;
var EMPTY = {};
var HOP = Object.prototype.hasOwnProperty;
var fns = {
  /**  let cachedFn = memoize(originalFn); */
  memoize: function memoize(fn) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EMPTY;
    var cache = opt.cache || {};
    return function () {
      for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
        a[_key] = arguments[_key];
      }

      var k = String(a[0]);
      if (opt.caseSensitive === false) k = k.toLowerCase();
      return HOP.call(cache, k) ? cache[k] : cache[k] = fn.apply(this, a);
    };
  },

  /** let throttled = debounce(10, console.log); */
  debounce: function debounce(fn, opts) {
    if (typeof opts === 'function') {
      var p = fn;
      fn = opts;
      opts = p;
    }

    var delay = opts && opts.delay || opts || 0,
        args,
        context,
        timer;
    return function () {
      for (var _len2 = arguments.length, a = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        a[_key2] = arguments[_key2];
      }

      args = a;
      context = this;
      if (!timer) timer = setTimeout(function () {
        fn.apply(context, args);
        args = context = timer = null;
      }, delay);
    };
  },
  bind: function bind(target, key, _ref) {
    var fn = _ref.value;
    // In IE11 calling Object.defineProperty has a side-effect of evaluating the
    // getter for the property which is being replaced. This causes infinite
    // recursion and an "Out of stack space" error.
    var definingProperty = false;
    return {
      configurable: true,
      get: function get() {
        if (definingProperty) {
          return fn;
        }

        var value = fn.bind(this);
        definingProperty = true;
        Object.defineProperty(this, key, {
          value: value,
          configurable: true,
          writable: true
        });
        definingProperty = false;
        return value;
      }
    };
  }
};
var memoize = multiMethod(fns.memoize),
    debounce = multiMethod(fns.debounce),
    bind = multiMethod(function (f, c) {
  return f.bind(c);
}, function () {
  return fns.bind;
});
exports.bind = bind;
exports.debounce = debounce;
exports.memoize = memoize;
var _default = {
  memoize: memoize,
  debounce: debounce,
  bind: bind
};
/** Creates a function that supports the following calling styles:
 *	d() - returns an unconfigured decorator
 *	d(opts) - returns a configured decorator
 *	d(fn, opts) - returns a decorated proxy to `fn`
 *	d(target, key, desc) - the decorator itself
 *
 *	@Example:
 *		// simple identity deco:
 *		let d = multiMethod( fn => fn );
 *
 *		class Foo {
 *			@d
 *			bar() { }
 *
 *			@d()
 *			baz() { }
 *
 *			@d({ opts })
 *			bat() { }
 *
 *			bap = d(() => {})
 *		}
 */

exports["default"] = _default;

function multiMethod(inner, deco) {
  deco = deco || inner.decorate || decorator(inner);
  var d = deco();
  return function () {
    var l = arguments.length;
    return (l < 2 ? deco : l > 2 ? d : inner).apply(void 0, arguments);
  };
}
/** Returns function supports the forms:
 *	deco(target, key, desc) -> decorate a method
 *	deco(Fn) -> call the decorator proxy on a function
 */


function decorator(fn) {
  return function (opt) {
    return typeof opt === 'function' ? fn(opt) : function (target, key, desc) {
      desc.value = fn(desc.value, opt, target, key, desc);
    };
  };
}
//# sourceMappingURL=decko.js.map