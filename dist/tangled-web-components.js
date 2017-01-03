(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, function () { 'use strict';

	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	babelHelpers.classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	babelHelpers.createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	babelHelpers.defineProperty = function (obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

	babelHelpers.inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	babelHelpers.possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	babelHelpers.toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	babelHelpers;

	var _window = window;
	var HTMLElement$1 = _window.HTMLElement;
	var MutationObserver$1 = _window.MutationObserver;
	var natigator = _window.natigator;
	var _navigator = navigator;
	var userAgent = _navigator.userAgent;

	var safari = userAgent.indexOf('Safari/60') !== -1;
	var safariVersion = safari && userAgent.match(/Version\/([^\s]+)/)[1];
	var safariVersions = [0, 1].map(function (v) {
	  return '10.0.' + v;
	}).concat(['10.0']);
	var patch = safari && safariVersions.indexOf(safariVersion) > -1;

	// Workaround for https://bugs.webkit.org/show_bug.cgi?id=160331
	function fixSafari() {
	  var oldAttachShadow = HTMLElement$1.prototype.attachShadow;

	  // We observe a shadow root, but only need to know if the target that was mutated is a <style>
	  // element as this is the only scenario where styles aren't recalculated.
	  var moOpts = { childList: true, subtree: true };
	  var mo = new MutationObserver$1(function (muts) {
	    muts.forEach(function (mut) {
	      var target = mut.target;

	      if (target.tagName === 'STYLE') {
	        var nextSibling = target.nextSibling;
	        var parentNode = target.parentNode;

	        // We actually have to remove and subsequently re-insert rather than doing insertBefore()
	        // as it seems that doesn't trigger a recalc.

	        parentNode.removeChild(target);
	        parentNode.insertBefore(target, nextSibling);
	      }
	    });
	  });

	  // Our override simply calls the native (or overridden) attachShadow but it ensures that changes
	  // to it are observed so that we can take any <style> elements and re-insert them.
	  function newAttachShadow(opts) {
	    var sr = oldAttachShadow.call(this, opts);
	    mo.observe(sr, moOpts);
	    return sr;
	  }

	  // We have to define a property because Safari won't take the override if it is set directly.
	  Object.defineProperty(HTMLElement$1.prototype, 'attachShadow', {
	    // Ensure polyfills can override it (hoping they call it back).
	    configurable: true,
	    enumerable: true,
	    value: newAttachShadow,
	    writable: true
	  });
	}

	// We target a specific version of Safari instead of trying to but detect as it seems to involve
	// contriving a breaking case and detecting computed styles. We can remove this code when Safari
	// fixes the bug.
	if (patch) {
	  fixSafari();
	}

	// Polyfill for creating CustomEvents on IE9/10/11

	// code pulled from:
	// https://github.com/d4tocchini/customevent-polyfill
	// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

	try {
	  var ce = new window.CustomEvent('test');
	  ce.preventDefault();
	  if (ce.defaultPrevented !== true) {
	    // IE has problems with .preventDefault() on custom events
	    // http://stackoverflow.com/questions/23349191
	    throw new Error('Could not prevent default');
	  }
	} catch (e) {
	  var CustomEvent$1 = function CustomEvent(event, params) {
	    var evt, origPrevent;
	    params = params || {
	      bubbles: false,
	      cancelable: false,
	      detail: undefined
	    };

	    evt = document.createEvent("CustomEvent");
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    origPrevent = evt.preventDefault;
	    evt.preventDefault = function () {
	      origPrevent.call(this);
	      try {
	        Object.defineProperty(this, 'defaultPrevented', {
	          get: function get() {
	            return true;
	          }
	        });
	      } catch (e) {
	        this.defaultPrevented = true;
	      }
	    };
	    return evt;
	  };

	  CustomEvent$1.prototype = window.Event.prototype;
	  window.CustomEvent = CustomEvent$1; // expose definition to window
	}

	var div = document.createElement('div');
	var shadowDomV0 = !!div.createShadowRoot;
	var shadowDomV1 = !!div.attachShadow;

	var $shadowRoot = '__shadowRoot';

	var v0 = (function () {
	  // Returns the assigned nodes (unflattened) for a <content> node.
	  var getAssignedNodes = function getAssignedNodes(node) {
	    var slot = node.getAttribute('name');

	    var host = node;
	    while (host) {
	      var sr = host[$shadowRoot];
	      if (sr && sr.contains(node)) {
	        break;
	      }
	      host = host.parentNode;
	    }

	    if (!host) {
	      return [];
	    }

	    var chs = host.childNodes;
	    var chsLen = chs.length;
	    var filtered = [];

	    for (var a = 0; a < chsLen; a++) {
	      var ch = chs[a];
	      var chSlot = ch.getAttribute ? ch.getAttribute('slot') : null;
	      if (slot === chSlot) {
	        filtered.push(ch);
	      }
	    }

	    return filtered;
	  };

	  var _HTMLElement$prototyp = HTMLElement.prototype;
	  var getAttribute = _HTMLElement$prototyp.getAttribute;
	  var setAttribute = _HTMLElement$prototyp.setAttribute;

	  var elementInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
	  var shadowRootInnerHTML = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, 'innerHTML');

	  // We do this so creating a <slot> actually creates a <content>.
	  var filterTagName = function filterTagName(name) {
	    return name === 'slot' ? 'content' : name;
	  };
	  var createElement = document.createElement.bind(document);
	  var createElementNS = document.createElementNS.bind(document);
	  document.createElement = function (name) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    return createElement.apply(undefined, [filterTagName(name)].concat(args));
	  };
	  document.createElementNS = function (uri, name) {
	    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	      args[_key2 - 2] = arguments[_key2];
	    }

	    return createElementNS.apply(undefined, [uri, filterTagName(name)].concat(args));
	  };

	  // Override innerHTML to turn slot nodes into content nodes.
	  function replaceSlotsWithContents(node) {
	    var tree = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
	    var repl = [];

	    // Walk the tree and record nodes that need replacing.
	    while (tree.nextNode()) {
	      var currentNode = tree.currentNode;

	      if (currentNode.tagName === 'SLOT') {
	        repl.push(currentNode);
	      }
	    }

	    repl.forEach(function (fake) {
	      var name = fake.getAttribute('name');
	      var real = document.createElement('slot');
	      if (name) {
	        real.setAttribute('name', name);
	      }

	      fake.parentNode.replaceChild(real, fake);
	      while (fake.hasChildNodes()) {
	        real.appendChild(fake.firstChild);
	      }
	    });
	  }
	  Object.defineProperty(Element.prototype, 'innerHTML', {
	    configurable: true,
	    get: elementInnerHTML.get,
	    set: function set(html) {
	      elementInnerHTML.set.call(this, html);
	      replaceSlotsWithContents(this);
	    }
	  });
	  Object.defineProperty(ShadowRoot.prototype, 'innerHTML', {
	    configurable: true,
	    get: shadowRootInnerHTML.get,
	    set: function set(html) {
	      shadowRootInnerHTML.set.call(this, html);
	      replaceSlotsWithContents(this);
	    }
	  });

	  // Node
	  // ----

	  Object.defineProperty(Node.prototype, 'assignedSlot', {
	    get: function get() {
	      var parentNode = this.parentNode;

	      if (parentNode) {
	        var shadowRoot = parentNode.shadowRoot;

	        // If { mode } is "closed", always return `null`.

	        if (!shadowRoot) {
	          return null;
	        }

	        var contents = shadowRoot.querySelectorAll('content');
	        for (var a = 0; a < contents.length; a++) {
	          var content = contents[a];
	          if (content.assignedNodes().indexOf(this) > -1) {
	            return content;
	          }
	        }
	      }
	      return null;
	    }
	  });

	  // Just proxy createShadowRoot() because there's no such thing as closed
	  // shadow trees in v0.
	  HTMLElement.prototype.attachShadow = function attachShadow() {
	    var _this = this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    var mode = _ref.mode;

	    // In v1 you must specify a mode.
	    if (mode !== 'closed' && mode !== 'open') {
	      throw new Error('You must specify { mode } as "open" or "closed" to attachShadow().');
	    }

	    // Proxy native v0.
	    var sr = this.createShadowRoot();

	    // In v0 it always defines the shadowRoot property so we must undefine it.
	    if (mode === 'closed') {
	      Object.defineProperty(this, 'shadowRoot', {
	        configurable: true,
	        get: function get() {
	          return null;
	        }
	      });
	    }

	    // For some reason this wasn't being reported as set, but it seems to work
	    // in dev tools.
	    Object.defineProperty(sr, 'parentNode', {
	      get: function get() {
	        return _this;
	      }
	    });

	    // Add a MutationObserver to trigger slot change events when the element
	    // is mutated. We only need to listen to the childList because we only care
	    // about light DOM.
	    var mo = new MutationObserver(function (muts) {
	      var root = _this[$shadowRoot];
	      muts.forEach(function (mut) {
	        var addedNodes = mut.addedNodes;
	        var removedNodes = mut.removedNodes;

	        var slots = {};
	        var recordSlots = function recordSlots(node) {
	          return slots[node.getAttribute && node.getAttribute('slot') || '__default'] = true;
	        };

	        if (addedNodes) {
	          var addedNodesLen = addedNodes.length;
	          for (var a = 0; a < addedNodesLen; a++) {
	            recordSlots(addedNodes[a]);
	          }
	        }

	        if (removedNodes) {
	          var removedNodesLen = removedNodes.length;
	          for (var _a = 0; _a < removedNodesLen; _a++) {
	            recordSlots(removedNodes[_a]);
	          }
	        }

	        Object.keys(slots).forEach(function (slot) {
	          var node = slot === '__default' ? root.querySelector('content:not([name])') || root.querySelector('content[name=""]') : root.querySelector('content[name="' + slot + '"]');

	          if (node) {
	            node.dispatchEvent(new CustomEvent('slotchange', {
	              bubbles: false,
	              cancelable: false
	            }));
	          }
	        });
	      });
	    });
	    mo.observe(this, { childList: true });

	    return this[$shadowRoot] = sr;
	  };

	  // Make like the <slot> name property.
	  Object.defineProperty(HTMLContentElement.prototype, 'name', {
	    get: function get() {
	      return this.getAttribute('name');
	    },
	    set: function set(name) {
	      return this.setAttribute('name', name);
	    }
	  });

	  // Make like the element slot property.
	  Object.defineProperty(HTMLElement.prototype, 'slot', {
	    get: function get() {
	      return this.getAttribute('slot');
	    },
	    set: function set(name) {
	      return this.setAttribute('slot', name);
	    }
	  });

	  // By default, getDistributedNodes() returns a flattened tree (no <slot>
	  // nodes). That means we get native { deep } but we have to manually do the
	  // opposite.
	  HTMLContentElement.prototype.assignedNodes = function assignedNodes() {
	    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    var deep = _ref2.deep;

	    var cnodes = [];
	    var dnodes = deep ? this.getDistributedNodes() : getAssignedNodes(this);

	    // Regardless of how we get the nodes, we must ensure we're only given text
	    // nodes or element nodes.
	    for (var a = 0; a < dnodes.length; a++) {
	      var dnode = dnodes[a];
	      var dtype = dnode.nodeType;
	      if (dtype === Node.ELEMENT_NODE || dtype === Node.TEXT_NODE) {
	        cnodes.push(dnode);
	      }
	    }
	    return cnodes;
	  };

	  HTMLContentElement.prototype.getAttribute = function overriddenGetAttribute(name) {
	    if (name === 'name') {
	      var select = getAttribute.call(this, 'select');
	      return select ? select.match(/\[slot=['"]?(.*?)['"]?\]/)[1] : null;
	    }
	    return getAttribute.call(this, name);
	  };

	  HTMLContentElement.prototype.setAttribute = function overriddenSetAttribute(name, value) {
	    if (name === 'name') {
	      name = 'select';
	      value = '[slot=\'' + value + '\']';
	    }
	    return setAttribute.call(this, name, value);
	  };
	});

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function interopDefault(ex) {
		return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var index$1 = createCommonjsModule(function (module) {
	    module.exports = Date.now || now;

	    function now() {
	        return new Date().getTime();
	    }
	});

	var index$2 = interopDefault(index$1);

var require$$0 = Object.freeze({
	    default: index$2
	});

	var index = createCommonjsModule(function (module) {
	  /**
	   * Module dependencies.
	   */

	  var now = interopDefault(require$$0);

	  /**
	   * Returns a function, that, as long as it continues to be invoked, will not
	   * be triggered. The function will be called after it stops being called for
	   * N milliseconds. If `immediate` is passed, trigger the function on the
	   * leading edge, instead of the trailing.
	   *
	   * @source underscore.js
	   * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
	   * @param {Function} function to wrap
	   * @param {Number} timeout in ms (`100`)
	   * @param {Boolean} whether to execute at the beginning (`false`)
	   * @api public
	   */

	  module.exports = function debounce(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	    if (null == wait) wait = 100;

	    function later() {
	      var last = now() - timestamp;

	      if (last < wait && last > 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function debounced() {
	      context = this;
	      args = arguments;
	      timestamp = now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };
	});

	var debounce = interopDefault(index);

	var weakmap = createCommonjsModule(function (module, exports) {
	  /* (The MIT License)
	   *
	   * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
	   *
	   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
	   * associated documentation files (the 'Software'), to deal in the Software without restriction,
	   * including without limitation the rights to use, copy, modify, merge, publish, distribute,
	   * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
	   * furnished to do so, subject to the following conditions:
	   *
	   * The above copyright notice and this permission notice shall be included with all copies or
	   * substantial portions of the Software.
	   *
	   * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
	   * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM,
	   * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	   */

	  // Original WeakMap implementation by Gozala @ https://gist.github.com/1269991
	  // Updated and bugfixed by Raynos @ https://gist.github.com/1638059
	  // Expanded by Benvie @ https://github.com/Benvie/harmony-collections

	  void function (global, undefined_, undefined) {
	    var getProps = Object.getOwnPropertyNames,
	        defProp = Object.defineProperty,
	        toSource = Function.prototype.toString,
	        create = Object.create,
	        hasOwn = Object.prototype.hasOwnProperty,
	        funcName = /^\n?function\s?(\w*)?_?\(/;

	    function define(object, key, value) {
	      if (typeof key === 'function') {
	        value = key;
	        key = nameOf(value).replace(/_$/, '');
	      }
	      return defProp(object, key, { configurable: true, writable: true, value: value });
	    }

	    function nameOf(func) {
	      return typeof func !== 'function' ? '' : 'name' in func ? func.name : toSource.call(func).match(funcName)[1];
	    }

	    // ############
	    // ### Data ###
	    // ############

	    var Data = function () {
	      var dataDesc = { value: { writable: true, value: undefined } },
	          datalock = 'return function(k){if(k===s)return l}',
	          uids = create(null),
	          createUID = function createUID() {
	        var key = Math.random().toString(36).slice(2);
	        return key in uids ? createUID() : uids[key] = key;
	      },
	          globalID = createUID(),
	          storage = function storage(obj) {
	        if (hasOwn.call(obj, globalID)) return obj[globalID];

	        if (!Object.isExtensible(obj)) throw new TypeError("Object must be extensible");

	        var store = create(null);
	        defProp(obj, globalID, { value: store });
	        return store;
	      };

	      // common per-object storage area made visible by patching getOwnPropertyNames'
	      define(Object, function getOwnPropertyNames(obj) {
	        var props = getProps(obj);
	        if (hasOwn.call(obj, globalID)) props.splice(props.indexOf(globalID), 1);
	        return props;
	      });

	      function Data() {
	        var puid = createUID(),
	            secret = {};

	        this.unlock = function (obj) {
	          var store = storage(obj);
	          if (hasOwn.call(store, puid)) return store[puid](secret);

	          var data = create(null, dataDesc);
	          defProp(store, puid, {
	            value: new Function('s', 'l', datalock)(secret, data)
	          });
	          return data;
	        };
	      }

	      define(Data.prototype, function get(o) {
	        return this.unlock(o).value;
	      });
	      define(Data.prototype, function set(o, v) {
	        this.unlock(o).value = v;
	      });

	      return Data;
	    }();

	    var WM = function (data) {
	      var validate = function validate(key) {
	        if (key == null || (typeof key === 'undefined' ? 'undefined' : babelHelpers.typeof(key)) !== 'object' && typeof key !== 'function') throw new TypeError("Invalid WeakMap key");
	      };

	      var wrap = function wrap(collection, value) {
	        var store = data.unlock(collection);
	        if (store.value) throw new TypeError("Object is already a WeakMap");
	        store.value = value;
	      };

	      var unwrap = function unwrap(collection) {
	        var storage = data.unlock(collection).value;
	        if (!storage) throw new TypeError("WeakMap is not generic");
	        return storage;
	      };

	      var initialize = function initialize(weakmap, iterable) {
	        if (iterable !== null && (typeof iterable === 'undefined' ? 'undefined' : babelHelpers.typeof(iterable)) === 'object' && typeof iterable.forEach === 'function') {
	          iterable.forEach(function (item, i) {
	            if (item instanceof Array && item.length === 2) set.call(weakmap, iterable[i][0], iterable[i][1]);
	          });
	        }
	      };

	      function WeakMap(iterable) {
	        if (this === global || this == null || this === WeakMap.prototype) return new WeakMap(iterable);

	        wrap(this, new Data());
	        initialize(this, iterable);
	      }

	      function get(key) {
	        validate(key);
	        var value = unwrap(this).get(key);
	        return value === undefined_ ? undefined : value;
	      }

	      function set(key, value) {
	        validate(key);
	        // store a token for explicit undefined so that "has" works correctly
	        unwrap(this).set(key, value === undefined ? undefined_ : value);
	      }

	      function has(key) {
	        validate(key);
	        return unwrap(this).get(key) !== undefined;
	      }

	      function delete_(key) {
	        validate(key);
	        var data = unwrap(this),
	            had = data.get(key) !== undefined;
	        data.set(key, undefined);
	        return had;
	      }

	      function toString() {
	        unwrap(this);
	        return '[object WeakMap]';
	      }

	      try {
	        var src = ('return ' + delete_).replace('e_', '\\u0065'),
	            del = new Function('unwrap', 'validate', src)(unwrap, validate);
	      } catch (e) {
	        var del = delete_;
	      }

	      var src = ('' + Object).split('Object');
	      var stringifier = function toString() {
	        return src[0] + nameOf(this) + src[1];
	      };

	      define(stringifier, stringifier);

	      var prep = { __proto__: [] } instanceof Array ? function (f) {
	        f.__proto__ = stringifier;
	      } : function (f) {
	        define(f, stringifier);
	      };

	      prep(WeakMap);

	      [toString, get, set, has, del].forEach(function (method) {
	        define(WeakMap.prototype, method);
	        prep(method);
	      });

	      return WeakMap;
	    }(new Data());

	    var defaultCreator = Object.create ? function () {
	      return Object.create(null);
	    } : function () {
	      return {};
	    };

	    function createStorage(creator) {
	      var weakmap = new WM();
	      creator || (creator = defaultCreator);

	      function storage(object, value) {
	        if (value || arguments.length === 2) {
	          weakmap.set(object, value);
	        } else {
	          value = weakmap.get(object);
	          if (value === undefined) {
	            value = creator(object);
	            weakmap.set(object, value);
	          }
	        }
	        return value;
	      }

	      return storage;
	    }

	    if (typeof module !== 'undefined') {
	      module.exports = WM;
	    } else if (typeof exports !== 'undefined') {
	      exports.WeakMap = WM;
	    } else if (!('WeakMap' in global)) {
	      global.WeakMap = WM;
	    }

	    WM.createStorage = createStorage;
	    if (global.WeakMap) global.WeakMap.createStorage = createStorage;
	  }((0, eval)('this'));
	});

	var WeakMap = interopDefault(weakmap);

	function eachChildNode(node, func) {
	  if (!node) {
	    return;
	  }

	  var chs = node.childNodes;
	  var chsLen = chs.length;
	  for (var a = 0; a < chsLen; a++) {
	    var ret = func(chs[a], a, chs);
	    if (typeof ret !== 'undefined') {
	      return ret; // eslint-disable-line consistent-return
	    }
	  }
	}

	// Re-implemented to avoid Array.prototype.slice.call for performance reasons
	function reverse(arr) {
	  var reversedArray = [];
	  for (var i = arr.length - 1; i >= 0; i--) {
	    reversedArray.push(arr[i]);
	  }
	  return reversedArray;
	}

	/**
	 * Execute func over all child nodes or a document fragment, or a single node
	 * @param node the node or document fragment
	 * @param func a function to execute on node or the children of node, if node is a document fragment.
	 *        func may optionally append the node elsewhere, in the case of a document fragment
	 */
	function eachNodeOrFragmentNodes(node, func) {
	  if (node instanceof DocumentFragment) {
	    var chs = node.childNodes;
	    var chsLen = chs.length;

	    // We must iterate in reverse to handle the case where child nodes are moved elsewhere during execution
	    for (var a = chsLen - 1; a >= 0; a--) {
	      var thisNode = reverse(node.childNodes)[a];
	      func(thisNode, a);
	    }
	  } else {
	    func(node, 0);
	  }
	}

	var div$1 = document.createElement('div');

	function getPrototype(obj, key) {
	  var descriptor = void 0;

	  while (obj && !(descriptor = Object.getOwnPropertyDescriptor(obj, key))) {
	    // eslint-disable-line no-cond-assign
	    obj = Object.getPrototypeOf(obj);
	  }
	  return descriptor;
	}
	function getPropertyDescriptor (obj, key) {
	  if (obj instanceof Node) {
	    obj = div$1;
	  }
	  var proto = getPrototype(obj, key);

	  if (proto) {
	    var getter = proto.get;
	    var setter = proto.set;
	    var _descriptor = {
	      configurable: true,
	      enumerable: true
	    };

	    if (getter) {
	      _descriptor.get = getter;
	      _descriptor.set = setter;
	      return _descriptor;
	    } else if (typeof obj[key] === 'function') {
	      _descriptor.value = obj[key];
	      return _descriptor;
	    }
	  }

	  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
	  if (descriptor && descriptor.get) {
	    return descriptor;
	  }
	}

	var nativeParentNode = getPropertyDescriptor(Element.prototype, 'innerHTML');

	var canPatchNativeAccessors = !!nativeParentNode;

	/**
	 * See https://w3c.github.io/DOM-Parsing/#serializing
	 * @param {TextNode}
	 * @returns {string}
	 */
	function getEscapedTextContent(textNode) {
	  return textNode.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	/**
	 * @param {TextNode}
	 * @returns {string}
	 */
	function getRawTextContent(textNode) {
	  return textNode.textContent;
	}

	/**
	 * @returns {string}
	 * @param {commentNode}
	 */
	function getCommentNodeOuterHtml(commentNode) {
	  return commentNode.text || "<!--" + commentNode.textContent + "-->";
	}

	function isSlotNode (node) {
	  return node.tagName === 'SLOT';
	}

	function findSlots(root) {
	  var slots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var childNodes = root.childNodes;


	  if (shadowDomV0 && !shadowDomV1) {
	    return [].concat(babelHelpers.toConsumableArray(root.querySelectorAll('content')));
	  }

	  if (!childNodes || [Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].indexOf(root.nodeType) === -1) {
	    return slots;
	  }

	  var length = childNodes.length;


	  for (var a = 0; a < length; a++) {
	    var childNode = childNodes[a];

	    if (isSlotNode(childNode)) {
	      slots.push(childNode);
	    }
	    findSlots(childNode, slots);
	  }

	  return slots;
	}

	function isRootNode (node) {
	  return node.tagName === '_SHADOW_ROOT_';
	}

	var pseudoArrayToArray = (function (pseudoArray) {
	  return Array.prototype.slice.call(pseudoArray);
	});

	var arrProto = Array.prototype;
	var forEach = arrProto.forEach;

	// We use a real DOM node for a shadow root. This is because the host node
	// basically becomes a virtual entry point for your element leaving the shadow
	// root the only thing that can receive instructions on how the host should
	// render to the browser.

	var defaultShadowRootTagName = '_shadow_root_';

	// * WebKit only *
	//
	// These members we need cannot override as we require native access to their
	// original values at some point.
	var polyfillAtRuntime = ['childNodes', 'parentNode'];

	// Some properties that should not be overridden in the Text prototype.
	var doNotOverridePropertiesInTextNodes = ['textContent'];

	// Some new properties that should be defined in the Text prototype.
	var defineInTextNodes = ['assignedSlot'];

	// Some properties that should not be overridden in the Comment prototype.
	var doNotOverridePropertiesInCommNodes = ['textContent'];

	// Some new properties that should be defined in the Comment prototype.
	var defineInCommNodes = [];

	// Nodes that should be slotted
	var slottedNodeTypes = [Node.ELEMENT_NODE, Node.TEXT_NODE];

	// Private data stores.
	var assignedToSlotMap = new WeakMap();
	var hostToModeMap = new WeakMap();
	var hostToRootMap = new WeakMap();
	var nodeToChildNodesMap = new WeakMap();
	var nodeToParentNodeMap = new WeakMap();
	var nodeToSlotMap = new WeakMap();
	var rootToHostMap = new WeakMap();
	var rootToSlotMap = new WeakMap();
	var slotToRootMap = new WeakMap();

	// Unfortunately manual DOM parsing is because of WebKit.
	var parser = new DOMParser();
	function parse(html) {
	  var tree = document.createElement('div');

	  // Everything not WebKit can do this easily.
	  if (canPatchNativeAccessors) {
	    tree.__innerHTML = html;
	    return tree;
	  }

	  var parsed = parser.parseFromString('<div>' + html + '</div>', 'text/html').body.firstChild;

	  while (parsed.hasChildNodes()) {
	    var firstChild = parsed.firstChild;
	    parsed.removeChild(firstChild);
	    tree.appendChild(firstChild);
	  }

	  // Need to import the node to initialise the custom elements from the parser.
	  return document.importNode(tree, true);
	}

	function staticProp(obj, name, value) {
	  Object.defineProperty(obj, name, {
	    configurable: true,
	    get: function get() {
	      return value;
	    }
	  });
	}

	// Slotting helpers.

	function arrayItem(idx) {
	  return this[idx];
	}

	function makeLikeNodeList(arr) {
	  arr.item = arrayItem;
	  return arr;
	}

	function isHostNode(node) {
	  return !!hostToRootMap.get(node);
	}

	function getNodeType(node) {
	  if (isHostNode(node)) {
	    return 'host';
	  }

	  if (isSlotNode(node)) {
	    return 'slot';
	  }

	  if (isRootNode(node)) {
	    return 'root';
	  }

	  return 'node';
	}

	function findClosest(node, func) {
	  while (node) {
	    if (node === document) {
	      break;
	    }
	    if (func(node)) {
	      return node;
	    }
	    node = node.parentNode;
	  }
	}

	function getSlotNameFromSlot(node) {
	  return node.getAttribute && node.getAttribute('name') || 'default';
	}

	function getSlotNameFromNode(node) {
	  return node.getAttribute && node.getAttribute('slot') || 'default';
	}

	function slotNodeIntoSlot(slot, node, insertBefore) {
	  // Only Text and Element nodes should be slotted.
	  if (slottedNodeTypes.indexOf(node.nodeType) === -1) {
	    return;
	  }

	  var assignedNodes = slot.assignedNodes();
	  var shouldGoIntoContentMode = assignedNodes.length === 0;
	  var slotInsertBeforeIndex = assignedNodes.indexOf(insertBefore);

	  // Assign the slot to the node internally.
	  nodeToSlotMap.set(node, slot);

	  // Remove the fallback content and state if we're going into content mode.
	  if (shouldGoIntoContentMode) {
	    forEach.call(slot.childNodes, function (child) {
	      return slot.__removeChild(child);
	    });
	  }

	  if (slotInsertBeforeIndex > -1) {
	    slot.__insertBefore(node, insertBefore !== undefined ? insertBefore : null);
	    assignedNodes.splice(slotInsertBeforeIndex, 0, node);
	  } else {
	    slot.__appendChild(node);
	    assignedNodes.push(node);
	  }

	  slot.____triggerSlotChangeEvent();
	}

	function slotNodeFromSlot(node) {
	  var slot = nodeToSlotMap.get(node);

	  if (slot) {
	    var assignedNodes = slot.assignedNodes();
	    var index = assignedNodes.indexOf(node);

	    if (index > -1) {
	      var shouldGoIntoDefaultMode = assignedNodes.length === 1;

	      assignedNodes.splice(index, 1);
	      nodeToSlotMap.set(node, null);

	      // Actually remove the child.
	      slot.__removeChild(node);

	      // If this was the last slotted node, then insert fallback content.
	      if (shouldGoIntoDefaultMode) {
	        forEach.call(slot.childNodes, function (child) {
	          return slot.__appendChild(child);
	        });
	      }

	      slot.____triggerSlotChangeEvent();
	    }
	  }
	}

	// Returns the index of the node in the host's childNodes.
	function indexOfNode(host, node) {
	  var chs = host.childNodes;
	  var chsLen = chs.length;
	  for (var a = 0; a < chsLen; a++) {
	    if (chs[a] === node) {
	      return a;
	    }
	  }
	  return -1;
	}

	// Adds the node to the list of childNodes on the host and fakes any necessary
	// information such as parentNode.
	function registerNode(host, node, insertBefore, func) {
	  var index = indexOfNode(host, insertBefore);
	  eachNodeOrFragmentNodes(node, function (eachNode, eachIndex) {
	    func(eachNode, eachIndex);

	    if (canPatchNativeAccessors) {
	      nodeToParentNodeMap.set(eachNode, host);
	    } else {
	      staticProp(eachNode, 'parentNode', host);
	    }

	    if (index > -1) {
	      arrProto.splice.call(host.childNodes, index + eachIndex, 0, eachNode);
	    } else {
	      arrProto.push.call(host.childNodes, eachNode);
	    }
	  });
	}

	// Cleans up registerNode().
	function unregisterNode(host, node, func) {
	  var index = indexOfNode(host, node);

	  if (index > -1) {
	    func(node, 0);

	    if (canPatchNativeAccessors) {
	      nodeToParentNodeMap.set(node, null);
	    } else {
	      staticProp(node, 'parentNode', null);
	    }

	    arrProto.splice.call(host.childNodes, index, 1);
	  }
	}

	function addNodeToNode(host, node, insertBefore) {
	  registerNode(host, node, insertBefore, function (eachNode) {
	    host.__insertBefore(eachNode, insertBefore !== undefined ? insertBefore : null);
	  });
	}

	function addNodeToHost(host, node, insertBefore) {
	  registerNode(host, node, insertBefore, function (eachNode) {
	    var rootNode = hostToRootMap.get(host);
	    var slotNodes = rootToSlotMap.get(rootNode);
	    var slotNode = slotNodes[getSlotNameFromNode(eachNode)];
	    if (slotNode) {
	      slotNodeIntoSlot(slotNode, eachNode, insertBefore);
	    }
	  });
	}

	function addSlotToRoot(root, slot) {
	  var slotName = getSlotNameFromSlot(slot);

	  // Ensure a slot node's childNodes are overridden at the earliest point
	  // possible for WebKit.
	  if (!canPatchNativeAccessors && !Array.isArray(slot.childNodes)) {
	    staticProp(slot, 'childNodes', pseudoArrayToArray(slot.childNodes));
	  }

	  rootToSlotMap.get(root)[slotName] = slot;

	  if (!slotToRootMap.has(slot)) {
	    slotToRootMap.set(slot, root);
	  }

	  eachChildNode(rootToHostMap.get(root), function (eachNode) {
	    if (!eachNode.assignedSlot && slotName === getSlotNameFromNode(eachNode)) {
	      slotNodeIntoSlot(slot, eachNode);
	    }
	  });
	}

	function addNodeToRoot(root, node, insertBefore) {
	  eachNodeOrFragmentNodes(node, function (child) {
	    if (isSlotNode(child)) {
	      addSlotToRoot(root, child);
	    } else {
	      var slotNodes = findSlots(child);
	      if (slotNodes) {
	        var slotNodesLen = slotNodes.length;
	        for (var a = 0; a < slotNodesLen; a++) {
	          addSlotToRoot(root, slotNodes[a]);
	        }
	      }
	    }
	  });
	  addNodeToNode(root, node, insertBefore);
	}

	// Adds a node to a slot. In other words, adds default content to a slot. It
	// ensures that if the slot doesn't have any assigned nodes yet, that the node
	// is actually displayed, otherwise it's just registered as child content.
	function addNodeToSlot(slot, node, insertBefore) {
	  var isInDefaultMode = slot.assignedNodes().length === 0;
	  registerNode(slot, node, insertBefore, function (eachNode) {
	    if (isInDefaultMode) {
	      slot.__insertBefore(eachNode, insertBefore !== undefined ? insertBefore : null);
	    }
	  });
	}

	// Removes a node from a slot (default content). It ensures that if the slot
	// doesn't have any assigned nodes yet, that the node is actually removed,
	// otherwise it's just unregistered.
	function removeNodeFromSlot(slot, node) {
	  var isInDefaultMode = slot.assignedNodes().length === 0;
	  unregisterNode(slot, node, function () {
	    if (isInDefaultMode) {
	      slot.__removeChild(node);
	    }
	  });
	}

	function removeNodeFromNode(host, node) {
	  unregisterNode(host, node, function () {
	    host.__removeChild(node);
	  });
	}

	function removeNodeFromHost(host, node) {
	  unregisterNode(host, node, function () {
	    slotNodeFromSlot(node);
	  });
	}

	function removeSlotFromRoot(root, node) {
	  var assignedNodes = Array.prototype.slice.call(node.assignedNodes());
	  assignedNodes.forEach(slotNodeFromSlot);
	  delete rootToSlotMap.get(root)[getSlotNameFromSlot(node)];
	  slotToRootMap.delete(node);
	}

	function removeNodeFromRoot(root, node) {
	  unregisterNode(root, node, function () {
	    if (isSlotNode(node)) {
	      removeSlotFromRoot(root, node);
	    } else {
	      var nodes = findSlots(node);
	      if (nodes) {
	        for (var a = 0; a < nodes.length; a++) {
	          removeSlotFromRoot(root, nodes[a]);
	        }
	      }
	    }
	    root.__removeChild(node);
	  });
	}

	// TODO terribly inefficient
	function getRootNode(host) {
	  if (isRootNode(host)) {
	    return host;
	  }

	  if (!host.parentNode) {
	    return;
	  }

	  return getRootNode(host.parentNode);
	}

	function appendChildOrInsertBefore(host, newNode, refNode) {
	  var nodeType = getNodeType(host);
	  var parentNode = newNode.parentNode;
	  var rootNode = getRootNode(host);

	  // Ensure childNodes is patched so we can manually update it for WebKit.
	  if (!canPatchNativeAccessors && !Array.isArray(host.childNodes)) {
	    staticProp(host, 'childNodes', pseudoArrayToArray(host.childNodes));
	  }

	  if (rootNode && getNodeType(newNode) === 'slot') {
	    addSlotToRoot(rootNode, newNode);
	  }

	  // If we append a child to a host, the host tells the shadow root to distribute
	  // it. If the root decides it doesn't need to be distributed, it is never
	  // removed from the old parent because in polyfill land we store a reference
	  // to the node but we don't move it. Due to that, we must explicitly remove the
	  // node from its old parent.
	  if (parentNode && getNodeType(parentNode) === 'host') {
	    if (canPatchNativeAccessors) {
	      nodeToParentNodeMap.set(newNode, null);
	    } else {
	      staticProp(newNode, 'parentNode', null);
	    }
	  }

	  // safari doesn't update its children properly for some reason, so it needs a little push
	  if (!canPatchNativeAccessors && parentNode) {
	    parentNode.removeChild(newNode);
	  }

	  if (nodeType === 'node') {
	    if (canPatchNativeAccessors) {
	      nodeToParentNodeMap.set(newNode, host);
	      return host.__insertBefore(newNode, refNode !== undefined ? refNode : null);
	    }

	    return addNodeToNode(host, newNode, refNode);
	  }

	  if (nodeType === 'slot') {
	    return addNodeToSlot(host, newNode, refNode);
	  }

	  if (nodeType === 'host') {
	    return addNodeToHost(host, newNode, refNode);
	  }

	  if (nodeType === 'root') {
	    return addNodeToRoot(host, newNode, refNode);
	  }
	}

	function syncSlotChildNodes(node) {
	  if (canPatchNativeAccessors && getNodeType(node) === 'slot' && node.__childNodes.length !== node.childNodes.length) {
	    while (node.hasChildNodes()) {
	      node.removeChild(node.firstChild);
	    }

	    forEach.call(node.__childNodes, function (child) {
	      return node.appendChild(child);
	    });
	  }
	}

	var members = {
	  // For testing purposes.
	  ____assignedNodes: {
	    get: function get() {
	      return this.______assignedNodes || (this.______assignedNodes = []);
	    }
	  },

	  // For testing purposes.
	  ____isInFallbackMode: {
	    get: function get() {
	      return this.assignedNodes().length === 0;
	    }
	  },

	  ____slotChangeListeners: {
	    get: function get() {
	      if (typeof this.______slotChangeListeners === 'undefined') {
	        this.______slotChangeListeners = 0;
	      }
	      return this.______slotChangeListeners;
	    },
	    set: function set(value) {
	      this.______slotChangeListeners = value;
	    }
	  },
	  ____triggerSlotChangeEvent: {
	    value: debounce(function callback() {
	      if (this.____slotChangeListeners) {
	        this.dispatchEvent(new CustomEvent('slotchange', {
	          bubbles: false,
	          cancelable: false
	        }));
	      }
	    })
	  },
	  addEventListener: {
	    value: function value(name, func, opts) {
	      if (name === 'slotchange' && isSlotNode(this)) {
	        this.____slotChangeListeners++;
	      }
	      return this.__addEventListener(name, func, opts);
	    }
	  },
	  appendChild: {
	    value: function value(newNode) {
	      appendChildOrInsertBefore(this, newNode);
	      return newNode;
	    }
	  },
	  assignedSlot: {
	    get: function get() {
	      var slot = nodeToSlotMap.get(this);

	      if (!slot) {
	        return null;
	      }

	      var root = slotToRootMap.get(slot);
	      var host = rootToHostMap.get(root);
	      var mode = hostToModeMap.get(host);

	      return mode === 'open' ? slot : null;
	    }
	  },
	  attachShadow: {
	    value: function value(opts) {
	      var _this = this;

	      var mode = opts && opts.mode;
	      if (mode !== 'closed' && mode !== 'open') {
	        throw new Error('You must specify { mode } as "open" or "closed" to attachShadow().');
	      }

	      // Return the existing shadow root if it exists.
	      var existingShadowRoot = hostToRootMap.get(this);
	      if (existingShadowRoot) {
	        return existingShadowRoot;
	      }

	      var lightNodes = makeLikeNodeList([].slice.call(this.childNodes));
	      var shadowRoot = document.createElement(opts.polyfillShadowRootTagName || defaultShadowRootTagName);

	      // Host and shadow root data.
	      hostToModeMap.set(this, mode);
	      hostToRootMap.set(this, shadowRoot);
	      rootToHostMap.set(shadowRoot, this);
	      rootToSlotMap.set(shadowRoot, {});

	      if (canPatchNativeAccessors) {
	        nodeToChildNodesMap.set(this, lightNodes);
	      } else {
	        staticProp(this, 'childNodes', lightNodes);
	      }

	      // Process light DOM.
	      lightNodes.forEach(function (node) {
	        // Existing children should be removed from being displayed, but still
	        // appear to be child nodes. This is how light DOM works; they're still
	        // child nodes but not in the composed DOM yet as there won't be any
	        // slots for them to go into.
	        _this.__removeChild(node);

	        // We must register the parentNode here as this has the potential to
	        // become out of sync if the node is moved before being slotted.
	        if (canPatchNativeAccessors) {
	          nodeToParentNodeMap.set(node, _this);
	        } else {
	          staticProp(node, 'parentNode', _this);
	        }
	      });

	      // The shadow root is actually the only child of the host.
	      return this.__appendChild(shadowRoot);
	    }
	  },
	  childElementCount: {
	    get: function get() {
	      return this.children.length;
	    }
	  },
	  childNodes: {
	    get: function get() {
	      if (canPatchNativeAccessors && getNodeType(this) === 'node') {
	        return this.__childNodes;
	      }
	      var childNodes = nodeToChildNodesMap.get(this);

	      if (!childNodes) {
	        nodeToChildNodesMap.set(this, childNodes = makeLikeNodeList([]));
	      }

	      return childNodes;
	    }
	  },
	  children: {
	    get: function get() {
	      var chs = [];
	      eachChildNode(this, function (node) {
	        if (node.nodeType === 1) {
	          chs.push(node);
	        }
	      });
	      return makeLikeNodeList(chs);
	    }
	  },
	  firstChild: {
	    get: function get() {
	      return this.childNodes[0] || null;
	    }
	  },
	  firstElementChild: {
	    get: function get() {
	      return this.children[0] || null;
	    }
	  },
	  assignedNodes: {
	    value: function value() {
	      if (isSlotNode(this)) {
	        var assigned = assignedToSlotMap.get(this);

	        if (!assigned) {
	          assignedToSlotMap.set(this, assigned = []);
	        }

	        return assigned;
	      }
	    }
	  },
	  hasChildNodes: {
	    value: function value() {
	      return this.childNodes.length > 0;
	    }
	  },
	  innerHTML: {
	    get: function get() {
	      var innerHTML = '';

	      var getHtmlNodeOuterHtml = function getHtmlNodeOuterHtml(node) {
	        return node.outerHTML;
	      };
	      var getOuterHtmlByNodeType = {};
	      getOuterHtmlByNodeType[Node.ELEMENT_NODE] = getHtmlNodeOuterHtml;
	      getOuterHtmlByNodeType[Node.COMMENT_NODE] = getCommentNodeOuterHtml;

	      // Text nodes with these ancestors should be treated as raw text
	      // See section 8.4 of
	      // https://www.w3.org/TR/2008/WD-html5-20080610/serializing.html#html-fragment
	      // Though Chrome does not adhere to spec for <noscript/>
	      var rawTextNodeNames = {
	        style: true,
	        script: true,
	        xmp: true,
	        iframe: true,
	        noembed: true,
	        noframes: true,
	        noscript: true,
	        plaintext: true
	      };

	      function isRawTextNode(node) {
	        return node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() in rawTextNodeNames;
	      }

	      var isParentNodeRawText = isRawTextNode(this);

	      eachChildNode(this, function (node) {
	        var getOuterHtml = void 0;
	        if (node.nodeType === Node.TEXT_NODE) {
	          if (isParentNodeRawText) {
	            getOuterHtml = getRawTextContent;
	          } else {
	            getOuterHtml = getEscapedTextContent;
	          }
	        } else {
	          getOuterHtml = getOuterHtmlByNodeType[node.nodeType] || getHtmlNodeOuterHtml;
	        }
	        innerHTML += getOuterHtml(node);
	      });
	      return innerHTML;
	    },
	    set: function set(innerHTML) {
	      var parsed = parse(innerHTML);

	      while (this.hasChildNodes()) {
	        this.removeChild(this.firstChild);
	      }

	      // when we are doing this: root.innerHTML = "<slot><div></div></slot>";
	      // slot.__childNodes is out of sync with slot.childNodes.
	      // to fix it we have to manually remove and insert them
	      var slots = findSlots(parsed);
	      forEach.call(slots, function (slot) {
	        return syncSlotChildNodes(slot);
	      });

	      while (parsed.hasChildNodes()) {
	        var firstChild = parsed.firstChild;

	        // When we polyfill everything on HTMLElement.prototype, we overwrite
	        // properties. This makes it so that parentNode reports null even though
	        // it's actually a parent of the HTML parser. For this reason,
	        // cleanNode() won't work and we must manually remove it from the
	        // parser before it is moved to the host just in case it's added as a
	        // light node but not assigned to a slot.
	        parsed.removeChild(firstChild);

	        this.appendChild(firstChild);
	      }
	    }
	  },
	  insertBefore: {
	    value: function value(newNode, refNode) {
	      appendChildOrInsertBefore(this, newNode, refNode);

	      return newNode;
	    }
	  },
	  lastChild: {
	    get: function get() {
	      var ch = this.childNodes;
	      return ch[ch.length - 1] || null;
	    }
	  },
	  lastElementChild: {
	    get: function get() {
	      var ch = this.children;
	      return ch[ch.length - 1] || null;
	    }
	  },
	  name: {
	    get: function get() {
	      return this.getAttribute('name');
	    },
	    set: function set(name) {
	      var oldName = this.name;
	      var ret = this.__setAttribute('name', name);

	      if (name === oldName) {
	        return ret;
	      }

	      if (!isSlotNode(this)) {
	        return ret;
	      }
	      var root = slotToRootMap.get(this);
	      if (root) {
	        removeSlotFromRoot(root, this);
	        addSlotToRoot(root, this);
	      }
	      return ret;
	    }
	  },
	  nextSibling: {
	    get: function get() {
	      var host = this;
	      return eachChildNode(this.parentNode, function (child, index, nodes) {
	        if (host === child) {
	          return nodes[index + 1] || null;
	        }
	      });
	    }
	  },
	  nextElementSibling: {
	    get: function get() {
	      var host = this;
	      var found = void 0;
	      return eachChildNode(this.parentNode, function (child) {
	        if (found && child.nodeType === 1) {
	          return child;
	        }
	        if (host === child) {
	          found = true;
	        }
	      });
	    }
	  },
	  outerHTML: {
	    get: function get() {
	      var name = this.tagName.toLowerCase();
	      var attributes = Array.prototype.slice.call(this.attributes).map(function (attr) {
	        return ' ' + attr.name + (attr.value ? '="' + attr.value + '"' : '');
	      }).join('');
	      return '<' + name + attributes + '>' + this.innerHTML + '</' + name + '>';
	    },
	    set: function set(outerHTML) {
	      if (this.parentNode) {
	        var parsed = parse(outerHTML);
	        this.parentNode.replaceChild(parsed.firstChild, this);
	      } else if (canPatchNativeAccessors) {
	        this.__outerHTML = outerHTML; // this will throw a native error;
	      } else {
	        throw new Error('Failed to set the \'outerHTML\' property on \'Element\': This element has no parent node.');
	      }
	    }
	  },
	  parentElement: {
	    get: function get() {
	      return findClosest(this.parentNode, function (node) {
	        return node.nodeType === 1;
	      });
	    }
	  },
	  parentNode: {
	    get: function get() {
	      return nodeToParentNodeMap.get(this) || this.__parentNode || null;
	    }
	  },
	  previousSibling: {
	    get: function get() {
	      var host = this;
	      return eachChildNode(this.parentNode, function (child, index, nodes) {
	        if (host === child) {
	          return nodes[index - 1] || null;
	        }
	      });
	    }
	  },
	  previousElementSibling: {
	    get: function get() {
	      var host = this;
	      var found = void 0;
	      return eachChildNode(this.parentNode, function (child) {
	        if (found && host === child) {
	          return found;
	        }
	        if (child.nodeType === 1) {
	          found = child;
	        }
	      });
	    }
	  },
	  removeChild: {
	    value: function value(refNode) {
	      var nodeType = getNodeType(this);

	      switch (nodeType) {
	        case 'node':
	          if (canPatchNativeAccessors) {
	            nodeToParentNodeMap.set(refNode, null);
	            return this.__removeChild(refNode);
	          }
	          removeNodeFromNode(this, refNode);
	          break;
	        case 'slot':
	          removeNodeFromSlot(this, refNode);
	          break;
	        case 'host':
	          removeNodeFromHost(this, refNode);
	          break;
	        case 'root':
	          removeNodeFromRoot(this, refNode);
	          break;
	        default:
	          break;
	      }
	      return refNode;
	    }
	  },
	  removeEventListener: {
	    value: function value(name, func, opts) {
	      if (name === 'slotchange' && this.____slotChangeListeners && isSlotNode(this)) {
	        this.____slotChangeListeners--;
	      }
	      return this.__removeEventListener(name, func, opts);
	    }
	  },
	  replaceChild: {
	    value: function value(newNode, refNode) {
	      this.insertBefore(newNode, refNode);
	      return this.removeChild(refNode);
	    }
	  },
	  setAttribute: {
	    value: function value(attrName, attrValue) {
	      if (attrName === 'slot') {
	        this[attrName] = attrValue;
	      }
	      if (isSlotNode(this)) {
	        if (attrName === 'name') {
	          this[attrName] = attrValue;
	        }
	      }
	      return this.__setAttribute(attrName, attrValue);
	    }
	  },
	  shadowRoot: {
	    get: function get() {
	      return hostToModeMap.get(this) === 'open' ? hostToRootMap.get(this) : null;
	    }
	  },
	  slot: {
	    get: function get() {
	      return this.getAttribute('slot');
	    },
	    set: function set(name) {
	      var oldName = this.name;
	      var ret = this.__setAttribute('slot', name);

	      if (oldName === name) {
	        return ret;
	      }

	      var slot = nodeToSlotMap.get(this);
	      var root = slot && slotToRootMap.get(slot);
	      var host = root && rootToHostMap.get(root);

	      if (host) {
	        removeNodeFromHost(host, this);
	        addNodeToHost(host, this);
	      }
	      return ret;
	    }
	  },
	  textContent: {
	    get: function get() {
	      var textContent = '';
	      eachChildNode(this, function (node) {
	        if (node.nodeType !== Node.COMMENT_NODE) {
	          textContent += node.textContent;
	        }
	      });
	      return textContent;
	    },
	    set: function set(textContent) {
	      while (this.hasChildNodes()) {
	        this.removeChild(this.firstChild);
	      }
	      if (!textContent) {
	        return;
	      }
	      this.appendChild(document.createTextNode(textContent));
	    }
	  }
	};

	var v1 = (function () {
	  var commProto = Comment.prototype;
	  var elementProto = HTMLElement.prototype;
	  var svgProto = SVGElement.prototype;
	  var textProto = Text.prototype;
	  var textNode = document.createTextNode('');
	  var commNode = document.createComment('');

	  Object.keys(members).forEach(function (memberName) {
	    var memberProperty = members[memberName];

	    // All properties should be configurable and enumerable.
	    memberProperty.configurable = true;
	    memberProperty.enumerable = true;

	    // Applying to the data properties only since we can't have writable accessor properties.
	    if (memberProperty.hasOwnProperty('value')) {
	      // eslint-disable-line no-prototype-builtins
	      memberProperty.writable = true;
	    }

	    // Polyfill as much as we can and work around WebKit in other areas.
	    if (canPatchNativeAccessors || polyfillAtRuntime.indexOf(memberName) === -1) {
	      var nativeDescriptor = getPropertyDescriptor(elementProto, memberName);
	      var nativeTextDescriptor = getPropertyDescriptor(textProto, memberName);
	      var nativeCommDescriptor = getPropertyDescriptor(commProto, memberName);
	      var shouldOverrideInTextNode = memberName in textNode && doNotOverridePropertiesInTextNodes.indexOf(memberName) === -1 || ~defineInTextNodes.indexOf(memberName);
	      var shouldOverrideInCommentNode = memberName in commNode && doNotOverridePropertiesInCommNodes.indexOf(memberName) === -1 || ~defineInCommNodes.indexOf(memberName);
	      var nativeMemberName = '__' + memberName;

	      Object.defineProperty(elementProto, memberName, memberProperty);
	      Object.defineProperty(svgProto, memberName, memberProperty);

	      if (nativeDescriptor) {
	        Object.defineProperty(elementProto, nativeMemberName, nativeDescriptor);
	        Object.defineProperty(svgProto, nativeMemberName, nativeDescriptor);
	      }

	      if (shouldOverrideInTextNode) {
	        Object.defineProperty(textProto, memberName, memberProperty);
	      }

	      if (shouldOverrideInTextNode && nativeTextDescriptor) {
	        Object.defineProperty(textProto, nativeMemberName, nativeTextDescriptor);
	      }

	      if (shouldOverrideInCommentNode) {
	        Object.defineProperty(commProto, memberName, memberProperty);
	      }

	      if (shouldOverrideInCommentNode && nativeCommDescriptor) {
	        Object.defineProperty(commProto, nativeMemberName, nativeCommDescriptor);
	      }
	    }
	  });
	});

	if (shadowDomV1) {
	  // then we should probably not be loading this
	} else if (shadowDomV0) {
	  v0();
	} else {
	  v1();
	}

	var documentRegisterElement_node = createCommonjsModule(function (module) {
	  /*!
	  
	  Copyright (C) 2014-2016 by Andrea Giammarchi - @WebReflection
	  
	  Permission is hereby granted, free of charge, to any person obtaining a copy
	  of this software and associated documentation files (the "Software"), to deal
	  in the Software without restriction, including without limitation the rights
	  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	  copies of the Software, and to permit persons to whom the Software is
	  furnished to do so, subject to the following conditions:
	  
	  The above copyright notice and this permission notice shall be included in
	  all copies or substantial portions of the Software.
	  
	  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	  THE SOFTWARE.
	  
	  */
	  function installCustomElements(window) {
	    'use strict';

	    // DO NOT USE THIS FILE DIRECTLY, IT WON'T WORK
	    // THIS IS A PROJECT BASED ON A BUILD SYSTEM
	    // THIS FILE IS JUST WRAPPED UP RESULTING IN
	    // build/document-register-element.node.js

	    var document = window.document,
	        Object = window.Object;

	    var htmlClass = function (info) {
	      // (C) Andrea Giammarchi - @WebReflection - MIT Style
	      var catchClass = /^[A-Z]+[a-z]/,
	          filterBy = function filterBy(re) {
	        var arr = [],
	            tag;
	        for (tag in register) {
	          if (re.test(tag)) arr.push(tag);
	        }
	        return arr;
	      },
	          add = function add(Class, tag) {
	        tag = tag.toLowerCase();
	        if (!(tag in register)) {
	          register[Class] = (register[Class] || []).concat(tag);
	          register[tag] = register[tag.toUpperCase()] = Class;
	        }
	      },
	          register = (Object.create || Object)(null),
	          htmlClass = {},
	          i,
	          section,
	          tags,
	          Class;
	      for (section in info) {
	        for (Class in info[section]) {
	          tags = info[section][Class];
	          register[Class] = tags;
	          for (i = 0; i < tags.length; i++) {
	            register[tags[i].toLowerCase()] = register[tags[i].toUpperCase()] = Class;
	          }
	        }
	      }
	      htmlClass.get = function get(tagOrClass) {
	        return typeof tagOrClass === 'string' ? register[tagOrClass] || (catchClass.test(tagOrClass) ? [] : '') : filterBy(tagOrClass);
	      };
	      htmlClass.set = function set(tag, Class) {
	        return catchClass.test(tag) ? add(tag, Class) : add(Class, tag), htmlClass;
	      };
	      return htmlClass;
	    }({
	      "collections": {
	        "HTMLAllCollection": ["all"],
	        "HTMLCollection": ["forms"],
	        "HTMLFormControlsCollection": ["elements"],
	        "HTMLOptionsCollection": ["options"]
	      },
	      "elements": {
	        "Element": ["element"],
	        "HTMLAnchorElement": ["a"],
	        "HTMLAppletElement": ["applet"],
	        "HTMLAreaElement": ["area"],
	        "HTMLAttachmentElement": ["attachment"],
	        "HTMLAudioElement": ["audio"],
	        "HTMLBRElement": ["br"],
	        "HTMLBaseElement": ["base"],
	        "HTMLBodyElement": ["body"],
	        "HTMLButtonElement": ["button"],
	        "HTMLCanvasElement": ["canvas"],
	        "HTMLContentElement": ["content"],
	        "HTMLDListElement": ["dl"],
	        "HTMLDataElement": ["data"],
	        "HTMLDataListElement": ["datalist"],
	        "HTMLDetailsElement": ["details"],
	        "HTMLDialogElement": ["dialog"],
	        "HTMLDirectoryElement": ["dir"],
	        "HTMLDivElement": ["div"],
	        "HTMLDocument": ["document"],
	        "HTMLElement": ["element", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "command", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "i", "kbd", "mark", "nav", "noscript", "rp", "rt", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr"],
	        "HTMLEmbedElement": ["embed"],
	        "HTMLFieldSetElement": ["fieldset"],
	        "HTMLFontElement": ["font"],
	        "HTMLFormElement": ["form"],
	        "HTMLFrameElement": ["frame"],
	        "HTMLFrameSetElement": ["frameset"],
	        "HTMLHRElement": ["hr"],
	        "HTMLHeadElement": ["head"],
	        "HTMLHeadingElement": ["h1", "h2", "h3", "h4", "h5", "h6"],
	        "HTMLHtmlElement": ["html"],
	        "HTMLIFrameElement": ["iframe"],
	        "HTMLImageElement": ["img"],
	        "HTMLInputElement": ["input"],
	        "HTMLKeygenElement": ["keygen"],
	        "HTMLLIElement": ["li"],
	        "HTMLLabelElement": ["label"],
	        "HTMLLegendElement": ["legend"],
	        "HTMLLinkElement": ["link"],
	        "HTMLMapElement": ["map"],
	        "HTMLMarqueeElement": ["marquee"],
	        "HTMLMediaElement": ["media"],
	        "HTMLMenuElement": ["menu"],
	        "HTMLMenuItemElement": ["menuitem"],
	        "HTMLMetaElement": ["meta"],
	        "HTMLMeterElement": ["meter"],
	        "HTMLModElement": ["del", "ins"],
	        "HTMLOListElement": ["ol"],
	        "HTMLObjectElement": ["object"],
	        "HTMLOptGroupElement": ["optgroup"],
	        "HTMLOptionElement": ["option"],
	        "HTMLOutputElement": ["output"],
	        "HTMLParagraphElement": ["p"],
	        "HTMLParamElement": ["param"],
	        "HTMLPictureElement": ["picture"],
	        "HTMLPreElement": ["pre"],
	        "HTMLProgressElement": ["progress"],
	        "HTMLQuoteElement": ["blockquote", "q", "quote"],
	        "HTMLScriptElement": ["script"],
	        "HTMLSelectElement": ["select"],
	        "HTMLShadowElement": ["shadow"],
	        "HTMLSlotElement": ["slot"],
	        "HTMLSourceElement": ["source"],
	        "HTMLSpanElement": ["span"],
	        "HTMLStyleElement": ["style"],
	        "HTMLTableCaptionElement": ["caption"],
	        "HTMLTableCellElement": ["td", "th"],
	        "HTMLTableColElement": ["col", "colgroup"],
	        "HTMLTableElement": ["table"],
	        "HTMLTableRowElement": ["tr"],
	        "HTMLTableSectionElement": ["thead", "tbody", "tfoot"],
	        "HTMLTemplateElement": ["template"],
	        "HTMLTextAreaElement": ["textarea"],
	        "HTMLTimeElement": ["time"],
	        "HTMLTitleElement": ["title"],
	        "HTMLTrackElement": ["track"],
	        "HTMLUListElement": ["ul"],
	        "HTMLUnknownElement": ["unknown", "vhgroupv", "vkeygen"],
	        "HTMLVideoElement": ["video"]
	      },
	      "nodes": {
	        "Attr": ["node"],
	        "Audio": ["audio"],
	        "CDATASection": ["node"],
	        "CharacterData": ["node"],
	        "Comment": ["#comment"],
	        "Document": ["#document"],
	        "DocumentFragment": ["#document-fragment"],
	        "DocumentType": ["node"],
	        "HTMLDocument": ["#document"],
	        "Image": ["img"],
	        "Option": ["option"],
	        "ProcessingInstruction": ["node"],
	        "ShadowRoot": ["#shadow-root"],
	        "Text": ["#text"],
	        "XMLDocument": ["xml"]
	      }
	    });

	    var
	    // V0 polyfill entry
	    REGISTER_ELEMENT = 'registerElement',


	    // IE < 11 only + old WebKit for attributes + feature detection
	    EXPANDO_UID = '__' + REGISTER_ELEMENT + (window.Math.random() * 10e4 >> 0),


	    // shortcuts and costants
	    ADD_EVENT_LISTENER = 'addEventListener',
	        ATTACHED = 'attached',
	        CALLBACK = 'Callback',
	        DETACHED = 'detached',
	        EXTENDS = 'extends',
	        ATTRIBUTE_CHANGED_CALLBACK = 'attributeChanged' + CALLBACK,
	        ATTACHED_CALLBACK = ATTACHED + CALLBACK,
	        CONNECTED_CALLBACK = 'connected' + CALLBACK,
	        DISCONNECTED_CALLBACK = 'disconnected' + CALLBACK,
	        CREATED_CALLBACK = 'created' + CALLBACK,
	        DETACHED_CALLBACK = DETACHED + CALLBACK,
	        ADDITION = 'ADDITION',
	        MODIFICATION = 'MODIFICATION',
	        REMOVAL = 'REMOVAL',
	        DOM_ATTR_MODIFIED = 'DOMAttrModified',
	        DOM_CONTENT_LOADED = 'DOMContentLoaded',
	        DOM_SUBTREE_MODIFIED = 'DOMSubtreeModified',
	        PREFIX_TAG = '<',
	        PREFIX_IS = '=',


	    // valid and invalid node names
	    validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,
	        invalidNames = ['ANNOTATION-XML', 'COLOR-PROFILE', 'FONT-FACE', 'FONT-FACE-SRC', 'FONT-FACE-URI', 'FONT-FACE-FORMAT', 'FONT-FACE-NAME', 'MISSING-GLYPH'],


	    // registered types and their prototypes
	    types = [],
	        protos = [],


	    // to query subnodes
	    query = '',


	    // html shortcut used to feature detect
	    documentElement = document.documentElement,


	    // ES5 inline helpers || basic patches
	    indexOf = types.indexOf || function (v) {
	      for (var i = this.length; i-- && this[i] !== v;) {}
	      return i;
	    },


	    // other helpers / shortcuts
	    OP = Object.prototype,
	        hOP = OP.hasOwnProperty,
	        iPO = OP.isPrototypeOf,
	        defineProperty = Object.defineProperty,
	        empty = [],
	        gOPD = Object.getOwnPropertyDescriptor,
	        gOPN = Object.getOwnPropertyNames,
	        gPO = Object.getPrototypeOf,
	        sPO = Object.setPrototypeOf,


	    // jshint proto: true
	    hasProto = !!Object.__proto__,


	    // V1 helpers
	    fixGetClass = false,
	        DRECEV1 = '__dreCEv1',
	        customElements = window.customElements,
	        usableCustomElements = !!(customElements && customElements.define && customElements.get && customElements.whenDefined),
	        Dict = Object.create || Object,
	        Map = window.Map || function Map() {
	      var K = [],
	          V = [],
	          i;
	      return {
	        get: function get(k) {
	          return V[indexOf.call(K, k)];
	        },
	        set: function set(k, v) {
	          i = indexOf.call(K, k);
	          if (i < 0) V[K.push(k) - 1] = v;else V[i] = v;
	        }
	      };
	    },
	        Promise = window.Promise || function (fn) {
	      var notify = [],
	          done = false,
	          p = {
	        'catch': function _catch() {
	          return p;
	        },
	        'then': function then(cb) {
	          notify.push(cb);
	          if (done) setTimeout(resolve, 1);
	          return p;
	        }
	      };
	      function resolve(value) {
	        done = true;
	        while (notify.length) {
	          notify.shift()(value);
	        }
	      }
	      fn(resolve);
	      return p;
	    },
	        justCreated = false,
	        constructors = Dict(null),
	        waitingList = Dict(null),
	        nodeNames = new Map(),
	        secondArgument = String,


	    // used to create unique instances
	    create = Object.create || function Bridge(proto) {
	      // silly broken polyfill probably ever used but short enough to work
	      return proto ? (Bridge.prototype = proto, new Bridge()) : this;
	    },


	    // will set the prototype if possible
	    // or copy over all properties
	    setPrototype = sPO || (hasProto ? function (o, p) {
	      o.__proto__ = p;
	      return o;
	    } : gOPN && gOPD ? function () {
	      function setProperties(o, p) {
	        for (var key, names = gOPN(p), i = 0, length = names.length; i < length; i++) {
	          key = names[i];
	          if (!hOP.call(o, key)) {
	            defineProperty(o, key, gOPD(p, key));
	          }
	        }
	      }
	      return function (o, p) {
	        do {
	          setProperties(o, p);
	        } while ((p = gPO(p)) && !iPO.call(p, o));
	        return o;
	      };
	    }() : function (o, p) {
	      for (var key in p) {
	        o[key] = p[key];
	      }
	      return o;
	    }),


	    // DOM shortcuts and helpers, if any

	    MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
	        HTMLElementPrototype = (window.HTMLElement || window.Element || window.Node).prototype,
	        IE8 = !iPO.call(HTMLElementPrototype, documentElement),
	        safeProperty = IE8 ? function (o, k, d) {
	      o[k] = d.value;
	      return o;
	    } : defineProperty,
	        isValidNode = IE8 ? function (node) {
	      return node.nodeType === 1;
	    } : function (node) {
	      return iPO.call(HTMLElementPrototype, node);
	    },
	        targets = IE8 && [],
	        attachShadow = HTMLElementPrototype.attachShadow,
	        cloneNode = HTMLElementPrototype.cloneNode,
	        dispatchEvent = HTMLElementPrototype.dispatchEvent,
	        getAttribute = HTMLElementPrototype.getAttribute,
	        hasAttribute = HTMLElementPrototype.hasAttribute,
	        removeAttribute = HTMLElementPrototype.removeAttribute,
	        setAttribute = HTMLElementPrototype.setAttribute,


	    // replaced later on
	    createElement = document.createElement,
	        patchedCreateElement = createElement,


	    // shared observer for all attributes
	    attributesObserver = MutationObserver && {
	      attributes: true,
	      characterData: true,
	      attributeOldValue: true
	    },


	    // useful to detect only if there's no MutationObserver
	    DOMAttrModified = MutationObserver || function (e) {
	      doesNotSupportDOMAttrModified = false;
	      documentElement.removeEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
	    },


	    // will both be used to make DOMNodeInserted asynchronous
	    asapQueue,
	        asapTimer = 0,


	    // internal flags
	    setListener = false,
	        doesNotSupportDOMAttrModified = true,
	        dropDomContentLoaded = true,


	    // needed for the innerHTML helper
	    notFromInnerHTMLHelper = true,


	    // optionally defined later on
	    onSubtreeModified,
	        callDOMAttrModified,
	        getAttributesMirror,
	        observer,
	        observe,


	    // based on setting prototype capability
	    // will check proto or the expando attribute
	    // in order to setup the node once
	    patchIfNotAlready,
	        patch;

	    // only if needed
	    if (!(REGISTER_ELEMENT in document)) {

	      if (sPO || hasProto) {
	        patchIfNotAlready = function patchIfNotAlready(node, proto) {
	          if (!iPO.call(proto, node)) {
	            setupNode(node, proto);
	          }
	        };
	        patch = setupNode;
	      } else {
	        patchIfNotAlready = function patchIfNotAlready(node, proto) {
	          if (!node[EXPANDO_UID]) {
	            node[EXPANDO_UID] = Object(true);
	            setupNode(node, proto);
	          }
	        };
	        patch = patchIfNotAlready;
	      }

	      if (IE8) {
	        doesNotSupportDOMAttrModified = false;
	        (function () {
	          var descriptor = gOPD(HTMLElementPrototype, ADD_EVENT_LISTENER),
	              addEventListener = descriptor.value,
	              patchedRemoveAttribute = function patchedRemoveAttribute(name) {
	            var e = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });
	            e.attrName = name;
	            e.prevValue = getAttribute.call(this, name);
	            e.newValue = null;
	            e[REMOVAL] = e.attrChange = 2;
	            removeAttribute.call(this, name);
	            dispatchEvent.call(this, e);
	          },
	              patchedSetAttribute = function patchedSetAttribute(name, value) {
	            var had = hasAttribute.call(this, name),
	                old = had && getAttribute.call(this, name),
	                e = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });
	            setAttribute.call(this, name, value);
	            e.attrName = name;
	            e.prevValue = had ? old : null;
	            e.newValue = value;
	            if (had) {
	              e[MODIFICATION] = e.attrChange = 1;
	            } else {
	              e[ADDITION] = e.attrChange = 0;
	            }
	            dispatchEvent.call(this, e);
	          },
	              onPropertyChange = function onPropertyChange(e) {
	            // jshint eqnull:true
	            var node = e.currentTarget,
	                superSecret = node[EXPANDO_UID],
	                propertyName = e.propertyName,
	                event;
	            if (superSecret.hasOwnProperty(propertyName)) {
	              superSecret = superSecret[propertyName];
	              event = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });
	              event.attrName = superSecret.name;
	              event.prevValue = superSecret.value || null;
	              event.newValue = superSecret.value = node[propertyName] || null;
	              if (event.prevValue == null) {
	                event[ADDITION] = event.attrChange = 0;
	              } else {
	                event[MODIFICATION] = event.attrChange = 1;
	              }
	              dispatchEvent.call(node, event);
	            }
	          };
	          descriptor.value = function (type, handler, capture) {
	            if (type === DOM_ATTR_MODIFIED && this[ATTRIBUTE_CHANGED_CALLBACK] && this.setAttribute !== patchedSetAttribute) {
	              this[EXPANDO_UID] = {
	                className: {
	                  name: 'class',
	                  value: this.className
	                }
	              };
	              this.setAttribute = patchedSetAttribute;
	              this.removeAttribute = patchedRemoveAttribute;
	              addEventListener.call(this, 'propertychange', onPropertyChange);
	            }
	            addEventListener.call(this, type, handler, capture);
	          };
	          defineProperty(HTMLElementPrototype, ADD_EVENT_LISTENER, descriptor);
	        })();
	      } else if (!MutationObserver) {
	        documentElement[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, DOMAttrModified);
	        documentElement.setAttribute(EXPANDO_UID, 1);
	        documentElement.removeAttribute(EXPANDO_UID);
	        if (doesNotSupportDOMAttrModified) {
	          onSubtreeModified = function onSubtreeModified(e) {
	            var node = this,
	                oldAttributes,
	                newAttributes,
	                key;
	            if (node === e.target) {
	              oldAttributes = node[EXPANDO_UID];
	              node[EXPANDO_UID] = newAttributes = getAttributesMirror(node);
	              for (key in newAttributes) {
	                if (!(key in oldAttributes)) {
	                  // attribute was added
	                  return callDOMAttrModified(0, node, key, oldAttributes[key], newAttributes[key], ADDITION);
	                } else if (newAttributes[key] !== oldAttributes[key]) {
	                  // attribute was changed
	                  return callDOMAttrModified(1, node, key, oldAttributes[key], newAttributes[key], MODIFICATION);
	                }
	              }
	              // checking if it has been removed
	              for (key in oldAttributes) {
	                if (!(key in newAttributes)) {
	                  // attribute removed
	                  return callDOMAttrModified(2, node, key, oldAttributes[key], newAttributes[key], REMOVAL);
	                }
	              }
	            }
	          };
	          callDOMAttrModified = function callDOMAttrModified(attrChange, currentTarget, attrName, prevValue, newValue, action) {
	            var e = {
	              attrChange: attrChange,
	              currentTarget: currentTarget,
	              attrName: attrName,
	              prevValue: prevValue,
	              newValue: newValue
	            };
	            e[action] = attrChange;
	            onDOMAttrModified(e);
	          };
	          getAttributesMirror = function getAttributesMirror(node) {
	            for (var attr, name, result = {}, attributes = node.attributes, i = 0, length = attributes.length; i < length; i++) {
	              attr = attributes[i];
	              name = attr.name;
	              if (name !== 'setAttribute') {
	                result[name] = attr.value;
	              }
	            }
	            return result;
	          };
	        }
	      }

	      // set as enumerable, writable and configurable
	      document[REGISTER_ELEMENT] = function registerElement(type, options) {
	        upperType = type.toUpperCase();
	        if (!setListener) {
	          // only first time document.registerElement is used
	          // we need to set this listener
	          // setting it by default might slow down for no reason
	          setListener = true;
	          if (MutationObserver) {
	            observer = function (attached, detached) {
	              function checkEmAll(list, callback) {
	                for (var i = 0, length = list.length; i < length; callback(list[i++])) {}
	              }
	              return new MutationObserver(function (records) {
	                for (var current, node, newValue, i = 0, length = records.length; i < length; i++) {
	                  current = records[i];
	                  if (current.type === 'childList') {
	                    checkEmAll(current.addedNodes, attached);
	                    checkEmAll(current.removedNodes, detached);
	                  } else {
	                    node = current.target;
	                    if (notFromInnerHTMLHelper && node[ATTRIBUTE_CHANGED_CALLBACK] && current.attributeName !== 'style') {
	                      newValue = getAttribute.call(node, current.attributeName);
	                      if (newValue !== current.oldValue) {
	                        node[ATTRIBUTE_CHANGED_CALLBACK](current.attributeName, current.oldValue, newValue);
	                      }
	                    }
	                  }
	                }
	              });
	            }(executeAction(ATTACHED), executeAction(DETACHED));
	            observe = function observe(node) {
	              observer.observe(node, {
	                childList: true,
	                subtree: true
	              });
	              return node;
	            };
	            observe(document);
	            if (attachShadow) {
	              HTMLElementPrototype.attachShadow = function () {
	                return observe(attachShadow.apply(this, arguments));
	              };
	            }
	          } else {
	            asapQueue = [];
	            document[ADD_EVENT_LISTENER]('DOMNodeInserted', onDOMNode(ATTACHED));
	            document[ADD_EVENT_LISTENER]('DOMNodeRemoved', onDOMNode(DETACHED));
	          }

	          document[ADD_EVENT_LISTENER](DOM_CONTENT_LOADED, onReadyStateChange);
	          document[ADD_EVENT_LISTENER]('readystatechange', onReadyStateChange);

	          HTMLElementPrototype.cloneNode = function (deep) {
	            var node = cloneNode.call(this, !!deep),
	                i = getTypeIndex(node);
	            if (-1 < i) patch(node, protos[i]);
	            if (deep) loopAndSetup(node.querySelectorAll(query));
	            return node;
	          };
	        }

	        if (-2 < indexOf.call(types, PREFIX_IS + upperType) + indexOf.call(types, PREFIX_TAG + upperType)) {
	          throwTypeError(type);
	        }

	        if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
	          throw new Error('The type ' + type + ' is invalid');
	        }

	        var constructor = function constructor() {
	          return extending ? document.createElement(nodeName, upperType) : document.createElement(nodeName);
	        },
	            opt = options || OP,
	            extending = hOP.call(opt, EXTENDS),
	            nodeName = extending ? options[EXTENDS].toUpperCase() : upperType,
	            upperType,
	            i;

	        if (extending && -1 < indexOf.call(types, PREFIX_TAG + nodeName)) {
	          throwTypeError(nodeName);
	        }

	        i = types.push((extending ? PREFIX_IS : PREFIX_TAG) + upperType) - 1;

	        query = query.concat(query.length ? ',' : '', extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName);

	        constructor.prototype = protos[i] = hOP.call(opt, 'prototype') ? opt.prototype : create(HTMLElementPrototype);

	        loopAndVerify(document.querySelectorAll(query), ATTACHED);

	        return constructor;
	      };

	      document.createElement = patchedCreateElement = function patchedCreateElement(localName, typeExtension) {
	        var is = getIs(typeExtension),
	            node = is ? createElement.call(document, localName, secondArgument(is)) : createElement.call(document, localName),
	            name = '' + localName,
	            i = indexOf.call(types, (is ? PREFIX_IS : PREFIX_TAG) + (is || name).toUpperCase()),
	            setup = -1 < i;
	        if (is) {
	          node.setAttribute('is', is = is.toLowerCase());
	          if (setup) {
	            setup = isInQSA(name.toUpperCase(), is);
	          }
	        }
	        notFromInnerHTMLHelper = !document.createElement.innerHTMLHelper;
	        if (setup) patch(node, protos[i]);
	        return node;
	      };
	    }

	    function ASAP() {
	      var queue = asapQueue.splice(0, asapQueue.length);
	      asapTimer = 0;
	      while (queue.length) {
	        queue.shift().call(null, queue.shift());
	      }
	    }

	    function loopAndVerify(list, action) {
	      for (var i = 0, length = list.length; i < length; i++) {
	        verifyAndSetupAndAction(list[i], action);
	      }
	    }

	    function loopAndSetup(list) {
	      for (var i = 0, length = list.length, node; i < length; i++) {
	        node = list[i];
	        patch(node, protos[getTypeIndex(node)]);
	      }
	    }

	    function executeAction(action) {
	      return function (node) {
	        if (isValidNode(node)) {
	          verifyAndSetupAndAction(node, action);
	          loopAndVerify(node.querySelectorAll(query), action);
	        }
	      };
	    }

	    function getTypeIndex(target) {
	      var is = getAttribute.call(target, 'is'),
	          nodeName = target.nodeName.toUpperCase(),
	          i = indexOf.call(types, is ? PREFIX_IS + is.toUpperCase() : PREFIX_TAG + nodeName);
	      return is && -1 < i && !isInQSA(nodeName, is) ? -1 : i;
	    }

	    function isInQSA(name, type) {
	      return -1 < query.indexOf(name + '[is="' + type + '"]');
	    }

	    function onDOMAttrModified(e) {
	      var node = e.currentTarget,
	          attrChange = e.attrChange,
	          attrName = e.attrName,
	          target = e.target,
	          addition = e[ADDITION] || 2,
	          removal = e[REMOVAL] || 3;
	      if (notFromInnerHTMLHelper && (!target || target === node) && node[ATTRIBUTE_CHANGED_CALLBACK] && attrName !== 'style' && (e.prevValue !== e.newValue ||
	      // IE9, IE10, and Opera 12 gotcha
	      e.newValue === '' && (attrChange === addition || attrChange === removal))) {
	        node[ATTRIBUTE_CHANGED_CALLBACK](attrName, attrChange === addition ? null : e.prevValue, attrChange === removal ? null : e.newValue);
	      }
	    }

	    function onDOMNode(action) {
	      var executor = executeAction(action);
	      return function (e) {
	        asapQueue.push(executor, e.target);
	        if (asapTimer) clearTimeout(asapTimer);
	        asapTimer = setTimeout(ASAP, 1);
	      };
	    }

	    function onReadyStateChange(e) {
	      if (dropDomContentLoaded) {
	        dropDomContentLoaded = false;
	        e.currentTarget.removeEventListener(DOM_CONTENT_LOADED, onReadyStateChange);
	      }
	      loopAndVerify((e.target || document).querySelectorAll(query), e.detail === DETACHED ? DETACHED : ATTACHED);
	      if (IE8) purge();
	    }

	    function patchedSetAttribute(name, value) {
	      // jshint validthis:true
	      var self = this;
	      setAttribute.call(self, name, value);
	      onSubtreeModified.call(self, { target: self });
	    }

	    function setupNode(node, proto) {
	      setPrototype(node, proto);
	      if (observer) {
	        observer.observe(node, attributesObserver);
	      } else {
	        if (doesNotSupportDOMAttrModified) {
	          node.setAttribute = patchedSetAttribute;
	          node[EXPANDO_UID] = getAttributesMirror(node);
	          node[ADD_EVENT_LISTENER](DOM_SUBTREE_MODIFIED, onSubtreeModified);
	        }
	        node[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, onDOMAttrModified);
	      }
	      if (node[CREATED_CALLBACK] && notFromInnerHTMLHelper) {
	        node.created = true;
	        node[CREATED_CALLBACK]();
	        node.created = false;
	      }
	    }

	    function purge() {
	      for (var node, i = 0, length = targets.length; i < length; i++) {
	        node = targets[i];
	        if (!documentElement.contains(node)) {
	          length--;
	          targets.splice(i--, 1);
	          verifyAndSetupAndAction(node, DETACHED);
	        }
	      }
	    }

	    function throwTypeError(type) {
	      throw new Error('A ' + type + ' type is already registered');
	    }

	    function verifyAndSetupAndAction(node, action) {
	      var fn,
	          i = getTypeIndex(node);
	      if (-1 < i) {
	        patchIfNotAlready(node, protos[i]);
	        i = 0;
	        if (action === ATTACHED && !node[ATTACHED]) {
	          node[DETACHED] = false;
	          node[ATTACHED] = true;
	          i = 1;
	          if (IE8 && indexOf.call(targets, node) < 0) {
	            targets.push(node);
	          }
	        } else if (action === DETACHED && !node[DETACHED]) {
	          node[ATTACHED] = false;
	          node[DETACHED] = true;
	          i = 1;
	        }
	        if (i && (fn = node[action + CALLBACK])) fn.call(node);
	      }
	    }

	    // V1 in da House!
	    function CustomElementRegistry() {}

	    CustomElementRegistry.prototype = {
	      constructor: CustomElementRegistry,
	      // a workaround for the stubborn WebKit
	      define: usableCustomElements ? function (name, Class, options) {
	        if (options) {
	          CERDefine(name, Class, options);
	        } else {
	          var NAME = name.toUpperCase();
	          constructors[NAME] = {
	            constructor: Class,
	            create: [NAME]
	          };
	          nodeNames.set(Class, NAME);
	          customElements.define(name, Class);
	        }
	      } : CERDefine,
	      get: usableCustomElements ? function (name) {
	        return customElements.get(name) || get(name);
	      } : get,
	      whenDefined: usableCustomElements ? function (name) {
	        return Promise.race([customElements.whenDefined(name), whenDefined(name)]);
	      } : whenDefined
	    };

	    function CERDefine(name, Class, options) {
	      var is = options && options[EXTENDS] || '',
	          CProto = Class.prototype,
	          proto = create(CProto),
	          attributes = Class.observedAttributes || empty,
	          definition = { prototype: proto };
	      // TODO: is this needed at all since it's inherited?
	      // defineProperty(proto, 'constructor', {value: Class});
	      safeProperty(proto, CREATED_CALLBACK, {
	        value: function value() {
	          if (justCreated) justCreated = false;else if (!this[DRECEV1]) {
	            this[DRECEV1] = true;
	            new Class(this);
	            if (CProto[CREATED_CALLBACK]) CProto[CREATED_CALLBACK].call(this);
	            var info = constructors[nodeNames.get(Class)];
	            if (!usableCustomElements || info.create.length > 1) {
	              notifyAttributes(this);
	            }
	          }
	        }
	      });
	      safeProperty(proto, ATTRIBUTE_CHANGED_CALLBACK, {
	        value: function value(name) {
	          if (-1 < indexOf.call(attributes, name)) CProto[ATTRIBUTE_CHANGED_CALLBACK].apply(this, arguments);
	        }
	      });
	      if (CProto[CONNECTED_CALLBACK]) {
	        safeProperty(proto, ATTACHED_CALLBACK, {
	          value: CProto[CONNECTED_CALLBACK]
	        });
	      }
	      if (CProto[DISCONNECTED_CALLBACK]) {
	        safeProperty(proto, DETACHED_CALLBACK, {
	          value: CProto[DISCONNECTED_CALLBACK]
	        });
	      }
	      if (is) definition[EXTENDS] = is;
	      name = name.toUpperCase();
	      constructors[name] = {
	        constructor: Class,
	        create: is ? [is, secondArgument(name)] : [name]
	      };
	      nodeNames.set(Class, name);
	      document[REGISTER_ELEMENT](name.toLowerCase(), definition);
	      whenDefined(name);
	      waitingList[name].r();
	    }

	    function get(name) {
	      var info = constructors[name.toUpperCase()];
	      return info && info.constructor;
	    }

	    function getIs(options) {
	      return typeof options === 'string' ? options : options && options.is || '';
	    }

	    function notifyAttributes(self) {
	      var callback = self[ATTRIBUTE_CHANGED_CALLBACK],
	          attributes = callback ? self.attributes : empty,
	          i = attributes.length,
	          attribute;
	      while (i--) {
	        attribute = attributes[i]; // || attributes.item(i);
	        callback.call(self, attribute.name || attribute.nodeName, null, attribute.value || attribute.nodeValue);
	      }
	    }

	    function whenDefined(name) {
	      name = name.toUpperCase();
	      if (!(name in waitingList)) {
	        waitingList[name] = {};
	        waitingList[name].p = new Promise(function (resolve) {
	          waitingList[name].r = resolve;
	        });
	      }
	      return waitingList[name].p;
	    }

	    function polyfillV1() {
	      if (customElements) delete window.customElements;
	      defineProperty(window, 'customElements', {
	        configurable: true,
	        value: new CustomElementRegistry()
	      });
	      defineProperty(window, 'CustomElementRegistry', {
	        configurable: true,
	        value: CustomElementRegistry
	      });
	      for (var patchClass = function patchClass(name) {
	        var Class = window[name];
	        if (Class) {
	          window[name] = function CustomElementsV1(self) {
	            var info, isNative;
	            if (!self) self = this;
	            if (!self[DRECEV1]) {
	              justCreated = true;
	              info = constructors[nodeNames.get(self.constructor)];
	              isNative = usableCustomElements && info.create.length === 1;
	              self = isNative ? Reflect.construct(Class, empty, info.constructor) : document.createElement.apply(document, info.create);
	              self[DRECEV1] = true;
	              justCreated = false;
	              if (!isNative) notifyAttributes(self);
	            }
	            return self;
	          };
	          window[name].prototype = Class.prototype;
	          try {
	            Class.prototype.constructor = window[name];
	          } catch (WebKit) {
	            fixGetClass = true;
	            defineProperty(Class, DRECEV1, { value: window[name] });
	          }
	        }
	      }, Classes = htmlClass.get(/^HTML[A-Z]*[a-z]/), i = Classes.length; i--; patchClass(Classes[i])) {}
	      document.createElement = function (name, options) {
	        var is = getIs(options);
	        return is ? patchedCreateElement.call(this, name, secondArgument(is)) : patchedCreateElement.call(this, name);
	      };
	    }

	    // if customElements is not there at all
	    if (!customElements) polyfillV1();else {
	      // if available test extends work as expected
	      try {
	        (function (DRE, options, name) {
	          options[EXTENDS] = 'a';
	          DRE.prototype = create(HTMLAnchorElement.prototype);
	          DRE.prototype.constructor = DRE;
	          window.customElements.define(name, DRE, options);
	          if (getAttribute.call(document.createElement('a', { is: name }), 'is') !== name || usableCustomElements && getAttribute.call(new DRE(), 'is') !== name) {
	            throw options;
	          }
	        })(function DRE() {
	          return Reflect.construct(HTMLAnchorElement, [], DRE);
	        }, {}, 'document-register-element-a');
	      } catch (o_O) {
	        // or force the polyfill if not
	        // and keep internal original reference
	        polyfillV1();
	      }
	    }

	    try {
	      createElement.call(document, 'a', 'a');
	    } catch (FireFox) {
	      secondArgument = function secondArgument(is) {
	        return { is: is };
	      };
	    }
	  }

	  installCustomElements(commonjsGlobal);

	  module.exports = installCustomElements;
	});

	interopDefault(documentRegisterElement_node);

	function keys() {
	  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  var _ref$enumOnly = _ref.enumOnly;
	  var enumOnly = _ref$enumOnly === undefined ? false : _ref$enumOnly;

	  var listOfKeys = Object[enumOnly ? 'keys' : 'getOwnPropertyNames'](obj);
	  return typeof Object.getOwnPropertySymbols === 'function' ? listOfKeys.concat(Object.getOwnPropertySymbols(obj)) : listOfKeys;
	}

	// We are not using Object.assign if it is defined since it will cause problems when Symbol is polyfilled.
	// Apparently Object.assign (or any polyfill for this method) does not copy non-native Symbols.
	var assign = (function (obj) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  args.forEach(function (arg) {
	    return keys(arg).forEach(function (name) {
	      return obj[name] = arg[name];
	    });
	  }); // eslint-disable-line no-return-assign
	  return obj;
	});

	function empty (val) {
	  return typeof val === 'undefined' || val === null;
	}

	var $connected = '____skate_connected';
	var $created = '____skate_created';
	var $name = '____skate_name';
	var $props = '____skate_props';
	var $ref = '____skate_ref';
	var $renderer = '____skate_renderer';
	var $rendering = '____skate_rendering';
	var $rendererDebounced = '____skate_rendererDebounced';
	var $updated = '____skate_updated';

	var incrementalDomCjs = createCommonjsModule(function (module, exports) {
	  /**
	   * @license
	   * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	   *
	   * Licensed under the Apache License, Version 2.0 (the "License");
	   * you may not use this file except in compliance with the License.
	   * You may obtain a copy of the License at
	   *
	   *      http://www.apache.org/licenses/LICENSE-2.0
	   *
	   * Unless required by applicable law or agreed to in writing, software
	   * distributed under the License is distributed on an "AS-IS" BASIS,
	   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   * See the License for the specific language governing permissions and
	   * limitations under the License.
	   */

	  'use strict';

	  /**
	   * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	   *
	   * Licensed under the Apache License, Version 2.0 (the "License");
	   * you may not use this file except in compliance with the License.
	   * You may obtain a copy of the License at
	   *
	   *      http://www.apache.org/licenses/LICENSE-2.0
	   *
	   * Unless required by applicable law or agreed to in writing, software
	   * distributed under the License is distributed on an "AS-IS" BASIS,
	   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   * See the License for the specific language governing permissions and
	   * limitations under the License.
	   */

	  /**
	   * A cached reference to the hasOwnProperty function.
	   */

	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  /**
	   * A cached reference to the create function.
	   */
	  var create = Object.create;

	  /**
	   * Used to prevent property collisions between our "map" and its prototype.
	   * @param {!Object<string, *>} map The map to check.
	   * @param {string} property The property to check.
	   * @return {boolean} Whether map has property.
	   */
	  var has = function has(map, property) {
	    return hasOwnProperty.call(map, property);
	  };

	  /**
	   * Creates an map object without a prototype.
	   * @return {!Object}
	   */
	  var createMap = function createMap() {
	    return create(null);
	  };

	  /**
	   * Keeps track of information needed to perform diffs for a given DOM node.
	   * @param {!string} nodeName
	   * @param {?string=} key
	   * @constructor
	   */
	  function NodeData(nodeName, key) {
	    /**
	     * The attributes and their values.
	     * @const {!Object<string, *>}
	     */
	    this.attrs = createMap();

	    /**
	     * An array of attribute name/value pairs, used for quickly diffing the
	     * incomming attributes to see if the DOM node's attributes need to be
	     * updated.
	     * @const {Array<*>}
	     */
	    this.attrsArr = [];

	    /**
	     * The incoming attributes for this Node, before they are updated.
	     * @const {!Object<string, *>}
	     */
	    this.newAttrs = createMap();

	    /**
	     * The key used to identify this node, used to preserve DOM nodes when they
	     * move within their parent.
	     * @const
	     */
	    this.key = key;

	    /**
	     * Keeps track of children within this node by their key.
	     * {?Object<string, !Element>}
	     */
	    this.keyMap = null;

	    /**
	     * Whether or not the keyMap is currently valid.
	     * {boolean}
	     */
	    this.keyMapValid = true;

	    /**
	     * The node name for this node.
	     * @const {string}
	     */
	    this.nodeName = nodeName;

	    /**
	     * @type {?string}
	     */
	    this.text = null;
	  }

	  /**
	   * Initializes a NodeData object for a Node.
	   *
	   * @param {Node} node The node to initialize data for.
	   * @param {string} nodeName The node name of node.
	   * @param {?string=} key The key that identifies the node.
	   * @return {!NodeData} The newly initialized data object
	   */
	  var initData = function initData(node, nodeName, key) {
	    var data = new NodeData(nodeName, key);
	    node['__incrementalDOMData'] = data;
	    return data;
	  };

	  /**
	   * Retrieves the NodeData object for a Node, creating it if necessary.
	   *
	   * @param {Node} node The node to retrieve the data for.
	   * @return {!NodeData} The NodeData for this Node.
	   */
	  var getData = function getData(node) {
	    var data = node['__incrementalDOMData'];

	    if (!data) {
	      var nodeName = node.nodeName.toLowerCase();
	      var key = null;

	      if (node instanceof Element) {
	        key = node.getAttribute('key');
	      }

	      data = initData(node, nodeName, key);
	    }

	    return data;
	  };

	  /**
	   * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	   *
	   * Licensed under the Apache License, Version 2.0 (the "License");
	   * you may not use this file except in compliance with the License.
	   * You may obtain a copy of the License at
	   *
	   *      http://www.apache.org/licenses/LICENSE-2.0
	   *
	   * Unless required by applicable law or agreed to in writing, software
	   * distributed under the License is distributed on an "AS-IS" BASIS,
	   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   * See the License for the specific language governing permissions and
	   * limitations under the License.
	   */

	  /** @const */
	  var symbols = {
	    default: '__default',

	    placeholder: '__placeholder'
	  };

	  /**
	   * @param {string} name
	   * @return {string|undefined} The namespace to use for the attribute.
	   */
	  var getNamespace = function getNamespace(name) {
	    if (name.lastIndexOf('xml:', 0) === 0) {
	      return 'http://www.w3.org/XML/1998/namespace';
	    }

	    if (name.lastIndexOf('xlink:', 0) === 0) {
	      return 'http://www.w3.org/1999/xlink';
	    }
	  };

	  /**
	   * Applies an attribute or property to a given Element. If the value is null
	   * or undefined, it is removed from the Element. Otherwise, the value is set
	   * as an attribute.
	   * @param {!Element} el
	   * @param {string} name The attribute's name.
	   * @param {?(boolean|number|string)=} value The attribute's value.
	   */
	  var applyAttr = function applyAttr(el, name, value) {
	    if (value == null) {
	      el.removeAttribute(name);
	    } else {
	      var attrNS = getNamespace(name);
	      if (attrNS) {
	        el.setAttributeNS(attrNS, name, value);
	      } else {
	        el.setAttribute(name, value);
	      }
	    }
	  };

	  /**
	   * Applies a property to a given Element.
	   * @param {!Element} el
	   * @param {string} name The property's name.
	   * @param {*} value The property's value.
	   */
	  var applyProp = function applyProp(el, name, value) {
	    el[name] = value;
	  };

	  /**
	   * Applies a style to an Element. No vendor prefix expansion is done for
	   * property names/values.
	   * @param {!Element} el
	   * @param {string} name The attribute's name.
	   * @param {*} style The style to set. Either a string of css or an object
	   *     containing property-value pairs.
	   */
	  var applyStyle = function applyStyle(el, name, style) {
	    if (typeof style === 'string') {
	      el.style.cssText = style;
	    } else {
	      el.style.cssText = '';
	      var elStyle = el.style;
	      var obj = /** @type {!Object<string,string>} */style;

	      for (var prop in obj) {
	        if (has(obj, prop)) {
	          elStyle[prop] = obj[prop];
	        }
	      }
	    }
	  };

	  /**
	   * Updates a single attribute on an Element.
	   * @param {!Element} el
	   * @param {string} name The attribute's name.
	   * @param {*} value The attribute's value. If the value is an object or
	   *     function it is set on the Element, otherwise, it is set as an HTML
	   *     attribute.
	   */
	  var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
	    var type = typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value);

	    if (type === 'object' || type === 'function') {
	      applyProp(el, name, value);
	    } else {
	      applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
	    }
	  };

	  /**
	   * Calls the appropriate attribute mutator for this attribute.
	   * @param {!Element} el
	   * @param {string} name The attribute's name.
	   * @param {*} value The attribute's value.
	   */
	  var updateAttribute = function updateAttribute(el, name, value) {
	    var data = getData(el);
	    var attrs = data.attrs;

	    if (attrs[name] === value) {
	      return;
	    }

	    var mutator = attributes[name] || attributes[symbols.default];
	    mutator(el, name, value);

	    attrs[name] = value;
	  };

	  /**
	   * A publicly mutable object to provide custom mutators for attributes.
	   * @const {!Object<string, function(!Element, string, *)>}
	   */
	  var attributes = createMap();

	  // Special generic mutator that's called for any attribute that does not
	  // have a specific mutator.
	  attributes[symbols.default] = applyAttributeTyped;

	  attributes[symbols.placeholder] = function () {};

	  attributes['style'] = applyStyle;

	  /**
	   * Gets the namespace to create an element (of a given tag) in.
	   * @param {string} tag The tag to get the namespace for.
	   * @param {?Node} parent
	   * @return {?string} The namespace to create the tag in.
	   */
	  var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
	    if (tag === 'svg') {
	      return 'http://www.w3.org/2000/svg';
	    }

	    if (getData(parent).nodeName === 'foreignObject') {
	      return null;
	    }

	    return parent.namespaceURI;
	  };

	  /**
	   * Creates an Element.
	   * @param {Document} doc The document with which to create the Element.
	   * @param {?Node} parent
	   * @param {string} tag The tag for the Element.
	   * @param {?string=} key A key to identify the Element.
	   * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	   *     static attributes for the Element.
	   * @return {!Element}
	   */
	  var createElement = function createElement(doc, parent, tag, key, statics) {
	    var namespace = getNamespaceForTag(tag, parent);
	    var el = undefined;

	    if (namespace) {
	      el = doc.createElementNS(namespace, tag);
	    } else {
	      el = doc.createElement(tag);
	    }

	    initData(el, tag, key);

	    if (statics) {
	      for (var i = 0; i < statics.length; i += 2) {
	        updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
	      }
	    }

	    return el;
	  };

	  /**
	   * Creates a Text Node.
	   * @param {Document} doc The document with which to create the Element.
	   * @return {!Text}
	   */
	  var createText = function createText(doc) {
	    var node = doc.createTextNode('');
	    initData(node, '#text', null);
	    return node;
	  };

	  /**
	   * Creates a mapping that can be used to look up children using a key.
	   * @param {?Node} el
	   * @return {!Object<string, !Element>} A mapping of keys to the children of the
	   *     Element.
	   */
	  var createKeyMap = function createKeyMap(el) {
	    var map = createMap();
	    var child = el.firstElementChild;

	    while (child) {
	      var key = getData(child).key;

	      if (key) {
	        map[key] = child;
	      }

	      child = child.nextElementSibling;
	    }

	    return map;
	  };

	  /**
	   * Retrieves the mapping of key to child node for a given Element, creating it
	   * if necessary.
	   * @param {?Node} el
	   * @return {!Object<string, !Node>} A mapping of keys to child Elements
	   */
	  var getKeyMap = function getKeyMap(el) {
	    var data = getData(el);

	    if (!data.keyMap) {
	      data.keyMap = createKeyMap(el);
	    }

	    return data.keyMap;
	  };

	  /**
	   * Retrieves a child from the parent with the given key.
	   * @param {?Node} parent
	   * @param {?string=} key
	   * @return {?Node} The child corresponding to the key.
	   */
	  var getChild = function getChild(parent, key) {
	    return key ? getKeyMap(parent)[key] : null;
	  };

	  /**
	   * Registers an element as being a child. The parent will keep track of the
	   * child using the key. The child can be retrieved using the same key using
	   * getKeyMap. The provided key should be unique within the parent Element.
	   * @param {?Node} parent The parent of child.
	   * @param {string} key A key to identify the child with.
	   * @param {!Node} child The child to register.
	   */
	  var registerChild = function registerChild(parent, key, child) {
	    getKeyMap(parent)[key] = child;
	  };

	  /**
	   * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	   *
	   * Licensed under the Apache License, Version 2.0 (the "License");
	   * you may not use this file except in compliance with the License.
	   * You may obtain a copy of the License at
	   *
	   *      http://www.apache.org/licenses/LICENSE-2.0
	   *
	   * Unless required by applicable law or agreed to in writing, software
	   * distributed under the License is distributed on an "AS-IS" BASIS,
	   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   * See the License for the specific language governing permissions and
	   * limitations under the License.
	   */

	  /** @const */
	  var notifications = {
	    /**
	     * Called after patch has compleated with any Nodes that have been created
	     * and added to the DOM.
	     * @type {?function(Array<!Node>)}
	     */
	    nodesCreated: null,

	    /**
	     * Called after patch has compleated with any Nodes that have been removed
	     * from the DOM.
	     * Note it's an applications responsibility to handle any childNodes.
	     * @type {?function(Array<!Node>)}
	     */
	    nodesDeleted: null
	  };

	  /**
	   * Keeps track of the state of a patch.
	   * @constructor
	   */
	  function Context() {
	    /**
	     * @type {(Array<!Node>|undefined)}
	     */
	    this.created = notifications.nodesCreated && [];

	    /**
	     * @type {(Array<!Node>|undefined)}
	     */
	    this.deleted = notifications.nodesDeleted && [];
	  }

	  /**
	   * @param {!Node} node
	   */
	  Context.prototype.markCreated = function (node) {
	    if (this.created) {
	      this.created.push(node);
	    }
	  };

	  /**
	   * @param {!Node} node
	   */
	  Context.prototype.markDeleted = function (node) {
	    if (this.deleted) {
	      this.deleted.push(node);
	    }
	  };

	  /**
	   * Notifies about nodes that were created during the patch opearation.
	   */
	  Context.prototype.notifyChanges = function () {
	    if (this.created && this.created.length > 0) {
	      notifications.nodesCreated(this.created);
	    }

	    if (this.deleted && this.deleted.length > 0) {
	      notifications.nodesDeleted(this.deleted);
	    }
	  };

	  /**
	  * Makes sure that keyed Element matches the tag name provided.
	  * @param {!string} nodeName The nodeName of the node that is being matched.
	  * @param {string=} tag The tag name of the Element.
	  * @param {?string=} key The key of the Element.
	  */
	  var assertKeyedTagMatches = function assertKeyedTagMatches(nodeName, tag, key) {
	    if (nodeName !== tag) {
	      throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
	    }
	  };

	  /** @type {?Context} */
	  var context = null;

	  /** @type {?Node} */
	  var currentNode = null;

	  /** @type {?Node} */
	  var currentParent = null;

	  /** @type {?Element|?DocumentFragment} */
	  var root = null;

	  /** @type {?Document} */
	  var doc = null;

	  /**
	   * Returns a patcher function that sets up and restores a patch context,
	   * running the run function with the provided data.
	   * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
	   * @return {function((!Element|!DocumentFragment),!function(T),T=)}
	   * @template T
	   */
	  var patchFactory = function patchFactory(run) {
	    /**
	     * TODO(moz): These annotations won't be necessary once we switch to Closure
	     * Compiler's new type inference. Remove these once the switch is done.
	     *
	     * @param {(!Element|!DocumentFragment)} node
	     * @param {!function(T)} fn
	     * @param {T=} data
	     * @template T
	     */
	    var f = function f(node, fn, data) {
	      var prevContext = context;
	      var prevRoot = root;
	      var prevDoc = doc;
	      var prevCurrentNode = currentNode;
	      var prevCurrentParent = currentParent;
	      var previousInAttributes = false;
	      var previousInSkip = false;

	      context = new Context();
	      root = node;
	      doc = node.ownerDocument;
	      currentParent = node.parentNode;

	      if ('production' !== 'production') {}

	      run(node, fn, data);

	      if ('production' !== 'production') {}

	      context.notifyChanges();

	      context = prevContext;
	      root = prevRoot;
	      doc = prevDoc;
	      currentNode = prevCurrentNode;
	      currentParent = prevCurrentParent;
	    };
	    return f;
	  };

	  /**
	   * Patches the document starting at node with the provided function. This
	   * function may be called during an existing patch operation.
	   * @param {!Element|!DocumentFragment} node The Element or Document
	   *     to patch.
	   * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	   *     calls that describe the DOM.
	   * @param {T=} data An argument passed to fn to represent DOM state.
	   * @template T
	   */
	  var patchInner = patchFactory(function (node, fn, data) {
	    currentNode = node;

	    enterNode();
	    fn(data);
	    exitNode();

	    if ('production' !== 'production') {}
	  });

	  /**
	   * Patches an Element with the the provided function. Exactly one top level
	   * element call should be made corresponding to `node`.
	   * @param {!Element} node The Element where the patch should start.
	   * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	   *     calls that describe the DOM. This should have at most one top level
	   *     element call.
	   * @param {T=} data An argument passed to fn to represent DOM state.
	   * @template T
	   */
	  var patchOuter = patchFactory(function (node, fn, data) {
	    currentNode = /** @type {!Element} */{ nextSibling: node };

	    fn(data);

	    if ('production' !== 'production') {}
	  });

	  /**
	   * Checks whether or not the current node matches the specified nodeName and
	   * key.
	   *
	   * @param {?string} nodeName The nodeName for this node.
	   * @param {?string=} key An optional key that identifies a node.
	   * @return {boolean} True if the node matches, false otherwise.
	   */
	  var matches = function matches(nodeName, key) {
	    var data = getData(currentNode);

	    // Key check is done using double equals as we want to treat a null key the
	    // same as undefined. This should be okay as the only values allowed are
	    // strings, null and undefined so the == semantics are not too weird.
	    return nodeName === data.nodeName && key == data.key;
	  };

	  /**
	   * Aligns the virtual Element definition with the actual DOM, moving the
	   * corresponding DOM node to the correct location or creating it if necessary.
	   * @param {string} nodeName For an Element, this should be a valid tag string.
	   *     For a Text, this should be #text.
	   * @param {?string=} key The key used to identify this element.
	   * @param {?Array<*>=} statics For an Element, this should be an array of
	   *     name-value pairs.
	   */
	  var alignWithDOM = function alignWithDOM(nodeName, key, statics) {
	    if (currentNode && matches(nodeName, key)) {
	      return;
	    }

	    var node = undefined;

	    // Check to see if the node has moved within the parent.
	    if (key) {
	      node = getChild(currentParent, key);
	      if (node && 'production' !== 'production') {
	        assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
	      }
	    }

	    // Create the node if it doesn't exist.
	    if (!node) {
	      if (nodeName === '#text') {
	        node = createText(doc);
	      } else {
	        node = createElement(doc, currentParent, nodeName, key, statics);
	      }

	      if (key) {
	        registerChild(currentParent, key, node);
	      }

	      context.markCreated(node);
	    }

	    // If the node has a key, remove it from the DOM to prevent a large number
	    // of re-orders in the case that it moved far or was completely removed.
	    // Since we hold on to a reference through the keyMap, we can always add it
	    // back.
	    if (currentNode && getData(currentNode).key) {
	      currentParent.replaceChild(node, currentNode);
	      getData(currentParent).keyMapValid = false;
	    } else {
	      currentParent.insertBefore(node, currentNode);
	    }

	    currentNode = node;
	  };

	  /**
	   * Clears out any unvisited Nodes, as the corresponding virtual element
	   * functions were never called for them.
	   */
	  var clearUnvisitedDOM = function clearUnvisitedDOM() {
	    var node = currentParent;
	    var data = getData(node);
	    var keyMap = data.keyMap;
	    var keyMapValid = data.keyMapValid;
	    var child = node.lastChild;
	    var key = undefined;

	    if (child === currentNode && keyMapValid) {
	      return;
	    }

	    if (data.attrs[symbols.placeholder] && node !== root) {
	      if ('production' !== 'production') {}
	      return;
	    }

	    while (child !== currentNode) {
	      node.removeChild(child);
	      context.markDeleted( /** @type {!Node}*/child);

	      key = getData(child).key;
	      if (key) {
	        delete keyMap[key];
	      }
	      child = node.lastChild;
	    }

	    // Clean the keyMap, removing any unusued keys.
	    if (!keyMapValid) {
	      for (key in keyMap) {
	        child = keyMap[key];
	        if (child.parentNode !== node) {
	          context.markDeleted(child);
	          delete keyMap[key];
	        }
	      }

	      data.keyMapValid = true;
	    }
	  };

	  /**
	   * Changes to the first child of the current node.
	   */
	  var enterNode = function enterNode() {
	    currentParent = currentNode;
	    currentNode = null;
	  };

	  /**
	   * Changes to the next sibling of the current node.
	   */
	  var nextNode = function nextNode() {
	    if (currentNode) {
	      currentNode = currentNode.nextSibling;
	    } else {
	      currentNode = currentParent.firstChild;
	    }
	  };

	  /**
	   * Changes to the parent of the current node, removing any unvisited children.
	   */
	  var exitNode = function exitNode() {
	    clearUnvisitedDOM();

	    currentNode = currentParent;
	    currentParent = currentParent.parentNode;
	  };

	  /**
	   * Makes sure that the current node is an Element with a matching tagName and
	   * key.
	   *
	   * @param {string} tag The element's tag.
	   * @param {?string=} key The key used to identify this element. This can be an
	   *     empty string, but performance may be better if a unique value is used
	   *     when iterating over an array of items.
	   * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	   *     static attributes for the Element. These will only be set once when the
	   *     Element is created.
	   * @return {!Element} The corresponding Element.
	   */
	  var coreElementOpen = function coreElementOpen(tag, key, statics) {
	    nextNode();
	    alignWithDOM(tag, key, statics);
	    enterNode();
	    return (/** @type {!Element} */currentParent
	    );
	  };

	  /**
	   * Closes the currently open Element, removing any unvisited children if
	   * necessary.
	   *
	   * @return {!Element} The corresponding Element.
	   */
	  var coreElementClose = function coreElementClose() {
	    if ('production' !== 'production') {}

	    exitNode();
	    return (/** @type {!Element} */currentNode
	    );
	  };

	  /**
	   * Makes sure the current node is a Text node and creates a Text node if it is
	   * not.
	   *
	   * @return {!Text} The corresponding Text Node.
	   */
	  var coreText = function coreText() {
	    nextNode();
	    alignWithDOM('#text', null, null);
	    return (/** @type {!Text} */currentNode
	    );
	  };

	  /**
	   * Gets the current Element being patched.
	   * @return {!Element}
	   */
	  var currentElement = function currentElement() {
	    if ('production' !== 'production') {}
	    return (/** @type {!Element} */currentParent
	    );
	  };

	  /**
	   * Skips the children in a subtree, allowing an Element to be closed without
	   * clearing out the children.
	   */
	  var skip = function skip() {
	    if ('production' !== 'production') {}
	    currentNode = currentParent.lastChild;
	  };

	  /**
	   * The offset in the virtual element declaration where the attributes are
	   * specified.
	   * @const
	   */
	  var ATTRIBUTES_OFFSET = 3;

	  /**
	   * Builds an array of arguments for use with elementOpenStart, attr and
	   * elementOpenEnd.
	   * @const {Array<*>}
	   */
	  var argsBuilder = [];

	  /**
	   * @param {string} tag The element's tag.
	   * @param {?string=} key The key used to identify this element. This can be an
	   *     empty string, but performance may be better if a unique value is used
	   *     when iterating over an array of items.
	   * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	   *     static attributes for the Element. These will only be set once when the
	   *     Element is created.
	   * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	   *     for the Element.
	   * @return {!Element} The corresponding Element.
	   */
	  var elementOpen = function elementOpen(tag, key, statics, const_args) {
	    if ('production' !== 'production') {}

	    var node = coreElementOpen(tag, key, statics);
	    var data = getData(node);

	    /*
	     * Checks to see if one or more attributes have changed for a given Element.
	     * When no attributes have changed, this is much faster than checking each
	     * individual argument. When attributes have changed, the overhead of this is
	     * minimal.
	     */
	    var attrsArr = data.attrsArr;
	    var newAttrs = data.newAttrs;
	    var attrsChanged = false;
	    var i = ATTRIBUTES_OFFSET;
	    var j = 0;

	    for (; i < arguments.length; i += 1, j += 1) {
	      if (attrsArr[j] !== arguments[i]) {
	        attrsChanged = true;
	        break;
	      }
	    }

	    for (; i < arguments.length; i += 1, j += 1) {
	      attrsArr[j] = arguments[i];
	    }

	    if (j < attrsArr.length) {
	      attrsChanged = true;
	      attrsArr.length = j;
	    }

	    /*
	     * Actually perform the attribute update.
	     */
	    if (attrsChanged) {
	      for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
	        newAttrs[arguments[i]] = arguments[i + 1];
	      }

	      for (var _attr in newAttrs) {
	        updateAttribute(node, _attr, newAttrs[_attr]);
	        newAttrs[_attr] = undefined;
	      }
	    }

	    return node;
	  };

	  /**
	   * Declares a virtual Element at the current location in the document. This
	   * corresponds to an opening tag and a elementClose tag is required. This is
	   * like elementOpen, but the attributes are defined using the attr function
	   * rather than being passed as arguments. Must be folllowed by 0 or more calls
	   * to attr, then a call to elementOpenEnd.
	   * @param {string} tag The element's tag.
	   * @param {?string=} key The key used to identify this element. This can be an
	   *     empty string, but performance may be better if a unique value is used
	   *     when iterating over an array of items.
	   * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	   *     static attributes for the Element. These will only be set once when the
	   *     Element is created.
	   */
	  var elementOpenStart = function elementOpenStart(tag, key, statics) {
	    if ('production' !== 'production') {}

	    argsBuilder[0] = tag;
	    argsBuilder[1] = key;
	    argsBuilder[2] = statics;
	  };

	  /***
	   * Defines a virtual attribute at this point of the DOM. This is only valid
	   * when called between elementOpenStart and elementOpenEnd.
	   *
	   * @param {string} name
	   * @param {*} value
	   */
	  var attr = function attr(name, value) {
	    if ('production' !== 'production') {}

	    argsBuilder.push(name, value);
	  };

	  /**
	   * Closes an open tag started with elementOpenStart.
	   * @return {!Element} The corresponding Element.
	   */
	  var elementOpenEnd = function elementOpenEnd() {
	    if ('production' !== 'production') {}

	    var node = elementOpen.apply(null, argsBuilder);
	    argsBuilder.length = 0;
	    return node;
	  };

	  /**
	   * Closes an open virtual Element.
	   *
	   * @param {string} tag The element's tag.
	   * @return {!Element} The corresponding Element.
	   */
	  var elementClose = function elementClose(tag) {
	    if ('production' !== 'production') {}

	    var node = coreElementClose();

	    if ('production' !== 'production') {}

	    return node;
	  };

	  /**
	   * Declares a virtual Element at the current location in the document that has
	   * no children.
	   * @param {string} tag The element's tag.
	   * @param {?string=} key The key used to identify this element. This can be an
	   *     empty string, but performance may be better if a unique value is used
	   *     when iterating over an array of items.
	   * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	   *     static attributes for the Element. These will only be set once when the
	   *     Element is created.
	   * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	   *     for the Element.
	   * @return {!Element} The corresponding Element.
	   */
	  var elementVoid = function elementVoid(tag, key, statics, const_args) {
	    elementOpen.apply(null, arguments);
	    return elementClose(tag);
	  };

	  /**
	   * Declares a virtual Element at the current location in the document that is a
	   * placeholder element. Children of this Element can be manually managed and
	   * will not be cleared by the library.
	   *
	   * A key must be specified to make sure that this node is correctly preserved
	   * across all conditionals.
	   *
	   * @param {string} tag The element's tag.
	   * @param {string} key The key used to identify this element.
	   * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	   *     static attributes for the Element. These will only be set once when the
	   *     Element is created.
	   * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	   *     for the Element.
	   * @return {!Element} The corresponding Element.
	   */
	  var elementPlaceholder = function elementPlaceholder(tag, key, statics, const_args) {
	    if ('production' !== 'production') {}

	    elementOpen.apply(null, arguments);
	    skip();
	    return elementClose(tag);
	  };

	  /**
	   * Declares a virtual Text at this point in the document.
	   *
	   * @param {string|number|boolean} value The value of the Text.
	   * @param {...(function((string|number|boolean)):string)} const_args
	   *     Functions to format the value which are called only when the value has
	   *     changed.
	   * @return {!Text} The corresponding text node.
	   */
	  var text = function text(value, const_args) {
	    if ('production' !== 'production') {}

	    var node = coreText();
	    var data = getData(node);

	    if (data.text !== value) {
	      data.text = /** @type {string} */value;

	      var formatted = value;
	      for (var i = 1; i < arguments.length; i += 1) {
	        /*
	         * Call the formatter function directly to prevent leaking arguments.
	         * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
	         */
	        var fn = arguments[i];
	        formatted = fn(formatted);
	      }

	      node.data = formatted;
	    }

	    return node;
	  };

	  exports.patch = patchInner;
	  exports.patchInner = patchInner;
	  exports.patchOuter = patchOuter;
	  exports.currentElement = currentElement;
	  exports.skip = skip;
	  exports.elementVoid = elementVoid;
	  exports.elementOpenStart = elementOpenStart;
	  exports.elementOpenEnd = elementOpenEnd;
	  exports.elementOpen = elementOpen;
	  exports.elementClose = elementClose;
	  exports.elementPlaceholder = elementPlaceholder;
	  exports.text = text;
	  exports.attr = attr;
	  exports.symbols = symbols;
	  exports.attributes = attributes;
	  exports.applyAttr = applyAttr;
	  exports.applyProp = applyProp;
	  exports.notifications = notifications;

	  });

	interopDefault(incrementalDomCjs);
	var applyProp = incrementalDomCjs.applyProp;
	var attributes = incrementalDomCjs.attributes;
	var symbols = incrementalDomCjs.symbols;
	var text = incrementalDomCjs.text;
	var elementClose = incrementalDomCjs.elementClose;
	var elementOpen$1 = incrementalDomCjs.elementOpen;
	var skip = incrementalDomCjs.skip;
	var patchInner = incrementalDomCjs.patchInner;

	function enter(object, props) {
	  var saved = {};
	  Object.keys(props).forEach(function (key) {
	    saved[key] = object[key];
	    object[key] = props[key];
	  });
	  return saved;
	}

	function exit(object, saved) {
	  assign(object, saved);
	}

	// Decorates a function with a side effect that changes the properties of an
	// object during its execution, and restores them after. There is no error
	// handling here, if the wrapped function throws an error, properties are not
	// restored and all bets are off.
	function propContext (object, props) {
	  return function (func) {
	    return function () {
	      var saved = enter(object, props);
	      var result = func.apply(undefined, arguments);
	      exit(object, saved);
	      return result;
	    };
	  };
	}

	var _window$1 = window;
	var customElements = _window$1.customElements;

	var applyDefault = attributes[symbols.default];

	// A stack of children that corresponds to the current function helper being
	// executed.
	var stackChren = [];

	var $skip = '__skip';
	var $currentEventHandlers = '__events';
	var $stackCurrentHelperProps = '__props';

	// The current function helper in the stack.
	var stackCurrentHelper = void 0;

	// This is used for the Incremental DOM overrides to keep track of what args
	// to pass the main elementOpen() function.
	var overrideArgs = void 0;

	// The number of levels deep after skipping a tree.
	var skips = 0;

	var noop = function noop() {};

	// Adds or removes an event listener for an element.
	function applyEvent(elem, ename, newFunc) {
	  var events = elem[$currentEventHandlers];

	  if (!events) {
	    events = elem[$currentEventHandlers] = {};
	  }

	  var oldFunc = events[ename];

	  // Remove old listener so they don't double up.
	  if (oldFunc) {
	    elem.removeEventListener(ename, oldFunc);
	  }

	  // Bind new listener.
	  if (newFunc) {
	    elem.addEventListener(ename, events[ename] = newFunc);
	  }
	}

	var attributesContext = propContext(attributes, babelHelpers.defineProperty({
	  // Attributes that shouldn't be applied to the DOM.
	  key: noop,
	  statics: noop,

	  // Attributes that *must* be set via a property on all elements.
	  checked: applyProp,
	  className: applyProp,
	  disabled: applyProp,
	  value: applyProp,

	  // Ref handler.
	  ref: function ref(elem, name, value) {
	    elem[$ref] = value;
	  },


	  // Skip handler.
	  skip: function skip(elem, name, value) {
	    if (value) {
	      elem[$skip] = true;
	    } else {
	      delete elem[$skip];
	    }
	  }
	}, symbols.default, function (elem, name, value) {
	  var _ref = customElements.get(elem.tagName) || {
	    props: {},
	    prototype: {}
	  };

	  var props = _ref.props;
	  var prototype = _ref.prototype;

	  // TODO when refactoring properties to not have to workaround the old
	  // WebKit bug we can remove the "name in props" check below.
	  //
	  // NOTE: That the "name in elem" check won't work for polyfilled custom
	  // elements that set a property that isn't explicitly specified in "props"
	  // or "prototype" unless it is added to the element explicitly as a
	  // property prior to passing the prop to the vdom function. For example, if
	  // it were added in a lifecycle callback because it wouldn't have been
	  // upgraded yet.
	  //
	  // We prefer setting props, so we do this if there's a property matching
	  // name that was passed. However, certain props on SVG elements are
	  // readonly and error when you try to set them.

	  if ((name in props || name in elem || name in prototype) && !('ownerSVGElement' in elem)) {
	    applyProp(elem, name, value);
	    return;
	  }

	  // Explicit false removes the attribute.
	  if (value === false) {
	    applyDefault(elem, name);
	    return;
	  }

	  // Handle built-in and custom events.
	  if (name.indexOf('on') === 0) {
	    var firstChar = name[2];
	    var eventName = void 0;

	    if (firstChar === '-') {
	      eventName = name.substring(3);
	    } else if (firstChar === firstChar.toUpperCase()) {
	      eventName = firstChar.toLowerCase() + name.substring(3);
	    }

	    if (eventName) {
	      applyEvent(elem, eventName, value);
	      return;
	    }
	  }

	  applyDefault(elem, name, value);
	}));

	function resolveTagName(tname) {
	  // If the tag name is a function, a Skate constructor or a standard function
	  // is supported.
	  //
	  // - If a Skate constructor, the tag name is extracted from that.
	  // - If a standard function, it is used as a helper.
	  if (typeof tname === 'function') {
	    return tname[$name] || tname;
	  }

	  // All other tag names are just passed through.
	  return tname;
	}

	// Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
	// so it's the only function we need to execute in the context of our attributes.
	var elementOpen = attributesContext(elementOpen$1);

	function elementOpenStart(tag) {
	  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	  var statics = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	  overrideArgs = [tag, key, statics];
	}

	function elementOpenEnd() {
	  var node = newElementOpen.apply(undefined, babelHelpers.toConsumableArray(overrideArgs)); // eslint-disable-line no-use-before-define
	  overrideArgs = null;
	  return node;
	}

	function wrapIdomFunc(func) {
	  var tnameFuncHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

	  return function wrap() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    args[0] = resolveTagName(args[0]);
	    stackCurrentHelper = null;
	    if (typeof args[0] === 'function') {
	      // If we've encountered a function, handle it according to the type of
	      // function that is being wrapped.
	      stackCurrentHelper = args[0];
	      return tnameFuncHandler.apply(undefined, args);
	    } else if (stackChren.length) {
	      // We pass the wrap() function in here so that when it's called as
	      // children, it will queue up for the next stack, if there is one.
	      stackChren[stackChren.length - 1].push([wrap, args]);
	    } else {
	      if (func === elementOpen) {
	        if (skips) {
	          return ++skips;
	        }

	        var elem = func.apply(undefined, args);

	        if (elem[$skip]) {
	          ++skips;
	        }

	        return elem;
	      }

	      if (func === elementClose) {
	        if (skips === 1) {
	          skip();
	        }

	        // We only want to skip closing if it's not the last closing tag in the
	        // skipped tree because we keep the element that initiated the skpping.
	        if (skips && --skips) {
	          return;
	        }

	        var _elem = func.apply(undefined, args);
	        var ref = _elem[$ref];

	        // We delete so that it isn't called again for the same element. If the
	        // ref changes, or the element changes, this will be defined again.
	        delete _elem[$ref];

	        // Execute the saved ref after esuring we've cleand up after it.
	        if (typeof ref === 'function') {
	          ref(_elem);
	        }

	        return _elem;
	      }

	      // We must call elementOpenStart and elementOpenEnd even if we are
	      // skipping because they queue up attributes and then call elementClose.
	      if (!skips || func === elementOpenStart || func === elementOpenEnd) {
	        return func.apply(undefined, args);
	      }
	    }
	  };
	}

	function newAttr() {
	  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    args[_key2] = arguments[_key2];
	  }

	  if (stackCurrentHelper) {
	    stackCurrentHelper[$stackCurrentHelperProps][args[0]] = args[1];
	  } else if (stackChren.length) {
	    stackChren[stackChren.length - 1].push([newAttr, args]);
	  } else {
	    overrideArgs.push(args[0]);
	    overrideArgs.push(args[1]);
	  }
	}

	function stackOpen(tname, key, statics) {
	  var props = { key: key, statics: statics };

	  for (var _len3 = arguments.length, attrs = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
	    attrs[_key3 - 3] = arguments[_key3];
	  }

	  for (var a = 0; a < attrs.length; a += 2) {
	    props[attrs[a]] = attrs[a + 1];
	  }
	  tname[$stackCurrentHelperProps] = props;
	  stackChren.push([]);
	}

	function stackClose(tname) {
	  var chren = stackChren.pop();
	  var props = tname[$stackCurrentHelperProps];
	  delete tname[$stackCurrentHelperProps];
	  var elemOrFn = tname(props, function () {
	    return chren.forEach(function (args) {
	      return args[0].apply(args, babelHelpers.toConsumableArray(args[1]));
	    });
	  });
	  return typeof elemOrFn === 'function' ? elemOrFn() : elemOrFn;
	}

	// Incremental DOM overrides
	// -------------------------

	// We must override internal functions that call internal Incremental DOM
	// functions because we can't override the internal references. This means
	// we must roughly re-implement their behaviour. Luckily, they're fairly
	// simple.
	var newElementOpenStart = wrapIdomFunc(elementOpenStart, stackOpen);
	var newElementOpenEnd = wrapIdomFunc(elementOpenEnd);

	// Standard open / closed overrides don't need to reproduce internal behaviour
	// because they are the ones referenced from *End and *Start.
	var newElementOpen = wrapIdomFunc(elementOpen, stackOpen);
	var newElementClose = wrapIdomFunc(elementClose, stackClose);

	// Text override ensures their calls can queue if using function helpers.
	var newText = wrapIdomFunc(text);

	// Convenience function for declaring an Incremental DOM element using
	// hyperscript-style syntax.
	function element(tname, attrs) {
	  var atype = typeof attrs === 'undefined' ? 'undefined' : babelHelpers.typeof(attrs);

	  // If attributes are a function, then they should be treated as children.

	  for (var _len5 = arguments.length, chren = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
	    chren[_key5 - 2] = arguments[_key5];
	  }

	  if (atype === 'function' || atype === 'string' || atype === 'number') {
	    chren.unshift(attrs);
	  }

	  // Ensure the attributes are an object. Null is considered an object so we
	  // have to test for this explicitly.
	  if (attrs === null || atype !== 'object') {
	    attrs = {};
	  }

	  // We open the element so we can set attrs after.
	  newElementOpenStart(tname, attrs.key, attrs.statics);

	  // Delete so special attrs don't actually get set.
	  delete attrs.key;
	  delete attrs.statics;

	  // Set attributes.
	  Object.keys(attrs).forEach(function (name) {
	    return newAttr(name, attrs[name]);
	  });

	  // Close before we render the descendant tree.
	  newElementOpenEnd(tname);

	  chren.forEach(function (ch) {
	    var ctype = typeof ch === 'undefined' ? 'undefined' : babelHelpers.typeof(ch);
	    if (ctype === 'function') {
	      ch();
	    } else if (ctype === 'string' || ctype === 'number') {
	      newText(ch);
	    } else if (Array.isArray(ch)) {
	      ch.forEach(function (sch) {
	        return sch();
	      });
	    }
	  });

	  return newElementClose(tname);
	}

	// Even further convenience for building a DSL out of JavaScript functions or hooking into standard
	// transpiles for JSX (React.createElement() / h).
	function builder() {
	  for (var _len6 = arguments.length, tags = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	    tags[_key6] = arguments[_key6];
	  }

	  if (tags.length === 0) {
	    return function () {
	      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
	        args[_key7] = arguments[_key7];
	      }

	      return element.bind.apply(element, [null].concat(args));
	    };
	  }
	  return tags.map(function (tag) {
	    return function () {
	      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
	        args[_key8] = arguments[_key8];
	      }

	      return element.bind.apply(element, [null, tag].concat(args));
	    };
	  });
	}

	function data (element) {
	  var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	  var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	  return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
	}

	var nativeHints = ['native code', '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
	];
	var native = (function (fn) {
	  return nativeHints.map(function (hint) {
	    return (fn || '').toString().indexOf([hint]) > -1;
	  }).reduce(function (a, b) {
	    return a || b;
	  });
	});

	var _window$3 = window;
	var MutationObserver$2 = _window$3.MutationObserver;


	function microtaskDebounce(cbFunc) {
	  var scheduled = false;
	  var i = 0;
	  var cbArgs = [];
	  var elem = document.createElement('span');
	  var observer = new MutationObserver$2(function () {
	    cbFunc.apply(undefined, babelHelpers.toConsumableArray(cbArgs));
	    scheduled = false;
	    cbArgs = null;
	  });

	  observer.observe(elem, { childList: true });

	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    cbArgs = args;
	    if (!scheduled) {
	      scheduled = true;
	      elem.textContent = '' + i;
	      i += 1;
	    }
	  };
	}

	// We have to use setTimeout() for IE9 and 10 because the Mutation Observer
	// polyfill requires that the element be in the document to trigger Mutation
	// Events. Mutation Events are also synchronous and thus wouldn't debounce.
	//
	// The soonest we can set the timeout for in IE is 1 as they have issues when
	// setting to 0.
	function taskDebounce(cbFunc) {
	  var scheduled = false;
	  var cbArgs = [];
	  return function () {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    cbArgs = args;
	    if (!scheduled) {
	      scheduled = true;
	      setTimeout(function () {
	        scheduled = false;
	        cbFunc.apply(undefined, babelHelpers.toConsumableArray(cbArgs));
	      }, 1);
	    }
	  };
	}
	var debounce$1 = native(MutationObserver$2) ? microtaskDebounce : taskDebounce;

	function getOwnPropertyDescriptors () {
	  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  return keys(obj).reduce(function (prev, curr) {
	    prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
	    return prev;
	  }, {});
	}

	function get(elem) {
	  var props = {};
	  keys(elem.constructor.props).forEach(function (key) {
	    props[key] = elem[key];
	  });

	  return props;
	}

	function set(elem, newProps) {
	  assign(elem, newProps);
	  if (elem.constructor[$renderer]) {
	    elem.constructor[$renderer](elem);
	  }
	}

	function props (elem, newProps) {
	  return typeof newProps === 'undefined' ? get(elem) : set(elem, newProps);
	}

	function getDefaultValue(elem, name, opts) {
	  return typeof opts.default === 'function' ? opts.default(elem, { name: name }) : opts.default;
	}

	function getInitialValue(elem, name, opts) {
	  return typeof opts.initial === 'function' ? opts.initial(elem, { name: name }) : opts.initial;
	}

	function getPropData(elem, name) {
	  var elemData = data(elem, 'props');
	  return elemData[name] || (elemData[name] = {});
	}

	function syncFirstTimeProp(elem, prop, propName, attributeName, propData) {
	  var syncAttrValue = propData.lastAssignedValue;
	  if (empty(syncAttrValue)) {
	    if ('initial' in prop) {
	      syncAttrValue = getInitialValue(elem, propName, prop);
	    } else if ('default' in prop) {
	      syncAttrValue = getDefaultValue(elem, propName, prop);
	    }
	  }
	  if (!empty(syncAttrValue) && prop.serialize) {
	    syncAttrValue = prop.serialize(syncAttrValue);
	  }
	  if (!empty(syncAttrValue)) {
	    propData.syncingAttribute = true;
	    elem.setAttribute(attributeName, syncAttrValue);
	  }
	}

	function syncExistingProp(elem, prop, propName, attributeName, propData) {
	  if (attributeName && !propData.settingAttribute) {
	    var internalValue = propData.internalValue;

	    var serializedValue = prop.serialize(internalValue);
	    var currentAttrValue = elem.getAttribute(attributeName);
	    var serializedIsEmpty = empty(serializedValue);
	    var attributeChanged = !(serializedIsEmpty && empty(currentAttrValue) || serializedValue === currentAttrValue);

	    propData.syncingAttribute = true;

	    var shouldRemoveAttribute = empty(propData.lastAssignedValue);
	    if (shouldRemoveAttribute || serializedIsEmpty) {
	      elem.removeAttribute(attributeName);
	    } else {
	      elem.setAttribute(attributeName, serializedValue);
	    }

	    if (!attributeChanged && propData.syncingAttribute) {
	      propData.syncingAttribute = false;
	    }
	  }

	  // Allow the attribute to be linked again.
	  propData.settingAttribute = false;
	}

	function syncPropToAttr(elem, prop, propName, isFirstSync) {
	  var attributeName = data(elem, 'propertyLinks')[propName];
	  var propData = getPropData(elem, propName);

	  if (attributeName) {
	    if (isFirstSync) {
	      syncFirstTimeProp(elem, prop, propName, attributeName, propData);
	    } else {
	      syncExistingProp(elem, prop, propName, attributeName, propData);
	    }
	  }
	}

	var _window$2 = window;
	var HTMLElement$2 = _window$2.HTMLElement;


	function callConstructor(elem) {
	  var elemData = data(elem);
	  var readyCallbacks = elemData.readyCallbacks;
	  var constructor = elem.constructor;

	  // Ensures that this can never be called twice.

	  if (elem[$created]) {
	    return;
	  }

	  elem[$created] = true;

	  // Set up a renderer that is debounced for property sets to call directly.
	  elem[$rendererDebounced] = debounce$1(constructor[$renderer].bind(constructor));

	  // Set up property lifecycle.
	  if (constructor.props && constructor[$props]) {
	    constructor[$props](elem);
	  }

	  // Props should be set up before calling this.
	  if (typeof constructor.created === 'function') {
	    constructor.created(elem);
	  }

	  // Created should be set before invoking the ready listeners.
	  if (readyCallbacks) {
	    readyCallbacks.forEach(function (cb) {
	      return cb(elem);
	    });
	    delete elemData.readyCallbacks;
	  }
	}

	function syncPropsToAttrs(elem) {
	  var props = elem.constructor.props;
	  Object.keys(props).forEach(function (propName) {
	    var prop = props[propName];
	    syncPropToAttr(elem, prop, propName, true);
	  });
	}

	function callConnected(elem) {
	  var constructor = elem.constructor;


	  syncPropsToAttrs(elem);

	  elem[$connected] = true;
	  elem[$rendererDebounced](elem);

	  if (typeof constructor.attached === 'function') {
	    constructor.attached(elem);
	  }

	  elem.setAttribute('defined', '');
	}

	function callDisconnected(elem) {
	  var constructor = elem.constructor;


	  elem[$connected] = false;

	  if (typeof constructor.detached === 'function') {
	    constructor.detached(elem);
	  }
	}

	// Custom Elements v1
	function Component() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  var elem = (typeof Reflect === 'undefined' ? 'undefined' : babelHelpers.typeof(Reflect)) === 'object' ? Reflect.construct(HTMLElement$2, args, this.constructor) : HTMLElement$2.call(this, args[0]);
	  callConstructor(elem);
	  return elem;
	}

	// Custom Elements v1
	Component.observedAttributes = [];

	// Skate
	Component.props = {};

	// Skate
	Component.extend = function extend() {
	  var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var Base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

	  // Create class for the user.
	  var Ctor = function (_Base) {
	    babelHelpers.inherits(Ctor, _Base);

	    function Ctor() {
	      babelHelpers.classCallCheck(this, Ctor);
	      return babelHelpers.possibleConstructorReturn(this, (Ctor.__proto__ || Object.getPrototypeOf(Ctor)).apply(this, arguments));
	    }

	    return Ctor;
	  }(Base);

	  // Pass on statics from the Base if not supported (IE 9 and 10).


	  if (!Ctor.observedAttributes) {
	    var staticOpts = getOwnPropertyDescriptors(Base);
	    delete staticOpts.length;
	    delete staticOpts.prototype;
	    Object.defineProperties(Ctor, staticOpts);
	  }

	  // For inheriting from the object literal.
	  var opts = getOwnPropertyDescriptors(definition);
	  var prot = getOwnPropertyDescriptors(definition.prototype);

	  // Prototype is non configurable (but is writable).
	  delete opts.prototype;

	  // Pass on static and instance members from the definition.
	  Object.defineProperties(Ctor, opts);
	  Object.defineProperties(Ctor.prototype, prot);

	  return Ctor;
	};

	// Skate
	//
	// Incremental DOM renderer.
	Component.renderer = function renderer(_ref) {
	  var elem = _ref.elem;
	  var render = _ref.render;
	  var shadowRoot = _ref.shadowRoot;

	  patchInner(shadowRoot, function () {
	    var possibleFn = render(elem);
	    if (typeof possibleFn === 'function') {
	      possibleFn();
	    } else if (Array.isArray(possibleFn)) {
	      possibleFn.forEach(function (fn) {
	        if (typeof fn === 'function') {
	          fn();
	        }
	      });
	    }
	  });
	};

	// Skate
	//
	// This is a default implementation that does strict equality copmarison on
	// previous props and next props. It synchronously renders on the first prop
	// that is different and returns immediately.
	Component.updated = function updated(elem, prev) {
	  if (!prev) {
	    return true;
	  }
	  // use get all keys so that we check Symbols as well as regular props
	  // using a for loop so we can break early
	  var allKeys = keys(prev);
	  for (var i = 0; i < allKeys.length; i += 1) {
	    if (prev[allKeys[i]] !== elem[allKeys[i]]) {
	      return true;
	    }
	  }
	  return false;
	};

	// Skate
	//
	// Calls the user-defined updated() lifecycle callback.
	Component[$updated] = function _updated(elem) {
	  if (typeof this.updated === 'function') {
	    var prev = elem[$props];
	    elem[$props] = props(elem);
	    return this.updated(elem, prev);
	  }
	  return true;
	};

	// Skate
	//
	// Goes through the user-defined render lifecycle.
	Component[$renderer] = function _renderer(elem) {
	  if (elem[$rendering] || !elem[$connected]) {
	    return;
	  }

	  // Flag as rendering. This prevents anything from trying to render - or
	  // queueing a render - while there is a pending render.
	  elem[$rendering] = true;

	  var shouldRender = this[$updated](elem);

	  // Even though this would ideally be checked in the updated() callback,
	  // it may not be, so we ensure that there is a point in proceeding.
	  if (!this.render || !this.renderer) {
	    elem[$rendering] = false;
	    return;
	  }

	  if (shouldRender) {
	    if (!elem.shadowRoot) {
	      elem.attachShadow({ mode: 'open' });
	    }

	    this.renderer({
	      elem: elem,
	      render: this.render,
	      shadowRoot: elem.shadowRoot
	    });

	    if (typeof this.rendered === 'function') {
	      this.rendered(elem);
	    }
	  }

	  elem[$rendering] = false;
	};

	Component.prototype = Object.create(HTMLElement$2.prototype, {
	  // Custom Elements v1
	  connectedCallback: {
	    configurable: true,
	    value: function value() {
	      callConnected(this);
	    }
	  },

	  // Custom Elements v1
	  disconnectedCallback: {
	    configurable: true,
	    value: function value() {
	      callDisconnected(this);
	    }
	  },

	  // Custom Elements v1
	  attributeChangedCallback: {
	    configurable: true,
	    value: function value(name, oldValue, newValue) {
	      var attributeChanged = this.constructor.attributeChanged;

	      var propertyName = data(this, 'attributeLinks')[name];

	      if (propertyName) {
	        var propData = data(this, 'props')[propertyName];

	        // This ensures a property set doesn't cause the attribute changed
	        // handler to run again once we set this flag. This only ever has a
	        // chance to run when you set an attribute, it then sets a property and
	        // then that causes the attribute to be set again.
	        if (propData.syncingAttribute) {
	          propData.syncingAttribute = false;
	        } else {
	          // Sync up the property.
	          var propOpts = this.constructor.props[propertyName];
	          propData.settingAttribute = true;
	          var newPropVal = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
	          this[propertyName] = newPropVal;
	        }
	      }

	      if (attributeChanged) {
	        attributeChanged(this, { name: name, newValue: newValue, oldValue: oldValue });
	      }
	    }
	  }
	});

	function dashCase (str) {
	  return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	    var dash = !one || idx % 2 === 0 ? '' : '-';
	    return '' + one + dash + two.toLowerCase();
	  });
	}

	function createNativePropertyDefinition(name, opts) {
	  var prop = {
	    configurable: true,
	    enumerable: true
	  };

	  prop.created = function created(elem) {
	    var propData = getPropData(elem, name);
	    var attributeName = opts.attribute === true ? dashCase(name) : opts.attribute;
	    var initialValue = elem[name];

	    // Store property to attribute link information.
	    data(elem, 'attributeLinks')[attributeName] = name;
	    data(elem, 'propertyLinks')[name] = attributeName;

	    // Set up initial value if it wasn't specified.
	    if (empty(initialValue)) {
	      if (attributeName && elem.hasAttribute(attributeName)) {
	        initialValue = opts.deserialize(elem.getAttribute(attributeName));
	      } else if ('initial' in opts) {
	        initialValue = getInitialValue(elem, name, opts);
	      } else if ('default' in opts) {
	        initialValue = getDefaultValue(elem, name, opts);
	      }
	    }

	    propData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
	  };

	  prop.get = function get() {
	    var propData = getPropData(this, name);
	    var internalValue = propData.internalValue;

	    return typeof opts.get === 'function' ? opts.get(this, { name: name, internalValue: internalValue }) : internalValue;
	  };

	  prop.set = function set(newValue) {
	    var propData = getPropData(this, name);
	    propData.lastAssignedValue = newValue;
	    var oldValue = propData.oldValue;


	    if (empty(oldValue)) {
	      oldValue = null;
	    }

	    if (empty(newValue)) {
	      newValue = getDefaultValue(this, name, opts);
	    }

	    if (typeof opts.coerce === 'function') {
	      newValue = opts.coerce(newValue);
	    }

	    var changeData = { name: name, newValue: newValue, oldValue: oldValue };

	    if (typeof opts.set === 'function') {
	      opts.set(this, changeData);
	    }

	    // Queue a re-render.
	    this[$rendererDebounced](this);

	    // Update prop data so we can use it next time.
	    propData.internalValue = propData.oldValue = newValue;

	    // Link up the attribute.
	    if (this[$connected]) {
	      syncPropToAttr(this, opts, name, false);
	    }
	  };

	  return prop;
	}

	function initProps (opts) {
	  opts = opts || {};

	  if (typeof opts === 'function') {
	    opts = { coerce: opts };
	  }

	  return function (name) {
	    return createNativePropertyDefinition(name, assign({
	      default: null,
	      deserialize: function deserialize(value) {
	        return value;
	      },
	      serialize: function serialize(value) {
	        return value;
	      }
	    }, opts));
	  };
	}

	// Ensures that definitions passed as part of the constructor are functions
	// that return property definitions used on the element.
	function ensurePropertyFunctions(Ctor) {
	  var props = Ctor.props;

	  return keys(props).reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = props[descriptorName];
	    if (typeof descriptors[descriptorName] !== 'function') {
	      descriptors[descriptorName] = initProps(descriptors[descriptorName]);
	    }
	    return descriptors;
	  }, {});
	}

	// Ensures the property definitions are transformed to objects that can be used
	// to create properties on the element.
	function ensurePropertyDefinitions(Ctor) {
	  var props = ensurePropertyFunctions(Ctor);
	  return keys(props).reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = props[descriptorName](descriptorName);
	    return descriptors;
	  }, {});
	}

	// Ensures linked properties that have linked attributes are pre-formatted to
	// the attribute name in which they are linked.
	function formatLinkedAttributes(Ctor) {
	  var observedAttributes = Ctor.observedAttributes;
	  var props = Ctor.props;


	  if (!props) {
	    return;
	  }

	  keys(props).forEach(function (name) {
	    var prop = props[name];
	    var attr = prop.attribute;
	    if (attr) {
	      // Ensure the property is updated.
	      var linkedAttr = prop.attribute = attr === true ? dashCase(name) : attr;

	      // Automatically observe the attribute since they're linked from the
	      // attributeChangedCallback.
	      if (observedAttributes.indexOf(linkedAttr) === -1) {
	        observedAttributes.push(linkedAttr);
	      }
	    }
	  });

	  // Merge observed attributes.
	  Object.defineProperty(Ctor, 'observedAttributes', {
	    configurable: true,
	    enumerable: true,
	    get: function get() {
	      return observedAttributes;
	    }
	  });
	}

	function createInitProps(Ctor) {
	  var props = ensurePropertyDefinitions(Ctor);

	  return function (elem) {
	    if (!props) {
	      return;
	    }

	    keys(props).forEach(function (name) {
	      var prop = props[name];
	      prop.created(elem);

	      // https://bugs.webkit.org/show_bug.cgi?id=49739
	      //
	      // When Webkit fixes that bug so that native property accessors can be
	      // retrieved, we can move defining the property to the prototype and away
	      // from having to do if for every instance as all other browsers support
	      // this.
	      Object.defineProperty(elem, name, prop);
	    });
	  };
	}

	function generateUniqueName(name) {
	  // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
	  var rand = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = Math.random() * 16 | 0;
	    var v = c === 'x' ? r : r & 0x3 | 0x8; // eslint-disable-line no-mixed-operators
	    return v.toString(16);
	  });

	  return name + '-' + rand;
	}

	function prepareForRegistration(name, Ctor) {
	  Ctor[$name] = name;
	  Ctor[$props] = createInitProps(Ctor);
	}

	function define$1 (name, opts) {
	  if (opts === undefined) {
	    throw new Error('You have to define options to register a component ' + name);
	  }
	  var Ctor = (typeof opts === 'undefined' ? 'undefined' : babelHelpers.typeof(opts)) === 'object' ? Component.extend(opts) : opts;
	  formatLinkedAttributes(Ctor);

	  if (!window.customElements) {
	    throw new Error('Skate requires native custom element support or a polyfill.');
	  }

	  var uniqueName = name;
	  if (window.customElements.get(name)) {
	    uniqueName = generateUniqueName(name);
	  }
	  prepareForRegistration(uniqueName, Ctor);
	  window.customElements.define(uniqueName, Ctor, Ctor.extends ? { extends: Ctor.extends } : null);
	  return Ctor;
	}

	var Event$1 = function (TheEvent) {
	  if (TheEvent) {
	    try {
	      new TheEvent('emit-init'); // eslint-disable-line no-new
	    } catch (e) {
	      return undefined;
	    }
	  }
	  return TheEvent;
	}(window.Event);

	var h = builder();

	var kefir = createCommonjsModule(function (module, exports) {
		/*! Kefir.js v3.6.0
	  *  https://github.com/rpominov/kefir
	  */

		(function (global, factory) {
			(typeof exports === 'undefined' ? 'undefined' : babelHelpers.typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.Kefir = global.Kefir || {});
		})(commonjsGlobal, function (exports) {
			'use strict';

			function createObj(proto) {
				var F = function F() {};
				F.prototype = proto;
				return new F();
			}

			function extend(target /*, mixin1, mixin2...*/) {
				var length = arguments.length,
				    i = void 0,
				    prop = void 0;
				for (i = 1; i < length; i++) {
					for (prop in arguments[i]) {
						target[prop] = arguments[i][prop];
					}
				}
				return target;
			}

			function inherit(Child, Parent /*, mixin1, mixin2...*/) {
				var length = arguments.length,
				    i = void 0;
				Child.prototype = createObj(Parent.prototype);
				Child.prototype.constructor = Child;
				for (i = 2; i < length; i++) {
					extend(Child.prototype, arguments[i]);
				}
				return Child;
			}

			var NOTHING = ['<nothing>'];
			var END = 'end';
			var VALUE = 'value';
			var ERROR = 'error';
			var ANY = 'any';

			function concat(a, b) {
				var result = void 0,
				    length = void 0,
				    i = void 0,
				    j = void 0;
				if (a.length === 0) {
					return b;
				}
				if (b.length === 0) {
					return a;
				}
				j = 0;
				result = new Array(a.length + b.length);
				length = a.length;
				for (i = 0; i < length; i++, j++) {
					result[j] = a[i];
				}
				length = b.length;
				for (i = 0; i < length; i++, j++) {
					result[j] = b[i];
				}
				return result;
			}

			function find(arr, value) {
				var length = arr.length,
				    i = void 0;
				for (i = 0; i < length; i++) {
					if (arr[i] === value) {
						return i;
					}
				}
				return -1;
			}

			function findByPred(arr, pred) {
				var length = arr.length,
				    i = void 0;
				for (i = 0; i < length; i++) {
					if (pred(arr[i])) {
						return i;
					}
				}
				return -1;
			}

			function cloneArray(input) {
				var length = input.length,
				    result = new Array(length),
				    i = void 0;
				for (i = 0; i < length; i++) {
					result[i] = input[i];
				}
				return result;
			}

			function _remove(input, index) {
				var length = input.length,
				    result = void 0,
				    i = void 0,
				    j = void 0;
				if (index >= 0 && index < length) {
					if (length === 1) {
						return [];
					} else {
						result = new Array(length - 1);
						for (i = 0, j = 0; i < length; i++) {
							if (i !== index) {
								result[j] = input[i];
								j++;
							}
						}
						return result;
					}
				} else {
					return input;
				}
			}

			function map(input, fn) {
				var length = input.length,
				    result = new Array(length),
				    i = void 0;
				for (i = 0; i < length; i++) {
					result[i] = fn(input[i]);
				}
				return result;
			}

			function forEach(arr, fn) {
				var length = arr.length,
				    i = void 0;
				for (i = 0; i < length; i++) {
					fn(arr[i]);
				}
			}

			function fillArray(arr, value) {
				var length = arr.length,
				    i = void 0;
				for (i = 0; i < length; i++) {
					arr[i] = value;
				}
			}

			function contains(arr, value) {
				return find(arr, value) !== -1;
			}

			function slide(cur, next, max) {
				var length = Math.min(max, cur.length + 1),
				    offset = cur.length - length + 1,
				    result = new Array(length),
				    i = void 0;
				for (i = offset; i < length; i++) {
					result[i - offset] = cur[i];
				}
				result[length - 1] = next;
				return result;
			}

			function callSubscriber(type, fn, event) {
				if (type === ANY) {
					fn(event);
				} else if (type === event.type) {
					if (type === VALUE || type === ERROR) {
						fn(event.value);
					} else {
						fn();
					}
				}
			}

			function Dispatcher() {
				this._items = [];
				this._spies = [];
				this._inLoop = 0;
				this._removedItems = null;
			}

			extend(Dispatcher.prototype, {
				add: function add(type, fn) {
					this._items = concat(this._items, [{ type: type, fn: fn }]);
					return this._items.length;
				},
				remove: function remove(type, fn) {
					var index = findByPred(this._items, function (x) {
						return x.type === type && x.fn === fn;
					});

					// if we're currently in a notification loop,
					// remember this subscriber was removed
					if (this._inLoop !== 0 && index !== -1) {
						if (this._removedItems === null) {
							this._removedItems = [];
						}
						this._removedItems.push(this._items[index]);
					}

					this._items = _remove(this._items, index);
					return this._items.length;
				},
				addSpy: function addSpy(fn) {
					this._spies = concat(this._spies, [fn]);
					return this._spies.length;
				},

				// Because spies are only ever a function that perform logging as
				// their only side effect, we don't need the same complicated
				// removal logic like in remove()
				removeSpy: function removeSpy(fn) {
					this._spies = _remove(this._spies, this._spies.indexOf(fn));
					return this._spies.length;
				},
				dispatch: function dispatch(event) {
					this._inLoop++;
					for (var i = 0, spies = this._spies; this._spies !== null && i < spies.length; i++) {
						spies[i](event);
					}

					for (var _i = 0, items = this._items; _i < items.length; _i++) {

						// cleanup was called
						if (this._items === null) {
							break;
						}

						// this subscriber was removed
						if (this._removedItems !== null && contains(this._removedItems, items[_i])) {
							continue;
						}

						callSubscriber(items[_i].type, items[_i].fn, event);
					}
					this._inLoop--;
					if (this._inLoop === 0) {
						this._removedItems = null;
					}
				},
				cleanup: function cleanup() {
					this._items = null;
					this._spies = null;
				}
			});

			function Observable() {
				this._dispatcher = new Dispatcher();
				this._active = false;
				this._alive = true;
				this._activating = false;
				this._logHandlers = null;
				this._spyHandlers = null;
			}

			extend(Observable.prototype, {

				_name: 'observable',

				_onActivation: function _onActivation() {},
				_onDeactivation: function _onDeactivation() {},
				_setActive: function _setActive(active) {
					if (this._active !== active) {
						this._active = active;
						if (active) {
							this._activating = true;
							this._onActivation();
							this._activating = false;
						} else {
							this._onDeactivation();
						}
					}
				},
				_clear: function _clear() {
					this._setActive(false);
					this._dispatcher.cleanup();
					this._dispatcher = null;
					this._logHandlers = null;
				},
				_emit: function _emit(type, x) {
					switch (type) {
						case VALUE:
							return this._emitValue(x);
						case ERROR:
							return this._emitError(x);
						case END:
							return this._emitEnd();
					}
				},
				_emitValue: function _emitValue(value) {
					if (this._alive) {
						this._dispatcher.dispatch({ type: VALUE, value: value });
					}
				},
				_emitError: function _emitError(value) {
					if (this._alive) {
						this._dispatcher.dispatch({ type: ERROR, value: value });
					}
				},
				_emitEnd: function _emitEnd() {
					if (this._alive) {
						this._alive = false;
						this._dispatcher.dispatch({ type: END });
						this._clear();
					}
				},
				_on: function _on(type, fn) {
					if (this._alive) {
						this._dispatcher.add(type, fn);
						this._setActive(true);
					} else {
						callSubscriber(type, fn, { type: END });
					}
					return this;
				},
				_off: function _off(type, fn) {
					if (this._alive) {
						var count = this._dispatcher.remove(type, fn);
						if (count === 0) {
							this._setActive(false);
						}
					}
					return this;
				},
				onValue: function onValue(fn) {
					return this._on(VALUE, fn);
				},
				onError: function onError(fn) {
					return this._on(ERROR, fn);
				},
				onEnd: function onEnd(fn) {
					return this._on(END, fn);
				},
				onAny: function onAny(fn) {
					return this._on(ANY, fn);
				},
				offValue: function offValue(fn) {
					return this._off(VALUE, fn);
				},
				offError: function offError(fn) {
					return this._off(ERROR, fn);
				},
				offEnd: function offEnd(fn) {
					return this._off(END, fn);
				},
				offAny: function offAny(fn) {
					return this._off(ANY, fn);
				},
				observe: function observe(observerOrOnValue, onError, onEnd) {
					var _this = this;
					var closed = false;

					var observer = !observerOrOnValue || typeof observerOrOnValue === 'function' ? { value: observerOrOnValue, error: onError, end: onEnd } : observerOrOnValue;

					var handler = function handler(event) {
						if (event.type === END) {
							closed = true;
						}
						if (event.type === VALUE && observer.value) {
							observer.value(event.value);
						} else if (event.type === ERROR && observer.error) {
							observer.error(event.value);
						} else if (event.type === END && observer.end) {
							observer.end(event.value);
						}
					};

					this.onAny(handler);

					return {
						unsubscribe: function unsubscribe() {
							if (!closed) {
								_this.offAny(handler);
								closed = true;
							}
						},

						get closed() {
							return closed;
						}
					};
				},

				// A and B must be subclasses of Stream and Property (order doesn't matter)
				_ofSameType: function _ofSameType(A, B) {
					return A.prototype.getType() === this.getType() ? A : B;
				},
				setName: function setName(sourceObs /* optional */, selfName) {
					this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
					return this;
				},
				log: function log() {
					var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];

					var isCurrent = void 0;
					var handler = function handler(event) {
						var type = '<' + event.type + (isCurrent ? ':current' : '') + '>';
						if (event.type === END) {
							console.log(name, type);
						} else {
							console.log(name, type, event.value);
						}
					};

					if (this._alive) {
						if (!this._logHandlers) {
							this._logHandlers = [];
						}
						this._logHandlers.push({ name: name, handler: handler });
					}

					isCurrent = true;
					this.onAny(handler);
					isCurrent = false;

					return this;
				},
				offLog: function offLog() {
					var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];

					if (this._logHandlers) {
						var handlerIndex = findByPred(this._logHandlers, function (obj) {
							return obj.name === name;
						});
						if (handlerIndex !== -1) {
							this.offAny(this._logHandlers[handlerIndex].handler);
							this._logHandlers.splice(handlerIndex, 1);
						}
					}

					return this;
				},
				spy: function spy() {
					var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];

					var handler = function handler(event) {
						var type = '<' + event.type + '>';
						if (event.type === END) {
							console.log(name, type);
						} else {
							console.log(name, type, event.value);
						}
					};
					if (this._alive) {
						if (!this._spyHandlers) {
							this._spyHandlers = [];
						}
						this._spyHandlers.push({ name: name, handler: handler });
						this._dispatcher.addSpy(handler);
					}
					return this;
				},
				offSpy: function offSpy() {
					var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];

					if (this._spyHandlers) {
						var handlerIndex = findByPred(this._spyHandlers, function (obj) {
							return obj.name === name;
						});
						if (handlerIndex !== -1) {
							this._dispatcher.removeSpy(this._spyHandlers[handlerIndex].handler);
							this._spyHandlers.splice(handlerIndex, 1);
						}
					}
					return this;
				}
			});

			// extend() can't handle `toString` in IE8
			Observable.prototype.toString = function () {
				return '[' + this._name + ']';
			};

			function Stream() {
				Observable.call(this);
			}

			inherit(Stream, Observable, {

				_name: 'stream',

				getType: function getType() {
					return 'stream';
				}
			});

			function Property() {
				Observable.call(this);
				this._currentEvent = null;
			}

			inherit(Property, Observable, {

				_name: 'property',

				_emitValue: function _emitValue(value) {
					if (this._alive) {
						this._currentEvent = { type: VALUE, value: value };
						if (!this._activating) {
							this._dispatcher.dispatch({ type: VALUE, value: value });
						}
					}
				},
				_emitError: function _emitError(value) {
					if (this._alive) {
						this._currentEvent = { type: ERROR, value: value };
						if (!this._activating) {
							this._dispatcher.dispatch({ type: ERROR, value: value });
						}
					}
				},
				_emitEnd: function _emitEnd() {
					if (this._alive) {
						this._alive = false;
						if (!this._activating) {
							this._dispatcher.dispatch({ type: END });
						}
						this._clear();
					}
				},
				_on: function _on(type, fn) {
					if (this._alive) {
						this._dispatcher.add(type, fn);
						this._setActive(true);
					}
					if (this._currentEvent !== null) {
						callSubscriber(type, fn, this._currentEvent);
					}
					if (!this._alive) {
						callSubscriber(type, fn, { type: END });
					}
					return this;
				},
				getType: function getType() {
					return 'property';
				}
			});

			var neverS = new Stream();
			neverS._emitEnd();
			neverS._name = 'never';

			function never() {
				return neverS;
			}

			function timeBased(mixin) {

				function AnonymousStream(wait, options) {
					var _this = this;

					Stream.call(this);
					this._wait = wait;
					this._intervalId = null;
					this._$onTick = function () {
						return _this._onTick();
					};
					this._init(options);
				}

				inherit(AnonymousStream, Stream, {
					_init: function _init() {},
					_free: function _free() {},
					_onTick: function _onTick() {},
					_onActivation: function _onActivation() {
						this._intervalId = setInterval(this._$onTick, this._wait);
					},
					_onDeactivation: function _onDeactivation() {
						if (this._intervalId !== null) {
							clearInterval(this._intervalId);
							this._intervalId = null;
						}
					},
					_clear: function _clear() {
						Stream.prototype._clear.call(this);
						this._$onTick = null;
						this._free();
					}
				}, mixin);

				return AnonymousStream;
			}

			var S = timeBased({

				_name: 'later',

				_init: function _init(_ref) {
					var x = _ref.x;

					this._x = x;
				},
				_free: function _free() {
					this._x = null;
				},
				_onTick: function _onTick() {
					this._emitValue(this._x);
					this._emitEnd();
				}
			});

			function later(wait, x) {
				return new S(wait, { x: x });
			}

			var S$1 = timeBased({

				_name: 'interval',

				_init: function _init(_ref) {
					var x = _ref.x;

					this._x = x;
				},
				_free: function _free() {
					this._x = null;
				},
				_onTick: function _onTick() {
					this._emitValue(this._x);
				}
			});

			function interval(wait, x) {
				return new S$1(wait, { x: x });
			}

			var S$2 = timeBased({

				_name: 'sequentially',

				_init: function _init(_ref) {
					var xs = _ref.xs;

					this._xs = cloneArray(xs);
				},
				_free: function _free() {
					this._xs = null;
				},
				_onTick: function _onTick() {
					if (this._xs.length === 1) {
						this._emitValue(this._xs[0]);
						this._emitEnd();
					} else {
						this._emitValue(this._xs.shift());
					}
				}
			});

			function sequentially(wait, xs) {
				return xs.length === 0 ? never() : new S$2(wait, { xs: xs });
			}

			var S$3 = timeBased({

				_name: 'fromPoll',

				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_onTick: function _onTick() {
					var fn = this._fn;
					this._emitValue(fn());
				}
			});

			function fromPoll(wait, fn) {
				return new S$3(wait, { fn: fn });
			}

			function emitter(obs) {

				function value(x) {
					obs._emitValue(x);
					return obs._active;
				}

				function error(x) {
					obs._emitError(x);
					return obs._active;
				}

				function end() {
					obs._emitEnd();
					return obs._active;
				}

				function event(e) {
					obs._emit(e.type, e.value);
					return obs._active;
				}

				return {
					value: value,
					error: error,
					end: end,
					event: event,

					// legacy
					emit: value,
					emitEvent: event
				};
			}

			var S$4 = timeBased({

				_name: 'withInterval',

				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
					this._emitter = emitter(this);
				},
				_free: function _free() {
					this._fn = null;
					this._emitter = null;
				},
				_onTick: function _onTick() {
					var fn = this._fn;
					fn(this._emitter);
				}
			});

			function withInterval(wait, fn) {
				return new S$4(wait, { fn: fn });
			}

			function S$5(fn) {
				Stream.call(this);
				this._fn = fn;
				this._unsubscribe = null;
			}

			inherit(S$5, Stream, {

				_name: 'stream',

				_onActivation: function _onActivation() {
					var fn = this._fn;
					var unsubscribe = fn(emitter(this));
					this._unsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;

					// fix https://github.com/rpominov/kefir/issues/35
					if (!this._active) {
						this._callUnsubscribe();
					}
				},
				_callUnsubscribe: function _callUnsubscribe() {
					if (this._unsubscribe !== null) {
						this._unsubscribe();
						this._unsubscribe = null;
					}
				},
				_onDeactivation: function _onDeactivation() {
					this._callUnsubscribe();
				},
				_clear: function _clear() {
					Stream.prototype._clear.call(this);
					this._fn = null;
				}
			});

			function stream(fn) {
				return new S$5(fn);
			}

			function fromCallback(callbackConsumer) {

				var called = false;

				return stream(function (emitter) {

					if (!called) {
						callbackConsumer(function (x) {
							emitter.emit(x);
							emitter.end();
						});
						called = true;
					}
				}).setName('fromCallback');
			}

			function fromNodeCallback(callbackConsumer) {

				var called = false;

				return stream(function (emitter) {

					if (!called) {
						callbackConsumer(function (error, x) {
							if (error) {
								emitter.error(error);
							} else {
								emitter.emit(x);
							}
							emitter.end();
						});
						called = true;
					}
				}).setName('fromNodeCallback');
			}

			function spread(fn, length) {
				switch (length) {
					case 0:
						return function () {
							return fn();
						};
					case 1:
						return function (a) {
							return fn(a[0]);
						};
					case 2:
						return function (a) {
							return fn(a[0], a[1]);
						};
					case 3:
						return function (a) {
							return fn(a[0], a[1], a[2]);
						};
					case 4:
						return function (a) {
							return fn(a[0], a[1], a[2], a[3]);
						};
					default:
						return function (a) {
							return fn.apply(null, a);
						};
				}
			}

			function apply(fn, c, a) {
				var aLength = a ? a.length : 0;
				if (c == null) {
					switch (aLength) {
						case 0:
							return fn();
						case 1:
							return fn(a[0]);
						case 2:
							return fn(a[0], a[1]);
						case 3:
							return fn(a[0], a[1], a[2]);
						case 4:
							return fn(a[0], a[1], a[2], a[3]);
						default:
							return fn.apply(null, a);
					}
				} else {
					switch (aLength) {
						case 0:
							return fn.call(c);
						default:
							return fn.apply(c, a);
					}
				}
			}

			function fromSubUnsub(sub, unsub, transformer /* Function | falsey */) {
				return stream(function (emitter) {

					var handler = transformer ? function () {
						emitter.emit(apply(transformer, this, arguments));
					} : function (x) {
						emitter.emit(x);
					};

					sub(handler);
					return function () {
						return unsub(handler);
					};
				}).setName('fromSubUnsub');
			}

			var pairs = [['addEventListener', 'removeEventListener'], ['addListener', 'removeListener'], ['on', 'off']];

			function fromEvents(target, eventName, transformer) {
				var sub = void 0,
				    unsub = void 0;

				for (var i = 0; i < pairs.length; i++) {
					if (typeof target[pairs[i][0]] === 'function' && typeof target[pairs[i][1]] === 'function') {
						sub = pairs[i][0];
						unsub = pairs[i][1];
						break;
					}
				}

				if (sub === undefined) {
					throw new Error('target don\'t support any of ' + 'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
				}

				return fromSubUnsub(function (handler) {
					return target[sub](eventName, handler);
				}, function (handler) {
					return target[unsub](eventName, handler);
				}, transformer).setName('fromEvents');
			}

			// HACK:
			//   We don't call parent Class constructor, but instead putting all necessary
			//   properties into prototype to simulate ended Property
			//   (see Propperty and Observable classes).

			function P(value) {
				this._currentEvent = { type: 'value', value: value, current: true };
			}

			inherit(P, Property, {
				_name: 'constant',
				_active: false,
				_activating: false,
				_alive: false,
				_dispatcher: null,
				_logHandlers: null
			});

			function constant(x) {
				return new P(x);
			}

			// HACK:
			//   We don't call parent Class constructor, but instead putting all necessary
			//   properties into prototype to simulate ended Property
			//   (see Propperty and Observable classes).

			function P$1(value) {
				this._currentEvent = { type: 'error', value: value, current: true };
			}

			inherit(P$1, Property, {
				_name: 'constantError',
				_active: false,
				_activating: false,
				_alive: false,
				_dispatcher: null,
				_logHandlers: null
			});

			function constantError(x) {
				return new P$1(x);
			}

			function createConstructor(BaseClass, name) {
				return function AnonymousObservable(source, options) {
					var _this = this;

					BaseClass.call(this);
					this._source = source;
					this._name = source._name + '.' + name;
					this._init(options);
					this._$handleAny = function (event) {
						return _this._handleAny(event);
					};
				};
			}

			function createClassMethods(BaseClass) {
				return {
					_init: function _init() {},
					_free: function _free() {},
					_handleValue: function _handleValue(x) {
						this._emitValue(x);
					},
					_handleError: function _handleError(x) {
						this._emitError(x);
					},
					_handleEnd: function _handleEnd() {
						this._emitEnd();
					},
					_handleAny: function _handleAny(event) {
						switch (event.type) {
							case VALUE:
								return this._handleValue(event.value);
							case ERROR:
								return this._handleError(event.value);
							case END:
								return this._handleEnd();
						}
					},
					_onActivation: function _onActivation() {
						this._source.onAny(this._$handleAny);
					},
					_onDeactivation: function _onDeactivation() {
						this._source.offAny(this._$handleAny);
					},
					_clear: function _clear() {
						BaseClass.prototype._clear.call(this);
						this._source = null;
						this._$handleAny = null;
						this._free();
					}
				};
			}

			function createStream(name, mixin) {
				var S = createConstructor(Stream, name);
				inherit(S, Stream, createClassMethods(Stream), mixin);
				return S;
			}

			function createProperty(name, mixin) {
				var P = createConstructor(Property, name);
				inherit(P, Property, createClassMethods(Property), mixin);
				return P;
			}

			var P$2 = createProperty('toProperty', {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._getInitialCurrent = fn;
				},
				_onActivation: function _onActivation() {
					if (this._getInitialCurrent !== null) {
						var getInitial = this._getInitialCurrent;
						this._emitValue(getInitial());
					}
					this._source.onAny(this._$handleAny); // copied from patterns/one-source
				}
			});

			function toProperty(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

				if (fn !== null && typeof fn !== 'function') {
					throw new Error('You should call toProperty() with a function or no arguments.');
				}
				return new P$2(obs, { fn: fn });
			}

			var S$6 = createStream('changes', {
				_handleValue: function _handleValue(x) {
					if (!this._activating) {
						this._emitValue(x);
					}
				},
				_handleError: function _handleError(x) {
					if (!this._activating) {
						this._emitError(x);
					}
				}
			});

			function changes(obs) {
				return new S$6(obs);
			}

			function fromPromise(promise) {

				var called = false;

				var result = stream(function (emitter) {
					if (!called) {
						var onValue = function onValue(x) {
							emitter.emit(x);
							emitter.end();
						};
						var onError = function onError(x) {
							emitter.error(x);
							emitter.end();
						};
						var _promise = promise.then(onValue, onError);

						// prevent libraries like 'Q' or 'when' from swallowing exceptions
						if (_promise && typeof _promise.done === 'function') {
							_promise.done();
						}

						called = true;
					}
				});

				return toProperty(result, null).setName('fromPromise');
			}

			function getGlodalPromise() {
				if (typeof Promise === 'function') {
					return Promise;
				} else {
					throw new Error('There isn\'t default Promise, use shim or parameter');
				}
			}

			function toPromise(obs) {
				var Promise = arguments.length <= 1 || arguments[1] === undefined ? getGlodalPromise() : arguments[1];

				var last = null;
				return new Promise(function (resolve, reject) {
					obs.onAny(function (event) {
						if (event.type === END && last !== null) {
							(last.type === VALUE ? resolve : reject)(last.value);
							last = null;
						} else {
							last = event;
						}
					});
				});
			}

			var commonjsGlobal$$ = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

			function createCommonjsModule(fn, module) {
				return module = { exports: {} }, fn(module, module.exports), module.exports;
			}

			var ponyfill = createCommonjsModule(function (module, exports) {
				'use strict';

				Object.defineProperty(exports, "__esModule", {
					value: true
				});
				exports['default'] = symbolObservablePonyfill;
				function symbolObservablePonyfill(root) {
					var result;
					var _Symbol = root.Symbol;

					if (typeof _Symbol === 'function') {
						if (_Symbol.observable) {
							result = _Symbol.observable;
						} else {
							result = _Symbol('observable');
							_Symbol.observable = result;
						}
					} else {
						result = '@@observable';
					}

					return result;
				};
			});

			var require$$0$1 = ponyfill && (typeof ponyfill === 'undefined' ? 'undefined' : babelHelpers.typeof(ponyfill)) === 'object' && 'default' in ponyfill ? ponyfill['default'] : ponyfill;

			var index$1 = createCommonjsModule(function (module, exports) {
				'use strict';

				Object.defineProperty(exports, "__esModule", {
					value: true
				});

				var _ponyfill = require$$0$1;

				var _ponyfill2 = _interopRequireDefault(_ponyfill);

				function _interopRequireDefault(obj) {
					return obj && obj.__esModule ? obj : { 'default': obj };
				}

				var root = undefined; /* global window */

				if (typeof commonjsGlobal$$ !== 'undefined') {
					root = commonjsGlobal$$;
				} else if (typeof window !== 'undefined') {
					root = window;
				}

				var result = (0, _ponyfill2['default'])(root);
				exports['default'] = result;
			});

			var require$$0 = index$1 && (typeof index$1 === 'undefined' ? 'undefined' : babelHelpers.typeof(index$1)) === 'object' && 'default' in index$1 ? index$1['default'] : index$1;

			var index = createCommonjsModule(function (module) {
				module.exports = require$$0;
			});

			var $$observable = index && (typeof index === 'undefined' ? 'undefined' : babelHelpers.typeof(index)) === 'object' && 'default' in index ? index['default'] : index;

			function fromESObservable(_observable) {
				var observable = _observable[$$observable] ? _observable[$$observable]() : _observable;
				return stream(function (emitter) {
					var unsub = observable.subscribe({
						error: function error(_error) {
							emitter.error(_error);
							emitter.end();
						},
						next: function next(value) {
							emitter.emit(value);
						},
						complete: function complete() {
							emitter.end();
						}
					});

					if (unsub.unsubscribe) {
						return function () {
							unsub.unsubscribe();
						};
					} else {
						return unsub;
					}
				}).setName('fromESObservable');
			}

			function ESObservable(observable) {
				this._observable = observable.takeErrors(1);
			}

			extend(ESObservable.prototype, {
				subscribe: function subscribe(observerOrOnNext, onError, onComplete) {
					var _this = this;

					var observer = typeof observerOrOnNext === 'function' ? { next: observerOrOnNext, error: onError, complete: onComplete } : observerOrOnNext;

					var fn = function fn(event) {
						if (event.type === END) {
							closed = true;
						}

						if (event.type === VALUE && observer.next) {
							observer.next(event.value);
						} else if (event.type === ERROR && observer.error) {
							observer.error(event.value);
						} else if (event.type === END && observer.complete) {
							observer.complete(event.value);
						}
					};

					this._observable.onAny(fn);
					var closed = false;

					var subscription = {
						unsubscribe: function unsubscribe() {
							closed = true;
							_this._observable.offAny(fn);
						},
						get closed() {
							return closed;
						}
					};
					return subscription;
				}
			});

			// Need to assign directly b/c Symbols aren't enumerable.
			ESObservable.prototype[$$observable] = function () {
				return this;
			};

			function toESObservable() {
				return new ESObservable(this);
			}

			function defaultErrorsCombinator(errors) {
				var latestError = void 0;
				for (var i = 0; i < errors.length; i++) {
					if (errors[i] !== undefined) {
						if (latestError === undefined || latestError.index < errors[i].index) {
							latestError = errors[i];
						}
					}
				}
				return latestError.error;
			}

			function Combine(active, passive, combinator) {
				var _this = this;

				Stream.call(this);
				this._activeCount = active.length;
				this._sources = concat(active, passive);
				this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
					return x;
				};
				this._aliveCount = 0;
				this._latestValues = new Array(this._sources.length);
				this._latestErrors = new Array(this._sources.length);
				fillArray(this._latestValues, NOTHING);
				this._emitAfterActivation = false;
				this._endAfterActivation = false;
				this._latestErrorIndex = 0;

				this._$handlers = [];

				var _loop = function _loop(i) {
					_this._$handlers.push(function (event) {
						return _this._handleAny(i, event);
					});
				};

				for (var i = 0; i < this._sources.length; i++) {
					_loop(i);
				}
			}

			inherit(Combine, Stream, {

				_name: 'combine',

				_onActivation: function _onActivation() {
					this._aliveCount = this._activeCount;

					// we need to suscribe to _passive_ sources before _active_
					// (see https://github.com/rpominov/kefir/issues/98)
					for (var i = this._activeCount; i < this._sources.length; i++) {
						this._sources[i].onAny(this._$handlers[i]);
					}
					for (var _i = 0; _i < this._activeCount; _i++) {
						this._sources[_i].onAny(this._$handlers[_i]);
					}

					if (this._emitAfterActivation) {
						this._emitAfterActivation = false;
						this._emitIfFull();
					}
					if (this._endAfterActivation) {
						this._emitEnd();
					}
				},
				_onDeactivation: function _onDeactivation() {
					var length = this._sources.length,
					    i = void 0;
					for (i = 0; i < length; i++) {
						this._sources[i].offAny(this._$handlers[i]);
					}
				},
				_emitIfFull: function _emitIfFull() {
					var hasAllValues = true;
					var hasErrors = false;
					var length = this._latestValues.length;
					var valuesCopy = new Array(length);
					var errorsCopy = new Array(length);

					for (var i = 0; i < length; i++) {
						valuesCopy[i] = this._latestValues[i];
						errorsCopy[i] = this._latestErrors[i];

						if (valuesCopy[i] === NOTHING) {
							hasAllValues = false;
						}

						if (errorsCopy[i] !== undefined) {
							hasErrors = true;
						}
					}

					if (hasAllValues) {
						var combinator = this._combinator;
						this._emitValue(combinator(valuesCopy));
					}
					if (hasErrors) {
						this._emitError(defaultErrorsCombinator(errorsCopy));
					}
				},
				_handleAny: function _handleAny(i, event) {

					if (event.type === VALUE || event.type === ERROR) {

						if (event.type === VALUE) {
							this._latestValues[i] = event.value;
							this._latestErrors[i] = undefined;
						}
						if (event.type === ERROR) {
							this._latestValues[i] = NOTHING;
							this._latestErrors[i] = {
								index: this._latestErrorIndex++,
								error: event.value
							};
						}

						if (i < this._activeCount) {
							if (this._activating) {
								this._emitAfterActivation = true;
							} else {
								this._emitIfFull();
							}
						}
					} else {
						// END

						if (i < this._activeCount) {
							this._aliveCount--;
							if (this._aliveCount === 0) {
								if (this._activating) {
									this._endAfterActivation = true;
								} else {
									this._emitEnd();
								}
							}
						}
					}
				},
				_clear: function _clear() {
					Stream.prototype._clear.call(this);
					this._sources = null;
					this._latestValues = null;
					this._latestErrors = null;
					this._combinator = null;
					this._$handlers = null;
				}
			});

			function combine(active) {
				var passive = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
				var combinator = arguments[2];

				if (typeof passive === 'function') {
					combinator = passive;
					passive = [];
				}
				return active.length === 0 ? never() : new Combine(active, passive, combinator);
			}

			var Observable$1 = {
				empty: function empty() {
					return never();
				},

				// Monoid based on merge() seems more useful than one based on concat().
				concat: function concat(a, b) {
					return a.merge(b);
				},
				of: function of(x) {
					return constant(x);
				},
				map: function map(fn, obs) {
					return obs.map(fn);
				},
				bimap: function bimap(fnErr, fnVal, obs) {
					return obs.mapErrors(fnErr).map(fnVal);
				},

				// This ap strictly speaking incompatible with chain. If we derive ap from chain we get
				// different (not very useful) behavior. But spec requires that if method can be derived
				// it must have the same behavior as hand-written method. We intentionally violate the spec
				// in hope that it won't cause many troubles in practice. And in return we have more useful type.
				ap: function ap(obsFn, obsVal) {
					return combine([obsFn, obsVal], function (fn, val) {
						return fn(val);
					});
				},
				chain: function chain(fn, obs) {
					return obs.flatMap(fn);
				}
			};

			var staticLand = Object.freeze({
				Observable: Observable$1
			});

			var mixin = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					this._emitValue(fn(x));
				}
			};

			var S$7 = createStream('map', mixin);
			var P$3 = createProperty('map', mixin);

			var id = function id(x) {
				return x;
			};

			function map$1(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

				return new (obs._ofSameType(S$7, P$3))(obs, { fn: fn });
			}

			var mixin$1 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					if (fn(x)) {
						this._emitValue(x);
					}
				}
			};

			var S$8 = createStream('filter', mixin$1);
			var P$4 = createProperty('filter', mixin$1);

			var id$1 = function id$1(x) {
				return x;
			};

			function filter(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? id$1 : arguments[1];

				return new (obs._ofSameType(S$8, P$4))(obs, { fn: fn });
			}

			var mixin$2 = {
				_init: function _init(_ref) {
					var n = _ref.n;

					this._n = n;
					if (n <= 0) {
						this._emitEnd();
					}
				},
				_handleValue: function _handleValue(x) {
					this._n--;
					this._emitValue(x);
					if (this._n === 0) {
						this._emitEnd();
					}
				}
			};

			var S$9 = createStream('take', mixin$2);
			var P$5 = createProperty('take', mixin$2);

			function take(obs, n) {
				return new (obs._ofSameType(S$9, P$5))(obs, { n: n });
			}

			var mixin$3 = {
				_init: function _init(_ref) {
					var n = _ref.n;

					this._n = n;
					if (n <= 0) {
						this._emitEnd();
					}
				},
				_handleError: function _handleError(x) {
					this._n--;
					this._emitError(x);
					if (this._n === 0) {
						this._emitEnd();
					}
				}
			};

			var S$10 = createStream('takeErrors', mixin$3);
			var P$6 = createProperty('takeErrors', mixin$3);

			function takeErrors(obs, n) {
				return new (obs._ofSameType(S$10, P$6))(obs, { n: n });
			}

			var mixin$4 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					if (fn(x)) {
						this._emitValue(x);
					} else {
						this._emitEnd();
					}
				}
			};

			var S$11 = createStream('takeWhile', mixin$4);
			var P$7 = createProperty('takeWhile', mixin$4);

			var id$2 = function id$2(x) {
				return x;
			};

			function takeWhile(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? id$2 : arguments[1];

				return new (obs._ofSameType(S$11, P$7))(obs, { fn: fn });
			}

			var mixin$5 = {
				_init: function _init() {
					this._lastValue = NOTHING;
				},
				_free: function _free() {
					this._lastValue = null;
				},
				_handleValue: function _handleValue(x) {
					this._lastValue = x;
				},
				_handleEnd: function _handleEnd() {
					if (this._lastValue !== NOTHING) {
						this._emitValue(this._lastValue);
					}
					this._emitEnd();
				}
			};

			var S$12 = createStream('last', mixin$5);
			var P$8 = createProperty('last', mixin$5);

			function last(obs) {
				return new (obs._ofSameType(S$12, P$8))(obs);
			}

			var mixin$6 = {
				_init: function _init(_ref) {
					var n = _ref.n;

					this._n = Math.max(0, n);
				},
				_handleValue: function _handleValue(x) {
					if (this._n === 0) {
						this._emitValue(x);
					} else {
						this._n--;
					}
				}
			};

			var S$13 = createStream('skip', mixin$6);
			var P$9 = createProperty('skip', mixin$6);

			function skip(obs, n) {
				return new (obs._ofSameType(S$13, P$9))(obs, { n: n });
			}

			var mixin$7 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					if (this._fn !== null && !fn(x)) {
						this._fn = null;
					}
					if (this._fn === null) {
						this._emitValue(x);
					}
				}
			};

			var S$14 = createStream('skipWhile', mixin$7);
			var P$10 = createProperty('skipWhile', mixin$7);

			var id$3 = function id$3(x) {
				return x;
			};

			function skipWhile(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? id$3 : arguments[1];

				return new (obs._ofSameType(S$14, P$10))(obs, { fn: fn });
			}

			var mixin$8 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
					this._prev = NOTHING;
				},
				_free: function _free() {
					this._fn = null;
					this._prev = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					if (this._prev === NOTHING || !fn(this._prev, x)) {
						this._prev = x;
						this._emitValue(x);
					}
				}
			};

			var S$15 = createStream('skipDuplicates', mixin$8);
			var P$11 = createProperty('skipDuplicates', mixin$8);

			var eq = function eq(a, b) {
				return a === b;
			};

			function skipDuplicates(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? eq : arguments[1];

				return new (obs._ofSameType(S$15, P$11))(obs, { fn: fn });
			}

			var mixin$9 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;
					var seed = _ref.seed;

					this._fn = fn;
					this._prev = seed;
				},
				_free: function _free() {
					this._prev = null;
					this._fn = null;
				},
				_handleValue: function _handleValue(x) {
					if (this._prev !== NOTHING) {
						var fn = this._fn;
						this._emitValue(fn(this._prev, x));
					}
					this._prev = x;
				}
			};

			var S$16 = createStream('diff', mixin$9);
			var P$12 = createProperty('diff', mixin$9);

			function defaultFn(a, b) {
				return [a, b];
			}

			function diff(obs, fn) {
				var seed = arguments.length <= 2 || arguments[2] === undefined ? NOTHING : arguments[2];

				return new (obs._ofSameType(S$16, P$12))(obs, { fn: fn || defaultFn, seed: seed });
			}

			var P$13 = createProperty('scan', {
				_init: function _init(_ref) {
					var fn = _ref.fn;
					var seed = _ref.seed;

					this._fn = fn;
					this._seed = seed;
					if (seed !== NOTHING) {
						this._emitValue(seed);
					}
				},
				_free: function _free() {
					this._fn = null;
					this._seed = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					if (this._currentEvent === null || this._currentEvent.type === ERROR) {
						this._emitValue(this._seed === NOTHING ? x : fn(this._seed, x));
					} else {
						this._emitValue(fn(this._currentEvent.value, x));
					}
				}
			});

			function scan(obs, fn) {
				var seed = arguments.length <= 2 || arguments[2] === undefined ? NOTHING : arguments[2];

				return new P$13(obs, { fn: fn, seed: seed });
			}

			var mixin$10 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					var xs = fn(x);
					for (var i = 0; i < xs.length; i++) {
						this._emitValue(xs[i]);
					}
				}
			};

			var S$17 = createStream('flatten', mixin$10);

			var id$4 = function id$4(x) {
				return x;
			};

			function flatten(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? id$4 : arguments[1];

				return new S$17(obs, { fn: fn });
			}

			var END_MARKER = {};

			var mixin$11 = {
				_init: function _init(_ref) {
					var _this = this;

					var wait = _ref.wait;

					this._wait = Math.max(0, wait);
					this._buff = [];
					this._$shiftBuff = function () {
						var value = _this._buff.shift();
						if (value === END_MARKER) {
							_this._emitEnd();
						} else {
							_this._emitValue(value);
						}
					};
				},
				_free: function _free() {
					this._buff = null;
					this._$shiftBuff = null;
				},
				_handleValue: function _handleValue(x) {
					if (this._activating) {
						this._emitValue(x);
					} else {
						this._buff.push(x);
						setTimeout(this._$shiftBuff, this._wait);
					}
				},
				_handleEnd: function _handleEnd() {
					if (this._activating) {
						this._emitEnd();
					} else {
						this._buff.push(END_MARKER);
						setTimeout(this._$shiftBuff, this._wait);
					}
				}
			};

			var S$18 = createStream('delay', mixin$11);
			var P$14 = createProperty('delay', mixin$11);

			function delay(obs, wait) {
				return new (obs._ofSameType(S$18, P$14))(obs, { wait: wait });
			}

			var now = Date.now ? function () {
				return Date.now();
			} : function () {
				return new Date().getTime();
			};

			var mixin$12 = {
				_init: function _init(_ref) {
					var _this = this;

					var wait = _ref.wait;
					var leading = _ref.leading;
					var trailing = _ref.trailing;

					this._wait = Math.max(0, wait);
					this._leading = leading;
					this._trailing = trailing;
					this._trailingValue = null;
					this._timeoutId = null;
					this._endLater = false;
					this._lastCallTime = 0;
					this._$trailingCall = function () {
						return _this._trailingCall();
					};
				},
				_free: function _free() {
					this._trailingValue = null;
					this._$trailingCall = null;
				},
				_handleValue: function _handleValue(x) {
					if (this._activating) {
						this._emitValue(x);
					} else {
						var curTime = now();
						if (this._lastCallTime === 0 && !this._leading) {
							this._lastCallTime = curTime;
						}
						var remaining = this._wait - (curTime - this._lastCallTime);
						if (remaining <= 0) {
							this._cancelTrailing();
							this._lastCallTime = curTime;
							this._emitValue(x);
						} else if (this._trailing) {
							this._cancelTrailing();
							this._trailingValue = x;
							this._timeoutId = setTimeout(this._$trailingCall, remaining);
						}
					}
				},
				_handleEnd: function _handleEnd() {
					if (this._activating) {
						this._emitEnd();
					} else {
						if (this._timeoutId) {
							this._endLater = true;
						} else {
							this._emitEnd();
						}
					}
				},
				_cancelTrailing: function _cancelTrailing() {
					if (this._timeoutId !== null) {
						clearTimeout(this._timeoutId);
						this._timeoutId = null;
					}
				},
				_trailingCall: function _trailingCall() {
					this._emitValue(this._trailingValue);
					this._timeoutId = null;
					this._trailingValue = null;
					this._lastCallTime = !this._leading ? 0 : now();
					if (this._endLater) {
						this._emitEnd();
					}
				}
			};

			var S$19 = createStream('throttle', mixin$12);
			var P$15 = createProperty('throttle', mixin$12);

			function throttle(obs, wait) {
				var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				var _ref2$leading = _ref2.leading;
				var leading = _ref2$leading === undefined ? true : _ref2$leading;
				var _ref2$trailing = _ref2.trailing;
				var trailing = _ref2$trailing === undefined ? true : _ref2$trailing;

				return new (obs._ofSameType(S$19, P$15))(obs, { wait: wait, leading: leading, trailing: trailing });
			}

			var mixin$13 = {
				_init: function _init(_ref) {
					var _this = this;

					var wait = _ref.wait;
					var immediate = _ref.immediate;

					this._wait = Math.max(0, wait);
					this._immediate = immediate;
					this._lastAttempt = 0;
					this._timeoutId = null;
					this._laterValue = null;
					this._endLater = false;
					this._$later = function () {
						return _this._later();
					};
				},
				_free: function _free() {
					this._laterValue = null;
					this._$later = null;
				},
				_handleValue: function _handleValue(x) {
					if (this._activating) {
						this._emitValue(x);
					} else {
						this._lastAttempt = now();
						if (this._immediate && !this._timeoutId) {
							this._emitValue(x);
						}
						if (!this._timeoutId) {
							this._timeoutId = setTimeout(this._$later, this._wait);
						}
						if (!this._immediate) {
							this._laterValue = x;
						}
					}
				},
				_handleEnd: function _handleEnd() {
					if (this._activating) {
						this._emitEnd();
					} else {
						if (this._timeoutId && !this._immediate) {
							this._endLater = true;
						} else {
							this._emitEnd();
						}
					}
				},
				_later: function _later() {
					var last = now() - this._lastAttempt;
					if (last < this._wait && last >= 0) {
						this._timeoutId = setTimeout(this._$later, this._wait - last);
					} else {
						this._timeoutId = null;
						if (!this._immediate) {
							this._emitValue(this._laterValue);
							this._laterValue = null;
						}
						if (this._endLater) {
							this._emitEnd();
						}
					}
				}
			};

			var S$20 = createStream('debounce', mixin$13);
			var P$16 = createProperty('debounce', mixin$13);

			function debounce(obs, wait) {
				var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				var _ref2$immediate = _ref2.immediate;
				var immediate = _ref2$immediate === undefined ? false : _ref2$immediate;

				return new (obs._ofSameType(S$20, P$16))(obs, { wait: wait, immediate: immediate });
			}

			var mixin$14 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleError: function _handleError(x) {
					var fn = this._fn;
					this._emitError(fn(x));
				}
			};

			var S$21 = createStream('mapErrors', mixin$14);
			var P$17 = createProperty('mapErrors', mixin$14);

			var id$5 = function id$5(x) {
				return x;
			};

			function mapErrors(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? id$5 : arguments[1];

				return new (obs._ofSameType(S$21, P$17))(obs, { fn: fn });
			}

			var mixin$15 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleError: function _handleError(x) {
					var fn = this._fn;
					if (fn(x)) {
						this._emitError(x);
					}
				}
			};

			var S$22 = createStream('filterErrors', mixin$15);
			var P$18 = createProperty('filterErrors', mixin$15);

			var id$6 = function id$6(x) {
				return x;
			};

			function filterErrors(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? id$6 : arguments[1];

				return new (obs._ofSameType(S$22, P$18))(obs, { fn: fn });
			}

			var mixin$16 = {
				_handleValue: function _handleValue() {}
			};

			var S$23 = createStream('ignoreValues', mixin$16);
			var P$19 = createProperty('ignoreValues', mixin$16);

			function ignoreValues(obs) {
				return new (obs._ofSameType(S$23, P$19))(obs);
			}

			var mixin$17 = {
				_handleError: function _handleError() {}
			};

			var S$24 = createStream('ignoreErrors', mixin$17);
			var P$20 = createProperty('ignoreErrors', mixin$17);

			function ignoreErrors(obs) {
				return new (obs._ofSameType(S$24, P$20))(obs);
			}

			var mixin$18 = {
				_handleEnd: function _handleEnd() {}
			};

			var S$25 = createStream('ignoreEnd', mixin$18);
			var P$21 = createProperty('ignoreEnd', mixin$18);

			function ignoreEnd(obs) {
				return new (obs._ofSameType(S$25, P$21))(obs);
			}

			var mixin$19 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleEnd: function _handleEnd() {
					var fn = this._fn;
					this._emitValue(fn());
					this._emitEnd();
				}
			};

			var S$26 = createStream('beforeEnd', mixin$19);
			var P$22 = createProperty('beforeEnd', mixin$19);

			function beforeEnd(obs, fn) {
				return new (obs._ofSameType(S$26, P$22))(obs, { fn: fn });
			}

			var mixin$20 = {
				_init: function _init(_ref) {
					var min = _ref.min;
					var max = _ref.max;

					this._max = max;
					this._min = min;
					this._buff = [];
				},
				_free: function _free() {
					this._buff = null;
				},
				_handleValue: function _handleValue(x) {
					this._buff = slide(this._buff, x, this._max);
					if (this._buff.length >= this._min) {
						this._emitValue(this._buff);
					}
				}
			};

			var S$27 = createStream('slidingWindow', mixin$20);
			var P$23 = createProperty('slidingWindow', mixin$20);

			function slidingWindow(obs, max) {
				var min = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

				return new (obs._ofSameType(S$27, P$23))(obs, { min: min, max: max });
			}

			var mixin$21 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;
					var flushOnEnd = _ref.flushOnEnd;

					this._fn = fn;
					this._flushOnEnd = flushOnEnd;
					this._buff = [];
				},
				_free: function _free() {
					this._buff = null;
				},
				_flush: function _flush() {
					if (this._buff !== null && this._buff.length !== 0) {
						this._emitValue(this._buff);
						this._buff = [];
					}
				},
				_handleValue: function _handleValue(x) {
					this._buff.push(x);
					var fn = this._fn;
					if (!fn(x)) {
						this._flush();
					}
				},
				_handleEnd: function _handleEnd() {
					if (this._flushOnEnd) {
						this._flush();
					}
					this._emitEnd();
				}
			};

			var S$28 = createStream('bufferWhile', mixin$21);
			var P$24 = createProperty('bufferWhile', mixin$21);

			var id$7 = function id$7(x) {
				return x;
			};

			function bufferWhile(obs, fn) {
				var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				var _ref2$flushOnEnd = _ref2.flushOnEnd;
				var flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

				return new (obs._ofSameType(S$28, P$24))(obs, { fn: fn || id$7, flushOnEnd: flushOnEnd });
			}

			var mixin$22 = {
				_init: function _init(_ref) {
					var count = _ref.count;
					var flushOnEnd = _ref.flushOnEnd;

					this._count = count;
					this._flushOnEnd = flushOnEnd;
					this._buff = [];
				},
				_free: function _free() {
					this._buff = null;
				},
				_flush: function _flush() {
					if (this._buff !== null && this._buff.length !== 0) {
						this._emitValue(this._buff);
						this._buff = [];
					}
				},
				_handleValue: function _handleValue(x) {
					this._buff.push(x);
					if (this._buff.length >= this._count) {
						this._flush();
					}
				},
				_handleEnd: function _handleEnd() {
					if (this._flushOnEnd) {
						this._flush();
					}
					this._emitEnd();
				}
			};

			var S$29 = createStream('bufferWithCount', mixin$22);
			var P$25 = createProperty('bufferWithCount', mixin$22);

			function bufferWhile$1(obs, count) {
				var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				var _ref2$flushOnEnd = _ref2.flushOnEnd;
				var flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

				return new (obs._ofSameType(S$29, P$25))(obs, { count: count, flushOnEnd: flushOnEnd });
			}

			var mixin$23 = {
				_init: function _init(_ref) {
					var _this = this;

					var wait = _ref.wait;
					var count = _ref.count;
					var flushOnEnd = _ref.flushOnEnd;

					this._wait = wait;
					this._count = count;
					this._flushOnEnd = flushOnEnd;
					this._intervalId = null;
					this._$onTick = function () {
						return _this._flush();
					};
					this._buff = [];
				},
				_free: function _free() {
					this._$onTick = null;
					this._buff = null;
				},
				_flush: function _flush() {
					if (this._buff !== null) {
						this._emitValue(this._buff);
						this._buff = [];
					}
				},
				_handleValue: function _handleValue(x) {
					this._buff.push(x);
					if (this._buff.length >= this._count) {
						clearInterval(this._intervalId);
						this._flush();
						this._intervalId = setInterval(this._$onTick, this._wait);
					}
				},
				_handleEnd: function _handleEnd() {
					if (this._flushOnEnd && this._buff.length !== 0) {
						this._flush();
					}
					this._emitEnd();
				},
				_onActivation: function _onActivation() {
					this._intervalId = setInterval(this._$onTick, this._wait);
					this._source.onAny(this._$handleAny); // copied from patterns/one-source
				},
				_onDeactivation: function _onDeactivation() {
					if (this._intervalId !== null) {
						clearInterval(this._intervalId);
						this._intervalId = null;
					}
					this._source.offAny(this._$handleAny); // copied from patterns/one-source
				}
			};

			var S$30 = createStream('bufferWithTimeOrCount', mixin$23);
			var P$26 = createProperty('bufferWithTimeOrCount', mixin$23);

			function bufferWithTimeOrCount(obs, wait, count) {
				var _ref2 = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

				var _ref2$flushOnEnd = _ref2.flushOnEnd;
				var flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;

				return new (obs._ofSameType(S$30, P$26))(obs, { wait: wait, count: count, flushOnEnd: flushOnEnd });
			}

			function xformForObs(obs) {
				return {
					'@@transducer/step': function transducerStep(res, input) {
						obs._emitValue(input);
						return null;
					},
					'@@transducer/result': function transducerResult() {
						obs._emitEnd();
						return null;
					}
				};
			}

			var mixin$24 = {
				_init: function _init(_ref) {
					var transducer = _ref.transducer;

					this._xform = transducer(xformForObs(this));
				},
				_free: function _free() {
					this._xform = null;
				},
				_handleValue: function _handleValue(x) {
					if (this._xform['@@transducer/step'](null, x) !== null) {
						this._xform['@@transducer/result'](null);
					}
				},
				_handleEnd: function _handleEnd() {
					this._xform['@@transducer/result'](null);
				}
			};

			var S$31 = createStream('transduce', mixin$24);
			var P$27 = createProperty('transduce', mixin$24);

			function transduce(obs, transducer) {
				return new (obs._ofSameType(S$31, P$27))(obs, { transducer: transducer });
			}

			var mixin$25 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._handler = fn;
					this._emitter = emitter(this);
				},
				_free: function _free() {
					this._handler = null;
					this._emitter = null;
				},
				_handleAny: function _handleAny(event) {
					this._handler(this._emitter, event);
				}
			};

			var S$32 = createStream('withHandler', mixin$25);
			var P$28 = createProperty('withHandler', mixin$25);

			function withHandler(obs, fn) {
				return new (obs._ofSameType(S$32, P$28))(obs, { fn: fn });
			}

			var isArray = Array.isArray || function (xs) {
				return Object.prototype.toString.call(xs) === '[object Array]';
			};

			function Zip(sources, combinator) {
				var _this = this;

				Stream.call(this);

				this._buffers = map(sources, function (source) {
					return isArray(source) ? cloneArray(source) : [];
				});
				this._sources = map(sources, function (source) {
					return isArray(source) ? never() : source;
				});

				this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
					return x;
				};
				this._aliveCount = 0;

				this._$handlers = [];

				var _loop = function _loop(i) {
					_this._$handlers.push(function (event) {
						return _this._handleAny(i, event);
					});
				};

				for (var i = 0; i < this._sources.length; i++) {
					_loop(i);
				}
			}

			inherit(Zip, Stream, {

				_name: 'zip',

				_onActivation: function _onActivation() {

					// if all sources are arrays
					while (this._isFull()) {
						this._emit();
					}

					var length = this._sources.length;
					this._aliveCount = length;
					for (var i = 0; i < length && this._active; i++) {
						this._sources[i].onAny(this._$handlers[i]);
					}
				},
				_onDeactivation: function _onDeactivation() {
					for (var i = 0; i < this._sources.length; i++) {
						this._sources[i].offAny(this._$handlers[i]);
					}
				},
				_emit: function _emit() {
					var values = new Array(this._buffers.length);
					for (var i = 0; i < this._buffers.length; i++) {
						values[i] = this._buffers[i].shift();
					}
					var combinator = this._combinator;
					this._emitValue(combinator(values));
				},
				_isFull: function _isFull() {
					for (var i = 0; i < this._buffers.length; i++) {
						if (this._buffers[i].length === 0) {
							return false;
						}
					}
					return true;
				},
				_handleAny: function _handleAny(i, event) {
					if (event.type === VALUE) {
						this._buffers[i].push(event.value);
						if (this._isFull()) {
							this._emit();
						}
					}
					if (event.type === ERROR) {
						this._emitError(event.value);
					}
					if (event.type === END) {
						this._aliveCount--;
						if (this._aliveCount === 0) {
							this._emitEnd();
						}
					}
				},
				_clear: function _clear() {
					Stream.prototype._clear.call(this);
					this._sources = null;
					this._buffers = null;
					this._combinator = null;
					this._$handlers = null;
				}
			});

			function zip(observables, combinator /* Function | falsey */) {
				return observables.length === 0 ? never() : new Zip(observables, combinator);
			}

			var id$8 = function id$8(x) {
				return x;
			};

			function AbstractPool() {
				var _this = this;

				var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				var _ref$queueLim = _ref.queueLim;
				var queueLim = _ref$queueLim === undefined ? 0 : _ref$queueLim;
				var _ref$concurLim = _ref.concurLim;
				var concurLim = _ref$concurLim === undefined ? -1 : _ref$concurLim;
				var _ref$drop = _ref.drop;
				var drop = _ref$drop === undefined ? 'new' : _ref$drop;

				Stream.call(this);

				this._queueLim = queueLim < 0 ? -1 : queueLim;
				this._concurLim = concurLim < 0 ? -1 : concurLim;
				this._drop = drop;
				this._queue = [];
				this._curSources = [];
				this._$handleSubAny = function (event) {
					return _this._handleSubAny(event);
				};
				this._$endHandlers = [];
				this._currentlyAdding = null;

				if (this._concurLim === 0) {
					this._emitEnd();
				}
			}

			inherit(AbstractPool, Stream, {

				_name: 'abstractPool',

				_add: function _add(obj, toObs /* Function | falsey */) {
					toObs = toObs || id$8;
					if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
						this._addToCur(toObs(obj));
					} else {
						if (this._queueLim === -1 || this._queue.length < this._queueLim) {
							this._addToQueue(toObs(obj));
						} else if (this._drop === 'old') {
							this._removeOldest();
							this._add(obj, toObs);
						}
					}
				},
				_addAll: function _addAll(obss) {
					var _this2 = this;

					forEach(obss, function (obs) {
						return _this2._add(obs);
					});
				},
				_remove: function _remove(obs) {
					if (this._removeCur(obs) === -1) {
						this._removeQueue(obs);
					}
				},
				_addToQueue: function _addToQueue(obs) {
					this._queue = concat(this._queue, [obs]);
				},
				_addToCur: function _addToCur(obs) {
					if (this._active) {

						// HACK:
						//
						// We have two optimizations for cases when `obs` is ended. We don't want
						// to add such observable to the list, but only want to emit events
						// from it (if it has some).
						//
						// Instead of this hacks, we could just did following,
						// but it would be 5-8 times slower:
						//
						//     this._curSources = concat(this._curSources, [obs]);
						//     this._subscribe(obs);
						//

						// #1
						// This one for cases when `obs` already ended
						// e.g., Kefir.constant() or Kefir.never()
						if (!obs._alive) {
							if (obs._currentEvent) {
								this._emit(obs._currentEvent.type, obs._currentEvent.value);
							}
							return;
						}

						// #2
						// This one is for cases when `obs` going to end synchronously on
						// first subscriber e.g., Kefir.stream(em => {em.emit(1); em.end()})
						this._currentlyAdding = obs;
						obs.onAny(this._$handleSubAny);
						this._currentlyAdding = null;
						if (obs._alive) {
							this._curSources = concat(this._curSources, [obs]);
							if (this._active) {
								this._subToEnd(obs);
							}
						}
					} else {
						this._curSources = concat(this._curSources, [obs]);
					}
				},
				_subToEnd: function _subToEnd(obs) {
					var _this3 = this;

					var onEnd = function onEnd() {
						return _this3._removeCur(obs);
					};
					this._$endHandlers.push({ obs: obs, handler: onEnd });
					obs.onEnd(onEnd);
				},
				_subscribe: function _subscribe(obs) {
					obs.onAny(this._$handleSubAny);

					// it can become inactive in responce of subscribing to `obs.onAny` above
					if (this._active) {
						this._subToEnd(obs);
					}
				},
				_unsubscribe: function _unsubscribe(obs) {
					obs.offAny(this._$handleSubAny);

					var onEndI = findByPred(this._$endHandlers, function (obj) {
						return obj.obs === obs;
					});
					if (onEndI !== -1) {
						obs.offEnd(this._$endHandlers[onEndI].handler);
						this._$endHandlers.splice(onEndI, 1);
					}
				},
				_handleSubAny: function _handleSubAny(event) {
					if (event.type === VALUE) {
						this._emitValue(event.value);
					} else if (event.type === ERROR) {
						this._emitError(event.value);
					}
				},
				_removeQueue: function _removeQueue(obs) {
					var index = find(this._queue, obs);
					this._queue = _remove(this._queue, index);
					return index;
				},
				_removeCur: function _removeCur(obs) {
					if (this._active) {
						this._unsubscribe(obs);
					}
					var index = find(this._curSources, obs);
					this._curSources = _remove(this._curSources, index);
					if (index !== -1) {
						if (this._queue.length !== 0) {
							this._pullQueue();
						} else if (this._curSources.length === 0) {
							this._onEmpty();
						}
					}
					return index;
				},
				_removeOldest: function _removeOldest() {
					this._removeCur(this._curSources[0]);
				},
				_pullQueue: function _pullQueue() {
					if (this._queue.length !== 0) {
						this._queue = cloneArray(this._queue);
						this._addToCur(this._queue.shift());
					}
				},
				_onActivation: function _onActivation() {
					for (var i = 0, sources = this._curSources; i < sources.length && this._active; i++) {
						this._subscribe(sources[i]);
					}
				},
				_onDeactivation: function _onDeactivation() {
					for (var i = 0, sources = this._curSources; i < sources.length; i++) {
						this._unsubscribe(sources[i]);
					}
					if (this._currentlyAdding !== null) {
						this._unsubscribe(this._currentlyAdding);
					}
				},
				_isEmpty: function _isEmpty() {
					return this._curSources.length === 0;
				},
				_onEmpty: function _onEmpty() {},
				_clear: function _clear() {
					Stream.prototype._clear.call(this);
					this._queue = null;
					this._curSources = null;
					this._$handleSubAny = null;
					this._$endHandlers = null;
				}
			});

			function Merge(sources) {
				AbstractPool.call(this);
				this._addAll(sources);
				this._initialised = true;
			}

			inherit(Merge, AbstractPool, {

				_name: 'merge',

				_onEmpty: function _onEmpty() {
					if (this._initialised) {
						this._emitEnd();
					}
				}
			});

			function merge(observables) {
				return observables.length === 0 ? never() : new Merge(observables);
			}

			function S$33(generator) {
				var _this = this;

				Stream.call(this);
				this._generator = generator;
				this._source = null;
				this._inLoop = false;
				this._iteration = 0;
				this._$handleAny = function (event) {
					return _this._handleAny(event);
				};
			}

			inherit(S$33, Stream, {

				_name: 'repeat',

				_handleAny: function _handleAny(event) {
					if (event.type === END) {
						this._source = null;
						this._getSource();
					} else {
						this._emit(event.type, event.value);
					}
				},
				_getSource: function _getSource() {
					if (!this._inLoop) {
						this._inLoop = true;
						var generator = this._generator;
						while (this._source === null && this._alive && this._active) {
							this._source = generator(this._iteration++);
							if (this._source) {
								this._source.onAny(this._$handleAny);
							} else {
								this._emitEnd();
							}
						}
						this._inLoop = false;
					}
				},
				_onActivation: function _onActivation() {
					if (this._source) {
						this._source.onAny(this._$handleAny);
					} else {
						this._getSource();
					}
				},
				_onDeactivation: function _onDeactivation() {
					if (this._source) {
						this._source.offAny(this._$handleAny);
					}
				},
				_clear: function _clear() {
					Stream.prototype._clear.call(this);
					this._generator = null;
					this._source = null;
					this._$handleAny = null;
				}
			});

			function repeat(generator) {
				return new S$33(generator);
			}

			function concat$1(observables) {
				return repeat(function (index) {
					return observables.length > index ? observables[index] : false;
				}).setName('concat');
			}

			function Pool() {
				AbstractPool.call(this);
			}

			inherit(Pool, AbstractPool, {

				_name: 'pool',

				plug: function plug(obs) {
					this._add(obs);
					return this;
				},
				unplug: function unplug(obs) {
					this._remove(obs);
					return this;
				}
			});

			function FlatMap(source, fn, options) {
				var _this = this;

				AbstractPool.call(this, options);
				this._source = source;
				this._fn = fn;
				this._mainEnded = false;
				this._lastCurrent = null;
				this._$handleMain = function (event) {
					return _this._handleMain(event);
				};
			}

			inherit(FlatMap, AbstractPool, {
				_onActivation: function _onActivation() {
					AbstractPool.prototype._onActivation.call(this);
					if (this._active) {
						this._source.onAny(this._$handleMain);
					}
				},
				_onDeactivation: function _onDeactivation() {
					AbstractPool.prototype._onDeactivation.call(this);
					this._source.offAny(this._$handleMain);
					this._hadNoEvSinceDeact = true;
				},
				_handleMain: function _handleMain(event) {

					if (event.type === VALUE) {
						// Is latest value before deactivation survived, and now is 'current' on this activation?
						// We don't want to handle such values, to prevent to constantly add
						// same observale on each activation/deactivation when our main source
						// is a `Kefir.conatant()` for example.
						var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
						if (!sameCurr) {
							this._add(event.value, this._fn);
						}
						this._lastCurrent = event.value;
						this._hadNoEvSinceDeact = false;
					}

					if (event.type === ERROR) {
						this._emitError(event.value);
					}

					if (event.type === END) {
						if (this._isEmpty()) {
							this._emitEnd();
						} else {
							this._mainEnded = true;
						}
					}
				},
				_onEmpty: function _onEmpty() {
					if (this._mainEnded) {
						this._emitEnd();
					}
				},
				_clear: function _clear() {
					AbstractPool.prototype._clear.call(this);
					this._source = null;
					this._lastCurrent = null;
					this._$handleMain = null;
				}
			});

			function FlatMapErrors(source, fn) {
				FlatMap.call(this, source, fn);
			}

			inherit(FlatMapErrors, FlatMap, {

				// Same as in FlatMap, only VALUE/ERROR flipped
				_handleMain: function _handleMain(event) {

					if (event.type === ERROR) {
						var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
						if (!sameCurr) {
							this._add(event.value, this._fn);
						}
						this._lastCurrent = event.value;
						this._hadNoEvSinceDeact = false;
					}

					if (event.type === VALUE) {
						this._emitValue(event.value);
					}

					if (event.type === END) {
						if (this._isEmpty()) {
							this._emitEnd();
						} else {
							this._mainEnded = true;
						}
					}
				}
			});

			function createConstructor$1(BaseClass, name) {
				return function AnonymousObservable(primary, secondary, options) {
					var _this = this;

					BaseClass.call(this);
					this._primary = primary;
					this._secondary = secondary;
					this._name = primary._name + '.' + name;
					this._lastSecondary = NOTHING;
					this._$handleSecondaryAny = function (event) {
						return _this._handleSecondaryAny(event);
					};
					this._$handlePrimaryAny = function (event) {
						return _this._handlePrimaryAny(event);
					};
					this._init(options);
				};
			}

			function createClassMethods$1(BaseClass) {
				return {
					_init: function _init() {},
					_free: function _free() {},
					_handlePrimaryValue: function _handlePrimaryValue(x) {
						this._emitValue(x);
					},
					_handlePrimaryError: function _handlePrimaryError(x) {
						this._emitError(x);
					},
					_handlePrimaryEnd: function _handlePrimaryEnd() {
						this._emitEnd();
					},
					_handleSecondaryValue: function _handleSecondaryValue(x) {
						this._lastSecondary = x;
					},
					_handleSecondaryError: function _handleSecondaryError(x) {
						this._emitError(x);
					},
					_handleSecondaryEnd: function _handleSecondaryEnd() {},
					_handlePrimaryAny: function _handlePrimaryAny(event) {
						switch (event.type) {
							case VALUE:
								return this._handlePrimaryValue(event.value);
							case ERROR:
								return this._handlePrimaryError(event.value);
							case END:
								return this._handlePrimaryEnd(event.value);
						}
					},
					_handleSecondaryAny: function _handleSecondaryAny(event) {
						switch (event.type) {
							case VALUE:
								return this._handleSecondaryValue(event.value);
							case ERROR:
								return this._handleSecondaryError(event.value);
							case END:
								this._handleSecondaryEnd(event.value);
								this._removeSecondary();
						}
					},
					_removeSecondary: function _removeSecondary() {
						if (this._secondary !== null) {
							this._secondary.offAny(this._$handleSecondaryAny);
							this._$handleSecondaryAny = null;
							this._secondary = null;
						}
					},
					_onActivation: function _onActivation() {
						if (this._secondary !== null) {
							this._secondary.onAny(this._$handleSecondaryAny);
						}
						if (this._active) {
							this._primary.onAny(this._$handlePrimaryAny);
						}
					},
					_onDeactivation: function _onDeactivation() {
						if (this._secondary !== null) {
							this._secondary.offAny(this._$handleSecondaryAny);
						}
						this._primary.offAny(this._$handlePrimaryAny);
					},
					_clear: function _clear() {
						BaseClass.prototype._clear.call(this);
						this._primary = null;
						this._secondary = null;
						this._lastSecondary = null;
						this._$handleSecondaryAny = null;
						this._$handlePrimaryAny = null;
						this._free();
					}
				};
			}

			function createStream$1(name, mixin) {
				var S = createConstructor$1(Stream, name);
				inherit(S, Stream, createClassMethods$1(Stream), mixin);
				return S;
			}

			function createProperty$1(name, mixin) {
				var P = createConstructor$1(Property, name);
				inherit(P, Property, createClassMethods$1(Property), mixin);
				return P;
			}

			var mixin$26 = {
				_handlePrimaryValue: function _handlePrimaryValue(x) {
					if (this._lastSecondary !== NOTHING && this._lastSecondary) {
						this._emitValue(x);
					}
				},
				_handleSecondaryEnd: function _handleSecondaryEnd() {
					if (this._lastSecondary === NOTHING || !this._lastSecondary) {
						this._emitEnd();
					}
				}
			};

			var S$34 = createStream$1('filterBy', mixin$26);
			var P$29 = createProperty$1('filterBy', mixin$26);

			function filterBy(primary, secondary) {
				return new (primary._ofSameType(S$34, P$29))(primary, secondary);
			}

			var id2 = function id2(_, x) {
				return x;
			};

			function sampledBy(passive, active, combinator) {
				var _combinator = combinator ? function (a, b) {
					return combinator(b, a);
				} : id2;
				return combine([active], [passive], _combinator).setName(passive, 'sampledBy');
			}

			var mixin$27 = {
				_handlePrimaryValue: function _handlePrimaryValue(x) {
					if (this._lastSecondary !== NOTHING) {
						this._emitValue(x);
					}
				},
				_handleSecondaryEnd: function _handleSecondaryEnd() {
					if (this._lastSecondary === NOTHING) {
						this._emitEnd();
					}
				}
			};

			var S$35 = createStream$1('skipUntilBy', mixin$27);
			var P$30 = createProperty$1('skipUntilBy', mixin$27);

			function skipUntilBy(primary, secondary) {
				return new (primary._ofSameType(S$35, P$30))(primary, secondary);
			}

			var mixin$28 = {
				_handleSecondaryValue: function _handleSecondaryValue() {
					this._emitEnd();
				}
			};

			var S$36 = createStream$1('takeUntilBy', mixin$28);
			var P$31 = createProperty$1('takeUntilBy', mixin$28);

			function takeUntilBy(primary, secondary) {
				return new (primary._ofSameType(S$36, P$31))(primary, secondary);
			}

			var mixin$29 = {
				_init: function _init() {
					var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

					var _ref$flushOnEnd = _ref.flushOnEnd;
					var flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;

					this._buff = [];
					this._flushOnEnd = flushOnEnd;
				},
				_free: function _free() {
					this._buff = null;
				},
				_flush: function _flush() {
					if (this._buff !== null) {
						this._emitValue(this._buff);
						this._buff = [];
					}
				},
				_handlePrimaryEnd: function _handlePrimaryEnd() {
					if (this._flushOnEnd) {
						this._flush();
					}
					this._emitEnd();
				},
				_onActivation: function _onActivation() {
					this._primary.onAny(this._$handlePrimaryAny);
					if (this._alive && this._secondary !== null) {
						this._secondary.onAny(this._$handleSecondaryAny);
					}
				},
				_handlePrimaryValue: function _handlePrimaryValue(x) {
					this._buff.push(x);
				},
				_handleSecondaryValue: function _handleSecondaryValue() {
					this._flush();
				},
				_handleSecondaryEnd: function _handleSecondaryEnd() {
					if (!this._flushOnEnd) {
						this._emitEnd();
					}
				}
			};

			var S$37 = createStream$1('bufferBy', mixin$29);
			var P$32 = createProperty$1('bufferBy', mixin$29);

			function bufferBy(primary, secondary, options /* optional */) {
				return new (primary._ofSameType(S$37, P$32))(primary, secondary, options);
			}

			var mixin$30 = {
				_init: function _init() {
					var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

					var _ref$flushOnEnd = _ref.flushOnEnd;
					var flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;
					var _ref$flushOnChange = _ref.flushOnChange;
					var flushOnChange = _ref$flushOnChange === undefined ? false : _ref$flushOnChange;

					this._buff = [];
					this._flushOnEnd = flushOnEnd;
					this._flushOnChange = flushOnChange;
				},
				_free: function _free() {
					this._buff = null;
				},
				_flush: function _flush() {
					if (this._buff !== null) {
						this._emitValue(this._buff);
						this._buff = [];
					}
				},
				_handlePrimaryEnd: function _handlePrimaryEnd() {
					if (this._flushOnEnd) {
						this._flush();
					}
					this._emitEnd();
				},
				_handlePrimaryValue: function _handlePrimaryValue(x) {
					this._buff.push(x);
					if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
						this._flush();
					}
				},
				_handleSecondaryEnd: function _handleSecondaryEnd() {
					if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
						this._emitEnd();
					}
				},
				_handleSecondaryValue: function _handleSecondaryValue(x) {
					if (this._flushOnChange && !x) {
						this._flush();
					}

					// from default _handleSecondaryValue
					this._lastSecondary = x;
				}
			};

			var S$38 = createStream$1('bufferWhileBy', mixin$30);
			var P$33 = createProperty$1('bufferWhileBy', mixin$30);

			function bufferWhileBy(primary, secondary, options /* optional */) {
				return new (primary._ofSameType(S$38, P$33))(primary, secondary, options);
			}

			var f = function f() {
				return false;
			};
			var t = function t() {
				return true;
			};

			function awaiting(a, b) {
				var result = merge([map$1(a, t), map$1(b, f)]);
				result = skipDuplicates(result);
				result = toProperty(result, f);
				return result.setName(a, 'awaiting');
			}

			var mixin$31 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleValue: function _handleValue(x) {
					var fn = this._fn;
					var result = fn(x);
					if (result.convert) {
						this._emitError(result.error);
					} else {
						this._emitValue(x);
					}
				}
			};

			var S$39 = createStream('valuesToErrors', mixin$31);
			var P$34 = createProperty('valuesToErrors', mixin$31);

			var defFn = function defFn(x) {
				return { convert: true, error: x };
			};

			function valuesToErrors(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? defFn : arguments[1];

				return new (obs._ofSameType(S$39, P$34))(obs, { fn: fn });
			}

			var mixin$32 = {
				_init: function _init(_ref) {
					var fn = _ref.fn;

					this._fn = fn;
				},
				_free: function _free() {
					this._fn = null;
				},
				_handleError: function _handleError(x) {
					var fn = this._fn;
					var result = fn(x);
					if (result.convert) {
						this._emitValue(result.value);
					} else {
						this._emitError(x);
					}
				}
			};

			var S$40 = createStream('errorsToValues', mixin$32);
			var P$35 = createProperty('errorsToValues', mixin$32);

			var defFn$1 = function defFn$1(x) {
				return { convert: true, value: x };
			};

			function errorsToValues(obs) {
				var fn = arguments.length <= 1 || arguments[1] === undefined ? defFn$1 : arguments[1];

				return new (obs._ofSameType(S$40, P$35))(obs, { fn: fn });
			}

			var mixin$33 = {
				_handleError: function _handleError(x) {
					this._emitError(x);
					this._emitEnd();
				}
			};

			var S$41 = createStream('endOnError', mixin$33);
			var P$36 = createProperty('endOnError', mixin$33);

			function endOnError(obs) {
				return new (obs._ofSameType(S$41, P$36))(obs);
			}

			Observable.prototype.toProperty = function (fn) {
				return toProperty(this, fn);
			};

			Observable.prototype.changes = function () {
				return changes(this);
			};

			Observable.prototype.toPromise = function (Promise) {
				return toPromise(this, Promise);
			};

			Observable.prototype.toESObservable = toESObservable;
			Observable.prototype[$$observable] = toESObservable;

			Observable.prototype.map = function (fn) {
				return map$1(this, fn);
			};

			Observable.prototype.filter = function (fn) {
				return filter(this, fn);
			};

			Observable.prototype.take = function (n) {
				return take(this, n);
			};

			Observable.prototype.takeErrors = function (n) {
				return takeErrors(this, n);
			};

			Observable.prototype.takeWhile = function (fn) {
				return takeWhile(this, fn);
			};

			Observable.prototype.last = function () {
				return last(this);
			};

			Observable.prototype.skip = function (n) {
				return skip(this, n);
			};

			Observable.prototype.skipWhile = function (fn) {
				return skipWhile(this, fn);
			};

			Observable.prototype.skipDuplicates = function (fn) {
				return skipDuplicates(this, fn);
			};

			Observable.prototype.diff = function (fn, seed) {
				return diff(this, fn, seed);
			};

			Observable.prototype.scan = function (fn, seed) {
				return scan(this, fn, seed);
			};

			Observable.prototype.flatten = function (fn) {
				return flatten(this, fn);
			};

			Observable.prototype.delay = function (wait) {
				return delay(this, wait);
			};

			Observable.prototype.throttle = function (wait, options) {
				return throttle(this, wait, options);
			};

			Observable.prototype.debounce = function (wait, options) {
				return debounce(this, wait, options);
			};

			Observable.prototype.mapErrors = function (fn) {
				return mapErrors(this, fn);
			};

			Observable.prototype.filterErrors = function (fn) {
				return filterErrors(this, fn);
			};

			Observable.prototype.ignoreValues = function () {
				return ignoreValues(this);
			};

			Observable.prototype.ignoreErrors = function () {
				return ignoreErrors(this);
			};

			Observable.prototype.ignoreEnd = function () {
				return ignoreEnd(this);
			};

			Observable.prototype.beforeEnd = function (fn) {
				return beforeEnd(this, fn);
			};

			Observable.prototype.slidingWindow = function (max, min) {
				return slidingWindow(this, max, min);
			};

			Observable.prototype.bufferWhile = function (fn, options) {
				return bufferWhile(this, fn, options);
			};

			Observable.prototype.bufferWithCount = function (count, options) {
				return bufferWhile$1(this, count, options);
			};

			Observable.prototype.bufferWithTimeOrCount = function (wait, count, options) {
				return bufferWithTimeOrCount(this, wait, count, options);
			};

			Observable.prototype.transduce = function (transducer) {
				return transduce(this, transducer);
			};

			Observable.prototype.withHandler = function (fn) {
				return withHandler(this, fn);
			};

			Observable.prototype.combine = function (other, combinator) {
				return combine([this, other], combinator);
			};

			Observable.prototype.zip = function (other, combinator) {
				return zip([this, other], combinator);
			};

			Observable.prototype.merge = function (other) {
				return merge([this, other]);
			};

			Observable.prototype.concat = function (other) {
				return concat$1([this, other]);
			};

			var pool = function pool() {
				return new Pool();
			};

			Observable.prototype.flatMap = function (fn) {
				return new FlatMap(this, fn).setName(this, 'flatMap');
			};
			Observable.prototype.flatMapLatest = function (fn) {
				return new FlatMap(this, fn, { concurLim: 1, drop: 'old' }).setName(this, 'flatMapLatest');
			};
			Observable.prototype.flatMapFirst = function (fn) {
				return new FlatMap(this, fn, { concurLim: 1 }).setName(this, 'flatMapFirst');
			};
			Observable.prototype.flatMapConcat = function (fn) {
				return new FlatMap(this, fn, { queueLim: -1, concurLim: 1 }).setName(this, 'flatMapConcat');
			};
			Observable.prototype.flatMapConcurLimit = function (fn, limit) {
				return new FlatMap(this, fn, { queueLim: -1, concurLim: limit }).setName(this, 'flatMapConcurLimit');
			};

			Observable.prototype.flatMapErrors = function (fn) {
				return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
			};

			Observable.prototype.filterBy = function (other) {
				return filterBy(this, other);
			};

			Observable.prototype.sampledBy = function (other, combinator) {
				return sampledBy(this, other, combinator);
			};

			Observable.prototype.skipUntilBy = function (other) {
				return skipUntilBy(this, other);
			};

			Observable.prototype.takeUntilBy = function (other) {
				return takeUntilBy(this, other);
			};

			Observable.prototype.bufferBy = function (other, options) {
				return bufferBy(this, other, options);
			};

			Observable.prototype.bufferWhileBy = function (other, options) {
				return bufferWhileBy(this, other, options);
			};

			// Deprecated
			// -----------------------------------------------------------------------------

			var DEPRECATION_WARNINGS = true;
			function dissableDeprecationWarnings() {
				DEPRECATION_WARNINGS = false;
			}

			function warn(msg) {
				if (DEPRECATION_WARNINGS && console && typeof console.warn === 'function') {
					var msg2 = '\nHere is an Error object for you containing the call stack:';
					console.warn(msg, msg2, new Error());
				}
			}

			Observable.prototype.awaiting = function (other) {
				warn('You are using deprecated .awaiting() method, see https://github.com/rpominov/kefir/issues/145');
				return awaiting(this, other);
			};

			Observable.prototype.valuesToErrors = function (fn) {
				warn('You are using deprecated .valuesToErrors() method, see https://github.com/rpominov/kefir/issues/149');
				return valuesToErrors(this, fn);
			};

			Observable.prototype.errorsToValues = function (fn) {
				warn('You are using deprecated .errorsToValues() method, see https://github.com/rpominov/kefir/issues/149');
				return errorsToValues(this, fn);
			};

			Observable.prototype.endOnError = function () {
				warn('You are using deprecated .endOnError() method, see https://github.com/rpominov/kefir/issues/150');
				return endOnError(this);
			};

			// Exports
			// --------------------------------------------------------------------------

			var Kefir = { Observable: Observable, Stream: Stream, Property: Property, never: never, later: later, interval: interval, sequentially: sequentially,
				fromPoll: fromPoll, withInterval: withInterval, fromCallback: fromCallback, fromNodeCallback: fromNodeCallback, fromEvents: fromEvents, stream: stream,
				constant: constant, constantError: constantError, fromPromise: fromPromise, fromESObservable: fromESObservable, combine: combine, zip: zip, merge: merge,
				concat: concat$1, Pool: Pool, pool: pool, repeat: repeat, staticLand: staticLand };

			Kefir.Kefir = Kefir;

			exports.dissableDeprecationWarnings = dissableDeprecationWarnings;
			exports.Kefir = Kefir;
			exports.Observable = Observable;
			exports.Stream = Stream;
			exports.Property = Property;
			exports.never = never;
			exports.later = later;
			exports.interval = interval;
			exports.sequentially = sequentially;
			exports.fromPoll = fromPoll;
			exports.withInterval = withInterval;
			exports.fromCallback = fromCallback;
			exports.fromNodeCallback = fromNodeCallback;
			exports.fromEvents = fromEvents;
			exports.stream = stream;
			exports.constant = constant;
			exports.constantError = constantError;
			exports.fromPromise = fromPromise;
			exports.fromESObservable = fromESObservable;
			exports.combine = combine;
			exports.zip = zip;
			exports.merge = merge;
			exports.concat = concat$1;
			exports.Pool = Pool;
			exports.pool = pool;
			exports.repeat = repeat;
			exports.staticLand = staticLand;
			exports['default'] = Kefir;

			Object.defineProperty(exports, '__esModule', { value: true });
		});
	});

	var Kefir = interopDefault(kefir);

	function eventsPositionDiff(prevEvent, nextEvent) {
	  //console.log(prevEvent,nextEvent);
	  if (nextEvent.touches) {
	    nextEvent = nextEvent.touches[0];
	  }
	  if (prevEvent.touches) {
	    prevEvent = prevEvent.touches[0];
	  }
	  return {
	    x: nextEvent.clientX - prevEvent.clientX,
	    y: nextEvent.clientY - prevEvent.clientY
	  };
	}

	function applyMove(currentPosition, move) {
	  //console.log(move);
	  return {
	    x: currentPosition.x + move.x,
	    y: currentPosition.y + move.y
	  };
	}
	var preventDefault = function preventDefault(event) {
	  event.preventDefault();
	};
	function startDragging(elem, timeout) {
	  timeout = timeout ? timeout : 200;
	  setTimeout(function () {
	    // console.log(elem.style.left,elem.style.top)
	    elem.style.cursor = 'move';
	    elem.style.userSelect = 'none';

	    var drag = function drag(pos) {
	      elem.style.top = pos.y + 'px';
	      elem.style.left = pos.x + 'px';
	    };

	    var mouseUps = Kefir.fromEvents(document, 'mouseup').merge(Kefir.fromEvents(document, 'touchend'));
	    var mouseMoves = Kefir.fromEvents(document, 'mousemove').merge(Kefir.fromEvents(document, 'touchmove'));
	    var mouseDowns = Kefir.fromEvents(elem, 'mousedown').merge(Kefir.fromEvents(elem, 'touchstart'));
	    mouseDowns.onValue(preventDefault);

	    var moves = mouseDowns.flatMap(function (downEvent) {
	      return mouseMoves.takeUntilBy(mouseUps).diff(eventsPositionDiff, downEvent);
	    });
	    var rect = elem.getBoundingClientRect();
	    var style = window.getComputedStyle(elem);
	    // console.log(style);
	    var currentPosition = { x: parseInt(rect.left) - parseInt(style.marginLeft),
	      y: parseInt(rect.top) - parseInt(style.marginTop) };
	    // console.log(currentPosition);
	    var position = moves.scan(applyMove, currentPosition);

	    setTimeout(function () {
	      elem.style.position = "absolute";
	      position.onValue(drag);
	    }, timeout);

	    elem[stopDragging] = function () {
	      elem.style.cursor = 'default';
	      elem.style.userSelect = 'default';
	      position.offValue(drag);
	      mouseDowns.offValue(preventDefault);
	    };
	  }, 50);
	}

	function stopDragging(elem) {
	  elem[stopDragging]();
	}

	var draggableHostStyle = ':host {\n  cursor: move;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  position: relative;\n}';

	var css = ' :host {display: inline-table} handle-box {display: inline-table}';

	var HandleBox = define$1("handle-box", {
	  attached: function attached(elem) {
	    startDragging(elem);
	  },
	  detached: function detached(elem) {
	    stopDragging(elem);
	  },
	  render: function render(elem) {
	    return [h("slot", ""), h("style", draggableHostStyle + css)];
	  },
	  rendered: function rendered(elem) {}
	});

	var reattacher = Symbol();

	function detach(elem, timeout) {
	  timeout = timeout ? timeout : 200;
	  setTimeout(function () {
	    var rect = elem.getBoundingClientRect();
	    var style = window.getComputedStyle(elem);
	    var oldStyle = elem.style;
	    // console.log(style);
	    var currentPosition = { x: parseInt(rect.left) - parseInt(style.marginLeft),
	      y: parseInt(rect.top) - parseInt(style.marginTop) };

	    setTimeout(function () {
	      elem.style.position = "absolute";
	      elem.style.top = currentPosition.y + 'px';
	      elem.style.left = currentPosition.x + 'px';
	    }, timeout);

	    elem[reattacher] = function () {
	      elem.style = oldStyle;
	    };
	  }, 50);
	}

	function reattach(elem) {
	  elem[reattacher]();
	}

	var css$1 = ' :host {display: inline-table} loose-box {display: inline-table}';

	var DetachedBox = define$1("detached-box", {
	  attached: function attached(elem) {
	    detach(elem);
	  },
	  detached: function detached(elem) {
	    reattach(elem);
	  },
	  render: function render(elem) {
	    return [h("slot", ""), h("style", css$1)];
	  },
	  rendered: function rendered(elem) {}
	});

	// from http://stackoverflow.com/a/38149758/1189799

	var parentSelector = function parentSelector(el, selector, stopSelector) {
	  var retval = null;
	  while (el) {
	    if (el.matches(selector)) {
	      retval = el;
	      break;
	    } else if (stopSelector && el.matches(stopSelector)) {
	      break;
	    }
	    el = el.parentElement;
	  }
	  return retval;
	};

	var animate = function animate(elem) {
	  elem.dispatchEvent(new Event('animate'));
	  setTimeout(function () {
	    window.requestAnimationFrame(function () {
	      animate(elem);
	    });
	  }, 1000 / elem.fps);
	};

	var css$2 = 'graph-container, :host {display: inline-table}';

	var GraphContainer = define$1('graph-container', {
	  props: {
	    fps: { attribute: true, default: 120 }
	  },
	  attached: function attached(elem) {
	    animate(elem);
	  },
	  attributeChanged: function attributeChanged(elem) {},
	  render: function render(elem) {
	    return [h('slot', {
	      onSlotchange: function onSlotchange(e) {
	        elem.dispatchEvent(new Event("graph-updated"));
	      }
	    }), h('style', css$2)];
	  },
	  updated: function updated(elem) {
	    // console.log("updated")
	    return true;
	  }
	});

	function parentGraphContainer(elem) {
	  return parentSelector(elem, 'graph-container');
	}

	var xhtml = "http://www.w3.org/1999/xhtml";

	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace (name) {
	  var prefix = name += "",
	      i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
	}

	function creatorInherit(name) {
	  return function () {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function () {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator (name) {
	  var fullname = namespace(name);
	  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
	}

	var matcher = function matcher(selector) {
	  return function () {
	    return this.matches(selector);
	  };
	};

	if (typeof document !== "undefined") {
	  var element$1 = document.documentElement;
	  if (!element$1.matches) {
	    var vendorMatches = element$1.webkitMatchesSelector || element$1.msMatchesSelector || element$1.mozMatchesSelector || element$1.oMatchesSelector;
	    matcher = function matcher(selector) {
	      return function () {
	        return vendorMatches.call(this, selector);
	      };
	    };
	  }
	}

	var matcher$1 = matcher;

	var filterEvents = {};

	var event = null;

	if (typeof document !== "undefined") {
	  var element$2 = document.documentElement;
	  if (!("onmouseenter" in element$2)) {
	    filterEvents = { mouseenter: "mouseover", mouseleave: "mouseout" };
	  }
	}

	function filterContextListener(listener, index, group) {
	  listener = contextListener(listener, index, group);
	  return function (event) {
	    var related = event.relatedTarget;
	    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
	      listener.call(this, event);
	    }
	  };
	}

	function contextListener(listener, index, group) {
	  return function (event1) {
	    var event0 = event; // Events can be reentrant (e.g., focus).
	    event = event1;
	    try {
	      listener.call(this, this.__data__, index, group);
	    } finally {
	      event = event0;
	    }
	  };
	}

	function parseTypenames(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function (t) {
	    var name = "",
	        i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return { type: t, name: name };
	  });
	}

	function onRemove(typename) {
	  return function () {
	    var on = this.__on;
	    if (!on) return;
	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	      } else {
	        on[++i] = o;
	      }
	    }
	    if (++i) on.length = i;else delete this.__on;
	  };
	}

	function onAdd(typename, value, capture) {
	  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
	  return function (d, i, group) {
	    var on = this.__on,
	        o,
	        listener = wrap(value, i, group);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, capture);
	    o = { type: typename.type, name: typename.name, value: value, listener: listener, capture: capture };
	    if (!on) this.__on = [o];else on.push(o);
	  };
	}

	function selection_on (typename, value, capture) {
	  var typenames = parseTypenames(typename + ""),
	      i,
	      n = typenames.length,
	      t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;
	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd : onRemove;
	  if (capture == null) capture = false;
	  for (i = 0; i < n; ++i) {
	    this.each(on(typenames[i], value, capture));
	  }return this;
	}

	function none() {}

	function selector (selector) {
	  return selector == null ? none : function () {
	    return this.querySelector(selector);
	  };
	}

	function selection_select (select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function empty$1() {
	  return [];
	}

	function selectorAll (selector) {
	  return selector == null ? empty$1 : function () {
	    return this.querySelectorAll(selector);
	  };
	}

	function selection_selectAll (select) {
	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, parents);
	}

	function selection_filter (match) {
	  if (typeof match !== "function") match = matcher$1(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function sparse (update) {
	  return new Array(update.length);
	}

	function selection_enter () {
	  return new Selection(this._enter || this._groups.map(sparse), this._parents);
	}

	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function appendChild(child) {
	    return this._parent.insertBefore(child, this._next);
	  },
	  insertBefore: function insertBefore(child, next) {
	    return this._parent.insertBefore(child, next);
	  },
	  querySelector: function querySelector(selector) {
	    return this._parent.querySelector(selector);
	  },
	  querySelectorAll: function querySelectorAll(selector) {
	    return this._parent.querySelectorAll(selector);
	  }
	};

	function constant (x) {
	  return function () {
	    return x;
	  };
	}

	var keyPrefix = "$"; // Protect against keys like “__proto__”.

	function bindIndex(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length;

	  // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.
	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = {},
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue;

	  // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
	      if (keyValue in nodeByKeyValue) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue[keyValue] = node;
	      }
	    }
	  }

	  // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.
	  for (i = 0; i < dataLength; ++i) {
	    keyValue = keyPrefix + key.call(parent, data[i], i, data);
	    if (node = nodeByKeyValue[keyValue]) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue[keyValue] = null;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
	      exit[i] = node;
	    }
	  }
	}

	function selection_data (value, key) {
	  if (!value) {
	    data = new Array(this.size()), j = -1;
	    this.each(function (d) {
	      data[++j] = d;
	    });
	    return data;
	  }

	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = value.call(parent, parent && parent.__data__, j, parents),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);

	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	    // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.
	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;
	        while (!(next = updateGroup[i1]) && ++i1 < dataLength) {}
	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	}

	function selection_exit () {
	  return new Selection(this._exit || this._groups.map(sparse), this._parents);
	}

	function selection_merge (selection) {

	  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection(merges, this._parents);
	}

	function selection_order () {

	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	}

	function selection_sort (compare) {
	  if (!compare) compare = ascending;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }
	    sortgroup.sort(compareNode);
	  }

	  return new Selection(sortgroups, this._parents).order();
	}

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call () {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes () {
	  var nodes = new Array(this.size()),
	      i = -1;
	  this.each(function () {
	    nodes[++i] = this;
	  });
	  return nodes;
	}

	function selection_node () {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size () {
	  var size = 0;
	  this.each(function () {
	    ++size;
	  });
	  return size;
	}

	function selection_empty () {
	  return !this.node();
	}

	function selection_each (callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove(name) {
	  return function () {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function () {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, value) {
	  return function () {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS(fullname, value) {
	  return function () {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction(name, value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS(fullname, value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr (name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
	  }

	  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
	}

	function defaultView (node) {
	    return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
	    node.document && node // node is a Window
	    || node.defaultView; // node is a Document
	}

	function styleRemove(name) {
	  return function () {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, value, priority) {
	  return function () {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction(name, value, priority) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style (name, value, priority) {
	  var node;
	  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : defaultView(node = this.node()).getComputedStyle(node, null).getPropertyValue(name);
	}

	function propertyRemove(name) {
	  return function () {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function () {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];else this[name] = v;
	  };
	}

	function selection_property (name, value) {
	  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
	}

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
	  add: function add(name) {
	    var i = this._names.indexOf(name);
	    if (i < 0) {
	      this._names.push(name);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function remove(name) {
	    var i = this._names.indexOf(name);
	    if (i >= 0) {
	      this._names.splice(i, 1);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function contains(name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd(node, names) {
	  var list = classList(node),
	      i = -1,
	      n = names.length;
	  while (++i < n) {
	    list.add(names[i]);
	  }
	}

	function classedRemove(node, names) {
	  var list = classList(node),
	      i = -1,
	      n = names.length;
	  while (++i < n) {
	    list.remove(names[i]);
	  }
	}

	function classedTrue(names) {
	  return function () {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function () {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function () {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	function selection_classed (name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()),
	        i = -1,
	        n = names.length;
	    while (++i < n) {
	      if (!list.contains(names[i])) return false;
	    }return true;
	  }

	  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
	}

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant(value) {
	  return function () {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text (value) {
	  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
	}

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function () {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function () {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html (value) {
	  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
	}

	function raise() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise () {
	  return this.each(raise);
	}

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower () {
	  return this.each(lower);
	}

	function selection_append (name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function () {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull() {
	  return null;
	}

	function selection_insert (name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function () {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove () {
	  return this.each(remove);
	}

	function selection_datum (value) {
	    return arguments.length ? this.property("__data__", value) : this.node().__data__;
	}

	function dispatchEvent(node, type, params) {
	  var window = defaultView(node),
	      event = window.CustomEvent;

	  if (event) {
	    event = new event(type, params);
	  } else {
	    event = window.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant(type, params) {
	  return function () {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function () {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch (type, params) {
	  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
	}

	var root = [null];

	function Selection(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection([[document.documentElement]], root);
	}

	Selection.prototype = selection.prototype = {
	  constructor: Selection,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  merge: selection_merge,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch
	};

	function selectAll (selector) {
	    return typeof selector === "string" ? new Selection([document.querySelectorAll(selector)], [document.documentElement]) : new Selection([selector == null ? [] : selector], root);
	}

	var epsilon$1 = 1e-12;

	var sqrt3 = Math.sqrt(3);

	var triangle = {
	  draw: function draw(context, size) {
	    var y = -Math.sqrt(size / (sqrt3 * 3));
	    context.moveTo(0, y * 2);
	    context.lineTo(-sqrt3 * y, -y);
	    context.lineTo(sqrt3 * y, -y);
	    context.closePath();
	  }
	};

	function noop$1 () {}

	function _point(that, x, y) {
	  that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
	}

	function Basis(context) {
	  this._context = context;
	}

	Basis.prototype = {
	  areaStart: function areaStart() {
	    this._line = 0;
	  },
	  areaEnd: function areaEnd() {
	    this._line = NaN;
	  },
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    switch (this._point) {
	      case 3:
	        _point(this, this._x1, this._y1); // proceed
	      case 2:
	        this._context.lineTo(this._x1, this._y1);break;
	    }
	    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0:
	        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
	      case 1:
	        this._point = 2;break;
	      case 2:
	        this._point = 3;this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
	      default:
	        _point(this, x, y);break;
	    }
	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	  }
	};

	function Bundle(context, beta) {
	  this._basis = new Basis(context);
	  this._beta = beta;
	}

	Bundle.prototype = {
	  lineStart: function lineStart() {
	    this._x = [];
	    this._y = [];
	    this._basis.lineStart();
	  },
	  lineEnd: function lineEnd() {
	    var x = this._x,
	        y = this._y,
	        j = x.length - 1;

	    if (j > 0) {
	      var x0 = x[0],
	          y0 = y[0],
	          dx = x[j] - x0,
	          dy = y[j] - y0,
	          i = -1,
	          t;

	      while (++i <= j) {
	        t = i / j;
	        this._basis.point(this._beta * x[i] + (1 - this._beta) * (x0 + t * dx), this._beta * y[i] + (1 - this._beta) * (y0 + t * dy));
	      }
	    }

	    this._x = this._y = null;
	    this._basis.lineEnd();
	  },
	  point: function point(x, y) {
	    this._x.push(+x);
	    this._y.push(+y);
	  }
	};

	(function custom(beta) {

	  function bundle(context) {
	    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
	  }

	  bundle.beta = function (beta) {
	    return custom(+beta);
	  };

	  return bundle;
	})(0.85);

	function _point$1(that, x, y) {
	  that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
	}

	function Cardinal(context, tension) {
	  this._context = context;
	  this._k = (1 - tension) / 6;
	}

	Cardinal.prototype = {
	  areaStart: function areaStart() {
	    this._line = 0;
	  },
	  areaEnd: function areaEnd() {
	    this._line = NaN;
	  },
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    switch (this._point) {
	      case 2:
	        this._context.lineTo(this._x2, this._y2);break;
	      case 3:
	        _point$1(this, this._x1, this._y1);break;
	    }
	    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0:
	        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
	      case 1:
	        this._point = 2;this._x1 = x, this._y1 = y;break;
	      case 2:
	        this._point = 3; // proceed
	      default:
	        _point$1(this, x, y);break;
	    }
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	(function custom(tension) {

	  function cardinal(context) {
	    return new Cardinal(context, tension);
	  }

	  cardinal.tension = function (tension) {
	    return custom(+tension);
	  };

	  return cardinal;
	})(0);

	function CardinalClosed(context, tension) {
	  this._context = context;
	  this._k = (1 - tension) / 6;
	}

	CardinalClosed.prototype = {
	  areaStart: noop$1,
	  areaEnd: noop$1,
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    switch (this._point) {
	      case 1:
	        {
	          this._context.moveTo(this._x3, this._y3);
	          this._context.closePath();
	          break;
	        }
	      case 2:
	        {
	          this._context.lineTo(this._x3, this._y3);
	          this._context.closePath();
	          break;
	        }
	      case 3:
	        {
	          this.point(this._x3, this._y3);
	          this.point(this._x4, this._y4);
	          this.point(this._x5, this._y5);
	          break;
	        }
	    }
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0:
	        this._point = 1;this._x3 = x, this._y3 = y;break;
	      case 1:
	        this._point = 2;this._context.moveTo(this._x4 = x, this._y4 = y);break;
	      case 2:
	        this._point = 3;this._x5 = x, this._y5 = y;break;
	      default:
	        _point$1(this, x, y);break;
	    }
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	(function custom(tension) {

	  function cardinal(context) {
	    return new CardinalClosed(context, tension);
	  }

	  cardinal.tension = function (tension) {
	    return custom(+tension);
	  };

	  return cardinal;
	})(0);

	function CardinalOpen(context, tension) {
	  this._context = context;
	  this._k = (1 - tension) / 6;
	}

	CardinalOpen.prototype = {
	  areaStart: function areaStart() {
	    this._line = 0;
	  },
	  areaEnd: function areaEnd() {
	    this._line = NaN;
	  },
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0:
	        this._point = 1;break;
	      case 1:
	        this._point = 2;break;
	      case 2:
	        this._point = 3;this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);break;
	      case 3:
	        this._point = 4; // proceed
	      default:
	        _point$1(this, x, y);break;
	    }
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	(function custom(tension) {

	  function cardinal(context) {
	    return new CardinalOpen(context, tension);
	  }

	  cardinal.tension = function (tension) {
	    return custom(+tension);
	  };

	  return cardinal;
	})(0);

	function _point$2(that, x, y) {
	  var x1 = that._x1,
	      y1 = that._y1,
	      x2 = that._x2,
	      y2 = that._y2;

	  if (that._l01_a > epsilon$1) {
	    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
	        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
	    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
	    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
	  }

	  if (that._l23_a > epsilon$1) {
	    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
	        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
	    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
	    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
	  }

	  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
	}

	function CatmullRom(context, alpha) {
	  this._context = context;
	  this._alpha = alpha;
	}

	CatmullRom.prototype = {
	  areaStart: function areaStart() {
	    this._line = 0;
	  },
	  areaEnd: function areaEnd() {
	    this._line = NaN;
	  },
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
	    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    switch (this._point) {
	      case 2:
	        this._context.lineTo(this._x2, this._y2);break;
	      case 3:
	        this.point(this._x2, this._y2);break;
	    }
	    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;

	    if (this._point) {
	      var x23 = this._x2 - x,
	          y23 = this._y2 - y;
	      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
	    }

	    switch (this._point) {
	      case 0:
	        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
	      case 1:
	        this._point = 2;break;
	      case 2:
	        this._point = 3; // proceed
	      default:
	        _point$2(this, x, y);break;
	    }

	    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
	    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	(function custom(alpha) {

	  function catmullRom(context) {
	    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
	  }

	  catmullRom.alpha = function (alpha) {
	    return custom(+alpha);
	  };

	  return catmullRom;
	})(0.5);

	function CatmullRomClosed(context, alpha) {
	  this._context = context;
	  this._alpha = alpha;
	}

	CatmullRomClosed.prototype = {
	  areaStart: noop$1,
	  areaEnd: noop$1,
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
	    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    switch (this._point) {
	      case 1:
	        {
	          this._context.moveTo(this._x3, this._y3);
	          this._context.closePath();
	          break;
	        }
	      case 2:
	        {
	          this._context.lineTo(this._x3, this._y3);
	          this._context.closePath();
	          break;
	        }
	      case 3:
	        {
	          this.point(this._x3, this._y3);
	          this.point(this._x4, this._y4);
	          this.point(this._x5, this._y5);
	          break;
	        }
	    }
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;

	    if (this._point) {
	      var x23 = this._x2 - x,
	          y23 = this._y2 - y;
	      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
	    }

	    switch (this._point) {
	      case 0:
	        this._point = 1;this._x3 = x, this._y3 = y;break;
	      case 1:
	        this._point = 2;this._context.moveTo(this._x4 = x, this._y4 = y);break;
	      case 2:
	        this._point = 3;this._x5 = x, this._y5 = y;break;
	      default:
	        _point$2(this, x, y);break;
	    }

	    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
	    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	(function custom(alpha) {

	  function catmullRom(context) {
	    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
	  }

	  catmullRom.alpha = function (alpha) {
	    return custom(+alpha);
	  };

	  return catmullRom;
	})(0.5);

	function CatmullRomOpen(context, alpha) {
	  this._context = context;
	  this._alpha = alpha;
	}

	CatmullRomOpen.prototype = {
	  areaStart: function areaStart() {
	    this._line = 0;
	  },
	  areaEnd: function areaEnd() {
	    this._line = NaN;
	  },
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
	    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;

	    if (this._point) {
	      var x23 = this._x2 - x,
	          y23 = this._y2 - y;
	      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
	    }

	    switch (this._point) {
	      case 0:
	        this._point = 1;break;
	      case 1:
	        this._point = 2;break;
	      case 2:
	        this._point = 3;this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);break;
	      case 3:
	        this._point = 4; // proceed
	      default:
	        _point$2(this, x, y);break;
	    }

	    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
	    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
	    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
	    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
	  }
	};

	(function custom(alpha) {

	  function catmullRom(context) {
	    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
	  }

	  catmullRom.alpha = function (alpha) {
	    return custom(+alpha);
	  };

	  return catmullRom;
	})(0.5);

	function sign(x) {
	  return x < 0 ? -1 : 1;
	}

	// Calculate the slopes of the tangents (Hermite-type interpolation) based on
	// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
	// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
	// NOV(II), P. 443, 1990.
	function slope3(that, x2, y2) {
	  var h0 = that._x1 - that._x0,
	      h1 = x2 - that._x1,
	      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
	      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
	      p = (s0 * h1 + s1 * h0) / (h0 + h1);
	  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
	}

	// Calculate a one-sided slope.
	function slope2(that, t) {
	  var h = that._x1 - that._x0;
	  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
	}

	// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
	// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
	// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
	function _point$3(that, t0, t1) {
	  var x0 = that._x0,
	      y0 = that._y0,
	      x1 = that._x1,
	      y1 = that._y1,
	      dx = (x1 - x0) / 3;
	  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
	}

	function MonotoneX(context) {
	  this._context = context;
	}

	MonotoneX.prototype = {
	  areaStart: function areaStart() {
	    this._line = 0;
	  },
	  areaEnd: function areaEnd() {
	    this._line = NaN;
	  },
	  lineStart: function lineStart() {
	    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    switch (this._point) {
	      case 2:
	        this._context.lineTo(this._x1, this._y1);break;
	      case 3:
	        _point$3(this, this._t0, slope2(this, this._t0));break;
	    }
	    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function point(x, y) {
	    var t1 = NaN;

	    x = +x, y = +y;
	    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
	    switch (this._point) {
	      case 0:
	        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
	      case 1:
	        this._point = 2;break;
	      case 2:
	        this._point = 3;_point$3(this, slope2(this, t1 = slope3(this, x, y)), t1);break;
	      default:
	        _point$3(this, this._t0, t1 = slope3(this, x, y));break;
	    }

	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	    this._t0 = t1;
	  }
	};

	function MonotoneY(context) {
	  this._context = new ReflectContext(context);
	}

	(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
	  MonotoneX.prototype.point.call(this, y, x);
	};

	function ReflectContext(context) {
	  this._context = context;
	}

	ReflectContext.prototype = {
	  moveTo: function moveTo(x, y) {
	    this._context.moveTo(y, x);
	  },
	  closePath: function closePath() {
	    this._context.closePath();
	  },
	  lineTo: function lineTo(x, y) {
	    this._context.lineTo(y, x);
	  },
	  bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
	    this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
	  }
	};

	var combinatorics = createCommonjsModule(function (module, exports) {
	    /*
	     * $Id: combinatorics.js,v 0.25 2013/03/11 15:42:14 dankogai Exp dankogai $
	     *
	     *  Licensed under the MIT license.
	     *  http://www.opensource.org/licenses/mit-license.php
	     *
	     *  References:
	     *    http://www.ruby-doc.org/core-2.0/Array.html#method-i-combination
	     *    http://www.ruby-doc.org/core-2.0/Array.html#method-i-permutation
	     *    http://en.wikipedia.org/wiki/Factorial_number_system
	     */
	    (function (root, factory) {
	        if (typeof define === 'function' && define.amd) {
	            define([], factory);
	        } else if ((typeof exports === 'undefined' ? 'undefined' : babelHelpers.typeof(exports)) === 'object') {
	            module.exports = factory();
	        } else {
	            root.Combinatorics = factory();
	        }
	    })(commonjsGlobal, function () {
	        'use strict';

	        var version = "0.5.2";
	        /* combinatory arithmetics */
	        var P = function P(m, n) {
	            var p = 1;
	            while (n--) {
	                p *= m--;
	            }return p;
	        };
	        var C = function C(m, n) {
	            if (n > m) {
	                return 0;
	            }
	            return P(m, n) / P(n, n);
	        };
	        var factorial = function factorial(n) {
	            return P(n, n);
	        };
	        var factoradic = function factoradic(n, d) {
	            var f = 1;
	            if (!d) {
	                for (d = 1; f < n; f *= ++d) {}
	                if (f > n) f /= d--;
	            } else {
	                f = factorial(d);
	            }
	            var result = [0];
	            for (; d; f /= d--) {
	                result[d] = Math.floor(n / f);
	                n %= f;
	            }
	            return result;
	        };
	        /* common methods */
	        var addProperties = function addProperties(dst, src) {
	            Object.keys(src).forEach(function (p) {
	                Object.defineProperty(dst, p, {
	                    value: src[p],
	                    configurable: p == 'next'
	                });
	            });
	        };
	        var hideProperty = function hideProperty(o, p) {
	            Object.defineProperty(o, p, {
	                writable: true
	            });
	        };
	        var toArray = function toArray(f) {
	            var e,
	                result = [];
	            this.init();
	            while (e = this.next()) {
	                result.push(f ? f(e) : e);
	            }this.init();
	            return result;
	        };
	        var common = {
	            toArray: toArray,
	            map: toArray,
	            forEach: function forEach(f) {
	                var e;
	                this.init();
	                while (e = this.next()) {
	                    f(e);
	                }this.init();
	            },
	            filter: function filter(f) {
	                var e,
	                    result = [];
	                this.init();
	                while (e = this.next()) {
	                    if (f(e)) result.push(e);
	                }this.init();
	                return result;
	            },
	            lazyMap: function lazyMap(f) {
	                this._lazyMap = f;
	                return this;
	            },
	            lazyFilter: function lazyFilter(f) {
	                Object.defineProperty(this, 'next', {
	                    writable: true
	                });
	                if (typeof f !== 'function') {
	                    this.next = this._next;
	                } else {
	                    if (typeof this._next !== 'function') {
	                        this._next = this.next;
	                    }
	                    var _next = this._next.bind(this);
	                    this.next = function () {
	                        var e;
	                        while (e = _next()) {
	                            if (f(e)) return e;
	                        }
	                        return e;
	                    }.bind(this);
	                }
	                Object.defineProperty(this, 'next', {
	                    writable: false
	                });
	                return this;
	            }

	        };
	        /* power set */
	        var power = function power(ary, fun) {
	            var size = 1 << ary.length,
	                sizeOf = function sizeOf() {
	                return size;
	            },
	                that = Object.create(ary.slice(), {
	                length: {
	                    get: sizeOf
	                }
	            });
	            hideProperty(that, 'index');
	            addProperties(that, {
	                valueOf: sizeOf,
	                init: function init() {
	                    that.index = 0;
	                },
	                nth: function nth(n) {
	                    if (n >= size) return;
	                    var i = 0,
	                        result = [];
	                    for (; n; n >>>= 1, i++) {
	                        if (n & 1) result.push(this[i]);
	                    }return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                },
	                next: function next() {
	                    return this.nth(this.index++);
	                }
	            });
	            addProperties(that, common);
	            that.init();
	            return typeof fun === 'function' ? that.map(fun) : that;
	        };
	        /* combination */
	        var nextIndex = function nextIndex(n) {
	            var smallest = n & -n,
	                ripple = n + smallest,
	                new_smallest = ripple & -ripple,
	                ones = (new_smallest / smallest >> 1) - 1;
	            return ripple | ones;
	        };
	        var combination = function combination(ary, nelem, fun) {
	            if (!nelem) nelem = ary.length;
	            if (nelem < 1) throw new RangeError();
	            if (nelem > ary.length) throw new RangeError();
	            var first = (1 << nelem) - 1,
	                size = C(ary.length, nelem),
	                maxIndex = 1 << ary.length,
	                sizeOf = function sizeOf() {
	                return size;
	            },
	                that = Object.create(ary.slice(), {
	                length: {
	                    get: sizeOf
	                }
	            });
	            hideProperty(that, 'index');
	            addProperties(that, {
	                valueOf: sizeOf,
	                init: function init() {
	                    this.index = first;
	                },
	                next: function next() {
	                    if (this.index >= maxIndex) return;
	                    var i = 0,
	                        n = this.index,
	                        result = [];
	                    for (; n; n >>>= 1, i++) {
	                        if (n & 1) result[result.length] = this[i];
	                    }

	                    this.index = nextIndex(this.index);
	                    return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                }
	            });
	            addProperties(that, common);
	            that.init();
	            return typeof fun === 'function' ? that.map(fun) : that;
	        };
	        /* bigcombination */
	        var bigNextIndex = function bigNextIndex(n, nelem) {

	            var result = n;
	            var j = nelem;
	            var i = 0;
	            for (i = result.length - 1; i >= 0; i--) {
	                if (result[i] == 1) {
	                    j--;
	                } else {
	                    break;
	                }
	            }
	            if (j == 0) {
	                // Overflow
	                result[result.length] = 1;
	                for (var k = result.length - 2; k >= 0; k--) {
	                    result[k] = k < nelem - 1 ? 1 : 0;
	                }
	            } else {
	                // Normal

	                // first zero after 1
	                var i1 = -1;
	                var i0 = -1;
	                for (var i = 0; i < result.length; i++) {
	                    if (result[i] == 0 && i1 != -1) {
	                        i0 = i;
	                    }
	                    if (result[i] == 1) {
	                        i1 = i;
	                    }
	                    if (i0 != -1 && i1 != -1) {
	                        result[i0] = 1;
	                        result[i1] = 0;
	                        break;
	                    }
	                }

	                j = nelem;
	                for (var i = result.length - 1; i >= i1; i--) {
	                    if (result[i] == 1) j--;
	                }
	                for (var i = 0; i < i1; i++) {
	                    result[i] = i < j ? 1 : 0;
	                }
	            }

	            return result;
	        };
	        var buildFirst = function buildFirst(nelem) {
	            var result = [];
	            for (var i = 0; i < nelem; i++) {
	                result[i] = 1;
	            }
	            result[0] = 1;
	            return result;
	        };
	        var bigCombination = function bigCombination(ary, nelem, fun) {
	            if (!nelem) nelem = ary.length;
	            if (nelem < 1) throw new RangeError();
	            if (nelem > ary.length) throw new RangeError();
	            var first = buildFirst(nelem),
	                size = C(ary.length, nelem),
	                maxIndex = ary.length,
	                sizeOf = function sizeOf() {
	                return size;
	            },
	                that = Object.create(ary.slice(), {
	                length: {
	                    get: sizeOf
	                }
	            });
	            hideProperty(that, 'index');
	            addProperties(that, {
	                valueOf: sizeOf,
	                init: function init() {
	                    this.index = first.concat();
	                },
	                next: function next() {
	                    if (this.index.length > maxIndex) return;
	                    var i = 0,
	                        n = this.index,
	                        result = [];
	                    for (var j = 0; j < n.length; j++, i++) {
	                        if (n[j]) result[result.length] = this[i];
	                    }
	                    bigNextIndex(this.index, nelem);
	                    return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                }
	            });
	            addProperties(that, common);
	            that.init();
	            return typeof fun === 'function' ? that.map(fun) : that;
	        };
	        /* permutation */
	        var _permutation = function _permutation(ary) {
	            var that = ary.slice(),
	                size = factorial(that.length);
	            that.index = 0;
	            that.next = function () {
	                if (this.index >= size) return;
	                var copy = this.slice(),
	                    digits = factoradic(this.index, this.length),
	                    result = [],
	                    i = this.length - 1;
	                for (; i >= 0; --i) {
	                    result.push(copy.splice(digits[i], 1)[0]);
	                }this.index++;
	                return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	            };
	            return that;
	        };
	        // which is really a permutation of combination
	        var permutation = function permutation(ary, nelem, fun) {
	            if (!nelem) nelem = ary.length;
	            if (nelem < 1) throw new RangeError();
	            if (nelem > ary.length) throw new RangeError();
	            var size = P(ary.length, nelem),
	                sizeOf = function sizeOf() {
	                return size;
	            },
	                that = Object.create(ary.slice(), {
	                length: {
	                    get: sizeOf
	                }
	            });
	            hideProperty(that, 'cmb');
	            hideProperty(that, 'per');
	            addProperties(that, {
	                valueOf: function valueOf() {
	                    return size;
	                },
	                init: function init() {
	                    this.cmb = combination(ary, nelem);
	                    this.per = _permutation(this.cmb.next());
	                },
	                next: function next() {
	                    var result = this.per.next();
	                    if (!result) {
	                        var cmb = this.cmb.next();
	                        if (!cmb) return;
	                        this.per = _permutation(cmb);
	                        return this.next();
	                    }
	                    return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                }
	            });
	            addProperties(that, common);
	            that.init();
	            return typeof fun === 'function' ? that.map(fun) : that;
	        };

	        var PC = function PC(m) {
	            var total = 0;
	            for (var n = 1; n <= m; n++) {
	                var p = P(m, n);
	                total += p;
	            };
	            return total;
	        };
	        // which is really a permutation of combination
	        var permutationCombination = function permutationCombination(ary, fun) {
	            // if (!nelem) nelem = ary.length;
	            // if (nelem < 1) throw new RangeError;
	            // if (nelem > ary.length) throw new RangeError;
	            var size = PC(ary.length),
	                sizeOf = function sizeOf() {
	                return size;
	            },
	                that = Object.create(ary.slice(), {
	                length: {
	                    get: sizeOf
	                }
	            });
	            hideProperty(that, 'cmb');
	            hideProperty(that, 'per');
	            hideProperty(that, 'nelem');
	            addProperties(that, {
	                valueOf: function valueOf() {
	                    return size;
	                },
	                init: function init() {
	                    this.nelem = 1;
	                    // console.log("Starting nelem: " + this.nelem);
	                    this.cmb = combination(ary, this.nelem);
	                    this.per = _permutation(this.cmb.next());
	                },
	                next: function next() {
	                    var result = this.per.next();
	                    if (!result) {
	                        var cmb = this.cmb.next();
	                        if (!cmb) {
	                            this.nelem++;
	                            // console.log("increment nelem: " + this.nelem + " vs " + ary.length);
	                            if (this.nelem > ary.length) return;
	                            this.cmb = combination(ary, this.nelem);
	                            cmb = this.cmb.next();
	                            if (!cmb) return;
	                        }
	                        this.per = _permutation(cmb);
	                        return this.next();
	                    }
	                    return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                }
	            });
	            addProperties(that, common);
	            that.init();
	            return typeof fun === 'function' ? that.map(fun) : that;
	        };
	        /* Cartesian Product */
	        var arraySlice = Array.prototype.slice;
	        var cartesianProduct = function cartesianProduct() {
	            if (!arguments.length) throw new RangeError();
	            var args = arraySlice.call(arguments),
	                size = args.reduce(function (p, a) {
	                return p * a.length;
	            }, 1),
	                sizeOf = function sizeOf() {
	                return size;
	            },
	                dim = args.length,
	                that = Object.create(args, {
	                length: {
	                    get: sizeOf
	                }
	            });
	            if (!size) throw new RangeError();
	            hideProperty(that, 'index');
	            addProperties(that, {
	                valueOf: sizeOf,
	                dim: dim,
	                init: function init() {
	                    this.index = 0;
	                },
	                get: function get() {
	                    if (arguments.length !== this.length) return;
	                    var result = [],
	                        d = 0;
	                    for (; d < dim; d++) {
	                        var i = arguments[d];
	                        if (i >= this[d].length) return;
	                        result.push(this[d][i]);
	                    }
	                    return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                },
	                nth: function nth(n) {
	                    var result = [],
	                        d = 0;
	                    for (; d < dim; d++) {
	                        var l = this[d].length;
	                        var i = n % l;
	                        result.push(this[d][i]);
	                        n -= i;
	                        n /= l;
	                    }
	                    return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                },
	                next: function next() {
	                    if (this.index >= size) return;
	                    var result = this.nth(this.index);
	                    this.index++;
	                    return result;
	                }
	            });
	            addProperties(that, common);
	            that.init();
	            return that;
	        };
	        /* baseN */
	        var baseN = function baseN(ary, nelem, fun) {
	            if (!nelem) nelem = ary.length;
	            if (nelem < 1) throw new RangeError();
	            var base = ary.length,
	                size = Math.pow(base, nelem);
	            var sizeOf = function sizeOf() {
	                return size;
	            },
	                that = Object.create(ary.slice(), {
	                length: {
	                    get: sizeOf
	                }
	            });
	            hideProperty(that, 'index');
	            addProperties(that, {
	                valueOf: sizeOf,
	                init: function init() {
	                    that.index = 0;
	                },
	                nth: function nth(n) {
	                    if (n >= size) return;
	                    var result = [];
	                    for (var i = 0; i < nelem; i++) {
	                        var d = n % base;
	                        result.push(ary[d]);
	                        n -= d;n /= base;
	                    }
	                    return typeof that._lazyMap === 'function' ? that._lazyMap(result) : result;
	                },
	                next: function next() {
	                    return this.nth(this.index++);
	                }
	            });
	            addProperties(that, common);
	            that.init();
	            return typeof fun === 'function' ? that.map(fun) : that;
	        };

	        /* export */
	        var Combinatorics = Object.create(null);
	        addProperties(Combinatorics, {
	            C: C,
	            P: P,
	            factorial: factorial,
	            factoradic: factoradic,
	            cartesianProduct: cartesianProduct,
	            combination: combination,
	            bigCombination: bigCombination,
	            permutation: permutation,
	            permutationCombination: permutationCombination,
	            power: power,
	            baseN: baseN,
	            VERSION: version
	        });
	        return Combinatorics;
	    });
	});

	interopDefault(combinatorics);

	var index$3 = createCommonjsModule(function (module, exports) {
	  exports = module.exports = Victor;

	  /**
	   * # Victor - A JavaScript 2D vector class with methods for common vector operations
	   */

	  /**
	   * Constructor. Will also work without the `new` keyword
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = Victor(42, 1337);
	   *
	   * @param {Number} x Value of the x axis
	   * @param {Number} y Value of the y axis
	   * @return {Victor}
	   * @api public
	   */
	  function Victor(x, y) {
	    if (!(this instanceof Victor)) {
	      return new Victor(x, y);
	    }

	    /**
	     * The X axis
	     *
	     * ### Examples:
	     *     var vec = new Victor.fromArray(42, 21);
	     *
	     *     vec.x;
	     *     // => 42
	     *
	     * @api public
	     */
	    this.x = x || 0;

	    /**
	     * The Y axis
	     *
	     * ### Examples:
	     *     var vec = new Victor.fromArray(42, 21);
	     *
	     *     vec.y;
	     *     // => 21
	     *
	     * @api public
	     */
	    this.y = y || 0;
	  };

	  /**
	   * # Static
	   */

	  /**
	   * Creates a new instance from an array
	   *
	   * ### Examples:
	   *     var vec = Victor.fromArray([42, 21]);
	   *
	   *     vec.toString();
	   *     // => x:42, y:21
	   *
	   * @name Victor.fromArray
	   * @param {Array} array Array with the x and y values at index 0 and 1 respectively
	   * @return {Victor} The new instance
	   * @api public
	   */
	  Victor.fromArray = function (arr) {
	    return new Victor(arr[0] || 0, arr[1] || 0);
	  };

	  /**
	   * Creates a new instance from an object
	   *
	   * ### Examples:
	   *     var vec = Victor.fromObject({ x: 42, y: 21 });
	   *
	   *     vec.toString();
	   *     // => x:42, y:21
	   *
	   * @name Victor.fromObject
	   * @param {Object} obj Object with the values for x and y
	   * @return {Victor} The new instance
	   * @api public
	   */
	  Victor.fromObject = function (obj) {
	    return new Victor(obj.x || 0, obj.y || 0);
	  };

	  /**
	   * # Manipulation
	   *
	   * These functions are chainable.
	   */

	  /**
	   * Adds another vector's X axis to this one
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *     var vec2 = new Victor(20, 30);
	   *
	   *     vec1.addX(vec2);
	   *     vec1.toString();
	   *     // => x:30, y:10
	   *
	   * @param {Victor} vector The other vector you want to add to this one
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.addX = function (vec) {
	    this.x += vec.x;
	    return this;
	  };

	  /**
	   * Adds another vector's Y axis to this one
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *     var vec2 = new Victor(20, 30);
	   *
	   *     vec1.addY(vec2);
	   *     vec1.toString();
	   *     // => x:10, y:40
	   *
	   * @param {Victor} vector The other vector you want to add to this one
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.addY = function (vec) {
	    this.y += vec.y;
	    return this;
	  };

	  /**
	   * Adds another vector to this one
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *     var vec2 = new Victor(20, 30);
	   *
	   *     vec1.add(vec2);
	   *     vec1.toString();
	   *     // => x:30, y:40
	   *
	   * @param {Victor} vector The other vector you want to add to this one
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.add = function (vec) {
	    this.x += vec.x;
	    this.y += vec.y;
	    return this;
	  };

	  /**
	   * Adds the given scalar to both vector axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(1, 2);
	   *
	   *     vec.addScalar(2);
	   *     vec.toString();
	   *     // => x: 3, y: 4
	   *
	   * @param {Number} scalar The scalar to add
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.addScalar = function (scalar) {
	    this.x += scalar;
	    this.y += scalar;
	    return this;
	  };

	  /**
	   * Adds the given scalar to the X axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(1, 2);
	   *
	   *     vec.addScalarX(2);
	   *     vec.toString();
	   *     // => x: 3, y: 2
	   *
	   * @param {Number} scalar The scalar to add
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.addScalarX = function (scalar) {
	    this.x += scalar;
	    return this;
	  };

	  /**
	   * Adds the given scalar to the Y axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(1, 2);
	   *
	   *     vec.addScalarY(2);
	   *     vec.toString();
	   *     // => x: 1, y: 4
	   *
	   * @param {Number} scalar The scalar to add
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.addScalarY = function (scalar) {
	    this.y += scalar;
	    return this;
	  };

	  /**
	   * Subtracts the X axis of another vector from this one
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(20, 30);
	   *
	   *     vec1.subtractX(vec2);
	   *     vec1.toString();
	   *     // => x:80, y:50
	   *
	   * @param {Victor} vector The other vector you want subtract from this one
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.subtractX = function (vec) {
	    this.x -= vec.x;
	    return this;
	  };

	  /**
	   * Subtracts the Y axis of another vector from this one
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(20, 30);
	   *
	   *     vec1.subtractY(vec2);
	   *     vec1.toString();
	   *     // => x:100, y:20
	   *
	   * @param {Victor} vector The other vector you want subtract from this one
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.subtractY = function (vec) {
	    this.y -= vec.y;
	    return this;
	  };

	  /**
	   * Subtracts another vector from this one
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(20, 30);
	   *
	   *     vec1.subtract(vec2);
	   *     vec1.toString();
	   *     // => x:80, y:20
	   *
	   * @param {Victor} vector The other vector you want subtract from this one
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.subtract = function (vec) {
	    this.x -= vec.x;
	    this.y -= vec.y;
	    return this;
	  };

	  /**
	   * Subtracts the given scalar from both axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 200);
	   *
	   *     vec.subtractScalar(20);
	   *     vec.toString();
	   *     // => x: 80, y: 180
	   *
	   * @param {Number} scalar The scalar to subtract
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.subtractScalar = function (scalar) {
	    this.x -= scalar;
	    this.y -= scalar;
	    return this;
	  };

	  /**
	   * Subtracts the given scalar from the X axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 200);
	   *
	   *     vec.subtractScalarX(20);
	   *     vec.toString();
	   *     // => x: 80, y: 200
	   *
	   * @param {Number} scalar The scalar to subtract
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.subtractScalarX = function (scalar) {
	    this.x -= scalar;
	    return this;
	  };

	  /**
	   * Subtracts the given scalar from the Y axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 200);
	   *
	   *     vec.subtractScalarY(20);
	   *     vec.toString();
	   *     // => x: 100, y: 180
	   *
	   * @param {Number} scalar The scalar to subtract
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.subtractScalarY = function (scalar) {
	    this.y -= scalar;
	    return this;
	  };

	  /**
	   * Divides the X axis by the x component of given vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *     var vec2 = new Victor(2, 0);
	   *
	   *     vec.divideX(vec2);
	   *     vec.toString();
	   *     // => x:50, y:50
	   *
	   * @param {Victor} vector The other vector you want divide by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.divideX = function (vector) {
	    this.x /= vector.x;
	    return this;
	  };

	  /**
	   * Divides the Y axis by the y component of given vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *     var vec2 = new Victor(0, 2);
	   *
	   *     vec.divideY(vec2);
	   *     vec.toString();
	   *     // => x:100, y:25
	   *
	   * @param {Victor} vector The other vector you want divide by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.divideY = function (vector) {
	    this.y /= vector.y;
	    return this;
	  };

	  /**
	   * Divides both vector axis by a axis values of given vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *     var vec2 = new Victor(2, 2);
	   *
	   *     vec.divide(vec2);
	   *     vec.toString();
	   *     // => x:50, y:25
	   *
	   * @param {Victor} vector The vector to divide by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.divide = function (vector) {
	    this.x /= vector.x;
	    this.y /= vector.y;
	    return this;
	  };

	  /**
	   * Divides both vector axis by the given scalar value
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.divideScalar(2);
	   *     vec.toString();
	   *     // => x:50, y:25
	   *
	   * @param {Number} The scalar to divide by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.divideScalar = function (scalar) {
	    if (scalar !== 0) {
	      this.x /= scalar;
	      this.y /= scalar;
	    } else {
	      this.x = 0;
	      this.y = 0;
	    }

	    return this;
	  };

	  /**
	   * Divides the X axis by the given scalar value
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.divideScalarX(2);
	   *     vec.toString();
	   *     // => x:50, y:50
	   *
	   * @param {Number} The scalar to divide by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.divideScalarX = function (scalar) {
	    if (scalar !== 0) {
	      this.x /= scalar;
	    } else {
	      this.x = 0;
	    }
	    return this;
	  };

	  /**
	   * Divides the Y axis by the given scalar value
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.divideScalarY(2);
	   *     vec.toString();
	   *     // => x:100, y:25
	   *
	   * @param {Number} The scalar to divide by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.divideScalarY = function (scalar) {
	    if (scalar !== 0) {
	      this.y /= scalar;
	    } else {
	      this.y = 0;
	    }
	    return this;
	  };

	  /**
	   * Inverts the X axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.invertX();
	   *     vec.toString();
	   *     // => x:-100, y:50
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.invertX = function () {
	    this.x *= -1;
	    return this;
	  };

	  /**
	   * Inverts the Y axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.invertY();
	   *     vec.toString();
	   *     // => x:100, y:-50
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.invertY = function () {
	    this.y *= -1;
	    return this;
	  };

	  /**
	   * Inverts both axis
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.invert();
	   *     vec.toString();
	   *     // => x:-100, y:-50
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.invert = function () {
	    this.invertX();
	    this.invertY();
	    return this;
	  };

	  /**
	   * Multiplies the X axis by X component of given vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *     var vec2 = new Victor(2, 0);
	   *
	   *     vec.multiplyX(vec2);
	   *     vec.toString();
	   *     // => x:200, y:50
	   *
	   * @param {Victor} vector The vector to multiply the axis with
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.multiplyX = function (vector) {
	    this.x *= vector.x;
	    return this;
	  };

	  /**
	   * Multiplies the Y axis by Y component of given vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *     var vec2 = new Victor(0, 2);
	   *
	   *     vec.multiplyX(vec2);
	   *     vec.toString();
	   *     // => x:100, y:100
	   *
	   * @param {Victor} vector The vector to multiply the axis with
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.multiplyY = function (vector) {
	    this.y *= vector.y;
	    return this;
	  };

	  /**
	   * Multiplies both vector axis by values from a given vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *     var vec2 = new Victor(2, 2);
	   *
	   *     vec.multiply(vec2);
	   *     vec.toString();
	   *     // => x:200, y:100
	   *
	   * @param {Victor} vector The vector to multiply by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.multiply = function (vector) {
	    this.x *= vector.x;
	    this.y *= vector.y;
	    return this;
	  };

	  /**
	   * Multiplies both vector axis by the given scalar value
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.multiplyScalar(2);
	   *     vec.toString();
	   *     // => x:200, y:100
	   *
	   * @param {Number} The scalar to multiply by
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.multiplyScalar = function (scalar) {
	    this.x *= scalar;
	    this.y *= scalar;
	    return this;
	  };

	  /**
	   * Multiplies the X axis by the given scalar
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.multiplyScalarX(2);
	   *     vec.toString();
	   *     // => x:200, y:50
	   *
	   * @param {Number} The scalar to multiply the axis with
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.multiplyScalarX = function (scalar) {
	    this.x *= scalar;
	    return this;
	  };

	  /**
	   * Multiplies the Y axis by the given scalar
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.multiplyScalarY(2);
	   *     vec.toString();
	   *     // => x:100, y:100
	   *
	   * @param {Number} The scalar to multiply the axis with
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.multiplyScalarY = function (scalar) {
	    this.y *= scalar;
	    return this;
	  };

	  /**
	   * Normalize
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.normalize = function () {
	    var length = this.length();

	    if (length === 0) {
	      this.x = 1;
	      this.y = 0;
	    } else {
	      this.divide(Victor(length, length));
	    }
	    return this;
	  };

	  Victor.prototype.norm = Victor.prototype.normalize;

	  /**
	   * If the absolute vector axis is greater than `max`, multiplies the axis by `factor`
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.limit(80, 0.9);
	   *     vec.toString();
	   *     // => x:90, y:50
	   *
	   * @param {Number} max The maximum value for both x and y axis
	   * @param {Number} factor Factor by which the axis are to be multiplied with
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.limit = function (max, factor) {
	    if (Math.abs(this.x) > max) {
	      this.x *= factor;
	    }
	    if (Math.abs(this.y) > max) {
	      this.y *= factor;
	    }
	    return this;
	  };

	  /**
	   * Randomizes both vector axis with a value between 2 vectors
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.randomize(new Victor(50, 60), new Victor(70, 80`));
	   *     vec.toString();
	   *     // => x:67, y:73
	   *
	   * @param {Victor} topLeft first vector
	   * @param {Victor} bottomRight second vector
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.randomize = function (topLeft, bottomRight) {
	    this.randomizeX(topLeft, bottomRight);
	    this.randomizeY(topLeft, bottomRight);

	    return this;
	  };

	  /**
	   * Randomizes the y axis with a value between 2 vectors
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.randomizeX(new Victor(50, 60), new Victor(70, 80`));
	   *     vec.toString();
	   *     // => x:55, y:50
	   *
	   * @param {Victor} topLeft first vector
	   * @param {Victor} bottomRight second vector
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.randomizeX = function (topLeft, bottomRight) {
	    var min = Math.min(topLeft.x, bottomRight.x);
	    var max = Math.max(topLeft.x, bottomRight.x);
	    this.x = random(min, max);
	    return this;
	  };

	  /**
	   * Randomizes the y axis with a value between 2 vectors
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.randomizeY(new Victor(50, 60), new Victor(70, 80`));
	   *     vec.toString();
	   *     // => x:100, y:66
	   *
	   * @param {Victor} topLeft first vector
	   * @param {Victor} bottomRight second vector
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.randomizeY = function (topLeft, bottomRight) {
	    var min = Math.min(topLeft.y, bottomRight.y);
	    var max = Math.max(topLeft.y, bottomRight.y);
	    this.y = random(min, max);
	    return this;
	  };

	  /**
	   * Randomly randomizes either axis between 2 vectors
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.randomizeAny(new Victor(50, 60), new Victor(70, 80));
	   *     vec.toString();
	   *     // => x:100, y:77
	   *
	   * @param {Victor} topLeft first vector
	   * @param {Victor} bottomRight second vector
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.randomizeAny = function (topLeft, bottomRight) {
	    if (!!Math.round(Math.random())) {
	      this.randomizeX(topLeft, bottomRight);
	    } else {
	      this.randomizeY(topLeft, bottomRight);
	    }
	    return this;
	  };

	  /**
	   * Rounds both axis to an integer value
	   *
	   * ### Examples:
	   *     var vec = new Victor(100.2, 50.9);
	   *
	   *     vec.unfloat();
	   *     vec.toString();
	   *     // => x:100, y:51
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.unfloat = function () {
	    this.x = Math.round(this.x);
	    this.y = Math.round(this.y);
	    return this;
	  };

	  /**
	   * Rounds both axis to a certain precision
	   *
	   * ### Examples:
	   *     var vec = new Victor(100.2, 50.9);
	   *
	   *     vec.unfloat();
	   *     vec.toString();
	   *     // => x:100, y:51
	   *
	   * @param {Number} Precision (default: 8)
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.toFixed = function (precision) {
	    if (typeof precision === 'undefined') {
	      precision = 8;
	    }
	    this.x = this.x.toFixed(precision);
	    this.y = this.y.toFixed(precision);
	    return this;
	  };

	  /**
	   * Performs a linear blend / interpolation of the X axis towards another vector
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 100);
	   *     var vec2 = new Victor(200, 200);
	   *
	   *     vec1.mixX(vec2, 0.5);
	   *     vec.toString();
	   *     // => x:150, y:100
	   *
	   * @param {Victor} vector The other vector
	   * @param {Number} amount The blend amount (optional, default: 0.5)
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.mixX = function (vec, amount) {
	    if (typeof amount === 'undefined') {
	      amount = 0.5;
	    }

	    this.x = (1 - amount) * this.x + amount * vec.x;
	    return this;
	  };

	  /**
	   * Performs a linear blend / interpolation of the Y axis towards another vector
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 100);
	   *     var vec2 = new Victor(200, 200);
	   *
	   *     vec1.mixY(vec2, 0.5);
	   *     vec.toString();
	   *     // => x:100, y:150
	   *
	   * @param {Victor} vector The other vector
	   * @param {Number} amount The blend amount (optional, default: 0.5)
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.mixY = function (vec, amount) {
	    if (typeof amount === 'undefined') {
	      amount = 0.5;
	    }

	    this.y = (1 - amount) * this.y + amount * vec.y;
	    return this;
	  };

	  /**
	   * Performs a linear blend / interpolation towards another vector
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 100);
	   *     var vec2 = new Victor(200, 200);
	   *
	   *     vec1.mix(vec2, 0.5);
	   *     vec.toString();
	   *     // => x:150, y:150
	   *
	   * @param {Victor} vector The other vector
	   * @param {Number} amount The blend amount (optional, default: 0.5)
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.mix = function (vec, amount) {
	    this.mixX(vec, amount);
	    this.mixY(vec, amount);
	    return this;
	  };

	  /**
	   * # Products
	   */

	  /**
	   * Creates a clone of this vector
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *     var vec2 = vec1.clone();
	   *
	   *     vec2.toString();
	   *     // => x:10, y:10
	   *
	   * @return {Victor} A clone of the vector
	   * @api public
	   */
	  Victor.prototype.clone = function () {
	    return new Victor(this.x, this.y);
	  };

	  /**
	   * Copies another vector's X component in to its own
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *     var vec2 = new Victor(20, 20);
	   *     var vec2 = vec1.copyX(vec1);
	   *
	   *     vec2.toString();
	   *     // => x:20, y:10
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.copyX = function (vec) {
	    this.x = vec.x;
	    return this;
	  };

	  /**
	   * Copies another vector's Y component in to its own
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *     var vec2 = new Victor(20, 20);
	   *     var vec2 = vec1.copyY(vec1);
	   *
	   *     vec2.toString();
	   *     // => x:10, y:20
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.copyY = function (vec) {
	    this.y = vec.y;
	    return this;
	  };

	  /**
	   * Copies another vector's X and Y components in to its own
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *     var vec2 = new Victor(20, 20);
	   *     var vec2 = vec1.copy(vec1);
	   *
	   *     vec2.toString();
	   *     // => x:20, y:20
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.copy = function (vec) {
	    this.copyX(vec);
	    this.copyY(vec);
	    return this;
	  };

	  /**
	   * Sets the vector to zero (0,0)
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(10, 10);
	   *		 var1.zero();
	   *     vec1.toString();
	   *     // => x:0, y:0
	   *
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.zero = function () {
	    this.x = this.y = 0;
	    return this;
	  };

	  /**
	   * Calculates the dot product of this vector and another
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(200, 60);
	   *
	   *     vec1.dot(vec2);
	   *     // => 23000
	   *
	   * @param {Victor} vector The second vector
	   * @return {Number} Dot product
	   * @api public
	   */
	  Victor.prototype.dot = function (vec2) {
	    return this.x * vec2.x + this.y * vec2.y;
	  };

	  Victor.prototype.cross = function (vec2) {
	    return this.x * vec2.y - this.y * vec2.x;
	  };

	  /**
	   * Projects a vector onto another vector, setting itself to the result.
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 0);
	   *     var vec2 = new Victor(100, 100);
	   *
	   *     vec.projectOnto(vec2);
	   *     vec.toString();
	   *     // => x:50, y:50
	   *
	   * @param {Victor} vector The other vector you want to project this vector onto
	   * @return {Victor} `this` for chaining capabilities
	   * @api public
	   */
	  Victor.prototype.projectOnto = function (vec2) {
	    var coeff = (this.x * vec2.x + this.y * vec2.y) / (vec2.x * vec2.x + vec2.y * vec2.y);
	    this.x = coeff * vec2.x;
	    this.y = coeff * vec2.y;
	    return this;
	  };

	  Victor.prototype.horizontalAngle = function () {
	    return Math.atan2(this.y, this.x);
	  };

	  Victor.prototype.horizontalAngleDeg = function () {
	    return radian2degrees(this.horizontalAngle());
	  };

	  Victor.prototype.verticalAngle = function () {
	    return Math.atan2(this.x, this.y);
	  };

	  Victor.prototype.verticalAngleDeg = function () {
	    return radian2degrees(this.verticalAngle());
	  };

	  Victor.prototype.angle = Victor.prototype.horizontalAngle;
	  Victor.prototype.angleDeg = Victor.prototype.horizontalAngleDeg;
	  Victor.prototype.direction = Victor.prototype.horizontalAngle;

	  Victor.prototype.rotate = function (angle) {
	    var nx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
	    var ny = this.x * Math.sin(angle) + this.y * Math.cos(angle);

	    this.x = nx;
	    this.y = ny;

	    return this;
	  };

	  Victor.prototype.rotateDeg = function (angle) {
	    angle = degrees2radian(angle);
	    return this.rotate(angle);
	  };

	  Victor.prototype.rotateTo = function (rotation) {
	    return this.rotate(rotation - this.angle());
	  };

	  Victor.prototype.rotateToDeg = function (rotation) {
	    rotation = degrees2radian(rotation);
	    return this.rotateTo(rotation);
	  };

	  Victor.prototype.rotateBy = function (rotation) {
	    var angle = this.angle() + rotation;

	    return this.rotate(angle);
	  };

	  Victor.prototype.rotateByDeg = function (rotation) {
	    rotation = degrees2radian(rotation);
	    return this.rotateBy(rotation);
	  };

	  /**
	   * Calculates the distance of the X axis between this vector and another
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(200, 60);
	   *
	   *     vec1.distanceX(vec2);
	   *     // => -100
	   *
	   * @param {Victor} vector The second vector
	   * @return {Number} Distance
	   * @api public
	   */
	  Victor.prototype.distanceX = function (vec) {
	    return this.x - vec.x;
	  };

	  /**
	   * Same as `distanceX()` but always returns an absolute number
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(200, 60);
	   *
	   *     vec1.absDistanceX(vec2);
	   *     // => 100
	   *
	   * @param {Victor} vector The second vector
	   * @return {Number} Absolute distance
	   * @api public
	   */
	  Victor.prototype.absDistanceX = function (vec) {
	    return Math.abs(this.distanceX(vec));
	  };

	  /**
	   * Calculates the distance of the Y axis between this vector and another
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(200, 60);
	   *
	   *     vec1.distanceY(vec2);
	   *     // => -10
	   *
	   * @param {Victor} vector The second vector
	   * @return {Number} Distance
	   * @api public
	   */
	  Victor.prototype.distanceY = function (vec) {
	    return this.y - vec.y;
	  };

	  /**
	   * Same as `distanceY()` but always returns an absolute number
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(200, 60);
	   *
	   *     vec1.distanceY(vec2);
	   *     // => 10
	   *
	   * @param {Victor} vector The second vector
	   * @return {Number} Absolute distance
	   * @api public
	   */
	  Victor.prototype.absDistanceY = function (vec) {
	    return Math.abs(this.distanceY(vec));
	  };

	  /**
	   * Calculates the euclidean distance between this vector and another
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(200, 60);
	   *
	   *     vec1.distance(vec2);
	   *     // => 100.4987562112089
	   *
	   * @param {Victor} vector The second vector
	   * @return {Number} Distance
	   * @api public
	   */
	  Victor.prototype.distance = function (vec) {
	    return Math.sqrt(this.distanceSq(vec));
	  };

	  /**
	   * Calculates the squared euclidean distance between this vector and another
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(200, 60);
	   *
	   *     vec1.distanceSq(vec2);
	   *     // => 10100
	   *
	   * @param {Victor} vector The second vector
	   * @return {Number} Distance
	   * @api public
	   */
	  Victor.prototype.distanceSq = function (vec) {
	    var dx = this.distanceX(vec),
	        dy = this.distanceY(vec);

	    return dx * dx + dy * dy;
	  };

	  /**
	   * Calculates the length or magnitude of the vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.length();
	   *     // => 111.80339887498948
	   *
	   * @return {Number} Length / Magnitude
	   * @api public
	   */
	  Victor.prototype.length = function () {
	    return Math.sqrt(this.lengthSq());
	  };

	  /**
	   * Squared length / magnitude
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *
	   *     vec.lengthSq();
	   *     // => 12500
	   *
	   * @return {Number} Length / Magnitude
	   * @api public
	   */
	  Victor.prototype.lengthSq = function () {
	    return this.x * this.x + this.y * this.y;
	  };

	  Victor.prototype.magnitude = Victor.prototype.length;

	  /**
	   * Returns a true if vector is (0, 0)
	   *
	   * ### Examples:
	   *     var vec = new Victor(100, 50);
	   *     vec.zero();
	   *
	   *     // => true
	   *
	   * @return {Boolean}
	   * @api public
	   */
	  Victor.prototype.isZero = function () {
	    return this.x === 0 && this.y === 0;
	  };

	  /**
	   * Returns a true if this vector is the same as another
	   *
	   * ### Examples:
	   *     var vec1 = new Victor(100, 50);
	   *     var vec2 = new Victor(100, 50);
	   *     vec1.isEqualTo(vec2);
	   *
	   *     // => true
	   *
	   * @return {Boolean}
	   * @api public
	   */
	  Victor.prototype.isEqualTo = function (vec2) {
	    return this.x === vec2.x && this.y === vec2.y;
	  };

	  /**
	   * # Utility Methods
	   */

	  /**
	   * Returns an string representation of the vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(10, 20);
	   *
	   *     vec.toString();
	   *     // => x:10, y:20
	   *
	   * @return {String}
	   * @api public
	   */
	  Victor.prototype.toString = function () {
	    return 'x:' + this.x + ', y:' + this.y;
	  };

	  /**
	   * Returns an array representation of the vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(10, 20);
	   *
	   *     vec.toArray();
	   *     // => [10, 20]
	   *
	   * @return {Array}
	   * @api public
	   */
	  Victor.prototype.toArray = function () {
	    return [this.x, this.y];
	  };

	  /**
	   * Returns an object representation of the vector
	   *
	   * ### Examples:
	   *     var vec = new Victor(10, 20);
	   *
	   *     vec.toObject();
	   *     // => { x: 10, y: 20 }
	   *
	   * @return {Object}
	   * @api public
	   */
	  Victor.prototype.toObject = function () {
	    return { x: this.x, y: this.y };
	  };

	  var degrees = 180 / Math.PI;

	  function random(min, max) {
	    return Math.floor(Math.random() * (max - min + 1) + min);
	  }

	  function radian2degrees(rad) {
	    return rad * degrees;
	  }

	  function degrees2radian(deg) {
	    return deg / degrees;
	  }
	});

	var Vec = interopDefault(index$3);

	var X = Vec(1, 0);
	var P = 100;
	// Maybe a more efficient way, but messier to me.


	function center(R) {
	  return new Vec(R.left + R.width / 2, R.top + R.height / 2);
	}
	function rad(R) {
	  return new Vec(R.width / 2, R.height / 2);
	}

	// This implementation is based on the L-p unit disk being a square as p -> inf
	// pRad is the radius of the p-norm unit circle at angle theta, stretched by
	// the ratio of 'rectangular radii', see here: https://www.desmos.com/calculator/hzrmdr9j6w
	var pRad = function pRad(theta, p, rW, rH) {
	  return Math.pow(Math.pow(rH / rW * Math.cos(theta), p) + Math.pow(Math.sin(theta), p), -1 / p);
	};
	// pXY is the cartesian coordinates of the point on the p-norm unit "circle" at angle theta.
	// the dimensions are unstretched, somehow only using the longer rectangle-radius is necessary (?)
	var pXY = function pXY(theta, p, rW, rH) {
	  return new Vec(rH * Math.cos(theta) * pRad(theta, p, rW, rH), rH * Math.sin(theta) * pRad(theta, p, rW, rH));
	};

	function nearbyEdgePoints(r1, r2, p1, p2, phase, margin) {
	  phase = phase ? phase : Math.PI / 16;
	  margin = margin ? margin : 0;
	  if (p1 == undefined) {
	    p1 = P;
	  }
	  if (p1 == true) {
	    p1 = 2;
	  }
	  if (p2 == undefined) {
	    p2 = P;
	  }
	  if (p2 == true) {
	    p2 = 2;
	  }

	  var c1 = center(r1),
	      c2 = center(r2);
	  var rad1 = rad(r1),
	      rad2 = rad(r2);
	  var phi = c2.clone().subtract(c1.clone()).angle();
	  var edgePt1 = pXY(phi + phase, p1, rad1.x + margin, rad1.y + margin).add(c1);
	  var edgePt2 = pXY(phi - phase + Math.PI, p2, rad2.x + margin, rad2.y + margin).add(c2); //new Vec(-edgePt1.x, -edgePt1.y);//.multiplyX(rad1).multiplyY(rad1);
	  return [edgePt1, edgePt2];
	}

	// export function localFrameEdgeGap(r1,r2,p1,p2,phase,margin){
	//   phase = phase ? phase : Math.PI/16;
	//   margin = margin ? margin : 0;
	//   if (p1 == undefined){p1 = P}
	//   if (p2 == undefined){p2 = P}
	//   var c1 = center(r1), c2 = center(r2);
	//   var dist = c2.subtract(c1);
	//   var rad1 = rad(r1), rad2 = rad(r2);
	//   var phi = c2.clone().subtract(c1.clone()).angle()
	//   var edgePt1 = pRad(phi+phase,p1,rad1.x+margin,rad1.y+margin);
	//   var edgePt2 = pRad(phi-phase+Math.PI,p2,rad2.x+margin,rad2.y+margin) //new Vec(-edgePt1.x, -edgePt1.y);//.multiplyX(rad1).multiplyY(rad1);
	//   return([c1.clone().add(edgePt1),
	//           c2.clone().add(edgePt2)
	//         ])
	// }

	// For some reason this implementation isn't working:
	// var abs = Math.abs
	// var mod = (n, m) => ((n.toFixed(3) % m) + m) % m;
	// var saw = (x,m) => (2/m)*(m/2-abs(mod(x,m*2))-m)
	// function clamp(num, low, high) {
	//   return Math.max(Math.min(num,high),low);
	// }
	//
	// var clampedSaw = (x) => -2*clamp(saw(x,Math.PI),-1/2,1/2)
	// var square = (phi) => new Vec(clampedSaw(phi),clampedSaw(phi-Math.PI/2))
	//
	//
	// export function nearbyEdgePoints(r1,r2){
	//   var c1 = center(r1), c2 = center(r2);
	//   var rad1 = rad(r1), rad2 = rad(r2);
	//   var phi = c2.clone().subtract(c1.clone()).angle()
	//   var edgePt1 = square(phi,P);
	//   var edgePt2 = new Vec(-edgePt1.x, -edgePt1.y);//.multiplyX(rad1).multiplyY(rad1);
	//   return([c1.clone().add(edgePt1.multiply(rad1)),
	//           c2.clone().add(edgePt2.multiply(rad2))
	//         ])
	// }

	var rectCache$1 = Symbol();
	var rectInViewport = Symbol();
	// const skipFrames = 10;
	// const skip = Symbol();
	// const rectsEq = (r1,r2) => r1.top == r2.top && r1.bottom == r2.bottom && r1.left == r2.left && r1.right == r2.right
	var cacheBoundingRect = function cacheBoundingRect(el) {
	  // if (el[skip] <= skipFrames) {
	  //   el[skip] += 1
	  //   return
	  // }
	  // var oldRect = el[rectCache]
	  var rect = el[rectCache$1] = el.getBoundingClientRect();
	  // if (rectsEq(rect, oldRect)) { el[skip] = 0};
	  el[rectInViewport] = rect.top >= 0 || rect.left >= 0 || rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) || rect.right <= (window.innerWidth || document.documentElement.clientWidth);
	};

	var drawEdge = function drawEdge(ctx, edge, graph) {
	  if (edge.source[rectInViewport] || edge.target[rectInViewport]) {
	    var R1 = edge.source[rectCache$1];
	    var R2 = edge.target[rectCache$1];
	    var pts = nearbyEdgePoints(R1, R2, edge.source.round, edge.target.round, undefined, 0);

	    var color = edge.color ? edge.color : graph.color;
	    var thickness = edge.thickness ? edge.thickness : graph.thickness;
	    var segments = edge.segments ? edge.segments : graph.segments;
	    segments = segments ? segments : [];
	    ctx.setLineDash(segments);
	    ctx.strokeStyle = color;
	    ctx.fillStyle = color;
	    ctx.lineWidth = thickness;

	    var size = thickness * 1;
	    var markerBuffer = 1 + 2 * size;
	    var lineBuffer = markerBuffer + 3;
	    // var fill = 'magenta'
	    // var stroke = '#222'
	    // var strokeWidth = 2

	    // ctx.strokeStyle = "yellow";
	    // ctx.fillStyle = "black";
	    // ctx.lineWidth = 2;
	    var diff = pts[1].clone().subtract(pts[0]);
	    var len = diff.length();

	    ctx.beginPath();
	    ctx.save();
	    ctx.translate(pts[0].x, pts[0].y);
	    ctx.rotate(Math.atan2(diff.y, diff.x));

	    ctx.moveTo(lineBuffer, 0);
	    ctx.lineTo(len - lineBuffer, 0);
	    ctx.stroke();
	    ctx.closePath();
	    ctx.beginPath();
	    if (edge.direction <= 0) {
	      ctx.save();
	      ctx.rotate(-Math.PI / 2);
	      ctx.translate(0, 7 + markerBuffer);
	      triangle.draw(ctx, 5 * size * size + 25);
	      ctx.restore();
	    }
	    // ctx.rect(lineBuffer,-size/2,len-2*lineBuffer,size);
	    if (edge.direction >= 0) {
	      ctx.translate(len, 0);
	      ctx.rotate(Math.PI / 2);
	      ctx.translate(0, 7 + markerBuffer);
	      triangle.draw(ctx, 5 * size * size + 25);
	    }
	    ctx.restore();

	    ctx.setLineDash([]);
	    ctx.stroke();
	    ctx.fill();
	    ctx.closePath();
	  }
	};

	var object = createCommonjsModule(function (module, exports) {
	  'use strict';

	  /**
	   * Clone an object
	   *
	   *     clone(x)
	   *
	   * Can clone any primitive type, array, and object.
	   * If x has a function clone, this function will be invoked to clone the object.
	   *
	   * @param {*} x
	   * @return {*} clone
	   */

	  exports.clone = function clone(x) {
	    var type = typeof x === 'undefined' ? 'undefined' : babelHelpers.typeof(x);

	    // immutable primitive types
	    if (type === 'number' || type === 'string' || type === 'boolean' || x === null || x === undefined) {
	      return x;
	    }

	    // use clone function of the object when available
	    if (typeof x.clone === 'function') {
	      return x.clone();
	    }

	    // array
	    if (Array.isArray(x)) {
	      return x.map(function (value) {
	        return clone(value);
	      });
	    }

	    if (x instanceof Number) return new Number(x.valueOf());
	    if (x instanceof String) return new String(x.valueOf());
	    if (x instanceof Boolean) return new Boolean(x.valueOf());
	    if (x instanceof Date) return new Date(x.valueOf());
	    if (x && x.isBigNumber === true) return x; // bignumbers are immutable
	    if (x instanceof RegExp) throw new TypeError('Cannot clone ' + x); // TODO: clone a RegExp

	    // object
	    var m = {};
	    for (var key in x) {
	      if (x.hasOwnProperty(key)) {
	        m[key] = clone(x[key]);
	      }
	    }
	    return m;
	  };

	  /**
	   * Extend object a with the properties of object b
	   * @param {Object} a
	   * @param {Object} b
	   * @return {Object} a
	   */
	  exports.extend = function (a, b) {
	    for (var prop in b) {
	      if (b.hasOwnProperty(prop)) {
	        a[prop] = b[prop];
	      }
	    }
	    return a;
	  };

	  /**
	   * Deep extend an object a with the properties of object b
	   * @param {Object} a
	   * @param {Object} b
	   * @returns {Object}
	   */
	  exports.deepExtend = function deepExtend(a, b) {
	    // TODO: add support for Arrays to deepExtend
	    if (Array.isArray(b)) {
	      throw new TypeError('Arrays are not supported by deepExtend');
	    }

	    for (var prop in b) {
	      if (b.hasOwnProperty(prop)) {
	        if (b[prop] && b[prop].constructor === Object) {
	          if (a[prop] === undefined) {
	            a[prop] = {};
	          }
	          if (a[prop].constructor === Object) {
	            deepExtend(a[prop], b[prop]);
	          } else {
	            a[prop] = b[prop];
	          }
	        } else if (Array.isArray(b[prop])) {
	          throw new TypeError('Arrays are not supported by deepExtend');
	        } else {
	          a[prop] = b[prop];
	        }
	      }
	    }
	    return a;
	  };

	  /**
	   * Deep test equality of all fields in two pairs of arrays or objects.
	   * @param {Array | Object} a
	   * @param {Array | Object} b
	   * @returns {boolean}
	   */
	  exports.deepEqual = function deepEqual(a, b) {
	    var prop, i, len;
	    if (Array.isArray(a)) {
	      if (!Array.isArray(b)) {
	        return false;
	      }

	      if (a.length != b.length) {
	        return false;
	      }

	      for (i = 0, len = a.length; i < len; i++) {
	        if (!exports.deepEqual(a[i], b[i])) {
	          return false;
	        }
	      }
	      return true;
	    } else if (a instanceof Object) {
	      if (Array.isArray(b) || !(b instanceof Object)) {
	        return false;
	      }

	      for (prop in a) {
	        //noinspection JSUnfilteredForInLoop
	        if (!exports.deepEqual(a[prop], b[prop])) {
	          return false;
	        }
	      }
	      for (prop in b) {
	        //noinspection JSUnfilteredForInLoop
	        if (!exports.deepEqual(a[prop], b[prop])) {
	          return false;
	        }
	      }
	      return true;
	    } else {
	      return (typeof a === 'undefined' ? 'undefined' : babelHelpers.typeof(a)) === (typeof b === 'undefined' ? 'undefined' : babelHelpers.typeof(b)) && a == b;
	    }
	  };

	  /**
	   * Test whether the current JavaScript engine supports Object.defineProperty
	   * @returns {boolean} returns true if supported
	   */
	  exports.canDefineProperty = function () {
	    // test needed for broken IE8 implementation
	    try {
	      if (Object.defineProperty) {
	        Object.defineProperty({}, 'x', { get: function get() {} });
	        return true;
	      }
	    } catch (e) {}

	    return false;
	  };

	  /**
	   * Attach a lazy loading property to a constant.
	   * The given function `fn` is called once when the property is first requested.
	   * On older browsers (<IE8), the function will fall back to direct evaluation
	   * of the properties value.
	   * @param {Object} object   Object where to add the property
	   * @param {string} prop     Property name
	   * @param {Function} fn     Function returning the property value. Called
	   *                          without arguments.
	   */
	  exports.lazy = function (object, prop, fn) {
	    if (exports.canDefineProperty()) {
	      var _uninitialized = true;
	      var _value;
	      Object.defineProperty(object, prop, {
	        get: function get() {
	          if (_uninitialized) {
	            _value = fn();
	            _uninitialized = false;
	          }
	          return _value;
	        },

	        set: function set(value) {
	          _value = value;
	          _uninitialized = false;
	        },

	        configurable: true,
	        enumerable: true
	      });
	    } else {
	      // fall back to immediate evaluation
	      object[prop] = fn();
	    }
	  };

	  /**
	   * Traverse a path into an object.
	   * When a namespace is missing, it will be created
	   * @param {Object} object
	   * @param {string} path   A dot separated string like 'name.space'
	   * @return {Object} Returns the object at the end of the path
	   */
	  exports.traverse = function (object, path) {
	    var obj = object;

	    if (path) {
	      var names = path.split('.');
	      for (var i = 0; i < names.length; i++) {
	        var name = names[i];
	        if (!(name in obj)) {
	          obj[name] = {};
	        }
	        obj = obj[name];
	      }
	    }

	    return obj;
	  };

	  /**
	   * Test whether an object is a factory. a factory has fields:
	   *
	   * - factory: function (type: Object, config: Object, load: function, typed: function [, math: Object])   (required)
	   * - name: string (optional)
	   * - path: string    A dot separated path (optional)
	   * - math: boolean   If true (false by default), the math namespace is passed
	   *                   as fifth argument of the factory function
	   *
	   * @param {*} object
	   * @returns {boolean}
	   */
	  exports.isFactory = function (object) {
	    return object && typeof object.factory === 'function';
	  };
	});

	var object$1 = interopDefault(object);
	var isFactory = object.isFactory;
	var traverse = object.traverse;
	var lazy = object.lazy;
	var canDefineProperty = object.canDefineProperty;
	var deepEqual = object.deepEqual;
	var deepExtend = object.deepExtend;
	var extend = object.extend;
	var clone = object.clone;

var require$$1 = Object.freeze({
	  default: object$1,
	  isFactory: isFactory,
	  traverse: traverse,
	  lazy: lazy,
	  canDefineProperty: canDefineProperty,
	  deepEqual: deepEqual,
	  deepExtend: deepExtend,
	  extend: extend,
	  clone: clone
	});

	var typedFunction = createCommonjsModule(function (module, exports) {
	  /**
	   * typed-function
	   *
	   * Type checking for JavaScript functions
	   *
	   * https://github.com/josdejong/typed-function
	   */
	  'use strict';

	  (function (root, factory) {
	    if (typeof define === 'function' && define.amd) {
	      // AMD. Register as an anonymous module.
	      define([], factory);
	    } else if ((typeof exports === 'undefined' ? 'undefined' : babelHelpers.typeof(exports)) === 'object') {
	      // OldNode. Does not work with strict CommonJS, but
	      // only CommonJS-like environments that support module.exports,
	      // like OldNode.
	      module.exports = factory();
	    } else {
	      // Browser globals (root is window)
	      root.typed = factory();
	    }
	  })(commonjsGlobal, function () {
	    // factory function to create a new instance of typed-function
	    // TODO: allow passing configuration, types, tests via the factory function
	    function create() {
	      /**
	       * Get a type test function for a specific data type
	       * @param {string} name                   Name of a data type like 'number' or 'string'
	       * @returns {Function(obj: *) : boolean}  Returns a type testing function.
	       *                                        Throws an error for an unknown type.
	       */
	      function getTypeTest(name) {
	        var test;
	        for (var i = 0; i < typed.types.length; i++) {
	          var entry = typed.types[i];
	          if (entry.name === name) {
	            test = entry.test;
	            break;
	          }
	        }

	        if (!test) {
	          var hint;
	          for (i = 0; i < typed.types.length; i++) {
	            entry = typed.types[i];
	            if (entry.name.toLowerCase() == name.toLowerCase()) {
	              hint = entry.name;
	              break;
	            }
	          }

	          throw new Error('Unknown type "' + name + '"' + (hint ? '. Did you mean "' + hint + '"?' : ''));
	        }
	        return test;
	      }

	      /**
	       * Retrieve the function name from a set of functions, and check
	       * whether the name of all functions match (if given)
	       * @param {Array.<function>} fns
	       */
	      function getName(fns) {
	        var name = '';

	        for (var i = 0; i < fns.length; i++) {
	          var fn = fns[i];

	          // merge function name when this is a typed function
	          if (fn.signatures && fn.name != '') {
	            if (name == '') {
	              name = fn.name;
	            } else if (name != fn.name) {
	              var err = new Error('Function names do not match (expected: ' + name + ', actual: ' + fn.name + ')');
	              err.data = {
	                actual: fn.name,
	                expected: name
	              };
	              throw err;
	            }
	          }
	        }

	        return name;
	      }

	      /**
	       * Create an ArgumentsError. Creates messages like:
	       *
	       *   Unexpected type of argument (expected: ..., actual: ..., index: ...)
	       *   Too few arguments (expected: ..., index: ...)
	       *   Too many arguments (expected: ..., actual: ...)
	       *
	       * @param {String} fn         Function name
	       * @param {number} argCount   Number of arguments
	       * @param {Number} index      Current argument index
	       * @param {*} actual          Current argument
	       * @param {string} [expected] An optional, comma separated string with
	       *                            expected types on given index
	       * @extends Error
	       */
	      function createError(fn, argCount, index, actual, expected) {
	        var actualType = getTypeOf(actual);
	        var _expected = expected ? expected.split(',') : null;
	        var _fn = fn || 'unnamed';
	        var anyType = _expected && contains(_expected, 'any');
	        var message;
	        var data = {
	          fn: fn,
	          index: index,
	          actual: actual,
	          expected: _expected
	        };

	        if (_expected) {
	          if (argCount > index && !anyType) {
	            // unexpected type
	            message = 'Unexpected type of argument in function ' + _fn + ' (expected: ' + _expected.join(' or ') + ', actual: ' + actualType + ', index: ' + index + ')';
	          } else {
	            // too few arguments
	            message = 'Too few arguments in function ' + _fn + ' (expected: ' + _expected.join(' or ') + ', index: ' + index + ')';
	          }
	        } else {
	          // too many arguments
	          message = 'Too many arguments in function ' + _fn + ' (expected: ' + index + ', actual: ' + argCount + ')';
	        }

	        var err = new TypeError(message);
	        err.data = data;
	        return err;
	      }

	      /**
	       * Collection with function references (local shortcuts to functions)
	       * @constructor
	       * @param {string} [name='refs']  Optional name for the refs, used to generate
	       *                                JavaScript code
	       */
	      function Refs(name) {
	        this.name = name || 'refs';
	        this.categories = {};
	      }

	      /**
	       * Add a function reference.
	       * @param {Function} fn
	       * @param {string} [category='fn']    A function category, like 'fn' or 'signature'
	       * @returns {string} Returns the function name, for example 'fn0' or 'signature2'
	       */
	      Refs.prototype.add = function (fn, category) {
	        var cat = category || 'fn';
	        if (!this.categories[cat]) this.categories[cat] = [];

	        var index = this.categories[cat].indexOf(fn);
	        if (index == -1) {
	          index = this.categories[cat].length;
	          this.categories[cat].push(fn);
	        }

	        return cat + index;
	      };

	      /**
	       * Create code lines for all function references
	       * @returns {string} Returns the code containing all function references
	       */
	      Refs.prototype.toCode = function () {
	        var code = [];
	        var path = this.name + '.categories';
	        var categories = this.categories;

	        for (var cat in categories) {
	          if (categories.hasOwnProperty(cat)) {
	            var category = categories[cat];

	            for (var i = 0; i < category.length; i++) {
	              code.push('var ' + cat + i + ' = ' + path + '[\'' + cat + '\'][' + i + '];');
	            }
	          }
	        }

	        return code.join('\n');
	      };

	      /**
	       * A function parameter
	       * @param {string | string[] | Param} types    A parameter type like 'string',
	       *                                             'number | boolean'
	       * @param {boolean} [varArgs=false]            Variable arguments if true
	       * @constructor
	       */
	      function Param(types, varArgs) {
	        // parse the types, can be a string with types separated by pipe characters |
	        if (typeof types === 'string') {
	          // parse variable arguments operator (ellipses '...number')
	          var _types = types.trim();
	          var _varArgs = _types.substr(0, 3) === '...';
	          if (_varArgs) {
	            _types = _types.substr(3);
	          }
	          if (_types === '') {
	            this.types = ['any'];
	          } else {
	            this.types = _types.split('|');
	            for (var i = 0; i < this.types.length; i++) {
	              this.types[i] = this.types[i].trim();
	            }
	          }
	        } else if (Array.isArray(types)) {
	          this.types = types;
	        } else if (types instanceof Param) {
	          return types.clone();
	        } else {
	          throw new Error('String or Array expected');
	        }

	        // can hold a type to which to convert when handling this parameter
	        this.conversions = [];
	        // TODO: implement better API for conversions, be able to add conversions via constructor (support a new type Object?)

	        // variable arguments
	        this.varArgs = _varArgs || varArgs || false;

	        // check for any type arguments
	        this.anyType = this.types.indexOf('any') !== -1;
	      }

	      /**
	       * Order Params
	       * any type ('any') will be ordered last, and object as second last (as other
	       * types may be an object as well, like Array).
	       *
	       * @param {Param} a
	       * @param {Param} b
	       * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
	       */
	      Param.compare = function (a, b) {
	        // TODO: simplify parameter comparison, it's a mess
	        if (a.anyType) return 1;
	        if (b.anyType) return -1;

	        if (contains(a.types, 'Object')) return 1;
	        if (contains(b.types, 'Object')) return -1;

	        if (a.hasConversions()) {
	          if (b.hasConversions()) {
	            var i, ac, bc;

	            for (i = 0; i < a.conversions.length; i++) {
	              if (a.conversions[i] !== undefined) {
	                ac = a.conversions[i];
	                break;
	              }
	            }

	            for (i = 0; i < b.conversions.length; i++) {
	              if (b.conversions[i] !== undefined) {
	                bc = b.conversions[i];
	                break;
	              }
	            }

	            return typed.conversions.indexOf(ac) - typed.conversions.indexOf(bc);
	          } else {
	            return 1;
	          }
	        } else {
	          if (b.hasConversions()) {
	            return -1;
	          } else {
	            // both params have no conversions
	            var ai, bi;

	            for (i = 0; i < typed.types.length; i++) {
	              if (typed.types[i].name === a.types[0]) {
	                ai = i;
	                break;
	              }
	            }

	            for (i = 0; i < typed.types.length; i++) {
	              if (typed.types[i].name === b.types[0]) {
	                bi = i;
	                break;
	              }
	            }

	            return ai - bi;
	          }
	        }
	      };

	      /**
	       * Test whether this parameters types overlap an other parameters types.
	       * @param {Param} other
	       * @return {boolean} Returns true when there are conflicting types
	       */
	      Param.prototype.overlapping = function (other) {
	        for (var i = 0; i < this.types.length; i++) {
	          if (contains(other.types, this.types[i])) {
	            return true;
	          }
	        }
	        return false;
	      };

	      /**
	       * Create a clone of this param
	       * @returns {Param} Returns a cloned version of this param
	       */
	      Param.prototype.clone = function () {
	        var param = new Param(this.types.slice(), this.varArgs);
	        param.conversions = this.conversions.slice();
	        return param;
	      };

	      /**
	       * Test whether this parameter contains conversions
	       * @returns {boolean} Returns true if the parameter contains one or
	       *                    multiple conversions.
	       */
	      Param.prototype.hasConversions = function () {
	        return this.conversions.length > 0;
	      };

	      /**
	       * Tests whether this parameters contains any of the provided types
	       * @param {Object} types  A Map with types, like {'number': true}
	       * @returns {boolean}     Returns true when the parameter contains any
	       *                        of the provided types
	       */
	      Param.prototype.contains = function (types) {
	        for (var i = 0; i < this.types.length; i++) {
	          if (types[this.types[i]]) {
	            return true;
	          }
	        }
	        return false;
	      };

	      /**
	       * Return a string representation of this params types, like 'string' or
	       * 'number | boolean' or '...number'
	       * @param {boolean} [toConversion]   If true, the returned types string
	       *                                   contains the types where the parameter
	       *                                   will convert to. If false (default)
	       *                                   the "from" types are returned
	       * @returns {string}
	       */
	      Param.prototype.toString = function (toConversion) {
	        var types = [];
	        var keys = {};

	        for (var i = 0; i < this.types.length; i++) {
	          var conversion = this.conversions[i];
	          var type = toConversion && conversion ? conversion.to : this.types[i];
	          if (!(type in keys)) {
	            keys[type] = true;
	            types.push(type);
	          }
	        }

	        return (this.varArgs ? '...' : '') + types.join('|');
	      };

	      /**
	       * A function signature
	       * @param {string | string[] | Param[]} params
	       *                         Array with the type(s) of each parameter,
	       *                         or a comma separated string with types
	       * @param {Function} fn    The actual function
	       * @constructor
	       */
	      function Signature(params, fn) {
	        var _params;
	        if (typeof params === 'string') {
	          _params = params !== '' ? params.split(',') : [];
	        } else if (Array.isArray(params)) {
	          _params = params;
	        } else {
	          throw new Error('string or Array expected');
	        }

	        this.params = new Array(_params.length);
	        for (var i = 0; i < _params.length; i++) {
	          var param = new Param(_params[i]);
	          this.params[i] = param;
	          if (i === _params.length - 1) {
	            // the last argument
	            this.varArgs = param.varArgs;
	          } else {
	            // non-last argument
	            if (param.varArgs) {
	              throw new SyntaxError('Unexpected variable arguments operator "..."');
	            }
	          }
	        }

	        this.fn = fn;
	      }

	      /**
	       * Create a clone of this signature
	       * @returns {Signature} Returns a cloned version of this signature
	       */
	      Signature.prototype.clone = function () {
	        return new Signature(this.params.slice(), this.fn);
	      };

	      /**
	       * Expand a signature: split params with union types in separate signatures
	       * For example split a Signature "string | number" into two signatures.
	       * @return {Signature[]} Returns an array with signatures (at least one)
	       */
	      Signature.prototype.expand = function () {
	        var signatures = [];

	        function recurse(signature, path) {
	          if (path.length < signature.params.length) {
	            var i, newParam, conversion;

	            var param = signature.params[path.length];
	            if (param.varArgs) {
	              // a variable argument. do not split the types in the parameter
	              newParam = param.clone();

	              // add conversions to the parameter
	              // recurse for all conversions
	              for (i = 0; i < typed.conversions.length; i++) {
	                conversion = typed.conversions[i];
	                if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
	                  var j = newParam.types.length;
	                  newParam.types[j] = conversion.from;
	                  newParam.conversions[j] = conversion;
	                }
	              }

	              recurse(signature, path.concat(newParam));
	            } else {
	              // split each type in the parameter
	              for (i = 0; i < param.types.length; i++) {
	                recurse(signature, path.concat(new Param(param.types[i])));
	              }

	              // recurse for all conversions
	              for (i = 0; i < typed.conversions.length; i++) {
	                conversion = typed.conversions[i];
	                if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
	                  newParam = new Param(conversion.from);
	                  newParam.conversions[0] = conversion;
	                  recurse(signature, path.concat(newParam));
	                }
	              }
	            }
	          } else {
	            signatures.push(new Signature(path, signature.fn));
	          }
	        }

	        recurse(this, []);

	        return signatures;
	      };

	      /**
	       * Compare two signatures.
	       *
	       * When two params are equal and contain conversions, they will be sorted
	       * by lowest index of the first conversions.
	       *
	       * @param {Signature} a
	       * @param {Signature} b
	       * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
	       */
	      Signature.compare = function (a, b) {
	        if (a.params.length > b.params.length) return 1;
	        if (a.params.length < b.params.length) return -1;

	        // count the number of conversions
	        var i;
	        var len = a.params.length; // a and b have equal amount of params
	        var ac = 0;
	        var bc = 0;
	        for (i = 0; i < len; i++) {
	          if (a.params[i].hasConversions()) ac++;
	          if (b.params[i].hasConversions()) bc++;
	        }

	        if (ac > bc) return 1;
	        if (ac < bc) return -1;

	        // compare the order per parameter
	        for (i = 0; i < a.params.length; i++) {
	          var cmp = Param.compare(a.params[i], b.params[i]);
	          if (cmp !== 0) {
	            return cmp;
	          }
	        }

	        return 0;
	      };

	      /**
	       * Test whether any of the signatures parameters has conversions
	       * @return {boolean} Returns true when any of the parameters contains
	       *                   conversions.
	       */
	      Signature.prototype.hasConversions = function () {
	        for (var i = 0; i < this.params.length; i++) {
	          if (this.params[i].hasConversions()) {
	            return true;
	          }
	        }
	        return false;
	      };

	      /**
	       * Test whether this signature should be ignored.
	       * Checks whether any of the parameters contains a type listed in
	       * typed.ignore
	       * @return {boolean} Returns true when the signature should be ignored
	       */
	      Signature.prototype.ignore = function () {
	        // create a map with ignored types
	        var types = {};
	        for (var i = 0; i < typed.ignore.length; i++) {
	          types[typed.ignore[i]] = true;
	        }

	        // test whether any of the parameters contains this type
	        for (i = 0; i < this.params.length; i++) {
	          if (this.params[i].contains(types)) {
	            return true;
	          }
	        }

	        return false;
	      };

	      /**
	       * Generate the code to invoke this signature
	       * @param {Refs} refs
	       * @param {string} prefix
	       * @returns {string} Returns code
	       */
	      Signature.prototype.toCode = function (refs, prefix) {
	        var code = [];

	        var args = new Array(this.params.length);
	        for (var i = 0; i < this.params.length; i++) {
	          var param = this.params[i];
	          var conversion = param.conversions[0];
	          if (param.varArgs) {
	            args[i] = 'varArgs';
	          } else if (conversion) {
	            args[i] = refs.add(conversion.convert, 'convert') + '(arg' + i + ')';
	          } else {
	            args[i] = 'arg' + i;
	          }
	        }

	        var ref = this.fn ? refs.add(this.fn, 'signature') : undefined;
	        if (ref) {
	          return prefix + 'return ' + ref + '(' + args.join(', ') + '); // signature: ' + this.params.join(', ');
	        }

	        return code.join('\n');
	      };

	      /**
	       * Return a string representation of the signature
	       * @returns {string}
	       */
	      Signature.prototype.toString = function () {
	        return this.params.join(', ');
	      };

	      /**
	       * A group of signatures with the same parameter on given index
	       * @param {Param[]} path
	       * @param {Signature} [signature]
	       * @param {Node[]} childs
	       * @constructor
	       */
	      function Node(path, signature, childs) {
	        this.path = path || [];
	        this.param = path[path.length - 1] || null;
	        this.signature = signature || null;
	        this.childs = childs || [];
	      }

	      /**
	       * Generate code for this group of signatures
	       * @param {Refs} refs
	       * @param {string} prefix
	       * @param {Node | undefined} [anyType]  Sibling of this node with any type parameter
	       * @returns {string} Returns the code as string
	       */
	      Node.prototype.toCode = function (refs, prefix, anyType) {
	        // TODO: split this function in multiple functions, it's too large
	        var code = [];

	        if (this.param) {
	          var index = this.path.length - 1;
	          var conversion = this.param.conversions[0];
	          var comment = '// type: ' + (conversion ? conversion.from + ' (convert to ' + conversion.to + ')' : this.param);

	          // non-root node (path is non-empty)
	          if (this.param.varArgs) {
	            if (this.param.anyType) {
	              // variable arguments with any type
	              code.push(prefix + 'if (arguments.length > ' + index + ') {');
	              code.push(prefix + '  var varArgs = [];');
	              code.push(prefix + '  for (var i = ' + index + '; i < arguments.length; i++) {');
	              code.push(prefix + '    varArgs.push(arguments[i]);');
	              code.push(prefix + '  }');
	              code.push(this.signature.toCode(refs, prefix + '  '));
	              code.push(prefix + '}');
	            } else {
	              // variable arguments with a fixed type
	              var getTests = function (types, arg) {
	                var tests = [];
	                for (var i = 0; i < types.length; i++) {
	                  tests[i] = refs.add(getTypeTest(types[i]), 'test') + '(' + arg + ')';
	                }
	                return tests.join(' || ');
	              }.bind(this);

	              var allTypes = this.param.types;
	              var exactTypes = [];
	              for (var i = 0; i < allTypes.length; i++) {
	                if (this.param.conversions[i] === undefined) {
	                  exactTypes.push(allTypes[i]);
	                }
	              }

	              code.push(prefix + 'if (' + getTests(allTypes, 'arg' + index) + ') { ' + comment);
	              code.push(prefix + '  var varArgs = [arg' + index + '];');
	              code.push(prefix + '  for (var i = ' + (index + 1) + '; i < arguments.length; i++) {');
	              code.push(prefix + '    if (' + getTests(exactTypes, 'arguments[i]') + ') {');
	              code.push(prefix + '      varArgs.push(arguments[i]);');

	              for (var i = 0; i < allTypes.length; i++) {
	                var conversion_i = this.param.conversions[i];
	                if (conversion_i) {
	                  var test = refs.add(getTypeTest(allTypes[i]), 'test');
	                  var convert = refs.add(conversion_i.convert, 'convert');
	                  code.push(prefix + '    }');
	                  code.push(prefix + '    else if (' + test + '(arguments[i])) {');
	                  code.push(prefix + '      varArgs.push(' + convert + '(arguments[i]));');
	                }
	              }
	              code.push(prefix + '    } else {');
	              code.push(prefix + '      throw createError(name, arguments.length, i, arguments[i], \'' + exactTypes.join(',') + '\');');
	              code.push(prefix + '    }');
	              code.push(prefix + '  }');
	              code.push(this.signature.toCode(refs, prefix + '  '));
	              code.push(prefix + '}');
	            }
	          } else {
	            if (this.param.anyType) {
	              // any type
	              code.push(prefix + '// type: any');
	              code.push(this._innerCode(refs, prefix, anyType));
	            } else {
	              // regular type
	              var type = this.param.types[0];
	              var test = type !== 'any' ? refs.add(getTypeTest(type), 'test') : null;

	              code.push(prefix + 'if (' + test + '(arg' + index + ')) { ' + comment);
	              code.push(this._innerCode(refs, prefix + '  ', anyType));
	              code.push(prefix + '}');
	            }
	          }
	        } else {
	          // root node (path is empty)
	          code.push(this._innerCode(refs, prefix, anyType));
	        }

	        return code.join('\n');
	      };

	      /**
	       * Generate inner code for this group of signatures.
	       * This is a helper function of Node.prototype.toCode
	       * @param {Refs} refs
	       * @param {string} prefix
	       * @param {Node | undefined} [anyType]  Sibling of this node with any type parameter
	       * @returns {string} Returns the inner code as string
	       * @private
	       */
	      Node.prototype._innerCode = function (refs, prefix, anyType) {
	        var code = [];
	        var i;

	        if (this.signature) {
	          code.push(prefix + 'if (arguments.length === ' + this.path.length + ') {');
	          code.push(this.signature.toCode(refs, prefix + '  '));
	          code.push(prefix + '}');
	        }

	        var nextAnyType;
	        for (i = 0; i < this.childs.length; i++) {
	          if (this.childs[i].param.anyType) {
	            nextAnyType = this.childs[i];
	            break;
	          }
	        }

	        for (i = 0; i < this.childs.length; i++) {
	          code.push(this.childs[i].toCode(refs, prefix, nextAnyType));
	        }

	        if (anyType && !this.param.anyType) {
	          code.push(anyType.toCode(refs, prefix, nextAnyType));
	        }

	        var exceptions = this._exceptions(refs, prefix);
	        if (exceptions) {
	          code.push(exceptions);
	        }

	        return code.join('\n');
	      };

	      /**
	       * Generate code to throw exceptions
	       * @param {Refs} refs
	       * @param {string} prefix
	       * @returns {string} Returns the inner code as string
	       * @private
	       */
	      Node.prototype._exceptions = function (refs, prefix) {
	        var index = this.path.length;

	        if (this.childs.length === 0) {
	          // TODO: can this condition be simplified? (we have a fall-through here)
	          return [prefix + 'if (arguments.length > ' + index + ') {', prefix + '  throw createError(name, arguments.length, ' + index + ', arguments[' + index + ']);', prefix + '}'].join('\n');
	        } else {
	          var keys = {};
	          var types = [];

	          for (var i = 0; i < this.childs.length; i++) {
	            var node = this.childs[i];
	            if (node.param) {
	              for (var j = 0; j < node.param.types.length; j++) {
	                var type = node.param.types[j];
	                if (!(type in keys) && !node.param.conversions[j]) {
	                  keys[type] = true;
	                  types.push(type);
	                }
	              }
	            }
	          }

	          return prefix + 'throw createError(name, arguments.length, ' + index + ', arguments[' + index + '], \'' + types.join(',') + '\');';
	        }
	      };

	      /**
	       * Split all raw signatures into an array with expanded Signatures
	       * @param {Object.<string, Function>} rawSignatures
	       * @return {Signature[]} Returns an array with expanded signatures
	       */
	      function parseSignatures(rawSignatures) {
	        // FIXME: need to have deterministic ordering of signatures, do not create via object
	        var signature;
	        var keys = {};
	        var signatures = [];
	        var i;

	        for (var types in rawSignatures) {
	          if (rawSignatures.hasOwnProperty(types)) {
	            var fn = rawSignatures[types];
	            signature = new Signature(types, fn);

	            if (signature.ignore()) {
	              continue;
	            }

	            var expanded = signature.expand();

	            for (i = 0; i < expanded.length; i++) {
	              var signature_i = expanded[i];
	              var key = signature_i.toString();
	              var existing = keys[key];
	              if (!existing) {
	                keys[key] = signature_i;
	              } else {
	                var cmp = Signature.compare(signature_i, existing);
	                if (cmp < 0) {
	                  // override if sorted first
	                  keys[key] = signature_i;
	                } else if (cmp === 0) {
	                  throw new Error('Signature "' + key + '" is defined twice');
	                }
	                // else: just ignore
	              }
	            }
	          }
	        }

	        // convert from map to array
	        for (key in keys) {
	          if (keys.hasOwnProperty(key)) {
	            signatures.push(keys[key]);
	          }
	        }

	        // order the signatures
	        signatures.sort(function (a, b) {
	          return Signature.compare(a, b);
	        });

	        // filter redundant conversions from signatures with varArgs
	        // TODO: simplify this loop or move it to a separate function
	        for (i = 0; i < signatures.length; i++) {
	          signature = signatures[i];

	          if (signature.varArgs) {
	            var index = signature.params.length - 1;
	            var param = signature.params[index];

	            var t = 0;
	            while (t < param.types.length) {
	              if (param.conversions[t]) {
	                var type = param.types[t];

	                for (var j = 0; j < signatures.length; j++) {
	                  var other = signatures[j];
	                  var p = other.params[index];

	                  if (other !== signature && p && contains(p.types, type) && !p.conversions[index]) {
	                    // this (conversion) type already exists, remove it
	                    param.types.splice(t, 1);
	                    param.conversions.splice(t, 1);
	                    t--;
	                    break;
	                  }
	                }
	              }
	              t++;
	            }
	          }
	        }

	        return signatures;
	      }

	      /**
	       * create a map with normalized signatures as key and the function as value
	       * @param {Signature[]} signatures   An array with split signatures
	       * @return {Object.<string, Function>} Returns a map with normalized
	       *                                     signatures as key, and the function
	       *                                     as value.
	       */
	      function mapSignatures(signatures) {
	        var normalized = {};

	        for (var i = 0; i < signatures.length; i++) {
	          var signature = signatures[i];
	          if (signature.fn && !signature.hasConversions()) {
	            var params = signature.params.join(',');
	            normalized[params] = signature.fn;
	          }
	        }

	        return normalized;
	      }

	      /**
	       * Parse signatures recursively in a node tree.
	       * @param {Signature[]} signatures  Array with expanded signatures
	       * @param {Param[]} path            Traversed path of parameter types
	       * @return {Node}                   Returns a node tree
	       */
	      function parseTree(signatures, path) {
	        var i, signature;
	        var index = path.length;
	        var nodeSignature;

	        var filtered = [];
	        for (i = 0; i < signatures.length; i++) {
	          signature = signatures[i];

	          // filter the first signature with the correct number of params
	          if (signature.params.length === index && !nodeSignature) {
	            nodeSignature = signature;
	          }

	          if (signature.params[index] != undefined) {
	            filtered.push(signature);
	          }
	        }

	        // sort the filtered signatures by param
	        filtered.sort(function (a, b) {
	          return Param.compare(a.params[index], b.params[index]);
	        });

	        // recurse over the signatures
	        var entries = [];
	        for (i = 0; i < filtered.length; i++) {
	          signature = filtered[i];
	          // group signatures with the same param at current index
	          var param = signature.params[index];

	          // TODO: replace the next filter loop
	          var existing = entries.filter(function (entry) {
	            return entry.param.overlapping(param);
	          })[0];

	          //var existing;
	          //for (var j = 0; j < entries.length; j++) {
	          //  if (entries[j].param.overlapping(param)) {
	          //    existing = entries[j];
	          //    break;
	          //  }
	          //}

	          if (existing) {
	            if (existing.param.varArgs) {
	              throw new Error('Conflicting types "' + existing.param + '" and "' + param + '"');
	            }
	            existing.signatures.push(signature);
	          } else {
	            entries.push({
	              param: param,
	              signatures: [signature]
	            });
	          }
	        }

	        // parse the childs
	        var childs = new Array(entries.length);
	        for (i = 0; i < entries.length; i++) {
	          var entry = entries[i];
	          childs[i] = parseTree(entry.signatures, path.concat(entry.param));
	        }

	        return new Node(path, nodeSignature, childs);
	      }

	      /**
	       * Generate an array like ['arg0', 'arg1', 'arg2']
	       * @param {number} count Number of arguments to generate
	       * @returns {Array} Returns an array with argument names
	       */
	      function getArgs(count) {
	        // create an array with all argument names
	        var args = [];
	        for (var i = 0; i < count; i++) {
	          args[i] = 'arg' + i;
	        }

	        return args;
	      }

	      /**
	       * Compose a function from sub-functions each handling a single type signature.
	       * Signatures:
	       *   typed(signature: string, fn: function)
	       *   typed(name: string, signature: string, fn: function)
	       *   typed(signatures: Object.<string, function>)
	       *   typed(name: string, signatures: Object.<string, function>)
	       *
	       * @param {string | null} name
	       * @param {Object.<string, Function>} signatures
	       * @return {Function} Returns the typed function
	       * @private
	       */
	      function _typed(name, signatures) {
	        var refs = new Refs();

	        // parse signatures, expand them
	        var _signatures = parseSignatures(signatures);
	        if (_signatures.length == 0) {
	          throw new Error('No signatures provided');
	        }

	        // parse signatures into a node tree
	        var node = parseTree(_signatures, []);

	        //var util = require('util');
	        //console.log('ROOT');
	        //console.log(util.inspect(node, { depth: null }));

	        // generate code for the typed function
	        var code = [];
	        var _name = name || '';
	        var _args = getArgs(maxParams(_signatures));
	        code.push('function ' + _name + '(' + _args.join(', ') + ') {');
	        code.push('  "use strict";');
	        code.push('  var name = \'' + _name + '\';');
	        code.push(node.toCode(refs, '  '));
	        code.push('}');

	        // generate body for the factory function
	        var body = [refs.toCode(), 'return ' + code.join('\n')].join('\n');

	        // evaluate the JavaScript code and attach function references
	        var factory = new Function(refs.name, 'createError', body);
	        var fn = factory(refs, createError);

	        //console.log('FN\n' + fn.toString()); // TODO: cleanup

	        // attach the signatures with sub-functions to the constructed function
	        fn.signatures = mapSignatures(_signatures);

	        return fn;
	      }

	      /**
	       * Calculate the maximum number of parameters in givens signatures
	       * @param {Signature[]} signatures
	       * @returns {number} The maximum number of parameters
	       */
	      function maxParams(signatures) {
	        var max = 0;

	        for (var i = 0; i < signatures.length; i++) {
	          var len = signatures[i].params.length;
	          if (len > max) {
	            max = len;
	          }
	        }

	        return max;
	      }

	      /**
	       * Get the type of a value
	       * @param {*} x
	       * @returns {string} Returns a string with the type of value
	       */
	      function getTypeOf(x) {
	        var obj;

	        for (var i = 0; i < typed.types.length; i++) {
	          var entry = typed.types[i];

	          if (entry.name === 'Object') {
	            // Array and Date are also Object, so test for Object afterwards
	            obj = entry;
	          } else {
	            if (entry.test(x)) return entry.name;
	          }
	        }

	        // at last, test whether an object
	        if (obj && obj.test(x)) return obj.name;

	        return 'unknown';
	      }

	      /**
	       * Test whether an array contains some entry
	       * @param {Array} array
	       * @param {*} entry
	       * @return {boolean} Returns true if array contains entry, false if not.
	       */
	      function contains(array, entry) {
	        return array.indexOf(entry) !== -1;
	      }

	      // data type tests
	      var types = [{ name: 'number', test: function test(x) {
	          return typeof x === 'number';
	        } }, { name: 'string', test: function test(x) {
	          return typeof x === 'string';
	        } }, { name: 'boolean', test: function test(x) {
	          return typeof x === 'boolean';
	        } }, { name: 'Function', test: function test(x) {
	          return typeof x === 'function';
	        } }, { name: 'Array', test: Array.isArray }, { name: 'Date', test: function test(x) {
	          return x instanceof Date;
	        } }, { name: 'RegExp', test: function test(x) {
	          return x instanceof RegExp;
	        } }, { name: 'Object', test: function test(x) {
	          return (typeof x === 'undefined' ? 'undefined' : babelHelpers.typeof(x)) === 'object';
	        } }, { name: 'null', test: function test(x) {
	          return x === null;
	        } }, { name: 'undefined', test: function test(x) {
	          return x === undefined;
	        } }];

	      // configuration
	      var config = {};

	      // type conversions. Order is important
	      var conversions = [];

	      // types to be ignored
	      var ignore = [];

	      // temporary object for holding types and conversions, for constructing
	      // the `typed` function itself
	      // TODO: find a more elegant solution for this
	      var typed = {
	        config: config,
	        types: types,
	        conversions: conversions,
	        ignore: ignore
	      };

	      /**
	       * Construct the typed function itself with various signatures
	       *
	       * Signatures:
	       *
	       *   typed(signatures: Object.<string, function>)
	       *   typed(name: string, signatures: Object.<string, function>)
	       */
	      typed = _typed('typed', {
	        'Object': function Object(signatures) {
	          var fns = [];
	          for (var signature in signatures) {
	            if (signatures.hasOwnProperty(signature)) {
	              fns.push(signatures[signature]);
	            }
	          }
	          var name = getName(fns);

	          return _typed(name, signatures);
	        },
	        'string, Object': _typed,
	        // TODO: add a signature 'Array.<function>'
	        '...Function': function Function(fns) {
	          var err;
	          var name = getName(fns);
	          var signatures = {};

	          for (var i = 0; i < fns.length; i++) {
	            var fn = fns[i];

	            // test whether this is a typed-function
	            if (!(babelHelpers.typeof(fn.signatures) === 'object')) {
	              err = new TypeError('Function is no typed-function (index: ' + i + ')');
	              err.data = { index: i };
	              throw err;
	            }

	            // merge the signatures
	            for (var signature in fn.signatures) {
	              if (fn.signatures.hasOwnProperty(signature)) {
	                if (signatures.hasOwnProperty(signature)) {
	                  if (fn.signatures[signature] !== signatures[signature]) {
	                    err = new Error('Signature "' + signature + '" is defined twice');
	                    err.data = { signature: signature };
	                    throw err;
	                  }
	                  // else: both signatures point to the same function, that's fine
	                } else {
	                  signatures[signature] = fn.signatures[signature];
	                }
	              }
	            }
	          }

	          return _typed(name, signatures);
	        }
	      });

	      /**
	       * Find a specific signature from a (composed) typed function, for
	       * example:
	       *
	       *   typed.find(fn, ['number', 'string'])
	       *   typed.find(fn, 'number, string')
	       *
	       * Function find only only works for exact matches.
	       *
	       * @param {Function} fn                   A typed-function
	       * @param {string | string[]} signature   Signature to be found, can be
	       *                                        an array or a comma separated string.
	       * @return {Function}                     Returns the matching signature, or
	       *                                        throws an errror when no signature
	       *                                        is found.
	       */
	      function find(fn, signature) {
	        if (!fn.signatures) {
	          throw new TypeError('Function is no typed-function');
	        }

	        // normalize input
	        var arr;
	        if (typeof signature === 'string') {
	          arr = signature.split(',');
	          for (var i = 0; i < arr.length; i++) {
	            arr[i] = arr[i].trim();
	          }
	        } else if (Array.isArray(signature)) {
	          arr = signature;
	        } else {
	          throw new TypeError('String array or a comma separated string expected');
	        }

	        var str = arr.join(',');

	        // find an exact match
	        var match = fn.signatures[str];
	        if (match) {
	          return match;
	        }

	        // TODO: extend find to match non-exact signatures

	        throw new TypeError('Signature not found (signature: ' + (fn.name || 'unnamed') + '(' + arr.join(', ') + '))');
	      }

	      /**
	       * Convert a given value to another data type.
	       * @param {*} value
	       * @param {string} type
	       */
	      function convert(value, type) {
	        var from = getTypeOf(value);

	        // check conversion is needed
	        if (type === from) {
	          return value;
	        }

	        for (var i = 0; i < typed.conversions.length; i++) {
	          var conversion = typed.conversions[i];
	          if (conversion.from === from && conversion.to === type) {
	            return conversion.convert(value);
	          }
	        }

	        throw new Error('Cannot convert from ' + from + ' to ' + type);
	      }

	      // attach types and conversions to the final `typed` function
	      typed.config = config;
	      typed.types = types;
	      typed.conversions = conversions;
	      typed.ignore = ignore;
	      typed.create = create;
	      typed.find = find;
	      typed.convert = convert;

	      // add a type
	      typed.addType = function (type) {
	        if (!type || typeof type.name !== 'string' || typeof type.test !== 'function') {
	          throw new TypeError('Object with properties {name: string, test: function} expected');
	        }

	        typed.types.push(type);
	      };

	      // add a conversion
	      typed.addConversion = function (conversion) {
	        if (!conversion || typeof conversion.from !== 'string' || typeof conversion.to !== 'string' || typeof conversion.convert !== 'function') {
	          throw new TypeError('Object with properties {from: string, to: string, convert: function} expected');
	        }

	        typed.conversions.push(conversion);
	      };

	      return typed;
	    }

	    return create();
	  });
	});

	var typedFunction$1 = interopDefault(typedFunction);

var require$$1$1 = Object.freeze({
	  default: typedFunction$1
	});

	var NumberFormatter = createCommonjsModule(function (module) {
	  'use strict';

	  /**
	   * Format a number using methods toPrecision, toFixed, toExponential.
	   * @param {number | string} value
	   * @constructor
	   */

	  function NumberFormatter(value) {
	    // parse the input value
	    var match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
	    if (!match) {
	      throw new SyntaxError('Invalid number');
	    }

	    var sign = match[1];
	    var coefficients = match[2];
	    var exponent = parseFloat(match[4] || '0');

	    var dot = coefficients.indexOf('.');
	    exponent += dot !== -1 ? dot - 1 : coefficients.length - 1;

	    this.sign = sign;
	    this.coefficients = coefficients.replace('.', '') // remove the dot (must be removed before removing leading zeros)
	    .replace(/^0*/, function (zeros) {
	      // remove leading zeros, add their count to the exponent
	      exponent -= zeros.length;
	      return '';
	    }).replace(/0*$/, '') // remove trailing zeros
	    .split('').map(function (d) {
	      return parseInt(d);
	    });

	    if (this.coefficients.length === 0) {
	      this.coefficients.push(0);
	      exponent++;
	    }

	    this.exponent = exponent;
	  }

	  /**
	   * Format a number with engineering notation.
	   * @param {number} [precision=0]        Optional number of decimals after the
	   *                                      decimal point. Zero by default.
	   */
	  NumberFormatter.prototype.toEngineering = function (precision) {
	    var rounded = this.roundDigits(precision);

	    var e = rounded.exponent;
	    var c = rounded.coefficients;

	    // find nearest lower multiple of 3 for exponent
	    var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3;

	    // concatenate coefficients with necessary zeros
	    var significandsDiff = e >= 0 ? e : Math.abs(newExp);

	    // add zeros if necessary (for ex: 1e+8)
	    if (c.length - 1 < significandsDiff) c = c.concat(zeros(significandsDiff - (c.length - 1)));

	    // find difference in exponents
	    var expDiff = Math.abs(e - newExp);

	    var decimalIdx = 1;
	    var str = '';

	    // push decimal index over by expDiff times
	    while (--expDiff >= 0) {
	      decimalIdx++;
	    } // if all coefficient values are zero after the decimal point, don't add a decimal value. 
	    // otherwise concat with the rest of the coefficients
	    var decimals = c.slice(decimalIdx).join('');
	    var decimalVal = decimals.match(/[1-9]/) ? '.' + decimals : '';

	    str = c.slice(0, decimalIdx).join('') + decimalVal;

	    str += 'e' + (e >= 0 ? '+' : '') + newExp.toString();
	    return rounded.sign + str;
	  };

	  /**
	   * Format a number with fixed notation.
	   * @param {number} [precision=0]        Optional number of decimals after the
	   *                                      decimal point. Zero by default.
	   */
	  NumberFormatter.prototype.toFixed = function (precision) {
	    var rounded = this.roundDigits(this.exponent + 1 + (precision || 0));
	    var c = rounded.coefficients;
	    var p = rounded.exponent + 1; // exponent may have changed

	    // append zeros if needed
	    var pp = p + (precision || 0);
	    if (c.length < pp) {
	      c = c.concat(zeros(pp - c.length));
	    }

	    // prepend zeros if needed
	    if (p < 0) {
	      c = zeros(-p + 1).concat(c);
	      p = 1;
	    }

	    // insert a dot if needed
	    if (precision) {
	      c.splice(p, 0, p === 0 ? '0.' : '.');
	    }

	    return this.sign + c.join('');
	  };

	  /**
	   * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
	   * @param {number} [precision]  Number of digits in formatted output.
	   *                              If not provided, the maximum available digits
	   *                              is used.
	   */
	  NumberFormatter.prototype.toExponential = function (precision) {
	    // round if needed, else create a clone
	    var rounded = precision ? this.roundDigits(precision) : this.clone();
	    var c = rounded.coefficients;
	    var e = rounded.exponent;

	    // append zeros if needed
	    if (c.length < precision) {
	      c = c.concat(zeros(precision - c.length));
	    }

	    // format as `C.CCCe+EEE` or `C.CCCe-EEE`
	    var first = c.shift();
	    return this.sign + first + (c.length > 0 ? '.' + c.join('') : '') + 'e' + (e >= 0 ? '+' : '') + e;
	  };

	  /**
	   * Format a number with a certain precision
	   * @param {number} [precision=undefined] Optional number of digits.
	   * @param {{lower: number | undefined, upper: number | undefined}} [options]
	   *                                       By default:
	   *                                         lower = 1e-3 (excl)
	   *                                         upper = 1e+5 (incl)
	   * @return {string}
	   */
	  NumberFormatter.prototype.toPrecision = function (precision, options) {
	    // determine lower and upper bound for exponential notation.
	    var lower = options && options.lower !== undefined ? options.lower : 1e-3;
	    var upper = options && options.upper !== undefined ? options.upper : 1e+5;

	    var abs = Math.abs(Math.pow(10, this.exponent));
	    if (abs < lower || abs >= upper) {
	      // exponential notation
	      return this.toExponential(precision);
	    } else {
	      var rounded = precision ? this.roundDigits(precision) : this.clone();
	      var c = rounded.coefficients;
	      var e = rounded.exponent;

	      // append trailing zeros
	      if (c.length < precision) {
	        c = c.concat(zeros(precision - c.length));
	      }

	      // append trailing zeros
	      // TODO: simplify the next statement
	      c = c.concat(zeros(e - c.length + 1 + (c.length < precision ? precision - c.length : 0)));

	      // prepend zeros
	      c = zeros(-e).concat(c);

	      var dot = e > 0 ? e : 0;
	      if (dot < c.length - 1) {
	        c.splice(dot + 1, 0, '.');
	      }

	      return this.sign + c.join('');
	    }
	  };

	  /**
	   * Crete a clone of the NumberFormatter
	   * @return {NumberFormatter} Returns a clone of the NumberFormatter
	   */
	  NumberFormatter.prototype.clone = function () {
	    var clone = new NumberFormatter('0');
	    clone.sign = this.sign;
	    clone.coefficients = this.coefficients.slice(0);
	    clone.exponent = this.exponent;
	    return clone;
	  };

	  /**
	   * Round the number of digits of a number *
	   * @param {number} precision  A positive integer
	   * @return {NumberFormatter}  Returns a new NumberFormatter with the rounded
	   *                            digits
	   */
	  NumberFormatter.prototype.roundDigits = function (precision) {
	    var rounded = this.clone();
	    var c = rounded.coefficients;

	    // prepend zeros if needed
	    while (precision <= 0) {
	      c.unshift(0);
	      rounded.exponent++;
	      precision++;
	    }

	    if (c.length > precision) {
	      var removed = c.splice(precision, c.length - precision);

	      if (removed[0] >= 5) {
	        var i = precision - 1;
	        c[i]++;
	        while (c[i] === 10) {
	          c.pop();
	          if (i === 0) {
	            c.unshift(0);
	            rounded.exponent++;
	            i++;
	          }
	          i--;
	          c[i]++;
	        }
	      }
	    }

	    return rounded;
	  };

	  /**
	   * Create an array filled with zeros.
	   * @param {number} length
	   * @return {Array}
	   */
	  function zeros(length) {
	    var arr = [];
	    for (var i = 0; i < length; i++) {
	      arr.push(0);
	    }
	    return arr;
	  }

	  module.exports = NumberFormatter;
	});

	var NumberFormatter$1 = interopDefault(NumberFormatter);

var require$$0$3 = Object.freeze({
	  default: NumberFormatter$1
	});

	var number$1 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var NumberFormatter = interopDefault(require$$0$3);

	  /**
	   * Test whether value is a number
	   * @param {*} value
	   * @return {boolean} isNumber
	   */
	  exports.isNumber = function (value) {
	    return typeof value === 'number';
	  };

	  /**
	   * Check if a number is integer
	   * @param {number | boolean} value
	   * @return {boolean} isInteger
	   */
	  exports.isInteger = function (value) {
	    return isFinite(value) ? value == Math.round(value) : false;
	    // Note: we use ==, not ===, as we can have Booleans as well
	  };

	  /**
	   * Calculate the sign of a number
	   * @param {number} x
	   * @returns {*}
	   */
	  exports.sign = Math.sign || function (x) {
	    if (x > 0) {
	      return 1;
	    } else if (x < 0) {
	      return -1;
	    } else {
	      return 0;
	    }
	  };

	  /**
	   * Convert a number to a formatted string representation.
	   *
	   * Syntax:
	   *
	   *    format(value)
	   *    format(value, options)
	   *    format(value, precision)
	   *    format(value, fn)
	   *
	   * Where:
	   *
	   *    {number} value   The value to be formatted
	   *    {Object} options An object with formatting options. Available options:
	   *                     {string} notation
	   *                         Number notation. Choose from:
	   *                         'fixed'          Always use regular number notation.
	   *                                          For example '123.40' and '14000000'
	   *                         'exponential'    Always use exponential notation.
	   *                                          For example '1.234e+2' and '1.4e+7'
	   *                         'engineering'    Always use engineering notation.
	   *                                          For example '123.4e+0' and '14.0e+6'
	   *                         'auto' (default) Regular number notation for numbers
	   *                                          having an absolute value between
	   *                                          `lower` and `upper` bounds, and uses
	   *                                          exponential notation elsewhere.
	   *                                          Lower bound is included, upper bound
	   *                                          is excluded.
	   *                                          For example '123.4' and '1.4e7'.
	   *                     {number} precision   A number between 0 and 16 to round
	   *                                          the digits of the number.
	   *                                          In case of notations 'exponential' and
	   *                                          'auto', `precision` defines the total
	   *                                          number of significant digits returned
	   *                                          and is undefined by default.
	   *                                          In case of notation 'fixed',
	   *                                          `precision` defines the number of
	   *                                          significant digits after the decimal
	   *                                          point, and is 0 by default.
	   *                     {Object} exponential An object containing two parameters,
	   *                                          {number} lower and {number} upper,
	   *                                          used by notation 'auto' to determine
	   *                                          when to return exponential notation.
	   *                                          Default values are `lower=1e-3` and
	   *                                          `upper=1e5`.
	   *                                          Only applicable for notation `auto`.
	   *    {Function} fn    A custom formatting function. Can be used to override the
	   *                     built-in notations. Function `fn` is called with `value` as
	   *                     parameter and must return a string. Is useful for example to
	   *                     format all values inside a matrix in a particular way.
	   *
	   * Examples:
	   *
	   *    format(6.4);                                        // '6.4'
	   *    format(1240000);                                    // '1.24e6'
	   *    format(1/3);                                        // '0.3333333333333333'
	   *    format(1/3, 3);                                     // '0.333'
	   *    format(21385, 2);                                   // '21000'
	   *    format(12.071, {notation: 'fixed'});                // '12'
	   *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
	   *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
	   *    format(12345678, {notation: 'engineering'});        // '12.345678e+6'
	   *
	   * @param {number} value
	   * @param {Object | Function | number} [options]
	   * @return {string} str The formatted value
	   */
	  exports.format = function (value, options) {
	    if (typeof options === 'function') {
	      // handle format(value, fn)
	      return options(value);
	    }

	    // handle special cases
	    if (value === Infinity) {
	      return 'Infinity';
	    } else if (value === -Infinity) {
	      return '-Infinity';
	    } else if (isNaN(value)) {
	      return 'NaN';
	    }

	    // default values for options
	    var notation = 'auto';
	    var precision = undefined;

	    if (options) {
	      // determine notation from options
	      if (options.notation) {
	        notation = options.notation;
	      }

	      // determine precision from options
	      if (exports.isNumber(options)) {
	        precision = options;
	      } else if (options.precision) {
	        precision = options.precision;
	      }
	    }

	    // handle the various notations
	    switch (notation) {
	      case 'fixed':
	        return exports.toFixed(value, precision);

	      case 'exponential':
	        return exports.toExponential(value, precision);

	      case 'engineering':
	        return exports.toEngineering(value, precision);

	      case 'auto':
	        return exports.toPrecision(value, precision, options && options.exponential)

	        // remove trailing zeros after the decimal point
	        .replace(/((\.\d*?)(0+))($|e)/, function () {
	          var digits = arguments[2];
	          var e = arguments[4];
	          return digits !== '.' ? digits + e : e;
	        });

	      default:
	        throw new Error('Unknown notation "' + notation + '". ' + 'Choose "auto", "exponential", or "fixed".');
	    }
	  };

	  /**
	   * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
	   * @param {number} value
	   * @param {number} [precision]  Number of digits in formatted output.
	   *                              If not provided, the maximum available digits
	   *                              is used.
	   * @returns {string} str
	   */
	  exports.toExponential = function (value, precision) {
	    return new NumberFormatter(value).toExponential(precision);
	  };

	  /**
	   * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
	   * @param {number} value
	   * @param {number} [precision]  Number of digits in formatted output.
	   *                              If not provided, the maximum available digits
	   *                              is used.
	   * @returns {string} str
	   */
	  exports.toEngineering = function (value, precision) {
	    return new NumberFormatter(value).toEngineering(precision);
	  };

	  /**
	   * Format a number with fixed notation.
	   * @param {number} value
	   * @param {number} [precision=0]        Optional number of decimals after the
	   *                                      decimal point. Zero by default.
	   */
	  exports.toFixed = function (value, precision) {
	    return new NumberFormatter(value).toFixed(precision);
	  };

	  /**
	   * Format a number with a certain precision
	   * @param {number} value
	   * @param {number} [precision=undefined] Optional number of digits.
	   * @param {{lower: number, upper: number}} [options]  By default:
	   *                                                    lower = 1e-3 (excl)
	   *                                                    upper = 1e+5 (incl)
	   * @return {string}
	   */
	  exports.toPrecision = function (value, precision, options) {
	    return new NumberFormatter(value).toPrecision(precision, options);
	  };

	  /**
	   * Count the number of significant digits of a number.
	   *
	   * For example:
	   *   2.34 returns 3
	   *   0.0034 returns 2
	   *   120.5e+30 returns 4
	   *
	   * @param {number} value
	   * @return {number} digits   Number of significant digits
	   */
	  exports.digits = function (value) {
	    return value.toExponential().replace(/e.*$/, '') // remove exponential notation
	    .replace(/^0\.?0*|\./, '') // remove decimal point and leading zeros
	    .length;
	  };

	  /**
	   * Minimum number added to one that makes the result different than one
	   */
	  exports.DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

	  /**
	   * Compares two floating point numbers.
	   * @param {number} x          First value to compare
	   * @param {number} y          Second value to compare
	   * @param {number} [epsilon]  The maximum relative difference between x and y
	   *                            If epsilon is undefined or null, the function will
	   *                            test whether x and y are exactly equal.
	   * @return {boolean} whether the two numbers are nearly equal
	  */
	  exports.nearlyEqual = function (x, y, epsilon) {
	    // if epsilon is null or undefined, test whether x and y are exactly equal
	    if (epsilon == null) {
	      return x == y;
	    }

	    // use "==" operator, handles infinities
	    if (x == y) {
	      return true;
	    }

	    // NaN
	    if (isNaN(x) || isNaN(y)) {
	      return false;
	    }

	    // at this point x and y should be finite
	    if (isFinite(x) && isFinite(y)) {
	      // check numbers are very close, needed when comparing numbers near zero
	      var diff = Math.abs(x - y);
	      if (diff < exports.DBL_EPSILON) {
	        return true;
	      } else {
	        // use relative error
	        return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
	      }
	    }

	    // Infinite and Number or negative Infinite and positive Infinite cases
	    return false;
	  };
	});

	var number$2 = interopDefault(number$1);
	var nearlyEqual = number$1.nearlyEqual;
	var DBL_EPSILON = number$1.DBL_EPSILON;
	var digits = number$1.digits;
	var toPrecision = number$1.toPrecision;
	var toFixed = number$1.toFixed;
	var toEngineering = number$1.toEngineering;
	var toExponential = number$1.toExponential;
	var format = number$1.format;
	var sign$1 = number$1.sign;
	var isInteger = number$1.isInteger;
	var isNumber = number$1.isNumber;

var require$$0$2 = Object.freeze({
	  default: number$2,
	  nearlyEqual: nearlyEqual,
	  DBL_EPSILON: DBL_EPSILON,
	  digits: digits,
	  toPrecision: toPrecision,
	  toFixed: toFixed,
	  toEngineering: toEngineering,
	  toExponential: toExponential,
	  format: format,
	  sign: sign$1,
	  isInteger: isInteger,
	  isNumber: isNumber
	});

	var typed = createCommonjsModule(function (module, exports) {
	  var typedFunction = interopDefault(require$$1$1);
	  var digits = interopDefault(require$$0$2).digits;

	  // returns a new instance of typed-function
	  var _createTyped = function createTyped() {
	    // initially, return the original instance of typed-function
	    // consecutively, return a new instance from typed.create.
	    _createTyped = typedFunction.create;
	    return typedFunction;
	  };

	  /**
	   * Factory function for creating a new typed instance
	   * @param {Object} type   Object with data types like Complex and BigNumber
	   * @returns {Function}
	   */
	  exports.create = function create(type) {
	    // TODO: typed-function must be able to silently ignore signatures with unknown data types

	    // get a new instance of typed-function
	    var typed = _createTyped();

	    // define all types. The order of the types determines in which order function
	    // arguments are type-checked (so for performance it's important to put the
	    // most used types first).
	    typed.types = [{ name: 'number', test: function test(x) {
	        return typeof x === 'number';
	      } }, { name: 'Complex', test: function test(x) {
	        return x && x.isComplex;
	      } }, { name: 'BigNumber', test: function test(x) {
	        return x && x.isBigNumber;
	      } }, { name: 'Fraction', test: function test(x) {
	        return x && x.isFraction;
	      } }, { name: 'Unit', test: function test(x) {
	        return x && x.isUnit;
	      } }, { name: 'string', test: function test(x) {
	        return typeof x === 'string';
	      } }, { name: 'Array', test: Array.isArray }, { name: 'Matrix', test: function test(x) {
	        return x && x.isMatrix;
	      } }, { name: 'DenseMatrix', test: function test(x) {
	        return x && x.isDenseMatrix;
	      } }, { name: 'SparseMatrix', test: function test(x) {
	        return x && x.isSparseMatrix;
	      } }, { name: 'ImmutableDenseMatrix', test: function test(x) {
	        return x && x.isImmutableDenseMatrix;
	      } }, { name: 'Range', test: function test(x) {
	        return x && x.isRange;
	      } }, { name: 'Index', test: function test(x) {
	        return x && x.isIndex;
	      } }, { name: 'boolean', test: function test(x) {
	        return typeof x === 'boolean';
	      } }, { name: 'ResultSet', test: function test(x) {
	        return x && x.isResultSet;
	      } }, { name: 'Help', test: function test(x) {
	        return x && x.isHelp;
	      } }, { name: 'function', test: function test(x) {
	        return typeof x === 'function';
	      } }, { name: 'Date', test: function test(x) {
	        return x instanceof Date;
	      } }, { name: 'RegExp', test: function test(x) {
	        return x instanceof RegExp;
	      } }, { name: 'Object', test: function test(x) {
	        return (typeof x === 'undefined' ? 'undefined' : babelHelpers.typeof(x)) === 'object';
	      } }, { name: 'null', test: function test(x) {
	        return x === null;
	      } }, { name: 'undefined', test: function test(x) {
	        return x === undefined;
	      } }];

	    // TODO: add conversion from BigNumber to number?
	    typed.conversions = [{
	      from: 'number',
	      to: 'BigNumber',
	      convert: function convert(x) {
	        // note: conversion from number to BigNumber can fail if x has >15 digits
	        if (digits(x) > 15) {
	          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
	        }
	        return new type.BigNumber(x);
	      }
	    }, {
	      from: 'number',
	      to: 'Complex',
	      convert: function convert(x) {
	        return new type.Complex(x, 0);
	      }
	    }, {
	      from: 'number',
	      to: 'string',
	      convert: function convert(x) {
	        return x + '';
	      }
	    }, {
	      from: 'BigNumber',
	      to: 'Complex',
	      convert: function convert(x) {
	        return new type.Complex(x.toNumber(), 0);
	      }
	    }, {
	      from: 'Fraction',
	      to: 'Complex',
	      convert: function convert(x) {
	        return new type.Complex(x.valueOf(), 0);
	      }
	    }, {
	      from: 'number',
	      to: 'Fraction',
	      convert: function convert(x) {
	        if (digits(x) > 15) {
	          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to Fraction ' + '(value: ' + x + '). ' + 'Use function fraction(x) to convert to Fraction.');
	        }
	        return new type.Fraction(x);
	      }
	    }, {
	      // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
	      //  from: 'Fraction',
	      //  to: 'number',
	      //  convert: function (x) {
	      //    return x.valueOf();
	      //  }
	      //}, {
	      from: 'string',
	      to: 'number',
	      convert: function convert(x) {
	        var n = Number(x);
	        if (isNaN(n)) {
	          throw new Error('Cannot convert "' + x + '" to a number');
	        }
	        return n;
	      }
	    }, {
	      from: 'boolean',
	      to: 'number',
	      convert: function convert(x) {
	        return +x;
	      }
	    }, {
	      from: 'boolean',
	      to: 'BigNumber',
	      convert: function convert(x) {
	        return new type.BigNumber(+x);
	      }
	    }, {
	      from: 'boolean',
	      to: 'Fraction',
	      convert: function convert(x) {
	        return new type.Fraction(+x);
	      }
	    }, {
	      from: 'boolean',
	      to: 'string',
	      convert: function convert(x) {
	        return +x;
	      }
	    }, {
	      from: 'null',
	      to: 'number',
	      convert: function convert() {
	        return 0;
	      }
	    }, {
	      from: 'null',
	      to: 'string',
	      convert: function convert() {
	        return 'null';
	      }
	    }, {
	      from: 'null',
	      to: 'BigNumber',
	      convert: function convert() {
	        return new type.BigNumber(0);
	      }
	    }, {
	      from: 'null',
	      to: 'Fraction',
	      convert: function convert() {
	        return new type.Fraction(0);
	      }
	    }, {
	      from: 'Array',
	      to: 'Matrix',
	      convert: function convert(array) {
	        // TODO: how to decide on the right type of matrix to create?
	        return new type.DenseMatrix(array);
	      }
	    }, {
	      from: 'Matrix',
	      to: 'Array',
	      convert: function convert(matrix) {
	        return matrix.valueOf();
	      }
	    }];

	    return typed;
	  };
	});

	var typed$1 = interopDefault(typed);
	var create$2 = typed.create;

var require$$3 = Object.freeze({
	  default: typed$1,
	  create: create$2
	});

	var index$4 = createCommonjsModule(function (module) {
	  function E() {
	    // Keep this empty so it's easier to inherit from
	    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	  }

	  E.prototype = {
	    on: function on(name, callback, ctx) {
	      var e = this.e || (this.e = {});

	      (e[name] || (e[name] = [])).push({
	        fn: callback,
	        ctx: ctx
	      });

	      return this;
	    },

	    once: function once(name, callback, ctx) {
	      var self = this;
	      function listener() {
	        self.off(name, listener);
	        callback.apply(ctx, arguments);
	      };

	      listener._ = callback;
	      return this.on(name, listener, ctx);
	    },

	    emit: function emit(name) {
	      var data = [].slice.call(arguments, 1);
	      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	      var i = 0;
	      var len = evtArr.length;

	      for (i; i < len; i++) {
	        evtArr[i].fn.apply(evtArr[i].ctx, data);
	      }

	      return this;
	    },

	    off: function off(name, callback) {
	      var e = this.e || (this.e = {});
	      var evts = e[name];
	      var liveEvents = [];

	      if (evts && callback) {
	        for (var i = 0, len = evts.length; i < len; i++) {
	          if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
	        }
	      }

	      // Remove event from queue to prevent memory leak
	      // Suggested by https://github.com/lazd
	      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

	      liveEvents.length ? e[name] = liveEvents : delete e[name];

	      return this;
	    }
	  };

	  module.exports = E;
	});

	var index$5 = interopDefault(index$4);

var require$$0$5 = Object.freeze({
	  default: index$5
	});

	var emitter = createCommonjsModule(function (module, exports) {
	  var Emitter = interopDefault(require$$0$5);

	  /**
	   * Extend given object with emitter functions `on`, `off`, `once`, `emit`
	   * @param {Object} obj
	   * @return {Object} obj
	   */
	  exports.mixin = function (obj) {
	    // create event emitter
	    var emitter = new Emitter();

	    // bind methods to obj (we don't want to expose the emitter.e Array...)
	    obj.on = emitter.on.bind(emitter);
	    obj.off = emitter.off.bind(emitter);
	    obj.once = emitter.once.bind(emitter);
	    obj.emit = emitter.emit.bind(emitter);

	    return obj;
	  };
	});

	var emitter$1 = interopDefault(emitter);
	var mixin = emitter.mixin;

var require$$0$4 = Object.freeze({
	  default: emitter$1,
	  mixin: mixin
	});

	var ArgumentsError = createCommonjsModule(function (module) {
	  'use strict';

	  /**
	   * Create a syntax error with the message:
	   *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
	   * @param {string} fn     Function name
	   * @param {number} count  Actual argument count
	   * @param {number} min    Minimum required argument count
	   * @param {number} [max]  Maximum required argument count
	   * @extends Error
	   */

	  function ArgumentsError(fn, count, min, max) {
	    if (!(this instanceof ArgumentsError)) {
	      throw new SyntaxError('Constructor must be called with the new operator');
	    }

	    this.fn = fn;
	    this.count = count;
	    this.min = min;
	    this.max = max;

	    this.message = 'Wrong number of arguments in function ' + fn + ' (' + count + ' provided, ' + min + (max != undefined ? '-' + max : '') + ' expected)';

	    this.stack = new Error().stack;
	  }

	  ArgumentsError.prototype = new Error();
	  ArgumentsError.prototype.constructor = Error;
	  ArgumentsError.prototype.name = 'ArgumentsError';
	  ArgumentsError.prototype.isArgumentsError = true;

	  module.exports = ArgumentsError;
	});

	var ArgumentsError$1 = interopDefault(ArgumentsError);

var require$$0$6 = Object.freeze({
	  default: ArgumentsError$1
	});

	var _import = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var lazy = interopDefault(require$$1).lazy;
	  var isFactory = interopDefault(require$$1).isFactory;
	  var traverse = interopDefault(require$$1).traverse;
	  var extend = interopDefault(require$$1).extend;
	  var ArgumentsError = interopDefault(require$$0$6);

	  function factory(type, config, load, typed, math) {
	    /**
	     * Import functions from an object or a module
	     *
	     * Syntax:
	     *
	     *    math.import(object)
	     *    math.import(object, options)
	     *
	     * Where:
	     *
	     * - `object: Object`
	     *   An object with functions to be imported.
	     * - `options: Object` An object with import options. Available options:
	     *   - `override: boolean`
	     *     If true, existing functions will be overwritten. False by default.
	     *   - `silent: boolean`
	     *     If true, the function will not throw errors on duplicates or invalid
	     *     types. False by default.
	     *   - `wrap: boolean`
	     *     If true, the functions will be wrapped in a wrapper function
	     *     which converts data types like Matrix to primitive data types like Array.
	     *     The wrapper is needed when extending math.js with libraries which do not
	     *     support these data type. False by default.
	     *
	     * Examples:
	     *
	     *    // define new functions and variables
	     *    math.import({
	     *      myvalue: 42,
	     *      hello: function (name) {
	     *        return 'hello, ' + name + '!';
	     *      }
	     *    });
	     *
	     *    // use the imported function and variable
	     *    math.myvalue * 2;               // 84
	     *    math.hello('user');             // 'hello, user!'
	     *
	     *    // import the npm module 'numbers'
	     *    // (must be installed first with `npm install numbers`)
	     *    math.import(require('numbers'), {wrap: true});
	     *
	     *    math.fibonacci(7); // returns 13
	     *
	     * @param {Object | Array} object   Object with functions to be imported.
	     * @param {Object} [options]        Import options.
	     */
	    function math_import(object, options) {
	      var num = arguments.length;
	      if (num != 1 && num != 2) {
	        throw new ArgumentsError('import', num, 1, 2);
	      }

	      if (!options) {
	        options = {};
	      }

	      if (isFactory(object)) {
	        _importFactory(object, options);
	      }
	      // TODO: allow a typed-function with name too
	      else if (Array.isArray(object)) {
	          object.forEach(function (entry) {
	            math_import(entry, options);
	          });
	        } else if ((typeof object === 'undefined' ? 'undefined' : babelHelpers.typeof(object)) === 'object') {
	          // a map with functions
	          for (var name in object) {
	            if (object.hasOwnProperty(name)) {
	              var value = object[name];
	              if (isSupportedType(value)) {
	                _import(name, value, options);
	              } else if (isFactory(object)) {
	                _importFactory(object, options);
	              } else {
	                math_import(value, options);
	              }
	            }
	          }
	        } else {
	          if (!options.silent) {
	            throw new TypeError('Factory, Object, or Array expected');
	          }
	        }
	    }

	    /**
	     * Add a property to the math namespace and create a chain proxy for it.
	     * @param {string} name
	     * @param {*} value
	     * @param {Object} options  See import for a description of the options
	     * @private
	     */
	    function _import(name, value, options) {
	      if (options.wrap && typeof value === 'function') {
	        // create a wrapper around the function
	        value = _wrap(value);
	      }

	      if (isTypedFunction(math[name]) && isTypedFunction(value)) {
	        if (options.override) {
	          // give the typed function the right name
	          value = typed(name, value.signatures);
	        } else {
	          // merge the existing and typed function
	          value = typed(math[name], value);
	        }

	        math[name] = value;
	        _importTransform(name, value);
	        math.emit('import', name, function resolver() {
	          return value;
	        });
	        return;
	      }

	      if (math[name] === undefined || options.override) {
	        math[name] = value;
	        _importTransform(name, value);
	        math.emit('import', name, function resolver() {
	          return value;
	        });
	        return;
	      }

	      if (!options.silent) {
	        throw new Error('Cannot import "' + name + '": already exists');
	      }
	    }

	    function _importTransform(name, value) {
	      if (value && typeof value.transform === 'function') {
	        math.expression.transform[name] = value.transform;
	      }
	    }

	    /**
	     * Create a wrapper a round an function which converts the arguments
	     * to their primitive values (like convert a Matrix to Array)
	     * @param {Function} fn
	     * @return {Function} Returns the wrapped function
	     * @private
	     */
	    function _wrap(fn) {
	      var wrapper = function wrapper() {
	        var args = [];
	        for (var i = 0, len = arguments.length; i < len; i++) {
	          var arg = arguments[i];
	          args[i] = arg && arg.valueOf();
	        }
	        return fn.apply(math, args);
	      };

	      if (fn.transform) {
	        wrapper.transform = fn.transform;
	      }

	      return wrapper;
	    }

	    /**
	     * Import an instance of a factory into math.js
	     * @param {{factory: Function, name: string, path: string, math: boolean}} factory
	     * @param {Object} options  See import for a description of the options
	     * @private
	     */
	    function _importFactory(factory, options) {
	      if (typeof factory.name === 'string') {
	        var name = factory.name;
	        var namespace = factory.path ? traverse(math, factory.path) : math;
	        var existing = namespace.hasOwnProperty(name) ? namespace[name] : undefined;

	        var resolver = function resolver() {
	          var instance = load(factory);

	          if (isTypedFunction(existing) && isTypedFunction(instance)) {
	            if (options.override) {
	              // replace the existing typed function (nothing to do)
	            } else {
	              // merge the existing and new typed function
	              instance = typed(existing, instance);
	            }

	            return instance;
	          }

	          if (existing === undefined || options.override) {
	            return instance;
	          }

	          if (!options.silent) {
	            throw new Error('Cannot import "' + name + '": already exists');
	          }
	        };

	        if (factory.lazy !== false) {
	          lazy(namespace, name, resolver);
	        } else {
	          namespace[name] = resolver();
	        }

	        math.emit('import', name, resolver, factory.path);
	      } else {
	        // unnamed factory.
	        // no lazy loading
	        load(factory);
	      }
	    }

	    /**
	     * Check whether given object is a type which can be imported
	     * @param {Function | number | string | boolean | null | Unit | Complex} object
	     * @return {boolean}
	     * @private
	     */
	    function isSupportedType(object) {
	      return typeof object == 'function' || typeof object === 'number' || typeof object === 'string' || typeof object === 'boolean' || object === null || object && object.isUnit === true || object && object.isComplex === true || object && object.isBigNumber === true || object && object.isFraction === true || object && object.isMatrix === true || object && Array.isArray(object) === true;
	    }

	    /**
	     * Test whether a given thing is a typed-function
	     * @param {*} fn
	     * @return {boolean} Returns true when `fn` is a typed-function
	     */
	    function isTypedFunction(fn) {
	      return typeof fn === 'function' && babelHelpers.typeof(fn.signatures) === 'object';
	    }

	    return math_import;
	  }

	  exports.math = true; // request access to the math namespace as 5th argument of the factory function
	  exports.name = 'import';
	  exports.factory = factory;
	  exports.lazy = true;
	});

	var _import$1 = interopDefault(_import);
	var lazy$1 = _import.lazy;
	var factory = _import.factory;
	var name = _import.name;
	var math$1 = _import.math;

var require$$1$2 = Object.freeze({
	  default: _import$1,
	  lazy: lazy$1,
	  factory: factory,
	  name: name,
	  math: math$1
	});

	var config = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var object = interopDefault(require$$1);

	  function factory(type, config, load, typed, math) {
	    var MATRIX = ['Matrix', 'Array']; // valid values for option matrix
	    var NUMBER = ['number', 'BigNumber', 'Fraction']; // valid values for option number

	    /**
	     * Set configuration options for math.js, and get current options.
	     * Will emit a 'config' event, with arguments (curr, prev).
	     *
	     * Syntax:
	     *
	     *     math.config(config: Object): Object
	     *
	     * Examples:
	     *
	     *     math.config().number;                // outputs 'number'
	     *     math.eval('0.4');                    // outputs number 0.4
	     *     math.config({number: 'Fraction'});
	     *     math.eval('0.4');                    // outputs Fraction 2/5
	     *
	     * @param {Object} [options] Available options:
	     *                            {number} epsilon
	     *                              Minimum relative difference between two
	     *                              compared values, used by all comparison functions.
	     *                            {string} matrix
	     *                              A string 'Matrix' (default) or 'Array'.
	     *                            {string} number
	     *                              A string 'number' (default), 'BigNumber', or 'Fraction'
	     *                            {number} precision
	     *                              The number of significant digits for BigNumbers.
	     *                              Not applicable for Numbers.
	     *                            {string} parenthesis
	     *                              How to display parentheses in LaTeX and string
	     *                              output.
	     * @return {Object} Returns the current configuration
	     */
	    function _config(options) {
	      if (options) {
	        var prev = object.clone(config);

	        // validate some of the options
	        validateOption(options, 'matrix', MATRIX);
	        validateOption(options, 'number', NUMBER);

	        // merge options
	        object.deepExtend(config, options);

	        var curr = object.clone(config);

	        // emit 'config' event
	        math.emit('config', curr, prev);

	        return curr;
	      } else {
	        return object.clone(config);
	      }
	    }

	    // attach the valid options to the function so they can be extended
	    _config.MATRIX = MATRIX;
	    _config.NUMBER = NUMBER;

	    return _config;
	  }

	  /**
	   * Test whether an Array contains a specific item.
	   * @param {Array.<string>} array
	   * @param {string} item
	   * @return {boolean}
	   */
	  function contains(array, item) {
	    return array.indexOf(item) !== -1;
	  }

	  /**
	   * Find a string in an array. Case insensitive search
	   * @param {Array.<string>} array
	   * @param {string} item
	   * @return {number} Returns the index when found. Returns -1 when not found
	   */
	  function findIndex(array, item) {
	    return array.map(function (i) {
	      return i.toLowerCase();
	    }).indexOf(item.toLowerCase());
	  }

	  /**
	   * Validate an option
	   * @param {Object} options         Object with options
	   * @param {string} name            Name of the option to validate
	   * @param {Array.<string>} values  Array with valid values for this option
	   */
	  function validateOption(options, name, values) {
	    if (options[name] !== undefined && !contains(values, options[name])) {
	      var index = findIndex(values, options[name]);
	      if (index !== -1) {
	        // right value, wrong casing
	        // TODO: lower case values are deprecated since v3, remove this warning some day.
	        console.warn('Warning: Wrong casing for configuration option "' + name + '", should be "' + values[index] + '" instead of "' + options[name] + '".');

	        options[name] = values[index]; // change the option to the right casing
	      } else {
	        // unknown value
	        console.warn('Warning: Unknown value "' + options[name] + '" for configuration option "' + name + '". Available options: ' + values.map(JSON.stringify).join(', ') + '.');
	      }
	    }
	  }

	  exports.name = 'config';
	  exports.math = true; // request the math namespace as fifth argument
	  exports.factory = factory;
	});

	var config$1 = interopDefault(config);
	var factory$1 = config.factory;
	var math$2 = config.math;
	var name$1 = config.name;

var require$$0$7 = Object.freeze({
	  default: config$1,
	  factory: factory$1,
	  math: math$2,
	  name: name$1
	});

	var core$2 = createCommonjsModule(function (module, exports) {
	  var isFactory = interopDefault(require$$1).isFactory;
	  var deepExtend = interopDefault(require$$1).deepExtend;
	  var typedFactory = interopDefault(require$$3);
	  var emitter = interopDefault(require$$0$4);

	  var importFactory = interopDefault(require$$1$2);
	  var configFactory = interopDefault(require$$0$7);

	  /**
	   * Math.js core. Creates a new, empty math.js instance
	   * @param {Object} [options] Available options:
	   *                            {number} epsilon
	   *                              Minimum relative difference between two
	   *                              compared values, used by all comparison functions.
	   *                            {string} matrix
	   *                              A string 'Matrix' (default) or 'Array'.
	   *                            {string} number
	   *                              A string 'number' (default), 'BigNumber', or 'Fraction'
	   *                            {number} precision
	   *                              The number of significant digits for BigNumbers.
	   *                              Not applicable for Numbers.
	   *                            {boolean} predictable
	   *                              Predictable output type of functions. When true,
	   *                              output type depends only on the input types. When
	   *                              false (default), output type can vary depending
	   *                              on input values. For example `math.sqrt(-2)`
	   *                              returns `NaN` when predictable is false, and
	   *                              returns `complex('2i')` when true.
	   * @returns {Object} Returns a bare-bone math.js instance containing
	   *                   functions:
	   *                   - `import` to add new functions
	   *                   - `config` to change configuration
	   *                   - `on`, `off`, `once`, `emit` for events
	   */
	  exports.create = function create(options) {
	    // simple test for ES5 support
	    if (typeof Object.create !== 'function') {
	      throw new Error('ES5 not supported by this JavaScript engine. ' + 'Please load the es5-shim and es5-sham library for compatibility.');
	    }

	    // cached factories and instances
	    var factories = [];
	    var instances = [];

	    // create a namespace for the mathjs instance, and attach emitter functions
	    var math = emitter.mixin({});
	    math.type = {};
	    math.expression = {
	      transform: Object.create(math)
	    };

	    // create a new typed instance
	    math.typed = typedFactory.create(math.type);

	    // create configuration options. These are private
	    var _config = {
	      // minimum relative difference between two compared values,
	      // used by all comparison functions
	      epsilon: 1e-12,

	      // type of default matrix output. Choose 'matrix' (default) or 'array'
	      matrix: 'Matrix',

	      // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
	      number: 'number',

	      // number of significant digits in BigNumbers
	      precision: 64,

	      // predictable output type of functions. When true, output type depends only
	      // on the input types. When false (default), output type can vary depending
	      // on input values. For example `math.sqrt(-2)` returns `NaN` when
	      // predictable is false, and returns `complex('2i')` when true.
	      predictable: false
	    };

	    /**
	     * Load a function or data type from a factory.
	     * If the function or data type already exists, the existing instance is
	     * returned.
	     * @param {{type: string, name: string, factory: Function}} factory
	     * @returns {*}
	     */
	    function load(factory) {
	      if (!isFactory(factory)) {
	        throw new Error('Factory object with properties `type`, `name`, and `factory` expected');
	      }

	      var index = factories.indexOf(factory);
	      var instance;
	      if (index === -1) {
	        // doesn't yet exist
	        if (factory.math === true) {
	          // pass with math namespace
	          instance = factory.factory(math.type, _config, load, math.typed, math);
	        } else {
	          instance = factory.factory(math.type, _config, load, math.typed);
	        }

	        // append to the cache
	        factories.push(factory);
	        instances.push(instance);
	      } else {
	        // already existing function, return the cached instance
	        instance = instances[index];
	      }

	      return instance;
	    }

	    // load the import and config functions
	    math['import'] = load(importFactory);
	    math['config'] = load(configFactory);

	    // apply options
	    if (options) {
	      math.config(options);
	    }

	    return math;
	  };
	});

	var core$3 = interopDefault(core$2);
	var create$1 = core$2.create;

var require$$0$1 = Object.freeze({
	  default: core$3,
	  create: create$1
	});

	var core = createCommonjsModule(function (module) {
	  module.exports = interopDefault(require$$0$1);
	});

	var core$1 = interopDefault(core);

	var formatter = createCommonjsModule(function (module, exports) {
	  /**
	   * Convert a BigNumber to a formatted string representation.
	   *
	   * Syntax:
	   *
	   *    format(value)
	   *    format(value, options)
	   *    format(value, precision)
	   *    format(value, fn)
	   *
	   * Where:
	   *
	   *    {number} value   The value to be formatted
	   *    {Object} options An object with formatting options. Available options:
	   *                     {string} notation
	   *                         Number notation. Choose from:
	   *                         'fixed'          Always use regular number notation.
	   *                                          For example '123.40' and '14000000'
	   *                         'exponential'    Always use exponential notation.
	   *                                          For example '1.234e+2' and '1.4e+7'
	   *                         'auto' (default) Regular number notation for numbers
	   *                                          having an absolute value between
	   *                                          `lower` and `upper` bounds, and uses
	   *                                          exponential notation elsewhere.
	   *                                          Lower bound is included, upper bound
	   *                                          is excluded.
	   *                                          For example '123.4' and '1.4e7'.
	   *                     {number} precision   A number between 0 and 16 to round
	   *                                          the digits of the number.
	   *                                          In case of notations 'exponential' and
	   *                                          'auto', `precision` defines the total
	   *                                          number of significant digits returned
	   *                                          and is undefined by default.
	   *                                          In case of notation 'fixed',
	   *                                          `precision` defines the number of
	   *                                          significant digits after the decimal
	   *                                          point, and is 0 by default.
	   *                     {Object} exponential An object containing two parameters,
	   *                                          {number} lower and {number} upper,
	   *                                          used by notation 'auto' to determine
	   *                                          when to return exponential notation.
	   *                                          Default values are `lower=1e-3` and
	   *                                          `upper=1e5`.
	   *                                          Only applicable for notation `auto`.
	   *    {Function} fn    A custom formatting function. Can be used to override the
	   *                     built-in notations. Function `fn` is called with `value` as
	   *                     parameter and must return a string. Is useful for example to
	   *                     format all values inside a matrix in a particular way.
	   *
	   * Examples:
	   *
	   *    format(6.4);                                        // '6.4'
	   *    format(1240000);                                    // '1.24e6'
	   *    format(1/3);                                        // '0.3333333333333333'
	   *    format(1/3, 3);                                     // '0.333'
	   *    format(21385, 2);                                   // '21000'
	   *    format(12.071, {notation: 'fixed'});                // '12'
	   *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
	   *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
	   *
	   * @param {BigNumber} value
	   * @param {Object | Function | number} [options]
	   * @return {string} str The formatted value
	   */
	  exports.format = function (value, options) {
	    if (typeof options === 'function') {
	      // handle format(value, fn)
	      return options(value);
	    }

	    // handle special cases
	    if (!value.isFinite()) {
	      return value.isNaN() ? 'NaN' : value.gt(0) ? 'Infinity' : '-Infinity';
	    }

	    // default values for options
	    var notation = 'auto';
	    var precision = undefined;

	    if (options !== undefined) {
	      // determine notation from options
	      if (options.notation) {
	        notation = options.notation;
	      }

	      // determine precision from options
	      if (typeof options === 'number') {
	        precision = options;
	      } else if (options.precision) {
	        precision = options.precision;
	      }
	    }

	    // handle the various notations
	    switch (notation) {
	      case 'fixed':
	        return exports.toFixed(value, precision);

	      case 'exponential':
	        return exports.toExponential(value, precision);

	      case 'auto':
	        // determine lower and upper bound for exponential notation.
	        // TODO: implement support for upper and lower to be BigNumbers themselves
	        var lower = 1e-3;
	        var upper = 1e5;
	        if (options && options.exponential) {
	          if (options.exponential.lower !== undefined) {
	            lower = options.exponential.lower;
	          }
	          if (options.exponential.upper !== undefined) {
	            upper = options.exponential.upper;
	          }
	        }

	        // adjust the configuration of the BigNumber constructor (yeah, this is quite tricky...)
	        var oldConfig = {
	          toExpNeg: value.constructor.toExpNeg,
	          toExpPos: value.constructor.toExpPos
	        };

	        value.constructor.config({
	          toExpNeg: Math.round(Math.log(lower) / Math.LN10),
	          toExpPos: Math.round(Math.log(upper) / Math.LN10)
	        });

	        // handle special case zero
	        if (value.isZero()) return '0';

	        // determine whether or not to output exponential notation
	        var str;
	        var abs = value.abs();
	        if (abs.gte(lower) && abs.lt(upper)) {
	          // normal number notation
	          str = value.toSignificantDigits(precision).toFixed();
	        } else {
	          // exponential notation
	          str = exports.toExponential(value, precision);
	        }

	        // remove trailing zeros after the decimal point
	        return str.replace(/((\.\d*?)(0+))($|e)/, function () {
	          var digits = arguments[2];
	          var e = arguments[4];
	          return digits !== '.' ? digits + e : e;
	        });

	      default:
	        throw new Error('Unknown notation "' + notation + '". ' + 'Choose "auto", "exponential", or "fixed".');
	    }
	  };

	  /**
	   * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
	   * @param {BigNumber} value
	   * @param {number} [precision]  Number of digits in formatted output.
	   *                              If not provided, the maximum available digits
	   *                              is used.
	   * @returns {string} str
	   */
	  exports.toExponential = function (value, precision) {
	    if (precision !== undefined) {
	      return value.toExponential(precision - 1); // Note the offset of one
	    } else {
	      return value.toExponential();
	    }
	  };

	  /**
	   * Format a number with fixed notation.
	   * @param {BigNumber} value
	   * @param {number} [precision=0]        Optional number of decimals after the
	   *                                      decimal point. Zero by default.
	   */
	  exports.toFixed = function (value, precision) {
	    return value.toFixed(precision || 0);
	    // Note: the (precision || 0) is needed as the toFixed of BigNumber has an
	    // undefined default precision instead of 0.
	  };
	});

	var formatter$1 = interopDefault(formatter);
	var toFixed$1 = formatter.toFixed;
	var toExponential$1 = formatter.toExponential;
	var format$2 = formatter.format;

var require$$0$8 = Object.freeze({
	  default: formatter$1,
	  toFixed: toFixed$1,
	  toExponential: toExponential$1,
	  format: format$2
	});

	var string$2 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var formatNumber = interopDefault(require$$0$2).format;
	  var formatBigNumber = interopDefault(require$$0$8).format;

	  /**
	   * Test whether value is a string
	   * @param {*} value
	   * @return {boolean} isString
	   */
	  exports.isString = function (value) {
	    return typeof value === 'string';
	  };

	  /**
	   * Check if a text ends with a certain string.
	   * @param {string} text
	   * @param {string} search
	   */
	  exports.endsWith = function (text, search) {
	    var start = text.length - search.length;
	    var end = text.length;
	    return text.substring(start, end) === search;
	  };

	  /**
	   * Format a value of any type into a string.
	   *
	   * Usage:
	   *     math.format(value)
	   *     math.format(value, precision)
	   *
	   * When value is a function:
	   *
	   * - When the function has a property `syntax`, it returns this
	   *   syntax description.
	   * - In other cases, a string `'function'` is returned.
	   *
	   * When `value` is an Object:
	   *
	   * - When the object contains a property `format` being a function, this
	   *   function is invoked as `value.format(options)` and the result is returned.
	   * - When the object has its own `toString` method, this method is invoked
	   *   and the result is returned.
	   * - In other cases the function will loop over all object properties and
	   *   return JSON object notation like '{"a": 2, "b": 3}'.
	   *
	   * Example usage:
	   *     math.format(2/7);                // '0.2857142857142857'
	   *     math.format(math.pi, 3);         // '3.14'
	   *     math.format(new Complex(2, 3));  // '2 + 3i'
	   *     math.format('hello');            // '"hello"'
	   *
	   * @param {*} value             Value to be stringified
	   * @param {Object | number | Function} [options]  Formatting options. See
	   *                                                lib/utils/number:format for a
	   *                                                description of the available
	   *                                                options.
	   * @return {string} str
	   */
	  exports.format = function (value, options) {
	    if (typeof value === 'number') {
	      return formatNumber(value, options);
	    }

	    if (value && value.isBigNumber === true) {
	      return formatBigNumber(value, options);
	    }

	    if (value && value.isFraction === true) {
	      if (!options || options.fraction !== 'decimal') {
	        // output as ratio, like '1/3'
	        return value.s * value.n + '/' + value.d;
	      } else {
	        // output as decimal, like '0.(3)'
	        return value.toString();
	      }
	    }

	    if (Array.isArray(value)) {
	      return formatArray(value, options);
	    }

	    if (exports.isString(value)) {
	      return '"' + value + '"';
	    }

	    if (typeof value === 'function') {
	      return value.syntax ? String(value.syntax) : 'function';
	    }

	    if (value && (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object') {
	      if (typeof value.format === 'function') {
	        return value.format(options);
	      } else if (value && value.toString() !== {}.toString()) {
	        // this object has a non-native toString method, use that one
	        return value.toString();
	      } else {
	        var entries = [];

	        for (var key in value) {
	          if (value.hasOwnProperty(key)) {
	            entries.push('"' + key + '": ' + exports.format(value[key], options));
	          }
	        }

	        return '{' + entries.join(', ') + '}';
	      }
	    }

	    return String(value);
	  };

	  /**
	   * Recursively format an n-dimensional matrix
	   * Example output: "[[1, 2], [3, 4]]"
	   * @param {Array} array
	   * @param {Object | number | Function} [options]  Formatting options. See
	   *                                                lib/utils/number:format for a
	   *                                                description of the available
	   *                                                options.
	   * @returns {string} str
	   */
	  function formatArray(array, options) {
	    if (Array.isArray(array)) {
	      var str = '[';
	      var len = array.length;
	      for (var i = 0; i < len; i++) {
	        if (i != 0) {
	          str += ', ';
	        }
	        str += formatArray(array[i], options);
	      }
	      str += ']';
	      return str;
	    } else {
	      return exports.format(array, options);
	    }
	  }
	});

	var string$3 = interopDefault(string$2);
	var format$1 = string$2.format;
	var endsWith = string$2.endsWith;
	var isString = string$2.isString;

var require$$4 = Object.freeze({
	  default: string$3,
	  format: format$1,
	  endsWith: endsWith,
	  isString: isString
	});

	var types$1 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  /**
	   * Determine the type of a variable
	   *
	   *     type(x)
	   *
	   * The following types are recognized:
	   *
	   *     'undefined'
	   *     'null'
	   *     'boolean'
	   *     'number'
	   *     'string'
	   *     'Array'
	   *     'Function'
	   *     'Date'
	   *     'RegExp'
	   *     'Object'
	   *
	   * @param {*} x
	   * @return {string} Returns the name of the type. Primitive types are lower case,
	   *                  non-primitive types are upper-camel-case.
	   *                  For example 'number', 'string', 'Array', 'Date'.
	   */

	  exports.type = function (x) {
	    var type = typeof x === 'undefined' ? 'undefined' : babelHelpers.typeof(x);

	    if (type === 'object') {
	      if (x === null) return 'null';
	      if (x instanceof Boolean) return 'boolean';
	      if (x instanceof Number) return 'number';
	      if (x instanceof String) return 'string';
	      if (Array.isArray(x)) return 'Array';
	      if (x instanceof Date) return 'Date';
	      if (x instanceof RegExp) return 'RegExp';

	      return 'Object';
	    }

	    if (type === 'function') return 'Function';

	    return type;
	  };

	  /**
	   * Test whether a value is a scalar
	   * @param x
	   * @return {boolean} Returns true when x is a scalar, returns false when
	   *                   x is a Matrix or Array.
	   */
	  exports.isScalar = function (x) {
	    return !(x && x.isMatrix || Array.isArray(x));
	  };
	});

	var types$2 = interopDefault(types$1);
	var isScalar = types$1.isScalar;
	var type = types$1.type;

var require$$2$1 = Object.freeze({
	  default: types$2,
	  isScalar: isScalar,
	  type: type
	});

	var DimensionError = createCommonjsModule(function (module) {
	  'use strict';

	  /**
	   * Create a range error with the message:
	   *     'Dimension mismatch (<actual size> != <expected size>)'
	   * @param {number | number[]} actual        The actual size
	   * @param {number | number[]} expected      The expected size
	   * @param {string} [relation='!=']          Optional relation between actual
	   *                                          and expected size: '!=', '<', etc.
	   * @extends RangeError
	   */

	  function DimensionError(actual, expected, relation) {
	    if (!(this instanceof DimensionError)) {
	      throw new SyntaxError('Constructor must be called with the new operator');
	    }

	    this.actual = actual;
	    this.expected = expected;
	    this.relation = relation;

	    this.message = 'Dimension mismatch (' + (Array.isArray(actual) ? '[' + actual.join(', ') + ']' : actual) + ' ' + (this.relation || '!=') + ' ' + (Array.isArray(expected) ? '[' + expected.join(', ') + ']' : expected) + ')';

	    this.stack = new Error().stack;
	  }

	  DimensionError.prototype = new RangeError();
	  DimensionError.prototype.constructor = RangeError;
	  DimensionError.prototype.name = 'DimensionError';
	  DimensionError.prototype.isDimensionError = true;

	  module.exports = DimensionError;
	});

	var DimensionError$1 = interopDefault(DimensionError);

var require$$0$9 = Object.freeze({
	  default: DimensionError$1
	});

	var IndexError = createCommonjsModule(function (module) {
	  'use strict';

	  /**
	   * Create a range error with the message:
	   *     'Index out of range (index < min)'
	   *     'Index out of range (index < max)'
	   *
	   * @param {number} index     The actual index
	   * @param {number} [min=0]   Minimum index (included)
	   * @param {number} [max]     Maximum index (excluded)
	   * @extends RangeError
	   */

	  function IndexError(index, min, max) {
	    if (!(this instanceof IndexError)) {
	      throw new SyntaxError('Constructor must be called with the new operator');
	    }

	    this.index = index;
	    if (arguments.length < 3) {
	      this.min = 0;
	      this.max = min;
	    } else {
	      this.min = min;
	      this.max = max;
	    }

	    if (this.min !== undefined && this.index < this.min) {
	      this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
	    } else if (this.max !== undefined && this.index >= this.max) {
	      this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
	    } else {
	      this.message = 'Index out of range (' + this.index + ')';
	    }

	    this.stack = new Error().stack;
	  }

	  IndexError.prototype = new RangeError();
	  IndexError.prototype.constructor = RangeError;
	  IndexError.prototype.name = 'IndexError';
	  IndexError.prototype.isIndexError = true;

	  module.exports = IndexError;
	});

	var IndexError$1 = interopDefault(IndexError);

var require$$0$10 = Object.freeze({
	  default: IndexError$1
	});

	var array$2 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var number = interopDefault(require$$0$2);
	  var string = interopDefault(require$$4);
	  var object = interopDefault(require$$1);
	  var types = interopDefault(require$$2$1);

	  var DimensionError = interopDefault(require$$0$9);
	  var IndexError = interopDefault(require$$0$10);

	  /**
	   * Calculate the size of a multi dimensional array.
	   * This function checks the size of the first entry, it does not validate
	   * whether all dimensions match. (use function `validate` for that)
	   * @param {Array} x
	   * @Return {Number[]} size
	   */
	  exports.size = function (x) {
	    var s = [];

	    while (Array.isArray(x)) {
	      s.push(x.length);
	      x = x[0];
	    }

	    return s;
	  };

	  /**
	   * Recursively validate whether each element in a multi dimensional array
	   * has a size corresponding to the provided size array.
	   * @param {Array} array    Array to be validated
	   * @param {number[]} size  Array with the size of each dimension
	   * @param {number} dim   Current dimension
	   * @throws DimensionError
	   * @private
	   */
	  function _validate(array, size, dim) {
	    var i;
	    var len = array.length;

	    if (len != size[dim]) {
	      throw new DimensionError(len, size[dim]);
	    }

	    if (dim < size.length - 1) {
	      // recursively validate each child array
	      var dimNext = dim + 1;
	      for (i = 0; i < len; i++) {
	        var child = array[i];
	        if (!Array.isArray(child)) {
	          throw new DimensionError(size.length - 1, size.length, '<');
	        }
	        _validate(array[i], size, dimNext);
	      }
	    } else {
	      // last dimension. none of the childs may be an array
	      for (i = 0; i < len; i++) {
	        if (Array.isArray(array[i])) {
	          throw new DimensionError(size.length + 1, size.length, '>');
	        }
	      }
	    }
	  }

	  /**
	   * Validate whether each element in a multi dimensional array has
	   * a size corresponding to the provided size array.
	   * @param {Array} array    Array to be validated
	   * @param {number[]} size  Array with the size of each dimension
	   * @throws DimensionError
	   */
	  exports.validate = function (array, size) {
	    var isScalar = size.length == 0;
	    if (isScalar) {
	      // scalar
	      if (Array.isArray(array)) {
	        throw new DimensionError(array.length, 0);
	      }
	    } else {
	      // array
	      _validate(array, size, 0);
	    }
	  };

	  /**
	   * Test whether index is an integer number with index >= 0 and index < length
	   * when length is provided
	   * @param {number} index    Zero-based index
	   * @param {number} [length] Length of the array
	   */
	  exports.validateIndex = function (index, length) {
	    if (!number.isNumber(index) || !number.isInteger(index)) {
	      throw new TypeError('Index must be an integer (value: ' + index + ')');
	    }
	    if (index < 0 || typeof length === 'number' && index >= length) {
	      throw new IndexError(index, length);
	    }
	  };

	  // a constant used to specify an undefined defaultValue
	  exports.UNINITIALIZED = {};

	  /**
	   * Resize a multi dimensional array. The resized array is returned.
	   * @param {Array} array         Array to be resized
	   * @param {Array.<number>} size Array with the size of each dimension
	   * @param {*} [defaultValue=0]  Value to be filled in in new entries,
	   *                              zero by default. To leave new entries undefined,
	   *                              specify array.UNINITIALIZED as defaultValue
	   * @return {Array} array         The resized array
	   */
	  exports.resize = function (array, size, defaultValue) {
	    // TODO: add support for scalars, having size=[] ?

	    // check the type of the arguments
	    if (!Array.isArray(array) || !Array.isArray(size)) {
	      throw new TypeError('Array expected');
	    }
	    if (size.length === 0) {
	      throw new Error('Resizing to scalar is not supported');
	    }

	    // check whether size contains positive integers
	    size.forEach(function (value) {
	      if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
	        throw new TypeError('Invalid size, must contain positive integers ' + '(size: ' + string.format(size) + ')');
	      }
	    });

	    // recursively resize the array
	    var _defaultValue = defaultValue !== undefined ? defaultValue : 0;
	    _resize(array, size, 0, _defaultValue);

	    return array;
	  };

	  /**
	   * Recursively resize a multi dimensional array
	   * @param {Array} array         Array to be resized
	   * @param {number[]} size       Array with the size of each dimension
	   * @param {number} dim          Current dimension
	   * @param {*} [defaultValue]    Value to be filled in in new entries,
	   *                              undefined by default.
	   * @private
	   */
	  function _resize(array, size, dim, defaultValue) {
	    var i;
	    var elem;
	    var oldLen = array.length;
	    var newLen = size[dim];
	    var minLen = Math.min(oldLen, newLen);

	    // apply new length
	    array.length = newLen;

	    if (dim < size.length - 1) {
	      // non-last dimension
	      var dimNext = dim + 1;

	      // resize existing child arrays
	      for (i = 0; i < minLen; i++) {
	        // resize child array
	        elem = array[i];
	        if (!Array.isArray(elem)) {
	          elem = [elem]; // add a dimension
	          array[i] = elem;
	        }
	        _resize(elem, size, dimNext, defaultValue);
	      }

	      // create new child arrays
	      for (i = minLen; i < newLen; i++) {
	        // get child array
	        elem = [];
	        array[i] = elem;

	        // resize new child array
	        _resize(elem, size, dimNext, defaultValue);
	      }
	    } else {
	      // last dimension

	      // remove dimensions of existing values
	      for (i = 0; i < minLen; i++) {
	        while (Array.isArray(array[i])) {
	          array[i] = array[i][0];
	        }
	      }

	      if (defaultValue !== exports.UNINITIALIZED) {
	        // fill new elements with the default value
	        for (i = minLen; i < newLen; i++) {
	          array[i] = defaultValue;
	        }
	      }
	    }
	  }

	  /**
	   * Squeeze a multi dimensional array
	   * @param {Array} array
	   * @param {Array} [size]
	   * @returns {Array} returns the array itself
	   */
	  exports.squeeze = function (array, size) {
	    var s = size || exports.size(array);

	    // squeeze outer dimensions
	    while (Array.isArray(array) && array.length === 1) {
	      array = array[0];
	      s.shift();
	    }

	    // find the first dimension to be squeezed
	    var dims = s.length;
	    while (s[dims - 1] === 1) {
	      dims--;
	    }

	    // squeeze inner dimensions
	    if (dims < s.length) {
	      array = _squeeze(array, dims, 0);
	      s.length = dims;
	    }

	    return array;
	  };

	  /**
	   * Recursively squeeze a multi dimensional array
	   * @param {Array} array
	   * @param {number} dims Required number of dimensions
	   * @param {number} dim  Current dimension
	   * @returns {Array | *} Returns the squeezed array
	   * @private
	   */
	  function _squeeze(array, dims, dim) {
	    var i, ii;

	    if (dim < dims) {
	      var next = dim + 1;
	      for (i = 0, ii = array.length; i < ii; i++) {
	        array[i] = _squeeze(array[i], dims, next);
	      }
	    } else {
	      while (Array.isArray(array)) {
	        array = array[0];
	      }
	    }

	    return array;
	  }

	  /**
	   * Unsqueeze a multi dimensional array: add dimensions when missing
	   * 
	   * Paramter `size` will be mutated to match the new, unqueezed matrix size.
	   * 
	   * @param {Array} array
	   * @param {number} dims     Desired number of dimensions of the array
	   * @param {number} [outer]  Number of outer dimensions to be added
	   * @param {Array} [size]    Current size of array.
	   * @returns {Array} returns the array itself
	   * @private
	   */
	  exports.unsqueeze = function (array, dims, outer, size) {
	    var s = size || exports.size(array);

	    // unsqueeze outer dimensions
	    if (outer) {
	      for (var i = 0; i < outer; i++) {
	        array = [array];
	        s.unshift(1);
	      }
	    }

	    // unsqueeze inner dimensions
	    array = _unsqueeze(array, dims, 0);
	    while (s.length < dims) {
	      s.push(1);
	    }

	    return array;
	  };

	  /**
	   * Recursively unsqueeze a multi dimensional array
	   * @param {Array} array
	   * @param {number} dims Required number of dimensions
	   * @param {number} dim  Current dimension
	   * @returns {Array | *} Returns the squeezed array
	   * @private
	   */
	  function _unsqueeze(array, dims, dim) {
	    var i, ii;

	    if (Array.isArray(array)) {
	      var next = dim + 1;
	      for (i = 0, ii = array.length; i < ii; i++) {
	        array[i] = _unsqueeze(array[i], dims, next);
	      }
	    } else {
	      for (var d = dim; d < dims; d++) {
	        array = [array];
	      }
	    }

	    return array;
	  }
	  /**
	   * Flatten a multi dimensional array, put all elements in a one dimensional
	   * array
	   * @param {Array} array   A multi dimensional array
	   * @return {Array}        The flattened array (1 dimensional)
	   */
	  exports.flatten = function (array) {
	    if (!Array.isArray(array)) {
	      //if not an array, return as is
	      return array;
	    }
	    var flat = [];

	    array.forEach(function callback(value) {
	      if (Array.isArray(value)) {
	        value.forEach(callback); //traverse through sub-arrays recursively
	      } else {
	        flat.push(value);
	      }
	    });

	    return flat;
	  };

	  /**
	   * Test whether an object is an array
	   * @param {*} value
	   * @return {boolean} isArray
	   */
	  exports.isArray = Array.isArray;
	});

	var array$3 = interopDefault(array$2);
	var isArray = array$2.isArray;
	var flatten = array$2.flatten;
	var unsqueeze = array$2.unsqueeze;
	var squeeze = array$2.squeeze;
	var resize = array$2.resize;
	var UNINITIALIZED = array$2.UNINITIALIZED;
	var validateIndex = array$2.validateIndex;
	var validate = array$2.validate;
	var size = array$2.size;

var require$$7 = Object.freeze({
	  default: array$3,
	  isArray: isArray,
	  flatten: flatten,
	  unsqueeze: unsqueeze,
	  squeeze: squeeze,
	  resize: resize,
	  UNINITIALIZED: UNINITIALIZED,
	  validateIndex: validateIndex,
	  validate: validate,
	  size: size
	});

	var boolean$1 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  /**
	   * Test whether value is a boolean
	   * @param {*} value
	   * @return {boolean} isBoolean
	   */

	  exports.isBoolean = function (value) {
	    return typeof value == 'boolean';
	  };
	});

	var boolean$2 = interopDefault(boolean$1);
	var isBoolean = boolean$1.isBoolean;

var require$$6 = Object.freeze({
	  default: boolean$2,
	  isBoolean: isBoolean
	});

	var _function = createCommonjsModule(function (module, exports) {
	  // function utils

	  /*
	   * Memoize a given function by caching the computed result.
	   * The cache of a memoized function can be cleared by deleting the `cache`
	   * property of the function.
	   *
	   * @param {function} fn                     The function to be memoized.
	   *                                          Must be a pure function.
	   * @param {function(args: Array)} [hasher]  A custom hash builder.
	   *                                          Is JSON.stringify by default.
	   * @return {function}                       Returns the memoized function
	   */
	  exports.memoize = function (fn, hasher) {
	    return function memoize() {
	      if (babelHelpers.typeof(memoize.cache) !== 'object') {
	        memoize.cache = {};
	      }

	      var args = [];
	      for (var i = 0; i < arguments.length; i++) {
	        args[i] = arguments[i];
	      }

	      var hash = hasher ? hasher(args) : JSON.stringify(args);
	      if (!(hash in memoize.cache)) {
	        return memoize.cache[hash] = fn.apply(fn, args);
	      }
	      return memoize.cache[hash];
	    };
	  };

	  /**
	   * Find the maximum number of arguments expected by a typed function.
	   * @param {function} fn   A typed function
	   * @return {number} Returns the maximum number of expected arguments.
	   *                  Returns -1 when no signatures where found on the function.
	   */
	  exports.maxArgumentCount = function (fn) {
	    return Object.keys(fn.signatures || {}).reduce(function (args, signature) {
	      var count = (signature.match(/,/g) || []).length + 1;
	      return Math.max(args, count);
	    }, -1);
	  };
	});

	var _function$1 = interopDefault(_function);
	var maxArgumentCount = _function.maxArgumentCount;
	var memoize = _function.memoize;

var require$$5 = Object.freeze({
	  default: _function$1,
	  maxArgumentCount: maxArgumentCount,
	  memoize: memoize
	});

	var index$7 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  exports.array = interopDefault(require$$7);
	  exports['boolean'] = interopDefault(require$$6);
	  exports['function'] = interopDefault(require$$5);
	  exports.number = interopDefault(require$$0$2);
	  exports.object = interopDefault(require$$1);
	  exports.string = interopDefault(require$$4);
	  exports.types = interopDefault(require$$2$1);
	  exports.emitter = interopDefault(require$$0$4);
	});

	var index$8 = interopDefault(index$7);
	var emitter$2 = index$7.emitter;
	var types = index$7.types;
	var string$1 = index$7.string;
	var object$2 = index$7.object;
	var number$3 = index$7.number;
	var array$1 = index$7.array;

var require$$2 = Object.freeze({
	  default: index$8,
	  emitter: emitter$2,
	  types: types,
	  string: string$1,
	  object: object$2,
	  number: number$3,
	  array: array$1
	});

	var Matrix = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var util = interopDefault(require$$2);

	  var string = util.string;

	  var isString = string.isString;

	  function factory(type, config, load, typed) {
	    /**
	     * @constructor Matrix
	     *
	     * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
	     * array. A matrix can be constructed as:
	     *     var matrix = math.matrix(data)
	     *
	     * Matrix contains the functions to resize, get and set values, get the size,
	     * clone the matrix and to convert the matrix to a vector, array, or scalar.
	     * Furthermore, one can iterate over the matrix using map and forEach.
	     * The internal Array of the Matrix can be accessed using the function valueOf.
	     *
	     * Example usage:
	     *     var matrix = math.matrix([[1, 2], [3, 4]]);
	     *     matix.size();              // [2, 2]
	     *     matrix.resize([3, 2], 5);
	     *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
	     *     matrix.subset([1,2])       // 3 (indexes are zero-based)
	     *
	     */
	    function Matrix() {
	      if (!(this instanceof Matrix)) {
	        throw new SyntaxError('Constructor must be called with the new operator');
	      }
	    }

	    /**
	     * Attach type information
	     */
	    Matrix.prototype.type = 'Matrix';
	    Matrix.prototype.isMatrix = true;

	    /**
	     * Get the Matrix storage constructor for the given format.
	     *
	     * @param {string} format       The Matrix storage format.
	     *
	     * @return {Function}           The Matrix storage constructor.
	     */
	    Matrix.storage = function (format) {
	      // check storage format is a string
	      if (!isString(format)) {
	        throw new TypeError('format must be a string value');
	      }

	      // get storage format constructor
	      var constructor = Matrix._storage[format];
	      if (!constructor) {
	        throw new SyntaxError('Unsupported matrix storage format: ' + format);
	      }

	      // return storage constructor
	      return constructor;
	    };

	    // a map with all constructors for all storage types
	    Matrix._storage = {};

	    /**
	     * Get the storage format used by the matrix.
	     *
	     * Usage:
	     *     var format = matrix.storage()                   // retrieve storage format
	     *
	     * @return {string}           The storage format.
	     */
	    Matrix.prototype.storage = function () {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke storage on a Matrix interface');
	    };

	    /**
	     * Get the datatype of the data stored in the matrix.
	     *
	     * Usage:
	     *     var format = matrix.datatype()                   // retrieve matrix datatype
	     *
	     * @return {string}           The datatype.
	     */
	    Matrix.prototype.datatype = function () {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke datatype on a Matrix interface');
	    };

	    /**
	     * Create a new Matrix With the type of the current matrix instance
	     * @param {Array | Object} data
	     * @param {string} [datatype]
	     */
	    Matrix.prototype.create = function (data, datatype) {
	      throw new Error('Cannot invoke create on a Matrix interface');
	    };

	    /**
	     * Get a subset of the matrix, or replace a subset of the matrix.
	     *
	     * Usage:
	     *     var subset = matrix.subset(index)               // retrieve subset
	     *     var value = matrix.subset(index, replacement)   // replace subset
	     *
	     * @param {Index} index
	     * @param {Array | Matrix | *} [replacement]
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be filled with zeros.
	     */
	    Matrix.prototype.subset = function (index, replacement, defaultValue) {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke subset on a Matrix interface');
	    };

	    /**
	     * Get a single element from the matrix.
	     * @param {number[]} index   Zero-based index
	     * @return {*} value
	     */
	    Matrix.prototype.get = function (index) {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke get on a Matrix interface');
	    };

	    /**
	     * Replace a single element in the matrix.
	     * @param {number[]} index   Zero-based index
	     * @param {*} value
	     * @param {*} [defaultValue]        Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be left undefined.
	     * @return {Matrix} self
	     */
	    Matrix.prototype.set = function (index, value, defaultValue) {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke set on a Matrix interface');
	    };

	    /**
	     * Resize the matrix to the given size. Returns a copy of the matrix when 
	     * `copy=true`, otherwise return the matrix itself (resize in place).
	     *
	     * @param {number[]} size           The new size the matrix should have.
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries.
	     *                                  If not provided, the matrix elements will
	     *                                  be filled with zeros.
	     * @param {boolean} [copy]          Return a resized copy of the matrix
	     *
	     * @return {Matrix}                 The resized matrix
	     */
	    Matrix.prototype.resize = function (size, defaultValue) {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke resize on a Matrix interface');
	    };

	    /**
	     * Create a clone of the matrix
	     * @return {Matrix} clone
	     */
	    Matrix.prototype.clone = function () {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke clone on a Matrix interface');
	    };

	    /**
	     * Retrieve the size of the matrix.
	     * @returns {number[]} size
	     */
	    Matrix.prototype.size = function () {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke size on a Matrix interface');
	    };

	    /**
	     * Create a new matrix with the results of the callback function executed on
	     * each entry of the matrix.
	     * @param {Function} callback   The callback function is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Matrix being traversed.
	     * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
	     *
	     * @return {Matrix} matrix
	     */
	    Matrix.prototype.map = function (callback, skipZeros) {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke map on a Matrix interface');
	    };

	    /**
	     * Execute a callback function on each entry of the matrix.
	     * @param {Function} callback   The callback function is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Matrix being traversed.
	     */
	    Matrix.prototype.forEach = function (callback) {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke forEach on a Matrix interface');
	    };

	    /**
	     * Create an Array with a copy of the data of the Matrix
	     * @returns {Array} array
	     */
	    Matrix.prototype.toArray = function () {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke toArray on a Matrix interface');
	    };

	    /**
	     * Get the primitive value of the Matrix: a multidimensional array
	     * @returns {Array} array
	     */
	    Matrix.prototype.valueOf = function () {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke valueOf on a Matrix interface');
	    };

	    /**
	     * Get a string representation of the matrix, with optional formatting options.
	     * @param {Object | number | Function} [options]  Formatting options. See
	     *                                                lib/utils/number:format for a
	     *                                                description of the available
	     *                                                options.
	     * @returns {string} str
	     */
	    Matrix.prototype.format = function (options) {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke format on a Matrix interface');
	    };

	    /**
	     * Get a string representation of the matrix
	     * @returns {string} str
	     */
	    Matrix.prototype.toString = function () {
	      // must be implemented by each of the Matrix implementations
	      throw new Error('Cannot invoke toString on a Matrix interface');
	    };

	    // exports
	    return Matrix;
	  }

	  exports.name = 'Matrix';
	  exports.path = 'type';
	  exports.factory = factory;
	});

	var Matrix$1 = interopDefault(Matrix);
	var factory$2 = Matrix.factory;
	var path$1 = Matrix.path;
	var name$2 = Matrix.name;

var require$$1$3 = Object.freeze({
	  default: Matrix$1,
	  factory: factory$2,
	  path: path$1,
	  name: name$2
	});

	var DenseMatrix = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var util = interopDefault(require$$2);
	  var DimensionError = interopDefault(require$$0$9);

	  var string = util.string;
	  var array = util.array;
	  var object = util.object;
	  var number = util.number;

	  var isArray = Array.isArray;
	  var isNumber = number.isNumber;
	  var isInteger = number.isInteger;
	  var isString = string.isString;

	  var validateIndex = array.validateIndex;

	  function factory(type, config, load, typed) {
	    var Matrix = load(interopDefault(require$$1$3)); // force loading Matrix (do not use via type.Matrix)

	    /**
	     * Dense Matrix implementation. A regular, dense matrix, supporting multi-dimensional matrices. This is the default matrix type.
	     * @class DenseMatrix
	     */
	    function DenseMatrix(data, datatype) {
	      if (!(this instanceof DenseMatrix)) throw new SyntaxError('Constructor must be called with the new operator');
	      if (datatype && !isString(datatype)) throw new Error('Invalid datatype: ' + datatype);

	      if (data && data.isMatrix === true) {
	        // check data is a DenseMatrix
	        if (data.type === 'DenseMatrix') {
	          // clone data & size
	          this._data = object.clone(data._data);
	          this._size = object.clone(data._size);
	          this._datatype = datatype || data._datatype;
	        } else {
	          // build data from existing matrix
	          this._data = data.toArray();
	          this._size = data.size();
	          this._datatype = datatype || data._datatype;
	        }
	      } else if (data && isArray(data.data) && isArray(data.size)) {
	        // initialize fields from JSON representation
	        this._data = data.data;
	        this._size = data.size;
	        this._datatype = datatype || data.datatype;
	      } else if (isArray(data)) {
	        // replace nested Matrices with Arrays
	        this._data = preprocess(data);
	        // get the dimensions of the array
	        this._size = array.size(this._data);
	        // verify the dimensions of the array, TODO: compute size while processing array
	        array.validate(this._data, this._size);
	        // data type unknown
	        this._datatype = datatype;
	      } else if (data) {
	        // unsupported type
	        throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
	      } else {
	        // nothing provided
	        this._data = [];
	        this._size = [0];
	        this._datatype = datatype;
	      }
	    }

	    DenseMatrix.prototype = new Matrix();

	    /**
	     * Attach type information
	     */
	    DenseMatrix.prototype.type = 'DenseMatrix';
	    DenseMatrix.prototype.isDenseMatrix = true;

	    /**
	     * Get the storage format used by the matrix.
	     *
	     * Usage:
	     *     var format = matrix.storage()                   // retrieve storage format
	     *
	     * @memberof DenseMatrix
	     * @return {string}           The storage format.
	     */
	    DenseMatrix.prototype.storage = function () {
	      return 'dense';
	    };

	    /**
	     * Get the datatype of the data stored in the matrix.
	     *
	     * Usage:
	     *     var format = matrix.datatype()                   // retrieve matrix datatype
	     *
	     * @memberof DenseMatrix
	     * @return {string}           The datatype.
	     */
	    DenseMatrix.prototype.datatype = function () {
	      return this._datatype;
	    };

	    /**
	     * Create a new DenseMatrix
	     * @memberof DenseMatrix
	     * @param {Array} data
	     * @param {string} [datatype]
	     */
	    DenseMatrix.prototype.create = function (data, datatype) {
	      return new DenseMatrix(data, datatype);
	    };

	    /**
	     * Get a subset of the matrix, or replace a subset of the matrix.
	     *
	     * Usage:
	     *     var subset = matrix.subset(index)               // retrieve subset
	     *     var value = matrix.subset(index, replacement)   // replace subset
	     *
	     * @memberof DenseMatrix
	     * @param {Index} index
	     * @param {Array | DenseMatrix | *} [replacement]
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be filled with zeros.
	     */
	    DenseMatrix.prototype.subset = function (index, replacement, defaultValue) {
	      switch (arguments.length) {
	        case 1:
	          return _get(this, index);

	        // intentional fall through
	        case 2:
	        case 3:
	          return _set(this, index, replacement, defaultValue);

	        default:
	          throw new SyntaxError('Wrong number of arguments');
	      }
	    };

	    /**
	     * Get a single element from the matrix.
	     * @memberof DenseMatrix
	     * @param {number[]} index   Zero-based index
	     * @return {*} value
	     */
	    DenseMatrix.prototype.get = function (index) {
	      if (!isArray(index)) throw new TypeError('Array expected');
	      if (index.length != this._size.length) throw new DimensionError(index.length, this._size.length);

	      // check index
	      for (var x = 0; x < index.length; x++) {
	        validateIndex(index[x], this._size[x]);
	      }var data = this._data;
	      for (var i = 0, ii = index.length; i < ii; i++) {
	        var index_i = index[i];
	        validateIndex(index_i, data.length);
	        data = data[index_i];
	      }

	      return data;
	    };

	    /**
	     * Replace a single element in the matrix.
	     * @memberof DenseMatrix
	     * @param {number[]} index   Zero-based index
	     * @param {*} value
	     * @param {*} [defaultValue]        Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be left undefined.
	     * @return {DenseMatrix} self
	     */
	    DenseMatrix.prototype.set = function (index, value, defaultValue) {
	      if (!isArray(index)) throw new TypeError('Array expected');
	      if (index.length < this._size.length) throw new DimensionError(index.length, this._size.length, '<');

	      var i, ii, index_i;

	      // enlarge matrix when needed
	      var size = index.map(function (i) {
	        return i + 1;
	      });
	      _fit(this, size, defaultValue);

	      // traverse over the dimensions
	      var data = this._data;
	      for (i = 0, ii = index.length - 1; i < ii; i++) {
	        index_i = index[i];
	        validateIndex(index_i, data.length);
	        data = data[index_i];
	      }

	      // set new value
	      index_i = index[index.length - 1];
	      validateIndex(index_i, data.length);
	      data[index_i] = value;

	      return this;
	    };

	    /**
	     * Get a submatrix of this matrix
	     * @memberof DenseMatrix
	     * @param {DenseMatrix} matrix
	     * @param {Index} index   Zero-based index
	     * @private
	     */
	    function _get(matrix, index) {
	      if (!index || index.isIndex !== true) {
	        throw new TypeError('Invalid index');
	      }

	      var isScalar = index.isScalar();
	      if (isScalar) {
	        // return a scalar
	        return matrix.get(index.min());
	      } else {
	        // validate dimensions
	        var size = index.size();
	        if (size.length != matrix._size.length) {
	          throw new DimensionError(size.length, matrix._size.length);
	        }

	        // validate if any of the ranges in the index is out of range
	        var min = index.min();
	        var max = index.max();
	        for (var i = 0, ii = matrix._size.length; i < ii; i++) {
	          validateIndex(min[i], matrix._size[i]);
	          validateIndex(max[i], matrix._size[i]);
	        }

	        // retrieve submatrix
	        // TODO: more efficient when creating an empty matrix and setting _data and _size manually
	        return new DenseMatrix(_getSubmatrix(matrix._data, index, size.length, 0), matrix._datatype);
	      }
	    }

	    /**
	     * Recursively get a submatrix of a multi dimensional matrix.
	     * Index is not checked for correct number or length of dimensions.
	     * @memberof DenseMatrix
	     * @param {Array} data
	     * @param {Index} index
	     * @param {number} dims   Total number of dimensions
	     * @param {number} dim    Current dimension
	     * @return {Array} submatrix
	     * @private
	     */
	    function _getSubmatrix(data, index, dims, dim) {
	      var last = dim == dims - 1;
	      var range = index.dimension(dim);

	      if (last) {
	        return range.map(function (i) {
	          return data[i];
	        }).valueOf();
	      } else {
	        return range.map(function (i) {
	          var child = data[i];
	          return _getSubmatrix(child, index, dims, dim + 1);
	        }).valueOf();
	      }
	    }

	    /**
	     * Replace a submatrix in this matrix
	     * Indexes are zero-based.
	     * @memberof DenseMatrix
	     * @param {DenseMatrix} matrix
	     * @param {Index} index
	     * @param {DenseMatrix | Array | *} submatrix
	     * @param {*} defaultValue          Default value, filled in on new entries when
	     *                                  the matrix is resized.
	     * @return {DenseMatrix} matrix
	     * @private
	     */
	    function _set(matrix, index, submatrix, defaultValue) {
	      if (!index || index.isIndex !== true) {
	        throw new TypeError('Invalid index');
	      }

	      // get index size and check whether the index contains a single value
	      var iSize = index.size(),
	          isScalar = index.isScalar();

	      // calculate the size of the submatrix, and convert it into an Array if needed
	      var sSize;
	      if (submatrix && submatrix.isMatrix === true) {
	        sSize = submatrix.size();
	        submatrix = submatrix.valueOf();
	      } else {
	        sSize = array.size(submatrix);
	      }

	      if (isScalar) {
	        // set a scalar

	        // check whether submatrix is a scalar
	        if (sSize.length !== 0) {
	          throw new TypeError('Scalar expected');
	        }

	        matrix.set(index.min(), submatrix, defaultValue);
	      } else {
	        // set a submatrix

	        // validate dimensions
	        if (iSize.length < matrix._size.length) {
	          throw new DimensionError(iSize.length, matrix._size.length, '<');
	        }

	        if (sSize.length < iSize.length) {
	          // calculate number of missing outer dimensions
	          var i = 0;
	          var outer = 0;
	          while (iSize[i] === 1 && sSize[i] === 1) {
	            i++;
	          }
	          while (iSize[i] === 1) {
	            outer++;
	            i++;
	          }

	          // unsqueeze both outer and inner dimensions
	          submatrix = array.unsqueeze(submatrix, iSize.length, outer, sSize);
	        }

	        // check whether the size of the submatrix matches the index size
	        if (!object.deepEqual(iSize, sSize)) {
	          throw new DimensionError(iSize, sSize, '>');
	        }

	        // enlarge matrix when needed
	        var size = index.max().map(function (i) {
	          return i + 1;
	        });
	        _fit(matrix, size, defaultValue);

	        // insert the sub matrix
	        var dims = iSize.length,
	            dim = 0;
	        _setSubmatrix(matrix._data, index, submatrix, dims, dim);
	      }

	      return matrix;
	    }

	    /**
	     * Replace a submatrix of a multi dimensional matrix.
	     * @memberof DenseMatrix
	     * @param {Array} data
	     * @param {Index} index
	     * @param {Array} submatrix
	     * @param {number} dims   Total number of dimensions
	     * @param {number} dim
	     * @private
	     */
	    function _setSubmatrix(data, index, submatrix, dims, dim) {
	      var last = dim == dims - 1,
	          range = index.dimension(dim);

	      if (last) {
	        range.forEach(function (dataIndex, subIndex) {
	          validateIndex(dataIndex);
	          data[dataIndex] = submatrix[subIndex[0]];
	        });
	      } else {
	        range.forEach(function (dataIndex, subIndex) {
	          validateIndex(dataIndex);
	          _setSubmatrix(data[dataIndex], index, submatrix[subIndex[0]], dims, dim + 1);
	        });
	      }
	    }

	    /**
	     * Resize the matrix to the given size. Returns a copy of the matrix when
	     * `copy=true`, otherwise return the matrix itself (resize in place).
	     *
	     * @memberof DenseMatrix
	     * @param {number[]} size           The new size the matrix should have.
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries.
	     *                                  If not provided, the matrix elements will
	     *                                  be filled with zeros.
	     * @param {boolean} [copy]          Return a resized copy of the matrix
	     *
	     * @return {Matrix}                 The resized matrix
	     */
	    DenseMatrix.prototype.resize = function (size, defaultValue, copy) {
	      // validate arguments
	      if (!isArray(size)) throw new TypeError('Array expected');

	      // matrix to resize
	      var m = copy ? this.clone() : this;
	      // resize matrix
	      return _resize(m, size, defaultValue);
	    };

	    var _resize = function _resize(matrix, size, defaultValue) {
	      // check size
	      if (size.length === 0) {
	        // first value in matrix
	        var v = matrix._data;
	        // go deep
	        while (isArray(v)) {
	          v = v[0];
	        }
	        return v;
	      }
	      // resize matrix
	      matrix._size = size.slice(0); // copy the array
	      matrix._data = array.resize(matrix._data, matrix._size, defaultValue);
	      // return matrix
	      return matrix;
	    };

	    /**
	     * Enlarge the matrix when it is smaller than given size.
	     * If the matrix is larger or equal sized, nothing is done.
	     * @memberof DenseMatrix
	     * @param {DenseMatrix} matrix           The matrix to be resized
	     * @param {number[]} size
	     * @param {*} defaultValue          Default value, filled in on new entries.
	     * @private
	     */
	    function _fit(matrix, size, defaultValue) {
	      var newSize = matrix._size.slice(0),
	          // copy the array
	      changed = false;

	      // add dimensions when needed
	      while (newSize.length < size.length) {
	        newSize.push(0);
	        changed = true;
	      }

	      // enlarge size when needed
	      for (var i = 0, ii = size.length; i < ii; i++) {
	        if (size[i] > newSize[i]) {
	          newSize[i] = size[i];
	          changed = true;
	        }
	      }

	      if (changed) {
	        // resize only when size is changed
	        _resize(matrix, newSize, defaultValue);
	      }
	    }

	    /**
	     * Create a clone of the matrix
	     * @memberof DenseMatrix
	     * @return {DenseMatrix} clone
	     */
	    DenseMatrix.prototype.clone = function () {
	      var m = new DenseMatrix({
	        data: object.clone(this._data),
	        size: object.clone(this._size),
	        datatype: this._datatype
	      });
	      return m;
	    };

	    /**
	     * Retrieve the size of the matrix.
	     * @memberof DenseMatrix
	     * @returns {number[]} size
	     */
	    DenseMatrix.prototype.size = function () {
	      return this._size.slice(0); // return a clone of _size
	    };

	    /**
	     * Create a new matrix with the results of the callback function executed on
	     * each entry of the matrix.
	     * @memberof DenseMatrix
	     * @param {Function} callback   The callback function is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Matrix being traversed.
	     *
	     * @return {DenseMatrix} matrix
	     */
	    DenseMatrix.prototype.map = function (callback) {
	      // matrix instance
	      var me = this;
	      var recurse = function recurse(value, index) {
	        if (isArray(value)) {
	          return value.map(function (child, i) {
	            return recurse(child, index.concat(i));
	          });
	        } else {
	          return callback(value, index, me);
	        }
	      };
	      // return dense format
	      return new DenseMatrix({
	        data: recurse(this._data, []),
	        size: object.clone(this._size),
	        datatype: this._datatype
	      });
	    };

	    /**
	     * Execute a callback function on each entry of the matrix.
	     * @memberof DenseMatrix
	     * @param {Function} callback   The callback function is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Matrix being traversed.
	     */
	    DenseMatrix.prototype.forEach = function (callback) {
	      // matrix instance
	      var me = this;
	      var recurse = function recurse(value, index) {
	        if (isArray(value)) {
	          value.forEach(function (child, i) {
	            recurse(child, index.concat(i));
	          });
	        } else {
	          callback(value, index, me);
	        }
	      };
	      recurse(this._data, []);
	    };

	    /**
	     * Create an Array with a copy of the data of the DenseMatrix
	     * @memberof DenseMatrix
	     * @returns {Array} array
	     */
	    DenseMatrix.prototype.toArray = function () {
	      return object.clone(this._data);
	    };

	    /**
	     * Get the primitive value of the DenseMatrix: a multidimensional array
	     * @memberof DenseMatrix
	     * @returns {Array} array
	     */
	    DenseMatrix.prototype.valueOf = function () {
	      return this._data;
	    };

	    /**
	     * Get a string representation of the matrix, with optional formatting options.
	     * @memberof DenseMatrix
	     * @param {Object | number | Function} [options]  Formatting options. See
	     *                                                lib/utils/number:format for a
	     *                                                description of the available
	     *                                                options.
	     * @returns {string} str
	     */
	    DenseMatrix.prototype.format = function (options) {
	      return string.format(this._data, options);
	    };

	    /**
	     * Get a string representation of the matrix
	     * @memberof DenseMatrix
	     * @returns {string} str
	     */
	    DenseMatrix.prototype.toString = function () {
	      return string.format(this._data);
	    };

	    /**
	     * Get a JSON representation of the matrix
	     * @memberof DenseMatrix
	     * @returns {Object}
	     */
	    DenseMatrix.prototype.toJSON = function () {
	      return {
	        mathjs: 'DenseMatrix',
	        data: this._data,
	        size: this._size,
	        datatype: this._datatype
	      };
	    };

	    /**
	     * Get the kth Matrix diagonal.
	     *
	     * @memberof DenseMatrix
	     * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
	     *
	     * @returns {Array}                      The array vector with the diagonal values.
	     */
	    DenseMatrix.prototype.diagonal = function (k) {
	      // validate k if any
	      if (k) {
	        // convert BigNumber to a number
	        if (k.isBigNumber === true) k = k.toNumber();
	        // is must be an integer
	        if (!isNumber(k) || !isInteger(k)) {
	          throw new TypeError('The parameter k must be an integer number');
	        }
	      } else {
	        // default value
	        k = 0;
	      }

	      var kSuper = k > 0 ? k : 0;
	      var kSub = k < 0 ? -k : 0;

	      // rows & columns
	      var rows = this._size[0];
	      var columns = this._size[1];

	      // number diagonal values
	      var n = Math.min(rows - kSub, columns - kSuper);

	      // x is a matrix get diagonal from matrix
	      var data = [];

	      // loop rows
	      for (var i = 0; i < n; i++) {
	        data[i] = this._data[i + kSub][i + kSuper];
	      }

	      // create DenseMatrix
	      return new DenseMatrix({
	        data: data,
	        size: [n],
	        datatype: this._datatype
	      });
	    };

	    /**
	     * Create a diagonal matrix.
	     *
	     * @memberof DenseMatrix
	     * @param {Array} size                   The matrix size.
	     * @param {number | Array} value          The values for the diagonal.
	     * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will be filled in.
	     * @param {number} [defaultValue]        The default value for non-diagonal
	     *
	     * @returns {DenseMatrix}
	     */
	    DenseMatrix.diagonal = function (size, value, k, defaultValue, datatype) {
	      if (!isArray(size)) throw new TypeError('Array expected, size parameter');
	      if (size.length !== 2) throw new Error('Only two dimensions matrix are supported');

	      // map size & validate
	      size = size.map(function (s) {
	        // check it is a big number
	        if (s && s.isBigNumber === true) {
	          // convert it
	          s = s.toNumber();
	        }
	        // validate arguments
	        if (!isNumber(s) || !isInteger(s) || s < 1) {
	          throw new Error('Size values must be positive integers');
	        }
	        return s;
	      });

	      // validate k if any
	      if (k) {
	        // convert BigNumber to a number
	        if (k && k.isBigNumber === true) k = k.toNumber();
	        // is must be an integer
	        if (!isNumber(k) || !isInteger(k)) {
	          throw new TypeError('The parameter k must be an integer number');
	        }
	      } else {
	        // default value
	        k = 0;
	      }

	      if (defaultValue && isString(datatype)) {
	        // convert defaultValue to the same datatype
	        defaultValue = typed.convert(defaultValue, datatype);
	      }

	      var kSuper = k > 0 ? k : 0;
	      var kSub = k < 0 ? -k : 0;

	      // rows and columns
	      var rows = size[0];
	      var columns = size[1];

	      // number of non-zero items
	      var n = Math.min(rows - kSub, columns - kSuper);

	      // value extraction function
	      var _value;

	      // check value
	      if (isArray(value)) {
	        // validate array
	        if (value.length !== n) {
	          // number of values in array must be n
	          throw new Error('Invalid value array length');
	        }
	        // define function
	        _value = function _value(i) {
	          // return value @ i
	          return value[i];
	        };
	      } else if (value && value.isMatrix === true) {
	        // matrix size
	        var ms = value.size();
	        // validate matrix
	        if (ms.length !== 1 || ms[0] !== n) {
	          // number of values in array must be n
	          throw new Error('Invalid matrix length');
	        }
	        // define function
	        _value = function _value(i) {
	          // return value @ i
	          return value.get([i]);
	        };
	      } else {
	        // define function
	        _value = function _value() {
	          // return value
	          return value;
	        };
	      }

	      // discover default value if needed
	      if (!defaultValue) {
	        // check first value in array
	        defaultValue = _value(0) && _value(0).isBigNumber === true ? new type.BigNumber(0) : 0;
	      }

	      // empty array
	      var data = [];

	      // check we need to resize array
	      if (size.length > 0) {
	        // resize array
	        data = array.resize(data, size, defaultValue);
	        // fill diagonal
	        for (var d = 0; d < n; d++) {
	          data[d + kSub][d + kSuper] = _value(d);
	        }
	      }

	      // create DenseMatrix
	      return new DenseMatrix({
	        data: data,
	        size: [rows, columns]
	      });
	    };

	    /**
	     * Generate a matrix from a JSON object
	     * @memberof DenseMatrix
	     * @param {Object} json  An object structured like
	     *                       `{"mathjs": "DenseMatrix", data: [], size: []}`,
	     *                       where mathjs is optional
	     * @returns {DenseMatrix}
	     */
	    DenseMatrix.fromJSON = function (json) {
	      return new DenseMatrix(json);
	    };

	    /**
	     * Swap rows i and j in Matrix.
	     *
	     * @memberof DenseMatrix
	     * @param {number} i       Matrix row index 1
	     * @param {number} j       Matrix row index 2
	     *
	     * @return {Matrix}        The matrix reference
	     */
	    DenseMatrix.prototype.swapRows = function (i, j) {
	      // check index
	      if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
	        throw new Error('Row index must be positive integers');
	      }
	      // check dimensions
	      if (this._size.length !== 2) {
	        throw new Error('Only two dimensional matrix is supported');
	      }
	      // validate index
	      validateIndex(i, this._size[0]);
	      validateIndex(j, this._size[0]);

	      // swap rows
	      DenseMatrix._swapRows(i, j, this._data);
	      // return current instance
	      return this;
	    };

	    /**
	     * Swap rows i and j in Dense Matrix data structure.
	     *
	     * @param {number} i       Matrix row index 1
	     * @param {number} j       Matrix row index 2
	     */
	    DenseMatrix._swapRows = function (i, j, data) {
	      // swap values i <-> j
	      var vi = data[i];
	      data[i] = data[j];
	      data[j] = vi;
	    };

	    /**
	     * Preprocess data, which can be an Array or DenseMatrix with nested Arrays and
	     * Matrices. Replaces all nested Matrices with Arrays
	     * @memberof DenseMatrix
	     * @param {Array} data
	     * @return {Array} data
	     */
	    function preprocess(data) {
	      for (var i = 0, ii = data.length; i < ii; i++) {
	        var elem = data[i];
	        if (isArray(elem)) {
	          data[i] = preprocess(elem);
	        } else if (elem && elem.isMatrix === true) {
	          data[i] = preprocess(elem.valueOf());
	        }
	      }

	      return data;
	    }

	    // register this type in the base class Matrix
	    type.Matrix._storage.dense = DenseMatrix;
	    type.Matrix._storage['default'] = DenseMatrix;

	    // exports
	    return DenseMatrix;
	  }

	  exports.name = 'DenseMatrix';
	  exports.path = 'type';
	  exports.factory = factory;
	  exports.lazy = false; // no lazy loading, as we alter type.Matrix._storage
	});

	var DenseMatrix$1 = interopDefault(DenseMatrix);
	var lazy$2 = DenseMatrix.lazy;
	var factory$3 = DenseMatrix.factory;
	var path$2 = DenseMatrix.path;
	var name$3 = DenseMatrix.name;

var require$$1$4 = Object.freeze({
	  default: DenseMatrix$1,
	  lazy: lazy$2,
	  factory: factory$3,
	  path: path$2,
	  name: name$3
	});

	var nearlyEqual$1 = createCommonjsModule(function (module) {
	  'use strict';

	  /**
	   * Compares two BigNumbers.
	   * @param {BigNumber} x       First value to compare
	   * @param {BigNumber} y       Second value to compare
	   * @param {number} [epsilon]  The maximum relative difference between x and y
	   *                            If epsilon is undefined or null, the function will
	   *                            test whether x and y are exactly equal.
	   * @return {boolean} whether the two numbers are nearly equal
	   */

	  module.exports = function nearlyEqual(x, y, epsilon) {
	    // if epsilon is null or undefined, test whether x and y are exactly equal
	    if (epsilon == null) {
	      return x.eq(y);
	    }

	    // use "==" operator, handles infinities
	    if (x.eq(y)) {
	      return true;
	    }

	    // NaN
	    if (x.isNaN() || y.isNaN()) {
	      return false;
	    }

	    // at this point x and y should be finite
	    if (x.isFinite() && y.isFinite()) {
	      // check numbers are very close, needed when comparing numbers near zero
	      var diff = x.minus(y).abs();
	      if (diff.isZero()) {
	        return true;
	      } else {
	        // use relative error
	        var max = x.constructor.max(x.abs(), y.abs());
	        return diff.lte(max.times(epsilon));
	      }
	    }

	    // Infinite and Number or negative Infinite and positive Infinite cases
	    return false;
	  };
	});

	var nearlyEqual$2 = interopDefault(nearlyEqual$1);

var require$$7$1 = Object.freeze({
	  default: nearlyEqual$2
	});

	var equalScalar = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var nearlyEqual = interopDefault(require$$0$2).nearlyEqual;
	  var bigNearlyEqual = interopDefault(require$$7$1);

	  function factory(type, config, load, typed) {

	    /**
	     * Test whether two values are equal.
	     *
	     * @param  {number | BigNumber | Fraction | boolean | Complex | Unit} x   First value to compare
	     * @param  {number | BigNumber | Fraction | boolean | Complex} y          Second value to compare
	     * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
	     * @private
	     */
	    var equalScalar = typed('equalScalar', {

	      'boolean, boolean': function booleanBoolean(x, y) {
	        return x === y;
	      },

	      'number, number': function numberNumber(x, y) {
	        return x === y || nearlyEqual(x, y, config.epsilon);
	      },

	      'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
	        return x.eq(y) || bigNearlyEqual(x, y, config.epsilon);
	      },

	      'Fraction, Fraction': function FractionFraction(x, y) {
	        return x.equals(y);
	      },

	      'Complex, Complex': function ComplexComplex(x, y) {
	        return x.equals(y);
	      },

	      'Unit, Unit': function UnitUnit(x, y) {
	        if (!x.equalBase(y)) {
	          throw new Error('Cannot compare units with different base');
	        }
	        return equalScalar(x.value, y.value);
	      },

	      'string, string': function stringString(x, y) {
	        return x === y;
	      }
	    });

	    return equalScalar;
	  }

	  exports.factory = factory;
	});

	var equalScalar$1 = interopDefault(equalScalar);
	var factory$5 = equalScalar.factory;

var require$$0$11 = Object.freeze({
	  default: equalScalar$1,
	  factory: factory$5
	});

	var SparseMatrix = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var util = interopDefault(require$$2);
	  var DimensionError = interopDefault(require$$0$9);

	  var array = util.array;
	  var object = util.object;
	  var string = util.string;
	  var number = util.number;

	  var isArray = Array.isArray;
	  var isNumber = number.isNumber;
	  var isInteger = number.isInteger;
	  var isString = string.isString;

	  var validateIndex = array.validateIndex;

	  function factory(type, config, load, typed) {
	    var Matrix = load(interopDefault(require$$1$3)); // force loading Matrix (do not use via type.Matrix)
	    var equalScalar = load(interopDefault(require$$0$11));

	    /**
	     * Sparse Matrix implementation. This type implements a Compressed Column Storage format
	     * for sparse matrices.
	     * @class SparseMatrix
	     */
	    function SparseMatrix(data, datatype) {
	      if (!(this instanceof SparseMatrix)) throw new SyntaxError('Constructor must be called with the new operator');
	      if (datatype && !isString(datatype)) throw new Error('Invalid datatype: ' + datatype);

	      if (data && data.isMatrix === true) {
	        // create from matrix
	        _createFromMatrix(this, data, datatype);
	      } else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
	        // initialize fields
	        this._values = data.values;
	        this._index = data.index;
	        this._ptr = data.ptr;
	        this._size = data.size;
	        this._datatype = datatype || data.datatype;
	      } else if (isArray(data)) {
	        // create from array
	        _createFromArray(this, data, datatype);
	      } else if (data) {
	        // unsupported type
	        throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
	      } else {
	        // nothing provided
	        this._values = [];
	        this._index = [];
	        this._ptr = [0];
	        this._size = [0, 0];
	        this._datatype = datatype;
	      }
	    }

	    var _createFromMatrix = function _createFromMatrix(matrix, source, datatype) {
	      // check matrix type
	      if (source.type === 'SparseMatrix') {
	        // clone arrays
	        matrix._values = source._values ? object.clone(source._values) : undefined;
	        matrix._index = object.clone(source._index);
	        matrix._ptr = object.clone(source._ptr);
	        matrix._size = object.clone(source._size);
	        matrix._datatype = datatype || source._datatype;
	      } else {
	        // build from matrix data
	        _createFromArray(matrix, source.valueOf(), datatype || source._datatype);
	      }
	    };

	    var _createFromArray = function _createFromArray(matrix, data, datatype) {
	      // initialize fields
	      matrix._values = [];
	      matrix._index = [];
	      matrix._ptr = [];
	      matrix._datatype = datatype;
	      // discover rows & columns, do not use math.size() to avoid looping array twice
	      var rows = data.length;
	      var columns = 0;

	      // equal signature to use
	      var eq = equalScalar;
	      // zero value
	      var zero = 0;

	      if (isString(datatype)) {
	        // find signature that matches (datatype, datatype)
	        eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar;
	        // convert 0 to the same datatype
	        zero = typed.convert(0, datatype);
	      }

	      // check we have rows (empty array)
	      if (rows > 0) {
	        // column index
	        var j = 0;
	        do {
	          // store pointer to values index
	          matrix._ptr.push(matrix._index.length);
	          // loop rows
	          for (var i = 0; i < rows; i++) {
	            // current row
	            var row = data[i];
	            // check row is an array
	            if (isArray(row)) {
	              // update columns if needed (only on first column)
	              if (j === 0 && columns < row.length) columns = row.length;
	              // check row has column
	              if (j < row.length) {
	                // value
	                var v = row[j];
	                // check value != 0
	                if (!eq(v, zero)) {
	                  // store value
	                  matrix._values.push(v);
	                  // index
	                  matrix._index.push(i);
	                }
	              }
	            } else {
	              // update columns if needed (only on first column)
	              if (j === 0 && columns < 1) columns = 1;
	              // check value != 0 (row is a scalar)
	              if (!eq(row, zero)) {
	                // store value
	                matrix._values.push(row);
	                // index
	                matrix._index.push(i);
	              }
	            }
	          }
	          // increment index
	          j++;
	        } while (j < columns);
	      }
	      // store number of values in ptr
	      matrix._ptr.push(matrix._index.length);
	      // size
	      matrix._size = [rows, columns];
	    };

	    SparseMatrix.prototype = new Matrix();

	    /**
	     * Attach type information
	     */
	    SparseMatrix.prototype.type = 'SparseMatrix';
	    SparseMatrix.prototype.isSparseMatrix = true;

	    /**
	     * Get the storage format used by the matrix.
	     *
	     * Usage:
	     *     var format = matrix.storage()                   // retrieve storage format
	     *
	     * @memberof SparseMatrix
	     * @return {string}           The storage format.
	     */
	    SparseMatrix.prototype.storage = function () {
	      return 'sparse';
	    };

	    /**
	     * Get the datatype of the data stored in the matrix.
	     *
	     * Usage:
	     *     var format = matrix.datatype()                   // retrieve matrix datatype
	     *
	     * @memberof SparseMatrix
	     * @return {string}           The datatype.
	     */
	    SparseMatrix.prototype.datatype = function () {
	      return this._datatype;
	    };

	    /**
	     * Create a new SparseMatrix
	     * @memberof SparseMatrix
	     * @param {Array} data
	     * @param {string} [datatype]
	     */
	    SparseMatrix.prototype.create = function (data, datatype) {
	      return new SparseMatrix(data, datatype);
	    };

	    /**
	     * Get the matrix density.
	     *
	     * Usage:
	     *     var density = matrix.density()                   // retrieve matrix density
	     *
	     * @memberof SparseMatrix
	     * @return {number}           The matrix density.
	     */
	    SparseMatrix.prototype.density = function () {
	      // rows & columns
	      var rows = this._size[0];
	      var columns = this._size[1];
	      // calculate density
	      return rows !== 0 && columns !== 0 ? this._index.length / (rows * columns) : 0;
	    };

	    /**
	     * Get a subset of the matrix, or replace a subset of the matrix.
	     *
	     * Usage:
	     *     var subset = matrix.subset(index)               // retrieve subset
	     *     var value = matrix.subset(index, replacement)   // replace subset
	     *
	     * @memberof SparseMatrix
	     * @param {Index} index
	     * @param {Array | Maytrix | *} [replacement]
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be filled with zeros.
	     */
	    SparseMatrix.prototype.subset = function (index, replacement, defaultValue) {
	      // check it is a pattern matrix
	      if (!this._values) throw new Error('Cannot invoke subset on a Pattern only matrix');

	      // check arguments
	      switch (arguments.length) {
	        case 1:
	          return _getsubset(this, index);

	        // intentional fall through
	        case 2:
	        case 3:
	          return _setsubset(this, index, replacement, defaultValue);

	        default:
	          throw new SyntaxError('Wrong number of arguments');
	      }
	    };

	    var _getsubset = function _getsubset(matrix, idx) {
	      // check idx
	      if (!idx || idx.isIndex !== true) {
	        throw new TypeError('Invalid index');
	      }

	      var isScalar = idx.isScalar();
	      if (isScalar) {
	        // return a scalar
	        return matrix.get(idx.min());
	      }
	      // validate dimensions
	      var size = idx.size();
	      if (size.length != matrix._size.length) {
	        throw new DimensionError(size.length, matrix._size.length);
	      }

	      // vars
	      var i, ii, k, kk;

	      // validate if any of the ranges in the index is out of range
	      var min = idx.min();
	      var max = idx.max();
	      for (i = 0, ii = matrix._size.length; i < ii; i++) {
	        validateIndex(min[i], matrix._size[i]);
	        validateIndex(max[i], matrix._size[i]);
	      }

	      // matrix arrays
	      var mvalues = matrix._values;
	      var mindex = matrix._index;
	      var mptr = matrix._ptr;

	      // rows & columns dimensions for result matrix
	      var rows = idx.dimension(0);
	      var columns = idx.dimension(1);

	      // workspace & permutation vector
	      var w = [];
	      var pv = [];

	      // loop rows in resulting matrix
	      rows.forEach(function (i, r) {
	        // update permutation vector
	        pv[i] = r[0];
	        // mark i in workspace
	        w[i] = true;
	      });

	      // result matrix arrays
	      var values = mvalues ? [] : undefined;
	      var index = [];
	      var ptr = [];

	      // loop columns in result matrix
	      columns.forEach(function (j) {
	        // update ptr
	        ptr.push(index.length);
	        // loop values in column j
	        for (k = mptr[j], kk = mptr[j + 1]; k < kk; k++) {
	          // row
	          i = mindex[k];
	          // check row is in result matrix
	          if (w[i] === true) {
	            // push index
	            index.push(pv[i]);
	            // check we need to process values
	            if (values) values.push(mvalues[k]);
	          }
	        }
	      });
	      // update ptr
	      ptr.push(index.length);

	      // return matrix
	      return new SparseMatrix({
	        values: values,
	        index: index,
	        ptr: ptr,
	        size: size,
	        datatype: matrix._datatype
	      });
	    };

	    var _setsubset = function _setsubset(matrix, index, submatrix, defaultValue) {
	      // check index
	      if (!index || index.isIndex !== true) {
	        throw new TypeError('Invalid index');
	      }

	      // get index size and check whether the index contains a single value
	      var iSize = index.size(),
	          isScalar = index.isScalar();

	      // calculate the size of the submatrix, and convert it into an Array if needed
	      var sSize;
	      if (submatrix && submatrix.isMatrix === true) {
	        // submatrix size
	        sSize = submatrix.size();
	        // use array representation
	        submatrix = submatrix.toArray();
	      } else {
	        // get submatrix size (array, scalar)
	        sSize = array.size(submatrix);
	      }

	      // check index is a scalar
	      if (isScalar) {
	        // verify submatrix is a scalar
	        if (sSize.length !== 0) {
	          throw new TypeError('Scalar expected');
	        }
	        // set value
	        matrix.set(index.min(), submatrix, defaultValue);
	      } else {
	        // validate dimensions, index size must be one or two dimensions
	        if (iSize.length !== 1 && iSize.length !== 2) {
	          throw new DimensionError(iSize.length, matrix._size.length, '<');
	        }

	        // check submatrix and index have the same dimensions
	        if (sSize.length < iSize.length) {
	          // calculate number of missing outer dimensions
	          var i = 0;
	          var outer = 0;
	          while (iSize[i] === 1 && sSize[i] === 1) {
	            i++;
	          }
	          while (iSize[i] === 1) {
	            outer++;
	            i++;
	          }
	          // unsqueeze both outer and inner dimensions
	          submatrix = array.unsqueeze(submatrix, iSize.length, outer, sSize);
	        }

	        // check whether the size of the submatrix matches the index size
	        if (!object.deepEqual(iSize, sSize)) {
	          throw new DimensionError(iSize, sSize, '>');
	        }

	        // offsets
	        var x0 = index.min()[0];
	        var y0 = index.min()[1];

	        // submatrix rows and columns
	        var m = sSize[0];
	        var n = sSize[1];

	        // loop submatrix
	        for (var x = 0; x < m; x++) {
	          // loop columns
	          for (var y = 0; y < n; y++) {
	            // value at i, j
	            var v = submatrix[x][y];
	            // invoke set (zero value will remove entry from matrix)
	            matrix.set([x + x0, y + y0], v, defaultValue);
	          }
	        }
	      }
	      return matrix;
	    };

	    /**
	     * Get a single element from the matrix.
	     * @memberof SparseMatrix
	     * @param {number[]} index   Zero-based index
	     * @return {*} value
	     */
	    SparseMatrix.prototype.get = function (index) {
	      if (!isArray(index)) throw new TypeError('Array expected');
	      if (index.length != this._size.length) throw new DimensionError(index.length, this._size.length);

	      // check it is a pattern matrix
	      if (!this._values) throw new Error('Cannot invoke get on a Pattern only matrix');

	      // row and column
	      var i = index[0];
	      var j = index[1];

	      // check i, j are valid
	      validateIndex(i, this._size[0]);
	      validateIndex(j, this._size[1]);

	      // find value index
	      var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
	      // check k is prior to next column k and it is in the correct row
	      if (k < this._ptr[j + 1] && this._index[k] === i) return this._values[k];

	      return 0;
	    };

	    /**
	     * Replace a single element in the matrix.
	     * @memberof SparseMatrix
	     * @param {number[]} index   Zero-based index
	     * @param {*} value
	     * @param {*} [defaultValue]        Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be set to zero.
	     * @return {SparseMatrix} self
	     */
	    SparseMatrix.prototype.set = function (index, v, defaultValue) {
	      if (!isArray(index)) throw new TypeError('Array expected');
	      if (index.length != this._size.length) throw new DimensionError(index.length, this._size.length);

	      // check it is a pattern matrix
	      if (!this._values) throw new Error('Cannot invoke set on a Pattern only matrix');

	      // row and column
	      var i = index[0];
	      var j = index[1];

	      // rows & columns
	      var rows = this._size[0];
	      var columns = this._size[1];

	      // equal signature to use
	      var eq = equalScalar;
	      // zero value
	      var zero = 0;

	      if (isString(this._datatype)) {
	        // find signature that matches (datatype, datatype)
	        eq = typed.find(equalScalar, [this._datatype, this._datatype]) || equalScalar;
	        // convert 0 to the same datatype
	        zero = typed.convert(0, this._datatype);
	      }

	      // check we need to resize matrix
	      if (i > rows - 1 || j > columns - 1) {
	        // resize matrix
	        _resize(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue);
	        // update rows & columns
	        rows = this._size[0];
	        columns = this._size[1];
	      }

	      // check i, j are valid
	      validateIndex(i, rows);
	      validateIndex(j, columns);

	      // find value index
	      var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
	      // check k is prior to next column k and it is in the correct row
	      if (k < this._ptr[j + 1] && this._index[k] === i) {
	        // check value != 0
	        if (!eq(v, zero)) {
	          // update value
	          this._values[k] = v;
	        } else {
	          // remove value from matrix
	          _remove(k, j, this._values, this._index, this._ptr);
	        }
	      } else {
	        // insert value @ (i, j)
	        _insert(k, i, j, v, this._values, this._index, this._ptr);
	      }

	      return this;
	    };

	    var _getValueIndex = function _getValueIndex(i, top, bottom, index) {
	      // check row is on the bottom side
	      if (bottom - top === 0) return bottom;
	      // loop rows [top, bottom[
	      for (var r = top; r < bottom; r++) {
	        // check we found value index
	        if (index[r] === i) return r;
	      }
	      // we did not find row
	      return top;
	    };

	    var _remove = function _remove(k, j, values, index, ptr) {
	      // remove value @ k
	      values.splice(k, 1);
	      index.splice(k, 1);
	      // update pointers
	      for (var x = j + 1; x < ptr.length; x++) {
	        ptr[x]--;
	      }
	    };

	    var _insert = function _insert(k, i, j, v, values, index, ptr) {
	      // insert value
	      values.splice(k, 0, v);
	      // update row for k
	      index.splice(k, 0, i);
	      // update column pointers
	      for (var x = j + 1; x < ptr.length; x++) {
	        ptr[x]++;
	      }
	    };

	    /**
	     * Resize the matrix to the given size. Returns a copy of the matrix when 
	     * `copy=true`, otherwise return the matrix itself (resize in place).
	     *
	     * @memberof SparseMatrix
	     * @param {number[]} size           The new size the matrix should have.
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries.
	     *                                  If not provided, the matrix elements will
	     *                                  be filled with zeros.
	     * @param {boolean} [copy]          Return a resized copy of the matrix
	     *
	     * @return {Matrix}                 The resized matrix
	     */
	    SparseMatrix.prototype.resize = function (size, defaultValue, copy) {
	      // validate arguments
	      if (!isArray(size)) throw new TypeError('Array expected');
	      if (size.length !== 2) throw new Error('Only two dimensions matrix are supported');

	      // check sizes
	      size.forEach(function (value) {
	        if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
	          throw new TypeError('Invalid size, must contain positive integers ' + '(size: ' + string.format(size) + ')');
	        }
	      });

	      // matrix to resize
	      var m = copy ? this.clone() : this;
	      // resize matrix
	      return _resize(m, size[0], size[1], defaultValue);
	    };

	    var _resize = function _resize(matrix, rows, columns, defaultValue) {
	      // value to insert at the time of growing matrix
	      var value = defaultValue || 0;

	      // equal signature to use
	      var eq = equalScalar;
	      // zero value
	      var zero = 0;

	      if (isString(matrix._datatype)) {
	        // find signature that matches (datatype, datatype)
	        eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar;
	        // convert 0 to the same datatype
	        zero = typed.convert(0, matrix._datatype);
	        // convert value to the same datatype
	        value = typed.convert(value, matrix._datatype);
	      }

	      // should we insert the value?
	      var ins = !eq(value, zero);

	      // old columns and rows
	      var r = matrix._size[0];
	      var c = matrix._size[1];

	      var i, j, k;

	      // check we need to increase columns
	      if (columns > c) {
	        // loop new columns
	        for (j = c; j < columns; j++) {
	          // update matrix._ptr for current column
	          matrix._ptr[j] = matrix._values.length;
	          // check we need to insert matrix._values
	          if (ins) {
	            // loop rows
	            for (i = 0; i < r; i++) {
	              // add new matrix._values
	              matrix._values.push(value);
	              // update matrix._index
	              matrix._index.push(i);
	            }
	          }
	        }
	        // store number of matrix._values in matrix._ptr
	        matrix._ptr[columns] = matrix._values.length;
	      } else if (columns < c) {
	        // truncate matrix._ptr
	        matrix._ptr.splice(columns + 1, c - columns);
	        // truncate matrix._values and matrix._index
	        matrix._values.splice(matrix._ptr[columns], matrix._values.length);
	        matrix._index.splice(matrix._ptr[columns], matrix._index.length);
	      }
	      // update columns
	      c = columns;

	      // check we need to increase rows
	      if (rows > r) {
	        // check we have to insert values
	        if (ins) {
	          // inserts
	          var n = 0;
	          // loop columns
	          for (j = 0; j < c; j++) {
	            // update matrix._ptr for current column
	            matrix._ptr[j] = matrix._ptr[j] + n;
	            // where to insert matrix._values
	            k = matrix._ptr[j + 1] + n;
	            // pointer
	            var p = 0;
	            // loop new rows, initialize pointer
	            for (i = r; i < rows; i++, p++) {
	              // add value
	              matrix._values.splice(k + p, 0, value);
	              // update matrix._index
	              matrix._index.splice(k + p, 0, i);
	              // increment inserts
	              n++;
	            }
	          }
	          // store number of matrix._values in matrix._ptr
	          matrix._ptr[c] = matrix._values.length;
	        }
	      } else if (rows < r) {
	        // deletes
	        var d = 0;
	        // loop columns
	        for (j = 0; j < c; j++) {
	          // update matrix._ptr for current column
	          matrix._ptr[j] = matrix._ptr[j] - d;
	          // where matrix._values start for next column
	          var k0 = matrix._ptr[j];
	          var k1 = matrix._ptr[j + 1] - d;
	          // loop matrix._index
	          for (k = k0; k < k1; k++) {
	            // row
	            i = matrix._index[k];
	            // check we need to delete value and matrix._index
	            if (i > rows - 1) {
	              // remove value
	              matrix._values.splice(k, 1);
	              // remove item from matrix._index
	              matrix._index.splice(k, 1);
	              // increase deletes
	              d++;
	            }
	          }
	        }
	        // update matrix._ptr for current column
	        matrix._ptr[j] = matrix._values.length;
	      }
	      // update matrix._size
	      matrix._size[0] = rows;
	      matrix._size[1] = columns;
	      // return matrix
	      return matrix;
	    };

	    /**
	     * Create a clone of the matrix
	     * @memberof SparseMatrix
	     * @return {SparseMatrix} clone
	     */
	    SparseMatrix.prototype.clone = function () {
	      var m = new SparseMatrix({
	        values: this._values ? object.clone(this._values) : undefined,
	        index: object.clone(this._index),
	        ptr: object.clone(this._ptr),
	        size: object.clone(this._size),
	        datatype: this._datatype
	      });
	      return m;
	    };

	    /**
	     * Retrieve the size of the matrix.
	     * @memberof SparseMatrix
	     * @returns {number[]} size
	     */
	    SparseMatrix.prototype.size = function () {
	      return this._size.slice(0); // copy the Array
	    };

	    /**
	     * Create a new matrix with the results of the callback function executed on
	     * each entry of the matrix.
	     * @memberof SparseMatrix
	     * @param {Function} callback   The callback function is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Matrix being traversed.
	     * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
	     *
	     * @return {SparseMatrix} matrix
	     */
	    SparseMatrix.prototype.map = function (callback, skipZeros) {
	      // check it is a pattern matrix
	      if (!this._values) throw new Error('Cannot invoke map on a Pattern only matrix');
	      // matrix instance
	      var me = this;
	      // rows and columns
	      var rows = this._size[0];
	      var columns = this._size[1];
	      // invoke callback
	      var invoke = function invoke(v, i, j) {
	        // invoke callback
	        return callback(v, [i, j], me);
	      };
	      // invoke _map
	      return _map(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros);
	    };

	    /**
	     * Create a new matrix with the results of the callback function executed on the interval
	     * [minRow..maxRow, minColumn..maxColumn].
	     */
	    var _map = function _map(matrix, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
	      // result arrays
	      var values = [];
	      var index = [];
	      var ptr = [];

	      // equal signature to use
	      var eq = equalScalar;
	      // zero value
	      var zero = 0;

	      if (isString(matrix._datatype)) {
	        // find signature that matches (datatype, datatype)
	        eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar;
	        // convert 0 to the same datatype
	        zero = typed.convert(0, matrix._datatype);
	      }

	      // invoke callback
	      var invoke = function invoke(v, x, y) {
	        // invoke callback
	        v = callback(v, x, y);
	        // check value != 0
	        if (!eq(v, zero)) {
	          // store value
	          values.push(v);
	          // index
	          index.push(x);
	        }
	      };
	      // loop columns
	      for (var j = minColumn; j <= maxColumn; j++) {
	        // store pointer to values index
	        ptr.push(values.length);
	        // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
	        var k0 = matrix._ptr[j];
	        var k1 = matrix._ptr[j + 1];
	        // row pointer
	        var p = minRow;
	        // loop k within [k0, k1[
	        for (var k = k0; k < k1; k++) {
	          // row index
	          var i = matrix._index[k];
	          // check i is in range
	          if (i >= minRow && i <= maxRow) {
	            // zero values
	            if (!skipZeros) {
	              for (var x = p; x < i; x++) {
	                invoke(0, x - minRow, j - minColumn);
	              }
	            }
	            // value @ k
	            invoke(matrix._values[k], i - minRow, j - minColumn);
	          }
	          // update pointer
	          p = i + 1;
	        }
	        // zero values
	        if (!skipZeros) {
	          for (var y = p; y <= maxRow; y++) {
	            invoke(0, y - minRow, j - minColumn);
	          }
	        }
	      }
	      // store number of values in ptr
	      ptr.push(values.length);
	      // return sparse matrix
	      return new SparseMatrix({
	        values: values,
	        index: index,
	        ptr: ptr,
	        size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
	      });
	    };

	    /**
	     * Execute a callback function on each entry of the matrix.
	     * @memberof SparseMatrix
	     * @param {Function} callback   The callback function is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Matrix being traversed.
	     * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
	     */
	    SparseMatrix.prototype.forEach = function (callback, skipZeros) {
	      // check it is a pattern matrix
	      if (!this._values) throw new Error('Cannot invoke forEach on a Pattern only matrix');
	      // matrix instance
	      var me = this;
	      // rows and columns
	      var rows = this._size[0];
	      var columns = this._size[1];
	      // loop columns
	      for (var j = 0; j < columns; j++) {
	        // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
	        var k0 = this._ptr[j];
	        var k1 = this._ptr[j + 1];
	        // column pointer
	        var p = 0;
	        // loop k within [k0, k1[
	        for (var k = k0; k < k1; k++) {
	          // row index
	          var i = this._index[k];
	          // check we need to process zeros
	          if (!skipZeros) {
	            // zero values
	            for (var x = p; x < i; x++) {
	              callback(0, [x, j], me);
	            }
	          }
	          // value @ k
	          callback(this._values[k], [i, j], me);
	          // update pointer
	          p = i + 1;
	        }
	        // check we need to process zeros
	        if (!skipZeros) {
	          // zero values
	          for (var y = p; y < rows; y++) {
	            callback(0, [y, j], me);
	          }
	        }
	      }
	    };

	    /**
	     * Create an Array with a copy of the data of the SparseMatrix
	     * @memberof SparseMatrix
	     * @returns {Array} array
	     */
	    SparseMatrix.prototype.toArray = function () {
	      return _toArray(this._values, this._index, this._ptr, this._size, true);
	    };

	    /**
	     * Get the primitive value of the SparseMatrix: a two dimensions array
	     * @memberof SparseMatrix
	     * @returns {Array} array
	     */
	    SparseMatrix.prototype.valueOf = function () {
	      return _toArray(this._values, this._index, this._ptr, this._size, false);
	    };

	    var _toArray = function _toArray(values, index, ptr, size, copy) {
	      // rows and columns
	      var rows = size[0];
	      var columns = size[1];
	      // result
	      var a = [];
	      // vars
	      var i, j;
	      // initialize array
	      for (i = 0; i < rows; i++) {
	        a[i] = [];
	        for (j = 0; j < columns; j++) {
	          a[i][j] = 0;
	        }
	      }

	      // loop columns
	      for (j = 0; j < columns; j++) {
	        // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
	        var k0 = ptr[j];
	        var k1 = ptr[j + 1];
	        // loop k within [k0, k1[
	        for (var k = k0; k < k1; k++) {
	          // row index
	          i = index[k];
	          // set value (use one for pattern matrix)
	          a[i][j] = values ? copy ? object.clone(values[k]) : values[k] : 1;
	        }
	      }
	      return a;
	    };

	    /**
	     * Get a string representation of the matrix, with optional formatting options.
	     * @memberof SparseMatrix
	     * @param {Object | number | Function} [options]  Formatting options. See
	     *                                                lib/utils/number:format for a
	     *                                                description of the available
	     *                                                options.
	     * @returns {string} str
	     */
	    SparseMatrix.prototype.format = function (options) {
	      // rows and columns
	      var rows = this._size[0];
	      var columns = this._size[1];
	      // density
	      var density = this.density();
	      // rows & columns
	      var str = 'Sparse Matrix [' + string.format(rows, options) + ' x ' + string.format(columns, options) + '] density: ' + string.format(density, options) + '\n';
	      // loop columns
	      for (var j = 0; j < columns; j++) {
	        // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
	        var k0 = this._ptr[j];
	        var k1 = this._ptr[j + 1];
	        // loop k within [k0, k1[
	        for (var k = k0; k < k1; k++) {
	          // row index
	          var i = this._index[k];
	          // append value
	          str += '\n    (' + string.format(i, options) + ', ' + string.format(j, options) + ') ==> ' + (this._values ? string.format(this._values[k], options) : 'X');
	        }
	      }
	      return str;
	    };

	    /**
	     * Get a string representation of the matrix
	     * @memberof SparseMatrix
	     * @returns {string} str
	     */
	    SparseMatrix.prototype.toString = function () {
	      return string.format(this.toArray());
	    };

	    /**
	     * Get a JSON representation of the matrix
	     * @memberof SparseMatrix
	     * @returns {Object}
	     */
	    SparseMatrix.prototype.toJSON = function () {
	      return {
	        mathjs: 'SparseMatrix',
	        values: this._values,
	        index: this._index,
	        ptr: this._ptr,
	        size: this._size,
	        datatype: this._datatype
	      };
	    };

	    /**
	     * Get the kth Matrix diagonal.
	     *
	     * @memberof SparseMatrix
	     * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
	     *
	     * @returns {Matrix}                     The matrix vector with the diagonal values.
	     */
	    SparseMatrix.prototype.diagonal = function (k) {
	      // validate k if any
	      if (k) {
	        // convert BigNumber to a number
	        if (k.isBigNumber === true) k = k.toNumber();
	        // is must be an integer
	        if (!isNumber(k) || !isInteger(k)) {
	          throw new TypeError('The parameter k must be an integer number');
	        }
	      } else {
	        // default value
	        k = 0;
	      }

	      var kSuper = k > 0 ? k : 0;
	      var kSub = k < 0 ? -k : 0;

	      // rows & columns
	      var rows = this._size[0];
	      var columns = this._size[1];

	      // number diagonal values
	      var n = Math.min(rows - kSub, columns - kSuper);

	      // diagonal arrays
	      var values = [];
	      var index = [];
	      var ptr = [];
	      // initial ptr value
	      ptr[0] = 0;
	      // loop columns
	      for (var j = kSuper; j < columns && values.length < n; j++) {
	        // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
	        var k0 = this._ptr[j];
	        var k1 = this._ptr[j + 1];
	        // loop x within [k0, k1[
	        for (var x = k0; x < k1; x++) {
	          // row index
	          var i = this._index[x];
	          // check row
	          if (i === j - kSuper + kSub) {
	            // value on this column
	            values.push(this._values[x]);
	            // store row
	            index[values.length - 1] = i - kSub;
	            // exit loop
	            break;
	          }
	        }
	      }
	      // close ptr
	      ptr.push(values.length);
	      // return matrix
	      return new SparseMatrix({
	        values: values,
	        index: index,
	        ptr: ptr,
	        size: [n, 1]
	      });
	    };

	    /**
	     * Generate a matrix from a JSON object
	     * @memberof SparseMatrix
	     * @param {Object} json  An object structured like
	     *                       `{"mathjs": "SparseMatrix", "values": [], "index": [], "ptr": [], "size": []}`,
	     *                       where mathjs is optional
	     * @returns {SparseMatrix}
	     */
	    SparseMatrix.fromJSON = function (json) {
	      return new SparseMatrix(json);
	    };

	    /**
	     * Create a diagonal matrix.
	     *
	     * @memberof SparseMatrix
	     * @param {Array} size                       The matrix size.
	     * @param {number | Array | Matrix } value   The values for the diagonal.
	     * @param {number | BigNumber} [k=0]         The kth diagonal where the vector will be filled in.
	     * @param {string} [datatype]                The Matrix datatype, values must be of this datatype.
	     *
	     * @returns {SparseMatrix}
	     */
	    SparseMatrix.diagonal = function (size, value, k, defaultValue, datatype) {
	      if (!isArray(size)) throw new TypeError('Array expected, size parameter');
	      if (size.length !== 2) throw new Error('Only two dimensions matrix are supported');

	      // map size & validate
	      size = size.map(function (s) {
	        // check it is a big number
	        if (s && s.isBigNumber === true) {
	          // convert it
	          s = s.toNumber();
	        }
	        // validate arguments
	        if (!isNumber(s) || !isInteger(s) || s < 1) {
	          throw new Error('Size values must be positive integers');
	        }
	        return s;
	      });

	      // validate k if any
	      if (k) {
	        // convert BigNumber to a number
	        if (k.isBigNumber === true) k = k.toNumber();
	        // is must be an integer
	        if (!isNumber(k) || !isInteger(k)) {
	          throw new TypeError('The parameter k must be an integer number');
	        }
	      } else {
	        // default value
	        k = 0;
	      }

	      // equal signature to use
	      var eq = equalScalar;
	      // zero value
	      var zero = 0;

	      if (isString(datatype)) {
	        // find signature that matches (datatype, datatype)
	        eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar;
	        // convert 0 to the same datatype
	        zero = typed.convert(0, datatype);
	      }

	      var kSuper = k > 0 ? k : 0;
	      var kSub = k < 0 ? -k : 0;

	      // rows and columns
	      var rows = size[0];
	      var columns = size[1];

	      // number of non-zero items
	      var n = Math.min(rows - kSub, columns - kSuper);

	      // value extraction function
	      var _value;

	      // check value
	      if (isArray(value)) {
	        // validate array
	        if (value.length !== n) {
	          // number of values in array must be n
	          throw new Error('Invalid value array length');
	        }
	        // define function
	        _value = function _value(i) {
	          // return value @ i
	          return value[i];
	        };
	      } else if (value && value.isMatrix === true) {
	        // matrix size
	        var ms = value.size();
	        // validate matrix
	        if (ms.length !== 1 || ms[0] !== n) {
	          // number of values in array must be n
	          throw new Error('Invalid matrix length');
	        }
	        // define function
	        _value = function _value(i) {
	          // return value @ i
	          return value.get([i]);
	        };
	      } else {
	        // define function
	        _value = function _value() {
	          // return value
	          return value;
	        };
	      }

	      // create arrays
	      var values = [];
	      var index = [];
	      var ptr = [];

	      // loop items
	      for (var j = 0; j < columns; j++) {
	        // number of rows with value
	        ptr.push(values.length);
	        // diagonal index
	        var i = j - kSuper;
	        // check we need to set diagonal value
	        if (i >= 0 && i < n) {
	          // get value @ i
	          var v = _value(i);
	          // check for zero
	          if (!eq(v, zero)) {
	            // column
	            index.push(i + kSub);
	            // add value
	            values.push(v);
	          }
	        }
	      }
	      // last value should be number of values
	      ptr.push(values.length);
	      // create SparseMatrix
	      return new SparseMatrix({
	        values: values,
	        index: index,
	        ptr: ptr,
	        size: [rows, columns]
	      });
	    };

	    /**
	     * Swap rows i and j in Matrix.
	     *
	     * @memberof SparseMatrix
	     * @param {number} i       Matrix row index 1
	     * @param {number} j       Matrix row index 2
	     *
	     * @return {Matrix}        The matrix reference
	     */
	    SparseMatrix.prototype.swapRows = function (i, j) {
	      // check index
	      if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
	        throw new Error('Row index must be positive integers');
	      }
	      // check dimensions
	      if (this._size.length !== 2) {
	        throw new Error('Only two dimensional matrix is supported');
	      }
	      // validate index
	      validateIndex(i, this._size[0]);
	      validateIndex(j, this._size[0]);

	      // swap rows
	      SparseMatrix._swapRows(i, j, this._size[1], this._values, this._index, this._ptr);
	      // return current instance
	      return this;
	    };

	    /**
	     * Loop rows with data in column j.
	     *
	     * @param {number} j            Column
	     * @param {Array} values        Matrix values
	     * @param {Array} index         Matrix row indeces
	     * @param {Array} ptr           Matrix column pointers
	     * @param {Function} callback   Callback function invoked for every row in column j
	     */
	    SparseMatrix._forEachRow = function (j, values, index, ptr, callback) {
	      // indeces for column j
	      var k0 = ptr[j];
	      var k1 = ptr[j + 1];
	      // loop
	      for (var k = k0; k < k1; k++) {
	        // invoke callback
	        callback(index[k], values[k]);
	      }
	    };

	    /**
	     * Swap rows x and y in Sparse Matrix data structures.
	     *
	     * @param {number} x         Matrix row index 1
	     * @param {number} y         Matrix row index 2
	     * @param {number} columns   Number of columns in matrix
	     * @param {Array} values     Matrix values
	     * @param {Array} index      Matrix row indeces
	     * @param {Array} ptr        Matrix column pointers
	     */
	    SparseMatrix._swapRows = function (x, y, columns, values, index, ptr) {
	      // loop columns
	      for (var j = 0; j < columns; j++) {
	        // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
	        var k0 = ptr[j];
	        var k1 = ptr[j + 1];
	        // find value index @ x
	        var kx = _getValueIndex(x, k0, k1, index);
	        // find value index @ x
	        var ky = _getValueIndex(y, k0, k1, index);
	        // check both rows exist in matrix
	        if (kx < k1 && ky < k1 && index[kx] === x && index[ky] === y) {
	          // swap values (check for pattern matrix)
	          if (values) {
	            var v = values[kx];
	            values[kx] = values[ky];
	            values[ky] = v;
	          }
	          // next column
	          continue;
	        }
	        // check x row exist & no y row
	        if (kx < k1 && index[kx] === x && (ky >= k1 || index[ky] !== y)) {
	          // value @ x (check for pattern matrix)
	          var vx = values ? values[kx] : undefined;
	          // insert value @ y
	          index.splice(ky, 0, y);
	          if (values) values.splice(ky, 0, vx);
	          // remove value @ x (adjust array index if needed)
	          index.splice(ky <= kx ? kx + 1 : kx, 1);
	          if (values) values.splice(ky <= kx ? kx + 1 : kx, 1);
	          // next column
	          continue;
	        }
	        // check y row exist & no x row
	        if (ky < k1 && index[ky] === y && (kx >= k1 || index[kx] !== x)) {
	          // value @ y (check for pattern matrix)
	          var vy = values ? values[ky] : undefined;
	          // insert value @ x
	          index.splice(kx, 0, x);
	          if (values) values.splice(kx, 0, vy);
	          // remove value @ y (adjust array index if needed)
	          index.splice(kx <= ky ? ky + 1 : ky, 1);
	          if (values) values.splice(kx <= ky ? ky + 1 : ky, 1);
	        }
	      }
	    };

	    // register this type in the base class Matrix
	    type.Matrix._storage.sparse = SparseMatrix;

	    return SparseMatrix;
	  }

	  exports.name = 'SparseMatrix';
	  exports.path = 'type';
	  exports.factory = factory;
	  exports.lazy = false; // no lazy loading, as we alter type.Matrix._storage
	});

	var SparseMatrix$1 = interopDefault(SparseMatrix);
	var lazy$3 = SparseMatrix.lazy;
	var factory$4 = SparseMatrix.factory;
	var path$3 = SparseMatrix.path;
	var name$4 = SparseMatrix.name;

var require$$8 = Object.freeze({
	  default: SparseMatrix$1,
	  lazy: lazy$3,
	  factory: factory$4,
	  path: path$3,
	  name: name$4
	});

	var matrix = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load, typed) {
	    /**
	     * Create a Matrix. The function creates a new `math.type.Matrix` object from
	     * an `Array`. A Matrix has utility functions to manipulate the data in the
	     * matrix, like getting the size and getting or setting values in the matrix.
	     * Supported storage formats are 'dense' and 'sparse'.
	     *
	     * Syntax:
	     *
	     *    math.matrix()                         // creates an empty matrix using default storage format (dense).
	     *    math.matrix(data)                     // creates a matrix with initial data using default storage format (dense).
	     *    math.matrix('dense')                  // creates an empty matrix using the given storage format.
	     *    math.matrix(data, 'dense')            // creates a matrix with initial data using the given storage format.
	     *    math.matrix(data, 'sparse')           // creates a sparse matrix with initial data.
	     *    math.matrix(data, 'sparse', 'number') // creates a sparse matrix with initial data, number data type.
	     *
	     * Examples:
	     *
	     *    var m = math.matrix([[1, 2], [3, 4]]);
	     *    m.size();                        // Array [2, 2]
	     *    m.resize([3, 2], 5);
	     *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
	     *    m.get([1, 0])                    // number 3
	     *
	     * See also:
	     *
	     *    bignumber, boolean, complex, index, number, string, unit, sparse
	     *
	     * @param {Array | Matrix} [data]    A multi dimensional array
	     * @param {string} [format]          The Matrix storage format
	     *
	     * @return {Matrix} The created matrix
	     */
	    var matrix = typed('matrix', {
	      '': function _() {
	        return _create([]);
	      },

	      'string': function string(format) {
	        return _create([], format);
	      },

	      'string, string': function stringString(format, datatype) {
	        return _create([], format, datatype);
	      },

	      'Array': function Array(data) {
	        return _create(data);
	      },

	      'Matrix': function Matrix(data) {
	        return _create(data, data.storage());
	      },

	      'Array | Matrix, string': _create,

	      'Array | Matrix, string, string': _create
	    });

	    matrix.toTex = {
	      0: '\\begin{bmatrix}\\end{bmatrix}',
	      1: '\\left(${args[0]}\\right)',
	      2: '\\left(${args[0]}\\right)'
	    };

	    return matrix;

	    /**
	     * Create a new Matrix with given storage format
	     * @param {Array} data
	     * @param {string} [format]
	     * @param {string} [datatype]
	     * @returns {Matrix} Returns a new Matrix
	     * @private
	     */
	    function _create(data, format, datatype) {
	      // get storage format constructor
	      var M = type.Matrix.storage(format || 'default');

	      // create instance
	      return new M(data, datatype);
	    }
	  }

	  exports.name = 'matrix';
	  exports.factory = factory;
	});

	var matrix$1 = interopDefault(matrix);
	var factory$8 = matrix.factory;
	var name$7 = matrix.name;

var require$$6$1 = Object.freeze({
	  default: matrix$1,
	  factory: factory$8,
	  name: name$7
	});

	var addScalar = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load, typed) {

	    /**
	     * Add two scalar values, `x + y`.
	     * This function is meant for internal use: it is used by the public function
	     * `add`
	     *
	     * This function does not support collections (Array or Matrix), and does
	     * not validate the number of of inputs.
	     *
	     * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
	     * @param  {number | BigNumber | Fraction | Complex} y          Second value to add
	     * @return {number | BigNumber | Fraction | Complex | Unit}                      Sum of `x` and `y`
	     * @private
	     */
	    var add = typed('add', {

	      'number, number': function numberNumber(x, y) {
	        return x + y;
	      },

	      'Complex, Complex': function ComplexComplex(x, y) {
	        return x.add(y);
	      },

	      'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
	        return x.plus(y);
	      },

	      'Fraction, Fraction': function FractionFraction(x, y) {
	        return x.add(y);
	      },

	      'Unit, Unit': function UnitUnit(x, y) {
	        if (x.value == null) throw new Error('Parameter x contains a unit with undefined value');
	        if (y.value == null) throw new Error('Parameter y contains a unit with undefined value');
	        if (!x.equalBase(y)) throw new Error('Units do not match');

	        var res = x.clone();
	        res.value = add(res.value, y.value);
	        res.fixPrefix = false;
	        return res;
	      }
	    });

	    return add;
	  }

	  exports.factory = factory;
	});

	var addScalar$1 = interopDefault(addScalar);
	var factory$9 = addScalar.factory;

var require$$6$2 = Object.freeze({
	  default: addScalar$1,
	  factory: factory$9
	});

	var latex = createCommonjsModule(function (module, exports) {
	  'use strict';

	  exports.symbols = {
	    // GREEK LETTERS
	    Alpha: 'A', alpha: '\\alpha',
	    Beta: 'B', beta: '\\beta',
	    Gamma: '\\Gamma', gamma: '\\gamma',
	    Delta: '\\Delta', delta: '\\delta',
	    Epsilon: 'E', epsilon: '\\epsilon', varepsilon: '\\varepsilon',
	    Zeta: 'Z', zeta: '\\zeta',
	    Eta: 'H', eta: '\\eta',
	    Theta: '\\Theta', theta: '\\theta', vartheta: '\\vartheta',
	    Iota: 'I', iota: '\\iota',
	    Kappa: 'K', kappa: '\\kappa', varkappa: '\\varkappa',
	    Lambda: '\\Lambda', lambda: '\\lambda',
	    Mu: 'M', mu: '\\mu',
	    Nu: 'N', nu: '\\nu',
	    Xi: '\\Xi', xi: '\\xi',
	    Omicron: 'O', omicron: 'o',
	    Pi: '\\Pi', pi: '\\pi', varpi: '\\varpi',
	    Rho: 'P', rho: '\\rho', varrho: '\\varrho',
	    Sigma: '\\Sigma', sigma: '\\sigma', varsigma: '\\varsigma',
	    Tau: 'T', tau: '\\tau',
	    Upsilon: '\\Upsilon', upsilon: '\\upsilon',
	    Phi: '\\Phi', phi: '\\phi', varphi: '\\varphi',
	    Chi: 'X', chi: '\\chi',
	    Psi: '\\Psi', psi: '\\psi',
	    Omega: '\\Omega', omega: '\\omega',
	    //logic
	    'true': '\\mathrm{True}',
	    'false': '\\mathrm{False}',
	    //other
	    i: 'i', //TODO use \i ??
	    inf: '\\infty',
	    Inf: '\\infty',
	    infinity: '\\infty',
	    Infinity: '\\infty',
	    oo: '\\infty',
	    lim: '\\lim',
	    'undefined': '\\mathbf{?}'
	  };

	  exports.operators = {
	    'transpose': '^\\top',
	    'factorial': '!',
	    'pow': '^',
	    'dotPow': '.^\\wedge', //TODO find ideal solution
	    'unaryPlus': '+',
	    'unaryMinus': '-',
	    'bitNot': '~', //TODO find ideal solution
	    'not': '\\neg',
	    'multiply': '\\cdot',
	    'divide': '\\frac', //TODO how to handle that properly?
	    'dotMultiply': '.\\cdot', //TODO find ideal solution
	    'dotDivide': '.:', //TODO find ideal solution
	    'mod': '\\mod',
	    'add': '+',
	    'subtract': '-',
	    'to': '\\rightarrow',
	    'leftShift': '<<',
	    'rightArithShift': '>>',
	    'rightLogShift': '>>>',
	    'equal': '=',
	    'unequal': '\\neq',
	    'smaller': '<',
	    'larger': '>',
	    'smallerEq': '\\leq',
	    'largerEq': '\\geq',
	    'bitAnd': '\\&',
	    'bitXor': '\\underline{|}',
	    'bitOr': '|',
	    'and': '\\wedge',
	    'xor': '\\veebar',
	    'or': '\\vee'
	  };

	  exports.defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)';

	  var units = {
	    deg: '^\\circ'
	  };

	  //@param {string} name
	  //@param {boolean} isUnit
	  exports.toSymbol = function (name, isUnit) {
	    isUnit = typeof isUnit === 'undefined' ? false : isUnit;
	    if (isUnit) {
	      if (units.hasOwnProperty(name)) {
	        return units[name];
	      }
	      return '\\mathrm{' + name + '}';
	    }

	    if (exports.symbols.hasOwnProperty(name)) {
	      return exports.symbols[name];
	    } else if (name.indexOf('_') !== -1) {
	      //symbol with index (eg. alpha_1)
	      var index = name.indexOf('_');
	      return exports.toSymbol(name.substring(0, index)) + '_{' + exports.toSymbol(name.substring(index + 1)) + '}';
	    }
	    return name;
	  };
	});

	var latex$1 = interopDefault(latex);
	var toSymbol = latex.toSymbol;
	var defaultTemplate = latex.defaultTemplate;
	var operators = latex.operators;
	var symbols$2 = latex.symbols;

var require$$0$12 = Object.freeze({
	  default: latex$1,
	  toSymbol: toSymbol,
	  defaultTemplate: defaultTemplate,
	  operators: operators,
	  symbols: symbols$2
	});

	var algorithm01 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var DimensionError = interopDefault(require$$0$9);

	  function factory(type, config, load, typed) {

	    var DenseMatrix = type.DenseMatrix;

	    /**
	     * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij). 
	     * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
	     *
	     *
	     *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
	     * C(i,j) = ┤
	     *          └  Dij          ; otherwise
	     *
	     *
	     * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
	     * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
	     * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
	     * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
	     *
	     * @return {Matrix}                    DenseMatrix (C)
	     *
	     * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
	     */
	    var algorithm01 = function algorithm01(denseMatrix, sparseMatrix, callback, inverse) {
	      // dense matrix arrays
	      var adata = denseMatrix._data;
	      var asize = denseMatrix._size;
	      var adt = denseMatrix._datatype;
	      // sparse matrix arrays
	      var bvalues = sparseMatrix._values;
	      var bindex = sparseMatrix._index;
	      var bptr = sparseMatrix._ptr;
	      var bsize = sparseMatrix._size;
	      var bdt = sparseMatrix._datatype;

	      // validate dimensions
	      if (asize.length !== bsize.length) throw new DimensionError(asize.length, bsize.length);

	      // check rows & columns
	      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

	      // sparse matrix cannot be a Pattern matrix
	      if (!bvalues) throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

	      // rows & columns
	      var rows = asize[0];
	      var columns = asize[1];

	      // process data types
	      var dt = typeof adt === 'string' && adt === bdt ? adt : undefined;
	      // callback function
	      var cf = dt ? typed.find(callback, [dt, dt]) : callback;

	      // vars
	      var i, j;

	      // result (DenseMatrix)
	      var cdata = [];
	      // initialize c
	      for (i = 0; i < rows; i++) {
	        cdata[i] = [];
	      } // workspace
	      var x = [];
	      // marks indicating we have a value in x for a given column
	      var w = [];

	      // loop columns in b
	      for (j = 0; j < columns; j++) {
	        // column mark
	        var mark = j + 1;
	        // values in column j
	        for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
	          // row
	          i = bindex[k];
	          // update workspace
	          x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
	          // mark i as updated
	          w[i] = mark;
	        }
	        // loop rows
	        for (i = 0; i < rows; i++) {
	          // check row is in workspace
	          if (w[i] === mark) {
	            // c[i][j] was already calculated
	            cdata[i][j] = x[i];
	          } else {
	            // item does not exist in S
	            cdata[i][j] = adata[i][j];
	          }
	        }
	      }

	      // return dense matrix
	      return new DenseMatrix({
	        data: cdata,
	        size: [rows, columns],
	        datatype: dt
	      });
	    };

	    return algorithm01;
	  }

	  exports.name = 'algorithm01';
	  exports.factory = factory;
	});

	var algorithm01$1 = interopDefault(algorithm01);
	var factory$10 = algorithm01.factory;
	var name$8 = algorithm01.name;

var require$$4$1 = Object.freeze({
	  default: algorithm01$1,
	  factory: factory$10,
	  name: name$8
	});

	var algorithm04 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var DimensionError = interopDefault(require$$0$9);

	  function factory(type, config, load, typed) {

	    var equalScalar = load(interopDefault(require$$0$11));

	    var SparseMatrix = type.SparseMatrix;

	    /**
	     * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
	     * Callback function invoked MAX(NNZA, NNZB) times
	     *
	     *
	     *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
	     * C(i,j) = ┤  A(i,j)       ; A(i,j) !== 0
	     *          └  B(i,j)       ; B(i,j) !== 0
	     *
	     *
	     * @param {Matrix}   a                 The SparseMatrix instance (A)
	     * @param {Matrix}   b                 The SparseMatrix instance (B)
	     * @param {Function} callback          The f(Aij,Bij) operation to invoke
	     *
	     * @return {Matrix}                    SparseMatrix (C)
	     *
	     * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
	     */
	    var algorithm04 = function algorithm04(a, b, callback) {
	      // sparse matrix arrays
	      var avalues = a._values;
	      var aindex = a._index;
	      var aptr = a._ptr;
	      var asize = a._size;
	      var adt = a._datatype;
	      // sparse matrix arrays
	      var bvalues = b._values;
	      var bindex = b._index;
	      var bptr = b._ptr;
	      var bsize = b._size;
	      var bdt = b._datatype;

	      // validate dimensions
	      if (asize.length !== bsize.length) throw new DimensionError(asize.length, bsize.length);

	      // check rows & columns
	      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

	      // rows & columns
	      var rows = asize[0];
	      var columns = asize[1];

	      // datatype
	      var dt;
	      // equal signature to use
	      var eq = equalScalar;
	      // zero value
	      var zero = 0;
	      // callback signature to use
	      var cf = callback;

	      // process data types
	      if (typeof adt === 'string' && adt === bdt) {
	        // datatype
	        dt = adt;
	        // find signature that matches (dt, dt)
	        eq = typed.find(equalScalar, [dt, dt]);
	        // convert 0 to the same datatype
	        zero = typed.convert(0, dt);
	        // callback
	        cf = typed.find(callback, [dt, dt]);
	      }

	      // result arrays
	      var cvalues = avalues && bvalues ? [] : undefined;
	      var cindex = [];
	      var cptr = [];
	      // matrix
	      var c = new SparseMatrix({
	        values: cvalues,
	        index: cindex,
	        ptr: cptr,
	        size: [rows, columns],
	        datatype: dt
	      });

	      // workspace
	      var xa = avalues && bvalues ? [] : undefined;
	      var xb = avalues && bvalues ? [] : undefined;
	      // marks indicating we have a value in x for a given column
	      var wa = [];
	      var wb = [];

	      // vars 
	      var i, j, k, k0, k1;

	      // loop columns
	      for (j = 0; j < columns; j++) {
	        // update cptr
	        cptr[j] = cindex.length;
	        // columns mark
	        var mark = j + 1;
	        // loop A(:,j)
	        for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
	          // row
	          i = aindex[k];
	          // update c
	          cindex.push(i);
	          // update workspace
	          wa[i] = mark;
	          // check we need to process values
	          if (xa) xa[i] = avalues[k];
	        }
	        // loop B(:,j)
	        for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
	          // row
	          i = bindex[k];
	          // check row exists in A
	          if (wa[i] === mark) {
	            // update record in xa @ i
	            if (xa) {
	              // invoke callback
	              var v = cf(xa[i], bvalues[k]);
	              // check for zero
	              if (!eq(v, zero)) {
	                // update workspace
	                xa[i] = v;
	              } else {
	                // remove mark (index will be removed later)
	                wa[i] = null;
	              }
	            }
	          } else {
	            // update c
	            cindex.push(i);
	            // update workspace
	            wb[i] = mark;
	            // check we need to process values
	            if (xb) xb[i] = bvalues[k];
	          }
	        }
	        // check we need to process values (non pattern matrix)
	        if (xa && xb) {
	          // initialize first index in j
	          k = cptr[j];
	          // loop index in j
	          while (k < cindex.length) {
	            // row
	            i = cindex[k];
	            // check workspace has value @ i
	            if (wa[i] === mark) {
	              // push value (Aij != 0 || (Aij != 0 && Bij != 0))
	              cvalues[k] = xa[i];
	              // increment pointer
	              k++;
	            } else if (wb[i] === mark) {
	              // push value (bij != 0)
	              cvalues[k] = xb[i];
	              // increment pointer
	              k++;
	            } else {
	              // remove index @ k
	              cindex.splice(k, 1);
	            }
	          }
	        }
	      }
	      // update cptr
	      cptr[columns] = cindex.length;

	      // return sparse matrix
	      return c;
	    };

	    return algorithm04;
	  }

	  exports.name = 'algorithm04';
	  exports.factory = factory;
	});

	var algorithm04$1 = interopDefault(algorithm04);
	var factory$11 = algorithm04.factory;
	var name$9 = algorithm04.name;

var require$$3$1 = Object.freeze({
	  default: algorithm04$1,
	  factory: factory$11,
	  name: name$9
	});

	var algorithm10 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load, typed) {

	    var DenseMatrix = type.DenseMatrix;

	    /**
	     * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
	     * Callback function invoked NZ times (number of nonzero items in S).
	     *
	     *
	     *          ┌  f(Sij, b)  ; S(i,j) !== 0
	     * C(i,j) = ┤  
	     *          └  b          ; otherwise
	     *
	     *
	     * @param {Matrix}   s                 The SparseMatrix instance (S)
	     * @param {Scalar}   b                 The Scalar value
	     * @param {Function} callback          The f(Aij,b) operation to invoke
	     * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
	     *
	     * @return {Matrix}                    DenseMatrix (C)
	     *
	     * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
	     */
	    var algorithm10 = function algorithm10(s, b, callback, inverse) {
	      // sparse matrix arrays
	      var avalues = s._values;
	      var aindex = s._index;
	      var aptr = s._ptr;
	      var asize = s._size;
	      var adt = s._datatype;

	      // sparse matrix cannot be a Pattern matrix
	      if (!avalues) throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

	      // rows & columns
	      var rows = asize[0];
	      var columns = asize[1];

	      // datatype
	      var dt;
	      // callback signature to use
	      var cf = callback;

	      // process data types
	      if (typeof adt === 'string') {
	        // datatype
	        dt = adt;
	        // convert b to the same datatype
	        b = typed.convert(b, dt);
	        // callback
	        cf = typed.find(callback, [dt, dt]);
	      }

	      // result arrays
	      var cdata = [];
	      // matrix
	      var c = new DenseMatrix({
	        data: cdata,
	        size: [rows, columns],
	        datatype: dt
	      });

	      // workspaces
	      var x = [];
	      // marks indicating we have a value in x for a given column
	      var w = [];

	      // loop columns
	      for (var j = 0; j < columns; j++) {
	        // columns mark
	        var mark = j + 1;
	        // values in j
	        for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
	          // row
	          var r = aindex[k];
	          // update workspace
	          x[r] = avalues[k];
	          w[r] = mark;
	        }
	        // loop rows
	        for (var i = 0; i < rows; i++) {
	          // initialize C on first column
	          if (j === 0) {
	            // create row array
	            cdata[i] = [];
	          }
	          // check sparse matrix has a value @ i,j
	          if (w[i] === mark) {
	            // invoke callback, update C
	            cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
	          } else {
	            // dense matrix value @ i, j
	            cdata[i][j] = b;
	          }
	        }
	      }

	      // return sparse matrix
	      return c;
	    };

	    return algorithm10;
	  }

	  exports.name = 'algorithm10';
	  exports.factory = factory;
	});

	var algorithm10$1 = interopDefault(algorithm10);
	var factory$12 = algorithm10.factory;
	var name$10 = algorithm10.name;

var require$$2$2 = Object.freeze({
	  default: algorithm10$1,
	  factory: factory$12,
	  name: name$10
	});

	var algorithm13 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var util = interopDefault(require$$2);
	  var DimensionError = interopDefault(require$$0$9);

	  var string = util.string,
	      isString = string.isString;

	  function factory(type, config, load, typed) {

	    var DenseMatrix = type.DenseMatrix;

	    /**
	     * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z). 
	     * Callback function invoked MxN times.
	     *
	     * C(i,j,...z) = f(Aij..z, Bij..z)
	     *
	     * @param {Matrix}   a                 The DenseMatrix instance (A)
	     * @param {Matrix}   b                 The DenseMatrix instance (B)
	     * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
	     *
	     * @return {Matrix}                    DenseMatrix (C)
	     *
	     * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
	     */
	    var algorithm13 = function algorithm13(a, b, callback) {
	      // a arrays
	      var adata = a._data;
	      var asize = a._size;
	      var adt = a._datatype;
	      // b arrays
	      var bdata = b._data;
	      var bsize = b._size;
	      var bdt = b._datatype;
	      // c arrays
	      var csize = [];

	      // validate dimensions
	      if (asize.length !== bsize.length) throw new DimensionError(asize.length, bsize.length);

	      // validate each one of the dimension sizes
	      for (var s = 0; s < asize.length; s++) {
	        // must match
	        if (asize[s] !== bsize[s]) throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
	        // update dimension in c
	        csize[s] = asize[s];
	      }

	      // datatype
	      var dt;
	      // callback signature to use
	      var cf = callback;

	      // process data types
	      if (typeof adt === 'string' && adt === bdt) {
	        // datatype
	        dt = adt;
	        // convert b to the same datatype
	        b = typed.convert(b, dt);
	        // callback
	        cf = typed.find(callback, [dt, dt]);
	      }

	      // populate cdata, iterate through dimensions
	      var cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : [];

	      // c matrix
	      return new DenseMatrix({
	        data: cdata,
	        size: csize,
	        datatype: dt
	      });
	    };

	    // recursive function
	    var _iterate = function _iterate(f, level, s, n, av, bv) {
	      // initialize array for this level
	      var cv = [];
	      // check we reach the last level
	      if (level === s.length - 1) {
	        // loop arrays in last level
	        for (var i = 0; i < n; i++) {
	          // invoke callback and store value
	          cv[i] = f(av[i], bv[i]);
	        }
	      } else {
	        // iterate current level
	        for (var j = 0; j < n; j++) {
	          // iterate next level
	          cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
	        }
	      }
	      return cv;
	    };

	    return algorithm13;
	  }

	  exports.name = 'algorithm13';
	  exports.factory = factory;
	});

	var algorithm13$1 = interopDefault(algorithm13);
	var factory$13 = algorithm13.factory;
	var name$11 = algorithm13.name;

var require$$2$3 = Object.freeze({
	  default: algorithm13$1,
	  factory: factory$13,
	  name: name$11
	});

	var algorithm14 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var clone = interopDefault(require$$1).clone;

	  function factory(type, config, load, typed) {

	    var DenseMatrix = type.DenseMatrix;

	    /**
	     * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, b). 
	     * Callback function invoked MxN times.
	     *
	     * C(i,j,...z) = f(Aij..z, b)
	     *
	     * @param {Matrix}   a                 The DenseMatrix instance (A)
	     * @param {Scalar}   b                 The Scalar value
	     * @param {Function} callback          The f(Aij..z,b) operation to invoke
	     * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
	     *
	     * @return {Matrix}                    DenseMatrix (C)
	     *
	     * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
	     */
	    var algorithm14 = function algorithm14(a, b, callback, inverse) {
	      // a arrays
	      var adata = a._data;
	      var asize = a._size;
	      var adt = a._datatype;

	      // datatype
	      var dt;
	      // callback signature to use
	      var cf = callback;

	      // process data types
	      if (typeof adt === 'string') {
	        // datatype
	        dt = adt;
	        // convert b to the same datatype
	        b = typed.convert(b, dt);
	        // callback
	        cf = typed.find(callback, [dt, dt]);
	      }

	      // populate cdata, iterate through dimensions
	      var cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : [];

	      // c matrix
	      return new DenseMatrix({
	        data: cdata,
	        size: clone(asize),
	        datatype: dt
	      });
	    };

	    // recursive function
	    var _iterate = function _iterate(f, level, s, n, av, bv, inverse) {
	      // initialize array for this level
	      var cv = [];
	      // check we reach the last level
	      if (level === s.length - 1) {
	        // loop arrays in last level
	        for (var i = 0; i < n; i++) {
	          // invoke callback and store value
	          cv[i] = inverse ? f(bv, av[i]) : f(av[i], bv);
	        }
	      } else {
	        // iterate current level
	        for (var j = 0; j < n; j++) {
	          // iterate next level
	          cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse);
	        }
	      }
	      return cv;
	    };

	    return algorithm14;
	  }

	  exports.name = 'algorithm14';
	  exports.factory = factory;
	});

	var algorithm14$1 = interopDefault(algorithm14);
	var factory$14 = algorithm14.factory;
	var name$12 = algorithm14.name;

var require$$1$6 = Object.freeze({
	  default: algorithm14$1,
	  factory: factory$14,
	  name: name$12
	});

	var add = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var extend = interopDefault(require$$1).extend;

	  function factory(type, config, load, typed) {

	    var matrix = load(interopDefault(require$$6$1));
	    var addScalar = load(interopDefault(require$$6$2));
	    var latex = interopDefault(require$$0$12);

	    var algorithm01 = load(interopDefault(require$$4$1));
	    var algorithm04 = load(interopDefault(require$$3$1));
	    var algorithm10 = load(interopDefault(require$$2$2));
	    var algorithm13 = load(interopDefault(require$$2$3));
	    var algorithm14 = load(interopDefault(require$$1$6));

	    /**
	     * Add two values, `x + y`.
	     * For matrices, the function is evaluated element wise.
	     *
	     * Syntax:
	     *
	     *    math.add(x, y)
	     *
	     * Examples:
	     *
	     *    math.add(2, 3);               // returns number 5
	     *
	     *    var a = math.complex(2, 3);
	     *    var b = math.complex(-4, 1);
	     *    math.add(a, b);               // returns Complex -2 + 4i
	     *
	     *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
	     *
	     *    var c = math.unit('5 cm');
	     *    var d = math.unit('2.1 mm');
	     *    math.add(c, d);               // returns Unit 52.1 mm
	     *
	     *    math.add("2.3", "4");         // returns number 6.3
	     *
	     * See also:
	     *
	     *    subtract
	     *
	     * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to add
	     * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to add
	     * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
	     */
	    var add = typed('add', extend({
	      // we extend the signatures of addScalar with signatures dealing with matrices

	      'Matrix, Matrix': function MatrixMatrix(x, y) {
	        // result
	        var c;

	        // process matrix storage
	        switch (x.storage()) {
	          case 'sparse':
	            switch (y.storage()) {
	              case 'sparse':
	                // sparse + sparse
	                c = algorithm04(x, y, addScalar);
	                break;
	              default:
	                // sparse + dense
	                c = algorithm01(y, x, addScalar, true);
	                break;
	            }
	            break;
	          default:
	            switch (y.storage()) {
	              case 'sparse':
	                // dense + sparse
	                c = algorithm01(x, y, addScalar, false);
	                break;
	              default:
	                // dense + dense
	                c = algorithm13(x, y, addScalar);
	                break;
	            }
	            break;
	        }
	        return c;
	      },

	      'Array, Array': function ArrayArray(x, y) {
	        // use matrix implementation
	        return add(matrix(x), matrix(y)).valueOf();
	      },

	      'Array, Matrix': function ArrayMatrix(x, y) {
	        // use matrix implementation
	        return add(matrix(x), y);
	      },

	      'Matrix, Array': function MatrixArray(x, y) {
	        // use matrix implementation
	        return add(x, matrix(y));
	      },

	      'Matrix, any': function MatrixAny(x, y) {
	        // result
	        var c;
	        // check storage format
	        switch (x.storage()) {
	          case 'sparse':
	            c = algorithm10(x, y, addScalar, false);
	            break;
	          default:
	            c = algorithm14(x, y, addScalar, false);
	            break;
	        }
	        return c;
	      },

	      'any, Matrix': function anyMatrix(x, y) {
	        // result
	        var c;
	        // check storage format
	        switch (y.storage()) {
	          case 'sparse':
	            c = algorithm10(y, x, addScalar, true);
	            break;
	          default:
	            c = algorithm14(y, x, addScalar, true);
	            break;
	        }
	        return c;
	      },

	      'Array, any': function ArrayAny(x, y) {
	        // use matrix implementation
	        return algorithm14(matrix(x), y, addScalar, false).valueOf();
	      },

	      'any, Array': function anyArray(x, y) {
	        // use matrix implementation
	        return algorithm14(matrix(y), x, addScalar, true).valueOf();
	      }
	    }, addScalar.signatures));

	    add.toTex = {
	      2: '\\left(${args[0]}' + latex.operators['add'] + '${args[1]}\\right)'
	    };

	    return add;
	  }

	  exports.name = 'add';
	  exports.factory = factory;
	});

	var add$1 = interopDefault(add);
	var factory$7 = add.factory;
	var name$6 = add.name;

var require$$1$5 = Object.freeze({
	  default: add$1,
	  factory: factory$7,
	  name: name$6
	});

	var Spa = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load) {

	    var add = load(interopDefault(require$$1$5));
	    var equalScalar = load(interopDefault(require$$0$11));

	    /**
	     * An ordered Sparse Accumulator is a representation for a sparse vector that includes a dense array 
	     * of the vector elements and an ordered list of non-zero elements.
	     */
	    function Spa() {
	      if (!(this instanceof Spa)) throw new SyntaxError('Constructor must be called with the new operator');

	      // allocate vector, TODO use typed arrays
	      this._values = [];
	      this._heap = new type.FibonacciHeap();
	    }

	    /**
	     * Attach type information
	     */
	    Spa.prototype.type = 'Spa';
	    Spa.prototype.isSpa = true;

	    /**
	     * Set the value for index i.
	     *
	     * @param {number} i                       The index
	     * @param {number | BigNumber | Complex}   The value at index i
	     */
	    Spa.prototype.set = function (i, v) {
	      // check we have a value @ i
	      if (!this._values[i]) {
	        // insert in heap
	        var node = this._heap.insert(i, v);
	        // set the value @ i
	        this._values[i] = node;
	      } else {
	        // update the value @ i
	        this._values[i].value = v;
	      }
	    };

	    Spa.prototype.get = function (i) {
	      var node = this._values[i];
	      if (node) return node.value;
	      return 0;
	    };

	    Spa.prototype.accumulate = function (i, v) {
	      // node @ i
	      var node = this._values[i];
	      if (!node) {
	        // insert in heap
	        node = this._heap.insert(i, v);
	        // initialize value
	        this._values[i] = node;
	      } else {
	        // accumulate value
	        node.value = add(node.value, v);
	      }
	    };

	    Spa.prototype.forEach = function (from, to, callback) {
	      // references
	      var heap = this._heap;
	      var values = this._values;
	      // nodes
	      var nodes = [];
	      // node with minimum key, save it
	      var node = heap.extractMinimum();
	      if (node) nodes.push(node);
	      // extract nodes from heap (ordered)
	      while (node && node.key <= to) {
	        // check it is in range
	        if (node.key >= from) {
	          // check value is not zero
	          if (!equalScalar(node.value, 0)) {
	            // invoke callback
	            callback(node.key, node.value, this);
	          }
	        }
	        // extract next node, save it
	        node = heap.extractMinimum();
	        if (node) nodes.push(node);
	      }
	      // reinsert all nodes in heap
	      for (var i = 0; i < nodes.length; i++) {
	        // current node
	        var n = nodes[i];
	        // insert node in heap
	        node = heap.insert(n.key, n.value);
	        // update values
	        values[node.key] = node;
	      }
	    };

	    Spa.prototype.swap = function (i, j) {
	      // node @ i and j
	      var nodei = this._values[i];
	      var nodej = this._values[j];
	      // check we need to insert indeces
	      if (!nodei && nodej) {
	        // insert in heap
	        nodei = this._heap.insert(i, nodej.value);
	        // remove from heap
	        this._heap.remove(nodej);
	        // set values
	        this._values[i] = nodei;
	        this._values[j] = undefined;
	      } else if (nodei && !nodej) {
	        // insert in heap
	        nodej = this._heap.insert(j, nodei.value);
	        // remove from heap
	        this._heap.remove(nodei);
	        // set values
	        this._values[j] = nodej;
	        this._values[i] = undefined;
	      } else if (nodei && nodej) {
	        // swap values
	        var v = nodei.value;
	        nodei.value = nodej.value;
	        nodej.value = v;
	      }
	    };

	    return Spa;
	  }

	  exports.name = 'Spa';
	  exports.path = 'type';
	  exports.factory = factory;
	});

	var Spa$1 = interopDefault(Spa);
	var factory$6 = Spa.factory;
	var path$4 = Spa.path;
	var name$5 = Spa.name;

var require$$7$2 = Object.freeze({
	  default: Spa$1,
	  factory: factory$6,
	  path: path$4,
	  name: name$5
	});

	var algorithm03 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var DimensionError = interopDefault(require$$0$9);

	  function factory(type, config, load, typed) {

	    var DenseMatrix = type.DenseMatrix;

	    /**
	     * Iterates over SparseMatrix items and invokes the callback function f(Dij, Sij).
	     * Callback function invoked M*N times.
	     *
	     *
	     *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
	     * C(i,j) = ┤
	     *          └  f(Dij, 0)    ; otherwise
	     *
	     *
	     * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
	     * @param {Matrix}   sparseMatrix      The SparseMatrix instance (C)
	     * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
	     * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
	     *
	     * @return {Matrix}                    DenseMatrix (C)
	     *
	     * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
	     */
	    var algorithm03 = function algorithm03(denseMatrix, sparseMatrix, callback, inverse) {
	      // dense matrix arrays
	      var adata = denseMatrix._data;
	      var asize = denseMatrix._size;
	      var adt = denseMatrix._datatype;
	      // sparse matrix arrays
	      var bvalues = sparseMatrix._values;
	      var bindex = sparseMatrix._index;
	      var bptr = sparseMatrix._ptr;
	      var bsize = sparseMatrix._size;
	      var bdt = sparseMatrix._datatype;

	      // validate dimensions
	      if (asize.length !== bsize.length) throw new DimensionError(asize.length, bsize.length);

	      // check rows & columns
	      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

	      // sparse matrix cannot be a Pattern matrix
	      if (!bvalues) throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

	      // rows & columns
	      var rows = asize[0];
	      var columns = asize[1];

	      // datatype
	      var dt;
	      // zero value
	      var zero = 0;
	      // callback signature to use
	      var cf = callback;

	      // process data types
	      if (typeof adt === 'string' && adt === bdt) {
	        // datatype
	        dt = adt;
	        // convert 0 to the same datatype
	        zero = typed.convert(0, dt);
	        // callback
	        cf = typed.find(callback, [dt, dt]);
	      }

	      // result (DenseMatrix)
	      var cdata = [];

	      // initialize dense matrix
	      for (var z = 0; z < rows; z++) {
	        // initialize row
	        cdata[z] = [];
	      }

	      // workspace
	      var x = [];
	      // marks indicating we have a value in x for a given column
	      var w = [];

	      // loop columns in b
	      for (var j = 0; j < columns; j++) {
	        // column mark
	        var mark = j + 1;
	        // values in column j
	        for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
	          // row
	          var i = bindex[k];
	          // update workspace
	          x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
	          w[i] = mark;
	        }
	        // process workspace
	        for (var y = 0; y < rows; y++) {
	          // check we have a calculated value for current row
	          if (w[y] === mark) {
	            // use calculated value
	            cdata[y][j] = x[y];
	          } else {
	            // calculate value
	            cdata[y][j] = inverse ? cf(zero, adata[y][j]) : cf(adata[y][j], zero);
	          }
	        }
	      }

	      // return dense matrix
	      return new DenseMatrix({
	        data: cdata,
	        size: [rows, columns],
	        datatype: dt
	      });
	    };

	    return algorithm03;
	  }

	  exports.name = 'algorithm03';
	  exports.factory = factory;
	});

	var algorithm03$1 = interopDefault(algorithm03);
	var factory$17 = algorithm03.factory;
	var name$15 = algorithm03.name;

var require$$5$1 = Object.freeze({
	  default: algorithm03$1,
	  factory: factory$17,
	  name: name$15
	});

	var algorithm07 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var DimensionError = interopDefault(require$$0$9);

	  function factory(type, config, load, typed) {

	    var DenseMatrix = type.DenseMatrix;

	    /**
	     * Iterates over SparseMatrix A and SparseMatrix B items (zero and nonzero) and invokes the callback function f(Aij, Bij). 
	     * Callback function invoked MxN times.
	     *
	     * C(i,j) = f(Aij, Bij)
	     *
	     * @param {Matrix}   a                 The SparseMatrix instance (A)
	     * @param {Matrix}   b                 The SparseMatrix instance (B)
	     * @param {Function} callback          The f(Aij,Bij) operation to invoke
	     *
	     * @return {Matrix}                    DenseMatrix (C)
	     *
	     * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
	     */
	    var algorithm07 = function algorithm07(a, b, callback) {
	      // sparse matrix arrays
	      var asize = a._size;
	      var adt = a._datatype;
	      // sparse matrix arrays
	      var bsize = b._size;
	      var bdt = b._datatype;

	      // validate dimensions
	      if (asize.length !== bsize.length) throw new DimensionError(asize.length, bsize.length);

	      // check rows & columns
	      if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

	      // rows & columns
	      var rows = asize[0];
	      var columns = asize[1];

	      // datatype
	      var dt;
	      // zero value
	      var zero = 0;
	      // callback signature to use
	      var cf = callback;

	      // process data types
	      if (typeof adt === 'string' && adt === bdt) {
	        // datatype
	        dt = adt;
	        // convert 0 to the same datatype
	        zero = typed.convert(0, dt);
	        // callback
	        cf = typed.find(callback, [dt, dt]);
	      }

	      // vars
	      var i, j;

	      // result arrays
	      var cdata = [];
	      // initialize c
	      for (i = 0; i < rows; i++) {
	        cdata[i] = [];
	      } // matrix
	      var c = new DenseMatrix({
	        data: cdata,
	        size: [rows, columns],
	        datatype: dt
	      });

	      // workspaces
	      var xa = [];
	      var xb = [];
	      // marks indicating we have a value in x for a given column
	      var wa = [];
	      var wb = [];

	      // loop columns
	      for (j = 0; j < columns; j++) {
	        // columns mark
	        var mark = j + 1;
	        // scatter the values of A(:,j) into workspace
	        _scatter(a, j, wa, xa, mark);
	        // scatter the values of B(:,j) into workspace
	        _scatter(b, j, wb, xb, mark);
	        // loop rows
	        for (i = 0; i < rows; i++) {
	          // matrix values @ i,j
	          var va = wa[i] === mark ? xa[i] : zero;
	          var vb = wb[i] === mark ? xb[i] : zero;
	          // invoke callback
	          cdata[i][j] = cf(va, vb);
	        }
	      }

	      // return sparse matrix
	      return c;
	    };

	    var _scatter = function _scatter(m, j, w, x, mark) {
	      // a arrays
	      var values = m._values;
	      var index = m._index;
	      var ptr = m._ptr;
	      // loop values in column j
	      for (var k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
	        // row
	        var i = index[k];
	        // update workspace
	        w[i] = mark;
	        x[i] = values[k];
	      }
	    };

	    return algorithm07;
	  }

	  exports.name = 'algorithm07';
	  exports.factory = factory;
	});

	var algorithm07$1 = interopDefault(algorithm07);
	var factory$18 = algorithm07.factory;
	var name$16 = algorithm07.name;

var require$$4$2 = Object.freeze({
	  default: algorithm07$1,
	  factory: factory$18,
	  name: name$16
	});

	var algorithm12 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load, typed) {

	    var DenseMatrix = type.DenseMatrix;

	    /**
	     * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
	     * Callback function invoked MxN times.
	     *
	     *
	     *          ┌  f(Sij, b)  ; S(i,j) !== 0
	     * C(i,j) = ┤  
	     *          └  f(0, b)    ; otherwise
	     *
	     *
	     * @param {Matrix}   s                 The SparseMatrix instance (S)
	     * @param {Scalar}   b                 The Scalar value
	     * @param {Function} callback          The f(Aij,b) operation to invoke
	     * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
	     *
	     * @return {Matrix}                    DenseMatrix (C)
	     *
	     * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
	     */
	    var algorithm12 = function algorithm12(s, b, callback, inverse) {
	      // sparse matrix arrays
	      var avalues = s._values;
	      var aindex = s._index;
	      var aptr = s._ptr;
	      var asize = s._size;
	      var adt = s._datatype;

	      // sparse matrix cannot be a Pattern matrix
	      if (!avalues) throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

	      // rows & columns
	      var rows = asize[0];
	      var columns = asize[1];

	      // datatype
	      var dt;
	      // callback signature to use
	      var cf = callback;

	      // process data types
	      if (typeof adt === 'string') {
	        // datatype
	        dt = adt;
	        // convert b to the same datatype
	        b = typed.convert(b, dt);
	        // callback
	        cf = typed.find(callback, [dt, dt]);
	      }

	      // result arrays
	      var cdata = [];
	      // matrix
	      var c = new DenseMatrix({
	        data: cdata,
	        size: [rows, columns],
	        datatype: dt
	      });

	      // workspaces
	      var x = [];
	      // marks indicating we have a value in x for a given column
	      var w = [];

	      // loop columns
	      for (var j = 0; j < columns; j++) {
	        // columns mark
	        var mark = j + 1;
	        // values in j
	        for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
	          // row
	          var r = aindex[k];
	          // update workspace
	          x[r] = avalues[k];
	          w[r] = mark;
	        }
	        // loop rows
	        for (var i = 0; i < rows; i++) {
	          // initialize C on first column
	          if (j === 0) {
	            // create row array
	            cdata[i] = [];
	          }
	          // check sparse matrix has a value @ i,j
	          if (w[i] === mark) {
	            // invoke callback, update C
	            cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
	          } else {
	            // dense matrix value @ i, j
	            cdata[i][j] = inverse ? cf(b, 0) : cf(0, b);
	          }
	        }
	      }

	      // return sparse matrix
	      return c;
	    };

	    return algorithm12;
	  }

	  exports.name = 'algorithm12';
	  exports.factory = factory;
	});

	var algorithm12$1 = interopDefault(algorithm12);
	var factory$19 = algorithm12.factory;
	var name$17 = algorithm12.name;

var require$$3$2 = Object.freeze({
	  default: algorithm12$1,
	  factory: factory$19,
	  name: name$17
	});

	var smaller = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var nearlyEqual = interopDefault(require$$0$2).nearlyEqual;
	  var bigNearlyEqual = interopDefault(require$$7$1);

	  function factory(type, config, load, typed) {

	    var matrix = load(interopDefault(require$$6$1));

	    var algorithm03 = load(interopDefault(require$$5$1));
	    var algorithm07 = load(interopDefault(require$$4$2));
	    var algorithm12 = load(interopDefault(require$$3$2));
	    var algorithm13 = load(interopDefault(require$$2$3));
	    var algorithm14 = load(interopDefault(require$$1$6));

	    var latex = interopDefault(require$$0$12);

	    /**
	     * Test whether value x is smaller than y.
	     *
	     * The function returns true when x is smaller than y and the relative
	     * difference between x and y is smaller than the configured epsilon. The
	     * function cannot be used to compare values smaller than approximately 2.22e-16.
	     *
	     * For matrices, the function is evaluated element wise.
	     *
	     * Syntax:
	     *
	     *    math.smaller(x, y)
	     *
	     * Examples:
	     *
	     *    math.smaller(2, 3);            // returns true
	     *    math.smaller(5, 2 * 2);        // returns false
	     *
	     *    var a = math.unit('5 cm');
	     *    var b = math.unit('2 inch');
	     *    math.smaller(a, b);            // returns true
	     *
	     * See also:
	     *
	     *    equal, unequal, smallerEq, smaller, smallerEq, compare
	     *
	     * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
	     * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
	     * @return {boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
	     */
	    var smaller = typed('smaller', {

	      'boolean, boolean': function booleanBoolean(x, y) {
	        return x < y;
	      },

	      'number, number': function numberNumber(x, y) {
	        return x < y && !nearlyEqual(x, y, config.epsilon);
	      },

	      'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
	        return x.lt(y) && !bigNearlyEqual(x, y, config.epsilon);
	      },

	      'Fraction, Fraction': function FractionFraction(x, y) {
	        return x.compare(y) === -1;
	      },

	      'Complex, Complex': function ComplexComplex(x, y) {
	        throw new TypeError('No ordering relation is defined for complex numbers');
	      },

	      'Unit, Unit': function UnitUnit(x, y) {
	        if (!x.equalBase(y)) {
	          throw new Error('Cannot compare units with different base');
	        }
	        return smaller(x.value, y.value);
	      },

	      'string, string': function stringString(x, y) {
	        return x < y;
	      },

	      'Matrix, Matrix': function MatrixMatrix(x, y) {
	        // result
	        var c;

	        // process matrix storage
	        switch (x.storage()) {
	          case 'sparse':
	            switch (y.storage()) {
	              case 'sparse':
	                // sparse + sparse
	                c = algorithm07(x, y, smaller);
	                break;
	              default:
	                // sparse + dense
	                c = algorithm03(y, x, smaller, true);
	                break;
	            }
	            break;
	          default:
	            switch (y.storage()) {
	              case 'sparse':
	                // dense + sparse
	                c = algorithm03(x, y, smaller, false);
	                break;
	              default:
	                // dense + dense
	                c = algorithm13(x, y, smaller);
	                break;
	            }
	            break;
	        }
	        return c;
	      },

	      'Array, Array': function ArrayArray(x, y) {
	        // use matrix implementation
	        return smaller(matrix(x), matrix(y)).valueOf();
	      },

	      'Array, Matrix': function ArrayMatrix(x, y) {
	        // use matrix implementation
	        return smaller(matrix(x), y);
	      },

	      'Matrix, Array': function MatrixArray(x, y) {
	        // use matrix implementation
	        return smaller(x, matrix(y));
	      },

	      'Matrix, any': function MatrixAny(x, y) {
	        // result
	        var c;
	        // check storage format
	        switch (x.storage()) {
	          case 'sparse':
	            c = algorithm12(x, y, smaller, false);
	            break;
	          default:
	            c = algorithm14(x, y, smaller, false);
	            break;
	        }
	        return c;
	      },

	      'any, Matrix': function anyMatrix(x, y) {
	        // result
	        var c;
	        // check storage format
	        switch (y.storage()) {
	          case 'sparse':
	            c = algorithm12(y, x, smaller, true);
	            break;
	          default:
	            c = algorithm14(y, x, smaller, true);
	            break;
	        }
	        return c;
	      },

	      'Array, any': function ArrayAny(x, y) {
	        // use matrix implementation
	        return algorithm14(matrix(x), y, smaller, false).valueOf();
	      },

	      'any, Array': function anyArray(x, y) {
	        // use matrix implementation
	        return algorithm14(matrix(y), x, smaller, true).valueOf();
	      }
	    });

	    smaller.toTex = {
	      2: '\\left(${args[0]}' + latex.operators['smaller'] + '${args[1]}\\right)'
	    };

	    return smaller;
	  }

	  exports.name = 'smaller';
	  exports.factory = factory;
	});

	var smaller$1 = interopDefault(smaller);
	var factory$16 = smaller.factory;
	var name$14 = smaller.name;

var require$$0$13 = Object.freeze({
	  default: smaller$1,
	  factory: factory$16,
	  name: name$14
	});

	var larger = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var nearlyEqual = interopDefault(require$$0$2).nearlyEqual;
	  var bigNearlyEqual = interopDefault(require$$7$1);

	  function factory(type, config, load, typed) {

	    var matrix = load(interopDefault(require$$6$1));

	    var algorithm03 = load(interopDefault(require$$5$1));
	    var algorithm07 = load(interopDefault(require$$4$2));
	    var algorithm12 = load(interopDefault(require$$3$2));
	    var algorithm13 = load(interopDefault(require$$2$3));
	    var algorithm14 = load(interopDefault(require$$1$6));

	    var latex = interopDefault(require$$0$12);

	    /**
	     * Test whether value x is larger than y.
	     *
	     * The function returns true when x is larger than y and the relative
	     * difference between x and y is larger than the configured epsilon. The
	     * function cannot be used to compare values smaller than approximately 2.22e-16.
	     *
	     * For matrices, the function is evaluated element wise.
	     *
	     * Syntax:
	     *
	     *    math.larger(x, y)
	     *
	     * Examples:
	     *
	     *    math.larger(2, 3);             // returns false
	     *    math.larger(5, 2 + 2);         // returns true
	     *
	     *    var a = math.unit('5 cm');
	     *    var b = math.unit('2 inch');
	     *    math.larger(a, b);             // returns false
	     *
	     * See also:
	     *
	     *    equal, unequal, smaller, smallerEq, largerEq, compare
	     *
	     * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
	     * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
	     * @return {boolean | Array | Matrix} Returns true when the x is larger than y, else returns false
	     */
	    var larger = typed('larger', {

	      'boolean, boolean': function booleanBoolean(x, y) {
	        return x > y;
	      },

	      'number, number': function numberNumber(x, y) {
	        return x > y && !nearlyEqual(x, y, config.epsilon);
	      },

	      'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
	        return x.gt(y) && !bigNearlyEqual(x, y, config.epsilon);
	      },

	      'Fraction, Fraction': function FractionFraction(x, y) {
	        return x.compare(y) === 1;
	      },

	      'Complex, Complex': function ComplexComplex() {
	        throw new TypeError('No ordering relation is defined for complex numbers');
	      },

	      'Unit, Unit': function UnitUnit(x, y) {
	        if (!x.equalBase(y)) {
	          throw new Error('Cannot compare units with different base');
	        }
	        return larger(x.value, y.value);
	      },

	      'string, string': function stringString(x, y) {
	        return x > y;
	      },

	      'Matrix, Matrix': function MatrixMatrix(x, y) {
	        // result
	        var c;

	        // process matrix storage
	        switch (x.storage()) {
	          case 'sparse':
	            switch (y.storage()) {
	              case 'sparse':
	                // sparse + sparse
	                c = algorithm07(x, y, larger);
	                break;
	              default:
	                // sparse + dense
	                c = algorithm03(y, x, larger, true);
	                break;
	            }
	            break;
	          default:
	            switch (y.storage()) {
	              case 'sparse':
	                // dense + sparse
	                c = algorithm03(x, y, larger, false);
	                break;
	              default:
	                // dense + dense
	                c = algorithm13(x, y, larger);
	                break;
	            }
	            break;
	        }
	        return c;
	      },

	      'Array, Array': function ArrayArray(x, y) {
	        // use matrix implementation
	        return larger(matrix(x), matrix(y)).valueOf();
	      },

	      'Array, Matrix': function ArrayMatrix(x, y) {
	        // use matrix implementation
	        return larger(matrix(x), y);
	      },

	      'Matrix, Array': function MatrixArray(x, y) {
	        // use matrix implementation
	        return larger(x, matrix(y));
	      },

	      'Matrix, any': function MatrixAny(x, y) {
	        // result
	        var c;
	        // check storage format
	        switch (x.storage()) {
	          case 'sparse':
	            c = algorithm12(x, y, larger, false);
	            break;
	          default:
	            c = algorithm14(x, y, larger, false);
	            break;
	        }
	        return c;
	      },

	      'any, Matrix': function anyMatrix(x, y) {
	        // result
	        var c;
	        // check storage format
	        switch (y.storage()) {
	          case 'sparse':
	            c = algorithm12(y, x, larger, true);
	            break;
	          default:
	            c = algorithm14(y, x, larger, true);
	            break;
	        }
	        return c;
	      },

	      'Array, any': function ArrayAny(x, y) {
	        // use matrix implementation
	        return algorithm14(matrix(x), y, larger, false).valueOf();
	      },

	      'any, Array': function anyArray(x, y) {
	        // use matrix implementation
	        return algorithm14(matrix(y), x, larger, true).valueOf();
	      }
	    });

	    larger.toTex = {
	      2: '\\left(${args[0]}' + latex.operators['larger'] + '${args[1]}\\right)'
	    };

	    return larger;
	  }

	  exports.name = 'larger';
	  exports.factory = factory;
	});

	var larger$1 = interopDefault(larger);
	var factory$20 = larger.factory;
	var name$18 = larger.name;

var require$$0$14 = Object.freeze({
	  default: larger$1,
	  factory: factory$20,
	  name: name$18
	});

	var FibonacciHeap = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load, typed) {

	    var smaller = load(interopDefault(require$$0$13));
	    var larger = load(interopDefault(require$$0$14));

	    var oneOverLogPhi = 1.0 / Math.log((1.0 + Math.sqrt(5.0)) / 2.0);

	    /**
	     * Fibonacci Heap implementation, used interally for Matrix math.
	     * @class FibonacciHeap
	     * @constructor FibonacciHeap
	     */
	    function FibonacciHeap() {
	      if (!(this instanceof FibonacciHeap)) throw new SyntaxError('Constructor must be called with the new operator');

	      // initialize fields
	      this._minimum = null;
	      this._size = 0;
	    }

	    /**
	     * Attach type information
	     */
	    FibonacciHeap.prototype.type = 'FibonacciHeap';
	    FibonacciHeap.prototype.isFibonacciHeap = true;

	    /**
	     * Inserts a new data element into the heap. No heap consolidation is
	     * performed at this time, the new node is simply inserted into the root
	     * list of this heap. Running time: O(1) actual.
	     * @memberof FibonacciHeap
	     */
	    FibonacciHeap.prototype.insert = function (key, value) {
	      // create node
	      var node = {
	        key: key,
	        value: value,
	        degree: 0
	      };
	      // check we have a node in the minimum
	      if (this._minimum) {
	        // minimum node
	        var minimum = this._minimum;
	        // update left & right of node
	        node.left = minimum;
	        node.right = minimum.right;
	        minimum.right = node;
	        node.right.left = node;
	        // update minimum node in heap if needed
	        if (smaller(key, minimum.key)) {
	          // node has a smaller key, use it as minimum
	          this._minimum = node;
	        }
	      } else {
	        // set left & right
	        node.left = node;
	        node.right = node;
	        // this is the first node
	        this._minimum = node;
	      }
	      // increment number of nodes in heap
	      this._size++;
	      // return node
	      return node;
	    };

	    /**
	     * Returns the number of nodes in heap. Running time: O(1) actual.
	     * @memberof FibonacciHeap
	     */
	    FibonacciHeap.prototype.size = function () {
	      return this._size;
	    };

	    /**
	     * Removes all elements from this heap.
	     * @memberof FibonacciHeap
	     */
	    FibonacciHeap.prototype.clear = function () {
	      this._minimum = null;
	      this._size = 0;
	    };

	    /**
	     * Returns true if the heap is empty, otherwise false.
	     * @memberof FibonacciHeap
	     */
	    FibonacciHeap.prototype.isEmpty = function () {
	      return !!this._minimum;
	    };

	    /**
	     * Extracts the node with minimum key from heap. Amortized running 
	     * time: O(log n).
	     * @memberof FibonacciHeap
	     */
	    FibonacciHeap.prototype.extractMinimum = function () {
	      // node to remove
	      var node = this._minimum;
	      // check we have a minimum
	      if (node === null) return node;
	      // current minimum
	      var minimum = this._minimum;
	      // get number of children
	      var numberOfChildren = node.degree;
	      // pointer to the first child
	      var x = node.child;
	      // for each child of node do...
	      while (numberOfChildren > 0) {
	        // store node in right side
	        var tempRight = x.right;
	        // remove x from child list
	        x.left.right = x.right;
	        x.right.left = x.left;
	        // add x to root list of heap
	        x.left = minimum;
	        x.right = minimum.right;
	        minimum.right = x;
	        x.right.left = x;
	        // set Parent[x] to null
	        x.parent = null;
	        x = tempRight;
	        numberOfChildren--;
	      }
	      // remove node from root list of heap
	      node.left.right = node.right;
	      node.right.left = node.left;
	      // update minimum
	      if (node == node.right) {
	        // empty
	        minimum = null;
	      } else {
	        // update minimum
	        minimum = node.right;
	        // we need to update the pointer to the root with minimum key
	        minimum = _findMinimumNode(minimum, this._size);
	      }
	      // decrement size of heap
	      this._size--;
	      // update minimum
	      this._minimum = minimum;
	      // return node
	      return node;
	    };

	    /**
	     * Removes a node from the heap given the reference to the node. The trees
	     * in the heap will be consolidated, if necessary. This operation may fail
	     * to remove the correct element if there are nodes with key value -Infinity.
	     * Running time: O(log n) amortized.
	     * @memberof FibonacciHeap
	     */
	    FibonacciHeap.prototype.remove = function (node) {
	      // decrease key value
	      this._minimum = _decreaseKey(this._minimum, node, -1);
	      // remove the smallest
	      this.extractMinimum();
	    };

	    /**
	     * Decreases the key value for a heap node, given the new value to take on.
	     * The structure of the heap may be changed and will not be consolidated. 
	     * Running time: O(1) amortized.
	     * @memberof FibonacciHeap
	     */
	    var _decreaseKey = function _decreaseKey(minimum, node, key) {
	      // set node key
	      node.key = key;
	      // get parent node
	      var parent = node.parent;
	      if (parent && smaller(node.key, parent.key)) {
	        // remove node from parent
	        _cut(minimum, node, parent);
	        // remove all nodes from parent to the root parent
	        _cascadingCut(minimum, parent);
	      }
	      // update minimum node if needed
	      if (smaller(node.key, minimum.key)) minimum = node;
	      // return minimum
	      return minimum;
	    };

	    /**
	     * The reverse of the link operation: removes node from the child list of parent.
	     * This method assumes that min is non-null. Running time: O(1).
	     * @memberof FibonacciHeap
	     */
	    var _cut = function _cut(minimum, node, parent) {
	      // remove node from parent children and decrement Degree[parent]
	      node.left.right = node.right;
	      node.right.left = node.left;
	      parent.degree--;
	      // reset y.child if necessary
	      if (parent.child == node) parent.child = node.right;
	      // remove child if degree is 0
	      if (parent.degree === 0) parent.child = null;
	      // add node to root list of heap
	      node.left = minimum;
	      node.right = minimum.right;
	      minimum.right = node;
	      node.right.left = node;
	      // set parent[node] to null
	      node.parent = null;
	      // set mark[node] to false
	      node.mark = false;
	    };

	    /**
	     * Performs a cascading cut operation. This cuts node from its parent and then
	     * does the same for its parent, and so on up the tree.
	     * Running time: O(log n); O(1) excluding the recursion.
	     * @memberof FibonacciHeap
	     */
	    var _cascadingCut = function _cascadingCut(minimum, node) {
	      // store parent node
	      var parent = node.parent;
	      // if there's a parent...
	      if (!parent) return;
	      // if node is unmarked, set it marked
	      if (!node.mark) {
	        node.mark = true;
	      } else {
	        // it's marked, cut it from parent
	        _cut(minimum, node, parent);
	        // cut its parent as well
	        _cascadingCut(parent);
	      }
	    };

	    /**
	     * Make the first node a child of the second one. Running time: O(1) actual.
	     * @memberof FibonacciHeap
	     */
	    var _linkNodes = function _linkNodes(node, parent) {
	      // remove node from root list of heap
	      node.left.right = node.right;
	      node.right.left = node.left;
	      // make node a Child of parent
	      node.parent = parent;
	      if (!parent.child) {
	        parent.child = node;
	        node.right = node;
	        node.left = node;
	      } else {
	        node.left = parent.child;
	        node.right = parent.child.right;
	        parent.child.right = node;
	        node.right.left = node;
	      }
	      // increase degree[parent]
	      parent.degree++;
	      // set mark[node] false
	      node.mark = false;
	    };

	    var _findMinimumNode = function _findMinimumNode(minimum, size) {
	      // to find trees of the same degree efficiently we use an array of length O(log n) in which we keep a pointer to one root of each degree
	      var arraySize = Math.floor(Math.log(size) * oneOverLogPhi) + 1;
	      // create list with initial capacity
	      var array = new Array(arraySize);
	      // find the number of root nodes.
	      var numRoots = 0;
	      var x = minimum;
	      if (x) {
	        numRoots++;
	        x = x.right;
	        while (x !== minimum) {
	          numRoots++;
	          x = x.right;
	        }
	      }
	      // vars
	      var y;
	      // For each node in root list do...
	      while (numRoots > 0) {
	        // access this node's degree..
	        var d = x.degree;
	        // get next node
	        var next = x.right;
	        // check if there is a node already in array with the same degree
	        while (true) {
	          // get node with the same degree is any
	          y = array[d];
	          if (!y) break;
	          // make one node with the same degree a child of the other, do this based on the key value.
	          if (larger(x.key, y.key)) {
	            var temp = y;
	            y = x;
	            x = temp;
	          }
	          // make y a child of x
	          _linkNodes(y, x);
	          // we have handled this degree, go to next one.
	          array[d] = null;
	          d++;
	        }
	        // save this node for later when we might encounter another of the same degree.
	        array[d] = x;
	        // move forward through list.
	        x = next;
	        numRoots--;
	      }
	      // Set min to null (effectively losing the root list) and reconstruct the root list from the array entries in array[].
	      minimum = null;
	      // loop nodes in array
	      for (var i = 0; i < arraySize; i++) {
	        // get current node
	        y = array[i];
	        if (!y) continue;
	        // check if we have a linked list
	        if (minimum) {
	          // First remove node from root list.
	          y.left.right = y.right;
	          y.right.left = y.left;
	          // now add to root list, again.
	          y.left = minimum;
	          y.right = minimum.right;
	          minimum.right = y;
	          y.right.left = y;
	          // check if this is a new min.
	          if (smaller(y.key, minimum.key)) minimum = y;
	        } else minimum = y;
	      }
	      return minimum;
	    };

	    return FibonacciHeap;
	  }

	  exports.name = 'FibonacciHeap';
	  exports.path = 'type';
	  exports.factory = factory;
	});

	var FibonacciHeap$1 = interopDefault(FibonacciHeap);
	var factory$15 = FibonacciHeap.factory;
	var path$5 = FibonacciHeap.path;
	var name$13 = FibonacciHeap.name;

var require$$6$3 = Object.freeze({
	  default: FibonacciHeap$1,
	  factory: factory$15,
	  path: path$5,
	  name: name$13
	});

	var ImmutableDenseMatrix = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var util = interopDefault(require$$2);

	  var string = util.string;
	  var object = util.object;

	  var isArray = Array.isArray;
	  var isString = string.isString;

	  function factory(type, config, load) {

	    var DenseMatrix = load(interopDefault(require$$1$4));

	    var smaller = load(interopDefault(require$$0$13));

	    function ImmutableDenseMatrix(data, datatype) {
	      if (!(this instanceof ImmutableDenseMatrix)) throw new SyntaxError('Constructor must be called with the new operator');
	      if (datatype && !isString(datatype)) throw new Error('Invalid datatype: ' + datatype);

	      if (data && data.isMatrix === true || isArray(data)) {
	        // use DenseMatrix implementation
	        var matrix = new DenseMatrix(data, datatype);
	        // internal structures
	        this._data = matrix._data;
	        this._size = matrix._size;
	        this._datatype = matrix._datatype;
	        this._min = null;
	        this._max = null;
	      } else if (data && isArray(data.data) && isArray(data.size)) {
	        // initialize fields from JSON representation
	        this._data = data.data;
	        this._size = data.size;
	        this._datatype = data.datatype;
	        this._min = typeof data.min !== 'undefined' ? data.min : null;
	        this._max = typeof data.max !== 'undefined' ? data.max : null;
	      } else if (data) {
	        // unsupported type
	        throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
	      } else {
	        // nothing provided
	        this._data = [];
	        this._size = [0];
	        this._datatype = datatype;
	        this._min = null;
	        this._max = null;
	      }
	    }

	    ImmutableDenseMatrix.prototype = new DenseMatrix();

	    /**
	     * Attach type information
	     */
	    ImmutableDenseMatrix.prototype.type = 'ImmutableDenseMatrix';
	    ImmutableDenseMatrix.prototype.isImmutableDenseMatrix = true;

	    /**
	     * Get a subset of the matrix, or replace a subset of the matrix.
	     *
	     * Usage:
	     *     var subset = matrix.subset(index)               // retrieve subset
	     *     var value = matrix.subset(index, replacement)   // replace subset
	     *
	     * @param {Index} index
	     * @param {Array | ImmutableDenseMatrix | *} [replacement]
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be filled with zeros.
	     */
	    ImmutableDenseMatrix.prototype.subset = function (index) {
	      switch (arguments.length) {
	        case 1:
	          // use base implementation
	          var m = DenseMatrix.prototype.subset.call(this, index);
	          // check result is a matrix
	          if (m.isMatrix) {
	            // return immutable matrix
	            return new ImmutableDenseMatrix({
	              data: m._data,
	              size: m._size,
	              datatype: m._datatype
	            });
	          }
	          return m;

	        // intentional fall through
	        case 2:
	        case 3:
	          throw new Error('Cannot invoke set subset on an Immutable Matrix instance');

	        default:
	          throw new SyntaxError('Wrong number of arguments');
	      }
	    };

	    /**
	     * Replace a single element in the matrix.
	     * @param {Number[]} index   Zero-based index
	     * @param {*} value
	     * @param {*} [defaultValue]        Default value, filled in on new entries when
	     *                                  the matrix is resized. If not provided,
	     *                                  new matrix elements will be left undefined.
	     * @return {ImmutableDenseMatrix} self
	     */
	    ImmutableDenseMatrix.prototype.set = function () {
	      throw new Error('Cannot invoke set on an Immutable Matrix instance');
	    };

	    /**
	     * Resize the matrix to the given size. Returns a copy of the matrix when
	     * `copy=true`, otherwise return the matrix itself (resize in place).
	     *
	     * @param {Number[]} size           The new size the matrix should have.
	     * @param {*} [defaultValue=0]      Default value, filled in on new entries.
	     *                                  If not provided, the matrix elements will
	     *                                  be filled with zeros.
	     * @param {boolean} [copy]          Return a resized copy of the matrix
	     *
	     * @return {Matrix}                 The resized matrix
	     */
	    ImmutableDenseMatrix.prototype.resize = function () {
	      throw new Error('Cannot invoke resize on an Immutable Matrix instance');
	    };

	    /**
	     * Create a clone of the matrix
	     * @return {ImmutableDenseMatrix} clone
	     */
	    ImmutableDenseMatrix.prototype.clone = function () {
	      var m = new ImmutableDenseMatrix({
	        data: object.clone(this._data),
	        size: object.clone(this._size),
	        datatype: this._datatype
	      });
	      return m;
	    };

	    /**
	     * Get a JSON representation of the matrix
	     * @returns {Object}
	     */
	    ImmutableDenseMatrix.prototype.toJSON = function () {
	      return {
	        mathjs: 'ImmutableDenseMatrix',
	        data: this._data,
	        size: this._size,
	        datatype: this._datatype
	      };
	    };

	    /**
	     * Generate a matrix from a JSON object
	     * @param {Object} json  An object structured like
	     *                       `{"mathjs": "ImmutableDenseMatrix", data: [], size: []}`,
	     *                       where mathjs is optional
	     * @returns {ImmutableDenseMatrix}
	     */
	    ImmutableDenseMatrix.fromJSON = function (json) {
	      return new ImmutableDenseMatrix(json);
	    };

	    /**
	     * Swap rows i and j in Matrix.
	     *
	     * @param {Number} i       Matrix row index 1
	     * @param {Number} j       Matrix row index 2
	     *
	     * @return {Matrix}        The matrix reference
	     */
	    ImmutableDenseMatrix.prototype.swapRows = function () {
	      throw new Error('Cannot invoke swapRows on an Immutable Matrix instance');
	    };

	    /**
	     * Calculate the minimum value in the set
	     * @return {Number | undefined} min
	     */
	    ImmutableDenseMatrix.prototype.min = function () {
	      // check min has been calculated before
	      if (this._min === null) {
	        // minimum
	        var m = null;
	        // compute min
	        this.forEach(function (v) {
	          if (m === null || smaller(v, m)) m = v;
	        });
	        this._min = m !== null ? m : undefined;
	      }
	      return this._min;
	    };

	    /**
	     * Calculate the maximum value in the set
	     * @return {Number | undefined} max
	     */
	    ImmutableDenseMatrix.prototype.max = function () {
	      // check max has been calculated before
	      if (this._max === null) {
	        // maximum
	        var m = null;
	        // compute max
	        this.forEach(function (v) {
	          if (m === null || smaller(m, v)) m = v;
	        });
	        this._max = m !== null ? m : undefined;
	      }
	      return this._max;
	    };

	    // exports
	    return ImmutableDenseMatrix;
	  }

	  exports.name = 'ImmutableDenseMatrix';
	  exports.path = 'type';
	  exports.factory = factory;
	});

	var ImmutableDenseMatrix$1 = interopDefault(ImmutableDenseMatrix);
	var factory$21 = ImmutableDenseMatrix.factory;
	var path$6 = ImmutableDenseMatrix.path;
	var name$19 = ImmutableDenseMatrix.name;

var require$$5$2 = Object.freeze({
	  default: ImmutableDenseMatrix$1,
	  factory: factory$21,
	  path: path$6,
	  name: name$19
	});

	var MatrixIndex = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var clone = interopDefault(require$$1).clone;
	  var isInteger = interopDefault(require$$0$2).isInteger;

	  function factory(type) {

	    /**
	     * Create an index. An Index can store ranges and sets for multiple dimensions.
	     * Matrix.get, Matrix.set, and math.subset accept an Index as input.
	     *
	     * Usage:
	     *     var index = new Index(range1, range2, matrix1, array1, ...);
	     *
	     * Where each parameter can be any of:
	     *     A number
	     *     A string (containing a name of an object property)
	     *     An instance of Range
	     *     An Array with the Set values
	     *     A Matrix with the Set values
	     *
	     * The parameters start, end, and step must be integer numbers.
	     *
	     * @class Index
	     * @Constructor Index
	     * @param {...*} ranges
	     */
	    function Index(ranges) {
	      if (!(this instanceof Index)) {
	        throw new SyntaxError('Constructor must be called with the new operator');
	      }

	      this._dimensions = [];
	      this._isScalar = true;

	      for (var i = 0, ii = arguments.length; i < ii; i++) {
	        var arg = arguments[i];

	        if (arg && arg.isRange === true) {
	          this._dimensions.push(arg);
	          this._isScalar = false;
	        } else if (arg && (Array.isArray(arg) || arg.isMatrix === true)) {
	          // create matrix
	          var m = _createImmutableMatrix(arg.valueOf());
	          this._dimensions.push(m);
	          // size
	          var size = m.size();
	          // scalar
	          if (size.length !== 1 || size[0] !== 1) {
	            this._isScalar = false;
	          }
	        } else if (typeof arg === 'number') {
	          this._dimensions.push(_createImmutableMatrix([arg]));
	        } else if (typeof arg === 'string') {
	          // object property (arguments.count should be 1)
	          this._dimensions.push(arg);
	        }
	        // TODO: implement support for wildcard '*'
	        else {
	            throw new TypeError('Dimension must be an Array, Matrix, number, string, or Range');
	          }
	      }
	    }

	    /**
	     * Attach type information
	     */
	    Index.prototype.type = 'Index';
	    Index.prototype.isIndex = true;

	    function _createImmutableMatrix(arg) {
	      // loop array elements
	      for (var i = 0, l = arg.length; i < l; i++) {
	        if (typeof arg[i] !== 'number' || !isInteger(arg[i])) {
	          throw new TypeError('Index parameters must be positive integer numbers');
	        }
	      }
	      // create matrix
	      return new type.ImmutableDenseMatrix(arg);
	    }

	    /**
	     * Create a clone of the index
	     * @memberof Index
	     * @return {Index} clone
	     */
	    Index.prototype.clone = function () {
	      var index = new Index();
	      index._dimensions = clone(this._dimensions);
	      index._isScalar = this._isScalar;
	      return index;
	    };

	    /**
	     * Create an index from an array with ranges/numbers
	     * @memberof Index
	     * @param {Array.<Array | number>} ranges
	     * @return {Index} index
	     * @private
	     */
	    Index.create = function (ranges) {
	      var index = new Index();
	      Index.apply(index, ranges);
	      return index;
	    };

	    /**
	     * Retrieve the size of the index, the number of elements for each dimension.
	     * @memberof Index
	     * @returns {number[]} size
	     */
	    Index.prototype.size = function () {
	      var size = [];

	      for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
	        var d = this._dimensions[i];
	        size[i] = typeof d === 'string' ? 1 : d.size()[0];
	      }

	      return size;
	    };

	    /**
	     * Get the maximum value for each of the indexes ranges.
	     * @memberof Index
	     * @returns {number[]} max
	     */
	    Index.prototype.max = function () {
	      var values = [];

	      for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
	        var range = this._dimensions[i];
	        values[i] = typeof range === 'string' ? range : range.max();
	      }

	      return values;
	    };

	    /**
	     * Get the minimum value for each of the indexes ranges.
	     * @memberof Index
	     * @returns {number[]} min
	     */
	    Index.prototype.min = function () {
	      var values = [];

	      for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
	        var range = this._dimensions[i];
	        values[i] = typeof range === 'string' ? range : range.min();
	      }

	      return values;
	    };

	    /**
	     * Loop over each of the ranges of the index
	     * @memberof Index
	     * @param {Function} callback   Called for each range with a Range as first
	     *                              argument, the dimension as second, and the
	     *                              index object as third.
	     */
	    Index.prototype.forEach = function (callback) {
	      for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
	        callback(this._dimensions[i], i, this);
	      }
	    };

	    /**
	     * Retrieve the dimension for the given index
	     * @memberof Index
	     * @param {Number} dim                  Number of the dimension
	     * @returns {Range | null} range
	     */
	    Index.prototype.dimension = function (dim) {
	      return this._dimensions[dim] || null;
	    };

	    /**
	     * Test whether this index contains an object property
	     * @returns {boolean} Returns true if the index is an object property
	     */
	    Index.prototype.isObjectProperty = function () {
	      return this._dimensions.length === 1 && typeof this._dimensions[0] === 'string';
	    };

	    /**
	     * Returns the object property name when the Index holds a single object property,
	     * else returns null
	     * @returns {string | null}
	     */
	    Index.prototype.getObjectProperty = function () {
	      return this.isObjectProperty() ? this._dimensions[0] : null;
	    };

	    /**
	     * Test whether this index contains only a single value.
	     *
	     * This is the case when the index is created with only scalar values as ranges,
	     * not for ranges resolving into a single value.
	     * @memberof Index
	     * @return {boolean} isScalar
	     */
	    Index.prototype.isScalar = function () {
	      return this._isScalar;
	    };

	    /**
	     * Expand the Index into an array.
	     * For example new Index([0,3], [2,7]) returns [[0,1,2], [2,3,4,5,6]]
	     * @memberof Index
	     * @returns {Array} array
	     */
	    Index.prototype.toArray = function () {
	      var array = [];
	      for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
	        var dimension = this._dimensions[i];
	        array.push(typeof dimension === 'string' ? dimension : dimension.toArray());
	      }
	      return array;
	    };

	    /**
	     * Get the primitive value of the Index, a two dimensional array.
	     * Equivalent to Index.toArray().
	     * @memberof Index
	     * @returns {Array} array
	     */
	    Index.prototype.valueOf = Index.prototype.toArray;

	    /**
	     * Get the string representation of the index, for example '[2:6]' or '[0:2:10, 4:7, [1,2,3]]'
	     * @memberof Index
	     * @returns {String} str
	     */
	    Index.prototype.toString = function () {
	      var strings = [];

	      for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
	        var dimension = this._dimensions[i];
	        if (typeof dimension === 'string') {
	          strings.push(JSON.stringify(dimension));
	        } else {
	          strings.push(dimension.toString());
	        }
	      }

	      return '[' + strings.join(', ') + ']';
	    };

	    /**
	     * Get a JSON representation of the Index
	     * @memberof Index
	     * @returns {Object} Returns a JSON object structured as:
	     *                   `{"mathjs": "Index", "ranges": [{"mathjs": "Range", start: 0, end: 10, step:1}, ...]}`
	     */
	    Index.prototype.toJSON = function () {
	      return {
	        mathjs: 'Index',
	        dimensions: this._dimensions
	      };
	    };

	    /**
	     * Instantiate an Index from a JSON object
	     * @memberof Index
	     * @param {Object} json A JSON object structured as:
	     *                     `{"mathjs": "Index", "dimensions": [{"mathjs": "Range", start: 0, end: 10, step:1}, ...]}`
	     * @return {Index}
	     */
	    Index.fromJSON = function (json) {
	      return Index.create(json.dimensions);
	    };

	    return Index;
	  }

	  exports.name = 'Index';
	  exports.path = 'type';
	  exports.factory = factory;
	});

	var MatrixIndex$1 = interopDefault(MatrixIndex);
	var factory$22 = MatrixIndex.factory;
	var path$7 = MatrixIndex.path;
	var name$20 = MatrixIndex.name;

var require$$4$3 = Object.freeze({
	  default: MatrixIndex$1,
	  factory: factory$22,
	  path: path$7,
	  name: name$20
	});

	var Range = createCommonjsModule(function (module, exports) {
	  'use strict';

	  var number = interopDefault(require$$0$2);

	  function factory(type, config, load, typed) {
	    /**
	     * Create a range. A range has a start, step, and end, and contains functions
	     * to iterate over the range.
	     *
	     * A range can be constructed as:
	     *     var range = new Range(start, end);
	     *     var range = new Range(start, end, step);
	     *
	     * To get the result of the range:
	     *     range.forEach(function (x) {
	     *         console.log(x);
	     *     });
	     *     range.map(function (x) {
	     *         return math.sin(x);
	     *     });
	     *     range.toArray();
	     *
	     * Example usage:
	     *     var c = new Range(2, 6);         // 2:1:5
	     *     c.toArray();                     // [2, 3, 4, 5]
	     *     var d = new Range(2, -3, -1);    // 2:-1:-2
	     *     d.toArray();                     // [2, 1, 0, -1, -2]
	     *
	     * @class Range
	     * @constructor Range
	     * @param {number} start  included lower bound
	     * @param {number} end    excluded upper bound
	     * @param {number} [step] step size, default value is 1
	     */
	    function Range(start, end, step) {
	      if (!(this instanceof Range)) {
	        throw new SyntaxError('Constructor must be called with the new operator');
	      }

	      if (start != null) {
	        if (start.isBigNumber === true) start = start.toNumber();else if (typeof start !== 'number') throw new TypeError('Parameter start must be a number');
	      }
	      if (end != null) {
	        if (end.isBigNumber === true) end = end.toNumber();else if (typeof end !== 'number') throw new TypeError('Parameter end must be a number');
	      }
	      if (step != null) {
	        if (step.isBigNumber === true) step = step.toNumber();else if (typeof step !== 'number') throw new TypeError('Parameter step must be a number');
	      }

	      this.start = start != null ? parseFloat(start) : 0;
	      this.end = end != null ? parseFloat(end) : 0;
	      this.step = step != null ? parseFloat(step) : 1;
	    }

	    /**
	     * Attach type information
	     */
	    Range.prototype.type = 'Range';
	    Range.prototype.isRange = true;

	    /**
	     * Parse a string into a range,
	     * The string contains the start, optional step, and end, separated by a colon.
	     * If the string does not contain a valid range, null is returned.
	     * For example str='0:2:11'.
	     * @memberof Range
	     * @param {string} str
	     * @return {Range | null} range
	     */
	    Range.parse = function (str) {
	      if (typeof str !== 'string') {
	        return null;
	      }

	      var args = str.split(':');
	      var nums = args.map(function (arg) {
	        return parseFloat(arg);
	      });

	      var invalid = nums.some(function (num) {
	        return isNaN(num);
	      });
	      if (invalid) {
	        return null;
	      }

	      switch (nums.length) {
	        case 2:
	          return new Range(nums[0], nums[1]);
	        case 3:
	          return new Range(nums[0], nums[2], nums[1]);
	        default:
	          return null;
	      }
	    };

	    /**
	     * Create a clone of the range
	     * @return {Range} clone
	     */
	    Range.prototype.clone = function () {
	      return new Range(this.start, this.end, this.step);
	    };

	    /**
	     * Retrieve the size of the range.
	     * Returns an array containing one number, the number of elements in the range.
	     * @memberof Range
	     * @returns {number[]} size
	     */
	    Range.prototype.size = function () {
	      var len = 0,
	          start = this.start,
	          step = this.step,
	          end = this.end,
	          diff = end - start;

	      if (number.sign(step) == number.sign(diff)) {
	        len = Math.ceil(diff / step);
	      } else if (diff == 0) {
	        len = 0;
	      }

	      if (isNaN(len)) {
	        len = 0;
	      }
	      return [len];
	    };

	    /**
	     * Calculate the minimum value in the range
	     * @memberof Range
	     * @return {number | undefined} min
	     */
	    Range.prototype.min = function () {
	      var size = this.size()[0];

	      if (size > 0) {
	        if (this.step > 0) {
	          // positive step
	          return this.start;
	        } else {
	          // negative step
	          return this.start + (size - 1) * this.step;
	        }
	      } else {
	        return undefined;
	      }
	    };

	    /**
	     * Calculate the maximum value in the range
	     * @memberof Range
	     * @return {number | undefined} max
	     */
	    Range.prototype.max = function () {
	      var size = this.size()[0];

	      if (size > 0) {
	        if (this.step > 0) {
	          // positive step
	          return this.start + (size - 1) * this.step;
	        } else {
	          // negative step
	          return this.start;
	        }
	      } else {
	        return undefined;
	      }
	    };

	    /**
	     * Execute a callback function for each value in the range.
	     * @memberof Range
	     * @param {function} callback   The callback method is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Range being traversed.
	     */
	    Range.prototype.forEach = function (callback) {
	      var x = this.start;
	      var step = this.step;
	      var end = this.end;
	      var i = 0;

	      if (step > 0) {
	        while (x < end) {
	          callback(x, [i], this);
	          x += step;
	          i++;
	        }
	      } else if (step < 0) {
	        while (x > end) {
	          callback(x, [i], this);
	          x += step;
	          i++;
	        }
	      }
	    };

	    /**
	     * Execute a callback function for each value in the Range, and return the
	     * results as an array
	     * @memberof Range
	     * @param {function} callback   The callback method is invoked with three
	     *                              parameters: the value of the element, the index
	     *                              of the element, and the Matrix being traversed.
	     * @returns {Array} array
	     */
	    Range.prototype.map = function (callback) {
	      var array = [];
	      this.forEach(function (value, index, obj) {
	        array[index[0]] = callback(value, index, obj);
	      });
	      return array;
	    };

	    /**
	     * Create an Array with a copy of the Ranges data
	     * @memberof Range
	     * @returns {Array} array
	     */
	    Range.prototype.toArray = function () {
	      var array = [];
	      this.forEach(function (value, index) {
	        array[index[0]] = value;
	      });
	      return array;
	    };

	    /**
	     * Get the primitive value of the Range, a one dimensional array
	     * @memberof Range
	     * @returns {Array} array
	     */
	    Range.prototype.valueOf = function () {
	      // TODO: implement a caching mechanism for range.valueOf()
	      return this.toArray();
	    };

	    /**
	     * Get a string representation of the range, with optional formatting options.
	     * Output is formatted as 'start:step:end', for example '2:6' or '0:0.2:11'
	     * @memberof Range
	     * @param {Object | number | function} [options]  Formatting options. See
	     *                                                lib/utils/number:format for a
	     *                                                description of the available
	     *                                                options.
	     * @returns {string} str
	     */
	    Range.prototype.format = function (options) {
	      var str = number.format(this.start, options);

	      if (this.step != 1) {
	        str += ':' + number.format(this.step, options);
	      }
	      str += ':' + number.format(this.end, options);
	      return str;
	    };

	    /**
	     * Get a string representation of the range.
	     * @memberof Range
	     * @returns {string}
	     */
	    Range.prototype.toString = function () {
	      return this.format();
	    };

	    /**
	     * Get a JSON representation of the range
	     * @memberof Range
	     * @returns {Object} Returns a JSON object structured as:
	     *                   `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
	     */
	    Range.prototype.toJSON = function () {
	      return {
	        mathjs: 'Range',
	        start: this.start,
	        end: this.end,
	        step: this.step
	      };
	    };

	    /**
	     * Instantiate a Range from a JSON object
	     * @memberof Range
	     * @param {Object} json A JSON object structured as:
	     *                      `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
	     * @return {Range}
	     */
	    Range.fromJSON = function (json) {
	      return new Range(json.start, json.end, json.step);
	    };

	    return Range;
	  }

	  exports.name = 'Range';
	  exports.path = 'type';
	  exports.factory = factory;
	});

	var Range$1 = interopDefault(Range);
	var factory$23 = Range.factory;
	var path$8 = Range.path;
	var name$21 = Range.name;

var require$$3$3 = Object.freeze({
	  default: Range$1,
	  factory: factory$23,
	  path: path$8,
	  name: name$21
	});

	var index$9 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load, typed) {
	    /**
	     * Create an index. An Index can store ranges having start, step, and end
	     * for multiple dimensions.
	     * Matrix.get, Matrix.set, and math.subset accept an Index as input.
	     *
	     * Syntax:
	     *
	     *     math.index(range1, range2, ...)
	     *
	     * Where each range can be any of:
	     *
	     * - A number
	     * - A string for getting/setting an object property
	     * - An instance of `Range`
	     * - A one-dimensional Array or a Matrix with numbers
	     *
	     * Indexes must be zero-based, integer numbers.
	     *
	     * Examples:
	     *
	     *    var math = math.js
	     *
	     *    var b = [1, 2, 3, 4, 5];
	     *    math.subset(b, math.index([1, 2, 3]));     // returns [2, 3, 4]
	     *
	     *    var a = math.matrix([[1, 2], [3, 4]]);
	     *    a.subset(math.index(0, 1));             // returns 2
	     *
	     * See also:
	     *
	     *    bignumber, boolean, complex, matrix, number, string, unit
	     *
	     * @param {...*} ranges   Zero or more ranges or numbers.
	     * @return {Index}        Returns the created index
	     */
	    return typed('index', {
	      '...number | string | BigNumber | Range | Array | Matrix': function numberStringBigNumberRangeArrayMatrix(args) {
	        var ranges = args.map(function (arg) {
	          if (arg && arg.isBigNumber === true) {
	            return arg.toNumber(); // convert BigNumber to Number
	          } else if (arg && (Array.isArray(arg) || arg.isMatrix === true)) {
	            return arg.map(function (elem) {
	              // convert BigNumber to Number
	              return elem && elem.isBigNumber === true ? elem.toNumber() : elem;
	            });
	          } else {
	            return arg;
	          }
	        });

	        var res = new type.Index();
	        type.Index.apply(res, ranges);
	        return res;
	      }
	    });
	  }

	  exports.name = 'index';
	  exports.factory = factory;
	});

	var index$10 = interopDefault(index$9);
	var factory$24 = index$9.factory;
	var name$22 = index$9.name;

var require$$2$4 = Object.freeze({
	  default: index$10,
	  factory: factory$24,
	  name: name$22
	});

	var sparse$1 = createCommonjsModule(function (module, exports) {
	  'use strict';

	  function factory(type, config, load, typed) {

	    var SparseMatrix = type.SparseMatrix;

	    /**
	     * Create a Sparse Matrix. The function creates a new `math.type.Matrix` object from
	     * an `Array`. A Matrix has utility functions to manipulate the data in the
	     * matrix, like getting the size and getting or setting values in the matrix.
	     *
	     * Syntax:
	     *
	     *    math.sparse()               // creates an empty sparse matrix.
	     *    math.sparse(data)           // creates a sparse matrix with initial data.
	     *    math.sparse(data, 'number') // creates a sparse matrix with initial data, number datatype.
	     *
	     * Examples:
	     *
	     *    var m = math.sparse([[1, 2], [3, 4]]);
	     *    m.size();                        // Array [2, 2]
	     *    m.resize([3, 2], 5);
	     *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
	     *    m.get([1, 0])                    // number 3
	     *
	     * See also:
	     *
	     *    bignumber, boolean, complex, index, number, string, unit, matrix
	     *
	     * @param {Array | Matrix} [data]    A two dimensional array
	     *
	     * @return {Matrix} The created matrix
	     */
	    var sparse = typed('sparse', {
	      '': function _() {
	        return new SparseMatrix([]);
	      },

	      'string': function string(datatype) {
	        return new SparseMatrix([], datatype);
	      },

	      'Array | Matrix': function ArrayMatrix(data) {
	        return new SparseMatrix(data);
	      },

	      'Array | Matrix, string': function ArrayMatrixString(data, datatype) {
	        return new SparseMatrix(data, datatype);
	      }
	    });

	    sparse.toTex = {
	      0: '\\begin{bsparse}\\end{bsparse}',
	      1: '\\left(${args[0]}\\right)'
	    };

	    return sparse;
	  }

	  exports.name = 'sparse';
	  exports.factory = factory;
	});

	var sparse$2 = interopDefault(sparse$1);
	var factory$25 = sparse$1.factory;
	var name$23 = sparse$1.name;

var require$$0$15 = Object.freeze({
	  default: sparse$2,
	  factory: factory$25,
	  name: name$23
	});

	var index$6 = createCommonjsModule(function (module) {
	  module.exports = [
	  // types
	  interopDefault(require$$1$3), interopDefault(require$$1$4), interopDefault(require$$8), interopDefault(require$$7$2), interopDefault(require$$6$3), interopDefault(require$$5$2), interopDefault(require$$4$3), interopDefault(require$$3$3),

	  // construction functions
	  interopDefault(require$$2$4), interopDefault(require$$6$1), interopDefault(require$$0$15)];
	});

	var matrices = interopDefault(index$6);

	var math = core$1.create();
	math.import(matrices);

	var css$3 = "\ncanvas {\n  // width: 100%;\n  // height: 100%;\n  padding: 0; margin: 0;\n  left:0; top:0;\n  position: fixed;\n  overflow: hidden;\n  z-index: -1;\n}\n\n";
	var _detached = Symbol();
	var lastRenderTime = Symbol();
	var animate$1 = function animate(elem, now) {
	  if (!elem[lastRenderTime]) {
	    elem[lastRenderTime] = now;
	  }
	  if (elem[lastRenderTime] + 1000 / elem.fps <= now) {
	    elem[lastRenderTime] = now;
	    elem.dispatchEvent(new Event('animate'));
	  }
	  if (elem[_detached]) {
	    return;
	  } else {
	    window.requestAnimationFrame(function (now) {
	      animate(elem, now);
	    });
	  };
	};

	var canvas = Symbol();
	var canvasContext = Symbol();
	var edgeData$1 = Symbol();
	var edgeModifier = Symbol();
	var getNodes = Symbol();
	var animateCallback = Symbol();
	var refreshEdges = Symbol();
	window.edgeData = edgeData$1;
	window.canvas = canvas;

	var graphAllEdges = {
	  props: {
	    fps: { attribute: true, default: 60 },
	    color: { attribute: true, default: "yellow" },
	    thickness: { attribute: true, default: 2 }
	  },
	  refreshAnimation: function refreshAnimation(elem) {
	    var nodes = elem[getNodes]();
	    nodes.forEach(cacheBoundingRect);
	    var ctx = elem[canvasContext];
	    if (ctx == undefined) {
	      return;
	    }
	    ctx.canvas.width = window.innerWidth;
	    ctx.canvas.height = window.innerHeight;
	    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	    ctx.strokeStyle = elem.color;
	    ctx.fillStyle = elem.color;
	    ctx.lineWidth = elem.thickness;

	    elem[edgeData$1].forEach(function (edge) {
	      return drawEdge(ctx, edge, elem);
	    });
	  },
	  edges: function edges(elem) {
	    var nodes = elem[getNodes]();
	    // console.log("number of nodes", nodes.length)
	    if (nodes.length < 2) {
	      return [];
	    }
	    // var combo = cmb.combination(nodes,2).toArray()
	    // console.log(combo.map((c)=> {return {source: c[0], target: c[1], direction: 0}}))
	    var combos = [];
	    nodes.forEach(function (n) {
	      nodes.forEach(function (m) {
	        if (n == m) {
	          return;
	        }
	        combos.push({ source: n, target: m, direction: 1 });
	      });
	    });
	    // console.log("number of 2x combinations", combos.length)

	    return combos;
	  },
	  attached: function attached(elem) {
	    var _this = this;

	    elem[animateCallback] = function () {
	      _this.refreshAnimation(elem);
	    };
	    elem[edgeModifier] = function (edges) {
	      return edges;
	    };
	    animate$1(elem);
	    elem[getNodes] = function () {
	      return selectAll(parentGraphContainer(elem).children).filter(function (d, i, nodes) {
	        return !nodes[i][edgeData$1];
	      }).nodes();
	    };
	    elem[edgeData$1] = [];
	    // console.log(this)
	    elem[canvas] = document.createElement("canvas");
	    elem[canvasContext] = elem[canvas].getContext("2d");

	    elem[refreshEdges] = function (e) {
	      // console.log("REFRESHING EDGES")
	      elem[edgeData$1] = elem[edgeModifier](_this.edges(elem));
	      // console.log(elem[edgeData])
	    };
	    parentGraphContainer(elem).addEventListener('graph-updated', elem[refreshEdges]);
	  },
	  detached: function detached(elem) {
	    // console.log("detached",elem)
	    elem[_detached] = true;
	    elem.removeEventListener('animate', elem[animateCallback]);
	  },
	  attributeChanged: function attributeChanged(elem) {},
	  render: function render(elem) {
	    return [h('div', { style: "display: none" }, h('slot', {})), h("style", css$3)];
	  },
	  rendered: function rendered(elem) {
	    elem.shadowRoot.appendChild(elem[canvas]);
	    // console.log("rendered")
	    elem[refreshEdges]();
	    elem.addEventListener('animate', elem[animateCallback]);
	  }
	};

	var EdgesAllPairs = define$1('edges-all-pairs', graphAllEdges);

	var math$3 = core$1.create();
	math$3.import(matrices);

	define$1('edges-adjacency-matrix', EdgesAllPairs.extend({
	  edges: function edges(elem) {
	    // console.log(elem)
	    try {
	      var adj = JSON.parse(elem.innerHTML);
	    } catch (e) {}
	    var nodes = elem[getNodes]();
	    if (nodes.length < 2) {
	      return [];
	    }
	    var edges = [[nodes[0], nodes[1]]];
	    edges = [];
	    adj.forEach(function (row, i) {
	      row.forEach(function (edge, j) {
	        if (edge == 1) {
	          edges.push({ source: nodes[i], target: nodes[j], direction: 1 });
	        }
	      });
	    });
	    // combos = combos.map((c)=> {return {source: c[0], target: c[1], direction: 1}})
	    // console.log(edges)
	    return edges;
	  },
	  render: function render(elem) {
	    return [h('div', { style: "display: none" }, h('slot', {
	      onSlotchange: elem[refreshEdges]
	    })), h("style", css$3)];
	  }
	}));

	function ascending$2 (a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function bisector (compare) {
	  if (compare.length === 1) compare = ascendingComparator(compare);
	  return {
	    left: function left(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
	      }
	      return lo;
	    },
	    right: function right(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
	      }
	      return lo;
	    }
	  };
	}

	function ascendingComparator(f) {
	  return function (d, x) {
	    return ascending$2(f(d), x);
	  };
	}

	var ascendingBisect = bisector(ascending$2);

	function define$2 (constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}

	function extend$1(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) {
	    prototype[key] = definition[key];
	  }return prototype;
	}

	function Color() {}

	var _darker = 0.7;
	var _brighter = 1 / _darker;

	var reHex3 = /^#([0-9a-f]{3})$/;
	var reHex6 = /^#([0-9a-f]{6})$/;
	var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
	var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	var reRgbaInteger = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	var reRgbaPercent = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	var reHslaPercent = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define$2(Color, color, {
	  displayable: function displayable() {
	    return this.rgb().displayable();
	  },
	  toString: function toString() {
	    return this.rgb() + "";
	  }
	});

	function color(format) {
	  var m;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
	  ) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
	  : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	  : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb();
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}

	function colorRgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define$2(Rgb, colorRgb, extend$1(Color, {
	  brighter: function brighter(k) {
	    k = k == null ? _brighter : Math.pow(_brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function darker(k) {
	    k = k == null ? _darker : Math.pow(_darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function rgb() {
	    return this;
	  },
	  displayable: function displayable() {
	    return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
	  },
	  toString: function toString() {
	    var a = this.opacity;a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl();
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl(h, s, l, o.opacity);
	}

	function colorHsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$2(Hsl, colorHsl, extend$1(Color, {
	  brighter: function brighter(k) {
	    k = k == null ? _brighter : Math.pow(_brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function darker(k) {
	    k = k == null ? _darker : Math.pow(_darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function rgb() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
	  },
	  displayable: function displayable() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	  }
	}));

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
	}

	var deg2rad = Math.PI / 180;
	var rad2deg = 180 / Math.PI;

	var Kn = 18;
	var Xn = 0.950470;
	var Yn = 1;
	var Zn = 1.088830;
	var t0 = 4 / 29;
	var t1 = 6 / 29;
	var t2 = 3 * t1 * t1;
	var t3 = t1 * t1 * t1;
	function labConvert(o) {
	  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
	  if (o instanceof Hcl) {
	    var h = o.h * deg2rad;
	    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	  }
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var b = rgb2xyz(o.r),
	      a = rgb2xyz(o.g),
	      l = rgb2xyz(o.b),
	      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
	      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
	      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
	  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
	}

	function lab(l, a, b, opacity) {
	  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
	}

	function Lab(l, a, b, opacity) {
	  this.l = +l;
	  this.a = +a;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define$2(Lab, lab, extend$1(Color, {
	  brighter: function brighter(k) {
	    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  darker: function darker(k) {
	    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  rgb: function rgb() {
	    var y = (this.l + 16) / 116,
	        x = isNaN(this.a) ? y : y + this.a / 500,
	        z = isNaN(this.b) ? y : y - this.b / 200;
	    y = Yn * lab2xyz(y);
	    x = Xn * lab2xyz(x);
	    z = Zn * lab2xyz(z);
	    return new Rgb(xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
	    xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), this.opacity);
	  }
	}));

	function xyz2lab(t) {
	  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
	}

	function lab2xyz(t) {
	  return t > t1 ? t * t * t : t2 * (t - t0);
	}

	function xyz2rgb(x) {
	  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	}

	function rgb2xyz(x) {
	  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	}

	function hclConvert(o) {
	  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
	  if (!(o instanceof Lab)) o = labConvert(o);
	  var h = Math.atan2(o.b, o.a) * rad2deg;
	  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
	}

	function colorHcl(h, c, l, opacity) {
	  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
	}

	function Hcl(h, c, l, opacity) {
	  this.h = +h;
	  this.c = +c;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$2(Hcl, colorHcl, extend$1(Color, {
	  brighter: function brighter(k) {
	    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
	  },
	  darker: function darker(k) {
	    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
	  },
	  rgb: function rgb() {
	    return labConvert(this).rgb();
	  }
	}));

	var A = -0.14861;
	var B = +1.78277;
	var C = -0.29227;
	var D = -0.90649;
	var E = +1.97294;
	var ED = E * D;
	var EB = E * B;
	var BC_DA = B * C - D * A;
	function cubehelixConvert(o) {
	  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
	      bl = b - l,
	      k = (E * (g - l) - C * bl) / D,
	      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
	      // NaN if l=0 or l=1
	  h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
	  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
	}

	function cubehelix(h, s, l, opacity) {
	  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
	}

	function Cubehelix(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define$2(Cubehelix, cubehelix, extend$1(Color, {
	  brighter: function brighter(k) {
	    k = k == null ? _brighter : Math.pow(_brighter, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function darker(k) {
	    k = k == null ? _darker : Math.pow(_darker, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function rgb() {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
	  }
	}));

	function constant$3 (x) {
	  return function () {
	    return x;
	  };
	}

	function linear$1(a, d) {
	  return function (t) {
	    return a + t * d;
	  };
	}

	function exponential(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function hue(a, b) {
	  var d = b - a;
	  return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function (a, b) {
	    return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear$1(a, d) : constant$3(isNaN(a) ? b : a);
	}

	(function rgbGamma(y) {
	  var color = gamma(y);

	  function rgb(start, end) {
	    var r = color((start = colorRgb(start)).r, (end = colorRgb(end)).r),
	        g = color(start.g, end.g),
	        b = color(start.b, end.b),
	        opacity = color(start.opacity, end.opacity);
	    return function (t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb.gamma = rgbGamma;

	  return rgb;
	})(1);

	function cubehelix$1(hue) {
	  return function cubehelixGamma(y) {
	    y = +y;

	    function cubehelix$$(start, end) {
	      var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
	          s = nogamma(start.s, end.s),
	          l = nogamma(start.l, end.l),
	          opacity = nogamma(start.opacity, end.opacity);
	      return function (t) {
	        start.h = h(t);
	        start.s = s(t);
	        start.l = l(Math.pow(t, y));
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }

	    cubehelix$$.gamma = cubehelixGamma;

	    return cubehelix$$;
	  }(1);
	}

	cubehelix$1(hue);
	var interpolateCubehelixLong = cubehelix$1(nogamma);

	// Computes the decimal coefficient and exponent of the specified number x with
	// significant digits p, where x is positive and p is in [1, 21] or undefined.
	// For example, formatDecimal(1.23) returns ["123", 0].
	function formatDecimal (x, p) {
	  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	  var i,
	      coefficient = x.slice(0, i);

	  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
	}

	function exponent (x) {
	  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	}

	function formatGroup (grouping, thousands) {
	  return function (value, width) {
	    var i = value.length,
	        t = [],
	        j = 0,
	        g = grouping[0],
	        length = 0;

	    while (i > 0 && g > 0) {
	      if (length + g + 1 > width) g = Math.max(1, width - length);
	      t.push(value.substring(i -= g, i + g));
	      if ((length += g + 1) > width) break;
	      g = grouping[j = (j + 1) % grouping.length];
	    }

	    return t.reverse().join(thousands);
	  };
	}

	function formatDefault (x, p) {
	  x = x.toPrecision(p);

	  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
	    switch (x[i]) {
	      case ".":
	        i0 = i1 = i;break;
	      case "0":
	        if (i0 === 0) i0 = i;i1 = i;break;
	      case "e":
	        break out;
	      default:
	        if (i0 > 0) i0 = 0;break;
	    }
	  }

	  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
	}

	var prefixExponent;

	function formatPrefixAuto (x, p) {
	    var d = formatDecimal(x, p);
	    if (!d) return x + "";
	    var coefficient = d[0],
	        exponent = d[1],
	        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	        n = coefficient.length;
	    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	}

	function formatRounded (x, p) {
	    var d = formatDecimal(x, p);
	    if (!d) return x + "";
	    var coefficient = d[0],
	        exponent = d[1];
	    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	}

	var formatTypes = {
	  "": formatDefault,
	  "%": function _(x, p) {
	    return (x * 100).toFixed(p);
	  },
	  "b": function b(x) {
	    return Math.round(x).toString(2);
	  },
	  "c": function c(x) {
	    return x + "";
	  },
	  "d": function d(x) {
	    return Math.round(x).toString(10);
	  },
	  "e": function e(x, p) {
	    return x.toExponential(p);
	  },
	  "f": function f(x, p) {
	    return x.toFixed(p);
	  },
	  "g": function g(x, p) {
	    return x.toPrecision(p);
	  },
	  "o": function o(x) {
	    return Math.round(x).toString(8);
	  },
	  "p": function p(x, _p) {
	    return formatRounded(x * 100, _p);
	  },
	  "r": formatRounded,
	  "s": formatPrefixAuto,
	  "X": function X(x) {
	    return Math.round(x).toString(16).toUpperCase();
	  },
	  "x": function x(_x) {
	    return Math.round(_x).toString(16);
	  }
	};

	// [[fill]align][sign][symbol][0][width][,][.precision][type]
	var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

	function formatSpecifier (specifier) {
	  return new FormatSpecifier(specifier);
	}

	function FormatSpecifier(specifier) {
	  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

	  var match,
	      fill = match[1] || " ",
	      align = match[2] || ">",
	      sign = match[3] || "-",
	      symbol = match[4] || "",
	      zero = !!match[5],
	      width = match[6] && +match[6],
	      comma = !!match[7],
	      precision = match[8] && +match[8].slice(1),
	      type = match[9] || "";

	  // The "n" type is an alias for ",g".
	  if (type === "n") comma = true, type = "g";

	  // Map invalid types to the default format.
	  else if (!formatTypes[type]) type = "";

	  // If zero fill is specified, padding goes after sign and before digits.
	  if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";

	  this.fill = fill;
	  this.align = align;
	  this.sign = sign;
	  this.symbol = symbol;
	  this.zero = zero;
	  this.width = width;
	  this.comma = comma;
	  this.precision = precision;
	  this.type = type;
	}

	FormatSpecifier.prototype.toString = function () {
	  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + this.type;
	};

	var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

	function identity$4(x) {
	  return x;
	}

	function formatLocale (locale) {
	  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$4,
	      currency = locale.currency,
	      decimal = locale.decimal;

	  function newFormat(specifier) {
	    specifier = formatSpecifier(specifier);

	    var fill = specifier.fill,
	        align = specifier.align,
	        sign = specifier.sign,
	        symbol = specifier.symbol,
	        zero = specifier.zero,
	        width = specifier.width,
	        comma = specifier.comma,
	        precision = specifier.precision,
	        type = specifier.type;

	    // Compute the prefix and suffix.
	    // For SI-prefix, the suffix is lazily computed.
	    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

	    // What format function should we use?
	    // Is this an integer type?
	    // Can this type generate exponential notation?
	    var formatType = formatTypes[type],
	        maybeSuffix = !type || /[defgprs%]/.test(type);

	    // Set the default precision if not specified,
	    // or clamp the specified precision to the supported range.
	    // For significant precision, it must be in [1, 21].
	    // For fixed precision, it must be in [0, 20].
	    precision = precision == null ? type ? 6 : 12 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

	    function format(value) {
	      var valuePrefix = prefix,
	          valueSuffix = suffix,
	          i,
	          n,
	          c;

	      if (type === "c") {
	        valueSuffix = formatType(value) + valueSuffix;
	        value = "";
	      } else {
	        value = +value;

	        // Convert negative to positive, and compute the prefix.
	        // Note that -0 is not less than 0, but 1 / -0 is!
	        var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

	        // Perform the initial formatting.
	        value = formatType(value, precision);

	        // If the original value was negative, it may be rounded to zero during
	        // formatting; treat this as (positive) zero.
	        if (valueNegative) {
	          i = -1, n = value.length;
	          valueNegative = false;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 < c && c < 58 || type === "x" && 96 < c && c < 103 || type === "X" && 64 < c && c < 71) {
	              valueNegative = true;
	              break;
	            }
	          }
	        }

	        // Compute the prefix and suffix.
	        valuePrefix = (valueNegative ? sign === "(" ? sign : "-" : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

	        // Break the formatted value into the integer “value” part that can be
	        // grouped, and fractional or exponential “suffix” part that is not.
	        if (maybeSuffix) {
	          i = -1, n = value.length;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 > c || c > 57) {
	              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	              value = value.slice(0, i);
	              break;
	            }
	          }
	        }
	      }

	      // If the fill character is not "0", grouping is applied before padding.
	      if (comma && !zero) value = group(value, Infinity);

	      // Compute the padding.
	      var length = valuePrefix.length + value.length + valueSuffix.length,
	          padding = length < width ? new Array(width - length + 1).join(fill) : "";

	      // If the fill character is "0", grouping is applied after padding.
	      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

	      // Reconstruct the final output based on the desired alignment.
	      switch (align) {
	        case "<":
	          return valuePrefix + value + valueSuffix + padding;
	        case "=":
	          return valuePrefix + padding + value + valueSuffix;
	        case "^":
	          return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
	      }
	      return padding + valuePrefix + value + valueSuffix;
	    }

	    format.toString = function () {
	      return specifier + "";
	    };

	    return format;
	  }

	  function formatPrefix(specifier, value) {
	    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
	        k = Math.pow(10, -e),
	        prefix = prefixes[8 + e / 3];
	    return function (value) {
	      return f(k * value) + prefix;
	    };
	  }

	  return {
	    format: newFormat,
	    formatPrefix: formatPrefix
	  };
	}

	var locale;
	var format$3;
	var formatPrefix;

	defaultLocale({
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	});

	function defaultLocale(definition) {
	  locale = formatLocale(definition);
	  format$3 = locale.format;
	  formatPrefix = locale.formatPrefix;
	  return locale;
	}

var 	t0$1 = new Date();
var 	t1$1 = new Date();
	function newInterval(floori, offseti, count, field) {

	  function interval(date) {
	    return floori(date = new Date(+date)), date;
	  }

	  interval.floor = interval;

	  interval.ceil = function (date) {
	    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	  };

	  interval.round = function (date) {
	    var d0 = interval(date),
	        d1 = interval.ceil(date);
	    return date - d0 < d1 - date ? d0 : d1;
	  };

	  interval.offset = function (date, step) {
	    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	  };

	  interval.range = function (start, stop, step) {
	    var range = [];
	    start = interval.ceil(start);
	    step = step == null ? 1 : Math.floor(step);
	    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	    do {
	      range.push(new Date(+start));
	    } while ((offseti(start, step), floori(start), start < stop));
	    return range;
	  };

	  interval.filter = function (test) {
	    return newInterval(function (date) {
	      if (date >= date) while (floori(date), !test(date)) {
	        date.setTime(date - 1);
	      }
	    }, function (date, step) {
	      if (date >= date) while (--step >= 0) {
	        while (offseti(date, 1), !test(date)) {}
	      } // eslint-disable-line no-empty
	    });
	  };

	  if (count) {
	    interval.count = function (start, end) {
	      t0$1.setTime(+start), t1$1.setTime(+end);
	      floori(t0$1), floori(t1$1);
	      return Math.floor(count(t0$1, t1$1));
	    };

	    interval.every = function (step) {
	      step = Math.floor(step);
	      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function (d) {
	        return field(d) % step === 0;
	      } : function (d) {
	        return interval.count(0, d) % step === 0;
	      });
	    };
	  }

	  return interval;
	}

	var millisecond = newInterval(function () {
	  // noop
	}, function (date, step) {
	  date.setTime(+date + step);
	}, function (start, end) {
	  return end - start;
	});

	// An optimized implementation for this simple case.
	millisecond.every = function (k) {
	  k = Math.floor(k);
	  if (!isFinite(k) || !(k > 0)) return null;
	  if (!(k > 1)) return millisecond;
	  return newInterval(function (date) {
	    date.setTime(Math.floor(date / k) * k);
	  }, function (date, step) {
	    date.setTime(+date + step * k);
	  }, function (start, end) {
	    return (end - start) / k;
	  });
	};

	var durationSecond$1 = 1e3;
	var durationMinute$1 = 6e4;
	var durationHour$1 = 36e5;
	var durationDay$1 = 864e5;
	var durationWeek$1 = 6048e5;

	var second = newInterval(function (date) {
	  date.setTime(Math.floor(date / durationSecond$1) * durationSecond$1);
	}, function (date, step) {
	  date.setTime(+date + step * durationSecond$1);
	}, function (start, end) {
	  return (end - start) / durationSecond$1;
	}, function (date) {
	  return date.getUTCSeconds();
	});

	var minute = newInterval(function (date) {
	  date.setTime(Math.floor(date / durationMinute$1) * durationMinute$1);
	}, function (date, step) {
	  date.setTime(+date + step * durationMinute$1);
	}, function (start, end) {
	  return (end - start) / durationMinute$1;
	}, function (date) {
	  return date.getMinutes();
	});

	var hour = newInterval(function (date) {
	  var offset = date.getTimezoneOffset() * durationMinute$1 % durationHour$1;
	  if (offset < 0) offset += durationHour$1;
	  date.setTime(Math.floor((+date - offset) / durationHour$1) * durationHour$1 + offset);
	}, function (date, step) {
	  date.setTime(+date + step * durationHour$1);
	}, function (start, end) {
	  return (end - start) / durationHour$1;
	}, function (date) {
	  return date.getHours();
	});

	var day = newInterval(function (date) {
	  date.setHours(0, 0, 0, 0);
	}, function (date, step) {
	  date.setDate(date.getDate() + step);
	}, function (start, end) {
	  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
	}, function (date) {
	  return date.getDate() - 1;
	});

	function weekday(i) {
	  return newInterval(function (date) {
	    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    date.setHours(0, 0, 0, 0);
	  }, function (date, step) {
	    date.setDate(date.getDate() + step * 7);
	  }, function (start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
	  });
	}

	var timeSunday = weekday(0);
	var timeMonday = weekday(1);

	var month = newInterval(function (date) {
	  date.setDate(1);
	  date.setHours(0, 0, 0, 0);
	}, function (date, step) {
	  date.setMonth(date.getMonth() + step);
	}, function (start, end) {
	  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	}, function (date) {
	  return date.getMonth();
	});

	var year = newInterval(function (date) {
	  date.setMonth(0, 1);
	  date.setHours(0, 0, 0, 0);
	}, function (date, step) {
	  date.setFullYear(date.getFullYear() + step);
	}, function (start, end) {
	  return end.getFullYear() - start.getFullYear();
	}, function (date) {
	  return date.getFullYear();
	});

	// An optimized implementation for this simple case.
	year.every = function (k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
	    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function (date, step) {
	    date.setFullYear(date.getFullYear() + step * k);
	  });
	};

	var utcMinute = newInterval(function (date) {
	  date.setUTCSeconds(0, 0);
	}, function (date, step) {
	  date.setTime(+date + step * durationMinute$1);
	}, function (start, end) {
	  return (end - start) / durationMinute$1;
	}, function (date) {
	  return date.getUTCMinutes();
	});

	var utcHour = newInterval(function (date) {
	  date.setUTCMinutes(0, 0, 0);
	}, function (date, step) {
	  date.setTime(+date + step * durationHour$1);
	}, function (start, end) {
	  return (end - start) / durationHour$1;
	}, function (date) {
	  return date.getUTCHours();
	});

	var utcDay = newInterval(function (date) {
	  date.setUTCHours(0, 0, 0, 0);
	}, function (date, step) {
	  date.setUTCDate(date.getUTCDate() + step);
	}, function (start, end) {
	  return (end - start) / durationDay$1;
	}, function (date) {
	  return date.getUTCDate() - 1;
	});

	function utcWeekday(i) {
	  return newInterval(function (date) {
	    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function (date, step) {
	    date.setUTCDate(date.getUTCDate() + step * 7);
	  }, function (start, end) {
	    return (end - start) / durationWeek$1;
	  });
	}

	var utcWeek = utcWeekday(0);
	var utcMonday = utcWeekday(1);

	var utcMonth = newInterval(function (date) {
	  date.setUTCDate(1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function (date, step) {
	  date.setUTCMonth(date.getUTCMonth() + step);
	}, function (start, end) {
	  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	}, function (date) {
	  return date.getUTCMonth();
	});

	var utcYear = newInterval(function (date) {
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function (date, step) {
	  date.setUTCFullYear(date.getUTCFullYear() + step);
	}, function (start, end) {
	  return end.getUTCFullYear() - start.getUTCFullYear();
	}, function (date) {
	  return date.getUTCFullYear();
	});

	// An optimized implementation for this simple case.
	utcYear.every = function (k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
	    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function (date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step * k);
	  });
	};

	function localDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	    date.setFullYear(d.y);
	    return date;
	  }
	  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	}

	function utcDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	    date.setUTCFullYear(d.y);
	    return date;
	  }
	  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	}

	function newYear(y) {
	  return { y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 };
	}

	function formatLocale$1(locale) {
	  var locale_dateTime = locale.dateTime,
	      locale_date = locale.date,
	      locale_time = locale.time,
	      locale_periods = locale.periods,
	      locale_weekdays = locale.days,
	      locale_shortWeekdays = locale.shortDays,
	      locale_months = locale.months,
	      locale_shortMonths = locale.shortMonths;

	  var periodRe = formatRe(locale_periods),
	      periodLookup = formatLookup(locale_periods),
	      weekdayRe = formatRe(locale_weekdays),
	      weekdayLookup = formatLookup(locale_weekdays),
	      shortWeekdayRe = formatRe(locale_shortWeekdays),
	      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	      monthRe = formatRe(locale_months),
	      monthLookup = formatLookup(locale_months),
	      shortMonthRe = formatRe(locale_shortMonths),
	      shortMonthLookup = formatLookup(locale_shortMonths);

	  var formats = {
	    "a": formatShortWeekday,
	    "A": formatWeekday,
	    "b": formatShortMonth,
	    "B": formatMonth,
	    "c": null,
	    "d": formatDayOfMonth,
	    "e": formatDayOfMonth,
	    "H": formatHour24,
	    "I": formatHour12,
	    "j": formatDayOfYear,
	    "L": formatMilliseconds,
	    "m": formatMonthNumber,
	    "M": formatMinutes,
	    "p": formatPeriod,
	    "S": formatSeconds,
	    "U": formatWeekNumberSunday,
	    "w": formatWeekdayNumber,
	    "W": formatWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatYear,
	    "Y": formatFullYear,
	    "Z": formatZone,
	    "%": formatLiteralPercent
	  };

	  var utcFormats = {
	    "a": formatUTCShortWeekday,
	    "A": formatUTCWeekday,
	    "b": formatUTCShortMonth,
	    "B": formatUTCMonth,
	    "c": null,
	    "d": formatUTCDayOfMonth,
	    "e": formatUTCDayOfMonth,
	    "H": formatUTCHour24,
	    "I": formatUTCHour12,
	    "j": formatUTCDayOfYear,
	    "L": formatUTCMilliseconds,
	    "m": formatUTCMonthNumber,
	    "M": formatUTCMinutes,
	    "p": formatUTCPeriod,
	    "S": formatUTCSeconds,
	    "U": formatUTCWeekNumberSunday,
	    "w": formatUTCWeekdayNumber,
	    "W": formatUTCWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatUTCYear,
	    "Y": formatUTCFullYear,
	    "Z": formatUTCZone,
	    "%": formatLiteralPercent
	  };

	  var parses = {
	    "a": parseShortWeekday,
	    "A": parseWeekday,
	    "b": parseShortMonth,
	    "B": parseMonth,
	    "c": parseLocaleDateTime,
	    "d": parseDayOfMonth,
	    "e": parseDayOfMonth,
	    "H": parseHour24,
	    "I": parseHour24,
	    "j": parseDayOfYear,
	    "L": parseMilliseconds,
	    "m": parseMonthNumber,
	    "M": parseMinutes,
	    "p": parsePeriod,
	    "S": parseSeconds,
	    "U": parseWeekNumberSunday,
	    "w": parseWeekdayNumber,
	    "W": parseWeekNumberMonday,
	    "x": parseLocaleDate,
	    "X": parseLocaleTime,
	    "y": parseYear,
	    "Y": parseFullYear,
	    "Z": parseZone,
	    "%": parseLiteralPercent
	  };

	  // These recursive directive definitions must be deferred.
	  formats.x = newFormat(locale_date, formats);
	  formats.X = newFormat(locale_time, formats);
	  formats.c = newFormat(locale_dateTime, formats);
	  utcFormats.x = newFormat(locale_date, utcFormats);
	  utcFormats.X = newFormat(locale_time, utcFormats);
	  utcFormats.c = newFormat(locale_dateTime, utcFormats);

	  function newFormat(specifier, formats) {
	    return function (date) {
	      var string = [],
	          i = -1,
	          j = 0,
	          n = specifier.length,
	          c,
	          pad,
	          format;

	      if (!(date instanceof Date)) date = new Date(+date);

	      while (++i < n) {
	        if (specifier.charCodeAt(i) === 37) {
	          string.push(specifier.slice(j, i));
	          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);else pad = c === "e" ? " " : "0";
	          if (format = formats[c]) c = format(date, pad);
	          string.push(c);
	          j = i + 1;
	        }
	      }

	      string.push(specifier.slice(j, i));
	      return string.join("");
	    };
	  }

	  function newParse(specifier, newDate) {
	    return function (string) {
	      var d = newYear(1900),
	          i = parseSpecifier(d, specifier, string += "", 0);
	      if (i != string.length) return null;

	      // The am-pm flag is 0 for AM, and 1 for PM.
	      if ("p" in d) d.H = d.H % 12 + d.p * 12;

	      // Convert day-of-week and week-of-year to day-of-year.
	      if ("W" in d || "U" in d) {
	        if (!("w" in d)) d.w = "W" in d ? 1 : 0;
	        var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	        d.m = 0;
	        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
	      }

	      // If a time zone is specified, all fields are interpreted as UTC and then
	      // offset according to the specified time zone.
	      if ("Z" in d) {
	        d.H += d.Z / 100 | 0;
	        d.M += d.Z % 100;
	        return utcDate(d);
	      }

	      // Otherwise, all fields are in local time.
	      return newDate(d);
	    };
	  }

	  function parseSpecifier(d, specifier, string, j) {
	    var i = 0,
	        n = specifier.length,
	        m = string.length,
	        c,
	        parse;

	    while (i < n) {
	      if (j >= m) return -1;
	      c = specifier.charCodeAt(i++);
	      if (c === 37) {
	        c = specifier.charAt(i++);
	        parse = parses[c in pads ? specifier.charAt(i++) : c];
	        if (!parse || (j = parse(d, string, j)) < 0) return -1;
	      } else if (c != string.charCodeAt(j++)) {
	        return -1;
	      }
	    }

	    return j;
	  }

	  function parsePeriod(d, string, i) {
	    var n = periodRe.exec(string.slice(i));
	    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortWeekday(d, string, i) {
	    var n = shortWeekdayRe.exec(string.slice(i));
	    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseWeekday(d, string, i) {
	    var n = weekdayRe.exec(string.slice(i));
	    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortMonth(d, string, i) {
	    var n = shortMonthRe.exec(string.slice(i));
	    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseMonth(d, string, i) {
	    var n = monthRe.exec(string.slice(i));
	    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseLocaleDateTime(d, string, i) {
	    return parseSpecifier(d, locale_dateTime, string, i);
	  }

	  function parseLocaleDate(d, string, i) {
	    return parseSpecifier(d, locale_date, string, i);
	  }

	  function parseLocaleTime(d, string, i) {
	    return parseSpecifier(d, locale_time, string, i);
	  }

	  function formatShortWeekday(d) {
	    return locale_shortWeekdays[d.getDay()];
	  }

	  function formatWeekday(d) {
	    return locale_weekdays[d.getDay()];
	  }

	  function formatShortMonth(d) {
	    return locale_shortMonths[d.getMonth()];
	  }

	  function formatMonth(d) {
	    return locale_months[d.getMonth()];
	  }

	  function formatPeriod(d) {
	    return locale_periods[+(d.getHours() >= 12)];
	  }

	  function formatUTCShortWeekday(d) {
	    return locale_shortWeekdays[d.getUTCDay()];
	  }

	  function formatUTCWeekday(d) {
	    return locale_weekdays[d.getUTCDay()];
	  }

	  function formatUTCShortMonth(d) {
	    return locale_shortMonths[d.getUTCMonth()];
	  }

	  function formatUTCMonth(d) {
	    return locale_months[d.getUTCMonth()];
	  }

	  function formatUTCPeriod(d) {
	    return locale_periods[+(d.getUTCHours() >= 12)];
	  }

	  return {
	    format: function format(specifier) {
	      var f = newFormat(specifier += "", formats);
	      f.toString = function () {
	        return specifier;
	      };
	      return f;
	    },
	    parse: function parse(specifier) {
	      var p = newParse(specifier += "", localDate);
	      p.toString = function () {
	        return specifier;
	      };
	      return p;
	    },
	    utcFormat: function utcFormat(specifier) {
	      var f = newFormat(specifier += "", utcFormats);
	      f.toString = function () {
	        return specifier;
	      };
	      return f;
	    },
	    utcParse: function utcParse(specifier) {
	      var p = newParse(specifier, utcDate);
	      p.toString = function () {
	        return specifier;
	      };
	      return p;
	    }
	  };
	}

	var pads = { "-": "", "_": " ", "0": "0" };
	var numberRe = /^\s*\d+/;
	var percentRe = /^%/;
	var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	function pad(value, fill, width) {
	  var sign = value < 0 ? "-" : "",
	      string = (sign ? -value : value) + "",
	      length = string.length;
	  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	}

	function requote(s) {
	  return s.replace(requoteRe, "\\$&");
	}

	function formatRe(names) {
	  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	}

	function formatLookup(names) {
	  var map = {},
	      i = -1,
	      n = names.length;
	  while (++i < n) {
	    map[names[i].toLowerCase()] = i;
	  }return map;
	}

	function parseWeekdayNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.w = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.U = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.W = +n[0], i + n[0].length) : -1;
	}

	function parseFullYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 4));
	  return n ? (d.y = +n[0], i + n[0].length) : -1;
	}

	function parseYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	}

	function parseZone(d, string, i) {
	  var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
	  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	}

	function parseMonthNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	}

	function parseDayOfMonth(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.d = +n[0], i + n[0].length) : -1;
	}

	function parseDayOfYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	}

	function parseHour24(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.H = +n[0], i + n[0].length) : -1;
	}

	function parseMinutes(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.M = +n[0], i + n[0].length) : -1;
	}

	function parseSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.S = +n[0], i + n[0].length) : -1;
	}

	function parseMilliseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.L = +n[0], i + n[0].length) : -1;
	}

	function parseLiteralPercent(d, string, i) {
	  var n = percentRe.exec(string.slice(i, i + 1));
	  return n ? i + n[0].length : -1;
	}

	function formatDayOfMonth(d, p) {
	  return pad(d.getDate(), p, 2);
	}

	function formatHour24(d, p) {
	  return pad(d.getHours(), p, 2);
	}

	function formatHour12(d, p) {
	  return pad(d.getHours() % 12 || 12, p, 2);
	}

	function formatDayOfYear(d, p) {
	  return pad(1 + day.count(year(d), d), p, 3);
	}

	function formatMilliseconds(d, p) {
	  return pad(d.getMilliseconds(), p, 3);
	}

	function formatMonthNumber(d, p) {
	  return pad(d.getMonth() + 1, p, 2);
	}

	function formatMinutes(d, p) {
	  return pad(d.getMinutes(), p, 2);
	}

	function formatSeconds(d, p) {
	  return pad(d.getSeconds(), p, 2);
	}

	function formatWeekNumberSunday(d, p) {
	  return pad(timeSunday.count(year(d), d), p, 2);
	}

	function formatWeekdayNumber(d) {
	  return d.getDay();
	}

	function formatWeekNumberMonday(d, p) {
	  return pad(timeMonday.count(year(d), d), p, 2);
	}

	function formatYear(d, p) {
	  return pad(d.getFullYear() % 100, p, 2);
	}

	function formatFullYear(d, p) {
	  return pad(d.getFullYear() % 10000, p, 4);
	}

	function formatZone(d) {
	  var z = d.getTimezoneOffset();
	  return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
	}

	function formatUTCDayOfMonth(d, p) {
	  return pad(d.getUTCDate(), p, 2);
	}

	function formatUTCHour24(d, p) {
	  return pad(d.getUTCHours(), p, 2);
	}

	function formatUTCHour12(d, p) {
	  return pad(d.getUTCHours() % 12 || 12, p, 2);
	}

	function formatUTCDayOfYear(d, p) {
	  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
	}

	function formatUTCMilliseconds(d, p) {
	  return pad(d.getUTCMilliseconds(), p, 3);
	}

	function formatUTCMonthNumber(d, p) {
	  return pad(d.getUTCMonth() + 1, p, 2);
	}

	function formatUTCMinutes(d, p) {
	  return pad(d.getUTCMinutes(), p, 2);
	}

	function formatUTCSeconds(d, p) {
	  return pad(d.getUTCSeconds(), p, 2);
	}

	function formatUTCWeekNumberSunday(d, p) {
	  return pad(utcWeek.count(utcYear(d), d), p, 2);
	}

	function formatUTCWeekdayNumber(d) {
	  return d.getUTCDay();
	}

	function formatUTCWeekNumberMonday(d, p) {
	  return pad(utcMonday.count(utcYear(d), d), p, 2);
	}

	function formatUTCYear(d, p) {
	  return pad(d.getUTCFullYear() % 100, p, 2);
	}

	function formatUTCFullYear(d, p) {
	  return pad(d.getUTCFullYear() % 10000, p, 4);
	}

	function formatUTCZone() {
	  return "+0000";
	}

	function formatLiteralPercent() {
	  return "%";
	}

	var locale$1;
	var timeFormat;
	var timeParse;
	var utcFormat;
	var utcParse;

	defaultLocale$1({
	  dateTime: "%x, %X",
	  date: "%-m/%-d/%Y",
	  time: "%-I:%M:%S %p",
	  periods: ["AM", "PM"],
	  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	});

	function defaultLocale$1(definition) {
	  locale$1 = formatLocale$1(definition);
	  timeFormat = locale$1.format;
	  timeParse = locale$1.parse;
	  utcFormat = locale$1.utcFormat;
	  utcParse = locale$1.utcParse;
	  return locale$1;
	}

	var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

	function formatIsoNative(date) {
	    return date.toISOString();
	}

	var formatIso = Date.prototype.toISOString ? formatIsoNative : utcFormat(isoSpecifier);

	function parseIsoNative(string) {
	  var date = new Date(string);
	  return isNaN(date) ? null : date;
	}

	var parseIso = +new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : utcParse(isoSpecifier);

	function colors (s) {
	  return s.match(/.{6}/g).map(function (x) {
	    return "#" + x;
	  });
	}

	colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

	colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

	colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

	colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

	interpolateCubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

	var warm = interpolateCubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

	var cool = interpolateCubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

	var rainbow$1 = cubehelix();

	function interpolateRainbow (t) {
	  if (t < 0 || t > 1) t -= Math.floor(t);
	  var ts = Math.abs(t - 0.5);
	  rainbow$1.h = 360 * t - 100;
	  rainbow$1.s = 1.5 - 1.5 * ts;
	  rainbow$1.l = 0.8 - 0.9 * ts;
	  return rainbow$1 + "";
	}

	function ramp(range) {
	  var n = range.length;
	  return function (t) {
	    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
	  };
	}

	ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

	var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

	var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

	var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

	var index$11 = createCommonjsModule(function (module) {
	  'use strict';

	  /** Calculator for finding widest and/or shortest paths in a graph using the Floyed-Warshall algorithm. */

	  var FloydWarshall = function () {

	    /**
	     * Create a Floyd-Warshall calculator for a specific adjacency matrix.
	     * @param {number[][]} adjacencyMatrix - A square matrix representing a graph with weighted edges.
	     */
	    function FloydWarshall(adjacencyMatrix) {
	      babelHelpers.classCallCheck(this, FloydWarshall);

	      this.adjacencyMatrix = adjacencyMatrix;
	    }

	    /**
	     * Calculates the widest distance from one node to the other.
	     * @return {number[][]} - Matrix with distances from a node to the other
	     */


	    babelHelpers.createClass(FloydWarshall, [{
	      key: '_initializeDistanceMatrix',


	      /**
	       * @private
	       */
	      value: function _initializeDistanceMatrix(blankFiller) {
	        var distMatrix = [];
	        for (var i = 0; i < this.order; ++i) {
	          distMatrix[i] = [];
	          for (var j = 0; j < this.order; ++j) {
	            if (i === j) {
	              distMatrix[i][j] = 0;
	            } else {
	              var val = this.adjacencyMatrix[i][j];
	              if (val) {
	                distMatrix[i][j] = val;
	              } else {
	                distMatrix[i][j] = blankFiller;
	              }
	            }
	          }
	        }
	        return distMatrix;
	      }
	    }, {
	      key: 'widestPaths',
	      get: function get() {
	        var distMatrix = this._initializeDistanceMatrix(0);
	        for (var k = 0; k < this.order; ++k) {
	          for (var i = 0; i < this.order; ++i) {
	            if (i === k) {
	              continue;
	            }
	            for (var j = 0; j < this.order; ++j) {
	              if (j === i || j === k) {
	                continue;
	              }
	              var direct = distMatrix[i][j];
	              var detour = Math.min(distMatrix[i][k], distMatrix[k][j]);
	              if (detour > direct) {
	                distMatrix[i][j] = detour;
	              }
	            }
	          }
	        }
	        return distMatrix;
	      }

	      /**
	       * Calculates the shortest paths of the weighted graph.
	       * (The output will not be accurate if the graph has a negative cycle.)
	       * @return {number[][]} - Matrix with distances from a node to the other
	       */

	    }, {
	      key: 'shortestPaths',
	      get: function get() {
	        var distMatrix = this._initializeDistanceMatrix(Infinity);

	        for (var k = 0; k < this.order; ++k) {
	          for (var i = 0; i < this.order; ++i) {
	            for (var j = 0; j < this.order; ++j) {
	              var dist = distMatrix[i][k] + distMatrix[k][j];
	              if (distMatrix[i][j] > dist) {
	                distMatrix[i][j] = dist;
	              }
	            }
	          }
	        }

	        for (var _i = 0; _i < this.order; ++_i) {
	          for (var _j = 0; _j < this.order; ++_j) {
	            if (distMatrix[_i][_j] === Infinity) {
	              distMatrix[_i][_j] = -1;
	            }
	          }
	        }

	        return distMatrix;
	      }

	      /**
	       * Get the order of the adjacency matrix (and of the output distance matrices.)
	       * @return {integer} The order of the adjacency matrix.
	       */

	    }, {
	      key: 'order',
	      get: function get() {
	        return this.adjacencyMatrix.length;
	      }
	    }]);
	    return FloydWarshall;
	  }();

	  module.exports = FloydWarshall;
	});

	var FloydWarshall = interopDefault(index$11);

	// import core from 'mathjs/core'
	// import matrices from 'mathjs/lib/type/matrix'

	// var math = core.create();
	// math.import(matrices)
	function repeatAry(ary, times) {
	  var result = Array();
	  for (var i = 0; i < times; i++) {
	    result = result.concat(ary);
	  }return result;
	}

	var rainbow = function rainbow(max) {
	  return function (n) {
	    return interpolateRainbow(n / max);
	  };
	};
	var parseHops = function parseHops(val) {
	  return JSON.parse("[" + val + "]");
	};
	var hops = function hops(elem, modifier) {
	  return function (edges) {
	    var nodes = elem[getNodes]();
	    if (nodes.length < 2) {
	      return [];
	    }
	    var colors = rainbow(nodes.length);
	    var adj = [];
	    for (var i = 0; i < nodes.length; i++) {
	      adj[i] = new Array(nodes.length);
	    }

	    edges.forEach(function (edge) {
	      adj[nodes.indexOf(edge.source)][nodes.indexOf(edge.target)] = 1;
	    });
	    var hopMatrix = new FloydWarshall(adj).shortestPaths;
	    var hops = [];
	    hopMatrix.forEach(function (row, i) {
	      row.forEach(function (hop, j) {
	        if (hop != 1 && modifier.hops.includes(hop)) {
	          var thickness = elem.thickness * (1 - hop / (nodes.length + 1));
	          hops.push({ source: nodes[i], target: nodes[j],
	            // segments: [5,10],
	            segments: repeatAry([thickness, thickness], hop - 1).concat([thickness, thickness * thickness + 5 * thickness]),
	            direction: 1, color: colors(hop),
	            thickness: thickness });
	        }
	      });
	    });
	    if (modifier.hops.includes(1)) {
	      hops = hops.concat(edges);
	    }
	    return hops;
	  };
	};

	var updateHops = function updateHops(elem) {
	  var originalEdgeSets = selectAll(elem.children).filter(function (d, i, nodes) {
	    return nodes[i][edgeModifier];
	  }).nodes();
	  // console.log(originalEdgeSets)
	  originalEdgeSets.forEach(function (edgeElem) {
	    edgeElem[edgeModifier] = hops(edgeElem, elem);
	    edgeElem[refreshEdges]();
	  });
	};

	define$1('edges-modifier-hops', {
	  props: {
	    hops: { attribute: true, default: "2",
	      coerce: function coerce(val) {
	        var newVal = parseHops(val);return newVal;
	      }
	    }
	  },
	  created: function created(elem) {
	    elem[edgeModifier] = function (edges) {
	      return edges;
	    };
	    elem[edgeData] = true;
	    updateHops(elem);
	  },
	  updated: function updated(elem) {
	    console.log("updating graph hops modifier", elem.hops);
	    console.log("or...", elem.getAttribute("hops"));
	    updateHops(elem);
	    // return true
	  }
	});

	var puppyStyle = '\n  div {\n    display: inline-block;\n    background-image: url(http://i.imgur.com/B2YwP9u.gif);\n    background-position: center;\n    background-size: 100%;\n    margin: 0;\n    padding: 0;\n    width: 100px;\n    height: 150px;\n    border: solid deeppink 5px;\n  }\n  puppy-dog {\n    display: inline-block;\n    // position: relative;\n    background-size: 100%;\n    margin: 0;\n    padding: 0;\n  }\n  :host {\n    display: inline-block;\n    // position: relative;\n    background-size: 100%;\n    margin: 0;\n    padding: 0;\n  }\n';
	define$1("puppy-dog", {
	  attached: function attached(elem) {
	    startDragging(elem);
	  },
	  detached: function detached(elem) {
	    // stopDragging(elem);
	  },
	  render: function render(elem) {
	    return [h("div", ""), h("style", puppyStyle)];
	  },
	  rendered: function rendered(elem) {}
	});

	var puppyStyle$1 = '\n  div {\n    display: inline-block;\n    background-image: url(\'basketball.png\');\n    background-position: center;\n    background-size: 100%;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    height: 100%;\n  }\n  puppy-dog {\n    display: inline-block;\n    // position: relative;\n    background-size: 100%;\n    margin: 0;\n    padding: 0;\n    width: 340px;\n    height: 340px;\n  }\n  :host {\n    display: inline-block;\n    // position: relative;\n    background-size: 100%;\n    margin: 0;\n    padding: 0;\n    width: 340px;\n    height: 340px;\n  }\n';
	define$1("basket-ball", {
	  props: {
	    round: { attribute: false, default: true }
	  },
	  attached: function attached(elem) {
	    startDragging(elem);
	  },
	  detached: function detached(elem) {
	    // stopDragging(elem);
	  },
	  render: function render(elem) {
	    return [h("div", ""), h("style", puppyStyle$1)];
	  },
	  rendered: function rendered(elem) {}
	});

}));
//# sourceMappingURL=tangled-web-components.js.map