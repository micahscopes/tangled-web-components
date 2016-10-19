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
	  var element = document.documentElement;
	  if (!element.matches) {
	    var vendorMatches = element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
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
	  var element$1 = document.documentElement;
	  if (!("onmouseenter" in element$1)) {
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

	function empty() {
	  return [];
	}

	function selectorAll (selector) {
	  return selector == null ? empty : function () {
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

	function select (selector) {
	    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
	}

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

	function constant$1 (x) {
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
	      defined = constant$1(true),
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
	    return arguments.length ? (x$$ = typeof _ === "function" ? _ : constant$1(+_), line) : x$$;
	  };

	  line.y = function (_) {
	    return arguments.length ? (y$$ = typeof _ === "function" ? _ : constant$1(+_), line) : y$$;
	  };

	  line.defined = function (_) {
	    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$1(!!_), line) : defined;
	  };

	  line.curve = function (_) {
	    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
	  };

	  line.context = function (_) {
	    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
	  };

	  return line;
	}

	function noop () {}

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
	  areaStart: noop,
	  areaEnd: noop,
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
	  areaStart: noop,
	  areaEnd: noop,
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

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function interopDefault(ex) {
		return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

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

	function empty$1 (val) {
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
	var $shadowRoot = '____skate_shadowRoot';
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
	var symbols$1 = incrementalDomCjs.symbols;
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

	var applyDefault = attributes[symbols$1.default];
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

	var noop$1 = function noop() {};

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
	  key: noop$1,
	  statics: noop$1,

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
	}, symbols$1.default, function (elem, name, value) {
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
	  var tnameFuncHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop$1;

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
	function element$2(tname, attrs) {
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

	      return element$2.bind.apply(element$2, [null].concat(args));
	    };
	  }
	  return tags.map(function (tag) {
	    return function () {
	      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
	        args[_key8] = arguments[_key8];
	      }

	      return element$2.bind.apply(element$2, [null, tag].concat(args));
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
	  if (empty$1(syncAttrValue)) {
	    if ('initial' in prop) {
	      syncAttrValue = getInitialValue(elem, propName, prop);
	    } else if ('default' in prop) {
	      syncAttrValue = getDefaultValue(elem, propName, prop);
	    }
	  }
	  if (!empty$1(syncAttrValue) && prop.serialize) {
	    syncAttrValue = prop.serialize(syncAttrValue);
	  }
	  if (!empty$1(syncAttrValue)) {
	    propData.syncingAttribute = true;
	    elem.setAttribute(attributeName, syncAttrValue);
	  }
	}

	function syncExistingProp(elem, prop, propName, attributeName, propData) {
	  if (attributeName && !propData.settingAttribute) {
	    var internalValue = propData.internalValue;

	    var serializedValue = prop.serialize(internalValue);
	    var currentAttrValue = elem.getAttribute(attributeName);
	    var serializedIsEmpty = empty$1(serializedValue);
	    var attributeChanged = !(serializedIsEmpty && empty$1(currentAttrValue) || serializedValue === currentAttrValue);

	    propData.syncingAttribute = true;

	    var shouldRemoveAttribute = empty$1(propData.lastAssignedValue);
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
	    if (empty$1(initialValue)) {
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


	    if (empty$1(oldValue)) {
	      oldValue = null;
	    }

	    if (empty$1(newValue)) {
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

	var css = "\npath {\n  stroke: var(--color,#0f0);\n  stroke-width: var(--thickness,4px);\n  fill:none\n}\nsvg {\n  width: 97%;\n  height: 97%;\n  position: absolute;\n  z-index: -1;\n}\n";
	var svgEdge = line().x(function (d) {
	  return d.offsetLeft + d.offsetWidth / 2;
	}).y(function (d) {
	  return d.offsetTop + d.offsetHeight / 2;
	});

	var shadowSVGSelector = function shadowSVGSelector(elem) {
	  var sdw = elem.shadowRoot;
	  if (sdw) {
	    return select(sdw.querySelector("svg"));
	  } else {
	    return select();
	  }
	};

	var edges = Symbol();
	var animateCallback = Symbol();
	var graphEdgesPoly = {
	  redraw: function redraw(elem) {
	    var edgeLines = shadowSVGSelector(elem).selectAll("path").data(elem[edges]);
	    edgeLines.exit().remove();
	    edgeLines.enter().append("path");
	    edgeLines.attr("d", svgEdge);
	  },
	  edges: function edges(elem) {
	    var nodes = select(elem.parentElement).selectAll("*").filter(function (d, i, nodes) {
	      return !nodes[i].edges;
	    }).nodes();
	    if (nodes.length < 2) {
	      return [];
	    }
	    return cmb.combination(nodes, 2).toArray();
	  },

	  props: {
	    nodeContainer: { attribute: true }
	  },
	  attached: function attached(elem) {
	    var _this = this;

	    elem.edges = function () {
	      return elem[edges];
	    };
	    elem[edges] = this.edges(elem);
	    elem[animateCallback] = function () {
	      _this.redraw(elem);
	    };
	    elem.parentElement.addEventListener('animate', elem[animateCallback]);
	  },
	  detached: function detached(elem) {
	    console.log("detached", elem);
	    elem.parentElement.removeEventListener('animate', elem[animateCallback]);
	  },
	  attributeChanged: function attributeChanged(elem) {
	    elem[edges] = this.edges(elem);
	  },
	  render: function render(elem) {
	    var _this2 = this;

	    return [h('svg', { id: "abc" }), h('slot', {
	      onSlotchange: function onSlotchange(e) {
	        _this2.attributeChanged(elem); /* console.log("slot change",e) */
	      }
	    }), h("style", css)];
	  }
	};

	define$1('edges-all-pairs', graphEdgesPoly);

	var animate = function animate(elem) {
	  elem.dispatchEvent(new Event('animate'));
	  setTimeout(function () {
	    window.requestAnimationFrame(function () {
	      animate(elem);
	    });
	  }, 1000 / elem.fps);
	};

	define$1('graph-container', {
	  props: {
	    fps: { attribute: true, default: 120 }
	  },
	  attached: function attached(elem) {
	    animate(elem);
	  },
	  attributeChanged: function attributeChanged(elem) {},
	  render: function render(elem) {
	    return [h('slot', {}), h("style", css)];
	  }
	});

	var kefir = createCommonjsModule(function (module, exports) {
		/*! Kefir.js v3.5.2
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
				dispatch: function dispatch(event) {
					this._inLoop++;
					for (var i = 0, items = this._items; i < items.length; i++) {

						// cleanup was called
						if (this._items === null) {
							break;
						}

						// this subscriber was removed
						if (this._removedItems !== null && contains(this._removedItems, items[i])) {
							continue;
						}

						callSubscriber(items[i].type, items[i].fn, event);
					}
					this._inLoop--;
					if (this._inLoop === 0) {
						this._removedItems = null;
					}
				},
				cleanup: function cleanup() {
					this._items = null;
				}
			});

			function Observable() {
				this._dispatcher = new Dispatcher();
				this._active = false;
				this._alive = true;
				this._activating = false;
				this._logHandlers = null;
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
	  return {
	    x: nextEvent.clientX - prevEvent.clientX,
	    y: nextEvent.clientY - prevEvent.clientY
	  };
	}

	function applyMove(currentPosition, move) {
	  return {
	    x: currentPosition.x + move.x,
	    y: currentPosition.y + move.y
	  };
	}
	var preventDefault = function preventDefault(event) {
	  event.preventDefault();
	};
	function startDragging(elem) {
	  elem.style.cursor = 'move';
	  elem.style.userSelect = 'none';

	  var drag = function drag(pos) {
	    elem.style.top = pos.y + 'px';
	    elem.style.left = pos.x + 'px';
	  };

	  var mouseUps = Kefir.fromEvents(document, 'mouseup');
	  var mouseMoves = Kefir.fromEvents(document, 'mousemove');
	  var mouseDowns = Kefir.fromEvents(elem, 'mousedown');
	  mouseDowns.onValue(preventDefault);

	  var moves = mouseDowns.flatMap(function (downEvent) {
	    return mouseMoves.takeUntilBy(mouseUps).diff(eventsPositionDiff, downEvent);
	  });

	  var position = moves.scan(applyMove, { x: 0, y: 0 });
	  position.onValue(drag);

	  elem[stopDragging] = function () {
	    elem.style.cursor = 'default';
	    elem.style.userSelect = 'default';
	    position.offValue(drag);
	    mouseDowns.offValue(preventDefault);
	  };
	}

	function stopDragging(elem) {
	  elem[stopDragging]();
	}

	var puppyStyle = '\n  :host {\n    display: inline-block;\n    background-image: url(http://i.imgur.com/B2YwP9u.gif);\n    background-position: center;\n    background-size: 100%;\n    margin: 0;\n    padding: 0;\n    width: 100px;\n    height: 150px;\n    border: solid deeppink 5px;\n  }\n';
	define$1("puppy-dog", {
	  attached: function attached(elem) {
	    startDragging(elem);
	  },
	  detached: function detached(elem) {
	    stopDragging(elem);
	  },
	  render: function render(elem) {
	    return h("style", puppyStyle);
	  },
	  rendered: function rendered(elem) {}
	});

}());