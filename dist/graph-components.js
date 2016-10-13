(function () {
	'use strict';

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

	var alwaysUndefinedIfNotANumberOrNumber = function alwaysUndefinedIfNotANumberOrNumber(val) {
	  return isNaN(val) ? undefined : Number(val);
	};
	function create(def) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    args.unshift({}, def);
	    return assign.apply(undefined, args);
	  };
	}

	var number = create({
	  default: 0,
	  coerce: alwaysUndefinedIfNotANumberOrNumber,
	  deserialize: alwaysUndefinedIfNotANumberOrNumber,
	  serialize: alwaysUndefinedIfNotANumberOrNumber
	});

	var $connected = '____skate_connected';
	var $created = '____skate_created';
	var $name = '____skate_name';
	var $props = '____skate_props';
	var $ref = '____skate_ref';
	var $renderer = '____skate_renderer';
	var $rendering = '____skate_rendering';
	var $rendererDebounced = '____skate_rendererDebounced';
	var $shadowRoot = '____skate_shadowRoot';
	var $updated = '____skate_updated';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function interopDefault(ex) {
		return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

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

	var doc = document;
	var win = window;
	var div = doc.createElement('div');
	var customElementsV0 = !!doc.registerElement;
	var customElementsV1 = !!win.customElements;
	var shadowDomV0 = !!div.createShadowRoot;
	var shadowDomV1 = !!div.attachShadow;
	var reflect = 'Reflect' in window;

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

	var applyDefault = attributes[symbols.default];
	var fallbackToV0 = !shadowDomV1 && shadowDomV0;

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

	  // V0 Shadow DOM to V1 normalisation.
	  name: function name(elem, _name, value) {
	    if (elem.tagName === 'CONTENT') {
	      _name = 'select';
	      value = '[slot="' + value + '"]';
	    }
	    applyDefault(elem, _name, value);
	  },


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
	  // Custom element properties should be set as properties.
	  var props = elem.constructor.props;
	  if (props && name in props) {
	    return applyProp(elem, name, value);
	  }

	  // Boolean false values should not set attributes at all.
	  if (value === false) {
	    return applyDefault(elem, name);
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

	  // Set defined props on the element directly. This ensures properties like
	  // "value" on <input> elements get set correctly. Setting those as attributes
	  // doesn't always work and setting props is faster than attributes.
	  //
	  // However, certain props on SVG elements are readonly and error when you try
	  // to set them.
	  if (name in elem && !('ownerSVGElement' in elem)) {
	    applyProp(elem, name, value);
	    return;
	  }

	  // Fallback to default IncrementalDOM behaviour.
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

	  // Skate allows the consumer to use <slot /> and it will translate it to
	  // <content /> if Shadow DOM V0 is preferred.
	  if (tname === 'slot' && fallbackToV0) {
	    return 'content';
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

	var _window$2 = window;
	var MutationObserver$1 = _window$2.MutationObserver;


	var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
	var timeoutDuration = 0;
	for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
	  if (navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
	    timeoutDuration = 1;
	    break;
	  }
	}

	function microTaskDebounce(cbFunc) {
	  var called = false;
	  var i = 0;
	  var cbArgs = [];
	  var elem = document.createElement('span');
	  var observer = new MutationObserver$1(function () {
	    cbFunc.apply(undefined, babelHelpers.toConsumableArray(cbArgs));
	    called = false;
	    cbArgs = null;
	  });

	  observer.observe(elem, { childList: true });

	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    cbArgs = args;
	    if (!called) {
	      called = true;
	      elem.textContent = '' + i;
	      i += 1;
	    }
	  };
	}

	function taskDebounce(fn) {
	  var called = false;
	  return function () {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    if (!called) {
	      called = true;
	      setTimeout(function () {
	        called = false;
	        fn.apply(undefined, args);
	      }, timeoutDuration);
	    }
	  };
	}

	var debounce = window.MutationObserver ? microTaskDebounce : taskDebounce;

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

	var _window$1 = window;
	var HTMLElement = _window$1.HTMLElement;

	// Abstracts shadow root across v1, v0 and no support.
	// Once v1 is supported everywhere, we can call elem.attachShadow() directly
	// and remove this function.

	function attachShadow(elem) {
	  if (shadowDomV1) {
	    return elem.attachShadow({ mode: 'open' });
	  } else if (shadowDomV0) {
	    return elem.createShadowRoot();
	  }
	  return elem;
	}

	function getOrAttachShadow(elem) {
	  return elem[$shadowRoot] || (elem[$shadowRoot] = attachShadow(elem));
	}

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
	  elem[$rendererDebounced] = debounce(constructor[$renderer].bind(constructor));

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

	  // In v0 we must ensure the attributeChangedCallback is called for attrs
	  // that aren't linked to props so that the callback behaves the same no
	  // matter if v0 or v1 is being used.
	  if (customElementsV0) {
	    constructor.observedAttributes.forEach(function (name) {
	      var propertyName = data(elem, 'attributeLinks')[name];
	      if (!propertyName) {
	        elem.attributeChangedCallback(name, null, elem.getAttribute(name));
	      }
	    });
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

	// v1
	function Component() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  var elem = reflect ? Reflect.construct(HTMLElement, args, this.constructor) : HTMLElement.call(this, args[0]);
	  callConstructor(elem);
	  return elem;
	}

	// v1
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
	    this.renderer({ elem: elem, render: this.render, shadowRoot: getOrAttachShadow(elem) });
	    if (typeof this.rendered === 'function') {
	      this.rendered(elem);
	    }
	  }

	  elem[$rendering] = false;
	};

	Component.prototype = Object.create(HTMLElement.prototype, {
	  // v1
	  connectedCallback: {
	    configurable: true,
	    value: function value() {
	      callConnected(this);
	    }
	  },

	  // v1
	  disconnectedCallback: {
	    configurable: true,
	    value: function value() {
	      callDisconnected(this);
	    }
	  },

	  // v0 and v1
	  attributeChangedCallback: {
	    configurable: true,
	    value: function value(name, oldValue, newValue) {
	      var _constructor = this.constructor;
	      var attributeChanged = _constructor.attributeChanged;
	      var observedAttributes = _constructor.observedAttributes;

	      var propertyName = data(this, 'attributeLinks')[name];

	      // In V0 we have to ensure the attribute is being observed.
	      if (customElementsV0 && observedAttributes.indexOf(name) === -1) {
	        return;
	      }

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
	  },

	  // v0
	  createdCallback: {
	    configurable: true,
	    value: function value() {
	      callConstructor(this);
	    }
	  },

	  // v0
	  attachedCallback: {
	    configurable: true,
	    value: function value() {
	      callConnected(this);
	    }
	  },

	  // v0
	  detachedCallback: {
	    configurable: true,
	    value: function value() {
	      callDisconnected(this);
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

	function registerV0Element(name, Ctor) {
	  var res = void 0;
	  var uniqueName = void 0;
	  try {
	    prepareForRegistration(name, Ctor);
	    res = document.registerElement(name, Ctor);
	  } catch (e) {
	    uniqueName = generateUniqueName(name);
	    prepareForRegistration(uniqueName, Ctor);
	    res = document.registerElement(uniqueName, Ctor);
	  }
	  return res;
	}

	function registerV1Element(name, Ctor) {
	  var uniqueName = name;
	  if (window.customElements.get(name)) {
	    uniqueName = generateUniqueName(name);
	  }
	  prepareForRegistration(uniqueName, Ctor);
	  window.customElements.define(uniqueName, Ctor, Ctor.extends ? { extends: Ctor.extends } : null);
	  return Ctor;
	}

	function define$1 (name, opts) {
	  if (opts === undefined) {
	    throw new Error('You have to define options to register a component ' + name);
	  }
	  var Ctor = (typeof opts === 'undefined' ? 'undefined' : babelHelpers.typeof(opts)) === 'object' ? Component.extend(opts) : opts;
	  formatLinkedAttributes(Ctor);

	  if (customElementsV1) {
	    return registerV1Element(name, Ctor);
	  } else if (customElementsV0) {
	    return registerV0Element(name, Ctor);
	  }

	  throw new Error('Skate requires native custom element support or a polyfill.');
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

	var root = createCommonjsModule(function (module, exports) {
	    "use strict";
	    /**
	     * window: browser in DOM main thread
	     * self: browser in WebWorker
	     * global: Node.js/other
	     */

	    exports.root = (typeof window === 'undefined' ? 'undefined' : babelHelpers.typeof(window)) == 'object' && window.window === window && window || (typeof self === 'undefined' ? 'undefined' : babelHelpers.typeof(self)) == 'object' && self.self === self && self || babelHelpers.typeof(commonjsGlobal) == 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal;
	    if (!exports.root) {
	        throw new Error('RxJS could not find any global context (window, self, global)');
	    }
	    });

	var root$1 = interopDefault(root);
	var root$$1 = root.root;


	var require$$0$1 = Object.freeze({
	    default: root$1,
	    root: root$$1
	});

	var isFunction = createCommonjsModule(function (module, exports) {
	    "use strict";

	    function isFunction(x) {
	        return typeof x === 'function';
	    }
	    exports.isFunction = isFunction;
	    });

	var isFunction$1 = interopDefault(isFunction);
	var isFunction$$1 = isFunction.isFunction;


	var require$$3$1 = Object.freeze({
	    default: isFunction$1,
	    isFunction: isFunction$$1
	});

	var isArray = createCommonjsModule(function (module, exports) {
	  "use strict";

	  exports.isArray = Array.isArray || function (x) {
	    return x && typeof x.length === 'number';
	  };
	  });

	var isArray$1 = interopDefault(isArray);
	var isArray$$1 = isArray.isArray;


	var require$$5 = Object.freeze({
	  default: isArray$1,
	  isArray: isArray$$1
	});

	var isObject = createCommonjsModule(function (module, exports) {
	    "use strict";

	    function isObject(x) {
	        return x != null && (typeof x === 'undefined' ? 'undefined' : babelHelpers.typeof(x)) === 'object';
	    }
	    exports.isObject = isObject;
	    });

	var isObject$1 = interopDefault(isObject);
	var isObject$$1 = isObject.isObject;


	var require$$4 = Object.freeze({
	    default: isObject$1,
	    isObject: isObject$$1
	});

	var errorObject = createCommonjsModule(function (module, exports) {
	  "use strict";
	  // typeof any so that it we don't have to cast when comparing a result to the error object

	  exports.errorObject = { e: {} };
	  });

	var errorObject$1 = interopDefault(errorObject);
	var errorObject$$1 = errorObject.errorObject;


	var require$$0$3 = Object.freeze({
	  default: errorObject$1,
	  errorObject: errorObject$$1
	});

	var tryCatch = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var errorObject_1 = interopDefault(require$$0$3);
	    var tryCatchTarget;
	    function tryCatcher() {
	        try {
	            return tryCatchTarget.apply(this, arguments);
	        } catch (e) {
	            errorObject_1.errorObject.e = e;
	            return errorObject_1.errorObject;
	        }
	    }
	    function tryCatch(fn) {
	        tryCatchTarget = fn;
	        return tryCatcher;
	    }
	    exports.tryCatch = tryCatch;
	    ;
	    });

	var tryCatch$1 = interopDefault(tryCatch);
	var tryCatch$$1 = tryCatch.tryCatch;


	var require$$2$1 = Object.freeze({
	    default: tryCatch$1,
	    tryCatch: tryCatch$$1
	});

	var UnsubscriptionError = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var __extends = commonjsGlobal && commonjsGlobal.__extends || function (d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) d[p] = b[p];
	        }function __() {
	            this.constructor = d;
	        }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    /**
	     * An error thrown when one or more errors have occurred during the
	     * `unsubscribe` of a {@link Subscription}.
	     */
	    var UnsubscriptionError = function (_super) {
	        __extends(UnsubscriptionError, _super);
	        function UnsubscriptionError(errors) {
	            _super.call(this);
	            this.errors = errors;
	            var err = Error.call(this, errors ? errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) {
	                return i + 1 + ") " + err.toString();
	            }).join('\n  ') : '');
	            this.name = err.name = 'UnsubscriptionError';
	            this.stack = err.stack;
	            this.message = err.message;
	        }
	        return UnsubscriptionError;
	    }(Error);
	    exports.UnsubscriptionError = UnsubscriptionError;
	    });

	var UnsubscriptionError$1 = interopDefault(UnsubscriptionError);
	var UnsubscriptionError$$1 = UnsubscriptionError.UnsubscriptionError;


	var require$$0$4 = Object.freeze({
	    default: UnsubscriptionError$1,
	    UnsubscriptionError: UnsubscriptionError$$1
	});

	var Subscription = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var isArray_1 = interopDefault(require$$5);
	    var isObject_1 = interopDefault(require$$4);
	    var isFunction_1 = interopDefault(require$$3$1);
	    var tryCatch_1 = interopDefault(require$$2$1);
	    var errorObject_1 = interopDefault(require$$0$3);
	    var UnsubscriptionError_1 = interopDefault(require$$0$4);
	    /**
	     * Represents a disposable resource, such as the execution of an Observable. A
	     * Subscription has one important method, `unsubscribe`, that takes no argument
	     * and just disposes the resource held by the subscription.
	     *
	     * Additionally, subscriptions may be grouped together through the `add()`
	     * method, which will attach a child Subscription to the current Subscription.
	     * When a Subscription is unsubscribed, all its children (and its grandchildren)
	     * will be unsubscribed as well.
	     *
	     * @class Subscription
	     */
	    var Subscription = function () {
	        /**
	         * @param {function(): void} [unsubscribe] A function describing how to
	         * perform the disposal of resources when the `unsubscribe` method is called.
	         */
	        function Subscription(unsubscribe) {
	            /**
	             * A flag to indicate whether this Subscription has already been unsubscribed.
	             * @type {boolean}
	             */
	            this.closed = false;
	            if (unsubscribe) {
	                this._unsubscribe = unsubscribe;
	            }
	        }
	        /**
	         * Disposes the resources held by the subscription. May, for instance, cancel
	         * an ongoing Observable execution or cancel any other type of work that
	         * started when the Subscription was created.
	         * @return {void}
	         */
	        Subscription.prototype.unsubscribe = function () {
	            var hasErrors = false;
	            var errors;
	            if (this.closed) {
	                return;
	            }
	            this.closed = true;
	            var _a = this,
	                _unsubscribe = _a._unsubscribe,
	                _subscriptions = _a._subscriptions;
	            this._subscriptions = null;
	            if (isFunction_1.isFunction(_unsubscribe)) {
	                var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
	                if (trial === errorObject_1.errorObject) {
	                    hasErrors = true;
	                    (errors = errors || []).push(errorObject_1.errorObject.e);
	                }
	            }
	            if (isArray_1.isArray(_subscriptions)) {
	                var index = -1;
	                var len = _subscriptions.length;
	                while (++index < len) {
	                    var sub = _subscriptions[index];
	                    if (isObject_1.isObject(sub)) {
	                        var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
	                        if (trial === errorObject_1.errorObject) {
	                            hasErrors = true;
	                            errors = errors || [];
	                            var err = errorObject_1.errorObject.e;
	                            if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
	                                errors = errors.concat(err.errors);
	                            } else {
	                                errors.push(err);
	                            }
	                        }
	                    }
	                }
	            }
	            if (hasErrors) {
	                throw new UnsubscriptionError_1.UnsubscriptionError(errors);
	            }
	        };
	        /**
	         * Adds a tear down to be called during the unsubscribe() of this
	         * Subscription.
	         *
	         * If the tear down being added is a subscription that is already
	         * unsubscribed, is the same reference `add` is being called on, or is
	         * `Subscription.EMPTY`, it will not be added.
	         *
	         * If this subscription is already in an `closed` state, the passed
	         * tear down logic will be executed immediately.
	         *
	         * @param {TeardownLogic} teardown The additional logic to execute on
	         * teardown.
	         * @return {Subscription} Returns the Subscription used or created to be
	         * added to the inner subscriptions list. This Subscription can be used with
	         * `remove()` to remove the passed teardown logic from the inner subscriptions
	         * list.
	         */
	        Subscription.prototype.add = function (teardown) {
	            if (!teardown || teardown === Subscription.EMPTY) {
	                return Subscription.EMPTY;
	            }
	            if (teardown === this) {
	                return this;
	            }
	            var sub = teardown;
	            switch (typeof teardown === 'undefined' ? 'undefined' : babelHelpers.typeof(teardown)) {
	                case 'function':
	                    sub = new Subscription(teardown);
	                case 'object':
	                    if (sub.closed || typeof sub.unsubscribe !== 'function') {
	                        break;
	                    } else if (this.closed) {
	                        sub.unsubscribe();
	                    } else {
	                        (this._subscriptions || (this._subscriptions = [])).push(sub);
	                    }
	                    break;
	                default:
	                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
	            }
	            return sub;
	        };
	        /**
	         * Removes a Subscription from the internal list of subscriptions that will
	         * unsubscribe during the unsubscribe process of this Subscription.
	         * @param {Subscription} subscription The subscription to remove.
	         * @return {void}
	         */
	        Subscription.prototype.remove = function (subscription) {
	            // HACK: This might be redundant because of the logic in `add()`
	            if (subscription == null || subscription === this || subscription === Subscription.EMPTY) {
	                return;
	            }
	            var subscriptions = this._subscriptions;
	            if (subscriptions) {
	                var subscriptionIndex = subscriptions.indexOf(subscription);
	                if (subscriptionIndex !== -1) {
	                    subscriptions.splice(subscriptionIndex, 1);
	                }
	            }
	        };
	        Subscription.EMPTY = function (empty) {
	            empty.closed = true;
	            return empty;
	        }(new Subscription());
	        return Subscription;
	    }();
	    exports.Subscription = Subscription;
	    });

	var Subscription$1 = interopDefault(Subscription);
	var Subscription$$1 = Subscription.Subscription;


	var require$$2 = Object.freeze({
	    default: Subscription$1,
	    Subscription: Subscription$$1
	});

	var Observer = createCommonjsModule(function (module, exports) {
	    "use strict";

	    exports.empty = {
	        closed: true,
	        next: function next(value) {},
	        error: function error(err) {
	            throw err;
	        },
	        complete: function complete() {}
	    };
	    });

	var Observer$1 = interopDefault(Observer);
	var empty$1 = Observer.empty;

var require$$1$1 = Object.freeze({
	    default: Observer$1,
	    empty: empty$1
	});

	var rxSubscriber = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var root_1 = interopDefault(require$$0$1);
	    var _Symbol = root_1.root.Symbol;
	    exports.$$rxSubscriber = typeof _Symbol === 'function' && typeof _Symbol.for === 'function' ? _Symbol.for('rxSubscriber') : '@@rxSubscriber';
	    });

	var rxSubscriber$1 = interopDefault(rxSubscriber);
	var $$rxSubscriber = rxSubscriber.$$rxSubscriber;

var require$$0$5 = Object.freeze({
	    default: rxSubscriber$1,
	    $$rxSubscriber: $$rxSubscriber
	});

	var Subscriber = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var __extends = commonjsGlobal && commonjsGlobal.__extends || function (d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) d[p] = b[p];
	        }function __() {
	            this.constructor = d;
	        }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var isFunction_1 = interopDefault(require$$3$1);
	    var Subscription_1 = interopDefault(require$$2);
	    var Observer_1 = interopDefault(require$$1$1);
	    var rxSubscriber_1 = interopDefault(require$$0$5);
	    /**
	     * Implements the {@link Observer} interface and extends the
	     * {@link Subscription} class. While the {@link Observer} is the public API for
	     * consuming the values of an {@link Observable}, all Observers get converted to
	     * a Subscriber, in order to provide Subscription-like capabilities such as
	     * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
	     * implementing operators, but it is rarely used as a public API.
	     *
	     * @class Subscriber<T>
	     */
	    var Subscriber = function (_super) {
	        __extends(Subscriber, _super);
	        /**
	         * @param {Observer|function(value: T): void} [destinationOrNext] A partially
	         * defined Observer or a `next` callback function.
	         * @param {function(e: ?any): void} [error] The `error` callback of an
	         * Observer.
	         * @param {function(): void} [complete] The `complete` callback of an
	         * Observer.
	         */
	        function Subscriber(destinationOrNext, error, complete) {
	            _super.call(this);
	            this.syncErrorValue = null;
	            this.syncErrorThrown = false;
	            this.syncErrorThrowable = false;
	            this.isStopped = false;
	            switch (arguments.length) {
	                case 0:
	                    this.destination = Observer_1.empty;
	                    break;
	                case 1:
	                    if (!destinationOrNext) {
	                        this.destination = Observer_1.empty;
	                        break;
	                    }
	                    if ((typeof destinationOrNext === 'undefined' ? 'undefined' : babelHelpers.typeof(destinationOrNext)) === 'object') {
	                        if (destinationOrNext instanceof Subscriber) {
	                            this.destination = destinationOrNext;
	                            this.destination.add(this);
	                        } else {
	                            this.syncErrorThrowable = true;
	                            this.destination = new SafeSubscriber(this, destinationOrNext);
	                        }
	                        break;
	                    }
	                default:
	                    this.syncErrorThrowable = true;
	                    this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
	                    break;
	            }
	        }
	        Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
	            return this;
	        };
	        /**
	         * A static factory for a Subscriber, given a (potentially partial) definition
	         * of an Observer.
	         * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
	         * @param {function(e: ?any): void} [error] The `error` callback of an
	         * Observer.
	         * @param {function(): void} [complete] The `complete` callback of an
	         * Observer.
	         * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
	         * Observer represented by the given arguments.
	         */
	        Subscriber.create = function (next, error, complete) {
	            var subscriber = new Subscriber(next, error, complete);
	            subscriber.syncErrorThrowable = false;
	            return subscriber;
	        };
	        /**
	         * The {@link Observer} callback to receive notifications of type `next` from
	         * the Observable, with a value. The Observable may call this method 0 or more
	         * times.
	         * @param {T} [value] The `next` value.
	         * @return {void}
	         */
	        Subscriber.prototype.next = function (value) {
	            if (!this.isStopped) {
	                this._next(value);
	            }
	        };
	        /**
	         * The {@link Observer} callback to receive notifications of type `error` from
	         * the Observable, with an attached {@link Error}. Notifies the Observer that
	         * the Observable has experienced an error condition.
	         * @param {any} [err] The `error` exception.
	         * @return {void}
	         */
	        Subscriber.prototype.error = function (err) {
	            if (!this.isStopped) {
	                this.isStopped = true;
	                this._error(err);
	            }
	        };
	        /**
	         * The {@link Observer} callback to receive a valueless notification of type
	         * `complete` from the Observable. Notifies the Observer that the Observable
	         * has finished sending push-based notifications.
	         * @return {void}
	         */
	        Subscriber.prototype.complete = function () {
	            if (!this.isStopped) {
	                this.isStopped = true;
	                this._complete();
	            }
	        };
	        Subscriber.prototype.unsubscribe = function () {
	            if (this.closed) {
	                return;
	            }
	            this.isStopped = true;
	            _super.prototype.unsubscribe.call(this);
	        };
	        Subscriber.prototype._next = function (value) {
	            this.destination.next(value);
	        };
	        Subscriber.prototype._error = function (err) {
	            this.destination.error(err);
	            this.unsubscribe();
	        };
	        Subscriber.prototype._complete = function () {
	            this.destination.complete();
	            this.unsubscribe();
	        };
	        return Subscriber;
	    }(Subscription_1.Subscription);
	    exports.Subscriber = Subscriber;
	    /**
	     * We need this JSDoc comment for affecting ESDoc.
	     * @ignore
	     * @extends {Ignored}
	     */
	    var SafeSubscriber = function (_super) {
	        __extends(SafeSubscriber, _super);
	        function SafeSubscriber(_parent, observerOrNext, error, complete) {
	            _super.call(this);
	            this._parent = _parent;
	            var next;
	            var context = this;
	            if (isFunction_1.isFunction(observerOrNext)) {
	                next = observerOrNext;
	            } else if (observerOrNext) {
	                context = observerOrNext;
	                next = observerOrNext.next;
	                error = observerOrNext.error;
	                complete = observerOrNext.complete;
	                if (isFunction_1.isFunction(context.unsubscribe)) {
	                    this.add(context.unsubscribe.bind(context));
	                }
	                context.unsubscribe = this.unsubscribe.bind(this);
	            }
	            this._context = context;
	            this._next = next;
	            this._error = error;
	            this._complete = complete;
	        }
	        SafeSubscriber.prototype.next = function (value) {
	            if (!this.isStopped && this._next) {
	                var _parent = this._parent;
	                if (!_parent.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._next, value);
	                } else if (this.__tryOrSetError(_parent, this._next, value)) {
	                    this.unsubscribe();
	                }
	            }
	        };
	        SafeSubscriber.prototype.error = function (err) {
	            if (!this.isStopped) {
	                var _parent = this._parent;
	                if (this._error) {
	                    if (!_parent.syncErrorThrowable) {
	                        this.__tryOrUnsub(this._error, err);
	                        this.unsubscribe();
	                    } else {
	                        this.__tryOrSetError(_parent, this._error, err);
	                        this.unsubscribe();
	                    }
	                } else if (!_parent.syncErrorThrowable) {
	                    this.unsubscribe();
	                    throw err;
	                } else {
	                    _parent.syncErrorValue = err;
	                    _parent.syncErrorThrown = true;
	                    this.unsubscribe();
	                }
	            }
	        };
	        SafeSubscriber.prototype.complete = function () {
	            if (!this.isStopped) {
	                var _parent = this._parent;
	                if (this._complete) {
	                    if (!_parent.syncErrorThrowable) {
	                        this.__tryOrUnsub(this._complete);
	                        this.unsubscribe();
	                    } else {
	                        this.__tryOrSetError(_parent, this._complete);
	                        this.unsubscribe();
	                    }
	                } else {
	                    this.unsubscribe();
	                }
	            }
	        };
	        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	            try {
	                fn.call(this._context, value);
	            } catch (err) {
	                this.unsubscribe();
	                throw err;
	            }
	        };
	        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	            try {
	                fn.call(this._context, value);
	            } catch (err) {
	                parent.syncErrorValue = err;
	                parent.syncErrorThrown = true;
	                return true;
	            }
	            return false;
	        };
	        SafeSubscriber.prototype._unsubscribe = function () {
	            var _parent = this._parent;
	            this._context = null;
	            this._parent = null;
	            _parent.unsubscribe();
	        };
	        return SafeSubscriber;
	    }(Subscriber);
	    });

	var Subscriber$1 = interopDefault(Subscriber);
	var Subscriber$$1 = Subscriber.Subscriber;


	var require$$0$2 = Object.freeze({
	    default: Subscriber$1,
	    Subscriber: Subscriber$$1
	});

	var toSubscriber = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var Subscriber_1 = interopDefault(require$$0$2);
	    var rxSubscriber_1 = interopDefault(require$$0$5);
	    var Observer_1 = interopDefault(require$$1$1);
	    function toSubscriber(nextOrObserver, error, complete) {
	        if (nextOrObserver) {
	            if (nextOrObserver instanceof Subscriber_1.Subscriber) {
	                return nextOrObserver;
	            }
	            if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
	                return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
	            }
	        }
	        if (!nextOrObserver && !error && !complete) {
	            return new Subscriber_1.Subscriber(Observer_1.empty);
	        }
	        return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	    }
	    exports.toSubscriber = toSubscriber;
	    });

	var toSubscriber$1 = interopDefault(toSubscriber);
	var toSubscriber$$1 = toSubscriber.toSubscriber;


	var require$$1 = Object.freeze({
	    default: toSubscriber$1,
	    toSubscriber: toSubscriber$$1
	});

	var observable = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var root_1 = interopDefault(require$$0$1);
	    function getSymbolObservable(context) {
	        var $$observable;
	        var _Symbol = context.Symbol;
	        if (typeof _Symbol === 'function') {
	            if (_Symbol.observable) {
	                $$observable = _Symbol.observable;
	            } else {
	                $$observable = _Symbol('observable');
	                _Symbol.observable = $$observable;
	            }
	        } else {
	            $$observable = '@@observable';
	        }
	        return $$observable;
	    }
	    exports.getSymbolObservable = getSymbolObservable;
	    exports.$$observable = getSymbolObservable(root_1.root);
	    });

	var observable$1 = interopDefault(observable);
	var $$observable = observable.$$observable;
	var getSymbolObservable = observable.getSymbolObservable;

var require$$0$6 = Object.freeze({
	    default: observable$1,
	    $$observable: $$observable,
	    getSymbolObservable: getSymbolObservable
	});

	var Observable = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var root_1 = interopDefault(require$$0$1);
	    var toSubscriber_1 = interopDefault(require$$1);
	    var observable_1 = interopDefault(require$$0$6);
	    /**
	     * A representation of any set of values over any amount of time. This the most basic building block
	     * of RxJS.
	     *
	     * @class Observable<T>
	     */
	    var Observable = function () {
	        /**
	         * @constructor
	         * @param {Function} subscribe the function that is  called when the Observable is
	         * initially subscribed to. This function is given a Subscriber, to which new values
	         * can be `next`ed, or an `error` method can be called to raise an error, or
	         * `complete` can be called to notify of a successful completion.
	         */
	        function Observable(subscribe) {
	            this._isScalar = false;
	            if (subscribe) {
	                this._subscribe = subscribe;
	            }
	        }
	        /**
	         * Creates a new Observable, with this Observable as the source, and the passed
	         * operator defined as the new observable's operator.
	         * @method lift
	         * @param {Operator} operator the operator defining the operation to take on the observable
	         * @return {Observable} a new observable with the Operator applied
	         */
	        Observable.prototype.lift = function (operator) {
	            var observable = new Observable();
	            observable.source = this;
	            observable.operator = operator;
	            return observable;
	        };
	        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	            var operator = this.operator;
	            var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
	            if (operator) {
	                operator.call(sink, this);
	            } else {
	                sink.add(this._subscribe(sink));
	            }
	            if (sink.syncErrorThrowable) {
	                sink.syncErrorThrowable = false;
	                if (sink.syncErrorThrown) {
	                    throw sink.syncErrorValue;
	                }
	            }
	            return sink;
	        };
	        /**
	         * @method forEach
	         * @param {Function} next a handler for each value emitted by the observable
	         * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
	         * @return {Promise} a promise that either resolves on observable completion or
	         *  rejects with the handled error
	         */
	        Observable.prototype.forEach = function (next, PromiseCtor) {
	            var _this = this;
	            if (!PromiseCtor) {
	                if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
	                    PromiseCtor = root_1.root.Rx.config.Promise;
	                } else if (root_1.root.Promise) {
	                    PromiseCtor = root_1.root.Promise;
	                }
	            }
	            if (!PromiseCtor) {
	                throw new Error('no Promise impl found');
	            }
	            return new PromiseCtor(function (resolve, reject) {
	                var subscription = _this.subscribe(function (value) {
	                    if (subscription) {
	                        // if there is a subscription, then we can surmise
	                        // the next handling is asynchronous. Any errors thrown
	                        // need to be rejected explicitly and unsubscribe must be
	                        // called manually
	                        try {
	                            next(value);
	                        } catch (err) {
	                            reject(err);
	                            subscription.unsubscribe();
	                        }
	                    } else {
	                        // if there is NO subscription, then we're getting a nexted
	                        // value synchronously during subscription. We can just call it.
	                        // If it errors, Observable's `subscribe` will ensure the
	                        // unsubscription logic is called, then synchronously rethrow the error.
	                        // After that, Promise will trap the error and send it
	                        // down the rejection path.
	                        next(value);
	                    }
	                }, reject, resolve);
	            });
	        };
	        Observable.prototype._subscribe = function (subscriber) {
	            return this.source.subscribe(subscriber);
	        };
	        /**
	         * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
	         * @method Symbol.observable
	         * @return {Observable} this instance of the observable
	         */
	        Observable.prototype[observable_1.$$observable] = function () {
	            return this;
	        };
	        // HACK: Since TypeScript inherits static properties too, we have to
	        // fight against TypeScript here so Subject can have a different static create signature
	        /**
	         * Creates a new cold Observable by calling the Observable constructor
	         * @static true
	         * @owner Observable
	         * @method create
	         * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
	         * @return {Observable} a new cold observable
	         */
	        Observable.create = function (subscribe) {
	            return new Observable(subscribe);
	        };
	        return Observable;
	    }();
	    exports.Observable = Observable;
	    });

	var Observable$1 = interopDefault(Observable);
	var Observable$$1 = Observable.Observable;


	var require$$3 = Object.freeze({
	    default: Observable$1,
	    Observable: Observable$$1
	});

	var FromEventObservable = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var __extends = commonjsGlobal && commonjsGlobal.__extends || function (d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) d[p] = b[p];
	        }function __() {
	            this.constructor = d;
	        }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var Observable_1 = interopDefault(require$$3);
	    var tryCatch_1 = interopDefault(require$$2$1);
	    var isFunction_1 = interopDefault(require$$3$1);
	    var errorObject_1 = interopDefault(require$$0$3);
	    var Subscription_1 = interopDefault(require$$2);
	    function isNodeStyleEventEmmitter(sourceObj) {
	        return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
	    }
	    function isJQueryStyleEventEmitter(sourceObj) {
	        return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
	    }
	    function isNodeList(sourceObj) {
	        return !!sourceObj && sourceObj.toString() === '[object NodeList]';
	    }
	    function isHTMLCollection(sourceObj) {
	        return !!sourceObj && sourceObj.toString() === '[object HTMLCollection]';
	    }
	    function isEventTarget(sourceObj) {
	        return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
	    }
	    /**
	     * We need this JSDoc comment for affecting ESDoc.
	     * @extends {Ignored}
	     * @hide true
	     */
	    var FromEventObservable = function (_super) {
	        __extends(FromEventObservable, _super);
	        function FromEventObservable(sourceObj, eventName, selector, options) {
	            _super.call(this);
	            this.sourceObj = sourceObj;
	            this.eventName = eventName;
	            this.selector = selector;
	            this.options = options;
	        }
	        /* tslint:enable:max-line-length */
	        /**
	         * Creates an Observable that emits events of a specific type coming from the
	         * given event target.
	         *
	         * <span class="informal">Creates an Observable from DOM events, or Node
	         * EventEmitter events or others.</span>
	         *
	         * <img src="./img/fromEvent.png" width="100%">
	         *
	         * Creates an Observable by attaching an event listener to an "event target",
	         * which may be an object with `addEventListener` and `removeEventListener`,
	         * a Node.js EventEmitter, a jQuery style EventEmitter, a NodeList from the
	         * DOM, or an HTMLCollection from the DOM. The event handler is attached when
	         * the output Observable is subscribed, and removed when the Subscription is
	         * unsubscribed.
	         *
	         * @example <caption>Emits clicks happening on the DOM document</caption>
	         * var clicks = Rx.Observable.fromEvent(document, 'click');
	         * clicks.subscribe(x => console.log(x));
	         *
	         * @see {@link from}
	         * @see {@link fromEventPattern}
	         *
	         * @param {EventTargetLike} target The DOMElement, event target, Node.js
	         * EventEmitter, NodeList or HTMLCollection to attach the event handler to.
	         * @param {string} eventName The event name of interest, being emitted by the
	         * `target`.
	         * @parm {EventListenerOptions} [options] Options to pass through to addEventListener
	         * @param {SelectorMethodSignature<T>} [selector] An optional function to
	         * post-process results. It takes the arguments from the event handler and
	         * should return a single value.
	         * @return {Observable<T>}
	         * @static true
	         * @name fromEvent
	         * @owner Observable
	         */
	        FromEventObservable.create = function (target, eventName, options, selector) {
	            if (isFunction_1.isFunction(options)) {
	                selector = options;
	                options = undefined;
	            }
	            return new FromEventObservable(target, eventName, selector, options);
	        };
	        FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber, options) {
	            var unsubscribe;
	            if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
	                for (var i = 0, len = sourceObj.length; i < len; i++) {
	                    FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
	                }
	            } else if (isEventTarget(sourceObj)) {
	                var source_1 = sourceObj;
	                sourceObj.addEventListener(eventName, handler, options);
	                unsubscribe = function unsubscribe() {
	                    return source_1.removeEventListener(eventName, handler);
	                };
	            } else if (isJQueryStyleEventEmitter(sourceObj)) {
	                var source_2 = sourceObj;
	                sourceObj.on(eventName, handler);
	                unsubscribe = function unsubscribe() {
	                    return source_2.off(eventName, handler);
	                };
	            } else if (isNodeStyleEventEmmitter(sourceObj)) {
	                var source_3 = sourceObj;
	                sourceObj.addListener(eventName, handler);
	                unsubscribe = function unsubscribe() {
	                    return source_3.removeListener(eventName, handler);
	                };
	            }
	            subscriber.add(new Subscription_1.Subscription(unsubscribe));
	        };
	        FromEventObservable.prototype._subscribe = function (subscriber) {
	            var sourceObj = this.sourceObj;
	            var eventName = this.eventName;
	            var options = this.options;
	            var selector = this.selector;
	            var handler = selector ? function () {
	                var args = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    args[_i - 0] = arguments[_i];
	                }
	                var result = tryCatch_1.tryCatch(selector).apply(void 0, args);
	                if (result === errorObject_1.errorObject) {
	                    subscriber.error(errorObject_1.errorObject.e);
	                } else {
	                    subscriber.next(result);
	                }
	            } : function (e) {
	                return subscriber.next(e);
	            };
	            FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options);
	        };
	        return FromEventObservable;
	    }(Observable_1.Observable);
	    exports.FromEventObservable = FromEventObservable;
	    });

	var FromEventObservable$1 = interopDefault(FromEventObservable);
	var FromEventObservable$$1 = FromEventObservable.FromEventObservable;


	var require$$0 = Object.freeze({
	    default: FromEventObservable$1,
	    FromEventObservable: FromEventObservable$$1
	});

	var fromEvent = createCommonjsModule(function (module, exports) {
	  "use strict";

	  var FromEventObservable_1 = interopDefault(require$$0);
	  exports.fromEvent = FromEventObservable_1.FromEventObservable.create;
	  });

	interopDefault(fromEvent);
	var fromEvent$$1 = fromEvent.fromEvent;

	var OuterSubscriber = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var __extends = commonjsGlobal && commonjsGlobal.__extends || function (d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) d[p] = b[p];
	        }function __() {
	            this.constructor = d;
	        }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var Subscriber_1 = interopDefault(require$$0$2);
	    /**
	     * We need this JSDoc comment for affecting ESDoc.
	     * @ignore
	     * @extends {Ignored}
	     */
	    var OuterSubscriber = function (_super) {
	        __extends(OuterSubscriber, _super);
	        function OuterSubscriber() {
	            _super.apply(this, arguments);
	        }
	        OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	            this.destination.next(innerValue);
	        };
	        OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	            this.destination.error(error);
	        };
	        OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	            this.destination.complete();
	        };
	        return OuterSubscriber;
	    }(Subscriber_1.Subscriber);
	    exports.OuterSubscriber = OuterSubscriber;
	    });

	var OuterSubscriber$1 = interopDefault(OuterSubscriber);
	var OuterSubscriber$$1 = OuterSubscriber.OuterSubscriber;


	var require$$1$2 = Object.freeze({
	    default: OuterSubscriber$1,
	    OuterSubscriber: OuterSubscriber$$1
	});

	var isPromise = createCommonjsModule(function (module, exports) {
	    "use strict";

	    function isPromise(value) {
	        return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	    }
	    exports.isPromise = isPromise;
	    });

	var isPromise$1 = interopDefault(isPromise);
	var isPromise$$1 = isPromise.isPromise;


	var require$$4$1 = Object.freeze({
	    default: isPromise$1,
	    isPromise: isPromise$$1
	});

	var iterator = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var root_1 = interopDefault(require$$0$1);
	    var _Symbol = root_1.root.Symbol;
	    if (typeof _Symbol === 'function') {
	        if (_Symbol.iterator) {
	            exports.$$iterator = _Symbol.iterator;
	        } else if (typeof _Symbol.for === 'function') {
	            exports.$$iterator = _Symbol.for('iterator');
	        }
	    } else {
	        if (root_1.root.Set && typeof new root_1.root.Set()['@@iterator'] === 'function') {
	            // Bug for mozilla version
	            exports.$$iterator = '@@iterator';
	        } else if (root_1.root.Map) {
	            // es6-shim specific logic
	            var keys = Object.getOwnPropertyNames(root_1.root.Map.prototype);
	            for (var i = 0; i < keys.length; ++i) {
	                var key = keys[i];
	                if (key !== 'entries' && key !== 'size' && root_1.root.Map.prototype[key] === root_1.root.Map.prototype['entries']) {
	                    exports.$$iterator = key;
	                    break;
	                }
	            }
	        } else {
	            exports.$$iterator = '@@iterator';
	        }
	    }
	    });

	var iterator$1 = interopDefault(iterator);
	var $$iterator = iterator.$$iterator;

var require$$2$2 = Object.freeze({
	    default: iterator$1,
	    $$iterator: $$iterator
	});

	var InnerSubscriber = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var __extends = commonjsGlobal && commonjsGlobal.__extends || function (d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) d[p] = b[p];
	        }function __() {
	            this.constructor = d;
	        }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var Subscriber_1 = interopDefault(require$$0$2);
	    /**
	     * We need this JSDoc comment for affecting ESDoc.
	     * @ignore
	     * @extends {Ignored}
	     */
	    var InnerSubscriber = function (_super) {
	        __extends(InnerSubscriber, _super);
	        function InnerSubscriber(parent, outerValue, outerIndex) {
	            _super.call(this);
	            this.parent = parent;
	            this.outerValue = outerValue;
	            this.outerIndex = outerIndex;
	            this.index = 0;
	        }
	        InnerSubscriber.prototype._next = function (value) {
	            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	        };
	        InnerSubscriber.prototype._error = function (error) {
	            this.parent.notifyError(error, this);
	            this.unsubscribe();
	        };
	        InnerSubscriber.prototype._complete = function () {
	            this.parent.notifyComplete(this);
	            this.unsubscribe();
	        };
	        return InnerSubscriber;
	    }(Subscriber_1.Subscriber);
	    exports.InnerSubscriber = InnerSubscriber;
	    });

	var InnerSubscriber$1 = interopDefault(InnerSubscriber);
	var InnerSubscriber$$1 = InnerSubscriber.InnerSubscriber;


	var require$$1$3 = Object.freeze({
	    default: InnerSubscriber$1,
	    InnerSubscriber: InnerSubscriber$$1
	});

	var subscribeToResult = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var root_1 = interopDefault(require$$0$1);
	    var isArray_1 = interopDefault(require$$5);
	    var isPromise_1 = interopDefault(require$$4$1);
	    var Observable_1 = interopDefault(require$$3);
	    var iterator_1 = interopDefault(require$$2$2);
	    var InnerSubscriber_1 = interopDefault(require$$1$3);
	    var observable_1 = interopDefault(require$$0$6);
	    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
	        var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	        if (destination.closed) {
	            return null;
	        }
	        if (result instanceof Observable_1.Observable) {
	            if (result._isScalar) {
	                destination.next(result.value);
	                destination.complete();
	                return null;
	            } else {
	                return result.subscribe(destination);
	            }
	        }
	        if (isArray_1.isArray(result)) {
	            for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
	                destination.next(result[i]);
	            }
	            if (!destination.closed) {
	                destination.complete();
	            }
	        } else if (isPromise_1.isPromise(result)) {
	            result.then(function (value) {
	                if (!destination.closed) {
	                    destination.next(value);
	                    destination.complete();
	                }
	            }, function (err) {
	                return destination.error(err);
	            }).then(null, function (err) {
	                // Escaping the Promise trap: globally throw unhandled errors
	                root_1.root.setTimeout(function () {
	                    throw err;
	                });
	            });
	            return destination;
	        } else if (typeof result[iterator_1.$$iterator] === 'function') {
	            var iterator = result[iterator_1.$$iterator]();
	            do {
	                var item = iterator.next();
	                if (item.done) {
	                    destination.complete();
	                    break;
	                }
	                destination.next(item.value);
	                if (destination.closed) {
	                    break;
	                }
	            } while (true);
	        } else if (typeof result[observable_1.$$observable] === 'function') {
	            var obs = result[observable_1.$$observable]();
	            if (typeof obs.subscribe !== 'function') {
	                destination.error(new Error('invalid observable'));
	            } else {
	                return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
	            }
	        } else {
	            destination.error(new TypeError('unknown type returned'));
	        }
	        return null;
	    }
	    exports.subscribeToResult = subscribeToResult;
	    });

	var subscribeToResult$1 = interopDefault(subscribeToResult);
	var subscribeToResult$$1 = subscribeToResult.subscribeToResult;


	var require$$0$7 = Object.freeze({
	    default: subscribeToResult$1,
	    subscribeToResult: subscribeToResult$$1
	});

	var debounce$1 = createCommonjsModule(function (module, exports) {
	    "use strict";

	    var __extends = commonjsGlobal && commonjsGlobal.__extends || function (d, b) {
	        for (var p in b) {
	            if (b.hasOwnProperty(p)) d[p] = b[p];
	        }function __() {
	            this.constructor = d;
	        }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	    var OuterSubscriber_1 = interopDefault(require$$1$2);
	    var subscribeToResult_1 = interopDefault(require$$0$7);
	    /**
	     * Emits a value from the source Observable only after a particular time span
	     * determined by another Observable has passed without another source emission.
	     *
	     * <span class="informal">It's like {@link debounceTime}, but the time span of
	     * emission silence is determined by a second Observable.</span>
	     *
	     * <img src="./img/debounce.png" width="100%">
	     *
	     * `debounce` delays values emitted by the source Observable, but drops previous
	     * pending delayed emissions if a new value arrives on the source Observable.
	     * This operator keeps track of the most recent value from the source
	     * Observable, and spawns a duration Observable by calling the
	     * `durationSelector` function. The value is emitted only when the duration
	     * Observable emits a value or completes, and if no other value was emitted on
	     * the source Observable since the duration Observable was spawned. If a new
	     * value appears before the duration Observable emits, the previous value will
	     * be dropped and will not be emitted on the output Observable.
	     *
	     * Like {@link debounceTime}, this is a rate-limiting operator, and also a
	     * delay-like operator since output emissions do not necessarily occur at the
	     * same time as they did on the source Observable.
	     *
	     * @example <caption>Emit the most recent click after a burst of clicks</caption>
	     * var clicks = Rx.Observable.fromEvent(document, 'click');
	     * var result = clicks.debounce(() => Rx.Observable.interval(1000));
	     * result.subscribe(x => console.log(x));
	     *
	     * @see {@link audit}
	     * @see {@link debounceTime}
	     * @see {@link delayWhen}
	     * @see {@link throttle}
	     *
	     * @param {function(value: T): Observable|Promise} durationSelector A function
	     * that receives a value from the source Observable, for computing the timeout
	     * duration for each source value, returned as an Observable or a Promise.
	     * @return {Observable} An Observable that delays the emissions of the source
	     * Observable by the specified duration Observable returned by
	     * `durationSelector`, and may drop some values if they occur too frequently.
	     * @method debounce
	     * @owner Observable
	     */
	    function debounce(durationSelector) {
	        return this.lift(new DebounceOperator(durationSelector));
	    }
	    exports.debounce = debounce;
	    var DebounceOperator = function () {
	        function DebounceOperator(durationSelector) {
	            this.durationSelector = durationSelector;
	        }
	        DebounceOperator.prototype.call = function (subscriber, source) {
	            return source._subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
	        };
	        return DebounceOperator;
	    }();
	    /**
	     * We need this JSDoc comment for affecting ESDoc.
	     * @ignore
	     * @extends {Ignored}
	     */
	    var DebounceSubscriber = function (_super) {
	        __extends(DebounceSubscriber, _super);
	        function DebounceSubscriber(destination, durationSelector) {
	            _super.call(this, destination);
	            this.durationSelector = durationSelector;
	            this.hasValue = false;
	            this.durationSubscription = null;
	        }
	        DebounceSubscriber.prototype._next = function (value) {
	            try {
	                var result = this.durationSelector.call(this, value);
	                if (result) {
	                    this._tryNext(value, result);
	                }
	            } catch (err) {
	                this.destination.error(err);
	            }
	        };
	        DebounceSubscriber.prototype._complete = function () {
	            this.emitValue();
	            this.destination.complete();
	        };
	        DebounceSubscriber.prototype._tryNext = function (value, duration) {
	            var subscription = this.durationSubscription;
	            this.value = value;
	            this.hasValue = true;
	            if (subscription) {
	                subscription.unsubscribe();
	                this.remove(subscription);
	            }
	            subscription = subscribeToResult_1.subscribeToResult(this, duration);
	            if (!subscription.closed) {
	                this.add(this.durationSubscription = subscription);
	            }
	        };
	        DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	            this.emitValue();
	        };
	        DebounceSubscriber.prototype.notifyComplete = function () {
	            this.emitValue();
	        };
	        DebounceSubscriber.prototype.emitValue = function () {
	            if (this.hasValue) {
	                var value = this.value;
	                var subscription = this.durationSubscription;
	                if (subscription) {
	                    this.durationSubscription = null;
	                    subscription.unsubscribe();
	                    this.remove(subscription);
	                }
	                this.value = null;
	                this.hasValue = false;
	                _super.prototype._next.call(this, value);
	            }
	        };
	        return DebounceSubscriber;
	    }(OuterSubscriber_1.OuterSubscriber);
	    });

	interopDefault(debounce$1);
	var debounce$$1 = debounce$1.debounce;

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

	function empty$2() {
	  return [];
	}

	function selectorAll (selector) {
	  return selector == null ? empty$2 : function () {
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

	var root$2 = [null];

	function Selection(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection([[document.documentElement]], root$2);
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

	function select (selector) {
	    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root$2);
	}

	function ascending$1 (a, b) {
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
	    return ascending$1(f(d), x);
	  };
	}

	var ascendingBisect = bisector(ascending$1);

	var pi = Math.PI;
	var tau = 2 * pi;
	var epsilon = 1e-6;
	var tauEpsilon = tau - epsilon;
	function Path() {
	  this._x0 = this._y0 = // start of current subpath
	  this._x1 = this._y1 = null; // end of current subpath
	  this._ = [];
	}

	function path() {
	  return new Path();
	}

	Path.prototype = path.prototype = {
	  constructor: Path,
	  moveTo: function moveTo(x, y) {
	    this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y);
	  },
	  closePath: function closePath() {
	    if (this._x1 !== null) {
	      this._x1 = this._x0, this._y1 = this._y0;
	      this._.push("Z");
	    }
	  },
	  lineTo: function lineTo(x, y) {
	    this._.push("L", this._x1 = +x, ",", this._y1 = +y);
	  },
	  quadraticCurveTo: function quadraticCurveTo(x1, y1, x, y) {
	    this._.push("Q", +x1, ",", +y1, ",", this._x1 = +x, ",", this._y1 = +y);
	  },
	  bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
	    this._.push("C", +x1, ",", +y1, ",", +x2, ",", +y2, ",", this._x1 = +x, ",", this._y1 = +y);
	  },
	  arcTo: function arcTo(x1, y1, x2, y2, r) {
	    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
	    var x0 = this._x1,
	        y0 = this._y1,
	        x21 = x2 - x1,
	        y21 = y2 - y1,
	        x01 = x0 - x1,
	        y01 = y0 - y1,
	        l01_2 = x01 * x01 + y01 * y01;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x1,y1).
	    if (this._x1 === null) {
	      this._.push("M", this._x1 = x1, ",", this._y1 = y1);
	    }

	    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
	    else if (!(l01_2 > epsilon)) {}

	      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
	      // Equivalently, is (x1,y1) coincident with (x2,y2)?
	      // Or, is the radius zero? Line to (x1,y1).
	      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
	          this._.push("L", this._x1 = x1, ",", this._y1 = y1);
	        }

	        // Otherwise, draw an arc!
	        else {
	            var x20 = x2 - x0,
	                y20 = y2 - y0,
	                l21_2 = x21 * x21 + y21 * y21,
	                l20_2 = x20 * x20 + y20 * y20,
	                l21 = Math.sqrt(l21_2),
	                l01 = Math.sqrt(l01_2),
	                l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
	                t01 = l / l01,
	                t21 = l / l21;

	            // If the start tangent is not coincident with (x0,y0), line to.
	            if (Math.abs(t01 - 1) > epsilon) {
	              this._.push("L", x1 + t01 * x01, ",", y1 + t01 * y01);
	            }

	            this._.push("A", r, ",", r, ",0,0,", +(y01 * x20 > x01 * y20), ",", this._x1 = x1 + t21 * x21, ",", this._y1 = y1 + t21 * y21);
	          }
	  },
	  arc: function arc(x, y, r, a0, a1, ccw) {
	    x = +x, y = +y, r = +r;
	    var dx = r * Math.cos(a0),
	        dy = r * Math.sin(a0),
	        x0 = x + dx,
	        y0 = y + dy,
	        cw = 1 ^ ccw,
	        da = ccw ? a0 - a1 : a1 - a0;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x0,y0).
	    if (this._x1 === null) {
	      this._.push("M", x0, ",", y0);
	    }

	    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
	    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
	        this._.push("L", x0, ",", y0);
	      }

	    // Is this arc empty? We’re done.
	    if (!r) return;

	    // Is this a complete circle? Draw two arcs to complete the circle.
	    if (da > tauEpsilon) {
	      this._.push("A", r, ",", r, ",0,1,", cw, ",", x - dx, ",", y - dy, "A", r, ",", r, ",0,1,", cw, ",", this._x1 = x0, ",", this._y1 = y0);
	    }

	    // Otherwise, draw an arc!
	    else {
	        if (da < 0) da = da % tau + tau;
	        this._.push("A", r, ",", r, ",0,", +(da >= pi), ",", cw, ",", this._x1 = x + r * Math.cos(a1), ",", this._y1 = y + r * Math.sin(a1));
	      }
	  },
	  rect: function rect(x, y, w, h) {
	    this._.push("M", this._x0 = this._x1 = +x, ",", this._y0 = this._y1 = +y, "h", +w, "v", +h, "h", -w, "Z");
	  },
	  toString: function toString() {
	    return this._.join("");
	  }
	};

	function constant$2 (x) {
	  return function constant() {
	    return x;
	  };
	}

	var epsilon$1 = 1e-12;

	function Linear(context) {
	  this._context = context;
	}

	Linear.prototype = {
	  areaStart: function areaStart() {
	    this._line = 0;
	  },
	  areaEnd: function areaEnd() {
	    this._line = NaN;
	  },
	  lineStart: function lineStart() {
	    this._point = 0;
	  },
	  lineEnd: function lineEnd() {
	    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function point(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0:
	        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
	      case 1:
	        this._point = 2; // proceed
	      default:
	        this._context.lineTo(x, y);break;
	    }
	  }
	};

	function curveLinear (context) {
	  return new Linear(context);
	}

	function x(p) {
	  return p[0];
	}

	function y(p) {
	  return p[1];
	}

	function line () {
	  var x$$ = x,
	      y$$ = y,
	      defined = constant$2(true),
	      context = null,
	      curve = curveLinear,
	      output = null;

	  function line(data) {
	    var i,
	        n = data.length,
	        d,
	        defined0 = false,
	        buffer;

	    if (context == null) output = curve(buffer = path());

	    for (i = 0; i <= n; ++i) {
	      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
	        if (defined0 = !defined0) output.lineStart();else output.lineEnd();
	      }
	      if (defined0) output.point(+x$$(d, i, data), +y$$(d, i, data));
	    }

	    if (buffer) return output = null, buffer + "" || null;
	  }

	  line.x = function (_) {
	    return arguments.length ? (x$$ = typeof _ === "function" ? _ : constant$2(+_), line) : x$$;
	  };

	  line.y = function (_) {
	    return arguments.length ? (y$$ = typeof _ === "function" ? _ : constant$2(+_), line) : y$$;
	  };

	  line.defined = function (_) {
	    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), line) : defined;
	  };

	  line.curve = function (_) {
	    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
	  };

	  line.context = function (_) {
	    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
	  };

	  return line;
	}

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

	var cmb = interopDefault(combinatorics);

	var sym = Symbol();

	var css = '\npath {stroke: #0f0; stroke-width:2px;fill:none}\nsvg {\n  width: 97%;\n  height: 97%;\n  position: absolute;\n}\n';

	var drawEdge = line().x(function (d) {
	  return d.offsetLeft;
	}).y(function (d) {
	  return d.offsetTop;
	});

	var shadowSVGSelector = function shadowSVGSelector(elem) {
	  var sdw = elem.shadowRoot;
	  if (sdw) {
	    return select(sdw.querySelector("svg"));
	  } else {
	    return select();
	  }
	};

	var updateEdgeSegments = function updateEdgeSegments(elem) {
	  console.log(shadowSVGSelector(elem));
	  console.log(select(elem.shadowRoot.querySelector("svg")));
	  shadowSVGSelector(elem).selectAll("path").attr("d", drawEdge);
	};

	var updateNodes = function updateNodes(elem) {
	  var nodes = select(elem).selectAll("*").nodes();

	  nodes.forEach(function (node) {
	    var positionChanges = fromEvent$$1(node, "moved");
	    var observer = new MutationObserver(function () {
	      elem.dispatch(new Event('moved'));
	    });
	    observer.observe(node, {
	      attributes: true,
	      attributeFilter: ['offsetLeft', 'offsetTop']
	    });
	    positionChanges.debounce(500).subscribe(updateEdgeSegments(node));
	  });
	  if (nodes.length < 2) {
	    return;
	  }
	  var pairs = cmb.combination(nodes, 2).toArray();
	  var edgeLines = shadowSVGSelector(elem).selectAll("path").data(pairs);
	  // console.log(edgeLines)
	  // console.log(pairs)
	  edgeLines.exit().remove();
	  edgeLines.enter().append("path");
	  updateEdgeSegments(elem);
	};

	define$1('graph-viewer', {
	  props: {
	    count: number({ attribute: true })
	  },
	  attached: function attached(elem) {
	    elem.updateNodes = updateNodes;
	    elem.updateEdgeSegments = updateEdgeSegments;
	    // elem[sym] = setInterval(() => ++elem.count, 1000);
	    // elem.graphNodes = () => {
	    //   console.log(elem[mainSlot]);
	    //   elem[mainSlot].assignedNodes()}
	  },
	  detached: function detached(elem) {
	    clearInterval(elem[sym]);
	  },
	  render: function render(elem) {
	    // console.log("ready")
	    // console.log(elem[skate.symbols.shadowRoot]);
	    // console.log(select(elem[skate.symbols.shadowRoot]))
	    // console.log(select(elem[skate.symbols.shadowRoot]).select("slot"))
	    updateEdgeSegments(elem);
	    return [h('svg', { id: "abc" }), h('slot', {
	      onSlotchange: function onSlotchange(e) {
	        updateNodes(elem);console.log("slot change", e);
	      }
	    }), h("style", css)];
	  }
	});

	define$1("puppy-dog", {
	  render: function render() {
	    return h("img", {
	      src: "http://i.imgur.com/B2YwP9u.gif",
	      style: "height: 100px; border: solid limegreen 4px;"
	    });
	  }
	});

}());