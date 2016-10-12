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
	var MutationObserver = _window$2.MutationObserver;


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
	  var observer = new MutationObserver(function () {
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

	function define (name, opts) {
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

	var Event = function (TheEvent) {
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

	var sym = Symbol();

	var graphViewer = {
	  props: {
	    // By declaring the property an attribute, we can now pass an initial value
	    // for the count as part of the HTML.
	    count: number({ attribute: true })
	  },
	  attached: function attached(elem) {
	    // We use a symbol so we don't pollute the element's namespace.
	    elem[sym] = setInterval(function () {
	      return ++elem.count;
	    }, 1000);
	  },
	  detached: function detached(elem) {
	    // If we didn't clean up after ourselves, we'd continue to render
	    // unnecessarily.
	    clearInterval(elem[sym]);
	  }
	};

	// export {graphViewer};
	// this.mixin(Animate);
	// const name = 'nodes';
	// var self = this;
	//
	// var drawEdge = line()
	//     .x( (d) => d.offsetLeft )
	//     .y( (d) => d.offsetTop );
	//
	// self.updateEdges = function(doms){
	//   var nodes = select(self.nodes).selectAll('*').nodes()
	//   console.log(nodes)
	//   var pairs = cmb.combination(nodes,2).toArray()
	//   var edgeLines = select(self.root).select("svg").selectAll("path")
	//       .data(pairs)
	//   edgeLines.exit().remove();
	//   edgeLines.enter().append("path");
	// }
	//
	// self.updateEdgeSegments = function(){
	//   select(self.root).select("svg").selectAll("path")
	//       .attr("d",drawEdge)
	// }
	//
	// this.on('mount',()=>{
	//   self.updateEdges()
	//   this.on('animate',self.updateEdgeSegments)
	// });
	//

	define('graph-viewer', graphViewer);

}());