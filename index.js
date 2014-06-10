/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  var definition = module.definition;
  if (definition) {
    delete module.definition;
    definition.call(this, module.exports = {}, module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/separate-selector.js", function (exports, module) {
module.exports = function(selector){
  return selector.split(/\s*,\s*/);
};

})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/scope/index.js", function (exports, module) {
var separateSelector = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/separate-selector.js");

module.exports = function(selector, method){
  var selectors = separateSelector(selector);
  var scopedSelectors = selectors.map(method);
  return scopedSelectors.join();
};

// normalize:common:info: rewriting dependency "../utils/separate-selector" to "../utils/separate-selector.js"


})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/scope/support.js", function (exports, module) {
try {
  document.createElement('i').querySelector(':scoped *');
  module.exports = true;
} catch (e) {
  module.exports = false;
}

})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/elements/index.js", function (exports, module) {
// as it is a circular dependency, we need to keep `module.exports` on top.
module.exports = Elements;

var pushUniq = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/pushuniq.js");
var elementsPrototype = Elements.prototype = [];
var methods = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/index.js");

function Elements() {}

// Elements.queryAll(selector);
elementsPrototype.queryAll = function (selector) {
  var pusher = pushUniq();
  return this.reduce(function(results, element){
    return pusher(methods.queryAll.call(element, selector));
  }, null);
};

// Elements.query(selector);
elementsPrototype.query = function (selector) {
  return elementsPrototype.queryAll.call(this, selector)[0] || null;
};

// normalize:common:info: rewriting dependency "../utils/pushuniq" to "../utils/pushuniq.js"
// normalize:common:info: rewriting dependency "../methods" to "../methods/index.js"


})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/expando.js", function (exports, module) {
module.exports = String(Math.random()).replace(/\D/g, '');

})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/pushuniq.js", function (exports, module) {
var Elements = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/elements/index.js");
var expando = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/expando.js");
var propertyName = 'domElementsId' + expando;
var id = -1;

/**
 * pushUniq
 *
 * returns a function that pushes elements not yet in `target`.
 * as the internal API only uses it before making the array
 * available, we can use a `map` cache to store the elements
 * already in the newly built array, letting us prevent extensive looping.
 */
module.exports = function (original) {
  var target = new Elements();
  var map = {};

  function pusher(source) {
    var index = -1;
    var length = source.length;
    var item;
    while (++index < length) {
      item = source[index];
      if (!item || item.nodeType !== 1) {
        continue;
      }
      if (propertyName in item && map.hasOwnProperty(item[propertyName])) {
        continue;
      }
      item[propertyName] = ++id;
      map[id] = 1;
      target.push(item);
    }
    return target;
  }

  if(arguments.length) {
    pusher(original);
  }

  return pusher;
};

// normalize:common:info: rewriting dependency "../elements" to "../elements/index.js"
// normalize:common:info: rewriting dependency "./expando" to "./expando.js"


})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/index.js", function (exports, module) {
var scope = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/scope/index.js");
var supportsScoped = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/scope/support.js");
var methods = module.exports = {};
var Elements = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/elements/index.js");
var toArray = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/to-array.js");
var attributeName = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/attribute-name.js");
var scopeSelector = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/scope-selector.js");
var absolutizeSelector = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/absolutize-selector.js");
var unique = -1;

methods.query = function(selector){
  return methods.queryAll.call(this, selector)[0] || null;
};

methods.queryAll = function(sourceSelector){
  var element = this;
  var elements;
  var selector;
  var result;
  if(!supportsScoped) {
    element.setAttribute(attributeName, ++unique);
  }
  selector = supportsScoped ?
    scope(sourceSelector, scopeSelector) :
    scope(sourceSelector, absolutizeSelector(unique));
  elements = element.querySelectorAll(selector);
  if (!supportsScoped) {
    element.removeAttribute(attributeName);
  }
  result = new Elements();
  result.push.apply(result, toArray(elements));
  return result;
};

methods.queryAllWrapper = function(selector){
  var elements = this.querySelectorAll(selector);
  var result = new Elements();
  result.push.apply(result, toArray(elements));
  return result;
};

methods.queryWrapper = function(selector){
  return this.querySelector(selector);
};

// normalize:common:info: rewriting dependency "../scope" to "../scope/index.js"
// normalize:common:info: rewriting dependency "../scope/support" to "../scope/support.js"
// normalize:common:info: rewriting dependency "../elements" to "../elements/index.js"
// normalize:common:info: rewriting dependency "../utils/to-array" to "../utils/to-array.js"
// normalize:common:info: rewriting dependency "./attribute-name" to "./attribute-name.js"
// normalize:common:info: rewriting dependency "./scope-selector" to "./scope-selector.js"
// normalize:common:info: rewriting dependency "./absolutize-selector" to "./absolutize-selector.js"


})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/to-array.js", function (exports, module) {
module.exports = function(nodeList){
  var index = -1;
  var length = nodeList.length;
  var array = Array(length);
  while (++index < length) {
    array[index] = nodeList[index];
  }
  return array;
};

})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/attribute-name.js", function (exports, module) {
module.exports = 'data-dom-elements-id-' + require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/expando.js");

// normalize:common:info: rewriting dependency "../utils/expando" to "../utils/expando.js"


})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/scope-selector.js", function (exports, module) {
module.exports = function (item) {
  return ':scoped ' + item;
};

})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/absolutize-selector.js", function (exports, module) {
var attributeName = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/attribute-name.js");

module.exports = function (attributeValue) {
  return function (item){
    return '[' + attributeName + '="' + attributeValue + '"] ' + item;
  };
};

// normalize:common:info: rewriting dependency "./attribute-name" to "./attribute-name.js"


})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/is-native.js", function (exports, module) {
var nativeToString = Function.prototype.toString;
var nativeQuerySelector = nativeToString.call(document.querySelector);
var nameRE = /\bquerySelector\b/g;

module.exports = function(context, name){
  if (!context[name]) {
    return false;
  }
  return (
    nativeToString.call(context[name]) ===
    nativeQuerySelector.replace(nameRE, name)
  );
};

})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/index.js", function (exports, module) {
var methods = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/methods/index.js");
var isNative = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/is-native.js");
var array = [];

if (
  typeof Document === 'undefined' ||
  !('map' in array) ||
  !('reduce' in array) ||
  !('querySelectorAll' in document)
) {
  throw new TypeError('Missing browser features to initiantiate dom-elements');
}

if('Element' in window) {
  if(!isNative(Element.prototype, 'query')) {
    Element.prototype.query = methods.query;
  }
  if(!isNative(Element.prototype, 'queryAll')) {
    Element.prototype.queryAll = methods.queryAll;
  }
}


['Document', 'DocumentFragment'].forEach(function (ParentNode) {
  var prototype;
  // Don't throw errors if these globals don't exist — just move on.
  if (!(ParentNode in window)) {
    return;
  }
  prototype = window[ParentNode].prototype;
  if (!isNative(prototype, 'query')) {
    prototype.query = methods.queryWrapper;
  }
  if (!isNative(prototype, 'queryAll')) {
    prototype.queryAll = methods.queryAllWrapper;
  }
});

// normalize:common:info: rewriting dependency "./methods" to "./methods/index.js"
// normalize:common:info: rewriting dependency "./utils/is-native" to "./utils/is-native.js"


})

require.register("https://nlz.io/github/barberboy/dom-elements/0.1.0/index.js", function (exports, module) {
module.exports = require("https://nlz.io/github/barberboy/dom-elements/0.1.0/src/index.js")
})

require.register("https://nlz.io/github/webreflection/dom4/1.0.1/build/dom4.js", function (exports, module) {
/*! (C) WebReflection Mit Style License */
(function(e){"use strict";function t(t){return typeof t=="string"?e.document.createTextNode(t):t}function n(n){if(n.length===1)return t(n[0]);for(var r=e.document.createDocumentFragment(),i=v.call(n),s=0;s<n.length;s++)r.appendChild(t(i[s]));return r}for(var r=Object.defineProperty||function(e,t,n){e.__defineGetter__(t,n.get)},i=[].indexOf||function(t){var n=this.length;while(n--)if(this[n]===t)break;return n},s,o,u,a,f=/^\s+|\s+$/g,l=/\s+/,c=" ",h=function(t,n){if(this.contains(t))n||this.remove(t);else if(n===undefined||n)n=!0,this.add(t);return!!n},p=(e.Element||e.Node||e.HTMLElement).prototype,d=["matches",p.matchesSelector||p.webkitMatchesSelector||p.khtmlMatchesSelector||p.mozMatchesSelector||p.msMatchesSelector||p.oMatchesSelector||function(t){var n=this.parentNode;return!!n&&-1<i.call(n.querySelectorAll(t),this)},"prepend",function(){var t=this.firstChild,r=n(arguments);t?this.insertBefore(r,t):this.appendChild(r)},"append",function(){this.appendChild(n(arguments))},"before",function(){var t=this.parentNode;t&&t.insertBefore(n(arguments),this)},"after",function(){var t=this.parentNode,r=this.nextSibling,i=n(arguments);t&&(r?t.insertBefore(i,r):t.appendChild(i))},"replace",function(){var t=this.parentNode;t&&t.replaceChild(n(arguments),this)},"remove",function(){var t=this.parentNode;t&&t.removeChild(this)}],v=d.slice,m=d.length;m;m-=2)o=d[m-2],o in p||(p[o]=d[m-1]);"classList"in document.documentElement?(a=document.createElement("div").classList,a.add("a","b","a"),"a b"!=a&&(p=a.constructor.prototype,"add"in p||(p=e.DOMTokenList.prototype),u=function(e){return function(){var t=0;while(t<arguments.length)e.call(this,arguments[t++])}},p.add=u(p.add),p.remove=u(p.remove),p.toggle=h)):(u=function(e){if(!e)throw"SyntaxError";if(l.test(e))throw"InvalidCharacterError";return e},a=function(e){var t=e.className.replace(f,"");t.length&&d.push.apply(this,t.split(l)),this._=e},a.prototype={length:0,add:function(){for(var t=0,n;t<arguments.length;t++)n=arguments[t],this.contains(n)||d.push.call(this,o);this._.className=""+this},contains:function(e){return function(n){return m=e.call(this,o=u(n)),-1<m}}([].indexOf||function(e){m=this.length;while(m--&&this[m]!==e);return m}),item:function(t){return this[t]||null},remove:function(){for(var t=0,n;t<arguments.length;t++)n=arguments[t],this.contains(n)&&d.splice.call(this,m,1);this._.className=""+this},toggle:h,toString:function y(){return d.join.call(this,c)}},r(p,"classList",{get:function(){return new a(this)},set:function(){}})),"head"in document||r(document,"head",{get:function(){return s||(s=document.getElementsByTagName("head")[0])}});try{new e.CustomEvent("?")}catch(g){e.CustomEvent=function(e,t){function n(n,i){var s=document.createEvent(e);if(typeof n!="string")throw new Error("An event name must be provided");return e=="Event"&&(s.initCustomEvent=r),i==null&&(i=t),s.initCustomEvent(n,i.bubbles,i.cancelable,i.detail),s}function r(e,t,n,r){this.initEvent(e,t,n),this.detail=r}return n}(e.CustomEvent?"CustomEvent":"Event",{bubbles:!1,cancelable:!1,detail:null})}})(window);
})

require.register("https://nlz.io/github/webreflection/dom4/1.0.1/index.js", function (exports, module) {
module.exports = require("https://nlz.io/github/webreflection/dom4/1.0.1/build/dom4.js")
})

require.register("https://nlz.io/github/yuzujs/setimmediate/1.0.2/setImmediate.js", function (exports, module) {
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function installNextTickImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(new Function("return this")()));

})

require.register("https://nlz.io/github/yuzujs/setimmediate/1.0.2/index.js", function (exports, module) {
module.exports = require("https://nlz.io/github/yuzujs/setimmediate/1.0.2/setImmediate.js")
})

require.register("./client/permalinks.js", function (exports, module) {

document.queryAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(function (h) {
  var a = document.createElement('a')
  a.href = '#' + h.id
  a.textContent = '#'
  a.className = 'header-permalink'
  h.appendChild(a)
})

})

require.register("https://nlz.io/github/component/raf/1.1.3/index.js", function (exports, module) {
/**
 * Expose `requestAnimationFrame()`.
 */

exports = module.exports = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.oRequestAnimationFrame
  || window.msRequestAnimationFrame
  || fallback;

/**
 * Fallback implementation.
 */

var prev = new Date().getTime();
function fallback(fn) {
  var curr = new Date().getTime();
  var ms = Math.max(0, 16 - (curr - prev));
  var req = setTimeout(fn, ms);
  prev = curr;
  return req;
}

/**
 * Cancel.
 */

var cancel = window.cancelAnimationFrame
  || window.webkitCancelAnimationFrame
  || window.mozCancelAnimationFrame
  || window.oCancelAnimationFrame
  || window.msCancelAnimationFrame
  || window.clearTimeout;

exports.cancel = function(id){
  cancel.call(window, id);
};

})

require.register("https://nlz.io/github/component/per-frame/1.0.0/index.js", function (exports, module) {
var raf = require("https://nlz.io/github/component/raf/1.1.3/index.js")

module.exports = function (fn, immediate) {
  var queued = false
  // immediate by default
  if (immediate !== false)
    call()

  return queue

  function queue() {
    if (queued)
      return
    queued = true
    raf(call)
  }

  function call() {
    fn()
    queued = false
  }
}
// normalize:common:info: rewriting dependency "raf" to "https://nlz.io/github/component/raf/*/index.js"


})

require.register("https://nlz.io/github/component/query/0.0.3/index.js", function (exports, module) {
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

})

require.register("https://nlz.io/github/component/matches-selector/0.1.4/index.js", function (exports, module) {
/**
 * Module dependencies.
 */

var query = require("https://nlz.io/github/component/query/0.0.3/index.js");

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

// normalize:common:info: rewriting dependency "query" to "https://nlz.io/github/component/query/*/index.js"


})

require.register("https://nlz.io/github/component/contextual-selector/0.0.2/index.js", function (exports, module) {
module.exports = function (selector, childSelector, sep) {
  childSelector || (childSelector = '*')
  sep || (sep = ' ')

  return selector.split(',').map(function (x) {
    return x + sep + childSelector
  }).join(',')
}
})

require.register("https://nlz.io/github/discore/closest/0.1.3/index.js", function (exports, module) {
var matches = require("https://nlz.io/github/component/matches-selector/0.1.4/index.js")

module.exports = function (element, selector, checkYoSelf, root) {
  element = checkYoSelf ? {parentNode: element} : element

  root = root || document

  // Make sure `element !== document` and `element != null`
  // otherwise we get an illegal invocation
  while ((element = element.parentNode) && element !== document) {
    if (matches(element, selector))
      return element
    // After `matches` on the edge case that
    // the selector matches the root
    // (when the root is not the document)
    if (element === root)
      return  
  }
}
// normalize:common:info: rewriting dependency "matches-selector" to "https://nlz.io/github/component/matches-selector/*/index.js"


})

require.register("https://nlz.io/github/component/tap-event/0.0.7/index.js", function (exports, module) {
var cancelEvents = [
  'touchmove',
  'touchcancel',
  'touchstart',
]

var endEvents = [
  'touchend',
]

module.exports = Tap

function Tap(callback) {
  // to keep track of the original listener
  listener.handler = callback

  return listener

  // el.addEventListener('touchstart', listener)
  function listener(e1) {
    // tap should only happen with a single finger
    if (!e1.touches || e1.touches.length > 1)
      return

    var el = this

    cancelEvents.forEach(function (event) {
      document.addEventListener(event, cleanup)
    })

    endEvents.forEach(function (event) {
      document.addEventListener(event, done)
    })

    function done(e2) {
      // since touchstart is added on the same tick
      // and because of bubbling,
      // it'll execute this on the same touchstart.
      // this filters out the same touchstart event.
      if (e1 === e2)
        return

      cleanup()

      // already handled
      if (e2.defaultPrevented)
        return

      var preventDefault = e1.preventDefault
      var stopPropagation = e1.stopPropagation

      e2.stopPropagation = function () {
        stopPropagation.call(e1)
        stopPropagation.call(e2)
      }

      e2.preventDefault = function () {
        preventDefault.call(e1)
        preventDefault.call(e2)
      }

      // calls the handler with the `end` event,
      // but i don't think it matters.
      callback.call(el, e2)
    }

    function cleanup(e2) {
      if (e1 === e2)
        return

      cancelEvents.forEach(function (event) {
        document.removeEventListener(event, cleanup)
      })

      endEvents.forEach(function (event) {
        document.removeEventListener(event, done)
      })
    }
  }
}
})

require.register("https://nlz.io/github/jonathanong/eevee/0.0.4/index.js", function (exports, module) {
var matches = require("https://nlz.io/github/component/matches-selector/0.1.4/index.js")
var context = require("https://nlz.io/github/component/contextual-selector/0.0.2/index.js")
var closest = require("https://nlz.io/github/discore/closest/0.1.3/index.js")
var query = require("https://nlz.io/github/component/query/0.0.3/index.js")
var tap = require("https://nlz.io/github/component/tap-event/0.0.7/index.js")

module.exports = Eevee

/**
 * We expose them, but they're private.
 * Only reason I can think to expose them
 * is to cleanup bad instances.
 * Don't really want to add cleanup to this repo.
 */

// [id] = [element, eevee instance]
var instances = Eevee.instances = []

// [id][event][selector] = handlers[]
var Events = Eevee.events = []

// [id][event] = EventListeners()
var Listeners = Eevee.listeners = []

// Map handlers to their `tap`d form, if any
var Taphandlers = Eevee.taphandlers = []

// el {HTMLElement|String}
function Eevee(el) {
  if (typeof el === 'string')
    el = query(el)
  if (!el)
    throw new Error('No element supplied.')

  if (!(this instanceof Eevee))
    return new Eevee(el)

  // find any
  var instance
  for (var i = 0, l = instances.length; i < l; i++)
    if ((instance = instances[i])[0] === el)
      return instance[1]

  this.element = el

  instances.push([el, this])
  Events.push(this.events = {})
  Listeners.push(this.listeners = {})
}

Eevee.prototype.on = function (events, selector, handler, capture) {
  events = getEvents(events)

  this[typeof selector === 'function' ? '_on' : '_onDelegate']
    (events, selector, handler, capture)

  return this
}

Eevee.prototype._on = function (events, handler, capture) {
  events.forEach(function (event) {
    if (event === 'tap') {
      event = 'touchstart'
      handler = getTapHandler(handler)
    }

    this.element.addEventListener(event, handler, useCapture(capture))
  }, this)
}

Eevee.prototype._onDelegate = function (events, selector, handler) {
  selector = getSelector(selector)

  getEvents(events).forEach(function (event) {
    if (event === 'tap') {
      event = 'touchstart'
      handler = getTapHandler(handler)
    }

    var selectorspace = this._addEventListener(event)

    ;(selectorspace[selector] || (selectorspace[selector] = []))
    .push(handler)
  }, this)
}

Eevee.prototype.off = function (events, selector, handler, capture) {
  this[typeof selector === 'function' ? '_off' : '_offDelegate']
    (events, selector, handler, capture)

  return this
}

Eevee.prototype._off = function (events, handler, capture) {
  capture = useCapture(capture)
  getEvents(events).forEach(function (event) {
    if (event === 'tap') {
      event = 'touchstart'
      handler = getTapHandler(handler)
    }

    this.element.removeEventListener(event, handler, capture)
  }, this)
}

Eevee.prototype._offDelegate = function (events, selector, handler) {
  // remove all delegated events
  if (!events || !selector)
    return this._removeEventListeners(events)

  events = getEvents(events)
  selector = getSelector(selector)

  var eventspace = this.events

  if (!handler) {
    // Remove all the listeners on the given selector
    events.forEach(function (event) {
      if (event === 'tap')
        event = 'touchstart'

      var selectorspace = eventspace[event]
      if (!selectorspace)
        return

      delete selectorspace[selector]

      if (!Object.keys(selectorspace).length)
        this._removeEventListeners(event)
    }, this)
  }

  events.forEach(function (event) {
    if (event === 'tap')
      event = 'touchstart'

    var selectorspace = eventspace[event]
    if (!selectorspace)
      return

    var handlers = selectorspace[selector]
    if (!handlers)
      return

    // Remove listeners, including possible duplicates
    // We do not use `[].splice` since it would mess up `once`
    handlers = handlers.filter(function (fn) {
      if (fn === handler)
        return false
      if (!fn.fn)
        return true
      if (fn.fn === handler)
        return false
      if (fn.fn.fn === handler)
        return false
      return true
    })

    // Delete the entire selector if there are no listeners
    if (!handlers.length)
      delete selectorspace[selector]
    // Replace the listeners otherwise
    else
      selectorspace[selector] = handlers
  })
}

Eevee.prototype.once = function (events, selector, handler, capture) {
  events = getEvents(events)

  this[typeof selector === 'function' ? '_once' : '_onceDelegate']
    (events, selector, handler, capture)

  return this
}

Eevee.prototype._once = function (events, handler, capture) {
  tempListener.fn = handler
  capture = useCapture(capture)

  var that = this.on(events, tempListener, capture)

  return this

  function tempListener(e) {
    handler.call(this, e)

    that.off(events, tempListener, capture)
  }
}

Eevee.prototype._onceDelegate = function (events, selector, handler) {
  tempListener.fn = handler

  var that = this.on(events, selector, tempListener)

  return this

  function tempListener(e) {
    handler.call(this, e)

    that.off(events, selector, tempListener)
  }
}

Eevee.prototype._addEventListener = function (event) {
  var listeners = this.listeners
  var eventspace = this.events
  var selectorspace = eventspace[event]

  if (listeners[event])
    return selectorspace

  selectorspace = eventspace[event] = {}

  this.element.addEventListener(
    event,
    listeners[event] = eventListener(selectorspace),
    useCapture(event)
  )

  return selectorspace
}

Eevee.prototype._removeEventListeners = function (events) {
  var listeners = this.listeners
  var element = this.element
  var eventspace = this.events

  // If events are not defined, remove them all
  ;(events ? getEvents(events) : Object.keys(eventspace))
  .forEach(function (event) {
    var listener = listeners[event]
    if (!listener)
      return

    element.removeEventListener(event, listener, useCapture(event))
    delete listeners[event]
    delete eventspace[event]
  })

  return this
}

function eventListener(selectorspace) {
  return function (e) {
    var target = e.target
    if (!target || target.nodeType !== 1) return

    Object.keys(selectorspace).forEach(function (selector) {
      // If target matches the selector, or is the descendant of an element that does, continue
      var matched

      try {
        // IE throws an error with `[]` attributes in the selector
        matched = matches(target, selector + ',' + context(selector))
      } catch (err) {
        if (console) {
          console.error(target)
          console.error(err.stack)
        }
      }

      if (!matched)
        return

      selectorspace[selector].forEach(function (fn) {
        fn.call(this, e)
      }, closest(target, selector, true, this))
    }, this)
  }
}

function getTapHandler(fn) {
  for (var i = 0; i < Taphandlers.length; i++)
    if (Taphandlers[i].fn === fn)
      return Taphandlers[i]

  var handler = tap(fn)
  Taphandlers.push(handler)
  return handler
}

/**
 * Default use capture value.
 *
 * http://www.quirksmode.org/dom/events/blurfocus.html
 */

function useCapture(event, value) {
  if (typeof value === 'boolean')
    return value

  switch (event) {
    case 'blur':
    case 'focus':
    case 'invalid':
      return true
    default:
      return false
  }
}

function getSelector(selector) {
  if (Array.isArray(selector))
    return selector.join(',')
  return selector
}

/**
 * Convert a string of events into an array of events.
 * 'click tap' -> ['click', 'tap']
 */

function getEvents(events) {
  if (Array.isArray(events))
    return events
  if (typeof events !== 'string')
    throw new TypeError('Must be a string or an array.')
  return events.trim().split(/\s+/)
}

// normalize:common:info: rewriting dependency "matches-selector" to "https://nlz.io/github/component/matches-selector/*/index.js"
// normalize:common:info: rewriting dependency "contextual-selector" to "https://nlz.io/github/component/contextual-selector/*/index.js"
// normalize:common:info: rewriting dependency "closest" to "https://nlz.io/github/discore/closest/*/index.js"
// normalize:common:info: rewriting dependency "query" to "https://nlz.io/github/component/query/*/index.js"
// normalize:common:info: rewriting dependency "tap-event" to "https://nlz.io/github/component/tap-event/*/index.js"


})

require.register("https://nlz.io/github/component/keyname/0.0.1/index.js", function (exports, module) {

/**
 * Key name map.
 */

var map = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'capslock',
  27: 'esc',
  32: 'space',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  45: 'ins',
  46: 'del',
  91: 'meta',
  93: 'meta',
  224: 'meta'
};

/**
 * Return key name for `n`.
 *
 * @param {Number} n
 * @return {String}
 * @api public
 */

module.exports = function(n){
  return map[n];
};
})

require.register("https://nlz.io/github/component/indexof/0.0.3/index.js", function (exports, module) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
})

require.register("https://nlz.io/github/component/classes/1.2.1/index.js", function (exports, module) {
/**
 * Module dependencies.
 */

var index = require("https://nlz.io/github/component/indexof/0.0.3/index.js");

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el) throw new Error('A DOM element reference is required');
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var str = this.el.className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

// normalize:common:info: rewriting dependency "indexof" to "https://nlz.io/github/component/indexof/*/index.js"


})

require.register("https://nlz.io/github/component/clickable/0.0.4/index.js", function (exports, module) {
module.exports = function (e) {
  // primary button only
  if (e.type === 'click' && e.button !== 0)
    return false
  // one touch
  if (e.touches && e.touches.length > 1)
    return false

  return !(e.defaultPrevented
    || e.ctrlKey
    || e.altKey
    || e.shiftKey
    || e.metaKey
  )
}
})

require.register("https://nlz.io/github/component/emitter/1.1.2/index.js", function (exports, module) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

})

require.register("https://nlz.io/github/jonathanong/delegated-dropdown/0.0.7/lib/index.js", function (exports, module) {
/* jshint browser: true */

var eevee = require("https://nlz.io/github/jonathanong/eevee/0.0.4/index.js")
var query = require("https://nlz.io/github/component/query/0.0.3/index.js")
var tap = require("https://nlz.io/github/component/tap-event/0.0.7/index.js")
var keyname = require("https://nlz.io/github/component/keyname/0.0.1/index.js")
var classes = require("https://nlz.io/github/component/classes/1.2.1/index.js")
var closest = require("https://nlz.io/github/discore/closest/0.1.3/index.js")
var clickable = require("https://nlz.io/github/component/clickable/0.0.4/index.js")
var matches = require("https://nlz.io/github/component/matches-selector/0.1.4/index.js")
var Emitter = require("https://nlz.io/github/component/emitter/1.1.2/index.js")

exports = module.exports = new Emitter()
exports.position = positionDropdown
exports.open = openDropdown
exports.close = closeDropdown
exports.clear = clearMenus
exports.right = true
exports.up = true

document.addEventListener('click', onclick, false)
document.addEventListener('touchstart', tap(onclick), false)
document.addEventListener('focus', clearAllMenus, true)

document.addEventListener('keyup', function (e) {
  switch (keyname(e.which)) {
    case 'esc': return clearMenus()
  }
}, false)

eevee(document)
.on('click tap', '.Dropdown-toggle', function (e) {
  e.preventDefault()
  e.stopPropagation()

  var dropdown = closest(this, '.Dropdown')
  var c_dropdown = classes(dropdown)
  var activate = !c_dropdown.has('open')

  // just clear all the menus
  if (!activate) return clearMenus()

  // clear all menus but this one
  clearMenus(dropdown)
  // open this one
  openDropdown(dropdown)
})

function onclick(e) {
  if (!clickable(e)) return
  clearAllMenus(e)
}

/**
 * Clear all menus whenever a click or tap event occurs,
 * but don't clear the current one.
 */

function clearAllMenus(e) {
  var target = e.target
  var dropdown
  if (matches(target, '.Dropdown.open, .Dropdown.open *')) {
    dropdown = closest(target, '.Dropdown', true)
  }
  clearMenus(dropdown)
}

/**
 * Clear all menus except `except`.
 */

function clearMenus(except) {
  var dropdowns = query.all('.Dropdown.open')
  var dropdown
  for (var i = 0; i < dropdowns.length; i++) {
    dropdown = dropdowns[i]
    if (dropdown !== except) closeDropdown(dropdown)
  }
}

/**
 * Position a menu.
 */

function positionDropdown(dropdown) {
  var c_dropdown = classes(dropdown)
  var rect = dropdown.getBoundingClientRect()
  var d_width = dropdown.offsetWidth
  // var d_height = dropdown.offsetHeight
  var menu = query('.Dropdown-menu', dropdown)
  var m_width = menu.offsetWidth
  var m_height = menu.offsetHeight
  var pos_x = 'left' // left-justified by default
  var pos_y = 'down' // drop down by default
  // calculate pos_x only if the menu is larger than .Dropdown
  if (exports.right && d_width < m_width) {
    var w_width = window.innerWidth
    if (m_width - d_width > w_width - rect.right) pos_x = 'right'
  }
  // calculate pos_y
  var w_height = window.innerHeight
  if (exports.up && m_height > w_height - rect.bottom) pos_y = 'up'
  c_dropdown
    .add(pos_x)
    .add(pos_y)
    .remove(pos_x === 'left' ? 'right' : 'left')
    .remove(pos_y === 'down' ? 'up' : 'down')
  return dropdown
}

/**
 * Open a menu.
 */

function openDropdown(dropdown) {
  var c_dropdown = classes(dropdown)
  if (c_dropdown.has('open')) return
  c_dropdown.add('open')
  positionDropdown(dropdown) // has to be after opening for iOS
  exports.emit('open', dropdown)
  return dropdown
}

function closeDropdown(dropdown) {
  classes(dropdown).remove('open')
  exports.emit('close', dropdown)
  return dropdown
}
// normalize:common:info: rewriting dependency "eevee" to "https://nlz.io/github/jonathanong/eevee/*/index.js"
// normalize:common:info: rewriting dependency "query" to "https://nlz.io/github/component/query/*/index.js"
// normalize:common:info: rewriting dependency "tap-event" to "https://nlz.io/github/component/tap-event/*/index.js"
// normalize:common:info: rewriting dependency "keyname" to "https://nlz.io/github/component/keyname/*/index.js"
// normalize:common:info: rewriting dependency "classes" to "https://nlz.io/github/component/classes/*/index.js"
// normalize:common:info: rewriting dependency "closest" to "https://nlz.io/github/discore/closest/*/index.js"
// normalize:common:info: rewriting dependency "clickable" to "https://nlz.io/github/component/clickable/*/index.js"
// normalize:common:info: rewriting dependency "matches-selector" to "https://nlz.io/github/component/matches-selector/*/index.js"
// normalize:common:info: rewriting dependency "emitter" to "https://nlz.io/github/component/emitter/*/index.js"


})

require.register("https://nlz.io/github/jonathanong/delegated-dropdown/0.0.7/index.js", function (exports, module) {
module.exports = require("https://nlz.io/github/jonathanong/delegated-dropdown/0.0.7/lib/index.js")
})

require.register("./client/toc.js", function (exports, module) {

var throttle = require("https://nlz.io/github/component/per-frame/1.0.0/index.js");
require("https://nlz.io/github/jonathanong/delegated-dropdown/0.0.7/index.js");

require("./client/permalinks.js");

var html = document.documentElement
var toc = document.querySelector('#toc')
var menu = document.querySelector('#toc .Dropdown-menu')
if (toc) {
  // create the #toc
  var frag = document.createDocumentFragment()
  ;[].forEach.call(document.querySelectorAll('section h2[id]'), function (h) {
    var a = document.createElement('a')
    a.className = 'Dropdown-item'
    a.href = '#' + h.id
    a.title = a.textContent = h.firstChild.textContent
    frag.appendChild(a)
  })
  menu.appendChild(frag)

  // apply listeners
  window.addEventListener('scroll', throttle(function () {
    setMaxHeight()
    setAffix()
  }))

  window.addEventListener('resize', throttle(function () {
    setMaxHeight()
  }))

  // to do: automatically reapply max height whenever the dropdown is open
  // because iOS seems to be debouncing these events themselves or something
}

// make it sticky. to do: use position: sticky; if available
function setAffix() {
  html.classList[window.scrollY > 134 ? 'add' : 'remove']('toc-fixed')
}

// change dropdown max-height
function setMaxHeight() {
  var maxHeight = window.innerHeight
    - toc.getBoundingClientRect().top // #toc top
    - 40 // .Dropdown-toggle height
    - 20 // border from bottom
  menu.style['max-height'] = maxHeight + 'px'
}

})

require.register("./client/index.js", function (exports, module) {

require("https://nlz.io/github/barberboy/dom-elements/0.1.0/index.js");
require("https://nlz.io/github/webreflection/dom4/1.0.1/index.js");
require("https://nlz.io/github/yuzujs/setimmediate/1.0.2/index.js");

require("./client/permalinks.js");
require("./client/toc.js");

})

require("./client/index.js");
