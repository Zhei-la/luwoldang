/* 자동 생성 파일 — 고치지 말고 ruwoldang-site 저장소에서 scripts/build-ruwoldang.mjs 로 다시 만든다. build 202609151110 */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result, thenable = ctor();
        thenable.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = thenable);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    function startTransition(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      currentTransition.types = null !== prevTransition ? prevTransition.types : null;
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    }
    function addTransitionType(type) {
      var transition = ReactSharedInternals.T;
      if (null !== transition) {
        var transitionTypes = transition.types;
        null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
      } else startTransition(addTransitionType.bind(null, type));
    }
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports2.Activity = REACT_ACTIVITY_TYPE;
    exports2.Children = Children;
    exports2.Component = Component;
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.Profiler = REACT_PROFILER_TYPE;
    exports2.PureComponent = PureComponent;
    exports2.StrictMode = REACT_STRICT_MODE_TYPE;
    exports2.Suspense = REACT_SUSPENSE_TYPE;
    exports2.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
    exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports2.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports2.addTransitionType = addTransitionType;
    exports2.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports2.cacheSignal = function() {
      return null;
    };
    exports2.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports2.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports2.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports2.createRef = function() {
      return { current: null };
    };
    exports2.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports2.isValidElement = isValidElement;
    exports2.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports2.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports2.startTransition = startTransition;
    exports2.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports2.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports2.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports2.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports2.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports2.useDebugValue = function() {
    };
    exports2.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports2.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports2.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports2.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports2.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports2.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports2.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports2.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports2.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports2.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports2.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports2.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports2.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports2.version = "19.3.0";
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports2, module2) {
    "use strict";
    if (true) {
      module2.exports = require_react_production();
    } else {
      module2.exports = null;
    }
  }
});

// node_modules/react-dom/cjs/react-dom.production.js
var require_react_dom_production = __commonJS({
  "node_modules/react-dom/cjs/react-dom.production.js"(exports2) {
    "use strict";
    var React = require_react();
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function noop() {
    }
    var Internals = {
      d: {
        f: noop,
        r: function() {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop
      },
      p: 0,
      findDOMNode: null
    };
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_RECOVERABLE_TYPE = /* @__PURE__ */ Symbol.for("react.recoverable");
    var REACT_OPTIMISTIC_KEY = /* @__PURE__ */ Symbol.for("react.optimistic_key");
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : key === REACT_OPTIMISTIC_KEY ? REACT_OPTIMISTIC_KEY : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    exports2.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    exports2.browser = function(reason) {
      return { $$typeof: REACT_RECOVERABLE_TYPE, _reason: reason };
    };
    exports2.createPortal = function(children, container) {
      var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
        throw Error(formatProdErrorMessage(299));
      return createPortal$1(children, container, null, key);
    };
    exports2.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
      }
    };
    exports2.preconnect = function(href, options) {
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    exports2.prefetchDNS = function(href) {
      "string" === typeof href && Internals.d.D(href);
    };
    exports2.preinit = function(href, options) {
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    exports2.preinitModule = function(href, options) {
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            );
            Internals.d.M(href, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0,
              fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
            });
          }
        } else null == options && Internals.d.M(href);
    };
    exports2.preload = function(href, options) {
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    exports2.preloadModule = function(href, options) {
      if ("string" === typeof href)
        if (options) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
            fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0
          });
        } else Internals.d.m(href);
    };
    exports2.requestFormReset = function(form) {
      Internals.d.r(form);
    };
    exports2.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    };
    exports2.useFormState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useFormState(action, initialState, permalink);
    };
    exports2.useFormStatus = function() {
      return ReactSharedInternals.H.useHostTransitionStatus();
    };
    exports2.version = "19.3.0";
  }
});

// node_modules/react-dom/index.js
var require_react_dom = __commonJS({
  "node_modules/react-dom/index.js"(exports2, module2) {
    "use strict";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (false) {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    if (true) {
      checkDCE();
      module2.exports = require_react_dom_production();
    } else {
      module2.exports = null;
    }
  }
});

// node_modules/react-dom/cjs/react-dom-server-legacy.node.production.js
var require_react_dom_server_legacy_node_production = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server-legacy.node.production.js"(exports2) {
    "use strict";
    var React = require_react();
    var ReactDOM = require_react_dom();
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden");
    var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
    var REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition");
    var REACT_RECOVERABLE_TYPE = /* @__PURE__ */ Symbol.for("react.recoverable");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var REACT_OPTIMISTIC_KEY = /* @__PURE__ */ Symbol.for("react.optimistic_key");
    var isArrayImpl = Array.isArray;
    function murmurhash3_32_gc(key, seed) {
      var remainder = key.length & 3;
      var bytes = key.length - remainder;
      var h1 = seed;
      for (seed = 0; seed < bytes; ) {
        var k1 = key.charCodeAt(seed) & 255 | (key.charCodeAt(++seed) & 255) << 8 | (key.charCodeAt(++seed) & 255) << 16 | (key.charCodeAt(++seed) & 255) << 24;
        ++seed;
        k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
        h1 ^= k1;
        h1 = h1 << 13 | h1 >>> 19;
        h1 = 5 * (h1 & 65535) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
        h1 = (h1 & 65535) + 27492 + (((h1 >>> 16) + 58964 & 65535) << 16);
      }
      k1 = 0;
      switch (remainder) {
        case 3:
          k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
        case 2:
          k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
        case 1:
          k1 ^= key.charCodeAt(seed) & 255, k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295, k1 = k1 << 15 | k1 >>> 17, h1 ^= 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
      }
      h1 ^= key.length;
      h1 ^= h1 >>> 16;
      h1 = 2246822507 * (h1 & 65535) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295;
      h1 ^= h1 >>> 13;
      h1 = 3266489909 * (h1 & 65535) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295;
      return (h1 ^ h1 >>> 16) >>> 0;
    }
    var assign = Object.assign;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    );
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
        return true;
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
        return validatedAttributeNameCache[attributeName] = true;
      illegalAttributeNameCache[attributeName] = true;
      return false;
    }
    var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    );
    var aliases = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["maskType", "mask-type"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]);
    var matchHtmlRegExp = /["'&<>]/;
    function escapeTextForBrowser(text) {
      if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
        return "" + text;
      text = "" + text;
      var match = matchHtmlRegExp.exec(text);
      if (match) {
        var html = "", index, lastIndex = 0;
        for (index = match.index; index < text.length; index++) {
          switch (text.charCodeAt(index)) {
            case 34:
              match = "&quot;";
              break;
            case 38:
              match = "&amp;";
              break;
            case 39:
              match = "&#x27;";
              break;
            case 60:
              match = "&lt;";
              break;
            case 62:
              match = "&gt;";
              break;
            default:
              continue;
          }
          lastIndex !== index && (html += text.slice(lastIndex, index));
          lastIndex = index + 1;
          html += match;
        }
        text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
      }
      return text;
    }
    var uppercasePattern = /([A-Z])/g;
    var msPattern = /^ms-/;
    var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function sanitizeURL(url) {
      return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null
    };
    var previousDispatcher = ReactDOMSharedInternals.d;
    ReactDOMSharedInternals.d = {
      f: previousDispatcher.f,
      r: previousDispatcher.r,
      D: prefetchDNS,
      C: preconnect,
      L: preload,
      m: preloadModule,
      X: preinitScript,
      S: preinitStyle,
      M: preinitModuleScript
    };
    var PRELOAD_NO_CREDS = [];
    var currentlyFlushingRenderState = null;
    var scriptRegex = /(<\/|<)(s)(cript)/gi;
    function scriptReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\u0073" : "\\u0053") + suffix2;
    }
    function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
      return {
        idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
        nextFormID: 0,
        streamingFormat: 0,
        bootstrapScriptContent,
        bootstrapScripts,
        bootstrapModules,
        instructions: 0,
        hasBody: false,
        hasHtml: false,
        unknownResources: {},
        dnsResources: {},
        connectResources: { default: {}, anonymous: {}, credentials: {} },
        imageResources: {},
        styleResources: {},
        scriptResources: {},
        moduleUnknownResources: {},
        moduleScriptResources: {}
      };
    }
    function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
      return {
        insertionMode,
        selectedValue,
        tagScope,
        viewTransition
      };
    }
    function getChildFormatContext(parentContext, type, props) {
      var subtreeScope = parentContext.tagScope & -25;
      switch (type) {
        case "noscript":
          return createFormatContext(2, null, subtreeScope | 1, null);
        case "select":
          return createFormatContext(
            2,
            null != props.value ? props.value : props.defaultValue,
            subtreeScope,
            null
          );
        case "svg":
          return createFormatContext(4, null, subtreeScope, null);
        case "picture":
          return createFormatContext(2, null, subtreeScope | 2, null);
        case "math":
          return createFormatContext(5, null, subtreeScope, null);
        case "foreignObject":
          return createFormatContext(2, null, subtreeScope, null);
        case "table":
          return createFormatContext(6, null, subtreeScope, null);
        case "thead":
        case "tbody":
        case "tfoot":
          return createFormatContext(7, null, subtreeScope, null);
        case "colgroup":
          return createFormatContext(9, null, subtreeScope, null);
        case "tr":
          return createFormatContext(8, null, subtreeScope, null);
        case "head":
          if (2 > parentContext.insertionMode)
            return createFormatContext(3, null, subtreeScope, null);
          break;
        case "html":
          if (0 === parentContext.insertionMode)
            return createFormatContext(1, null, subtreeScope, null);
      }
      return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : null !== parentContext.viewTransition || parentContext.tagScope !== subtreeScope ? createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        null
      ) : parentContext;
    }
    function getSuspenseViewTransition(parentViewTransition) {
      return null === parentViewTransition ? null : {
        update: parentViewTransition.update,
        enter: "none",
        exit: "none",
        share: parentViewTransition.update,
        parentEnter: "none",
        parentExit: "none",
        name: parentViewTransition.autoName,
        autoName: parentViewTransition.autoName,
        nameIdx: 0
      };
    }
    function getSuspenseFallbackFormatContext(resumableState, parentContext) {
      parentContext.tagScope & 32 && (resumableState.instructions |= 128);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        parentContext.tagScope | 12,
        getSuspenseViewTransition(parentContext.viewTransition)
      );
    }
    function getSuspenseContentFormatContext(resumableState, parentContext) {
      resumableState = getSuspenseViewTransition(parentContext.viewTransition);
      var subtreeScope = parentContext.tagScope | 16;
      null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        resumableState
      );
    }
    function makeId(resumableState, treeId, localId) {
      resumableState = "_" + resumableState.idPrefix + "R_" + treeId;
      0 < localId && (resumableState += "H" + localId.toString(32));
      return resumableState + "_";
    }
    function pushViewTransitionAttributes(target, formatContext) {
      formatContext = formatContext.viewTransition;
      null !== formatContext && ("auto" !== formatContext.name && (pushStringAttribute(
        target,
        "vt-name",
        0 === formatContext.nameIdx ? formatContext.name : formatContext.name + "_" + formatContext.nameIdx
      ), formatContext.nameIdx++), pushStringAttribute(target, "vt-update", formatContext.update), "none" !== formatContext.enter && pushStringAttribute(target, "vt-enter", formatContext.enter), "none" !== formatContext.exit && pushStringAttribute(target, "vt-exit", formatContext.exit), "none" !== formatContext.share && pushStringAttribute(target, "vt-share", formatContext.share));
    }
    var styleNameCache = /* @__PURE__ */ new Map();
    function pushStyleAttribute(target, style) {
      if ("object" !== typeof style)
        throw Error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      var isFirst = true, styleName;
      for (styleName in style)
        if (hasOwnProperty.call(style, styleName)) {
          var styleValue = style[styleName];
          if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
            if (0 === styleName.indexOf("--")) {
              var nameChunk = escapeTextForBrowser(styleName);
              styleValue = escapeTextForBrowser(("" + styleValue).trim());
            } else
              nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = escapeTextForBrowser(
                styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")
              ), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? "" + styleValue : styleValue + "px" : escapeTextForBrowser(("" + styleValue).trim());
            isFirst ? (isFirst = false, target.push(' style="', nameChunk, ":", styleValue)) : target.push(";", nameChunk, ":", styleValue);
          }
        }
      isFirst || target.push('"');
    }
    function pushBooleanAttribute(target, name, value) {
      value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '=""');
    }
    function pushStringAttribute(target, name, value) {
      "function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
    }
    var actionJavaScriptURL = escapeTextForBrowser(
      "javascript:throw new Error('React form unexpectedly submitted.')"
    );
    function pushAdditionalFormField(value, key) {
      this.push('<input type="hidden"');
      validateAdditionalFormField(value);
      pushStringAttribute(this, "name", key);
      pushStringAttribute(this, "value", value);
      this.push("/>");
    }
    function validateAdditionalFormField(value) {
      if ("string" !== typeof value)
        throw Error(
          "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration."
        );
    }
    function getCustomFormFields(resumableState, formAction) {
      if ("function" === typeof formAction.$$FORM_ACTION) {
        var id = resumableState.nextFormID++;
        resumableState = resumableState.idPrefix + id;
        try {
          var customFields = formAction.$$FORM_ACTION(resumableState);
          if (customFields) {
            var formData = customFields.data;
            null != formData && formData.forEach(validateAdditionalFormField);
          }
          return customFields;
        } catch (x) {
          if ("object" === typeof x && null !== x && "function" === typeof x.then)
            throw x;
        }
      }
      return null;
    }
    function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
      var formData = null;
      if ("function" === typeof formAction) {
        var customFields = getCustomFormFields(resumableState, formAction);
        null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(" ", "formAction", '="', actionJavaScriptURL, '"'), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
      }
      null != name && pushAttribute(target, "name", name);
      null != formAction && pushAttribute(target, "formAction", formAction);
      null != formEncType && pushAttribute(target, "formEncType", formEncType);
      null != formMethod && pushAttribute(target, "formMethod", formMethod);
      null != formTarget && pushAttribute(target, "formTarget", formTarget);
      return formData;
    }
    function pushAttribute(target, name, value) {
      switch (name) {
        case "className":
          pushStringAttribute(target, "class", value);
          break;
        case "tabIndex":
          pushStringAttribute(target, "tabindex", value);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          pushStringAttribute(target, name, value);
          break;
        case "style":
          pushStyleAttribute(target, value);
          break;
        case "src":
        case "href":
          if ("" === value) break;
        case "action":
        case "formAction":
          if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "ref":
          break;
        case "autoFocus":
        case "multiple":
        case "muted":
          pushBooleanAttribute(target, name.toLowerCase(), value);
          break;
        case "xlinkHref":
          if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(" ", "xlink:href", '="', escapeTextForBrowser(value), '"');
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '=""');
          break;
        case "capture":
        case "download":
          true === value ? target.push(" ", name, '=""') : false !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "rowSpan":
        case "start":
          "function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(" ", name, '="', escapeTextForBrowser(value), '"');
          break;
        case "xlinkActuate":
          pushStringAttribute(target, "xlink:actuate", value);
          break;
        case "xlinkArcrole":
          pushStringAttribute(target, "xlink:arcrole", value);
          break;
        case "xlinkRole":
          pushStringAttribute(target, "xlink:role", value);
          break;
        case "xlinkShow":
          pushStringAttribute(target, "xlink:show", value);
          break;
        case "xlinkTitle":
          pushStringAttribute(target, "xlink:title", value);
          break;
        case "xlinkType":
          pushStringAttribute(target, "xlink:type", value);
          break;
        case "xmlBase":
          pushStringAttribute(target, "xml:base", value);
          break;
        case "xmlLang":
          pushStringAttribute(target, "xml:lang", value);
          break;
        case "xmlSpace":
          pushStringAttribute(target, "xml:space", value);
          break;
        default:
          if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
            if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean":
                  var prefix$8 = name.toLowerCase().slice(0, 5);
                  if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
              }
              target.push(" ", name, '="', escapeTextForBrowser(value), '"');
            }
          }
      }
    }
    function pushInnerHTML(target, innerHTML, children) {
      if (null != innerHTML) {
        if (null != children)
          throw Error(
            "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
          );
        if ("object" !== typeof innerHTML || !("__html" in innerHTML))
          throw Error(
            "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
          );
        innerHTML = innerHTML.__html;
        null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
      }
    }
    function flattenOptionChildren(children) {
      var content = "";
      React.Children.forEach(children, function(child) {
        null != child && (content += child);
      });
      return content;
    }
    function injectFormReplayingRuntime(resumableState, renderState) {
      if (0 === (resumableState.instructions & 16)) {
        resumableState.instructions |= 16;
        var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
        (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
          ">",
          `addEventListener("submit",function(a){if(!a.defaultPrevented){var b=a.target,d=a.submitter,c=b.action,e=d;if(d){var f=d.getAttribute("formAction");null!=f&&(c=f,e=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===c&&(a.preventDefault(),a=new FormData(b,e),c=b.ownerDocument||b,(c.$$reactFormReplay=c.$$reactFormReplay||[]).push(b,d,a))}});`,
          "</script>"
        )) : bootstrapChunks.unshift(
          renderState.startInlineScript,
          ">",
          `addEventListener("submit",function(a){if(!a.defaultPrevented){var b=a.target,d=a.submitter,c=b.action,e=d;if(d){var f=d.getAttribute("formAction");null!=f&&(c=f,e=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===c&&(a.preventDefault(),a=new FormData(b,e),c=b.ownerDocument||b,(c.$$reactFormReplay=c.$$reactFormReplay||[]).push(b,d,a))}});`,
          "</script>"
        );
      }
    }
    function pushLinkImpl(target, props) {
      target.push(startChunkForTag("link"));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push("/>");
      return null;
    }
    var styleRegex = /(<\/|<)(s)(tyle)/gi;
    function styleReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\73 " : "\\53 ") + suffix2;
    }
    function pushSelfClosing(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push("/>");
      return null;
    }
    function pushTitleImpl(target, props) {
      target.push(startChunkForTag("title"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(">");
      props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
      "function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(escapeTextForBrowser("" + props));
      pushInnerHTML(target, innerHTML, children);
      target.push(endChunkForTag("title"));
      return null;
    }
    function pushScriptImpl(target, props) {
      target.push(startChunkForTag("script"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(">");
      pushInnerHTML(target, innerHTML, children);
      "string" === typeof children && target.push(("" + children).replace(scriptRegex, scriptReplacer));
      target.push(endChunkForTag("script"));
      return null;
    }
    function pushStartSingletonElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(">");
      pushInnerHTML(target, innerHTML, tag);
      return tag;
    }
    function pushStartGenericElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(">");
      pushInnerHTML(target, innerHTML, tag);
      return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
    }
    var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    var validatedTagCache = /* @__PURE__ */ new Map();
    function startChunkForTag(tag) {
      var tagStartChunk = validatedTagCache.get(tag);
      if (void 0 === tagStartChunk) {
        if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
        tagStartChunk = "<" + tag;
        validatedTagCache.set(tag, tagStartChunk);
      }
      return tagStartChunk;
    }
    function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
      switch (type) {
        case "div":
        case "span":
        case "svg":
        case "path":
          break;
        case "a":
          target$jscomp$0.push(startChunkForTag("a"));
          var children = null, innerHTML = null, propKey;
          for (propKey in props)
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (null != propValue)
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "href":
                    "" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
                    break;
                  default:
                    pushAttribute(target$jscomp$0, propKey, propValue);
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML, children);
          if ("string" === typeof children) {
            target$jscomp$0.push(escapeTextForBrowser(children));
            var JSCompiler_inline_result = null;
          } else JSCompiler_inline_result = children;
          return JSCompiler_inline_result;
        case "g":
        case "p":
        case "li":
          break;
        case "select":
          target$jscomp$0.push(startChunkForTag("select"));
          var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
          for (propKey$jscomp$0 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$0)) {
              var propValue$jscomp$0 = props[propKey$jscomp$0];
              if (null != propValue$jscomp$0)
                switch (propKey$jscomp$0) {
                  case "children":
                    children$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "defaultValue":
                  case "value":
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$0,
                      propValue$jscomp$0
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
          return children$jscomp$0;
        case "option":
          var selectedValue = formatContext.selectedValue;
          target$jscomp$0.push(startChunkForTag("option"));
          var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
          for (propKey$jscomp$1 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$1)) {
              var propValue$jscomp$1 = props[propKey$jscomp$1];
              if (null != propValue$jscomp$1)
                switch (propKey$jscomp$1) {
                  case "children":
                    children$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "selected":
                    selected = propValue$jscomp$1;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "value":
                    value = propValue$jscomp$1;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$1,
                      propValue$jscomp$1
                    );
                }
            }
          if (null != selectedValue) {
            var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
            if (isArrayImpl(selectedValue))
              for (var i = 0; i < selectedValue.length; i++) {
                if ("" + selectedValue[i] === stringValue) {
                  target$jscomp$0.push(' selected=""');
                  break;
                }
              }
            else
              "" + selectedValue === stringValue && target$jscomp$0.push(' selected=""');
          } else selected && target$jscomp$0.push(' selected=""');
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
          return children$jscomp$1;
        case "textarea":
          target$jscomp$0.push(startChunkForTag("textarea"));
          var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
          for (propKey$jscomp$2 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$2)) {
              var propValue$jscomp$2 = props[propKey$jscomp$2];
              if (null != propValue$jscomp$2)
                switch (propKey$jscomp$2) {
                  case "children":
                    children$jscomp$2 = propValue$jscomp$2;
                    break;
                  case "value":
                    value$jscomp$0 = propValue$jscomp$2;
                    break;
                  case "defaultValue":
                    defaultValue = propValue$jscomp$2;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$2,
                      propValue$jscomp$2
                    );
                }
            }
          null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          if (null != children$jscomp$2) {
            if (null != value$jscomp$0)
              throw Error(
                "If you supply `defaultValue` on a <textarea>, do not pass children."
              );
            if (isArrayImpl(children$jscomp$2)) {
              if (1 < children$jscomp$2.length)
                throw Error("<textarea> can only have at most one child.");
              value$jscomp$0 = "" + children$jscomp$2[0];
            }
            value$jscomp$0 = "" + children$jscomp$2;
          }
          "string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push("\n");
          null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
          return null;
        case "input":
          target$jscomp$0.push(startChunkForTag("input"));
          var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
          for (propKey$jscomp$3 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$3)) {
              var propValue$jscomp$3 = props[propKey$jscomp$3];
              if (null != propValue$jscomp$3)
                switch (propKey$jscomp$3) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  case "name":
                    name = propValue$jscomp$3;
                    break;
                  case "formAction":
                    formAction = propValue$jscomp$3;
                    break;
                  case "formEncType":
                    formEncType = propValue$jscomp$3;
                    break;
                  case "formMethod":
                    formMethod = propValue$jscomp$3;
                    break;
                  case "formTarget":
                    formTarget = propValue$jscomp$3;
                    break;
                  case "defaultChecked":
                    defaultChecked = propValue$jscomp$3;
                    break;
                  case "defaultValue":
                    defaultValue$jscomp$0 = propValue$jscomp$3;
                    break;
                  case "checked":
                    checked = propValue$jscomp$3;
                    break;
                  case "value":
                    value$jscomp$1 = propValue$jscomp$3;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$3,
                      propValue$jscomp$3
                    );
                }
            }
          var formData = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction,
            formEncType,
            formMethod,
            formTarget,
            name
          );
          null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
          null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push("/>");
          null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
          return null;
        case "button":
          target$jscomp$0.push(startChunkForTag("button"));
          var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
          for (propKey$jscomp$4 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$4)) {
              var propValue$jscomp$4 = props[propKey$jscomp$4];
              if (null != propValue$jscomp$4)
                switch (propKey$jscomp$4) {
                  case "children":
                    children$jscomp$3 = propValue$jscomp$4;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$2 = propValue$jscomp$4;
                    break;
                  case "name":
                    name$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formAction":
                    formAction$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formEncType":
                    formEncType$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formMethod":
                    formMethod$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formTarget":
                    formTarget$jscomp$0 = propValue$jscomp$4;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$4,
                      propValue$jscomp$4
                    );
                }
            }
          var formData$jscomp$0 = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction$jscomp$0,
            formEncType$jscomp$0,
            formMethod$jscomp$0,
            formTarget$jscomp$0,
            name$jscomp$0
          );
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          null != formData$jscomp$0 && formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
          if ("string" === typeof children$jscomp$3) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
            var JSCompiler_inline_result$jscomp$0 = null;
          } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
          return JSCompiler_inline_result$jscomp$0;
        case "form":
          target$jscomp$0.push(startChunkForTag("form"));
          var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
          for (propKey$jscomp$5 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$5)) {
              var propValue$jscomp$5 = props[propKey$jscomp$5];
              if (null != propValue$jscomp$5)
                switch (propKey$jscomp$5) {
                  case "children":
                    children$jscomp$4 = propValue$jscomp$5;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$3 = propValue$jscomp$5;
                    break;
                  case "action":
                    formAction$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "encType":
                    formEncType$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "method":
                    formMethod$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "target":
                    formTarget$jscomp$1 = propValue$jscomp$5;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$5,
                      propValue$jscomp$5
                    );
                }
            }
          var formData$jscomp$1 = null, formActionName = null;
          if ("function" === typeof formAction$jscomp$1) {
            var customFields = getCustomFormFields(
              resumableState,
              formAction$jscomp$1
            );
            null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(
              " ",
              "action",
              '="',
              actionJavaScriptURL,
              '"'
            ), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
          }
          null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
          null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
          null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
          null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          null !== formActionName && (target$jscomp$0.push('<input type="hidden"'), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push("/>"), null != formData$jscomp$1 && formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
          if ("string" === typeof children$jscomp$4) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
            var JSCompiler_inline_result$jscomp$1 = null;
          } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
          return JSCompiler_inline_result$jscomp$1;
        case "menuitem":
          target$jscomp$0.push(startChunkForTag("menuitem"));
          for (var propKey$jscomp$6 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$6)) {
              var propValue$jscomp$6 = props[propKey$jscomp$6];
              if (null != propValue$jscomp$6)
                switch (propKey$jscomp$6) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "menuitems cannot have `children` nor `dangerouslySetInnerHTML`."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$6,
                      propValue$jscomp$6
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          return null;
        case "object":
          target$jscomp$0.push(startChunkForTag("object"));
          var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
          for (propKey$jscomp$7 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$7)) {
              var propValue$jscomp$7 = props[propKey$jscomp$7];
              if (null != propValue$jscomp$7)
                switch (propKey$jscomp$7) {
                  case "children":
                    children$jscomp$5 = propValue$jscomp$7;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$4 = propValue$jscomp$7;
                    break;
                  case "data":
                    var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                    if ("" === sanitizedValue) break;
                    target$jscomp$0.push(
                      " ",
                      "data",
                      '="',
                      escapeTextForBrowser(sanitizedValue),
                      '"'
                    );
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$7,
                      propValue$jscomp$7
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
          if ("string" === typeof children$jscomp$5) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
            var JSCompiler_inline_result$jscomp$2 = null;
          } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
          return JSCompiler_inline_result$jscomp$2;
        case "title":
          var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
              target$jscomp$0,
              props
            );
          else
            isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
          return JSCompiler_inline_result$jscomp$3;
        case "link":
          var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
            pushLinkImpl(target$jscomp$0, props);
            var JSCompiler_inline_result$jscomp$4 = null;
          } else if ("stylesheet" === props.rel)
            if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError)
              JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
                target$jscomp$0,
                props
              );
            else {
              var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
              if (null !== resourceState) {
                resumableState.styleResources[href] = null;
                styleQueue || (styleQueue = {
                  precedence: escapeTextForBrowser(precedence),
                  rules: [],
                  hrefs: [],
                  sheets: /* @__PURE__ */ new Map()
                }, renderState.styles.set(precedence, styleQueue));
                var resource = {
                  state: 0,
                  props: assign({}, props, {
                    "data-precedence": props.precedence,
                    precedence: null
                  })
                };
                if (resourceState) {
                  2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
                  var preloadResource = renderState.preloads.stylesheets.get(href);
                  preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
                }
                styleQueue.sheets.set(href, resource);
                hoistableState && hoistableState.stylesheets.add(resource);
              } else if (styleQueue) {
                var resource$9 = styleQueue.sheets.get(href);
                resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
              }
              textEmbedded && target$jscomp$0.push("<!-- -->");
              JSCompiler_inline_result$jscomp$4 = null;
            }
          else
            props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
              target$jscomp$0,
              props
            ) : (textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
          return JSCompiler_inline_result$jscomp$4;
        case "script":
          var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
          if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
              target$jscomp$0,
              props
            );
          else {
            var key = props.src;
            if ("module" === props.type) {
              var resources = resumableState.moduleScriptResources;
              var preloads = renderState.preloads.moduleScripts;
            } else
              resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
            var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
            if (null !== resourceState$jscomp$0) {
              resources[key] = null;
              var scriptProps = props;
              if (resourceState$jscomp$0) {
                2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
                var preloadResource$jscomp$0 = preloads.get(key);
                preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
              }
              var resource$jscomp$0 = [];
              renderState.scripts.add(resource$jscomp$0);
              pushScriptImpl(resource$jscomp$0, scriptProps);
            }
            textEmbedded && target$jscomp$0.push("<!-- -->");
            JSCompiler_inline_result$jscomp$5 = null;
          }
          return JSCompiler_inline_result$jscomp$5;
        case "style":
          var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
            target$jscomp$0.push(startChunkForTag("style"));
            var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
            for (propKey$jscomp$8 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$8)) {
                var propValue$jscomp$8 = props[propKey$jscomp$8];
                if (null != propValue$jscomp$8)
                  switch (propKey$jscomp$8) {
                    case "children":
                      children$jscomp$6 = propValue$jscomp$8;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$5 = propValue$jscomp$8;
                      break;
                    default:
                      pushAttribute(
                        target$jscomp$0,
                        propKey$jscomp$8,
                        propValue$jscomp$8
                      );
                  }
              }
            target$jscomp$0.push(">");
            var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
            "function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
            target$jscomp$0.push(endChunkForTag("style"));
            var JSCompiler_inline_result$jscomp$6 = null;
          } else {
            var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
            if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
              resumableState.styleResources[href$jscomp$0] = null;
              styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
                precedence: escapeTextForBrowser(precedence$jscomp$0),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map()
              }, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
              var nonceStyle = renderState.nonce.style;
              if (!nonceStyle || nonceStyle === nonce) {
                styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
                var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
                for (propKey$jscomp$9 in props)
                  if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                    var propValue$jscomp$9 = props[propKey$jscomp$9];
                    if (null != propValue$jscomp$9)
                      switch (propKey$jscomp$9) {
                        case "children":
                          children$jscomp$7 = propValue$jscomp$9;
                          break;
                        case "dangerouslySetInnerHTML":
                          innerHTML$jscomp$6 = propValue$jscomp$9;
                      }
                  }
                var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
                "function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(
                  ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
                );
                pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
              }
            }
            styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
            textEmbedded && target$jscomp$0.push("<!-- -->");
            JSCompiler_inline_result$jscomp$6 = void 0;
          }
          return JSCompiler_inline_result$jscomp$6;
        case "meta":
          var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
              target$jscomp$0,
              props,
              "meta",
              formatContext
            );
          else
            textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(
              renderState.charsetChunks,
              props,
              "meta",
              formatContext
            ) : "viewport" === props.name ? pushSelfClosing(
              renderState.viewportChunks,
              props,
              "meta",
              formatContext
            ) : pushSelfClosing(
              renderState.hoistableChunks,
              props,
              "meta",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$7;
        case "listing":
        case "pre":
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
          for (propKey$jscomp$10 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$10)) {
              var propValue$jscomp$10 = props[propKey$jscomp$10];
              if (null != propValue$jscomp$10)
                switch (propKey$jscomp$10) {
                  case "children":
                    children$jscomp$8 = propValue$jscomp$10;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$7 = propValue$jscomp$10;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$10,
                      propValue$jscomp$10
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(">");
          if (null != innerHTML$jscomp$7) {
            if (null != children$jscomp$8)
              throw Error(
                "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
              );
            if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            var html = innerHTML$jscomp$7.__html;
            null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push("\n", html) : target$jscomp$0.push("" + html));
          }
          "string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push("\n");
          return children$jscomp$8;
        case "img":
          var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
          if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
            null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = true);
            var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
            if (resource$jscomp$1) {
              if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
                promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
            } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
              resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
              var input = props.crossOrigin;
              var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
              var headers = renderState.headers, header;
              headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
                imageSrcSet: props.srcSet,
                imageSizes: props.sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
                rel: "preload",
                as: "image",
                href: srcSet ? void 0 : src,
                imageSrcSet: srcSet,
                imageSizes: sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
            }
          }
          return pushSelfClosing(target$jscomp$0, props, "img", formatContext);
        case "base":
        case "area":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "param":
        case "source":
        case "track":
        case "wbr":
          return pushSelfClosing(target$jscomp$0, props, type, formatContext);
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          break;
        case "head":
          if (2 > formatContext.insertionMode) {
            var preamble = preambleState || renderState.preamble;
            if (preamble.headChunks)
              throw Error("The `<head>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push("<!--head-->");
            preamble.headChunks = [];
            var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
              preamble.headChunks,
              props,
              "head",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "head",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$9;
        case "body":
          if (2 > formatContext.insertionMode) {
            var preamble$jscomp$0 = preambleState || renderState.preamble;
            if (preamble$jscomp$0.bodyChunks)
              throw Error("The `<body>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push("<!--body-->");
            preamble$jscomp$0.bodyChunks = [];
            var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
              preamble$jscomp$0.bodyChunks,
              props,
              "body",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "body",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$10;
        case "html":
          if (0 === formatContext.insertionMode) {
            var preamble$jscomp$1 = preambleState || renderState.preamble;
            if (preamble$jscomp$1.htmlChunks)
              throw Error("The `<html>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push("<!--html-->");
            preamble$jscomp$1.htmlChunks = [""];
            var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
              preamble$jscomp$1.htmlChunks,
              props,
              "html",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "html",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$11;
        default:
          if (-1 !== type.indexOf("-")) {
            target$jscomp$0.push(startChunkForTag(type));
            var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
            for (propKey$jscomp$11 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$11)) {
                var propValue$jscomp$11 = props[propKey$jscomp$11];
                if (null != propValue$jscomp$11) {
                  var attributeName = propKey$jscomp$11;
                  switch (propKey$jscomp$11) {
                    case "children":
                      children$jscomp$9 = propValue$jscomp$11;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$8 = propValue$jscomp$11;
                      break;
                    case "style":
                      pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                      break;
                    case "suppressContentEditableWarning":
                    case "suppressHydrationWarning":
                    case "ref":
                      break;
                    case "className":
                      attributeName = "class";
                    default:
                      if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && false !== propValue$jscomp$11) {
                        if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                        else if ("object" === typeof propValue$jscomp$11) continue;
                        target$jscomp$0.push(
                          " ",
                          attributeName,
                          '="',
                          escapeTextForBrowser(propValue$jscomp$11),
                          '"'
                        );
                      }
                  }
                }
              }
            pushViewTransitionAttributes(target$jscomp$0, formatContext);
            target$jscomp$0.push(">");
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
            return children$jscomp$9;
          }
      }
      return pushStartGenericElement(target$jscomp$0, props, type, formatContext);
    }
    var endTagCache = /* @__PURE__ */ new Map();
    function endChunkForTag(tag) {
      var chunk = endTagCache.get(tag);
      void 0 === chunk && (chunk = "</" + tag + ">", endTagCache.set(tag, chunk));
      return chunk;
    }
    function hoistPreambleState(renderState, preambleState) {
      renderState = renderState.preamble;
      null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
      null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
      null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
    }
    function writeBootstrap(destination, renderState) {
      renderState = renderState.bootstrapChunks;
      for (var i = 0; i < renderState.length - 1; i++)
        destination.push(renderState[i]);
      return i < renderState.length ? (i = renderState[i], renderState.length = 0, destination.push(i)) : true;
    }
    function writeStartPendingSuspenseBoundary(destination, renderState, id) {
      destination.push('<!--$?--><template id="');
      if (null === id)
        throw Error(
          "An ID must have been assigned before we can complete the boundary."
        );
      destination.push(renderState.boundaryPrefix);
      renderState = id.toString(16);
      destination.push(renderState);
      return destination.push('"></template>');
    }
    function writeStartSegment(destination, renderState, formatContext, id) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return destination.push('<div hidden id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 4:
          return destination.push('<svg aria-hidden="true" style="display:none" id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 5:
          return destination.push('<math aria-hidden="true" style="display:none" id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 6:
          return destination.push('<table hidden id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 7:
          return destination.push('<table hidden><tbody id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 8:
          return destination.push('<table hidden><tr id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        case 9:
          return destination.push('<table hidden><colgroup id="'), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push('">');
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    function writeEndSegment(destination, formatContext) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return destination.push("</div>");
        case 4:
          return destination.push("</svg>");
        case 5:
          return destination.push("</math>");
        case 6:
          return destination.push("</table>");
        case 7:
          return destination.push("</tbody></table>");
        case 8:
          return destination.push("</tr></table>");
        case 9:
          return destination.push("</colgroup></table>");
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
    function escapeJSStringsForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInInstructionScripts,
        function(match) {
          switch (match) {
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
    function escapeJSObjectForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInScripts,
        function(match) {
          switch (match) {
            case "&":
              return "\\u0026";
            case ">":
              return "\\u003e";
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var currentlyRenderingBoundaryHasStylesToHoist = false;
    var destinationHasCapacity = true;
    function flushStyleTagsLateForBoundary(styleQueue) {
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
      if (hrefs.length) {
        this.push(currentlyFlushingRenderState.startInlineStyle);
        this.push(' media="not all" data-precedence="');
        this.push(styleQueue.precedence);
        for (this.push('" data-href="'); i < hrefs.length - 1; i++)
          this.push(hrefs[i]), this.push(" ");
        this.push(hrefs[i]);
        this.push('">');
        for (i = 0; i < rules.length; i++) this.push(rules[i]);
        destinationHasCapacity = this.push("</style>");
        currentlyRenderingBoundaryHasStylesToHoist = true;
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function hasStylesToHoist(stylesheet) {
      return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = true : false;
    }
    function writeHoistablesForBoundary(destination, hoistableState, renderState) {
      currentlyRenderingBoundaryHasStylesToHoist = false;
      destinationHasCapacity = true;
      currentlyFlushingRenderState = renderState;
      hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
      currentlyFlushingRenderState = null;
      hoistableState.stylesheets.forEach(hasStylesToHoist);
      currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
      return destinationHasCapacity;
    }
    function flushResource(resource) {
      for (var i = 0; i < resource.length; i++) this.push(resource[i]);
      resource.length = 0;
    }
    var stylesheetFlushingQueue = [];
    function flushStyleInPreamble(stylesheet) {
      pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
      for (var i = 0; i < stylesheetFlushingQueue.length; i++)
        this.push(stylesheetFlushingQueue[i]);
      stylesheetFlushingQueue.length = 0;
      stylesheet.state = 2;
    }
    function flushStylesInPreamble(styleQueue) {
      var hasStylesheets = 0 < styleQueue.sheets.size;
      styleQueue.sheets.forEach(flushStyleInPreamble, this);
      styleQueue.sheets.clear();
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
      if (!hasStylesheets || hrefs.length) {
        this.push(currentlyFlushingRenderState.startInlineStyle);
        this.push(' data-precedence="');
        this.push(styleQueue.precedence);
        styleQueue = 0;
        if (hrefs.length) {
          for (this.push('" data-href="'); styleQueue < hrefs.length - 1; styleQueue++)
            this.push(hrefs[styleQueue]), this.push(" ");
          this.push(hrefs[styleQueue]);
        }
        this.push('">');
        for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
          this.push(rules[styleQueue]);
        this.push("</style>");
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function preloadLateStyle(stylesheet) {
      if (0 === stylesheet.state) {
        stylesheet.state = 1;
        var props = stylesheet.props;
        pushLinkImpl(stylesheetFlushingQueue, {
          rel: "preload",
          as: "style",
          href: stylesheet.props.href,
          crossOrigin: props.crossOrigin,
          fetchPriority: props.fetchPriority,
          integrity: props.integrity,
          media: props.media,
          hrefLang: props.hrefLang,
          referrerPolicy: props.referrerPolicy
        });
        for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
          this.push(stylesheetFlushingQueue[stylesheet]);
        stylesheetFlushingQueue.length = 0;
      }
    }
    function preloadLateStyles(styleQueue) {
      styleQueue.sheets.forEach(preloadLateStyle, this);
      styleQueue.sheets.clear();
    }
    function pushCompletedShellIdAttribute(target, resumableState) {
      0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(
        ' id="',
        escapeTextForBrowser("_" + resumableState.idPrefix + "R_"),
        '"'
      ));
    }
    function writeStyleResourceDependenciesInJS(destination, hoistableState) {
      destination.push("[");
      var nextArrayOpenBrackChunk = "[";
      hoistableState.stylesheets.forEach(function(resource) {
        if (2 !== resource.state)
          if (3 === resource.state)
            destination.push(nextArrayOpenBrackChunk), resource = escapeJSObjectForInstructionScripts(
              "" + resource.props.href
            ), destination.push(resource), destination.push("]"), nextArrayOpenBrackChunk = ",[";
          else {
            destination.push(nextArrayOpenBrackChunk);
            var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
            coercedHref = escapeJSObjectForInstructionScripts(coercedHref);
            destination.push(coercedHref);
            precedence = "" + precedence;
            destination.push(",");
            precedence = escapeJSObjectForInstructionScripts(precedence);
            destination.push(precedence);
            for (var propKey in props)
              if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence))
                switch (propKey) {
                  case "href":
                  case "rel":
                  case "precedence":
                  case "data-precedence":
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  default:
                    writeStyleResourceAttributeInJS(
                      destination,
                      propKey,
                      precedence
                    );
                }
            destination.push("]");
            nextArrayOpenBrackChunk = ",[";
            resource.state = 3;
          }
      });
      destination.push("]");
    }
    function writeStyleResourceAttributeInJS(destination, name, value) {
      var attributeName = name.toLowerCase();
      switch (typeof value) {
        case "function":
        case "symbol":
          return;
      }
      switch (name) {
        case "innerHTML":
        case "dangerouslySetInnerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "style":
        case "ref":
          return;
        case "className":
          attributeName = "class";
          name = "" + value;
          break;
        case "hidden":
          if (false === value) return;
          name = "";
          break;
        case "src":
        case "href":
          value = sanitizeURL(value);
          name = "" + value;
          break;
        default:
          if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name))
            return;
          name = "" + value;
      }
      destination.push(",");
      attributeName = escapeJSObjectForInstructionScripts(attributeName);
      destination.push(attributeName);
      destination.push(",");
      attributeName = escapeJSObjectForInstructionScripts(name);
      destination.push(attributeName);
    }
    function createHoistableState() {
      return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set(), suspenseyImages: false };
    }
    function prefetchDNS(href) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          if (!resumableState.dnsResources.hasOwnProperty(href)) {
            resumableState.dnsResources[href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)
              JSCompiler_temp = (header = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
            JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, { href, rel: "dns-prefetch" }), renderState.preconnects.add(header));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.D(href);
    }
    function preconnect(href, crossOrigin) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
          if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
            resumableState.connectResources[bucket][href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
              JSCompiler_temp = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=preconnect";
              if ("string" === typeof crossOrigin) {
                var escapedCrossOrigin = ("" + crossOrigin).replace(
                  regexForLinkHeaderQuotedParamValueContext,
                  escapeStringForLinkHeaderQuotedParamValueContextReplacer
                );
                JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
              }
              JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
            }
            JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
              rel: "preconnect",
              href,
              crossOrigin
            }), renderState.preconnects.add(bucket));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.C(href, crossOrigin);
    }
    function preload(href, as, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (as && href) {
          switch (as) {
            case "image":
              if (options) {
                var imageSrcSet = options.imageSrcSet;
                var imageSizes = options.imageSizes;
                var fetchPriority = options.fetchPriority;
              }
              var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
              if (resumableState.imageResources.hasOwnProperty(key)) return;
              resumableState.imageResources[key] = PRELOAD_NO_CREDS;
              resumableState = renderState.headers;
              var header;
              resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(
                resumableState,
                assign(
                  { rel: "preload", href: imageSrcSet ? void 0 : href, as },
                  options
                )
              ), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
              break;
            case "style":
              if (resumableState.styleResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.stylesheets.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              break;
            case "script":
              if (resumableState.scriptResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              renderState.preloads.scripts.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              break;
            default:
              if (resumableState.unknownResources.hasOwnProperty(as)) {
                if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href))
                  return;
              } else
                imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
              imageSrcSet[href] = PRELOAD_NO_CREDS;
              if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2)))
                renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
              else
                switch (resumableState = [], href = assign({ rel: "preload", href, as }, options), pushLinkImpl(resumableState, href), as) {
                  case "font":
                    renderState.fontPreloads.add(resumableState);
                    break;
                  default:
                    renderState.bulkPreloads.add(resumableState);
                }
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.L(href, as, options);
    }
    function preloadModule(href, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          var as = options && "string" === typeof options.as ? options.as : "script";
          switch (as) {
            case "script":
              if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
              as = [];
              resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.moduleScripts.set(href, as);
              break;
            default:
              if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
                var resources = resumableState.moduleUnknownResources[as];
                if (resources.hasOwnProperty(href)) return;
              } else
                resources = {}, resumableState.moduleUnknownResources[as] = resources;
              as = [];
              resources[href] = PRELOAD_NO_CREDS;
          }
          pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
          renderState.bulkPreloads.add(as);
          enqueueFlush(request);
        }
      } else previousDispatcher.m(href, options);
    }
    function preinitStyle(href, precedence, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          precedence = precedence || "default";
          var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
          null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
            precedence: escapeTextForBrowser(precedence),
            rules: [],
            hrefs: [],
            sheets: /* @__PURE__ */ new Map()
          }, renderState.styles.set(precedence, styleQueue)), precedence = {
            state: 0,
            props: assign(
              { rel: "stylesheet", href, "data-precedence": precedence },
              options
            )
          }, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
        }
      } else previousDispatcher.S(href, precedence, options);
    }
    function preinitScript(src, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
          null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({ src, async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.X(src, options);
    }
    function preinitModuleScript(src, options) {
      var request = currentRequest ? currentRequest : null;
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
            src
          ) ? resumableState.moduleScriptResources[src] : void 0;
          null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({ src, type: "module", async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.M(src, options);
    }
    function adoptPreloadCredentials(target, preloadState) {
      null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
      null == target.integrity && (target.integrity = preloadState[1]);
    }
    function getPreloadAsHeader(href, as, params) {
      href = ("" + href).replace(
        regexForHrefInLinkHeaderURLContext,
        escapeHrefForLinkHeaderURLContextReplacer
      );
      as = ("" + as).replace(
        regexForLinkHeaderQuotedParamValueContext,
        escapeStringForLinkHeaderQuotedParamValueContextReplacer
      );
      as = "<" + href + '>; rel=preload; as="' + as + '"';
      for (var paramName in params)
        hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + '="' + ("" + href).replace(
          regexForLinkHeaderQuotedParamValueContext,
          escapeStringForLinkHeaderQuotedParamValueContextReplacer
        ) + '"'));
      return as;
    }
    var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
    function escapeHrefForLinkHeaderURLContextReplacer(match) {
      switch (match) {
        case "<":
          return "%3C";
        case ">":
          return "%3E";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
    function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
      switch (match) {
        case '"':
          return "%22";
        case "'":
          return "%27";
        case ";":
          return "%3B";
        case ",":
          return "%2C";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    function hoistStyleQueueDependency(styleQueue) {
      this.styles.add(styleQueue);
    }
    function hoistStylesheetDependency(stylesheet) {
      this.stylesheets.add(stylesheet);
    }
    function hoistHoistables(parentState, childState) {
      childState.styles.forEach(hoistStyleQueueDependency, parentState);
      childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
      childState.suspenseyImages && (parentState.suspenseyImages = true);
    }
    function createRenderState(resumableState, generateStaticMarkup) {
      var idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
      void 0 !== bootstrapScriptContent && (bootstrapChunks.push("<script"), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
        ">",
        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
        "</script>"
      ));
      bootstrapScriptContent = idPrefix + "P:";
      var JSCompiler_object_inline_segmentPrefix_1724 = idPrefix + "S:";
      idPrefix += "B:";
      var JSCompiler_object_inline_preconnects_1738 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_fontPreloads_1739 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_highImagePreloads_1740 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_styles_1741 = /* @__PURE__ */ new Map(), JSCompiler_object_inline_bootstrapScripts_1742 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_scripts_1743 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_bulkPreloads_1744 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_preloads_1745 = {
        images: /* @__PURE__ */ new Map(),
        stylesheets: /* @__PURE__ */ new Map(),
        scripts: /* @__PURE__ */ new Map(),
        moduleScripts: /* @__PURE__ */ new Map()
      };
      if (void 0 !== bootstrapScripts)
        for (var i = 0; i < bootstrapScripts.length; i++) {
          var scriptConfig = bootstrapScripts[i], src, crossOrigin = void 0, integrity = void 0, props = {
            rel: "preload",
            as: "script",
            fetchPriority: "low",
            nonce: void 0
          };
          "string" === typeof scriptConfig ? props.href = src = scriptConfig : (props.href = src = scriptConfig.src, props.integrity = integrity = "string" === typeof scriptConfig.integrity ? scriptConfig.integrity : void 0, props.crossOrigin = crossOrigin = "string" === typeof scriptConfig || null == scriptConfig.crossOrigin ? void 0 : "use-credentials" === scriptConfig.crossOrigin ? "use-credentials" : "");
          scriptConfig = resumableState;
          var href = src;
          scriptConfig.scriptResources[href] = null;
          scriptConfig.moduleScriptResources[href] = null;
          scriptConfig = [];
          pushLinkImpl(scriptConfig, props);
          JSCompiler_object_inline_bootstrapScripts_1742.add(scriptConfig);
          bootstrapChunks.push('<script src="', escapeTextForBrowser(src), '"');
          "string" === typeof integrity && bootstrapChunks.push(
            ' integrity="',
            escapeTextForBrowser(integrity),
            '"'
          );
          "string" === typeof crossOrigin && bootstrapChunks.push(
            ' crossorigin="',
            escapeTextForBrowser(crossOrigin),
            '"'
          );
          pushCompletedShellIdAttribute(bootstrapChunks, resumableState);
          bootstrapChunks.push(' async=""></script>');
        }
      if (void 0 !== bootstrapModules)
        for (bootstrapScripts = 0; bootstrapScripts < bootstrapModules.length; bootstrapScripts++)
          props = bootstrapModules[bootstrapScripts], crossOrigin = src = void 0, integrity = {
            rel: "modulepreload",
            fetchPriority: "low",
            nonce: void 0
          }, "string" === typeof props ? integrity.href = i = props : (integrity.href = i = props.src, integrity.integrity = crossOrigin = "string" === typeof props.integrity ? props.integrity : void 0, integrity.crossOrigin = src = "string" === typeof props || null == props.crossOrigin ? void 0 : "use-credentials" === props.crossOrigin ? "use-credentials" : ""), props = resumableState, scriptConfig = i, props.scriptResources[scriptConfig] = null, props.moduleScriptResources[scriptConfig] = null, props = [], pushLinkImpl(props, integrity), JSCompiler_object_inline_bootstrapScripts_1742.add(props), bootstrapChunks.push(
            '<script type="module" src="',
            escapeTextForBrowser(i),
            '"'
          ), "string" === typeof crossOrigin && bootstrapChunks.push(
            ' integrity="',
            escapeTextForBrowser(crossOrigin),
            '"'
          ), "string" === typeof src && bootstrapChunks.push(
            ' crossorigin="',
            escapeTextForBrowser(src),
            '"'
          ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(' async=""></script>');
      return {
        placeholderPrefix: bootstrapScriptContent,
        segmentPrefix: JSCompiler_object_inline_segmentPrefix_1724,
        boundaryPrefix: idPrefix,
        startInlineScript: "<script",
        startInlineStyle: "<style",
        preamble: { htmlChunks: null, headChunks: null, bodyChunks: null },
        externalRuntimeScript: null,
        bootstrapChunks,
        importMapChunks: [],
        onHeaders: void 0,
        headers: null,
        resets: {
          font: {},
          dns: {},
          connect: { default: {}, anonymous: {}, credentials: {} },
          image: {},
          style: {}
        },
        charsetChunks: [],
        viewportChunks: [],
        hoistableChunks: [],
        preconnects: JSCompiler_object_inline_preconnects_1738,
        fontPreloads: JSCompiler_object_inline_fontPreloads_1739,
        highImagePreloads: JSCompiler_object_inline_highImagePreloads_1740,
        styles: JSCompiler_object_inline_styles_1741,
        bootstrapScripts: JSCompiler_object_inline_bootstrapScripts_1742,
        scripts: JSCompiler_object_inline_scripts_1743,
        bulkPreloads: JSCompiler_object_inline_bulkPreloads_1744,
        preloads: JSCompiler_object_inline_preloads_1745,
        nonce: { script: void 0, style: void 0 },
        stylesToHoist: false,
        generateStaticMarkup
      };
    }
    function pushTextInstance(target, text, renderState, textEmbedded) {
      if (renderState.generateStaticMarkup)
        return target.push(escapeTextForBrowser(text)), false;
      "" === text ? target = textEmbedded : (textEmbedded && target.push("<!-- -->"), target.push(escapeTextForBrowser(text)), target = true);
      return target;
    }
    function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
      renderState.generateStaticMarkup || lastPushedText && textEmbedded && target.push("<!-- -->");
    }
    var bind = Function.prototype.bind;
    var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
        case REACT_VIEW_TRANSITION_TYPE:
          return "ViewTransition";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {
            }
        }
      return null;
    }
    var emptyContextObject = {};
    var currentActiveSnapshot = null;
    function popToNearestCommonAncestor(prev, next) {
      if (prev !== next) {
        prev.context._currentValue2 = prev.parentValue;
        prev = prev.parent;
        var parentNext = next.parent;
        if (null === prev) {
          if (null !== parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
        } else {
          if (null === parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
          popToNearestCommonAncestor(prev, parentNext);
        }
        next.context._currentValue2 = next.value;
      }
    }
    function popAllPrevious(prev) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      null !== prev && popAllPrevious(prev);
    }
    function pushAllNext(next) {
      var parentNext = next.parent;
      null !== parentNext && pushAllNext(parentNext);
      next.context._currentValue2 = next.value;
    }
    function popPreviousToCommonLevel(prev, next) {
      prev.context._currentValue2 = prev.parentValue;
      prev = prev.parent;
      if (null === prev)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
    }
    function popNextToCommonLevel(prev, next) {
      var parentNext = next.parent;
      if (null === parentNext)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
      next.context._currentValue2 = next.value;
    }
    function switchContext(newSnapshot) {
      var prev = currentActiveSnapshot;
      prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
    }
    var classComponentUpdater = {
      enqueueSetState: function(inst, payload) {
        inst = inst._reactInternals;
        null !== inst.queue && inst.queue.push(payload);
      },
      enqueueReplaceState: function(inst, payload) {
        inst = inst._reactInternals;
        inst.replace = true;
        inst.queue = [payload];
      },
      enqueueForceUpdate: function() {
      }
    };
    var emptyTreeContext = { id: 1, overflow: "" };
    function getTreeId(context) {
      var overflow = context.overflow;
      context = context.id;
      return (context & ~(1 << 32 - clz32(context) - 1)).toString(32) + overflow;
    }
    function pushTreeContext(baseContext, totalChildren, index) {
      var baseIdWithLeadingBit = baseContext.id;
      baseContext = baseContext.overflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength);
      index += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        return {
          id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
          overflow: length + baseContext
        };
      }
      return {
        id: 1 << length | index << baseLength | baseIdWithLeadingBit,
        overflow: baseContext
      };
    }
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
    var log = Math.log;
    var LN2 = Math.LN2;
    function clz32Fallback(x) {
      x >>>= 0;
      return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
    }
    function noop() {
    }
    var SuspenseException = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    );
    function trackUsedThenable(thenableState2, thenable, index) {
      index = thenableState2[index];
      void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          thenableState2 = thenable.reason;
          if (void 0 === thenableState2 && !("reason" in thenable))
            throw Error(
              "A rejected Promise was passed to React without a `reason` property. React threw a generic error from where the Promise was used to assist in identifying the problematic Promise. Make sure that instrumented Promises correctly set the `reason` property when setting `status` to `'rejected'`."
            );
          throw thenableState2;
        default:
          "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
            function(fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function(error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          ));
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    var suspendedThenable = null;
    function getSuspendedThenable() {
      if (null === suspendedThenable)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    var currentlyRenderingComponent = null;
    var currentlyRenderingTask = null;
    var currentlyRenderingRequest = null;
    var currentlyRenderingKeyPath = null;
    var firstWorkInProgressHook = null;
    var workInProgressHook = null;
    var isReRender = false;
    var didScheduleRenderPhaseUpdate = false;
    var localIdCounter = 0;
    var actionStateCounter = 0;
    var actionStateMatchingIndex = -1;
    var thenableIndexCounter = 0;
    var thenableState = null;
    function createRecoverableError(recoverable) {
      recoverable = recoverable._reason;
      if ("function" === typeof recoverable)
        try {
          var initializedReason = recoverable();
        } catch ($jscomp$unused$catch) {
          initializedReason = "The reason for browser-only rendering could not be determined because its initializer threw.";
        }
      else initializedReason = recoverable;
      initializedReason = Error(
        "Browser-only rendering was requested by `browser()`.",
        void 0 === recoverable ? void 0 : { cause: initializedReason }
      );
      Object.defineProperty(initializedReason, REACT_RECOVERABLE_TYPE, {
        value: true
      });
      return initializedReason;
    }
    function isRecoverableError(error) {
      return "object" !== typeof error || null === error ? false : true === error[REACT_RECOVERABLE_TYPE];
    }
    function cloneRecoverableErrorAsFatal(recoverableError) {
      var fatalRecoverableError = Error(
        "The server render could not complete because client rendering was requested outside a Suspense boundary. See this error's cause for additional details.",
        hasOwnProperty.call(recoverableError, "cause") ? { cause: recoverableError.cause } : void 0
      );
      recoverableError = recoverableError.stack;
      if (void 0 !== recoverableError) {
        var frameStart = recoverableError.indexOf("\n");
        fatalRecoverableError.stack = fatalRecoverableError.name + ": " + fatalRecoverableError.message + (-1 === frameStart ? "" : recoverableError.slice(frameStart));
      } else fatalRecoverableError.stack = void 0;
      return fatalRecoverableError;
    }
    var renderPhaseUpdates = null;
    var numberOfReRenders = 0;
    function resolveCurrentlyRenderingComponent() {
      if (null === currentlyRenderingComponent)
        throw Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
      return currentlyRenderingComponent;
    }
    function createHook() {
      if (0 < numberOfReRenders)
        throw Error("Rendered more hooks than during the previous render");
      return { memoizedState: null, queue: null, next: null };
    }
    function createWorkInProgressHook() {
      null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = false, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = true, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = false, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = true, workInProgressHook = workInProgressHook.next);
      return workInProgressHook;
    }
    function getThenableStateAfterSuspending() {
      var state = thenableState;
      thenableState = null;
      return state;
    }
    function resetHooksState() {
      currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
      didScheduleRenderPhaseUpdate = false;
      firstWorkInProgressHook = null;
      numberOfReRenders = 0;
      workInProgressHook = renderPhaseUpdates = null;
    }
    function basicStateReducer(state, action) {
      return "function" === typeof action ? action(state) : action;
    }
    function useReducer(reducer, initialArg, init) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      if (isReRender) {
        var queue = workInProgressHook.queue;
        initialArg = queue.dispatch;
        if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
          renderPhaseUpdates.delete(queue);
          queue = workInProgressHook.memoizedState;
          do
            queue = reducer(queue, init.action), init = init.next;
          while (null !== init);
          workInProgressHook.memoizedState = queue;
          return [queue, initialArg];
        }
        return [workInProgressHook.memoizedState, initialArg];
      }
      reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
      workInProgressHook.memoizedState = reducer;
      reducer = workInProgressHook.queue = { last: null, dispatch: null };
      reducer = reducer.dispatch = dispatchAction.bind(
        null,
        currentlyRenderingComponent,
        reducer
      );
      return [workInProgressHook.memoizedState, reducer];
    }
    function useMemo3(nextCreate, deps) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      if (null !== workInProgressHook) {
        var prevState = workInProgressHook.memoizedState;
        if (null !== prevState && null !== deps) {
          var prevDeps = prevState[1];
          a: if (null === prevDeps) prevDeps = false;
          else {
            for (var i = 0; i < prevDeps.length && i < deps.length; i++)
              if (!objectIs(deps[i], prevDeps[i])) {
                prevDeps = false;
                break a;
              }
            prevDeps = true;
          }
          if (prevDeps) return prevState[0];
        }
      }
      nextCreate = nextCreate();
      workInProgressHook.memoizedState = [nextCreate, deps];
      return nextCreate;
    }
    function dispatchAction(componentIdentity, queue, action) {
      if (25 <= numberOfReRenders)
        throw Error(
          "Too many re-renders. React limits the number of renders to prevent an infinite loop."
        );
      if (componentIdentity === currentlyRenderingComponent)
        if (didScheduleRenderPhaseUpdate = true, componentIdentity = { action, next: null }, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action)
          renderPhaseUpdates.set(queue, componentIdentity);
        else {
          for (queue = action; null !== queue.next; ) queue = queue.next;
          queue.next = componentIdentity;
        }
    }
    function throwOnUseEffectEventCall() {
      throw Error(
        "A function wrapped in useEffectEvent can't be called during rendering."
      );
    }
    function unsupportedStartTransition() {
      throw Error("startTransition cannot be called during server rendering.");
    }
    function unsupportedSetOptimisticState() {
      throw Error("Cannot update optimistic state while rendering.");
    }
    function useActionState(action, initialState, permalink) {
      resolveCurrentlyRenderingComponent();
      var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
      if ("function" === typeof action.$$FORM_ACTION) {
        var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
        request = request.formState;
        var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
        if (null !== request && "function" === typeof isSignatureEqual) {
          var postbackKey = request[1];
          isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
            JSON.stringify([componentKeyPath, null, actionStateHookIndex]),
            0
          ), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
        }
        var boundAction = action.bind(null, initialState);
        action = function(payload) {
          boundAction(payload);
        };
        "function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix2) {
          prefix2 = boundAction.$$FORM_ACTION(prefix2);
          void 0 !== permalink && (permalink += "", prefix2.action = permalink);
          var formData = prefix2.data;
          formData && (null === nextPostbackStateKey && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(
            JSON.stringify([
              componentKeyPath,
              null,
              actionStateHookIndex
            ]),
            0
          )), formData.append("$ACTION_KEY", nextPostbackStateKey));
          return prefix2;
        });
        return [initialState, action, false];
      }
      var boundAction$22 = action.bind(null, initialState);
      return [
        initialState,
        function(payload) {
          boundAction$22(payload);
        },
        false
      ];
    }
    function unwrapThenable(thenable) {
      var index = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      return trackUsedThenable(thenableState, thenable, index);
    }
    function unsupportedRefresh() {
      throw Error("Cache cannot be refreshed during server rendering.");
    }
    var HooksDispatcher = {
      readContext: function(context) {
        return context._currentValue2;
      },
      use: function(usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return unwrapThenable(usable);
          if (usable.$$typeof === REACT_RECOVERABLE_TYPE)
            throw createRecoverableError(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE)
            return usable._currentValue2;
        }
        throw Error("An unsupported type was passed to use(): " + String(usable));
      },
      useContext: function(context) {
        resolveCurrentlyRenderingComponent();
        return context._currentValue2;
      },
      useMemo: useMemo3,
      useReducer,
      useRef: function(initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
      },
      useState: function(initialState) {
        return useReducer(basicStateReducer, initialState);
      },
      useInsertionEffect: noop,
      useLayoutEffect: noop,
      useCallback: function(callback, deps) {
        return useMemo3(function() {
          return callback;
        }, deps);
      },
      useImperativeHandle: noop,
      useEffect: noop,
      useDebugValue: noop,
      useDeferredValue: function(value, initialValue) {
        resolveCurrentlyRenderingComponent();
        return void 0 !== initialValue ? initialValue : value;
      },
      useTransition: function() {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      },
      useId: function() {
        var treeId = getTreeId(currentlyRenderingTask.treeContext), resumableState = currentResumableState;
        if (null === resumableState)
          throw Error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component."
          );
        var localId = localIdCounter++;
        return makeId(resumableState, treeId, localId);
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        if (void 0 === getServerSnapshot)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        return getServerSnapshot();
      },
      useOptimistic: function(passthrough) {
        resolveCurrentlyRenderingComponent();
        return [passthrough, unsupportedSetOptimisticState];
      },
      useActionState,
      useFormState: useActionState,
      useHostTransitionStatus: function() {
        resolveCurrentlyRenderingComponent();
        return sharedNotPendingObject;
      },
      useMemoCache: function(size) {
        for (var data = Array(size), i = 0; i < size; i++)
          data[i] = REACT_MEMO_CACHE_SENTINEL;
        return data;
      },
      useCacheRefresh: function() {
        return unsupportedRefresh;
      },
      useEffectEvent: function() {
        return throwOnUseEffectEventCall;
      }
    };
    var currentResumableState = null;
    var DefaultAsyncDispatcher = {
      getCacheForType: function() {
        throw Error("Not implemented.");
      },
      cacheSignal: function() {
        throw Error("Not implemented.");
      }
    };
    var prefix;
    var suffix;
    function describeBuiltInComponentFrame(name) {
      if (void 0 === prefix)
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || "";
          suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return "\n" + prefix + name + suffix;
    }
    var reentry = false;
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) return "";
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function() {
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    var control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$24) {
                    control = x$24;
                  }
                  Fake = false;
                  try {
                    var prevProps = Object.getOwnPropertyDescriptor(
                      fn.prototype,
                      "props"
                    );
                    Object.defineProperty(fn.prototype, "props", {
                      configurable: true,
                      set: function() {
                        throw Error();
                      }
                    });
                    Fake = true;
                    new fn();
                  } finally {
                    Fake && (void 0 !== prevProps ? Object.defineProperty(fn.prototype, "props", prevProps) : delete fn.prototype.props);
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (x$25) {
                  control = x$25;
                }
                (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
                });
              }
            } catch (sample) {
              if (sample && control && "string" === typeof sample.stack)
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name"
        );
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
          for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
            RunInRootFrame++;
          for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
            "DetermineComponentFrameRoot"
          ); )
            namePropDescriptor++;
          if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
            for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
              namePropDescriptor--;
          for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
            if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
              if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                do
                  if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                    var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                    fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                    return frame;
                  }
                while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
              }
              break;
            }
        }
      } finally {
        reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
      }
      return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
    }
    function describeComponentStackByType(type) {
      if ("string" === typeof type) return describeBuiltInComponentFrame(type);
      if ("function" === typeof type)
        return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, true) : describeNativeComponentFrame(type, false);
      if ("object" === typeof type && null !== type) {
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeNativeComponentFrame(type.render, false);
          case REACT_MEMO_TYPE:
            return describeNativeComponentFrame(type.type, false);
          case REACT_LAZY_TYPE:
            var lazyComponent = type, payload = lazyComponent._payload;
            lazyComponent = lazyComponent._init;
            try {
              type = lazyComponent(payload);
            } catch (x) {
              return describeBuiltInComponentFrame("Lazy");
            }
            return describeComponentStackByType(type);
        }
        if ("string" === typeof type.name) {
          a: {
            payload = type.name;
            lazyComponent = type.env;
            var location = type.debugLocation;
            if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = void 0, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
              payload = "\n" + type;
              break a;
            }
            payload = describeBuiltInComponentFrame(
              payload + (lazyComponent ? " [" + lazyComponent + "]" : "")
            );
          }
          return payload;
        }
      }
      switch (type) {
        case REACT_SUSPENSE_LIST_TYPE:
          return describeBuiltInComponentFrame("SuspenseList");
        case REACT_SUSPENSE_TYPE:
          return describeBuiltInComponentFrame("Suspense");
        case REACT_VIEW_TRANSITION_TYPE:
          return describeBuiltInComponentFrame("ViewTransition");
      }
      return "";
    }
    function isEligibleForOutlining(request, boundary) {
      return (500 < boundary.byteSize || boundary.defer) && null === boundary.preamble;
    }
    function defaultErrorHandler(error) {
      if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
        var JSCompiler_inline_result = error.environmentName;
        error = [error].slice(0);
        "string" === typeof error[0] ? error.splice(
          0,
          1,
          "[%s] " + error[0],
          " " + JSCompiler_inline_result + " "
        ) : error.splice(0, 0, "[%s]", " " + JSCompiler_inline_result + " ");
        error.unshift(console);
        JSCompiler_inline_result = bind.apply(console.error, error);
        JSCompiler_inline_result();
      } else console.error(error);
      return null;
    }
    function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError2, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      var abortSet = /* @__PURE__ */ new Set();
      this.destination = null;
      this.flushScheduled = false;
      this.resumableState = resumableState;
      this.renderState = renderState;
      this.rootFormatContext = rootFormatContext;
      this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
      this.status = 10;
      this.fatalError = null;
      this.aborted = false;
      this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
      this.completedPreambleSegments = this.completedRootSegment = null;
      this.byteSize = 0;
      this.abortableTasks = abortSet;
      this.pingedTasks = [];
      this.currentTask = null;
      this.clientRenderedBoundaries = [];
      this.completedBoundaries = [];
      this.partialBoundaries = [];
      this.postponedState = this.trackedPostpones = null;
      this.onError = void 0 === onError2 ? defaultErrorHandler : onError2;
      this.onBrowserBailout = void 0 === onBrowserBailout ? noop : onBrowserBailout;
      this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
      this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
      this.onShellError = void 0 === onShellError ? noop : onShellError;
      this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
      this.renderLifetimeController = null;
      this.formState = void 0 === formState ? null : formState;
    }
    function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError2, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      resumableState = new RequestInstance(
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError2,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        formState
      );
      renderState = createPendingSegment(
        resumableState,
        0,
        null,
        rootFormatContext,
        false,
        false
      );
      renderState.parentFlushed = true;
      children = createRenderTask(
        resumableState,
        null,
        children,
        -1,
        null,
        renderState,
        null,
        null,
        resumableState.abortableTasks,
        null,
        rootFormatContext,
        null,
        emptyTreeContext,
        null,
        null
      );
      pushComponentStack(children);
      resumableState.pingedTasks.push(children);
      return resumableState;
    }
    var currentRequest = null;
    function pingTask(request, task) {
      request.pingedTasks.push(task);
      1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, performWork(request));
    }
    function createSuspenseBoundary(request, row, fallbackAbortableTasks, preamble, defer) {
      fallbackAbortableTasks = {
        status: 0,
        rootSegmentID: -1,
        parentFlushed: false,
        pendingTasks: 0,
        row,
        completedSegments: [],
        byteSize: 0,
        defer,
        fallbackAbortableTasks,
        errorDigest: null,
        contentState: createHoistableState(),
        fallbackState: createHoistableState(),
        preamble,
        tracked: null
      };
      null !== row && (row.pendingTasks++, preamble = row.boundaries, null !== preamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, preamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
      return fallbackAbortableTasks;
    }
    function createRenderTask(request, thenableState2, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      var task = {
        replay: null,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment,
        blockedPreamble,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createReplayTask(request, thenableState2, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      replay.pendingTasks++;
      var task = {
        replay,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment: null,
        blockedPreamble: null,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
      return {
        status: 0,
        parentFlushed: false,
        id: -1,
        index,
        chunks: [],
        children: [],
        preambleChildren: [],
        parentFormatContext,
        boundary,
        lastPushedText,
        textEmbedded
      };
    }
    function pushComponentStack(task) {
      var node = task.node;
      if ("object" === typeof node && null !== node)
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            task.componentStack = { parent: task.componentStack, type: node.type };
        }
    }
    function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
      return null === componentStack ? null : { parent: componentStack.parent, type: "Suspense Fallback" };
    }
    function getThrownInfo(node$jscomp$0) {
      var errorInfo = {};
      node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
        configurable: true,
        enumerable: true,
        get: function() {
          try {
            var info = "", node = node$jscomp$0;
            do
              info += describeComponentStackByType(node.type), node = node.parent;
            while (node);
            var JSCompiler_inline_result = info;
          } catch (x) {
            JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
          }
          Object.defineProperty(errorInfo, "componentStack", {
            value: JSCompiler_inline_result
          });
          return JSCompiler_inline_result;
        }
      });
      return errorInfo;
    }
    function logRecoverableError(request, error, errorInfo) {
      if (isRecoverableError(error))
        return request = request.onBrowserBailout, request(error, errorInfo), "";
      request = request.onError;
      error = request(error, errorInfo);
      if (null == error || "string" === typeof error)
        return "" === error ? void 0 : error;
    }
    function fatalError(request, error) {
      var onShellError = request.onShellError, onFatalError = request.onFatalError;
      0 !== request.pendingRootTasks && onShellError(error);
      onFatalError(error);
      endRenderLifetime(request);
      null !== request.destination ? (request.status = 13, request.destination.destroy(error)) : (request.status = 12, request.aborted || (request.fatalError = error));
    }
    function finishSuspenseListRow(request, row) {
      unblockSuspenseListRow(request, row.next, row.hoistables);
    }
    function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
      for (; null !== unblockedRow; ) {
        null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
        var unblockedBoundaries = unblockedRow.boundaries;
        if (null !== unblockedBoundaries) {
          unblockedRow.boundaries = null;
          for (var i = 0; i < unblockedBoundaries.length; i++) {
            var unblockedBoundary = unblockedBoundaries[i];
            null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
            finishedTask(request, unblockedBoundary, null, null);
          }
        }
        unblockedRow.pendingTasks--;
        if (0 < unblockedRow.pendingTasks) break;
        inheritedHoistables = unblockedRow.hoistables;
        unblockedRow = unblockedRow.next;
      }
    }
    function tryToResolveTogetherRow(request, togetherRow) {
      var boundaries = togetherRow.boundaries;
      if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
        for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
          var rowBoundary = boundaries[i];
          if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
            allCompleteAndInlinable = false;
            break;
          }
        }
        allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
      }
    }
    function createSuspenseListRow(previousRow) {
      var newRow = {
        pendingTasks: 1,
        boundaries: null,
        hoistables: createHoistableState(),
        inheritedHoistables: null,
        together: false,
        next: null
      };
      null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
      return newRow;
    }
    function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
      var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
      task.keyPath = keyPath;
      keyPath = rows.length;
      var previousSuspenseListRow = null;
      if (null !== task.replay) {
        var resumeSlots = task.replay.slots;
        if (null !== resumeSlots && "object" === typeof resumeSlots)
          for (var n = 0; n < keyPath; n++) {
            var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
            task.row = previousSuspenseListRow = createSuspenseListRow(
              previousSuspenseListRow
            );
            task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
            var resumeSegmentID = resumeSlots[i];
            "number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode(request, task, node, i);
            0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          }
        else
          for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
            n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
        for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
          resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            revealOrder
          ), renderNode(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      else {
        resumeSlots = task.blockedSegment;
        n = resumeSlots.children.length;
        i = resumeSlots.chunks.length;
        for (node = 0; node < keyPath; node++) {
          resumeSegmentID = "unstable_legacy-backwards" === revealOrder ? keyPath - 1 - node : node;
          var node$39 = rows[resumeSegmentID];
          task.row = previousSuspenseListRow = createSuspenseListRow(
            previousSuspenseListRow
          );
          task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            resumeSegmentID
          );
          var newSegment = createPendingSegment(
            request,
            i,
            null,
            task.formatContext,
            0 === resumeSegmentID ? resumeSlots.lastPushedText : true,
            true
          );
          resumeSlots.children.splice(n, 0, newSegment);
          task.blockedSegment = newSegment;
          try {
            renderNode(request, task, node$39, resumeSegmentID), pushSegmentFinale(
              newSegment.chunks,
              request.renderState,
              newSegment.lastPushedText,
              newSegment.textEmbedded
            ), newSegment.status = 1, 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          } catch (thrownValue) {
            throw newSegment.status = request.aborted ? 3 : 4, thrownValue;
          }
        }
        task.blockedSegment = resumeSlots;
        resumeSlots.lastPushedText = false;
      }
      null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
      task.treeContext = prevTreeContext;
      task.row = prevRow;
      task.keyPath = prevKeyPath;
    }
    function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
      var prevThenableState = task.thenableState;
      task.thenableState = null;
      currentlyRenderingComponent = {};
      currentlyRenderingTask = task;
      currentlyRenderingRequest = request;
      currentlyRenderingKeyPath = keyPath;
      actionStateCounter = localIdCounter = 0;
      actionStateMatchingIndex = -1;
      thenableIndexCounter = 0;
      thenableState = prevThenableState;
      for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
        didScheduleRenderPhaseUpdate = false, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
      resetHooksState();
      return request;
    }
    function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex2) {
      var didEmitActionStateMarkers = false;
      if (0 !== actionStateCount && null !== request.formState) {
        var segment = task.blockedSegment;
        if (null !== segment) {
          didEmitActionStateMarkers = true;
          segment = segment.chunks;
          for (var i = 0; i < actionStateCount; i++)
            i === actionStateMatchingIndex2 ? segment.push("<!--F!-->") : segment.push("<!--F-->");
        }
      }
      actionStateCount = task.keyPath;
      task.keyPath = keyPath;
      hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
      task.keyPath = actionStateCount;
    }
    function renderElement(request, task, keyPath, type, props, ref) {
      if ("function" === typeof type)
        if (type.prototype && type.prototype.isReactComponent) {
          var newProps = props;
          if ("ref" in props) {
            newProps = {};
            for (var propName in props)
              "ref" !== propName && (newProps[propName] = props[propName]);
          }
          var defaultProps = type.defaultProps;
          if (defaultProps) {
            newProps === props && (newProps = assign({}, newProps, props));
            for (var propName$44 in defaultProps)
              void 0 === newProps[propName$44] && (newProps[propName$44] = defaultProps[propName$44]);
          }
          var JSCompiler_inline_result = newProps;
          var context = emptyContextObject, contextType = type.contextType;
          "object" === typeof contextType && null !== contextType && (context = contextType._currentValue2);
          var JSCompiler_inline_result$jscomp$0 = new type(
            JSCompiler_inline_result,
            context
          );
          var initialState = void 0 !== JSCompiler_inline_result$jscomp$0.state ? JSCompiler_inline_result$jscomp$0.state : null;
          JSCompiler_inline_result$jscomp$0.updater = classComponentUpdater;
          JSCompiler_inline_result$jscomp$0.props = JSCompiler_inline_result;
          JSCompiler_inline_result$jscomp$0.state = initialState;
          var internalInstance = { queue: [], replace: false };
          JSCompiler_inline_result$jscomp$0._reactInternals = internalInstance;
          var contextType$jscomp$0 = type.contextType;
          JSCompiler_inline_result$jscomp$0.context = "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 ? contextType$jscomp$0._currentValue2 : emptyContextObject;
          var getDerivedStateFromProps = type.getDerivedStateFromProps;
          if ("function" === typeof getDerivedStateFromProps) {
            var partialState = getDerivedStateFromProps(
              JSCompiler_inline_result,
              initialState
            );
            var JSCompiler_inline_result$jscomp$1 = null === partialState || void 0 === partialState ? initialState : assign({}, initialState, partialState);
            JSCompiler_inline_result$jscomp$0.state = JSCompiler_inline_result$jscomp$1;
          }
          if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof JSCompiler_inline_result$jscomp$0.getSnapshotBeforeUpdate && ("function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount || "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount)) {
            var oldState = JSCompiler_inline_result$jscomp$0.state;
            "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount && JSCompiler_inline_result$jscomp$0.componentWillMount();
            "function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount && JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount();
            oldState !== JSCompiler_inline_result$jscomp$0.state && classComponentUpdater.enqueueReplaceState(
              JSCompiler_inline_result$jscomp$0,
              JSCompiler_inline_result$jscomp$0.state,
              null
            );
            if (null !== internalInstance.queue && 0 < internalInstance.queue.length) {
              var oldQueue = internalInstance.queue, oldReplace = internalInstance.replace;
              internalInstance.queue = null;
              internalInstance.replace = false;
              if (oldReplace && 1 === oldQueue.length)
                JSCompiler_inline_result$jscomp$0.state = oldQueue[0];
              else {
                for (var nextState = oldReplace ? oldQueue[0] : JSCompiler_inline_result$jscomp$0.state, dontMutate = true, i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                  var partial = oldQueue[i], partialState$jscomp$0 = "function" === typeof partial ? partial.call(
                    JSCompiler_inline_result$jscomp$0,
                    nextState,
                    JSCompiler_inline_result,
                    void 0
                  ) : partial;
                  null != partialState$jscomp$0 && (dontMutate ? (dontMutate = false, nextState = assign({}, nextState, partialState$jscomp$0)) : assign(nextState, partialState$jscomp$0));
                }
                JSCompiler_inline_result$jscomp$0.state = nextState;
              }
            } else internalInstance.queue = null;
          }
          var nextChildren = JSCompiler_inline_result$jscomp$0.render();
          if (request.aborted) throw null;
          var prevKeyPath = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, nextChildren, -1);
          task.keyPath = prevKeyPath;
        } else {
          var value = renderWithHooks(request, task, keyPath, type, props, void 0);
          if (request.aborted) throw null;
          finishFunctionComponent(
            request,
            task,
            keyPath,
            value,
            0 !== localIdCounter,
            actionStateCounter,
            actionStateMatchingIndex
          );
        }
      else if ("string" === typeof type) {
        var segment = task.blockedSegment;
        if (null === segment) {
          var children = props.children, prevContext = task.formatContext, prevKeyPath$jscomp$0 = task.keyPath;
          task.formatContext = getChildFormatContext(prevContext, type, props);
          task.keyPath = keyPath;
          renderNode(request, task, children, -1);
          task.formatContext = prevContext;
          task.keyPath = prevKeyPath$jscomp$0;
        } else {
          var children$41 = pushStartInstance(
            segment.chunks,
            type,
            props,
            request.resumableState,
            request.renderState,
            task.blockedPreamble,
            task.hoistableState,
            task.formatContext,
            segment.lastPushedText
          );
          segment.lastPushedText = false;
          var prevContext$42 = task.formatContext, prevKeyPath$43 = task.keyPath;
          task.keyPath = keyPath;
          if (3 === (task.formatContext = getChildFormatContext(
            prevContext$42,
            type,
            props
          )).insertionMode) {
            var preambleSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false
            );
            segment.preambleChildren.push(preambleSegment);
            task.blockedSegment = preambleSegment;
            try {
              renderNode(request, task, children$41, -1), pushSegmentFinale(
                preambleSegment.chunks,
                request.renderState,
                preambleSegment.lastPushedText,
                preambleSegment.textEmbedded
              ), preambleSegment.status = 1;
            } finally {
              task.blockedSegment = segment;
            }
          } else renderNode(request, task, children$41, -1);
          task.formatContext = prevContext$42;
          task.keyPath = prevKeyPath$43;
          a: {
            var target = segment.chunks, resumableState = request.resumableState;
            switch (type) {
              case "title":
              case "style":
              case "script":
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "input":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr":
                break a;
              case "body":
                if (1 >= prevContext$42.insertionMode) {
                  resumableState.hasBody = true;
                  break a;
                }
                break;
              case "html":
                if (0 === prevContext$42.insertionMode) {
                  resumableState.hasHtml = true;
                  break a;
                }
                break;
              case "head":
                if (1 >= prevContext$42.insertionMode) break a;
            }
            target.push(endChunkForTag(type));
          }
          segment.lastPushedText = false;
        }
      } else {
        switch (type) {
          case REACT_LEGACY_HIDDEN_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_FRAGMENT_TYPE:
            var prevKeyPath$jscomp$1 = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, props.children, -1);
            task.keyPath = prevKeyPath$jscomp$1;
            return;
          case REACT_ACTIVITY_TYPE:
            var segment$jscomp$0 = task.blockedSegment;
            if (null === segment$jscomp$0) {
              if ("hidden" !== props.mode) {
                var prevKeyPath$jscomp$2 = task.keyPath;
                task.keyPath = keyPath;
                renderNode(request, task, props.children, -1);
                task.keyPath = prevKeyPath$jscomp$2;
              }
            } else if ("hidden" !== props.mode) {
              request.renderState.generateStaticMarkup || segment$jscomp$0.chunks.push("<!--&-->");
              segment$jscomp$0.lastPushedText = false;
              var prevKeyPath$46 = task.keyPath;
              task.keyPath = keyPath;
              renderNode(request, task, props.children, -1);
              task.keyPath = prevKeyPath$46;
              request.renderState.generateStaticMarkup || segment$jscomp$0.chunks.push("<!--/&-->");
              segment$jscomp$0.lastPushedText = false;
            }
            return;
          case REACT_SUSPENSE_LIST_TYPE:
            a: {
              var children$jscomp$0 = props.children, revealOrder = props.revealOrder;
              if ("independent" !== revealOrder && "together" !== revealOrder) {
                if (isArrayImpl(children$jscomp$0)) {
                  renderSuspenseListRows(
                    request,
                    task,
                    keyPath,
                    children$jscomp$0,
                    revealOrder
                  );
                  break a;
                }
                var iteratorFn = getIteratorFn(children$jscomp$0);
                if (iteratorFn) {
                  var iterator = iteratorFn.call(children$jscomp$0);
                  if (iterator) {
                    var step = iterator.next();
                    if (!step.done) {
                      do
                        step = iterator.next();
                      while (!step.done);
                      renderSuspenseListRows(
                        request,
                        task,
                        keyPath,
                        children$jscomp$0,
                        revealOrder
                      );
                    }
                    break a;
                  }
                }
              }
              if ("together" === revealOrder) {
                var prevKeyPath$40 = task.keyPath, prevRow = task.row, newRow = task.row = createSuspenseListRow(null);
                newRow.boundaries = [];
                newRow.together = true;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                0 === --newRow.pendingTasks && finishSuspenseListRow(request, newRow);
                task.keyPath = prevKeyPath$40;
                task.row = prevRow;
                null !== prevRow && 0 < newRow.pendingTasks && (prevRow.pendingTasks++, newRow.next = prevRow);
              } else {
                var prevKeyPath$jscomp$3 = task.keyPath;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                task.keyPath = prevKeyPath$jscomp$3;
              }
            }
            return;
          case REACT_VIEW_TRANSITION_TYPE:
            var prevContext$jscomp$0 = task.formatContext, prevKeyPath$jscomp$4 = task.keyPath;
            var resumableState$jscomp$0 = request.resumableState;
            if (null == props.name || "auto" === props.name) {
              var treeId = getTreeId(task.treeContext);
              makeId(resumableState$jscomp$0, treeId, 0);
            }
            task.formatContext = prevContext$jscomp$0;
            task.keyPath = keyPath;
            if (null != props.name && "auto" !== props.name)
              renderNodeDestructive(request, task, props.children, -1);
            else {
              var prevTreeContext = task.treeContext;
              task.treeContext = pushTreeContext(prevTreeContext, 1, 0);
              renderNode(request, task, props.children, -1);
              task.treeContext = prevTreeContext;
            }
            task.formatContext = prevContext$jscomp$0;
            task.keyPath = prevKeyPath$jscomp$4;
            return;
          case REACT_SCOPE_TYPE:
            throw Error("ReactDOMServer does not yet support scope components.");
          case REACT_SUSPENSE_TYPE:
            a: if (null !== task.replay) {
              var prevKeyPath$26 = task.keyPath, prevContext$27 = task.formatContext, prevRow$28 = task.row;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(
                request.resumableState,
                prevContext$27
              );
              task.row = null;
              var content$29 = props.children;
              try {
                renderNode(request, task, content$29, -1);
              } finally {
                task.keyPath = prevKeyPath$26, task.formatContext = prevContext$27, task.row = prevRow$28;
              }
            } else {
              var prevKeyPath$jscomp$5 = task.keyPath, prevContext$jscomp$1 = task.formatContext, prevRow$jscomp$0 = task.row, parentBoundary = task.blockedBoundary, parentPreamble = task.blockedPreamble, parentHoistableState = task.hoistableState, parentSegment = task.blockedSegment, fallback = props.fallback, content = props.children, fallbackAbortSet = /* @__PURE__ */ new Set(), newBoundary = createSuspenseBoundary(
                request,
                task.row,
                fallbackAbortSet,
                null,
                false
              ), boundarySegment = createPendingSegment(
                request,
                parentSegment.chunks.length,
                newBoundary,
                task.formatContext,
                false,
                false
              );
              parentSegment.children.push(boundarySegment);
              parentSegment.lastPushedText = false;
              var contentRootSegment = createPendingSegment(
                request,
                0,
                null,
                task.formatContext,
                false,
                false
              );
              contentRootSegment.parentFlushed = true;
              var trackedPostpones = request.trackedPostpones;
              if (null !== trackedPostpones) {
                var suspenseComponentStack = task.componentStack, fallbackKeyPath = [keyPath[0], "Suspense Fallback", keyPath[2]];
                if (null !== trackedPostpones) {
                  var fallbackReplayNode = [
                    fallbackKeyPath[1],
                    fallbackKeyPath[2],
                    [],
                    null
                  ];
                  trackedPostpones.workingMap.set(
                    fallbackKeyPath,
                    fallbackReplayNode
                  );
                  newBoundary.tracked = {
                    contentKeyPath: keyPath,
                    fallbackNode: fallbackReplayNode
                  };
                }
                task.blockedSegment = boundarySegment;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.fallback;
                task.keyPath = fallbackKeyPath;
                task.formatContext = getSuspenseFallbackFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(
                  suspenseComponentStack
                );
                try {
                  renderNode(request, task, fallback, -1), pushSegmentFinale(
                    boundarySegment.chunks,
                    request.renderState,
                    boundarySegment.lastPushedText,
                    boundarySegment.textEmbedded
                  ), boundarySegment.status = 1;
                } catch (thrownValue) {
                  throw boundarySegment.status = request.aborted ? 3 : 4, thrownValue;
                } finally {
                  task.blockedSegment = parentSegment, task.blockedPreamble = parentPreamble, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1;
                }
                var suspendedPrimaryTask = createRenderTask(
                  request,
                  null,
                  content,
                  -1,
                  newBoundary,
                  contentRootSegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.content,
                  newBoundary.contentState,
                  task.abortSet,
                  keyPath,
                  getSuspenseContentFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  null,
                  suspenseComponentStack
                );
                pushComponentStack(suspendedPrimaryTask);
                request.pingedTasks.push(suspendedPrimaryTask);
              } else {
                task.blockedBoundary = newBoundary;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.content;
                task.hoistableState = newBoundary.contentState;
                task.blockedSegment = contentRootSegment;
                task.keyPath = keyPath;
                task.formatContext = getSuspenseContentFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.row = null;
                try {
                  if (renderNode(request, task, content, -1), pushSegmentFinale(
                    contentRootSegment.chunks,
                    request.renderState,
                    contentRootSegment.lastPushedText,
                    contentRootSegment.textEmbedded
                  ), contentRootSegment.status = 1, queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
                    if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
                      null !== prevRow$jscomp$0 && 0 === --prevRow$jscomp$0.pendingTasks && finishSuspenseListRow(request, prevRow$jscomp$0);
                      0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
                      break a;
                    }
                  } else
                    null !== prevRow$jscomp$0 && prevRow$jscomp$0.together && tryToResolveTogetherRow(request, prevRow$jscomp$0);
                } catch (thrownValue$30) {
                  newBoundary.status = 4;
                  if (request.aborted) {
                    contentRootSegment.status = 3;
                    var error = request.fatalError;
                  } else contentRootSegment.status = 4, error = thrownValue$30;
                  var thrownInfo = getThrownInfo(task.componentStack), errorDigest = logRecoverableError(request, error, thrownInfo);
                  newBoundary.errorDigest = errorDigest;
                  untrackBoundary(request, newBoundary);
                } finally {
                  task.blockedBoundary = parentBoundary, task.blockedPreamble = parentPreamble, task.hoistableState = parentHoistableState, task.blockedSegment = parentSegment, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1, task.row = prevRow$jscomp$0;
                }
                var suspendedFallbackTask = createRenderTask(
                  request,
                  null,
                  fallback,
                  -1,
                  parentBoundary,
                  boundarySegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.fallback,
                  newBoundary.fallbackState,
                  fallbackAbortSet,
                  [keyPath[0], "Suspense Fallback", keyPath[2]],
                  getSuspenseFallbackFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  task.row,
                  replaceSuspenseComponentStackWithSuspenseFallbackStack(
                    task.componentStack
                  )
                );
                pushComponentStack(suspendedFallbackTask);
                request.pingedTasks.push(suspendedFallbackTask);
              }
            }
            return;
        }
        if ("object" === typeof type && null !== type)
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              if ("ref" in props) {
                var propsWithoutRef = {};
                for (var key in props)
                  "ref" !== key && (propsWithoutRef[key] = props[key]);
              } else propsWithoutRef = props;
              var children$jscomp$1 = renderWithHooks(
                request,
                task,
                keyPath,
                type.render,
                propsWithoutRef,
                ref
              );
              finishFunctionComponent(
                request,
                task,
                keyPath,
                children$jscomp$1,
                0 !== localIdCounter,
                actionStateCounter,
                actionStateMatchingIndex
              );
              return;
            case REACT_MEMO_TYPE:
              renderElement(request, task, keyPath, type.type, props, ref);
              return;
            case REACT_CONTEXT_TYPE:
              var children$jscomp$2 = props.children, prevKeyPath$jscomp$6 = task.keyPath, nextValue = props.value;
              var prevValue = type._currentValue2;
              type._currentValue2 = nextValue;
              var prevNode = currentActiveSnapshot, newNode = {
                parent: prevNode,
                depth: null === prevNode ? 0 : prevNode.depth + 1,
                context: type,
                parentValue: prevValue,
                value: nextValue
              };
              currentActiveSnapshot = newNode;
              task.context = newNode;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, children$jscomp$2, -1);
              var prevSnapshot = currentActiveSnapshot;
              if (null === prevSnapshot)
                throw Error(
                  "Tried to pop a Context at the root of the app. This is a bug in React."
                );
              prevSnapshot.context._currentValue2 = prevSnapshot.parentValue;
              var JSCompiler_inline_result$jscomp$2 = currentActiveSnapshot = prevSnapshot.parent;
              task.context = JSCompiler_inline_result$jscomp$2;
              task.keyPath = prevKeyPath$jscomp$6;
              return;
            case REACT_CONSUMER_TYPE:
              var render = props.children, newChildren = render(type._context._currentValue2), prevKeyPath$jscomp$7 = task.keyPath;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, newChildren, -1);
              task.keyPath = prevKeyPath$jscomp$7;
              return;
            case REACT_LAZY_TYPE:
              var init = type._init;
              var Component = init(type._payload);
              if (request.aborted) throw null;
              renderElement(request, task, keyPath, Component, props, ref);
              return;
          }
        throw Error(
          "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == type ? type : typeof type) + ".")
        );
      }
    }
    function resumeNode(request, task, segmentId, node, childIndex) {
      var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(
        request,
        0,
        null,
        task.formatContext,
        false,
        false
      );
      resumedSegment.id = segmentId;
      resumedSegment.parentFlushed = true;
      try {
        task.replay = null, task.blockedSegment = resumedSegment, renderNode(request, task, node, childIndex), resumedSegment.status = 1, null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
      } finally {
        task.replay = prevReplay, task.blockedSegment = null;
      }
    }
    function renderNodeDestructive(request, task, node, childIndex) {
      null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
    }
    function retryNode(request, task) {
      var node = task.node, childIndex = task.childIndex;
      if (null !== node) {
        if ("object" === typeof node) {
          switch (node.$$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = node.type, key = node.key, props = node.props;
              node = props.ref;
              var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key || key === REACT_OPTIMISTIC_KEY ? -1 === childIndex ? 0 : childIndex : key;
              key = [task.keyPath, name, keyOrIndex];
              if (null !== task.replay)
                a: {
                  var replay = task.replay;
                  childIndex = replay.nodes;
                  for (node = 0; node < childIndex.length; node++) {
                    var node$jscomp$0 = childIndex[node];
                    if (keyOrIndex === node$jscomp$0[1]) {
                      if (4 === node$jscomp$0.length) {
                        if (null !== name && name !== node$jscomp$0[0])
                          throw Error(
                            "Expected the resume to render <" + node$jscomp$0[0] + "> in this slot but instead it rendered <" + name + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        var childNodes = node$jscomp$0[2], childSlots = node$jscomp$0[3], currentNode = task.node;
                        task.replay = {
                          nodes: childNodes,
                          slots: childSlots,
                          pendingTasks: 1
                        };
                        try {
                          renderElement(request, task, key, type, props, ref);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                            );
                          task.replay.pendingTasks--;
                        } catch (x) {
                          if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then || "Maximum call stack size exceeded" === x.message))
                            throw task.node === currentNode ? task.replay = replay : childIndex.splice(node, 1), x;
                          task.replay.pendingTasks--;
                          key = getThrownInfo(task.componentStack);
                          currentNode = request;
                          props = task.blockedBoundary;
                          request = request.aborted ? request.fatalError : x;
                          key = logRecoverableError(currentNode, request, key);
                          abortRemainingReplayNodes(
                            currentNode,
                            props,
                            childNodes,
                            childSlots,
                            request,
                            key
                          );
                        }
                        task.replay = replay;
                      } else {
                        if (type !== REACT_SUSPENSE_TYPE)
                          throw Error(
                            "Expected the resume to render <Suspense> in this slot but instead it rendered <" + (getComponentNameFromType(type) || "Unknown") + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        b: {
                          replay = node$jscomp$0[5];
                          type = node$jscomp$0[2];
                          ref = node$jscomp$0[3];
                          name = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                          node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                          keyOrIndex = task.keyPath;
                          var prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children;
                          props = props.fallback;
                          var fallbackAbortSet = /* @__PURE__ */ new Set(), resumedBoundary = createSuspenseBoundary(
                            request,
                            task.row,
                            fallbackAbortSet,
                            null,
                            false
                          );
                          resumedBoundary.parentFlushed = true;
                          resumedBoundary.rootSegmentID = replay;
                          task.blockedBoundary = resumedBoundary;
                          task.hoistableState = resumedBoundary.contentState;
                          task.keyPath = key;
                          task.formatContext = getSuspenseContentFormatContext(
                            request.resumableState,
                            prevContext
                          );
                          task.row = null;
                          task.replay = {
                            nodes: type,
                            slots: ref,
                            pendingTasks: 1
                          };
                          try {
                            renderNode(request, task, content, -1);
                            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                              throw Error(
                                "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                              );
                            task.replay.pendingTasks--;
                            if (0 === resumedBoundary.pendingTasks && 0 === resumedBoundary.status) {
                              resumedBoundary.status = 1;
                              request.completedBoundaries.push(resumedBoundary);
                              break b;
                            }
                          } catch (thrownValue) {
                            resumedBoundary.status = 4, childNodes = request.aborted ? request.fatalError : thrownValue, childSlots = getThrownInfo(task.componentStack), currentNode = logRecoverableError(
                              request,
                              childNodes,
                              childSlots
                            ), resumedBoundary.errorDigest = currentNode, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(
                              resumedBoundary
                            );
                          } finally {
                            task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = keyOrIndex, task.formatContext = prevContext, task.row = prevRow;
                          }
                          childNodes = createReplayTask(
                            request,
                            null,
                            { nodes: name, slots: node$jscomp$0, pendingTasks: 0 },
                            props,
                            -1,
                            parentBoundary,
                            resumedBoundary.fallbackState,
                            fallbackAbortSet,
                            [key[0], "Suspense Fallback", key[2]],
                            getSuspenseFallbackFormatContext(
                              request.resumableState,
                              task.formatContext
                            ),
                            task.context,
                            task.treeContext,
                            task.row,
                            replaceSuspenseComponentStackWithSuspenseFallbackStack(
                              task.componentStack
                            )
                          );
                          pushComponentStack(childNodes);
                          request.pingedTasks.push(childNodes);
                        }
                      }
                      childIndex.splice(node, 1);
                      break a;
                    }
                  }
                }
              else renderElement(request, task, key, type, props, ref);
              return;
            case REACT_PORTAL_TYPE:
              throw Error(
                "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
              );
            case REACT_LAZY_TYPE:
              childNodes = node._init;
              node = childNodes(node._payload);
              if (request.aborted) throw null;
              renderNodeDestructive(request, task, node, childIndex);
              return;
          }
          if (isArrayImpl(node)) {
            renderChildrenArray(request, task, node, childIndex);
            return;
          }
          if (childNodes = getIteratorFn(node)) {
            if (childNodes = childNodes.call(node)) {
              node = childNodes.next();
              if (!node.done) {
                childSlots = [];
                do
                  childSlots.push(node.value), node = childNodes.next();
                while (!node.done);
                renderChildrenArray(request, task, childSlots, childIndex);
              }
              return;
            }
          }
          if ("function" === typeof node.then)
            return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
          if (node.$$typeof === REACT_CONTEXT_TYPE)
            return renderNodeDestructive(
              request,
              task,
              node._currentValue2,
              childIndex
            );
          childIndex = Object.prototype.toString.call(node);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        if ("string" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            node,
            request.renderState,
            childIndex.lastPushedText
          ));
        else if ("number" === typeof node || "bigint" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            "" + node,
            request.renderState,
            childIndex.lastPushedText
          ));
      }
    }
    function renderChildrenArray(request, task, children, childIndex) {
      var prevKeyPath = task.keyPath;
      if (-1 !== childIndex && (task.keyPath = [task.keyPath, "Fragment", childIndex], null !== task.replay)) {
        for (var replay = task.replay, replayNodes = replay.nodes, j2 = 0; j2 < replayNodes.length; j2++) {
          var node = replayNodes[j2];
          if (node[1] === childIndex) {
            childIndex = node[2];
            node = node[3];
            task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
            try {
              renderChildrenArray(request, task, children, -1);
              if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                throw Error(
                  "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                );
              task.replay.pendingTasks--;
            } catch (x) {
              if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
                throw x;
              task.replay.pendingTasks--;
              var thrownInfo = getThrownInfo(task.componentStack);
              children = request;
              var boundary = task.blockedBoundary;
              request = request.aborted ? request.fatalError : x;
              thrownInfo = logRecoverableError(children, request, thrownInfo);
              abortRemainingReplayNodes(
                children,
                boundary,
                childIndex,
                node,
                request,
                thrownInfo
              );
            }
            task.replay = replay;
            replayNodes.splice(j2, 1);
            break;
          }
        }
        task.keyPath = prevKeyPath;
        return;
      }
      replay = task.treeContext;
      replayNodes = children.length;
      if (null !== task.replay && (j2 = task.replay.slots, null !== j2 && "object" === typeof j2)) {
        for (childIndex = 0; childIndex < replayNodes; childIndex++)
          node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j2[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j2[childIndex]) : renderNode(request, task, node, childIndex);
        task.treeContext = replay;
        task.keyPath = prevKeyPath;
        return;
      }
      for (j2 = 0; j2 < replayNodes; j2++)
        childIndex = children[j2], task.treeContext = pushTreeContext(replay, replayNodes, j2), renderNode(request, task, childIndex, j2);
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
    }
    function trackPostponedBoundary(request, trackedPostpones, boundary) {
      boundary.status = 5;
      boundary.rootSegmentID = request.nextSegmentId++;
      var tracked = boundary.tracked;
      if (null === tracked)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      request = tracked.contentKeyPath;
      if (null === request)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      tracked = tracked.fallbackNode;
      var children = [], boundaryNode = trackedPostpones.workingMap.get(request);
      if (void 0 === boundaryNode)
        return boundary = [
          request[1],
          request[2],
          children,
          null,
          tracked,
          boundary.rootSegmentID
        ], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
      boundaryNode[4] = tracked;
      boundaryNode[5] = boundary.rootSegmentID;
      return boundaryNode;
    }
    function trackPostpone(request, trackedPostpones, task, segment) {
      segment.status = 5;
      var keyPath = task.keyPath, boundary = task.blockedBoundary;
      if (null === boundary)
        segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
      else {
        if (null !== boundary && 0 === boundary.status) {
          var boundaryNode = trackPostponedBoundary(
            request,
            trackedPostpones,
            boundary
          );
          if (null !== boundary.tracked && boundary.tracked.contentKeyPath === keyPath && -1 === task.childIndex) {
            -1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
            boundaryNode[3] = segment.id;
            return;
          }
        }
        -1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
        if (-1 === task.childIndex)
          null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [keyPath[1], keyPath[2], [], segment.id], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
        else {
          if (null === keyPath)
            if (request = trackedPostpones.rootSlots, null === request)
              request = trackedPostpones.rootSlots = {};
            else {
              if ("number" === typeof request)
                throw Error(
                  "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
                );
            }
          else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode)
            request = {}, boundaryNode = [keyPath[1], keyPath[2], [], request], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
          else if (request = boundaryNode[3], null === request)
            request = boundaryNode[3] = {};
          else if ("number" === typeof request)
            throw Error(
              "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
            );
          request[task.childIndex] = segment.id;
        }
      }
    }
    function untrackBoundary(request, boundary) {
      request = request.trackedPostpones;
      null !== request && (boundary = boundary.tracked, null !== boundary && (boundary = boundary.contentKeyPath, null !== boundary && (request = request.workingMap.get(boundary), void 0 !== request && (request.length = 4, request[2] = [], request[3] = null))));
    }
    function spawnNewSuspendedReplayTask(request, task, thenableState2) {
      return createReplayTask(
        request,
        thenableState2,
        task.replay,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function spawnNewSuspendedRenderTask(request, task, thenableState2) {
      var segment = task.blockedSegment, newSegment = createPendingSegment(
        request,
        segment.chunks.length,
        null,
        task.formatContext,
        segment.lastPushedText,
        true
      );
      segment.children.push(newSegment);
      segment.lastPushedText = false;
      return createRenderTask(
        request,
        thenableState2,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        newSegment,
        task.blockedPreamble,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function renderNode(request, task, node, childIndex) {
      var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
      if (null === segment) {
        segment = task.replay;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue) {
          if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
              node.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              node = spawnNewSuspendedReplayTask(request, task, node);
              request.pingedTasks.push(node);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
          }
        }
      } else {
        var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue$63) {
          if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$63 === SuspenseException ? getSuspendedThenable() : thrownValue$63, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              segment = node;
              node = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedRenderTask(request, task, node).ping;
              segment.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              segment = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
              segment = spawnNewSuspendedRenderTask(request, task, segment);
              request.pingedTasks.push(segment);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
          }
        }
      }
      task.formatContext = previousFormatContext;
      task.context = previousContext;
      task.keyPath = previousKeyPath;
      task.treeContext = previousTreeContext;
      switchContext(previousContext);
      throw node;
    }
    function abortTaskSoft(task) {
      var boundary = task.blockedBoundary, segment = task.blockedSegment;
      null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
    }
    function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error, errorDigest$jscomp$0) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (4 === node.length)
          abortRemainingReplayNodes(
            request$jscomp$0,
            boundary,
            node[2],
            node[3],
            error,
            errorDigest$jscomp$0
          );
        else {
          node = node[5];
          var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(
            request,
            null,
            /* @__PURE__ */ new Set(),
            null,
            false
          );
          resumedBoundary.parentFlushed = true;
          resumedBoundary.rootSegmentID = node;
          resumedBoundary.status = 4;
          resumedBoundary.errorDigest = errorDigest;
          resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
        }
      }
      nodes.length = 0;
      if (null !== slots) {
        if (null === boundary)
          throw Error(
            "We should not have any resumable nodes in the shell. This is a bug in React."
          );
        4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
        if ("object" === typeof slots) for (var index in slots) delete slots[index];
      }
    }
    function abortTask(task, request) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary;
        task = task.blockedSegment;
        null !== task && (task.status = 3);
        null !== boundary && boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
          return abortTask(fallbackTask, request);
        });
      }
    }
    function finishAbortedTask(task, request, error) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary, segment = task.blockedSegment;
        if (null === segment || 3 === segment.status) {
          var errorInfo = getThrownInfo(task.componentStack), isRecoverableReason = isRecoverableError(error);
          if (null === boundary) {
            boundary = task.replay;
            if (null === boundary) {
              isRecoverableReason || null === request.trackedPostpones || null === segment ? isRecoverableReason ? (task = cloneRecoverableErrorAsFatal(error), logRecoverableError(request, task, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, task)) : (logRecoverableError(request, error, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, error)) : (boundary = request.trackedPostpones, logRecoverableError(request, error, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment));
              return;
            }
            12 !== request.status && 13 !== request.status && (boundary.pendingTasks--, 0 === boundary.pendingTasks && 0 < boundary.nodes.length && (errorInfo = logRecoverableError(request, error, errorInfo), abortRemainingReplayNodes(
              request,
              null,
              boundary.nodes,
              boundary.slots,
              error,
              errorInfo
            )), request.pendingRootTasks--, 0 === request.pendingRootTasks && completeShell(request));
          } else {
            var trackedPostpones$64 = request.trackedPostpones;
            if (4 !== boundary.status) {
              if (!isRecoverableReason && null !== trackedPostpones$64 && null !== segment)
                return logRecoverableError(request, error, errorInfo), trackPostpone(request, trackedPostpones$64, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
                  return finishAbortedTask(fallbackTask, request, error);
                }), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
              boundary.status = 4;
              errorInfo = logRecoverableError(request, error, errorInfo);
              boundary.errorDigest = errorInfo;
              untrackBoundary(request, boundary);
              boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
            }
            boundary.pendingTasks--;
            errorInfo = boundary.row;
            null !== errorInfo && 0 === --errorInfo.pendingTasks && finishSuspenseListRow(request, errorInfo);
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return finishAbortedTask(fallbackTask, request, error);
            });
            boundary.fallbackAbortableTasks.clear();
          }
          task = task.row;
          null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
          request.allPendingTasks--;
          0 === request.allPendingTasks && completeAll(request);
        }
      }
    }
    function safelyEmitEarlyPreloads(request, shellComplete) {
      try {
        var renderState = request.renderState, onHeaders = renderState.onHeaders;
        if (onHeaders) {
          var headers = renderState.headers;
          if (headers) {
            renderState.headers = null;
            var linkHeader = headers.preconnects;
            headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
            headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
            if (!shellComplete) {
              var queueIter = renderState.styles.values(), queueStep = queueIter.next();
              b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next())
                for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
                  var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                    crossOrigin: props$jscomp$0.crossOrigin,
                    integrity: props$jscomp$0.integrity,
                    nonce: props$jscomp$0.nonce,
                    type: props$jscomp$0.type,
                    fetchPriority: props$jscomp$0.fetchPriority,
                    referrerPolicy: props$jscomp$0.referrerPolicy,
                    media: props$jscomp$0.media
                  });
                  if (0 <= (headers.remainingCapacity -= header.length + 2))
                    renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
                  else break b;
                }
            }
            linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
          }
        }
      } catch (error) {
        logRecoverableError(request, error, {});
      }
    }
    function completeShell(request) {
      null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
      null === request.trackedPostpones && preparePreamble(request);
      request = request.onShellReady;
      request();
    }
    function completeAll(request) {
      safelyEmitEarlyPreloads(
        request,
        null === request.trackedPostpones ? true : null === request.completedRootSegment || 5 !== request.completedRootSegment.status
      );
      preparePreamble(request);
      request = request.onAllReady;
      request();
    }
    function queueCompletedSegment(boundary, segment) {
      if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
        var childSegment = segment.children[0];
        childSegment.id = segment.id;
        childSegment.parentFlushed = true;
        1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
      } else boundary.completedSegments.push(segment);
    }
    function finishedTask(request, boundary, row, segment) {
      null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
      request.allPendingTasks--;
      if (null === boundary) {
        if (null !== segment && segment.parentFlushed) {
          if (null !== request.completedRootSegment)
            throw Error(
              "There can only be one root segment. This is a bug in React."
            );
          request.completedRootSegment = segment;
        }
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      } else if (boundary.pendingTasks--, 4 !== boundary.status)
        if (0 === boundary.pendingTasks)
          if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status)
            row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (request.allPendingTasks++, boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row), request.allPendingTasks--), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.preamble && preparePreamble(request);
          else {
            if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
              if (null !== request.trackedPostpones) {
                row = request.trackedPostpones;
                var postponedRow = boundary.next;
                if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment))
                  for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
                    var postponedBoundary = segment[postponedRow];
                    trackPostponedBoundary(request, row, postponedBoundary);
                    finishedTask(request, postponedBoundary, null, null);
                  }
              }
              request.allPendingTasks++;
              0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
              request.allPendingTasks--;
            }
          }
        else
          null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
      0 === request.allPendingTasks && completeAll(request);
    }
    function performWork(request$jscomp$1) {
      if (!(request$jscomp$1.aborted || 11 < request$jscomp$1.status)) {
        var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = HooksDispatcher;
        var prevAsyncDispatcher = ReactSharedInternals.A;
        ReactSharedInternals.A = DefaultAsyncDispatcher;
        var prevRequest = currentRequest;
        currentRequest = request$jscomp$1;
        var prevResumableState = currentResumableState;
        currentResumableState = request$jscomp$1.resumableState;
        try {
          var pingedTasks = request$jscomp$1.pingedTasks, i;
          for (i = 0; i < pingedTasks.length; i++) {
            var task = pingedTasks[i], request = request$jscomp$1, segment = task.blockedSegment;
            if (null === segment)
              a: {
                if (0 !== task.replay.pendingTasks) {
                  var prevTask = request.currentTask;
                  request.currentTask = task;
                  switchContext(task.context);
                  var startNode = task.node;
                  try {
                    "number" === typeof task.replay.slots ? resumeNode(
                      request,
                      task,
                      task.replay.slots,
                      task.node,
                      task.childIndex
                    ) : retryNode(request, task);
                    if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                      throw Error(
                        "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                      );
                    task.replay.pendingTasks--;
                    task.abortSet.delete(task);
                    finishedTask(request, task.blockedBoundary, task.row, null);
                  } catch (thrownValue) {
                    resetHooksState();
                    var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                    if (request.aborted) {
                      thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending());
                      request.currentTask = prevTask;
                      var request$jscomp$0 = request;
                      abortTask(task, request$jscomp$0);
                      task.abortSet.delete(task);
                      finishAbortedTask(
                        task,
                        request$jscomp$0,
                        request$jscomp$0.fatalError
                      );
                    } else {
                      if ("object" === typeof x && null !== x) {
                        if ("function" === typeof x.then) {
                          var ping = task.ping;
                          x.then(ping.resolve, ping.reject);
                          task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                          break a;
                        }
                        if ("Maximum call stack size exceeded" === x.message && task.node !== startNode) {
                          task.thenableState = null;
                          request.pingedTasks.push(task);
                          break a;
                        }
                      }
                      task.replay.pendingTasks--;
                      task.abortSet.delete(task);
                      var errorInfo = getThrownInfo(task.componentStack);
                      request$jscomp$0 = request;
                      var boundary = task.blockedBoundary, error$jscomp$0 = request.aborted ? request.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots, errorDigest = logRecoverableError(
                        request$jscomp$0,
                        error$jscomp$0,
                        errorInfo
                      );
                      abortRemainingReplayNodes(
                        request$jscomp$0,
                        boundary,
                        replayNodes,
                        resumeSlots,
                        error$jscomp$0,
                        errorDigest
                      );
                      request.pendingRootTasks--;
                      0 === request.pendingRootTasks && completeShell(request);
                      request.allPendingTasks--;
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  } finally {
                    request.currentTask = prevTask;
                  }
                }
              }
            else
              a: if (request$jscomp$0 = segment, 0 === request$jscomp$0.status) {
                var prevTask$jscomp$0 = request.currentTask;
                request.currentTask = task;
                switchContext(task.context);
                var childrenLength = request$jscomp$0.children.length, chunkLength = request$jscomp$0.chunks.length, startNode$jscomp$0 = task.node;
                try {
                  retryNode(request, task), pushSegmentFinale(
                    request$jscomp$0.chunks,
                    request.renderState,
                    request$jscomp$0.lastPushedText,
                    request$jscomp$0.textEmbedded
                  ), task.abortSet.delete(task), request$jscomp$0.status = 1, finishedTask(
                    request,
                    task.blockedBoundary,
                    task.row,
                    request$jscomp$0
                  );
                } catch (thrownValue) {
                  resetHooksState();
                  request$jscomp$0.children.length = childrenLength;
                  request$jscomp$0.chunks.length = chunkLength;
                  var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                  if (request.aborted)
                    thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending()), request.currentTask = prevTask$jscomp$0, request$jscomp$0 = request, abortTask(task, request$jscomp$0), task.abortSet.delete(task), finishAbortedTask(
                      task,
                      request$jscomp$0,
                      request$jscomp$0.fatalError
                    );
                  else {
                    if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0) {
                      if ("function" === typeof x$jscomp$0.then) {
                        request$jscomp$0.status = 0;
                        task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                        var ping$jscomp$0 = task.ping;
                        x$jscomp$0.then(
                          ping$jscomp$0.resolve,
                          ping$jscomp$0.reject
                        );
                        break a;
                      }
                      if ("Maximum call stack size exceeded" === x$jscomp$0.message && task.node !== startNode$jscomp$0) {
                        request$jscomp$0.status = 0;
                        task.thenableState = null;
                        request.pingedTasks.push(task);
                        break a;
                      }
                    }
                    var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                    task.abortSet.delete(task);
                    request$jscomp$0.status = 4;
                    var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
                    null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                    request.allPendingTasks--;
                    if (null === boundary$jscomp$0)
                      if (isRecoverableError(x$jscomp$0)) {
                        var fatalRecoverableError = cloneRecoverableErrorAsFatal(x$jscomp$0);
                        logRecoverableError(
                          request,
                          fatalRecoverableError,
                          errorInfo$jscomp$0
                        );
                        fatalError(request, fatalRecoverableError);
                      } else
                        logRecoverableError(
                          request,
                          x$jscomp$0,
                          errorInfo$jscomp$0
                        ), fatalError(request, x$jscomp$0);
                    else {
                      var errorDigest$jscomp$0 = logRecoverableError(
                        request,
                        x$jscomp$0,
                        errorInfo$jscomp$0
                      );
                      boundary$jscomp$0.pendingTasks--;
                      if (4 !== boundary$jscomp$0.status) {
                        boundary$jscomp$0.status = 4;
                        boundary$jscomp$0.errorDigest = errorDigest$jscomp$0;
                        untrackBoundary(request, boundary$jscomp$0);
                        var boundaryRow = boundary$jscomp$0.row;
                        null !== boundaryRow && (request.allPendingTasks++, 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow), request.allPendingTasks--);
                        boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
                        0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.preamble && preparePreamble(request);
                      }
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  }
                } finally {
                  request.currentTask = prevTask$jscomp$0;
                }
              }
          }
          pingedTasks.splice(0, i);
          null !== request$jscomp$1.destination && flushCompletedQueues(request$jscomp$1, request$jscomp$1.destination);
        } catch (error) {
          logRecoverableError(request$jscomp$1, error, {}), fatalError(request$jscomp$1, error);
        } finally {
          currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
        }
      }
    }
    function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
      segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
      for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
        pendingPreambles = preparePreambleFromSegment(
          request,
          segment.children[i],
          collectedPreambleSegments
        ) || pendingPreambles;
      return pendingPreambles;
    }
    function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
      var boundary = segment.boundary;
      if (null === boundary)
        return preparePreambleFromSubtree(
          request,
          segment,
          collectedPreambleSegments
        );
      var preamble = boundary.preamble;
      if (null === preamble) return false;
      switch (boundary.status) {
        case 1:
          hoistPreambleState(request.renderState, preamble.content);
          request.byteSize += boundary.byteSize;
          segment = boundary.completedSegments[0];
          if (!segment)
            throw Error(
              "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
            );
          return preparePreambleFromSubtree(
            request,
            segment,
            collectedPreambleSegments
          );
        case 5:
          if (null !== request.trackedPostpones) return true;
        case 4:
          if (1 === segment.status)
            return hoistPreambleState(request.renderState, preamble.fallback), preparePreambleFromSubtree(
              request,
              segment,
              collectedPreambleSegments
            );
        default:
          return true;
      }
    }
    function preparePreamble(request) {
      if (request.completedRootSegment && null === request.completedPreambleSegments) {
        var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(
          request,
          request.completedRootSegment,
          collectedPreambleSegments
        ), preamble = request.renderState.preamble;
        false === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
      }
    }
    function flushSubtree(request, destination, segment, hoistableState) {
      segment.parentFlushed = true;
      switch (segment.status) {
        case 0:
          segment.id = request.nextSegmentId++;
        case 5:
          return hoistableState = segment.id, segment.lastPushedText = false, segment.textEmbedded = false, request = request.renderState, destination.push('<template id="'), destination.push(request.placeholderPrefix), request = hoistableState.toString(16), destination.push(request), destination.push('"></template>');
        case 1:
          segment.status = 2;
          var r = true, chunks = segment.chunks, chunkIdx = 0;
          segment = segment.children;
          for (var childIdx = 0; childIdx < segment.length; childIdx++) {
            for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
              destination.push(chunks[chunkIdx]);
            r = flushSegment(request, destination, r, hoistableState);
          }
          for (; chunkIdx < chunks.length - 1; chunkIdx++)
            destination.push(chunks[chunkIdx]);
          chunkIdx < chunks.length && (r = destination.push(chunks[chunkIdx]));
          return r;
        case 3:
          return true;
        default:
          throw Error(
            "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React."
          );
      }
    }
    var flushedByteSize = 0;
    function flushSegment(request, destination, segment, hoistableState) {
      var boundary = segment.boundary;
      if (null === boundary)
        return flushSubtree(request, destination, segment, hoistableState);
      segment.boundary = null;
      boundary.parentFlushed = true;
      if (4 === boundary.status) {
        var row = boundary.row;
        null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
        request.renderState.generateStaticMarkup || (boundary = boundary.errorDigest, destination.push("<!--$!-->"), destination.push("<template"), null != boundary && (destination.push(' data-dgst="'), boundary = escapeTextForBrowser(boundary), destination.push(boundary), destination.push('"')), destination.push("></template>"));
        flushSubtree(request, destination, segment, hoistableState);
        request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
        return request;
      }
      if (1 !== boundary.status)
        return 0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
      if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && (flushedByteSize + boundary.byteSize > request.progressiveChunkSize || boundary.defer))
        return boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
      flushedByteSize += boundary.byteSize;
      hoistableState && hoistHoistables(hoistableState, boundary.contentState);
      segment = boundary.row;
      null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
      request.renderState.generateStaticMarkup || destination.push("<!--$-->");
      segment = boundary.completedSegments;
      if (1 !== segment.length)
        throw Error(
          "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
        );
      flushSegment(request, destination, segment[0], hoistableState);
      request = request.renderState.generateStaticMarkup ? true : destination.push("<!--/$-->");
      return request;
    }
    function flushSegmentContainer(request, destination, segment, hoistableState) {
      writeStartSegment(
        destination,
        request.renderState,
        segment.parentFormatContext,
        segment.id
      );
      flushSegment(request, destination, segment, hoistableState);
      return writeEndSegment(destination, segment.parentFormatContext);
    }
    function flushCompletedBoundary(request, destination, boundary) {
      flushedByteSize = boundary.byteSize;
      for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++)
        flushPartiallyCompletedSegment(
          request,
          destination,
          boundary,
          completedSegments[i]
        );
      completedSegments.length = 0;
      completedSegments = boundary.row;
      null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
      writeHoistablesForBoundary(
        destination,
        boundary.contentState,
        request.renderState
      );
      completedSegments = request.resumableState;
      request = request.renderState;
      i = boundary.rootSegmentID;
      boundary = boundary.contentState;
      var requiresStyleInsertion = request.stylesToHoist, requiresViewTransitions = 0 !== (completedSegments.instructions & 128);
      request.stylesToHoist = false;
      destination.push(request.startInlineScript);
      destination.push(">");
      requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, destination.push(
        '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};'
      )), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push(
        '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
      )), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, destination.push(
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, destination.push(
        '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("'
      )) : destination.push('$RR("')) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push(
        '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
      )), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, destination.push(
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), destination.push('$RC("'));
      completedSegments = i.toString(16);
      destination.push(request.boundaryPrefix);
      destination.push(completedSegments);
      destination.push('","');
      destination.push(request.segmentPrefix);
      destination.push(completedSegments);
      requiresStyleInsertion ? (destination.push('",'), writeStyleResourceDependenciesInJS(destination, boundary)) : destination.push('"');
      boundary = destination.push(")</script>");
      return writeBootstrap(destination, request) && boundary;
    }
    function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
      if (2 === segment.status) return true;
      var hoistableState = boundary.contentState, segmentID = segment.id;
      if (-1 === segmentID) {
        if (-1 === (segment.id = boundary.rootSegmentID))
          throw Error(
            "A root segment ID must have been assigned by now. This is a bug in React."
          );
        return flushSegmentContainer(request, destination, segment, hoistableState);
      }
      if (segmentID === boundary.rootSegmentID)
        return flushSegmentContainer(request, destination, segment, hoistableState);
      flushSegmentContainer(request, destination, segment, hoistableState);
      boundary = request.resumableState;
      request = request.renderState;
      destination.push(request.startInlineScript);
      destination.push(">");
      0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, destination.push(
        '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
      )) : destination.push('$RS("');
      destination.push(request.segmentPrefix);
      segmentID = segmentID.toString(16);
      destination.push(segmentID);
      destination.push('","');
      destination.push(request.placeholderPrefix);
      destination.push(segmentID);
      destination = destination.push('")</script>');
      return destination;
    }
    var flushingPartialBoundaries = false;
    function flushCompletedQueues(request, destination) {
      try {
        if (!(0 < request.pendingRootTasks)) {
          var i, completedRootSegment = request.completedRootSegment;
          if (null !== completedRootSegment) {
            if (5 === completedRootSegment.status) return;
            var completedPreambleSegments = request.completedPreambleSegments;
            if (null === completedPreambleSegments) return;
            flushedByteSize = request.byteSize;
            var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
            if (htmlChunks) {
              for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
                destination.push(htmlChunks[i$jscomp$0]);
              if (headChunks)
                for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                  destination.push(headChunks[i$jscomp$0]);
              else {
                var chunk = startChunkForTag("head");
                destination.push(chunk);
                destination.push(">");
              }
            } else if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                destination.push(headChunks[i$jscomp$0]);
            var charsetChunks = renderState.charsetChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
              destination.push(charsetChunks[i$jscomp$0]);
            charsetChunks.length = 0;
            renderState.preconnects.forEach(flushResource, destination);
            renderState.preconnects.clear();
            var viewportChunks = renderState.viewportChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
              destination.push(viewportChunks[i$jscomp$0]);
            viewportChunks.length = 0;
            renderState.fontPreloads.forEach(flushResource, destination);
            renderState.fontPreloads.clear();
            renderState.highImagePreloads.forEach(flushResource, destination);
            renderState.highImagePreloads.clear();
            currentlyFlushingRenderState = renderState;
            renderState.styles.forEach(flushStylesInPreamble, destination);
            currentlyFlushingRenderState = null;
            var importMapChunks = renderState.importMapChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
              destination.push(importMapChunks[i$jscomp$0]);
            importMapChunks.length = 0;
            renderState.bootstrapScripts.forEach(flushResource, destination);
            renderState.scripts.forEach(flushResource, destination);
            renderState.scripts.clear();
            renderState.bulkPreloads.forEach(flushResource, destination);
            renderState.bulkPreloads.clear();
            resumableState.instructions |= 32;
            var hoistableChunks = renderState.hoistableChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
              destination.push(hoistableChunks[i$jscomp$0]);
            for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
              var segments = completedPreambleSegments[resumableState];
              for (renderState = 0; renderState < segments.length; renderState++)
                flushSegment(request, destination, segments[renderState], null);
            }
            var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
            if (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) {
              var chunk$jscomp$0 = endChunkForTag("head");
              destination.push(chunk$jscomp$0);
            }
            var bodyChunks = preamble$jscomp$0.bodyChunks;
            if (bodyChunks)
              for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++)
                destination.push(bodyChunks[completedPreambleSegments]);
            flushSegment(request, destination, completedRootSegment, null);
            request.completedRootSegment = null;
            var renderState$jscomp$0 = request.renderState;
            if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
              var resumableState$jscomp$0 = request.resumableState;
              if (0 === (resumableState$jscomp$0.instructions & 64)) {
                resumableState$jscomp$0.instructions |= 64;
                destination.push(renderState$jscomp$0.startInlineScript);
                if (0 === (resumableState$jscomp$0.instructions & 32)) {
                  resumableState$jscomp$0.instructions |= 32;
                  var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                  destination.push(' id="');
                  var chunk$jscomp$1 = escapeTextForBrowser(shellId);
                  destination.push(chunk$jscomp$1);
                  destination.push('"');
                }
                destination.push(">");
                destination.push(
                  "requestAnimationFrame(function(){$RT=performance.now()});"
                );
                destination.push("</script>");
              }
            }
            writeBootstrap(destination, renderState$jscomp$0);
          }
          var renderState$jscomp$1 = request.renderState;
          completedRootSegment = 0;
          var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
          for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++)
            destination.push(viewportChunks$jscomp$0[completedRootSegment]);
          viewportChunks$jscomp$0.length = 0;
          renderState$jscomp$1.preconnects.forEach(flushResource, destination);
          renderState$jscomp$1.preconnects.clear();
          renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.fontPreloads.clear();
          renderState$jscomp$1.highImagePreloads.forEach(
            flushResource,
            destination
          );
          renderState$jscomp$1.highImagePreloads.clear();
          renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
          renderState$jscomp$1.scripts.forEach(flushResource, destination);
          renderState$jscomp$1.scripts.clear();
          renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.bulkPreloads.clear();
          var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
          for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++)
            destination.push(hoistableChunks$jscomp$0[completedRootSegment]);
          hoistableChunks$jscomp$0.length = 0;
          var clientRenderedBoundaries = request.clientRenderedBoundaries;
          for (i = 0; i < clientRenderedBoundaries.length; i++) {
            var boundary = clientRenderedBoundaries[i];
            renderState$jscomp$1 = destination;
            var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
            renderState$jscomp$1.push(renderState$jscomp$2.startInlineScript);
            renderState$jscomp$1.push(">");
            0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, renderState$jscomp$1.push(
              '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
            )) : renderState$jscomp$1.push('$RX("');
            renderState$jscomp$1.push(renderState$jscomp$2.boundaryPrefix);
            var chunk$jscomp$2 = id.toString(16);
            renderState$jscomp$1.push(chunk$jscomp$2);
            renderState$jscomp$1.push('"');
            if (null != errorDigest)
              if (renderState$jscomp$1.push(","), null == errorDigest)
                renderState$jscomp$1.push("null");
              else {
                var chunk$jscomp$3 = escapeJSStringsForInstructionScripts(errorDigest);
                renderState$jscomp$1.push(chunk$jscomp$3);
              }
            var JSCompiler_inline_result = renderState$jscomp$1.push(")</script>");
            if (!JSCompiler_inline_result) {
              request.destination = null;
              i++;
              clientRenderedBoundaries.splice(0, i);
              return;
            }
          }
          clientRenderedBoundaries.splice(0, i);
          var completedBoundaries = request.completedBoundaries;
          for (i = 0; i < completedBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
              request.destination = null;
              i++;
              completedBoundaries.splice(0, i);
              return;
            }
          completedBoundaries.splice(0, i);
          flushingPartialBoundaries = true;
          var partialBoundaries = request.partialBoundaries;
          for (i = 0; i < partialBoundaries.length; i++) {
            var boundary$70 = partialBoundaries[i];
            a: {
              clientRenderedBoundaries = request;
              boundary = destination;
              flushedByteSize = boundary$70.byteSize;
              var completedSegments = boundary$70.completedSegments;
              for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++)
                if (!flushPartiallyCompletedSegment(
                  clientRenderedBoundaries,
                  boundary,
                  boundary$70,
                  completedSegments[JSCompiler_inline_result]
                )) {
                  JSCompiler_inline_result++;
                  completedSegments.splice(0, JSCompiler_inline_result);
                  var JSCompiler_inline_result$jscomp$0 = false;
                  break a;
                }
              completedSegments.splice(0, JSCompiler_inline_result);
              var row = boundary$70.row;
              null !== row && row.together && 1 === boundary$70.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(
                clientRenderedBoundaries,
                row,
                row.hoistables
              ) : row.pendingTasks--);
              JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
                boundary,
                boundary$70.contentState,
                clientRenderedBoundaries.renderState
              );
            }
            if (!JSCompiler_inline_result$jscomp$0) {
              request.destination = null;
              i++;
              partialBoundaries.splice(0, i);
              return;
            }
          }
          partialBoundaries.splice(0, i);
          flushingPartialBoundaries = false;
          var largeBoundaries = request.completedBoundaries;
          for (i = 0; i < largeBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
              request.destination = null;
              i++;
              largeBoundaries.splice(0, i);
              return;
            }
          largeBoundaries.splice(0, i);
        }
      } finally {
        flushingPartialBoundaries = false, i = request.postponedState, null !== i && (i.nextSegmentId = request.nextSegmentId), 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length && (request.flushScheduled = false, i = request.resumableState, i.hasBody && (partialBoundaries = endChunkForTag("body"), destination.push(partialBoundaries)), i.hasHtml && (i = endChunkForTag("html"), destination.push(i)), endRenderLifetime(request), request.status = 13, destination.push(null), request.destination = null);
      }
    }
    function enqueueFlush(request) {
      if (false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination) {
        request.flushScheduled = true;
        var destination = request.destination;
        destination ? flushCompletedQueues(request, destination) : request.flushScheduled = false;
      }
    }
    function startFlowing(request, destination) {
      if (12 === request.status)
        request.status = 13, request = request.fatalError, isRecoverableError(request) && (request = cloneRecoverableErrorAsFatal(request)), destination.destroy(request);
      else if (13 !== request.status && null === request.destination) {
        request.destination = destination;
        try {
          flushCompletedQueues(request, destination);
        } catch (error$72) {
          logRecoverableError(request, error$72, {}), fatalError(request, error$72);
        }
      }
    }
    function finishAbort(request, abortableTasks) {
      try {
        if (0 < abortableTasks.size) {
          var error = request.fatalError;
          abortableTasks.forEach(function(task) {
            return finishAbortedTask(task, request, error);
          });
          abortableTasks.clear();
        }
        null !== request.destination && flushCompletedQueues(request, request.destination);
      } catch (error$73) {
        logRecoverableError(request, error$73, {}), fatalError(request, error$73);
      }
    }
    function endRenderLifetime(request) {
      request = request.renderLifetimeController;
      null !== request && request.abort("The render ended.");
    }
    function abort(request, reason) {
      if (!(request.aborted || 11 !== request.status && 10 !== request.status)) {
        endRenderLifetime(request);
        var isRecoverableReason = "object" === typeof reason && null !== reason && reason.$$typeof === REACT_RECOVERABLE_TYPE;
        request.aborted = true;
        reason = isRecoverableReason ? createRecoverableError(reason) : void 0 === reason ? Error("The render was aborted by the server without a reason.") : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error("The render was aborted by the server with a promise.") : reason;
        request.fatalError = reason;
        reason = request.abortableTasks;
        reason.forEach(function(task) {
          return abortTask(task, request);
        });
        finishAbort(request, reason);
      }
    }
    function addToReplayParent(node, parentKeyPath, trackedPostpones) {
      if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
      else {
        var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
        void 0 === parentNode && (parentNode = [parentKeyPath[1], parentKeyPath[2], [], null], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
        parentNode[2].push(node);
      }
    }
    function onError() {
    }
    function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
      var didFatal = false, fatalError2 = null, result = "", readyToStream = false;
      options = createResumableState(options ? options.identifierPrefix : void 0);
      children = createRequest(
        children,
        options,
        createRenderState(options, generateStaticMarkup),
        createFormatContext(0, null, 0, null),
        Infinity,
        onError,
        void 0,
        void 0,
        function() {
          readyToStream = true;
        },
        void 0,
        void 0,
        void 0
      );
      children.flushScheduled = null !== children.destination;
      performWork(children);
      10 === children.status && (children.status = 11);
      null === children.trackedPostpones && safelyEmitEarlyPreloads(children, 0 === children.pendingRootTasks);
      abort(children, abortReason);
      startFlowing(children, {
        push: function(chunk) {
          null !== chunk && (result += chunk);
          return true;
        },
        destroy: function(error) {
          didFatal = true;
          fatalError2 = error;
        }
      });
      if (didFatal && fatalError2 !== abortReason) throw fatalError2;
      if (!readyToStream)
        throw Error(
          "A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition."
        );
      return result;
    }
    exports2.renderToStaticMarkup = function(children, options) {
      return renderToStringImpl(
        children,
        options,
        true,
        'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server'
      );
    };
    exports2.renderToString = function(children, options) {
      return renderToStringImpl(
        children,
        options,
        false,
        'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server'
      );
    };
    exports2.version = "19.3.0";
  }
});

// node_modules/react-dom/cjs/react-dom-server.node.production.js
var require_react_dom_server_node_production = __commonJS({
  "node_modules/react-dom/cjs/react-dom-server.node.production.js"(exports2) {
    "use strict";
    var util = require("util");
    var crypto = require("crypto");
    var async_hooks = require("async_hooks");
    var React = require_react();
    var ReactDOM = require_react_dom();
    var stream = require("stream");
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden");
    var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
    var REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition");
    var REACT_RECOVERABLE_TYPE = /* @__PURE__ */ Symbol.for("react.recoverable");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var REACT_OPTIMISTIC_KEY = /* @__PURE__ */ Symbol.for("react.optimistic_key");
    var isArrayImpl = Array.isArray;
    var scheduleMicrotask = queueMicrotask;
    function flushBuffered(destination) {
      "function" === typeof destination.flush && destination.flush();
    }
    var currentView = null;
    var writtenBytes = 0;
    var destinationHasCapacity$1 = true;
    function writeChunk(destination, chunk) {
      if ("string" === typeof chunk) {
        if (0 !== chunk.length)
          if (4096 < 3 * chunk.length)
            0 < writtenBytes && (writeToDestination(
              destination,
              currentView.subarray(0, writtenBytes)
            ), currentView = new Uint8Array(4096), writtenBytes = 0), writeToDestination(destination, chunk);
          else {
            var target = currentView;
            0 < writtenBytes && (target = currentView.subarray(writtenBytes));
            target = textEncoder.encodeInto(chunk, target);
            var read = target.read;
            writtenBytes += target.written;
            read < chunk.length && (writeToDestination(
              destination,
              currentView.subarray(0, writtenBytes)
            ), currentView = new Uint8Array(4096), writtenBytes = textEncoder.encodeInto(
              chunk.slice(read),
              currentView
            ).written);
            4096 === writtenBytes && (writeToDestination(destination, currentView), currentView = new Uint8Array(4096), writtenBytes = 0);
          }
      } else
        0 !== chunk.byteLength && (4096 < chunk.byteLength ? (0 < writtenBytes && (writeToDestination(
          destination,
          currentView.subarray(0, writtenBytes)
        ), currentView = new Uint8Array(4096), writtenBytes = 0), writeToDestination(destination, chunk)) : (target = currentView.length - writtenBytes, target < chunk.byteLength && (0 === target ? writeToDestination(destination, currentView) : (currentView.set(chunk.subarray(0, target), writtenBytes), writtenBytes += target, writeToDestination(destination, currentView), chunk = chunk.subarray(target)), currentView = new Uint8Array(4096), writtenBytes = 0), currentView.set(chunk, writtenBytes), writtenBytes += chunk.byteLength, 4096 === writtenBytes && (writeToDestination(destination, currentView), currentView = new Uint8Array(4096), writtenBytes = 0)));
    }
    function writeToDestination(destination, view) {
      destination = destination.write(view);
      destinationHasCapacity$1 = destinationHasCapacity$1 && destination;
    }
    function writeChunkAndReturn(destination, chunk) {
      writeChunk(destination, chunk);
      return destinationHasCapacity$1;
    }
    function completeWriting(destination) {
      currentView && 0 < writtenBytes && destination.write(currentView.subarray(0, writtenBytes));
      currentView = null;
      writtenBytes = 0;
      destinationHasCapacity$1 = true;
    }
    var textEncoder = new util.TextEncoder();
    function stringToPrecomputedChunk(content) {
      return textEncoder.encode(content);
    }
    function byteLengthOfChunk(chunk) {
      return "string" === typeof chunk ? Buffer.byteLength(chunk, "utf8") : chunk.byteLength;
    }
    var assign = Object.assign;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    );
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
        return true;
      if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
        return validatedAttributeNameCache[attributeName] = true;
      illegalAttributeNameCache[attributeName] = true;
      return false;
    }
    var unitlessNumbers = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    );
    var aliases = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["maskType", "mask-type"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]);
    var matchHtmlRegExp = /["'&<>]/;
    function escapeTextForBrowser(text) {
      if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text)
        return "" + text;
      text = "" + text;
      var match = matchHtmlRegExp.exec(text);
      if (match) {
        var html = "", index, lastIndex = 0;
        for (index = match.index; index < text.length; index++) {
          switch (text.charCodeAt(index)) {
            case 34:
              match = "&quot;";
              break;
            case 38:
              match = "&amp;";
              break;
            case 39:
              match = "&#x27;";
              break;
            case 60:
              match = "&lt;";
              break;
            case 62:
              match = "&gt;";
              break;
            default:
              continue;
          }
          lastIndex !== index && (html += text.slice(lastIndex, index));
          lastIndex = index + 1;
          html += match;
        }
        text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
      }
      return text;
    }
    var uppercasePattern = /([A-Z])/g;
    var msPattern = /^ms-/;
    var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function sanitizeURL(url) {
      return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    var sharedNotPendingObject = {
      pending: false,
      data: null,
      method: null,
      action: null
    };
    var previousDispatcher = ReactDOMSharedInternals.d;
    ReactDOMSharedInternals.d = {
      f: previousDispatcher.f,
      r: previousDispatcher.r,
      D: prefetchDNS,
      C: preconnect,
      L: preload,
      m: preloadModule,
      X: preinitScript,
      S: preinitStyle,
      M: preinitModuleScript
    };
    var PRELOAD_NO_CREDS = [];
    var currentlyFlushingRenderState = null;
    stringToPrecomputedChunk('"></template>');
    var startInlineScript = stringToPrecomputedChunk("<script");
    var endInlineScript = stringToPrecomputedChunk("</script>");
    var startScriptSrc = stringToPrecomputedChunk('<script src="');
    var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
    var scriptNonce = stringToPrecomputedChunk(' nonce="');
    var scriptIntegirty = stringToPrecomputedChunk(' integrity="');
    var scriptCrossOrigin = stringToPrecomputedChunk(' crossorigin="');
    var endAsyncScript = stringToPrecomputedChunk(' async=""></script>');
    var startInlineStyle = stringToPrecomputedChunk("<style");
    var scriptRegex = /(<\/|<)(s)(cript)/gi;
    function scriptReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\u0073" : "\\u0053") + suffix2;
    }
    var importMapScriptStart = stringToPrecomputedChunk(
      '<script type="importmap">'
    );
    var importMapScriptEnd = stringToPrecomputedChunk("</script>");
    function createRenderState(resumableState, nonce, externalRuntimeConfig, importMap, onHeaders, maxHeadersLength) {
      externalRuntimeConfig = "string" === typeof nonce ? nonce : nonce && nonce.script;
      var inlineScriptWithNonce = void 0 === externalRuntimeConfig ? startInlineScript : stringToPrecomputedChunk(
        '<script nonce="' + escapeTextForBrowser(externalRuntimeConfig) + '"'
      ), nonceStyle = "string" === typeof nonce ? void 0 : nonce && nonce.style, inlineStyleWithNonce = void 0 === nonceStyle ? startInlineStyle : stringToPrecomputedChunk(
        '<style nonce="' + escapeTextForBrowser(nonceStyle) + '"'
      ), idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
      void 0 !== bootstrapScriptContent && (bootstrapChunks.push(inlineScriptWithNonce), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
        endOfStartTag,
        ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer),
        endInlineScript
      ));
      bootstrapScriptContent = [];
      void 0 !== importMap && (bootstrapScriptContent.push(
        void 0 === externalRuntimeConfig ? importMapScriptStart : stringToPrecomputedChunk(
          '<script type="importmap" nonce="' + escapeTextForBrowser(externalRuntimeConfig) + '">'
        )
      ), bootstrapScriptContent.push(
        ("" + JSON.stringify(importMap)).replace(scriptRegex, scriptReplacer)
      ), bootstrapScriptContent.push(importMapScriptEnd));
      importMap = onHeaders ? {
        preconnects: "",
        fontPreloads: "",
        highImagePreloads: "",
        remainingCapacity: 2 + ("number" === typeof maxHeadersLength ? maxHeadersLength : 2e3)
      } : null;
      onHeaders = {
        placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
        segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
        boundaryPrefix: stringToPrecomputedChunk(idPrefix + "B:"),
        startInlineScript: inlineScriptWithNonce,
        startInlineStyle: inlineStyleWithNonce,
        preamble: createPreambleState(),
        externalRuntimeScript: null,
        bootstrapChunks,
        importMapChunks: bootstrapScriptContent,
        onHeaders,
        headers: importMap,
        resets: {
          font: {},
          dns: {},
          connect: { default: {}, anonymous: {}, credentials: {} },
          image: {},
          style: {}
        },
        charsetChunks: [],
        viewportChunks: [],
        hoistableChunks: [],
        preconnects: /* @__PURE__ */ new Set(),
        fontPreloads: /* @__PURE__ */ new Set(),
        highImagePreloads: /* @__PURE__ */ new Set(),
        styles: /* @__PURE__ */ new Map(),
        bootstrapScripts: /* @__PURE__ */ new Set(),
        scripts: /* @__PURE__ */ new Set(),
        bulkPreloads: /* @__PURE__ */ new Set(),
        preloads: {
          images: /* @__PURE__ */ new Map(),
          stylesheets: /* @__PURE__ */ new Map(),
          scripts: /* @__PURE__ */ new Map(),
          moduleScripts: /* @__PURE__ */ new Map()
        },
        nonce: { script: externalRuntimeConfig, style: nonceStyle },
        hoistableState: null,
        stylesToHoist: false
      };
      if (void 0 !== bootstrapScripts)
        for (importMap = 0; importMap < bootstrapScripts.length; importMap++)
          idPrefix = bootstrapScripts[importMap], nonceStyle = inlineScriptWithNonce = void 0, inlineStyleWithNonce = {
            rel: "preload",
            as: "script",
            fetchPriority: "low",
            nonce
          }, "string" === typeof idPrefix ? inlineStyleWithNonce.href = maxHeadersLength = idPrefix : (inlineStyleWithNonce.href = maxHeadersLength = idPrefix.src, inlineStyleWithNonce.integrity = nonceStyle = "string" === typeof idPrefix.integrity ? idPrefix.integrity : void 0, inlineStyleWithNonce.crossOrigin = inlineScriptWithNonce = "string" === typeof idPrefix || null == idPrefix.crossOrigin ? void 0 : "use-credentials" === idPrefix.crossOrigin ? "use-credentials" : ""), idPrefix = resumableState, bootstrapScriptContent = maxHeadersLength, idPrefix.scriptResources[bootstrapScriptContent] = null, idPrefix.moduleScriptResources[bootstrapScriptContent] = null, idPrefix = [], pushLinkImpl(idPrefix, inlineStyleWithNonce), onHeaders.bootstrapScripts.add(idPrefix), bootstrapChunks.push(
            startScriptSrc,
            escapeTextForBrowser(maxHeadersLength),
            attributeEnd
          ), externalRuntimeConfig && bootstrapChunks.push(
            scriptNonce,
            escapeTextForBrowser(externalRuntimeConfig),
            attributeEnd
          ), "string" === typeof nonceStyle && bootstrapChunks.push(
            scriptIntegirty,
            escapeTextForBrowser(nonceStyle),
            attributeEnd
          ), "string" === typeof inlineScriptWithNonce && bootstrapChunks.push(
            scriptCrossOrigin,
            escapeTextForBrowser(inlineScriptWithNonce),
            attributeEnd
          ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
      if (void 0 !== bootstrapModules)
        for (nonce = 0; nonce < bootstrapModules.length; nonce++)
          nonceStyle = bootstrapModules[nonce], maxHeadersLength = importMap = void 0, inlineScriptWithNonce = {
            rel: "modulepreload",
            fetchPriority: "low",
            nonce: externalRuntimeConfig
          }, "string" === typeof nonceStyle ? inlineScriptWithNonce.href = bootstrapScripts = nonceStyle : (inlineScriptWithNonce.href = bootstrapScripts = nonceStyle.src, inlineScriptWithNonce.integrity = maxHeadersLength = "string" === typeof nonceStyle.integrity ? nonceStyle.integrity : void 0, inlineScriptWithNonce.crossOrigin = importMap = "string" === typeof nonceStyle || null == nonceStyle.crossOrigin ? void 0 : "use-credentials" === nonceStyle.crossOrigin ? "use-credentials" : ""), nonceStyle = resumableState, inlineStyleWithNonce = bootstrapScripts, nonceStyle.scriptResources[inlineStyleWithNonce] = null, nonceStyle.moduleScriptResources[inlineStyleWithNonce] = null, nonceStyle = [], pushLinkImpl(nonceStyle, inlineScriptWithNonce), onHeaders.bootstrapScripts.add(nonceStyle), bootstrapChunks.push(
            startModuleSrc,
            escapeTextForBrowser(bootstrapScripts),
            attributeEnd
          ), externalRuntimeConfig && bootstrapChunks.push(
            scriptNonce,
            escapeTextForBrowser(externalRuntimeConfig),
            attributeEnd
          ), "string" === typeof maxHeadersLength && bootstrapChunks.push(
            scriptIntegirty,
            escapeTextForBrowser(maxHeadersLength),
            attributeEnd
          ), "string" === typeof importMap && bootstrapChunks.push(
            scriptCrossOrigin,
            escapeTextForBrowser(importMap),
            attributeEnd
          ), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
      return onHeaders;
    }
    function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
      return {
        idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
        nextFormID: 0,
        streamingFormat: 0,
        bootstrapScriptContent,
        bootstrapScripts,
        bootstrapModules,
        instructions: 0,
        hasBody: false,
        hasHtml: false,
        unknownResources: {},
        dnsResources: {},
        connectResources: { default: {}, anonymous: {}, credentials: {} },
        imageResources: {},
        styleResources: {},
        scriptResources: {},
        moduleUnknownResources: {},
        moduleScriptResources: {}
      };
    }
    function createPreambleState() {
      return { htmlChunks: null, headChunks: null, bodyChunks: null };
    }
    function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
      return {
        insertionMode,
        selectedValue,
        tagScope,
        viewTransition
      };
    }
    function createRootFormatContext(namespaceURI) {
      return createFormatContext(
        "http://www.w3.org/2000/svg" === namespaceURI ? 4 : "http://www.w3.org/1998/Math/MathML" === namespaceURI ? 5 : 0,
        null,
        0,
        null
      );
    }
    function getChildFormatContext(parentContext, type, props) {
      var subtreeScope = parentContext.tagScope & -25;
      switch (type) {
        case "noscript":
          return createFormatContext(2, null, subtreeScope | 1, null);
        case "select":
          return createFormatContext(
            2,
            null != props.value ? props.value : props.defaultValue,
            subtreeScope,
            null
          );
        case "svg":
          return createFormatContext(4, null, subtreeScope, null);
        case "picture":
          return createFormatContext(2, null, subtreeScope | 2, null);
        case "math":
          return createFormatContext(5, null, subtreeScope, null);
        case "foreignObject":
          return createFormatContext(2, null, subtreeScope, null);
        case "table":
          return createFormatContext(6, null, subtreeScope, null);
        case "thead":
        case "tbody":
        case "tfoot":
          return createFormatContext(7, null, subtreeScope, null);
        case "colgroup":
          return createFormatContext(9, null, subtreeScope, null);
        case "tr":
          return createFormatContext(8, null, subtreeScope, null);
        case "head":
          if (2 > parentContext.insertionMode)
            return createFormatContext(3, null, subtreeScope, null);
          break;
        case "html":
          if (0 === parentContext.insertionMode)
            return createFormatContext(1, null, subtreeScope, null);
      }
      return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : null !== parentContext.viewTransition || parentContext.tagScope !== subtreeScope ? createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        null
      ) : parentContext;
    }
    function getSuspenseViewTransition(parentViewTransition) {
      return null === parentViewTransition ? null : {
        update: parentViewTransition.update,
        enter: "none",
        exit: "none",
        share: parentViewTransition.update,
        parentEnter: "none",
        parentExit: "none",
        name: parentViewTransition.autoName,
        autoName: parentViewTransition.autoName,
        nameIdx: 0
      };
    }
    function getSuspenseFallbackFormatContext(resumableState, parentContext) {
      parentContext.tagScope & 32 && (resumableState.instructions |= 128);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        parentContext.tagScope | 12,
        getSuspenseViewTransition(parentContext.viewTransition)
      );
    }
    function getSuspenseContentFormatContext(resumableState, parentContext) {
      resumableState = getSuspenseViewTransition(parentContext.viewTransition);
      var subtreeScope = parentContext.tagScope | 16;
      null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
      return createFormatContext(
        parentContext.insertionMode,
        parentContext.selectedValue,
        subtreeScope,
        resumableState
      );
    }
    function makeId(resumableState, treeId, localId) {
      resumableState = "_" + resumableState.idPrefix + "R_" + treeId;
      0 < localId && (resumableState += "H" + localId.toString(32));
      return resumableState + "_";
    }
    var textSeparator = stringToPrecomputedChunk("<!-- -->");
    function pushTextInstance(target, text, renderState, textEmbedded) {
      if ("" === text) return textEmbedded;
      textEmbedded && target.push(textSeparator);
      target.push(escapeTextForBrowser(text));
      return true;
    }
    function pushViewTransitionAttributes(target, formatContext) {
      formatContext = formatContext.viewTransition;
      null !== formatContext && ("auto" !== formatContext.name && (pushStringAttribute(
        target,
        "vt-name",
        0 === formatContext.nameIdx ? formatContext.name : formatContext.name + "_" + formatContext.nameIdx
      ), formatContext.nameIdx++), pushStringAttribute(target, "vt-update", formatContext.update), "none" !== formatContext.enter && pushStringAttribute(target, "vt-enter", formatContext.enter), "none" !== formatContext.exit && pushStringAttribute(target, "vt-exit", formatContext.exit), "none" !== formatContext.share && pushStringAttribute(target, "vt-share", formatContext.share));
    }
    var styleNameCache = /* @__PURE__ */ new Map();
    var styleAttributeStart = stringToPrecomputedChunk(' style="');
    var styleAssign = stringToPrecomputedChunk(":");
    var styleSeparator = stringToPrecomputedChunk(";");
    function pushStyleAttribute(target, style) {
      if ("object" !== typeof style)
        throw Error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      var isFirst = true, styleName;
      for (styleName in style)
        if (hasOwnProperty.call(style, styleName)) {
          var styleValue = style[styleName];
          if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
            if (0 === styleName.indexOf("--")) {
              var nameChunk = escapeTextForBrowser(styleName);
              styleValue = escapeTextForBrowser(("" + styleValue).trim());
            } else
              nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = stringToPrecomputedChunk(
                escapeTextForBrowser(
                  styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")
                )
              ), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? "" + styleValue : styleValue + "px" : escapeTextForBrowser(("" + styleValue).trim());
            isFirst ? (isFirst = false, target.push(
              styleAttributeStart,
              nameChunk,
              styleAssign,
              styleValue
            )) : target.push(styleSeparator, nameChunk, styleAssign, styleValue);
          }
        }
      isFirst || target.push(attributeEnd);
    }
    var attributeSeparator = stringToPrecomputedChunk(" ");
    var attributeAssign = stringToPrecomputedChunk('="');
    var attributeEnd = stringToPrecomputedChunk('"');
    var attributeEmptyString = stringToPrecomputedChunk('=""');
    function pushBooleanAttribute(target, name, value) {
      value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, name, attributeEmptyString);
    }
    function pushStringAttribute(target, name, value) {
      "function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(
        attributeSeparator,
        name,
        attributeAssign,
        escapeTextForBrowser(value),
        attributeEnd
      );
    }
    var actionJavaScriptURL = stringToPrecomputedChunk(
      escapeTextForBrowser(
        "javascript:throw new Error('React form unexpectedly submitted.')"
      )
    );
    var startHiddenInputChunk = stringToPrecomputedChunk('<input type="hidden"');
    function pushAdditionalFormField(value, key) {
      this.push(startHiddenInputChunk);
      validateAdditionalFormField(value);
      pushStringAttribute(this, "name", key);
      pushStringAttribute(this, "value", value);
      this.push(endOfStartTagSelfClosing);
    }
    function validateAdditionalFormField(value) {
      if ("string" !== typeof value)
        throw Error(
          "File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration."
        );
    }
    function getCustomFormFields(resumableState, formAction) {
      if ("function" === typeof formAction.$$FORM_ACTION) {
        var id = resumableState.nextFormID++;
        resumableState = resumableState.idPrefix + id;
        try {
          var customFields = formAction.$$FORM_ACTION(resumableState);
          if (customFields) {
            var formData = customFields.data;
            null != formData && formData.forEach(validateAdditionalFormField);
          }
          return customFields;
        } catch (x) {
          if ("object" === typeof x && null !== x && "function" === typeof x.then)
            throw x;
        }
      }
      return null;
    }
    function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
      var formData = null;
      if ("function" === typeof formAction) {
        var customFields = getCustomFormFields(resumableState, formAction);
        null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(
          attributeSeparator,
          "formAction",
          attributeAssign,
          actionJavaScriptURL,
          attributeEnd
        ), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
      }
      null != name && pushAttribute(target, "name", name);
      null != formAction && pushAttribute(target, "formAction", formAction);
      null != formEncType && pushAttribute(target, "formEncType", formEncType);
      null != formMethod && pushAttribute(target, "formMethod", formMethod);
      null != formTarget && pushAttribute(target, "formTarget", formTarget);
      return formData;
    }
    function pushAttribute(target, name, value) {
      switch (name) {
        case "className":
          pushStringAttribute(target, "class", value);
          break;
        case "tabIndex":
          pushStringAttribute(target, "tabindex", value);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          pushStringAttribute(target, name, value);
          break;
        case "style":
          pushStyleAttribute(target, value);
          break;
        case "src":
        case "href":
          if ("" === value) break;
        case "action":
        case "formAction":
          if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "ref":
          break;
        case "autoFocus":
        case "multiple":
        case "muted":
          pushBooleanAttribute(target, name.toLowerCase(), value);
          break;
        case "xlinkHref":
          if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value)
            break;
          value = sanitizeURL("" + value);
          target.push(
            attributeSeparator,
            "xlink:href",
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          "function" !== typeof value && "symbol" !== typeof value && target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, name, attributeEmptyString);
          break;
        case "capture":
        case "download":
          true === value ? target.push(attributeSeparator, name, attributeEmptyString) : false !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "rowSpan":
        case "start":
          "function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(
            attributeSeparator,
            name,
            attributeAssign,
            escapeTextForBrowser(value),
            attributeEnd
          );
          break;
        case "xlinkActuate":
          pushStringAttribute(target, "xlink:actuate", value);
          break;
        case "xlinkArcrole":
          pushStringAttribute(target, "xlink:arcrole", value);
          break;
        case "xlinkRole":
          pushStringAttribute(target, "xlink:role", value);
          break;
        case "xlinkShow":
          pushStringAttribute(target, "xlink:show", value);
          break;
        case "xlinkTitle":
          pushStringAttribute(target, "xlink:title", value);
          break;
        case "xlinkType":
          pushStringAttribute(target, "xlink:type", value);
          break;
        case "xmlBase":
          pushStringAttribute(target, "xml:base", value);
          break;
        case "xmlLang":
          pushStringAttribute(target, "xml:lang", value);
          break;
        case "xmlSpace":
          pushStringAttribute(target, "xml:space", value);
          break;
        default:
          if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
            if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
              switch (typeof value) {
                case "function":
                case "symbol":
                  return;
                case "boolean":
                  var prefix$8 = name.toLowerCase().slice(0, 5);
                  if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
              }
              target.push(
                attributeSeparator,
                name,
                attributeAssign,
                escapeTextForBrowser(value),
                attributeEnd
              );
            }
          }
      }
    }
    var endOfStartTag = stringToPrecomputedChunk(">");
    var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
    function pushInnerHTML(target, innerHTML, children) {
      if (null != innerHTML) {
        if (null != children)
          throw Error(
            "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
          );
        if ("object" !== typeof innerHTML || !("__html" in innerHTML))
          throw Error(
            "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
          );
        innerHTML = innerHTML.__html;
        null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
      }
    }
    function flattenOptionChildren(children) {
      var content = "";
      React.Children.forEach(children, function(child) {
        null != child && (content += child);
      });
      return content;
    }
    var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
    var formReplayingRuntimeScript = stringToPrecomputedChunk(
      `addEventListener("submit",function(a){if(!a.defaultPrevented){var b=a.target,d=a.submitter,c=b.action,e=d;if(d){var f=d.getAttribute("formAction");null!=f&&(c=f,e=null)}"javascript:throw new Error('React form unexpectedly submitted.')"===c&&(a.preventDefault(),a=new FormData(b,e),c=b.ownerDocument||b,(c.$$reactFormReplay=c.$$reactFormReplay||[]).push(b,d,a))}});`
    );
    function injectFormReplayingRuntime(resumableState, renderState) {
      if (0 === (resumableState.instructions & 16)) {
        resumableState.instructions |= 16;
        var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
        (preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(
          endOfStartTag,
          formReplayingRuntimeScript,
          endInlineScript
        )) : bootstrapChunks.unshift(
          renderState.startInlineScript,
          endOfStartTag,
          formReplayingRuntimeScript,
          endInlineScript
        );
      }
    }
    var formStateMarkerIsMatching = stringToPrecomputedChunk("<!--F!-->");
    var formStateMarkerIsNotMatching = stringToPrecomputedChunk("<!--F-->");
    function pushLinkImpl(target, props) {
      target.push(startChunkForTag("link"));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(endOfStartTagSelfClosing);
      return null;
    }
    var styleRegex = /(<\/|<)(s)(tyle)/gi;
    function styleReplacer(match, prefix2, s, suffix2) {
      return "" + prefix2 + ("s" === s ? "\\73 " : "\\53 ") + suffix2;
    }
    function pushSelfClosing(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      for (var propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(
                  tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                );
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(endOfStartTagSelfClosing);
      return null;
    }
    function pushTitleImpl(target, props) {
      target.push(startChunkForTag("title"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(endOfStartTag);
      props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
      "function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(escapeTextForBrowser("" + props));
      pushInnerHTML(target, innerHTML, children);
      target.push(endChunkForTag("title"));
      return null;
    }
    var headPreambleContributionChunk = stringToPrecomputedChunk("<!--head-->");
    var bodyPreambleContributionChunk = stringToPrecomputedChunk("<!--body-->");
    var htmlPreambleContributionChunk = stringToPrecomputedChunk("<!--html-->");
    function pushScriptImpl(target, props) {
      target.push(startChunkForTag("script"));
      var children = null, innerHTML = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      target.push(endOfStartTag);
      pushInnerHTML(target, innerHTML, children);
      "string" === typeof children && target.push(("" + children).replace(scriptRegex, scriptReplacer));
      target.push(endChunkForTag("script"));
      return null;
    }
    function pushStartSingletonElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(endOfStartTag);
      pushInnerHTML(target, innerHTML, tag);
      return tag;
    }
    function pushStartGenericElement(target, props, tag, formatContext) {
      target.push(startChunkForTag(tag));
      var innerHTML = tag = null, propKey;
      for (propKey in props)
        if (hasOwnProperty.call(props, propKey)) {
          var propValue = props[propKey];
          if (null != propValue)
            switch (propKey) {
              case "children":
                tag = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, propKey, propValue);
            }
        }
      pushViewTransitionAttributes(target, formatContext);
      target.push(endOfStartTag);
      pushInnerHTML(target, innerHTML, tag);
      return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
    }
    var leadingNewline = stringToPrecomputedChunk("\n");
    var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
    var validatedTagCache = /* @__PURE__ */ new Map();
    function startChunkForTag(tag) {
      var tagStartChunk = validatedTagCache.get(tag);
      if (void 0 === tagStartChunk) {
        if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
        tagStartChunk = stringToPrecomputedChunk("<" + tag);
        validatedTagCache.set(tag, tagStartChunk);
      }
      return tagStartChunk;
    }
    var doctypeChunk = stringToPrecomputedChunk("<!DOCTYPE html>");
    function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
      switch (type) {
        case "div":
        case "span":
        case "svg":
        case "path":
          break;
        case "a":
          target$jscomp$0.push(startChunkForTag("a"));
          var children = null, innerHTML = null, propKey;
          for (propKey in props)
            if (hasOwnProperty.call(props, propKey)) {
              var propValue = props[propKey];
              if (null != propValue)
                switch (propKey) {
                  case "children":
                    children = propValue;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML = propValue;
                    break;
                  case "href":
                    "" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
                    break;
                  default:
                    pushAttribute(target$jscomp$0, propKey, propValue);
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML, children);
          if ("string" === typeof children) {
            target$jscomp$0.push(escapeTextForBrowser(children));
            var JSCompiler_inline_result = null;
          } else JSCompiler_inline_result = children;
          return JSCompiler_inline_result;
        case "g":
        case "p":
        case "li":
          break;
        case "select":
          target$jscomp$0.push(startChunkForTag("select"));
          var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
          for (propKey$jscomp$0 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$0)) {
              var propValue$jscomp$0 = props[propKey$jscomp$0];
              if (null != propValue$jscomp$0)
                switch (propKey$jscomp$0) {
                  case "children":
                    children$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$0 = propValue$jscomp$0;
                    break;
                  case "defaultValue":
                  case "value":
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$0,
                      propValue$jscomp$0
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
          return children$jscomp$0;
        case "option":
          var selectedValue = formatContext.selectedValue;
          target$jscomp$0.push(startChunkForTag("option"));
          var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
          for (propKey$jscomp$1 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$1)) {
              var propValue$jscomp$1 = props[propKey$jscomp$1];
              if (null != propValue$jscomp$1)
                switch (propKey$jscomp$1) {
                  case "children":
                    children$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "selected":
                    selected = propValue$jscomp$1;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$1 = propValue$jscomp$1;
                    break;
                  case "value":
                    value = propValue$jscomp$1;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$1,
                      propValue$jscomp$1
                    );
                }
            }
          if (null != selectedValue) {
            var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
            if (isArrayImpl(selectedValue))
              for (var i = 0; i < selectedValue.length; i++) {
                if ("" + selectedValue[i] === stringValue) {
                  target$jscomp$0.push(selectedMarkerAttribute);
                  break;
                }
              }
            else
              "" + selectedValue === stringValue && target$jscomp$0.push(selectedMarkerAttribute);
          } else selected && target$jscomp$0.push(selectedMarkerAttribute);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
          return children$jscomp$1;
        case "textarea":
          target$jscomp$0.push(startChunkForTag("textarea"));
          var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
          for (propKey$jscomp$2 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$2)) {
              var propValue$jscomp$2 = props[propKey$jscomp$2];
              if (null != propValue$jscomp$2)
                switch (propKey$jscomp$2) {
                  case "children":
                    children$jscomp$2 = propValue$jscomp$2;
                    break;
                  case "value":
                    value$jscomp$0 = propValue$jscomp$2;
                    break;
                  case "defaultValue":
                    defaultValue = propValue$jscomp$2;
                    break;
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$2,
                      propValue$jscomp$2
                    );
                }
            }
          null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          if (null != children$jscomp$2) {
            if (null != value$jscomp$0)
              throw Error(
                "If you supply `defaultValue` on a <textarea>, do not pass children."
              );
            if (isArrayImpl(children$jscomp$2)) {
              if (1 < children$jscomp$2.length)
                throw Error("<textarea> can only have at most one child.");
              value$jscomp$0 = "" + children$jscomp$2[0];
            }
            value$jscomp$0 = "" + children$jscomp$2;
          }
          "string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push(leadingNewline);
          null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
          return null;
        case "input":
          target$jscomp$0.push(startChunkForTag("input"));
          var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
          for (propKey$jscomp$3 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$3)) {
              var propValue$jscomp$3 = props[propKey$jscomp$3];
              if (null != propValue$jscomp$3)
                switch (propKey$jscomp$3) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  case "name":
                    name = propValue$jscomp$3;
                    break;
                  case "formAction":
                    formAction = propValue$jscomp$3;
                    break;
                  case "formEncType":
                    formEncType = propValue$jscomp$3;
                    break;
                  case "formMethod":
                    formMethod = propValue$jscomp$3;
                    break;
                  case "formTarget":
                    formTarget = propValue$jscomp$3;
                    break;
                  case "defaultChecked":
                    defaultChecked = propValue$jscomp$3;
                    break;
                  case "defaultValue":
                    defaultValue$jscomp$0 = propValue$jscomp$3;
                    break;
                  case "checked":
                    checked = propValue$jscomp$3;
                    break;
                  case "value":
                    value$jscomp$1 = propValue$jscomp$3;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$3,
                      propValue$jscomp$3
                    );
                }
            }
          var formData = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction,
            formEncType,
            formMethod,
            formTarget,
            name
          );
          null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
          null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTagSelfClosing);
          null != formData && formData.forEach(pushAdditionalFormField, target$jscomp$0);
          return null;
        case "button":
          target$jscomp$0.push(startChunkForTag("button"));
          var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
          for (propKey$jscomp$4 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$4)) {
              var propValue$jscomp$4 = props[propKey$jscomp$4];
              if (null != propValue$jscomp$4)
                switch (propKey$jscomp$4) {
                  case "children":
                    children$jscomp$3 = propValue$jscomp$4;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$2 = propValue$jscomp$4;
                    break;
                  case "name":
                    name$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formAction":
                    formAction$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formEncType":
                    formEncType$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formMethod":
                    formMethod$jscomp$0 = propValue$jscomp$4;
                    break;
                  case "formTarget":
                    formTarget$jscomp$0 = propValue$jscomp$4;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$4,
                      propValue$jscomp$4
                    );
                }
            }
          var formData$jscomp$0 = pushFormActionAttribute(
            target$jscomp$0,
            resumableState,
            renderState,
            formAction$jscomp$0,
            formEncType$jscomp$0,
            formMethod$jscomp$0,
            formTarget$jscomp$0,
            name$jscomp$0
          );
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          null != formData$jscomp$0 && formData$jscomp$0.forEach(pushAdditionalFormField, target$jscomp$0);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
          if ("string" === typeof children$jscomp$3) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
            var JSCompiler_inline_result$jscomp$0 = null;
          } else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
          return JSCompiler_inline_result$jscomp$0;
        case "form":
          target$jscomp$0.push(startChunkForTag("form"));
          var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
          for (propKey$jscomp$5 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$5)) {
              var propValue$jscomp$5 = props[propKey$jscomp$5];
              if (null != propValue$jscomp$5)
                switch (propKey$jscomp$5) {
                  case "children":
                    children$jscomp$4 = propValue$jscomp$5;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$3 = propValue$jscomp$5;
                    break;
                  case "action":
                    formAction$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "encType":
                    formEncType$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "method":
                    formMethod$jscomp$1 = propValue$jscomp$5;
                    break;
                  case "target":
                    formTarget$jscomp$1 = propValue$jscomp$5;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$5,
                      propValue$jscomp$5
                    );
                }
            }
          var formData$jscomp$1 = null, formActionName = null;
          if ("function" === typeof formAction$jscomp$1) {
            var customFields = getCustomFormFields(
              resumableState,
              formAction$jscomp$1
            );
            null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(
              attributeSeparator,
              "action",
              attributeAssign,
              actionJavaScriptURL,
              attributeEnd
            ), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
          }
          null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
          null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
          null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
          null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          null !== formActionName && (target$jscomp$0.push(startHiddenInputChunk), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push(endOfStartTagSelfClosing), null != formData$jscomp$1 && formData$jscomp$1.forEach(pushAdditionalFormField, target$jscomp$0));
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
          if ("string" === typeof children$jscomp$4) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
            var JSCompiler_inline_result$jscomp$1 = null;
          } else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
          return JSCompiler_inline_result$jscomp$1;
        case "menuitem":
          target$jscomp$0.push(startChunkForTag("menuitem"));
          for (var propKey$jscomp$6 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$6)) {
              var propValue$jscomp$6 = props[propKey$jscomp$6];
              if (null != propValue$jscomp$6)
                switch (propKey$jscomp$6) {
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "menuitems cannot have `children` nor `dangerouslySetInnerHTML`."
                    );
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$6,
                      propValue$jscomp$6
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          return null;
        case "object":
          target$jscomp$0.push(startChunkForTag("object"));
          var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
          for (propKey$jscomp$7 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$7)) {
              var propValue$jscomp$7 = props[propKey$jscomp$7];
              if (null != propValue$jscomp$7)
                switch (propKey$jscomp$7) {
                  case "children":
                    children$jscomp$5 = propValue$jscomp$7;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$4 = propValue$jscomp$7;
                    break;
                  case "data":
                    var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
                    if ("" === sanitizedValue) break;
                    target$jscomp$0.push(
                      attributeSeparator,
                      "data",
                      attributeAssign,
                      escapeTextForBrowser(sanitizedValue),
                      attributeEnd
                    );
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$7,
                      propValue$jscomp$7
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
          if ("string" === typeof children$jscomp$5) {
            target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
            var JSCompiler_inline_result$jscomp$2 = null;
          } else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
          return JSCompiler_inline_result$jscomp$2;
        case "title":
          var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(
              target$jscomp$0,
              props
            );
          else
            isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
          return JSCompiler_inline_result$jscomp$3;
        case "link":
          var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
            pushLinkImpl(target$jscomp$0, props);
            var JSCompiler_inline_result$jscomp$4 = null;
          } else if ("stylesheet" === props.rel)
            if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError)
              JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
                target$jscomp$0,
                props
              );
            else {
              var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
              if (null !== resourceState) {
                resumableState.styleResources[href] = null;
                styleQueue || (styleQueue = {
                  precedence: escapeTextForBrowser(precedence),
                  rules: [],
                  hrefs: [],
                  sheets: /* @__PURE__ */ new Map()
                }, renderState.styles.set(precedence, styleQueue));
                var resource = {
                  state: 0,
                  props: assign({}, props, {
                    "data-precedence": props.precedence,
                    precedence: null
                  })
                };
                if (resourceState) {
                  2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
                  var preloadResource = renderState.preloads.stylesheets.get(href);
                  preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
                }
                styleQueue.sheets.set(href, resource);
                hoistableState && hoistableState.stylesheets.add(resource);
              } else if (styleQueue) {
                var resource$9 = styleQueue.sheets.get(href);
                resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
              }
              textEmbedded && target$jscomp$0.push(textSeparator);
              JSCompiler_inline_result$jscomp$4 = null;
            }
          else
            props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(
              target$jscomp$0,
              props
            ) : (textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
          return JSCompiler_inline_result$jscomp$4;
        case "script":
          var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
          if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(
              target$jscomp$0,
              props
            );
          else {
            var key = props.src;
            if ("module" === props.type) {
              var resources = resumableState.moduleScriptResources;
              var preloads = renderState.preloads.moduleScripts;
            } else
              resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
            var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
            if (null !== resourceState$jscomp$0) {
              resources[key] = null;
              var scriptProps = props;
              if (resourceState$jscomp$0) {
                2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
                var preloadResource$jscomp$0 = preloads.get(key);
                preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
              }
              var resource$jscomp$0 = [];
              renderState.scripts.add(resource$jscomp$0);
              pushScriptImpl(resource$jscomp$0, scriptProps);
            }
            textEmbedded && target$jscomp$0.push(textSeparator);
            JSCompiler_inline_result$jscomp$5 = null;
          }
          return JSCompiler_inline_result$jscomp$5;
        case "style":
          var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
            target$jscomp$0.push(startChunkForTag("style"));
            var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
            for (propKey$jscomp$8 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$8)) {
                var propValue$jscomp$8 = props[propKey$jscomp$8];
                if (null != propValue$jscomp$8)
                  switch (propKey$jscomp$8) {
                    case "children":
                      children$jscomp$6 = propValue$jscomp$8;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$5 = propValue$jscomp$8;
                      break;
                    default:
                      pushAttribute(
                        target$jscomp$0,
                        propKey$jscomp$8,
                        propValue$jscomp$8
                      );
                  }
              }
            target$jscomp$0.push(endOfStartTag);
            var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
            "function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
            target$jscomp$0.push(endChunkForTag("style"));
            var JSCompiler_inline_result$jscomp$6 = null;
          } else {
            var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
            if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
              resumableState.styleResources[href$jscomp$0] = null;
              styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
                precedence: escapeTextForBrowser(precedence$jscomp$0),
                rules: [],
                hrefs: [],
                sheets: /* @__PURE__ */ new Map()
              }, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
              var nonceStyle = renderState.nonce.style;
              if (!nonceStyle || nonceStyle === nonce) {
                styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
                var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
                for (propKey$jscomp$9 in props)
                  if (hasOwnProperty.call(props, propKey$jscomp$9)) {
                    var propValue$jscomp$9 = props[propKey$jscomp$9];
                    if (null != propValue$jscomp$9)
                      switch (propKey$jscomp$9) {
                        case "children":
                          children$jscomp$7 = propValue$jscomp$9;
                          break;
                        case "dangerouslySetInnerHTML":
                          innerHTML$jscomp$6 = propValue$jscomp$9;
                      }
                  }
                var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
                "function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(
                  ("" + child$jscomp$0).replace(styleRegex, styleReplacer)
                );
                pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
              }
            }
            styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
            textEmbedded && target$jscomp$0.push(textSeparator);
            JSCompiler_inline_result$jscomp$6 = void 0;
          }
          return JSCompiler_inline_result$jscomp$6;
        case "meta":
          var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
          if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp)
            var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(
              target$jscomp$0,
              props,
              "meta",
              formatContext
            );
          else
            textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(
              renderState.charsetChunks,
              props,
              "meta",
              formatContext
            ) : "viewport" === props.name ? pushSelfClosing(
              renderState.viewportChunks,
              props,
              "meta",
              formatContext
            ) : pushSelfClosing(
              renderState.hoistableChunks,
              props,
              "meta",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$7;
        case "listing":
        case "pre":
          target$jscomp$0.push(startChunkForTag(type));
          var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
          for (propKey$jscomp$10 in props)
            if (hasOwnProperty.call(props, propKey$jscomp$10)) {
              var propValue$jscomp$10 = props[propKey$jscomp$10];
              if (null != propValue$jscomp$10)
                switch (propKey$jscomp$10) {
                  case "children":
                    children$jscomp$8 = propValue$jscomp$10;
                    break;
                  case "dangerouslySetInnerHTML":
                    innerHTML$jscomp$7 = propValue$jscomp$10;
                    break;
                  default:
                    pushAttribute(
                      target$jscomp$0,
                      propKey$jscomp$10,
                      propValue$jscomp$10
                    );
                }
            }
          pushViewTransitionAttributes(target$jscomp$0, formatContext);
          target$jscomp$0.push(endOfStartTag);
          if (null != innerHTML$jscomp$7) {
            if (null != children$jscomp$8)
              throw Error(
                "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
              );
            if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            var html = innerHTML$jscomp$7.__html;
            null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push(leadingNewline, html) : target$jscomp$0.push("" + html));
          }
          "string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push(leadingNewline);
          return children$jscomp$8;
        case "img":
          var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
          if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
            null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = true);
            var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
            if (resource$jscomp$1) {
              if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size)
                promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
            } else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
              resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
              var input = props.crossOrigin;
              var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
              var headers = renderState.headers, header;
              headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
                imageSrcSet: props.srcSet,
                imageSizes: props.sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
                rel: "preload",
                as: "image",
                href: srcSet ? void 0 : src,
                imageSrcSet: srcSet,
                imageSizes: sizes,
                crossOrigin: JSCompiler_inline_result$jscomp$8,
                integrity: props.integrity,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy
              }), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
            }
          }
          return pushSelfClosing(target$jscomp$0, props, "img", formatContext);
        case "base":
        case "area":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "param":
        case "source":
        case "track":
        case "wbr":
          return pushSelfClosing(target$jscomp$0, props, type, formatContext);
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          break;
        case "head":
          if (2 > formatContext.insertionMode) {
            var preamble = preambleState || renderState.preamble;
            if (preamble.headChunks)
              throw Error("The `<head>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push(headPreambleContributionChunk);
            preamble.headChunks = [];
            var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(
              preamble.headChunks,
              props,
              "head",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "head",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$9;
        case "body":
          if (2 > formatContext.insertionMode) {
            var preamble$jscomp$0 = preambleState || renderState.preamble;
            if (preamble$jscomp$0.bodyChunks)
              throw Error("The `<body>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push(bodyPreambleContributionChunk);
            preamble$jscomp$0.bodyChunks = [];
            var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(
              preamble$jscomp$0.bodyChunks,
              props,
              "body",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "body",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$10;
        case "html":
          if (0 === formatContext.insertionMode) {
            var preamble$jscomp$1 = preambleState || renderState.preamble;
            if (preamble$jscomp$1.htmlChunks)
              throw Error("The `<html>` tag may only be rendered once.");
            null !== preambleState && target$jscomp$0.push(htmlPreambleContributionChunk);
            preamble$jscomp$1.htmlChunks = [doctypeChunk];
            var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(
              preamble$jscomp$1.htmlChunks,
              props,
              "html",
              formatContext
            );
          } else
            JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(
              target$jscomp$0,
              props,
              "html",
              formatContext
            );
          return JSCompiler_inline_result$jscomp$11;
        default:
          if (-1 !== type.indexOf("-")) {
            target$jscomp$0.push(startChunkForTag(type));
            var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
            for (propKey$jscomp$11 in props)
              if (hasOwnProperty.call(props, propKey$jscomp$11)) {
                var propValue$jscomp$11 = props[propKey$jscomp$11];
                if (null != propValue$jscomp$11) {
                  var attributeName = propKey$jscomp$11;
                  switch (propKey$jscomp$11) {
                    case "children":
                      children$jscomp$9 = propValue$jscomp$11;
                      break;
                    case "dangerouslySetInnerHTML":
                      innerHTML$jscomp$8 = propValue$jscomp$11;
                      break;
                    case "style":
                      pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
                      break;
                    case "suppressContentEditableWarning":
                    case "suppressHydrationWarning":
                    case "ref":
                      break;
                    case "className":
                      attributeName = "class";
                    default:
                      if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && false !== propValue$jscomp$11) {
                        if (true === propValue$jscomp$11) propValue$jscomp$11 = "";
                        else if ("object" === typeof propValue$jscomp$11) continue;
                        target$jscomp$0.push(
                          attributeSeparator,
                          attributeName,
                          attributeAssign,
                          escapeTextForBrowser(propValue$jscomp$11),
                          attributeEnd
                        );
                      }
                  }
                }
              }
            pushViewTransitionAttributes(target$jscomp$0, formatContext);
            target$jscomp$0.push(endOfStartTag);
            pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
            return children$jscomp$9;
          }
      }
      return pushStartGenericElement(target$jscomp$0, props, type, formatContext);
    }
    var endTagCache = /* @__PURE__ */ new Map();
    function endChunkForTag(tag) {
      var chunk = endTagCache.get(tag);
      void 0 === chunk && (chunk = stringToPrecomputedChunk("</" + tag + ">"), endTagCache.set(tag, chunk));
      return chunk;
    }
    function hoistPreambleState(renderState, preambleState) {
      renderState = renderState.preamble;
      null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
      null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
      null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
    }
    function writeBootstrap(destination, renderState) {
      renderState = renderState.bootstrapChunks;
      for (var i = 0; i < renderState.length - 1; i++)
        writeChunk(destination, renderState[i]);
      return i < renderState.length ? (i = renderState[i], renderState.length = 0, writeChunkAndReturn(destination, i)) : true;
    }
    var shellTimeRuntimeScript = stringToPrecomputedChunk(
      "requestAnimationFrame(function(){$RT=performance.now()});"
    );
    var placeholder1 = stringToPrecomputedChunk('<template id="');
    var placeholder2 = stringToPrecomputedChunk('"></template>');
    var startActivityBoundary = stringToPrecomputedChunk("<!--&-->");
    var endActivityBoundary = stringToPrecomputedChunk("<!--/&-->");
    var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
    var startPendingSuspenseBoundary1 = stringToPrecomputedChunk(
      '<!--$?--><template id="'
    );
    var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
    var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
    var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
    var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
    var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
    var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
    stringToPrecomputedChunk(' data-msg="');
    stringToPrecomputedChunk(' data-stck="');
    stringToPrecomputedChunk(' data-cstck="');
    var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
    function writeStartPendingSuspenseBoundary(destination, renderState, id) {
      writeChunk(destination, startPendingSuspenseBoundary1);
      if (null === id)
        throw Error(
          "An ID must have been assigned before we can complete the boundary."
        );
      writeChunk(destination, renderState.boundaryPrefix);
      writeChunk(destination, id.toString(16));
      return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
    }
    var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
    var startSegmentHTML2 = stringToPrecomputedChunk('">');
    var endSegmentHTML = stringToPrecomputedChunk("</div>");
    var startSegmentSVG = stringToPrecomputedChunk(
      '<svg aria-hidden="true" style="display:none" id="'
    );
    var startSegmentSVG2 = stringToPrecomputedChunk('">');
    var endSegmentSVG = stringToPrecomputedChunk("</svg>");
    var startSegmentMathML = stringToPrecomputedChunk(
      '<math aria-hidden="true" style="display:none" id="'
    );
    var startSegmentMathML2 = stringToPrecomputedChunk('">');
    var endSegmentMathML = stringToPrecomputedChunk("</math>");
    var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
    var startSegmentTable2 = stringToPrecomputedChunk('">');
    var endSegmentTable = stringToPrecomputedChunk("</table>");
    var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
    var startSegmentTableBody2 = stringToPrecomputedChunk('">');
    var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
    var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
    var startSegmentTableRow2 = stringToPrecomputedChunk('">');
    var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
    var startSegmentColGroup = stringToPrecomputedChunk(
      '<table hidden><colgroup id="'
    );
    var startSegmentColGroup2 = stringToPrecomputedChunk('">');
    var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
    function writeStartSegment(destination, renderState, formatContext, id) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return writeChunk(destination, startSegmentHTML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentHTML2);
        case 4:
          return writeChunk(destination, startSegmentSVG), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentSVG2);
        case 5:
          return writeChunk(destination, startSegmentMathML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentMathML2);
        case 6:
          return writeChunk(destination, startSegmentTable), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentTable2);
        case 7:
          return writeChunk(destination, startSegmentTableBody), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentTableBody2);
        case 8:
          return writeChunk(destination, startSegmentTableRow), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentTableRow2);
        case 9:
          return writeChunk(destination, startSegmentColGroup), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, id.toString(16)), writeChunkAndReturn(destination, startSegmentColGroup2);
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    function writeEndSegment(destination, formatContext) {
      switch (formatContext.insertionMode) {
        case 0:
        case 1:
        case 3:
        case 2:
          return writeChunkAndReturn(destination, endSegmentHTML);
        case 4:
          return writeChunkAndReturn(destination, endSegmentSVG);
        case 5:
          return writeChunkAndReturn(destination, endSegmentMathML);
        case 6:
          return writeChunkAndReturn(destination, endSegmentTable);
        case 7:
          return writeChunkAndReturn(destination, endSegmentTableBody);
        case 8:
          return writeChunkAndReturn(destination, endSegmentTableRow);
        case 9:
          return writeChunkAndReturn(destination, endSegmentColGroup);
        default:
          throw Error("Unknown insertion mode. This is a bug in React.");
      }
    }
    var completeSegmentScript1Full = stringToPrecomputedChunk(
      '$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'
    );
    var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
    var completeSegmentScript2 = stringToPrecomputedChunk('","');
    var completeSegmentScriptEnd = stringToPrecomputedChunk('")</script>');
    stringToPrecomputedChunk('<template data-rsi="" data-sid="');
    stringToPrecomputedChunk('" data-pid="');
    var completeBoundaryScriptFunctionOnly = stringToPrecomputedChunk(
      '$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d||"/&"===d)if(0===h)break;else h--;else"$"!==d&&"$?"!==d&&"$~"!==d&&"$!"!==d&&"&"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data="$";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data="$~",$RB.push(a,b),2===$RB.length&&("number"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};'
    );
    var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
    var completeBoundaryWithStylesScript1FullPartial = stringToPrecomputedChunk(
      '$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll("link[data-precedence],style[data-precedence]"),v=[],k=0;b=e[k++];)"not all"===b.getAttribute("media")?v.push(b):("LINK"===b.tagName&&$RM.set(b.getAttribute("href"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement("link");a.href=d;a.rel=\n"stylesheet";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute("media");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute("data-precedence");a.removeAttribute("media")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n"$~";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,"CSS failed to load"))};$RR("'
    );
    var completeBoundaryWithStylesScript1Partial = stringToPrecomputedChunk('$RR("');
    var completeBoundaryScript2 = stringToPrecomputedChunk('","');
    var completeBoundaryScript3a = stringToPrecomputedChunk('",');
    var completeBoundaryScript3b = stringToPrecomputedChunk('"');
    var completeBoundaryScriptEnd = stringToPrecomputedChunk(")</script>");
    stringToPrecomputedChunk('<template data-rci="" data-bid="');
    stringToPrecomputedChunk('<template data-rri="" data-bid="');
    stringToPrecomputedChunk('" data-sid="');
    stringToPrecomputedChunk('" data-sty="');
    var clientRenderScriptFunctionOnly = stringToPrecomputedChunk(
      '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};'
    );
    var clientRenderScript1Full = stringToPrecomputedChunk(
      '$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,null!=c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX("'
    );
    var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
    var clientRenderScript1A = stringToPrecomputedChunk('"');
    var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
    var clientRenderErrorScriptNull = stringToPrecomputedChunk("null");
    var clientRenderScriptEnd = stringToPrecomputedChunk(")</script>");
    stringToPrecomputedChunk('<template data-rxi="" data-bid="');
    stringToPrecomputedChunk('" data-dgst="');
    stringToPrecomputedChunk('" data-msg="');
    stringToPrecomputedChunk('" data-stck="');
    stringToPrecomputedChunk('" data-cstck="');
    var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
    function escapeJSStringsForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInInstructionScripts,
        function(match) {
          switch (match) {
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
    function escapeJSObjectForInstructionScripts(input) {
      return JSON.stringify(input).replace(
        regexForJSStringsInScripts,
        function(match) {
          switch (match) {
            case "&":
              return "\\u0026";
            case ">":
              return "\\u003e";
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default:
              throw Error(
                "escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
              );
          }
        }
      );
    }
    var lateStyleTagResourceOpen1 = stringToPrecomputedChunk(
      ' media="not all" data-precedence="'
    );
    var lateStyleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="');
    var lateStyleTagResourceOpen3 = stringToPrecomputedChunk('">');
    var lateStyleTagTemplateClose = stringToPrecomputedChunk("</style>");
    var currentlyRenderingBoundaryHasStylesToHoist = false;
    var destinationHasCapacity = true;
    function flushStyleTagsLateForBoundary(styleQueue) {
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
      if (hrefs.length) {
        writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
        writeChunk(this, lateStyleTagResourceOpen1);
        writeChunk(this, styleQueue.precedence);
        for (writeChunk(this, lateStyleTagResourceOpen2); i < hrefs.length - 1; i++)
          writeChunk(this, hrefs[i]), writeChunk(this, spaceSeparator);
        writeChunk(this, hrefs[i]);
        writeChunk(this, lateStyleTagResourceOpen3);
        for (i = 0; i < rules.length; i++) writeChunk(this, rules[i]);
        destinationHasCapacity = writeChunkAndReturn(
          this,
          lateStyleTagTemplateClose
        );
        currentlyRenderingBoundaryHasStylesToHoist = true;
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function hasStylesToHoist(stylesheet) {
      return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = true : false;
    }
    function writeHoistablesForBoundary(destination, hoistableState, renderState) {
      currentlyRenderingBoundaryHasStylesToHoist = false;
      destinationHasCapacity = true;
      currentlyFlushingRenderState = renderState;
      hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
      currentlyFlushingRenderState = null;
      hoistableState.stylesheets.forEach(hasStylesToHoist);
      currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = true);
      return destinationHasCapacity;
    }
    function flushResource(resource) {
      for (var i = 0; i < resource.length; i++) writeChunk(this, resource[i]);
      resource.length = 0;
    }
    var stylesheetFlushingQueue = [];
    function flushStyleInPreamble(stylesheet) {
      pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
      for (var i = 0; i < stylesheetFlushingQueue.length; i++)
        writeChunk(this, stylesheetFlushingQueue[i]);
      stylesheetFlushingQueue.length = 0;
      stylesheet.state = 2;
    }
    var styleTagResourceOpen1 = stringToPrecomputedChunk(' data-precedence="');
    var styleTagResourceOpen2 = stringToPrecomputedChunk('" data-href="');
    var spaceSeparator = stringToPrecomputedChunk(" ");
    var styleTagResourceOpen3 = stringToPrecomputedChunk('">');
    var styleTagResourceClose = stringToPrecomputedChunk("</style>");
    function flushStylesInPreamble(styleQueue) {
      var hasStylesheets = 0 < styleQueue.sheets.size;
      styleQueue.sheets.forEach(flushStyleInPreamble, this);
      styleQueue.sheets.clear();
      var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
      if (!hasStylesheets || hrefs.length) {
        writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
        writeChunk(this, styleTagResourceOpen1);
        writeChunk(this, styleQueue.precedence);
        styleQueue = 0;
        if (hrefs.length) {
          for (writeChunk(this, styleTagResourceOpen2); styleQueue < hrefs.length - 1; styleQueue++)
            writeChunk(this, hrefs[styleQueue]), writeChunk(this, spaceSeparator);
          writeChunk(this, hrefs[styleQueue]);
        }
        writeChunk(this, styleTagResourceOpen3);
        for (styleQueue = 0; styleQueue < rules.length; styleQueue++)
          writeChunk(this, rules[styleQueue]);
        writeChunk(this, styleTagResourceClose);
        rules.length = 0;
        hrefs.length = 0;
      }
    }
    function preloadLateStyle(stylesheet) {
      if (0 === stylesheet.state) {
        stylesheet.state = 1;
        var props = stylesheet.props;
        pushLinkImpl(stylesheetFlushingQueue, {
          rel: "preload",
          as: "style",
          href: stylesheet.props.href,
          crossOrigin: props.crossOrigin,
          fetchPriority: props.fetchPriority,
          integrity: props.integrity,
          media: props.media,
          hrefLang: props.hrefLang,
          referrerPolicy: props.referrerPolicy
        });
        for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++)
          writeChunk(this, stylesheetFlushingQueue[stylesheet]);
        stylesheetFlushingQueue.length = 0;
      }
    }
    function preloadLateStyles(styleQueue) {
      styleQueue.sheets.forEach(preloadLateStyle, this);
      styleQueue.sheets.clear();
    }
    stringToPrecomputedChunk('<link rel="expect" href="#');
    stringToPrecomputedChunk('" blocking="render"/>');
    var completedShellIdAttributeStart = stringToPrecomputedChunk(' id="');
    function pushCompletedShellIdAttribute(target, resumableState) {
      0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(
        completedShellIdAttributeStart,
        escapeTextForBrowser("_" + resumableState.idPrefix + "R_"),
        attributeEnd
      ));
    }
    var arrayFirstOpenBracket = stringToPrecomputedChunk("[");
    var arraySubsequentOpenBracket = stringToPrecomputedChunk(",[");
    var arrayInterstitial = stringToPrecomputedChunk(",");
    var arrayCloseBracket = stringToPrecomputedChunk("]");
    function writeStyleResourceDependenciesInJS(destination, hoistableState) {
      writeChunk(destination, arrayFirstOpenBracket);
      var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
      hoistableState.stylesheets.forEach(function(resource) {
        if (2 !== resource.state)
          if (3 === resource.state)
            writeChunk(destination, nextArrayOpenBrackChunk), writeChunk(
              destination,
              escapeJSObjectForInstructionScripts("" + resource.props.href)
            ), writeChunk(destination, arrayCloseBracket), nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
          else {
            writeChunk(destination, nextArrayOpenBrackChunk);
            var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
            writeChunk(
              destination,
              escapeJSObjectForInstructionScripts(coercedHref)
            );
            precedence = "" + precedence;
            writeChunk(destination, arrayInterstitial);
            writeChunk(
              destination,
              escapeJSObjectForInstructionScripts(precedence)
            );
            for (var propKey in props)
              if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence))
                switch (propKey) {
                  case "href":
                  case "rel":
                  case "precedence":
                  case "data-precedence":
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      "link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  default:
                    writeStyleResourceAttributeInJS(
                      destination,
                      propKey,
                      precedence
                    );
                }
            writeChunk(destination, arrayCloseBracket);
            nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
            resource.state = 3;
          }
      });
      writeChunk(destination, arrayCloseBracket);
    }
    function writeStyleResourceAttributeInJS(destination, name, value) {
      var attributeName = name.toLowerCase();
      switch (typeof value) {
        case "function":
        case "symbol":
          return;
      }
      switch (name) {
        case "innerHTML":
        case "dangerouslySetInnerHTML":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "style":
        case "ref":
          return;
        case "className":
          attributeName = "class";
          name = "" + value;
          break;
        case "hidden":
          if (false === value) return;
          name = "";
          break;
        case "src":
        case "href":
          value = sanitizeURL(value);
          name = "" + value;
          break;
        default:
          if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name))
            return;
          name = "" + value;
      }
      writeChunk(destination, arrayInterstitial);
      writeChunk(destination, escapeJSObjectForInstructionScripts(attributeName));
      writeChunk(destination, arrayInterstitial);
      writeChunk(destination, escapeJSObjectForInstructionScripts(name));
    }
    function createHoistableState() {
      return { styles: /* @__PURE__ */ new Set(), stylesheets: /* @__PURE__ */ new Set(), suspenseyImages: false };
    }
    function prefetchDNS(href) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          if (!resumableState.dnsResources.hasOwnProperty(href)) {
            resumableState.dnsResources[href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity)
              JSCompiler_temp = (header = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
            JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, { href, rel: "dns-prefetch" }), renderState.preconnects.add(header));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.D(href);
    }
    function preconnect(href, crossOrigin) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if ("string" === typeof href && href) {
          var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
          if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
            resumableState.connectResources[bucket][href] = null;
            resumableState = renderState.headers;
            var header, JSCompiler_temp;
            if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
              JSCompiler_temp = "<" + ("" + href).replace(
                regexForHrefInLinkHeaderURLContext,
                escapeHrefForLinkHeaderURLContextReplacer
              ) + ">; rel=preconnect";
              if ("string" === typeof crossOrigin) {
                var escapedCrossOrigin = ("" + crossOrigin).replace(
                  regexForLinkHeaderQuotedParamValueContext,
                  escapeStringForLinkHeaderQuotedParamValueContextReplacer
                );
                JSCompiler_temp += '; crossorigin="' + escapedCrossOrigin + '"';
              }
              JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
            }
            JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
              rel: "preconnect",
              href,
              crossOrigin
            }), renderState.preconnects.add(bucket));
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.C(href, crossOrigin);
    }
    function preload(href, as, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (as && href) {
          switch (as) {
            case "image":
              if (options) {
                var imageSrcSet = options.imageSrcSet;
                var imageSizes = options.imageSizes;
                var fetchPriority = options.fetchPriority;
              }
              var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
              if (resumableState.imageResources.hasOwnProperty(key)) return;
              resumableState.imageResources[key] = PRELOAD_NO_CREDS;
              resumableState = renderState.headers;
              var header;
              resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(
                resumableState,
                assign(
                  { rel: "preload", href: imageSrcSet ? void 0 : href, as },
                  options
                )
              ), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
              break;
            case "style":
              if (resumableState.styleResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.stylesheets.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              break;
            case "script":
              if (resumableState.scriptResources.hasOwnProperty(href)) return;
              imageSrcSet = [];
              renderState.preloads.scripts.set(href, imageSrcSet);
              renderState.bulkPreloads.add(imageSrcSet);
              pushLinkImpl(
                imageSrcSet,
                assign({ rel: "preload", href, as }, options)
              );
              resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              break;
            default:
              if (resumableState.unknownResources.hasOwnProperty(as)) {
                if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href))
                  return;
              } else
                imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
              imageSrcSet[href] = PRELOAD_NO_CREDS;
              if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2)))
                renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
              else
                switch (resumableState = [], href = assign({ rel: "preload", href, as }, options), pushLinkImpl(resumableState, href), as) {
                  case "font":
                    renderState.fontPreloads.add(resumableState);
                    break;
                  default:
                    renderState.bulkPreloads.add(resumableState);
                }
          }
          enqueueFlush(request);
        }
      } else previousDispatcher.L(href, as, options);
    }
    function preloadModule(href, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          var as = options && "string" === typeof options.as ? options.as : "script";
          switch (as) {
            case "script":
              if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
              as = [];
              resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
              renderState.preloads.moduleScripts.set(href, as);
              break;
            default:
              if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
                var resources = resumableState.moduleUnknownResources[as];
                if (resources.hasOwnProperty(href)) return;
              } else
                resources = {}, resumableState.moduleUnknownResources[as] = resources;
              as = [];
              resources[href] = PRELOAD_NO_CREDS;
          }
          pushLinkImpl(as, assign({ rel: "modulepreload", href }, options));
          renderState.bulkPreloads.add(as);
          enqueueFlush(request);
        }
      } else previousDispatcher.m(href, options);
    }
    function preinitStyle(href, precedence, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (href) {
          precedence = precedence || "default";
          var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
          null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
            precedence: escapeTextForBrowser(precedence),
            rules: [],
            hrefs: [],
            sheets: /* @__PURE__ */ new Map()
          }, renderState.styles.set(precedence, styleQueue)), precedence = {
            state: 0,
            props: assign(
              { rel: "stylesheet", href, "data-precedence": precedence },
              options
            )
          }, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
        }
      } else previousDispatcher.S(href, precedence, options);
    }
    function preinitScript(src, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
          null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({ src, async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.X(src, options);
    }
    function preinitModuleScript(src, options) {
      var request = resolveRequest();
      if (request) {
        var resumableState = request.resumableState, renderState = request.renderState;
        if (src) {
          var resourceState = resumableState.moduleScriptResources.hasOwnProperty(
            src
          ) ? resumableState.moduleScriptResources[src] : void 0;
          null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({ src, type: "module", async: true }, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
        }
      } else previousDispatcher.M(src, options);
    }
    function adoptPreloadCredentials(target, preloadState) {
      null == target.crossOrigin && (target.crossOrigin = preloadState[0]);
      null == target.integrity && (target.integrity = preloadState[1]);
    }
    function getPreloadAsHeader(href, as, params) {
      href = ("" + href).replace(
        regexForHrefInLinkHeaderURLContext,
        escapeHrefForLinkHeaderURLContextReplacer
      );
      as = ("" + as).replace(
        regexForLinkHeaderQuotedParamValueContext,
        escapeStringForLinkHeaderQuotedParamValueContextReplacer
      );
      as = "<" + href + '>; rel=preload; as="' + as + '"';
      for (var paramName in params)
        hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + '="' + ("" + href).replace(
          regexForLinkHeaderQuotedParamValueContext,
          escapeStringForLinkHeaderQuotedParamValueContextReplacer
        ) + '"'));
      return as;
    }
    var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
    function escapeHrefForLinkHeaderURLContextReplacer(match) {
      switch (match) {
        case "<":
          return "%3C";
        case ">":
          return "%3E";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
    function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
      switch (match) {
        case '"':
          return "%22";
        case "'":
          return "%27";
        case ";":
          return "%3B";
        case ",":
          return "%2C";
        case "\n":
          return "%0A";
        case "\r":
          return "%0D";
        default:
          throw Error(
            "escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React"
          );
      }
    }
    function hoistStyleQueueDependency(styleQueue) {
      this.styles.add(styleQueue);
    }
    function hoistStylesheetDependency(stylesheet) {
      this.stylesheets.add(stylesheet);
    }
    function hoistHoistables(parentState, childState) {
      childState.styles.forEach(hoistStyleQueueDependency, parentState);
      childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
      childState.suspenseyImages && (parentState.suspenseyImages = true);
    }
    function hasSuspenseyContent(hoistableState, flushingInShell) {
      return flushingInShell ? hoistableState.suspenseyImages : 0 < hoistableState.stylesheets.size || hoistableState.suspenseyImages;
    }
    var bind = Function.prototype.bind;
    var requestStorage = new async_hooks.AsyncLocalStorage();
    var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
        case REACT_VIEW_TRANSITION_TYPE:
          return "ViewTransition";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {
            }
        }
      return null;
    }
    var emptyContextObject = {};
    var currentActiveSnapshot = null;
    function popToNearestCommonAncestor(prev, next) {
      if (prev !== next) {
        prev.context._currentValue = prev.parentValue;
        prev = prev.parent;
        var parentNext = next.parent;
        if (null === prev) {
          if (null !== parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
        } else {
          if (null === parentNext)
            throw Error(
              "The stacks must reach the root at the same time. This is a bug in React."
            );
          popToNearestCommonAncestor(prev, parentNext);
        }
        next.context._currentValue = next.value;
      }
    }
    function popAllPrevious(prev) {
      prev.context._currentValue = prev.parentValue;
      prev = prev.parent;
      null !== prev && popAllPrevious(prev);
    }
    function pushAllNext(next) {
      var parentNext = next.parent;
      null !== parentNext && pushAllNext(parentNext);
      next.context._currentValue = next.value;
    }
    function popPreviousToCommonLevel(prev, next) {
      prev.context._currentValue = prev.parentValue;
      prev = prev.parent;
      if (null === prev)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
    }
    function popNextToCommonLevel(prev, next) {
      var parentNext = next.parent;
      if (null === parentNext)
        throw Error(
          "The depth must equal at least at zero before reaching the root. This is a bug in React."
        );
      prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
      next.context._currentValue = next.value;
    }
    function switchContext(newSnapshot) {
      var prev = currentActiveSnapshot;
      prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
    }
    var classComponentUpdater = {
      enqueueSetState: function(inst, payload) {
        inst = inst._reactInternals;
        null !== inst.queue && inst.queue.push(payload);
      },
      enqueueReplaceState: function(inst, payload) {
        inst = inst._reactInternals;
        inst.replace = true;
        inst.queue = [payload];
      },
      enqueueForceUpdate: function() {
      }
    };
    var emptyTreeContext = { id: 1, overflow: "" };
    function getTreeId(context) {
      var overflow = context.overflow;
      context = context.id;
      return (context & ~(1 << 32 - clz32(context) - 1)).toString(32) + overflow;
    }
    function pushTreeContext(baseContext, totalChildren, index) {
      var baseIdWithLeadingBit = baseContext.id;
      baseContext = baseContext.overflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength);
      index += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
        baseIdWithLeadingBit >>= numberOfOverflowBits;
        baseLength -= numberOfOverflowBits;
        return {
          id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
          overflow: length + baseContext
        };
      }
      return {
        id: 1 << length | index << baseLength | baseIdWithLeadingBit,
        overflow: baseContext
      };
    }
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
    var log = Math.log;
    var LN2 = Math.LN2;
    function clz32Fallback(x) {
      x >>>= 0;
      return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
    }
    function noop() {
    }
    var SuspenseException = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    );
    function trackUsedThenable(thenableState2, thenable, index) {
      index = thenableState2[index];
      void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          thenableState2 = thenable.reason;
          if (void 0 === thenableState2 && !("reason" in thenable))
            throw Error(
              "A rejected Promise was passed to React without a `reason` property. React threw a generic error from where the Promise was used to assist in identifying the problematic Promise. Make sure that instrumented Promises correctly set the `reason` property when setting `status` to `'rejected'`."
            );
          throw thenableState2;
        default:
          "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
            function(fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function(error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          ));
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    var suspendedThenable = null;
    function getSuspendedThenable() {
      if (null === suspendedThenable)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    var currentlyRenderingComponent = null;
    var currentlyRenderingTask = null;
    var currentlyRenderingRequest = null;
    var currentlyRenderingKeyPath = null;
    var firstWorkInProgressHook = null;
    var workInProgressHook = null;
    var isReRender = false;
    var didScheduleRenderPhaseUpdate = false;
    var localIdCounter = 0;
    var actionStateCounter = 0;
    var actionStateMatchingIndex = -1;
    var thenableIndexCounter = 0;
    var thenableState = null;
    function createRecoverableError(recoverable) {
      recoverable = recoverable._reason;
      if ("function" === typeof recoverable)
        try {
          var initializedReason = recoverable();
        } catch ($jscomp$unused$catch) {
          initializedReason = "The reason for browser-only rendering could not be determined because its initializer threw.";
        }
      else initializedReason = recoverable;
      initializedReason = Error(
        "Browser-only rendering was requested by `browser()`.",
        void 0 === recoverable ? void 0 : { cause: initializedReason }
      );
      Object.defineProperty(initializedReason, REACT_RECOVERABLE_TYPE, {
        value: true
      });
      return initializedReason;
    }
    function isRecoverableError(error) {
      return "object" !== typeof error || null === error ? false : true === error[REACT_RECOVERABLE_TYPE];
    }
    function cloneRecoverableErrorAsFatal(recoverableError) {
      var fatalRecoverableError = Error(
        "The server render could not complete because client rendering was requested outside a Suspense boundary. See this error's cause for additional details.",
        hasOwnProperty.call(recoverableError, "cause") ? { cause: recoverableError.cause } : void 0
      );
      recoverableError = recoverableError.stack;
      if (void 0 !== recoverableError) {
        var frameStart = recoverableError.indexOf("\n");
        fatalRecoverableError.stack = fatalRecoverableError.name + ": " + fatalRecoverableError.message + (-1 === frameStart ? "" : recoverableError.slice(frameStart));
      } else fatalRecoverableError.stack = void 0;
      return fatalRecoverableError;
    }
    var renderPhaseUpdates = null;
    var numberOfReRenders = 0;
    function resolveCurrentlyRenderingComponent() {
      if (null === currentlyRenderingComponent)
        throw Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
      return currentlyRenderingComponent;
    }
    function createHook() {
      if (0 < numberOfReRenders)
        throw Error("Rendered more hooks than during the previous render");
      return { memoizedState: null, queue: null, next: null };
    }
    function createWorkInProgressHook() {
      null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = false, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = true, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = false, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = true, workInProgressHook = workInProgressHook.next);
      return workInProgressHook;
    }
    function getThenableStateAfterSuspending() {
      var state = thenableState;
      thenableState = null;
      return state;
    }
    function resetHooksState() {
      currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
      didScheduleRenderPhaseUpdate = false;
      firstWorkInProgressHook = null;
      numberOfReRenders = 0;
      workInProgressHook = renderPhaseUpdates = null;
    }
    function basicStateReducer(state, action) {
      return "function" === typeof action ? action(state) : action;
    }
    function useReducer(reducer, initialArg, init) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      if (isReRender) {
        var queue = workInProgressHook.queue;
        initialArg = queue.dispatch;
        if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
          renderPhaseUpdates.delete(queue);
          queue = workInProgressHook.memoizedState;
          do
            queue = reducer(queue, init.action), init = init.next;
          while (null !== init);
          workInProgressHook.memoizedState = queue;
          return [queue, initialArg];
        }
        return [workInProgressHook.memoizedState, initialArg];
      }
      reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
      workInProgressHook.memoizedState = reducer;
      reducer = workInProgressHook.queue = { last: null, dispatch: null };
      reducer = reducer.dispatch = dispatchAction.bind(
        null,
        currentlyRenderingComponent,
        reducer
      );
      return [workInProgressHook.memoizedState, reducer];
    }
    function useMemo3(nextCreate, deps) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      if (null !== workInProgressHook) {
        var prevState = workInProgressHook.memoizedState;
        if (null !== prevState && null !== deps) {
          var prevDeps = prevState[1];
          a: if (null === prevDeps) prevDeps = false;
          else {
            for (var i = 0; i < prevDeps.length && i < deps.length; i++)
              if (!objectIs(deps[i], prevDeps[i])) {
                prevDeps = false;
                break a;
              }
            prevDeps = true;
          }
          if (prevDeps) return prevState[0];
        }
      }
      nextCreate = nextCreate();
      workInProgressHook.memoizedState = [nextCreate, deps];
      return nextCreate;
    }
    function dispatchAction(componentIdentity, queue, action) {
      if (25 <= numberOfReRenders)
        throw Error(
          "Too many re-renders. React limits the number of renders to prevent an infinite loop."
        );
      if (componentIdentity === currentlyRenderingComponent)
        if (didScheduleRenderPhaseUpdate = true, componentIdentity = { action, next: null }, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action)
          renderPhaseUpdates.set(queue, componentIdentity);
        else {
          for (queue = action; null !== queue.next; ) queue = queue.next;
          queue.next = componentIdentity;
        }
    }
    function throwOnUseEffectEventCall() {
      throw Error(
        "A function wrapped in useEffectEvent can't be called during rendering."
      );
    }
    function unsupportedStartTransition() {
      throw Error("startTransition cannot be called during server rendering.");
    }
    function unsupportedSetOptimisticState() {
      throw Error("Cannot update optimistic state while rendering.");
    }
    function createPostbackActionStateKey(permalink, componentKeyPath, hookIndex) {
      if (void 0 !== permalink) return "p" + permalink;
      permalink = JSON.stringify([componentKeyPath, null, hookIndex]);
      componentKeyPath = crypto.createHash("md5");
      componentKeyPath.update(permalink);
      return "k" + componentKeyPath.digest("hex");
    }
    function useActionState(action, initialState, permalink) {
      resolveCurrentlyRenderingComponent();
      var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
      if ("function" === typeof action.$$FORM_ACTION) {
        var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
        request = request.formState;
        var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
        if (null !== request && "function" === typeof isSignatureEqual) {
          var postbackKey = request[1];
          isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = createPostbackActionStateKey(
            permalink,
            componentKeyPath,
            actionStateHookIndex
          ), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
        }
        var boundAction = action.bind(null, initialState);
        action = function(payload) {
          boundAction(payload);
        };
        "function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix2) {
          prefix2 = boundAction.$$FORM_ACTION(prefix2);
          void 0 !== permalink && (permalink += "", prefix2.action = permalink);
          var formData = prefix2.data;
          formData && (null === nextPostbackStateKey && (nextPostbackStateKey = createPostbackActionStateKey(
            permalink,
            componentKeyPath,
            actionStateHookIndex
          )), formData.append("$ACTION_KEY", nextPostbackStateKey));
          return prefix2;
        });
        return [initialState, action, false];
      }
      var boundAction$22 = action.bind(null, initialState);
      return [
        initialState,
        function(payload) {
          boundAction$22(payload);
        },
        false
      ];
    }
    function unwrapThenable(thenable) {
      var index = thenableIndexCounter;
      thenableIndexCounter += 1;
      null === thenableState && (thenableState = []);
      return trackUsedThenable(thenableState, thenable, index);
    }
    function unsupportedRefresh() {
      throw Error("Cache cannot be refreshed during server rendering.");
    }
    var HooksDispatcher = {
      readContext: function(context) {
        return context._currentValue;
      },
      use: function(usable) {
        if (null !== usable && "object" === typeof usable) {
          if ("function" === typeof usable.then) return unwrapThenable(usable);
          if (usable.$$typeof === REACT_RECOVERABLE_TYPE)
            throw createRecoverableError(usable);
          if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue;
        }
        throw Error("An unsupported type was passed to use(): " + String(usable));
      },
      useContext: function(context) {
        resolveCurrentlyRenderingComponent();
        return context._currentValue;
      },
      useMemo: useMemo3,
      useReducer,
      useRef: function(initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
      },
      useState: function(initialState) {
        return useReducer(basicStateReducer, initialState);
      },
      useInsertionEffect: noop,
      useLayoutEffect: noop,
      useCallback: function(callback, deps) {
        return useMemo3(function() {
          return callback;
        }, deps);
      },
      useImperativeHandle: noop,
      useEffect: noop,
      useDebugValue: noop,
      useDeferredValue: function(value, initialValue) {
        resolveCurrentlyRenderingComponent();
        return void 0 !== initialValue ? initialValue : value;
      },
      useTransition: function() {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      },
      useId: function() {
        var treeId = getTreeId(currentlyRenderingTask.treeContext), resumableState = currentResumableState;
        if (null === resumableState)
          throw Error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component."
          );
        var localId = localIdCounter++;
        return makeId(resumableState, treeId, localId);
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        if (void 0 === getServerSnapshot)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        return getServerSnapshot();
      },
      useOptimistic: function(passthrough) {
        resolveCurrentlyRenderingComponent();
        return [passthrough, unsupportedSetOptimisticState];
      },
      useActionState,
      useFormState: useActionState,
      useHostTransitionStatus: function() {
        resolveCurrentlyRenderingComponent();
        return sharedNotPendingObject;
      },
      useMemoCache: function(size) {
        for (var data = Array(size), i = 0; i < size; i++)
          data[i] = REACT_MEMO_CACHE_SENTINEL;
        return data;
      },
      useCacheRefresh: function() {
        return unsupportedRefresh;
      },
      useEffectEvent: function() {
        return throwOnUseEffectEventCall;
      }
    };
    var currentResumableState = null;
    var DefaultAsyncDispatcher = {
      getCacheForType: function() {
        throw Error("Not implemented.");
      },
      cacheSignal: function() {
        throw Error("Not implemented.");
      }
    };
    function prepareStackTrace(error, structuredStackTrace) {
      error = (error.name || "Error") + ": " + (error.message || "");
      for (var i = 0; i < structuredStackTrace.length; i++)
        error += "\n    at " + structuredStackTrace[i].toString();
      return error;
    }
    var prefix;
    var suffix;
    function describeBuiltInComponentFrame(name) {
      if (void 0 === prefix)
        try {
          throw Error();
        } catch (x) {
          var match = x.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || "";
          suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return "\n" + prefix + name + suffix;
    }
    var reentry = false;
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry) return "";
      reentry = true;
      var previousPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = prepareStackTrace;
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function() {
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if ("object" === typeof Reflect && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    var control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$24) {
                    control = x$24;
                  }
                  Fake = false;
                  try {
                    var prevProps = Object.getOwnPropertyDescriptor(
                      fn.prototype,
                      "props"
                    );
                    Object.defineProperty(fn.prototype, "props", {
                      configurable: true,
                      set: function() {
                        throw Error();
                      }
                    });
                    Fake = true;
                    new fn();
                  } finally {
                    Fake && (void 0 !== prevProps ? Object.defineProperty(fn.prototype, "props", prevProps) : delete fn.prototype.props);
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (x$25) {
                  control = x$25;
                }
                (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
                });
              }
            } catch (sample) {
              if (sample && control && "string" === typeof sample.stack)
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name"
        );
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
          RunInRootFrame.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
          for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
            RunInRootFrame++;
          for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
            "DetermineComponentFrameRoot"
          ); )
            namePropDescriptor++;
          if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
            for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
              namePropDescriptor--;
          for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
            if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
              if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
                do
                  if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                    var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                    fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                    return frame;
                  }
                while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
              }
              break;
            }
        }
      } finally {
        reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
      }
      return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
    }
    function describeComponentStackByType(type) {
      if ("string" === typeof type) return describeBuiltInComponentFrame(type);
      if ("function" === typeof type)
        return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, true) : describeNativeComponentFrame(type, false);
      if ("object" === typeof type && null !== type) {
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeNativeComponentFrame(type.render, false);
          case REACT_MEMO_TYPE:
            return describeNativeComponentFrame(type.type, false);
          case REACT_LAZY_TYPE:
            var lazyComponent = type, payload = lazyComponent._payload;
            lazyComponent = lazyComponent._init;
            try {
              type = lazyComponent(payload);
            } catch (x) {
              return describeBuiltInComponentFrame("Lazy");
            }
            return describeComponentStackByType(type);
        }
        if ("string" === typeof type.name) {
          a: {
            payload = type.name;
            lazyComponent = type.env;
            var location = type.debugLocation;
            if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = prepareStackTrace, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
              payload = "\n" + type;
              break a;
            }
            payload = describeBuiltInComponentFrame(
              payload + (lazyComponent ? " [" + lazyComponent + "]" : "")
            );
          }
          return payload;
        }
      }
      switch (type) {
        case REACT_SUSPENSE_LIST_TYPE:
          return describeBuiltInComponentFrame("SuspenseList");
        case REACT_SUSPENSE_TYPE:
          return describeBuiltInComponentFrame("Suspense");
        case REACT_VIEW_TRANSITION_TYPE:
          return describeBuiltInComponentFrame("ViewTransition");
      }
      return "";
    }
    function getViewTransitionClassName(defaultClass, eventClass) {
      defaultClass = null == defaultClass || "string" === typeof defaultClass ? defaultClass : defaultClass.default;
      eventClass = null == eventClass || "string" === typeof eventClass ? eventClass : eventClass.default;
      return null == eventClass ? "auto" === defaultClass ? null : defaultClass : "auto" === eventClass ? null : eventClass;
    }
    function isEligibleForOutlining(request, boundary) {
      return (500 < boundary.byteSize || hasSuspenseyContent(boundary.contentState, false) || boundary.defer) && null === boundary.preamble;
    }
    function defaultErrorHandler(error) {
      if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
        var JSCompiler_inline_result = error.environmentName;
        error = [error].slice(0);
        "string" === typeof error[0] ? error.splice(
          0,
          1,
          "\x1B[0m\x1B[7m%c%s\x1B[0m%c " + error[0],
          "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
          " " + JSCompiler_inline_result + " ",
          ""
        ) : error.splice(
          0,
          0,
          "\x1B[0m\x1B[7m%c%s\x1B[0m%c",
          "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
          " " + JSCompiler_inline_result + " ",
          ""
        );
        error.unshift(console);
        JSCompiler_inline_result = bind.apply(console.error, error);
        JSCompiler_inline_result();
      } else console.error(error);
      return null;
    }
    function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      var abortSet = /* @__PURE__ */ new Set();
      this.destination = null;
      this.flushScheduled = false;
      this.resumableState = resumableState;
      this.renderState = renderState;
      this.rootFormatContext = rootFormatContext;
      this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
      this.status = 10;
      this.fatalError = null;
      this.aborted = false;
      this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
      this.completedPreambleSegments = this.completedRootSegment = null;
      this.byteSize = 0;
      this.abortableTasks = abortSet;
      this.pingedTasks = [];
      this.currentTask = null;
      this.clientRenderedBoundaries = [];
      this.completedBoundaries = [];
      this.partialBoundaries = [];
      this.postponedState = this.trackedPostpones = null;
      this.onError = void 0 === onError ? defaultErrorHandler : onError;
      this.onBrowserBailout = void 0 === onBrowserBailout ? noop : onBrowserBailout;
      this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
      this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
      this.onShellError = void 0 === onShellError ? noop : onShellError;
      this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
      this.renderLifetimeController = null;
      this.formState = void 0 === formState ? null : formState;
    }
    function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError, formState) {
      resumableState = new RequestInstance(
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        formState
      );
      renderState = createPendingSegment(
        resumableState,
        0,
        null,
        rootFormatContext,
        false,
        false
      );
      renderState.parentFlushed = true;
      children = createRenderTask(
        resumableState,
        null,
        children,
        -1,
        null,
        renderState,
        null,
        null,
        resumableState.abortableTasks,
        null,
        rootFormatContext,
        null,
        emptyTreeContext,
        null,
        null
      );
      pushComponentStack(children);
      resumableState.pingedTasks.push(children);
      return resumableState;
    }
    function createPrerenderRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError) {
      children = createRequest(
        children,
        resumableState,
        renderState,
        rootFormatContext,
        progressiveChunkSize,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        void 0
      );
      children.trackedPostpones = {
        workingMap: /* @__PURE__ */ new Map(),
        rootNodes: [],
        rootSlots: null
      };
      return children;
    }
    function resumeRequest(children, postponedState, renderState, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError) {
      renderState = new RequestInstance(
        postponedState.resumableState,
        renderState,
        postponedState.rootFormatContext,
        postponedState.progressiveChunkSize,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError,
        null
      );
      renderState.nextSegmentId = postponedState.nextSegmentId;
      if ("number" === typeof postponedState.replaySlots)
        return onError = createPendingSegment(
          renderState,
          0,
          null,
          postponedState.rootFormatContext,
          false,
          false
        ), onError.parentFlushed = true, children = createRenderTask(
          renderState,
          null,
          children,
          -1,
          null,
          onError,
          null,
          null,
          renderState.abortableTasks,
          null,
          postponedState.rootFormatContext,
          null,
          emptyTreeContext,
          null,
          null
        ), pushComponentStack(children), renderState.pingedTasks.push(children), renderState;
      children = createReplayTask(
        renderState,
        null,
        {
          nodes: postponedState.replayNodes,
          slots: postponedState.replaySlots,
          pendingTasks: 0
        },
        children,
        -1,
        null,
        null,
        renderState.abortableTasks,
        null,
        postponedState.rootFormatContext,
        null,
        emptyTreeContext,
        null,
        null
      );
      pushComponentStack(children);
      renderState.pingedTasks.push(children);
      return renderState;
    }
    function resumeAndPrerenderRequest(children, postponedState, renderState, onError, onBrowserBailout, onAllReady, onShellReady, onShellError, onFatalError) {
      children = resumeRequest(
        children,
        postponedState,
        renderState,
        onError,
        onBrowserBailout,
        onAllReady,
        onShellReady,
        onShellError,
        onFatalError
      );
      children.trackedPostpones = {
        workingMap: /* @__PURE__ */ new Map(),
        rootNodes: [],
        rootSlots: null
      };
      return children;
    }
    var currentRequest = null;
    function resolveRequest() {
      if (currentRequest) return currentRequest;
      var store = requestStorage.getStore();
      return store ? store : null;
    }
    function pingTask(request, task) {
      request.pingedTasks.push(task);
      1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, null !== request.trackedPostpones || 10 === request.status ? scheduleMicrotask(function() {
        return performWork(request);
      }) : setImmediate(function() {
        return performWork(request);
      }));
    }
    function createSuspenseBoundary(request, row, fallbackAbortableTasks, preamble, defer) {
      fallbackAbortableTasks = {
        status: 0,
        rootSegmentID: -1,
        parentFlushed: false,
        pendingTasks: 0,
        row,
        completedSegments: [],
        byteSize: 0,
        defer,
        fallbackAbortableTasks,
        errorDigest: null,
        contentState: createHoistableState(),
        fallbackState: createHoistableState(),
        preamble,
        tracked: null
      };
      null !== row && (row.pendingTasks++, preamble = row.boundaries, null !== preamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, preamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
      return fallbackAbortableTasks;
    }
    function createRenderTask(request, thenableState2, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      var task = {
        replay: null,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment,
        blockedPreamble,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createReplayTask(request, thenableState2, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
      request.allPendingTasks++;
      null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
      null !== row && row.pendingTasks++;
      replay.pendingTasks++;
      var task = {
        replay,
        node,
        childIndex,
        ping: {
          resolve: function() {
            return pingTask(request, task);
          },
          reject: function(error) {
            request.aborted ? task.abortSet.delete(task) && finishAbortedTask(task, request, error) : pingTask(request, task);
          }
        },
        blockedBoundary,
        blockedSegment: null,
        blockedPreamble: null,
        hoistableState,
        abortSet,
        keyPath,
        formatContext,
        context,
        treeContext,
        row,
        componentStack,
        thenableState: thenableState2
      };
      abortSet.add(task);
      return task;
    }
    function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
      return {
        status: 0,
        parentFlushed: false,
        id: -1,
        index,
        chunks: [],
        children: [],
        preambleChildren: [],
        parentFormatContext,
        boundary,
        lastPushedText,
        textEmbedded
      };
    }
    function pushComponentStack(task) {
      var node = task.node;
      if ("object" === typeof node && null !== node)
        switch (node.$$typeof) {
          case REACT_ELEMENT_TYPE:
            task.componentStack = { parent: task.componentStack, type: node.type };
        }
    }
    function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
      return null === componentStack ? null : { parent: componentStack.parent, type: "Suspense Fallback" };
    }
    function getThrownInfo(node$jscomp$0) {
      var errorInfo = {};
      node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
        configurable: true,
        enumerable: true,
        get: function() {
          try {
            var info = "", node = node$jscomp$0;
            do
              info += describeComponentStackByType(node.type), node = node.parent;
            while (node);
            var JSCompiler_inline_result = info;
          } catch (x) {
            JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
          }
          Object.defineProperty(errorInfo, "componentStack", {
            value: JSCompiler_inline_result
          });
          return JSCompiler_inline_result;
        }
      });
      return errorInfo;
    }
    function logRecoverableError(request, error, errorInfo) {
      if (isRecoverableError(error))
        return request = request.onBrowserBailout, request(error, errorInfo), "";
      request = request.onError;
      error = request(error, errorInfo);
      if (null == error || "string" === typeof error)
        return "" === error ? void 0 : error;
    }
    function fatalError(request, error) {
      var onShellError = request.onShellError, onFatalError = request.onFatalError;
      0 !== request.pendingRootTasks && onShellError(error);
      onFatalError(error);
      endRenderLifetime(request);
      null !== request.destination ? (request.status = 13, request.destination.destroy(error)) : (request.status = 12, request.aborted || (request.fatalError = error));
    }
    function finishSuspenseListRow(request, row) {
      unblockSuspenseListRow(request, row.next, row.hoistables);
    }
    function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
      for (; null !== unblockedRow; ) {
        null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
        var unblockedBoundaries = unblockedRow.boundaries;
        if (null !== unblockedBoundaries) {
          unblockedRow.boundaries = null;
          for (var i = 0; i < unblockedBoundaries.length; i++) {
            var unblockedBoundary = unblockedBoundaries[i];
            null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
            finishedTask(request, unblockedBoundary, null, null);
          }
        }
        unblockedRow.pendingTasks--;
        if (0 < unblockedRow.pendingTasks) break;
        inheritedHoistables = unblockedRow.hoistables;
        unblockedRow = unblockedRow.next;
      }
    }
    function tryToResolveTogetherRow(request, togetherRow) {
      var boundaries = togetherRow.boundaries;
      if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
        for (var allCompleteAndInlinable = true, i = 0; i < boundaries.length; i++) {
          var rowBoundary = boundaries[i];
          if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
            allCompleteAndInlinable = false;
            break;
          }
        }
        allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
      }
    }
    function createSuspenseListRow(previousRow) {
      var newRow = {
        pendingTasks: 1,
        boundaries: null,
        hoistables: createHoistableState(),
        inheritedHoistables: null,
        together: false,
        next: null
      };
      null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
      return newRow;
    }
    function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
      var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
      task.keyPath = keyPath;
      keyPath = rows.length;
      var previousSuspenseListRow = null;
      if (null !== task.replay) {
        var resumeSlots = task.replay.slots;
        if (null !== resumeSlots && "object" === typeof resumeSlots)
          for (var n = 0; n < keyPath; n++) {
            var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
            task.row = previousSuspenseListRow = createSuspenseListRow(
              previousSuspenseListRow
            );
            task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
            var resumeSegmentID = resumeSlots[i];
            "number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode(request, task, node, i);
            0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          }
        else
          for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++)
            n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      } else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder)
        for (revealOrder = 0; revealOrder < keyPath; revealOrder++)
          resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            revealOrder
          ), renderNode(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
      else {
        resumeSlots = task.blockedSegment;
        n = resumeSlots.children.length;
        i = resumeSlots.chunks.length;
        for (node = 0; node < keyPath; node++) {
          resumeSegmentID = "unstable_legacy-backwards" === revealOrder ? keyPath - 1 - node : node;
          var node$40 = rows[resumeSegmentID];
          task.row = previousSuspenseListRow = createSuspenseListRow(
            previousSuspenseListRow
          );
          task.treeContext = pushTreeContext(
            prevTreeContext,
            keyPath,
            resumeSegmentID
          );
          var newSegment = createPendingSegment(
            request,
            i,
            null,
            task.formatContext,
            0 === resumeSegmentID ? resumeSlots.lastPushedText : true,
            true
          );
          resumeSlots.children.splice(n, 0, newSegment);
          task.blockedSegment = newSegment;
          try {
            renderNode(request, task, node$40, resumeSegmentID), newSegment.lastPushedText && newSegment.textEmbedded && newSegment.chunks.push(textSeparator), newSegment.status = 1, finishedSegment(request, task.blockedBoundary, newSegment), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
          } catch (thrownValue) {
            throw newSegment.status = request.aborted ? 3 : 4, thrownValue;
          }
        }
        task.blockedSegment = resumeSlots;
        resumeSlots.lastPushedText = false;
      }
      null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
      task.treeContext = prevTreeContext;
      task.row = prevRow;
      task.keyPath = prevKeyPath;
    }
    function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
      var prevThenableState = task.thenableState;
      task.thenableState = null;
      currentlyRenderingComponent = {};
      currentlyRenderingTask = task;
      currentlyRenderingRequest = request;
      currentlyRenderingKeyPath = keyPath;
      actionStateCounter = localIdCounter = 0;
      actionStateMatchingIndex = -1;
      thenableIndexCounter = 0;
      thenableState = prevThenableState;
      for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate; )
        didScheduleRenderPhaseUpdate = false, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
      resetHooksState();
      return request;
    }
    function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex2) {
      var didEmitActionStateMarkers = false;
      if (0 !== actionStateCount && null !== request.formState) {
        var segment = task.blockedSegment;
        if (null !== segment) {
          didEmitActionStateMarkers = true;
          segment = segment.chunks;
          for (var i = 0; i < actionStateCount; i++)
            i === actionStateMatchingIndex2 ? segment.push(formStateMarkerIsMatching) : segment.push(formStateMarkerIsNotMatching);
        }
      }
      actionStateCount = task.keyPath;
      task.keyPath = keyPath;
      hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
      task.keyPath = actionStateCount;
    }
    function renderElement(request, task, keyPath, type, props, ref) {
      if ("function" === typeof type)
        if (type.prototype && type.prototype.isReactComponent) {
          var newProps = props;
          if ("ref" in props) {
            newProps = {};
            for (var propName in props)
              "ref" !== propName && (newProps[propName] = props[propName]);
          }
          var defaultProps = type.defaultProps;
          if (defaultProps) {
            newProps === props && (newProps = assign({}, newProps, props));
            for (var propName$45 in defaultProps)
              void 0 === newProps[propName$45] && (newProps[propName$45] = defaultProps[propName$45]);
          }
          var JSCompiler_inline_result = newProps;
          var context = emptyContextObject, contextType = type.contextType;
          "object" === typeof contextType && null !== contextType && (context = contextType._currentValue);
          var JSCompiler_inline_result$jscomp$0 = new type(
            JSCompiler_inline_result,
            context
          );
          var initialState = void 0 !== JSCompiler_inline_result$jscomp$0.state ? JSCompiler_inline_result$jscomp$0.state : null;
          JSCompiler_inline_result$jscomp$0.updater = classComponentUpdater;
          JSCompiler_inline_result$jscomp$0.props = JSCompiler_inline_result;
          JSCompiler_inline_result$jscomp$0.state = initialState;
          var internalInstance = { queue: [], replace: false };
          JSCompiler_inline_result$jscomp$0._reactInternals = internalInstance;
          var contextType$jscomp$0 = type.contextType;
          JSCompiler_inline_result$jscomp$0.context = "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 ? contextType$jscomp$0._currentValue : emptyContextObject;
          var getDerivedStateFromProps = type.getDerivedStateFromProps;
          if ("function" === typeof getDerivedStateFromProps) {
            var partialState = getDerivedStateFromProps(
              JSCompiler_inline_result,
              initialState
            );
            var JSCompiler_inline_result$jscomp$1 = null === partialState || void 0 === partialState ? initialState : assign({}, initialState, partialState);
            JSCompiler_inline_result$jscomp$0.state = JSCompiler_inline_result$jscomp$1;
          }
          if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof JSCompiler_inline_result$jscomp$0.getSnapshotBeforeUpdate && ("function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount || "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount)) {
            var oldState = JSCompiler_inline_result$jscomp$0.state;
            "function" === typeof JSCompiler_inline_result$jscomp$0.componentWillMount && JSCompiler_inline_result$jscomp$0.componentWillMount();
            "function" === typeof JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount && JSCompiler_inline_result$jscomp$0.UNSAFE_componentWillMount();
            oldState !== JSCompiler_inline_result$jscomp$0.state && classComponentUpdater.enqueueReplaceState(
              JSCompiler_inline_result$jscomp$0,
              JSCompiler_inline_result$jscomp$0.state,
              null
            );
            if (null !== internalInstance.queue && 0 < internalInstance.queue.length) {
              var oldQueue = internalInstance.queue, oldReplace = internalInstance.replace;
              internalInstance.queue = null;
              internalInstance.replace = false;
              if (oldReplace && 1 === oldQueue.length)
                JSCompiler_inline_result$jscomp$0.state = oldQueue[0];
              else {
                for (var nextState = oldReplace ? oldQueue[0] : JSCompiler_inline_result$jscomp$0.state, dontMutate = true, i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                  var partial = oldQueue[i], partialState$jscomp$0 = "function" === typeof partial ? partial.call(
                    JSCompiler_inline_result$jscomp$0,
                    nextState,
                    JSCompiler_inline_result,
                    void 0
                  ) : partial;
                  null != partialState$jscomp$0 && (dontMutate ? (dontMutate = false, nextState = assign({}, nextState, partialState$jscomp$0)) : assign(nextState, partialState$jscomp$0));
                }
                JSCompiler_inline_result$jscomp$0.state = nextState;
              }
            } else internalInstance.queue = null;
          }
          var nextChildren = JSCompiler_inline_result$jscomp$0.render();
          if (request.aborted) throw null;
          var prevKeyPath = task.keyPath;
          task.keyPath = keyPath;
          renderNodeDestructive(request, task, nextChildren, -1);
          task.keyPath = prevKeyPath;
        } else {
          var value = renderWithHooks(request, task, keyPath, type, props, void 0);
          if (request.aborted) throw null;
          finishFunctionComponent(
            request,
            task,
            keyPath,
            value,
            0 !== localIdCounter,
            actionStateCounter,
            actionStateMatchingIndex
          );
        }
      else if ("string" === typeof type) {
        var segment = task.blockedSegment;
        if (null === segment) {
          var children = props.children, prevContext = task.formatContext, prevKeyPath$jscomp$0 = task.keyPath;
          task.formatContext = getChildFormatContext(prevContext, type, props);
          task.keyPath = keyPath;
          renderNode(request, task, children, -1);
          task.formatContext = prevContext;
          task.keyPath = prevKeyPath$jscomp$0;
        } else {
          var children$42 = pushStartInstance(
            segment.chunks,
            type,
            props,
            request.resumableState,
            request.renderState,
            task.blockedPreamble,
            task.hoistableState,
            task.formatContext,
            segment.lastPushedText
          );
          segment.lastPushedText = false;
          var prevContext$43 = task.formatContext, prevKeyPath$44 = task.keyPath;
          task.keyPath = keyPath;
          if (3 === (task.formatContext = getChildFormatContext(
            prevContext$43,
            type,
            props
          )).insertionMode) {
            var preambleSegment = createPendingSegment(
              request,
              0,
              null,
              task.formatContext,
              false,
              false
            );
            segment.preambleChildren.push(preambleSegment);
            task.blockedSegment = preambleSegment;
            try {
              renderNode(request, task, children$42, -1), preambleSegment.lastPushedText && preambleSegment.textEmbedded && preambleSegment.chunks.push(textSeparator), preambleSegment.status = 1, finishedSegment(request, task.blockedBoundary, preambleSegment);
            } finally {
              task.blockedSegment = segment;
            }
          } else renderNode(request, task, children$42, -1);
          task.formatContext = prevContext$43;
          task.keyPath = prevKeyPath$44;
          a: {
            var target = segment.chunks, resumableState = request.resumableState;
            switch (type) {
              case "title":
              case "style":
              case "script":
              case "area":
              case "base":
              case "br":
              case "col":
              case "embed":
              case "hr":
              case "img":
              case "input":
              case "keygen":
              case "link":
              case "meta":
              case "param":
              case "source":
              case "track":
              case "wbr":
                break a;
              case "body":
                if (1 >= prevContext$43.insertionMode) {
                  resumableState.hasBody = true;
                  break a;
                }
                break;
              case "html":
                if (0 === prevContext$43.insertionMode) {
                  resumableState.hasHtml = true;
                  break a;
                }
                break;
              case "head":
                if (1 >= prevContext$43.insertionMode) break a;
            }
            target.push(endChunkForTag(type));
          }
          segment.lastPushedText = false;
        }
      } else {
        switch (type) {
          case REACT_LEGACY_HIDDEN_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_FRAGMENT_TYPE:
            var prevKeyPath$jscomp$1 = task.keyPath;
            task.keyPath = keyPath;
            renderNodeDestructive(request, task, props.children, -1);
            task.keyPath = prevKeyPath$jscomp$1;
            return;
          case REACT_ACTIVITY_TYPE:
            var segment$jscomp$0 = task.blockedSegment;
            if (null === segment$jscomp$0) {
              if ("hidden" !== props.mode) {
                var prevKeyPath$jscomp$2 = task.keyPath;
                task.keyPath = keyPath;
                renderNode(request, task, props.children, -1);
                task.keyPath = prevKeyPath$jscomp$2;
              }
            } else if ("hidden" !== props.mode) {
              segment$jscomp$0.chunks.push(startActivityBoundary);
              segment$jscomp$0.lastPushedText = false;
              var prevKeyPath$47 = task.keyPath;
              task.keyPath = keyPath;
              renderNode(request, task, props.children, -1);
              task.keyPath = prevKeyPath$47;
              segment$jscomp$0.chunks.push(endActivityBoundary);
              segment$jscomp$0.lastPushedText = false;
            }
            return;
          case REACT_SUSPENSE_LIST_TYPE:
            a: {
              var children$jscomp$0 = props.children, revealOrder = props.revealOrder;
              if ("independent" !== revealOrder && "together" !== revealOrder) {
                if (isArrayImpl(children$jscomp$0)) {
                  renderSuspenseListRows(
                    request,
                    task,
                    keyPath,
                    children$jscomp$0,
                    revealOrder
                  );
                  break a;
                }
                var iteratorFn = getIteratorFn(children$jscomp$0);
                if (iteratorFn) {
                  var iterator = iteratorFn.call(children$jscomp$0);
                  if (iterator) {
                    var step = iterator.next();
                    if (!step.done) {
                      do
                        step = iterator.next();
                      while (!step.done);
                      renderSuspenseListRows(
                        request,
                        task,
                        keyPath,
                        children$jscomp$0,
                        revealOrder
                      );
                    }
                    break a;
                  }
                }
              }
              if ("together" === revealOrder) {
                var prevKeyPath$41 = task.keyPath, prevRow = task.row, newRow = task.row = createSuspenseListRow(null);
                newRow.boundaries = [];
                newRow.together = true;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                0 === --newRow.pendingTasks && finishSuspenseListRow(request, newRow);
                task.keyPath = prevKeyPath$41;
                task.row = prevRow;
                null !== prevRow && 0 < newRow.pendingTasks && (prevRow.pendingTasks++, newRow.next = prevRow);
              } else {
                var prevKeyPath$jscomp$3 = task.keyPath;
                task.keyPath = keyPath;
                renderNodeDestructive(request, task, children$jscomp$0, -1);
                task.keyPath = prevKeyPath$jscomp$3;
              }
            }
            return;
          case REACT_VIEW_TRANSITION_TYPE:
            var prevContext$jscomp$0 = task.formatContext, prevKeyPath$jscomp$4 = task.keyPath;
            var resumableState$jscomp$0 = request.resumableState;
            if (null != props.name && "auto" !== props.name)
              var JSCompiler_inline_result$jscomp$2 = props.name;
            else {
              var treeId = getTreeId(task.treeContext);
              JSCompiler_inline_result$jscomp$2 = makeId(
                resumableState$jscomp$0,
                treeId,
                0
              );
            }
            var autoName = JSCompiler_inline_result$jscomp$2, resumableState$jscomp$1 = request.resumableState, update = getViewTransitionClassName(props.default, props.update), enter = getViewTransitionClassName(props.default, props.enter), exit = getViewTransitionClassName(props.default, props.exit), share = getViewTransitionClassName(props.default, props.share), name = props.name;
            null == update && (update = "auto");
            null == enter && (enter = "auto");
            null == exit && (exit = "auto");
            if (null == name) {
              var parentViewTransition = prevContext$jscomp$0.viewTransition;
              null !== parentViewTransition ? (name = parentViewTransition.name, share = parentViewTransition.share) : (name = "auto", share = "none");
            } else
              null == share && (share = "auto"), prevContext$jscomp$0.tagScope & 4 && (resumableState$jscomp$1.instructions |= 128);
            prevContext$jscomp$0.tagScope & 8 ? resumableState$jscomp$1.instructions |= 128 : exit = "none";
            prevContext$jscomp$0.tagScope & 16 ? resumableState$jscomp$1.instructions |= 128 : enter = "none";
            var viewTransition = {
              update,
              enter,
              exit,
              share,
              parentEnter: "none",
              parentExit: "none",
              name,
              autoName,
              nameIdx: 0
            }, subtreeScope = prevContext$jscomp$0.tagScope & -25;
            subtreeScope = "none" !== update ? subtreeScope | 32 : subtreeScope & -33;
            "none" !== enter && (subtreeScope |= 64);
            var JSCompiler_inline_result$jscomp$3 = createFormatContext(
              prevContext$jscomp$0.insertionMode,
              prevContext$jscomp$0.selectedValue,
              subtreeScope,
              viewTransition
            );
            task.formatContext = JSCompiler_inline_result$jscomp$3;
            task.keyPath = keyPath;
            if (null != props.name && "auto" !== props.name)
              renderNodeDestructive(request, task, props.children, -1);
            else {
              var prevTreeContext = task.treeContext;
              task.treeContext = pushTreeContext(prevTreeContext, 1, 0);
              renderNode(request, task, props.children, -1);
              task.treeContext = prevTreeContext;
            }
            task.formatContext = prevContext$jscomp$0;
            task.keyPath = prevKeyPath$jscomp$4;
            return;
          case REACT_SCOPE_TYPE:
            throw Error("ReactDOMServer does not yet support scope components.");
          case REACT_SUSPENSE_TYPE:
            a: if (null !== task.replay) {
              var prevKeyPath$27 = task.keyPath, prevContext$28 = task.formatContext, prevRow$29 = task.row;
              task.keyPath = keyPath;
              task.formatContext = getSuspenseContentFormatContext(
                request.resumableState,
                prevContext$28
              );
              task.row = null;
              var content$30 = props.children;
              try {
                renderNode(request, task, content$30, -1);
              } finally {
                task.keyPath = prevKeyPath$27, task.formatContext = prevContext$28, task.row = prevRow$29;
              }
            } else {
              var prevKeyPath$jscomp$5 = task.keyPath, prevContext$jscomp$1 = task.formatContext, prevRow$jscomp$0 = task.row, parentBoundary = task.blockedBoundary, parentPreamble = task.blockedPreamble, parentHoistableState = task.hoistableState, parentSegment = task.blockedSegment, fallback = props.fallback, content = props.children, fallbackAbortSet = /* @__PURE__ */ new Set(), newBoundary = createSuspenseBoundary(
                request,
                task.row,
                fallbackAbortSet,
                2 > task.formatContext.insertionMode ? {
                  content: createPreambleState(),
                  fallback: createPreambleState()
                } : null,
                false
              ), boundarySegment = createPendingSegment(
                request,
                parentSegment.chunks.length,
                newBoundary,
                task.formatContext,
                false,
                false
              );
              parentSegment.children.push(boundarySegment);
              parentSegment.lastPushedText = false;
              var contentRootSegment = createPendingSegment(
                request,
                0,
                null,
                task.formatContext,
                false,
                false
              );
              contentRootSegment.parentFlushed = true;
              var trackedPostpones = request.trackedPostpones;
              if (null !== trackedPostpones) {
                var suspenseComponentStack = task.componentStack, fallbackKeyPath = [keyPath[0], "Suspense Fallback", keyPath[2]];
                if (null !== trackedPostpones) {
                  var fallbackReplayNode = [
                    fallbackKeyPath[1],
                    fallbackKeyPath[2],
                    [],
                    null
                  ];
                  trackedPostpones.workingMap.set(
                    fallbackKeyPath,
                    fallbackReplayNode
                  );
                  newBoundary.tracked = {
                    contentKeyPath: keyPath,
                    fallbackNode: fallbackReplayNode
                  };
                }
                task.blockedSegment = boundarySegment;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.fallback;
                task.keyPath = fallbackKeyPath;
                task.formatContext = getSuspenseFallbackFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(
                  suspenseComponentStack
                );
                try {
                  renderNode(request, task, fallback, -1), boundarySegment.lastPushedText && boundarySegment.textEmbedded && boundarySegment.chunks.push(textSeparator), boundarySegment.status = 1, finishedSegment(request, parentBoundary, boundarySegment);
                } catch (thrownValue) {
                  throw boundarySegment.status = request.aborted ? 3 : 4, thrownValue;
                } finally {
                  task.blockedSegment = parentSegment, task.blockedPreamble = parentPreamble, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1;
                }
                var suspendedPrimaryTask = createRenderTask(
                  request,
                  null,
                  content,
                  -1,
                  newBoundary,
                  contentRootSegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.content,
                  newBoundary.contentState,
                  task.abortSet,
                  keyPath,
                  getSuspenseContentFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  null,
                  suspenseComponentStack
                );
                pushComponentStack(suspendedPrimaryTask);
                request.pingedTasks.push(suspendedPrimaryTask);
              } else {
                task.blockedBoundary = newBoundary;
                task.blockedPreamble = null === newBoundary.preamble ? null : newBoundary.preamble.content;
                task.hoistableState = newBoundary.contentState;
                task.blockedSegment = contentRootSegment;
                task.keyPath = keyPath;
                task.formatContext = getSuspenseContentFormatContext(
                  request.resumableState,
                  prevContext$jscomp$1
                );
                task.row = null;
                try {
                  if (renderNode(request, task, content, -1), contentRootSegment.lastPushedText && contentRootSegment.textEmbedded && contentRootSegment.chunks.push(textSeparator), contentRootSegment.status = 1, finishedSegment(request, newBoundary, contentRootSegment), queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
                    if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
                      null !== prevRow$jscomp$0 && 0 === --prevRow$jscomp$0.pendingTasks && finishSuspenseListRow(request, prevRow$jscomp$0);
                      0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
                      break a;
                    }
                  } else
                    null !== prevRow$jscomp$0 && prevRow$jscomp$0.together && tryToResolveTogetherRow(request, prevRow$jscomp$0);
                } catch (thrownValue$31) {
                  newBoundary.status = 4;
                  if (request.aborted) {
                    contentRootSegment.status = 3;
                    var error = request.fatalError;
                  } else contentRootSegment.status = 4, error = thrownValue$31;
                  var thrownInfo = getThrownInfo(task.componentStack), errorDigest = logRecoverableError(request, error, thrownInfo);
                  newBoundary.errorDigest = errorDigest;
                  untrackBoundary(request, newBoundary);
                } finally {
                  task.blockedBoundary = parentBoundary, task.blockedPreamble = parentPreamble, task.hoistableState = parentHoistableState, task.blockedSegment = parentSegment, task.keyPath = prevKeyPath$jscomp$5, task.formatContext = prevContext$jscomp$1, task.row = prevRow$jscomp$0;
                }
                var suspendedFallbackTask = createRenderTask(
                  request,
                  null,
                  fallback,
                  -1,
                  parentBoundary,
                  boundarySegment,
                  null === newBoundary.preamble ? null : newBoundary.preamble.fallback,
                  newBoundary.fallbackState,
                  fallbackAbortSet,
                  [keyPath[0], "Suspense Fallback", keyPath[2]],
                  getSuspenseFallbackFormatContext(
                    request.resumableState,
                    task.formatContext
                  ),
                  task.context,
                  task.treeContext,
                  task.row,
                  replaceSuspenseComponentStackWithSuspenseFallbackStack(
                    task.componentStack
                  )
                );
                pushComponentStack(suspendedFallbackTask);
                request.pingedTasks.push(suspendedFallbackTask);
              }
            }
            return;
        }
        if ("object" === typeof type && null !== type)
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              if ("ref" in props) {
                var propsWithoutRef = {};
                for (var key in props)
                  "ref" !== key && (propsWithoutRef[key] = props[key]);
              } else propsWithoutRef = props;
              var children$jscomp$1 = renderWithHooks(
                request,
                task,
                keyPath,
                type.render,
                propsWithoutRef,
                ref
              );
              finishFunctionComponent(
                request,
                task,
                keyPath,
                children$jscomp$1,
                0 !== localIdCounter,
                actionStateCounter,
                actionStateMatchingIndex
              );
              return;
            case REACT_MEMO_TYPE:
              renderElement(request, task, keyPath, type.type, props, ref);
              return;
            case REACT_CONTEXT_TYPE:
              var children$jscomp$2 = props.children, prevKeyPath$jscomp$6 = task.keyPath, nextValue = props.value;
              var prevValue = type._currentValue;
              type._currentValue = nextValue;
              var prevNode = currentActiveSnapshot, newNode = {
                parent: prevNode,
                depth: null === prevNode ? 0 : prevNode.depth + 1,
                context: type,
                parentValue: prevValue,
                value: nextValue
              };
              currentActiveSnapshot = newNode;
              task.context = newNode;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, children$jscomp$2, -1);
              var prevSnapshot = currentActiveSnapshot;
              if (null === prevSnapshot)
                throw Error(
                  "Tried to pop a Context at the root of the app. This is a bug in React."
                );
              prevSnapshot.context._currentValue = prevSnapshot.parentValue;
              var JSCompiler_inline_result$jscomp$4 = currentActiveSnapshot = prevSnapshot.parent;
              task.context = JSCompiler_inline_result$jscomp$4;
              task.keyPath = prevKeyPath$jscomp$6;
              return;
            case REACT_CONSUMER_TYPE:
              var render = props.children, newChildren = render(type._context._currentValue), prevKeyPath$jscomp$7 = task.keyPath;
              task.keyPath = keyPath;
              renderNodeDestructive(request, task, newChildren, -1);
              task.keyPath = prevKeyPath$jscomp$7;
              return;
            case REACT_LAZY_TYPE:
              var init = type._init;
              var Component = init(type._payload);
              if (request.aborted) throw null;
              renderElement(request, task, keyPath, Component, props, ref);
              return;
          }
        throw Error(
          "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == type ? type : typeof type) + ".")
        );
      }
    }
    function resumeNode(request, task, segmentId, node, childIndex) {
      var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(
        request,
        0,
        null,
        task.formatContext,
        false,
        false
      );
      resumedSegment.id = segmentId;
      resumedSegment.parentFlushed = true;
      try {
        task.replay = null, task.blockedSegment = resumedSegment, renderNode(request, task, node, childIndex), resumedSegment.status = 1, finishedSegment(request, blockedBoundary, resumedSegment), null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
      } finally {
        task.replay = prevReplay, task.blockedSegment = null;
      }
    }
    function renderNodeDestructive(request, task, node, childIndex) {
      null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
    }
    function retryNode(request, task) {
      var node = task.node, childIndex = task.childIndex;
      if (null !== node) {
        if ("object" === typeof node) {
          switch (node.$$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = node.type, key = node.key, props = node.props;
              node = props.ref;
              var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key || key === REACT_OPTIMISTIC_KEY ? -1 === childIndex ? 0 : childIndex : key;
              key = [task.keyPath, name, keyOrIndex];
              if (null !== task.replay)
                a: {
                  var replay = task.replay;
                  childIndex = replay.nodes;
                  for (node = 0; node < childIndex.length; node++) {
                    var node$jscomp$0 = childIndex[node];
                    if (keyOrIndex === node$jscomp$0[1]) {
                      if (4 === node$jscomp$0.length) {
                        if (null !== name && name !== node$jscomp$0[0])
                          throw Error(
                            "Expected the resume to render <" + node$jscomp$0[0] + "> in this slot but instead it rendered <" + name + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        var childNodes = node$jscomp$0[2], childSlots = node$jscomp$0[3], currentNode = task.node;
                        task.replay = {
                          nodes: childNodes,
                          slots: childSlots,
                          pendingTasks: 1
                        };
                        try {
                          renderElement(request, task, key, type, props, ref);
                          if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                            throw Error(
                              "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                            );
                          task.replay.pendingTasks--;
                        } catch (x) {
                          if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then || "Maximum call stack size exceeded" === x.message))
                            throw task.node === currentNode ? task.replay = replay : childIndex.splice(node, 1), x;
                          task.replay.pendingTasks--;
                          key = getThrownInfo(task.componentStack);
                          currentNode = request;
                          props = task.blockedBoundary;
                          request = request.aborted ? request.fatalError : x;
                          key = logRecoverableError(currentNode, request, key);
                          abortRemainingReplayNodes(
                            currentNode,
                            props,
                            childNodes,
                            childSlots,
                            request,
                            key
                          );
                        }
                        task.replay = replay;
                      } else {
                        if (type !== REACT_SUSPENSE_TYPE)
                          throw Error(
                            "Expected the resume to render <Suspense> in this slot but instead it rendered <" + (getComponentNameFromType(type) || "Unknown") + ">. The tree doesn't match so React will fallback to client rendering."
                          );
                        b: {
                          replay = node$jscomp$0[5];
                          type = node$jscomp$0[2];
                          ref = node$jscomp$0[3];
                          name = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
                          node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
                          keyOrIndex = task.keyPath;
                          var prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children;
                          props = props.fallback;
                          var fallbackAbortSet = /* @__PURE__ */ new Set(), resumedBoundary = createSuspenseBoundary(
                            request,
                            task.row,
                            fallbackAbortSet,
                            2 > task.formatContext.insertionMode ? {
                              content: createPreambleState(),
                              fallback: createPreambleState()
                            } : null,
                            false
                          );
                          resumedBoundary.parentFlushed = true;
                          resumedBoundary.rootSegmentID = replay;
                          task.blockedBoundary = resumedBoundary;
                          task.hoistableState = resumedBoundary.contentState;
                          task.keyPath = key;
                          task.formatContext = getSuspenseContentFormatContext(
                            request.resumableState,
                            prevContext
                          );
                          task.row = null;
                          task.replay = {
                            nodes: type,
                            slots: ref,
                            pendingTasks: 1
                          };
                          try {
                            renderNode(request, task, content, -1);
                            if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                              throw Error(
                                "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                              );
                            task.replay.pendingTasks--;
                            if (0 === resumedBoundary.pendingTasks && 0 === resumedBoundary.status) {
                              resumedBoundary.status = 1;
                              request.completedBoundaries.push(resumedBoundary);
                              break b;
                            }
                          } catch (thrownValue) {
                            resumedBoundary.status = 4, childNodes = request.aborted ? request.fatalError : thrownValue, childSlots = getThrownInfo(task.componentStack), currentNode = logRecoverableError(
                              request,
                              childNodes,
                              childSlots
                            ), resumedBoundary.errorDigest = currentNode, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(
                              resumedBoundary
                            );
                          } finally {
                            task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = keyOrIndex, task.formatContext = prevContext, task.row = prevRow;
                          }
                          childNodes = createReplayTask(
                            request,
                            null,
                            { nodes: name, slots: node$jscomp$0, pendingTasks: 0 },
                            props,
                            -1,
                            parentBoundary,
                            resumedBoundary.fallbackState,
                            fallbackAbortSet,
                            [key[0], "Suspense Fallback", key[2]],
                            getSuspenseFallbackFormatContext(
                              request.resumableState,
                              task.formatContext
                            ),
                            task.context,
                            task.treeContext,
                            task.row,
                            replaceSuspenseComponentStackWithSuspenseFallbackStack(
                              task.componentStack
                            )
                          );
                          pushComponentStack(childNodes);
                          request.pingedTasks.push(childNodes);
                        }
                      }
                      childIndex.splice(node, 1);
                      break a;
                    }
                  }
                }
              else renderElement(request, task, key, type, props, ref);
              return;
            case REACT_PORTAL_TYPE:
              throw Error(
                "Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."
              );
            case REACT_LAZY_TYPE:
              childNodes = node._init;
              node = childNodes(node._payload);
              if (request.aborted) throw null;
              renderNodeDestructive(request, task, node, childIndex);
              return;
          }
          if (isArrayImpl(node)) {
            renderChildrenArray(request, task, node, childIndex);
            return;
          }
          if (childNodes = getIteratorFn(node)) {
            if (childNodes = childNodes.call(node)) {
              node = childNodes.next();
              if (!node.done) {
                childSlots = [];
                do
                  childSlots.push(node.value), node = childNodes.next();
                while (!node.done);
                renderChildrenArray(request, task, childSlots, childIndex);
              }
              return;
            }
          }
          if ("function" === typeof node.then)
            return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
          if (node.$$typeof === REACT_CONTEXT_TYPE)
            return renderNodeDestructive(
              request,
              task,
              node._currentValue,
              childIndex
            );
          childIndex = Object.prototype.toString.call(node);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        if ("string" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            node,
            request.renderState,
            childIndex.lastPushedText
          ));
        else if ("number" === typeof node || "bigint" === typeof node)
          childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(
            childIndex.chunks,
            "" + node,
            request.renderState,
            childIndex.lastPushedText
          ));
      }
    }
    function renderChildrenArray(request, task, children, childIndex) {
      var prevKeyPath = task.keyPath;
      if (-1 !== childIndex && (task.keyPath = [task.keyPath, "Fragment", childIndex], null !== task.replay)) {
        for (var replay = task.replay, replayNodes = replay.nodes, j2 = 0; j2 < replayNodes.length; j2++) {
          var node = replayNodes[j2];
          if (node[1] === childIndex) {
            childIndex = node[2];
            node = node[3];
            task.replay = { nodes: childIndex, slots: node, pendingTasks: 1 };
            try {
              renderChildrenArray(request, task, children, -1);
              if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                throw Error(
                  "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                );
              task.replay.pendingTasks--;
            } catch (x) {
              if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then))
                throw x;
              task.replay.pendingTasks--;
              var thrownInfo = getThrownInfo(task.componentStack);
              children = request;
              var boundary = task.blockedBoundary;
              request = request.aborted ? request.fatalError : x;
              thrownInfo = logRecoverableError(children, request, thrownInfo);
              abortRemainingReplayNodes(
                children,
                boundary,
                childIndex,
                node,
                request,
                thrownInfo
              );
            }
            task.replay = replay;
            replayNodes.splice(j2, 1);
            break;
          }
        }
        task.keyPath = prevKeyPath;
        return;
      }
      replay = task.treeContext;
      replayNodes = children.length;
      if (null !== task.replay && (j2 = task.replay.slots, null !== j2 && "object" === typeof j2)) {
        for (childIndex = 0; childIndex < replayNodes; childIndex++)
          node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j2[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j2[childIndex]) : renderNode(request, task, node, childIndex);
        task.treeContext = replay;
        task.keyPath = prevKeyPath;
        return;
      }
      for (j2 = 0; j2 < replayNodes; j2++)
        childIndex = children[j2], task.treeContext = pushTreeContext(replay, replayNodes, j2), renderNode(request, task, childIndex, j2);
      task.treeContext = replay;
      task.keyPath = prevKeyPath;
    }
    function trackPostponedBoundary(request, trackedPostpones, boundary) {
      boundary.status = 5;
      boundary.rootSegmentID = request.nextSegmentId++;
      var tracked = boundary.tracked;
      if (null === tracked)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      request = tracked.contentKeyPath;
      if (null === request)
        throw Error(
          "It should not be possible to postpone at the root. This is a bug in React."
        );
      tracked = tracked.fallbackNode;
      var children = [], boundaryNode = trackedPostpones.workingMap.get(request);
      if (void 0 === boundaryNode)
        return boundary = [
          request[1],
          request[2],
          children,
          null,
          tracked,
          boundary.rootSegmentID
        ], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
      boundaryNode[4] = tracked;
      boundaryNode[5] = boundary.rootSegmentID;
      return boundaryNode;
    }
    function trackPostpone(request, trackedPostpones, task, segment) {
      segment.status = 5;
      var keyPath = task.keyPath, boundary = task.blockedBoundary;
      if (null === boundary)
        segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
      else {
        if (null !== boundary && 0 === boundary.status) {
          var boundaryNode = trackPostponedBoundary(
            request,
            trackedPostpones,
            boundary
          );
          if (null !== boundary.tracked && boundary.tracked.contentKeyPath === keyPath && -1 === task.childIndex) {
            -1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
            boundaryNode[3] = segment.id;
            return;
          }
        }
        -1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
        if (-1 === task.childIndex)
          null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [keyPath[1], keyPath[2], [], segment.id], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
        else {
          if (null === keyPath)
            if (request = trackedPostpones.rootSlots, null === request)
              request = trackedPostpones.rootSlots = {};
            else {
              if ("number" === typeof request)
                throw Error(
                  "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
                );
            }
          else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode)
            request = {}, boundaryNode = [keyPath[1], keyPath[2], [], request], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
          else if (request = boundaryNode[3], null === request)
            request = boundaryNode[3] = {};
          else if ("number" === typeof request)
            throw Error(
              "It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React."
            );
          request[task.childIndex] = segment.id;
        }
      }
    }
    function untrackBoundary(request, boundary) {
      request = request.trackedPostpones;
      null !== request && (boundary = boundary.tracked, null !== boundary && (boundary = boundary.contentKeyPath, null !== boundary && (request = request.workingMap.get(boundary), void 0 !== request && (request.length = 4, request[2] = [], request[3] = null))));
    }
    function spawnNewSuspendedReplayTask(request, task, thenableState2) {
      return createReplayTask(
        request,
        thenableState2,
        task.replay,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function spawnNewSuspendedRenderTask(request, task, thenableState2) {
      var segment = task.blockedSegment, newSegment = createPendingSegment(
        request,
        segment.chunks.length,
        null,
        task.formatContext,
        segment.lastPushedText,
        true
      );
      segment.children.push(newSegment);
      segment.lastPushedText = false;
      return createRenderTask(
        request,
        thenableState2,
        task.node,
        task.childIndex,
        task.blockedBoundary,
        newSegment,
        task.blockedPreamble,
        task.hoistableState,
        task.abortSet,
        task.keyPath,
        task.formatContext,
        task.context,
        task.treeContext,
        task.row,
        task.componentStack
      );
    }
    function renderNode(request, task, node, childIndex) {
      var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
      if (null === segment) {
        segment = task.replay;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue) {
          if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
              node.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
              node = spawnNewSuspendedReplayTask(request, task, node);
              request.pingedTasks.push(node);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              task.replay = segment;
              switchContext(previousContext);
              return;
            }
          }
        }
      } else {
        var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
        try {
          return renderNodeDestructive(request, task, node, childIndex);
        } catch (thrownValue$64) {
          if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$64 === SuspenseException ? getSuspendedThenable() : thrownValue$64, !request.aborted && "object" === typeof node && null !== node) {
            if ("function" === typeof node.then) {
              segment = node;
              node = thrownValue$64 === SuspenseException ? getThenableStateAfterSuspending() : null;
              request = spawnNewSuspendedRenderTask(request, task, node).ping;
              segment.then(request.resolve, request.reject);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
            if ("Maximum call stack size exceeded" === node.message) {
              segment = thrownValue$64 === SuspenseException ? getThenableStateAfterSuspending() : null;
              segment = spawnNewSuspendedRenderTask(request, task, segment);
              request.pingedTasks.push(segment);
              task.formatContext = previousFormatContext;
              task.context = previousContext;
              task.keyPath = previousKeyPath;
              task.treeContext = previousTreeContext;
              task.componentStack = previousComponentStack;
              switchContext(previousContext);
              return;
            }
          }
        }
      }
      task.formatContext = previousFormatContext;
      task.context = previousContext;
      task.keyPath = previousKeyPath;
      task.treeContext = previousTreeContext;
      switchContext(previousContext);
      throw node;
    }
    function abortTaskSoft(task) {
      var boundary = task.blockedBoundary, segment = task.blockedSegment;
      null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
    }
    function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error, errorDigest$jscomp$0) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (4 === node.length)
          abortRemainingReplayNodes(
            request$jscomp$0,
            boundary,
            node[2],
            node[3],
            error,
            errorDigest$jscomp$0
          );
        else {
          node = node[5];
          var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(
            request,
            null,
            /* @__PURE__ */ new Set(),
            null,
            false
          );
          resumedBoundary.parentFlushed = true;
          resumedBoundary.rootSegmentID = node;
          resumedBoundary.status = 4;
          resumedBoundary.errorDigest = errorDigest;
          resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
        }
      }
      nodes.length = 0;
      if (null !== slots) {
        if (null === boundary)
          throw Error(
            "We should not have any resumable nodes in the shell. This is a bug in React."
          );
        4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
        if ("object" === typeof slots) for (var index in slots) delete slots[index];
      }
    }
    function abortTask(task, request) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary;
        task = task.blockedSegment;
        null !== task && (task.status = 3);
        null !== boundary && boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
          return abortTask(fallbackTask, request);
        });
      }
    }
    function finishAbortedTask(task, request, error) {
      if (task !== request.currentTask) {
        var boundary = task.blockedBoundary, segment = task.blockedSegment;
        if (null === segment || 3 === segment.status) {
          var errorInfo = getThrownInfo(task.componentStack), isRecoverableReason = isRecoverableError(error);
          if (null === boundary) {
            boundary = task.replay;
            if (null === boundary) {
              isRecoverableReason || null === request.trackedPostpones || null === segment ? isRecoverableReason ? (task = cloneRecoverableErrorAsFatal(error), logRecoverableError(request, task, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, task)) : (logRecoverableError(request, error, errorInfo), 12 !== request.status && 13 !== request.status && fatalError(request, error)) : (boundary = request.trackedPostpones, logRecoverableError(request, error, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment));
              return;
            }
            12 !== request.status && 13 !== request.status && (boundary.pendingTasks--, 0 === boundary.pendingTasks && 0 < boundary.nodes.length && (errorInfo = logRecoverableError(request, error, errorInfo), abortRemainingReplayNodes(
              request,
              null,
              boundary.nodes,
              boundary.slots,
              error,
              errorInfo
            )), request.pendingRootTasks--, 0 === request.pendingRootTasks && completeShell(request));
          } else {
            var trackedPostpones$65 = request.trackedPostpones;
            if (4 !== boundary.status) {
              if (!isRecoverableReason && null !== trackedPostpones$65 && null !== segment)
                return logRecoverableError(request, error, errorInfo), trackPostpone(request, trackedPostpones$65, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
                  return finishAbortedTask(fallbackTask, request, error);
                }), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
              boundary.status = 4;
              errorInfo = logRecoverableError(request, error, errorInfo);
              boundary.errorDigest = errorInfo;
              untrackBoundary(request, boundary);
              boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
            }
            boundary.pendingTasks--;
            errorInfo = boundary.row;
            null !== errorInfo && 0 === --errorInfo.pendingTasks && finishSuspenseListRow(request, errorInfo);
            boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
              return finishAbortedTask(fallbackTask, request, error);
            });
            boundary.fallbackAbortableTasks.clear();
          }
          task = task.row;
          null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
          request.allPendingTasks--;
          0 === request.allPendingTasks && completeAll(request);
        }
      }
    }
    function safelyEmitEarlyPreloads(request, shellComplete) {
      try {
        var renderState = request.renderState, onHeaders = renderState.onHeaders;
        if (onHeaders) {
          var headers = renderState.headers;
          if (headers) {
            renderState.headers = null;
            var linkHeader = headers.preconnects;
            headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
            headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
            if (!shellComplete) {
              var queueIter = renderState.styles.values(), queueStep = queueIter.next();
              b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next())
                for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
                  var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
                    crossOrigin: props$jscomp$0.crossOrigin,
                    integrity: props$jscomp$0.integrity,
                    nonce: props$jscomp$0.nonce,
                    type: props$jscomp$0.type,
                    fetchPriority: props$jscomp$0.fetchPriority,
                    referrerPolicy: props$jscomp$0.referrerPolicy,
                    media: props$jscomp$0.media
                  });
                  if (0 <= (headers.remainingCapacity -= header.length + 2))
                    renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
                  else break b;
                }
            }
            linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
          }
        }
      } catch (error) {
        logRecoverableError(request, error, {});
      }
    }
    function completeShell(request) {
      null === request.trackedPostpones && safelyEmitEarlyPreloads(request, true);
      null === request.trackedPostpones && preparePreamble(request);
      request = request.onShellReady;
      request();
    }
    function completeAll(request) {
      safelyEmitEarlyPreloads(
        request,
        null === request.trackedPostpones ? true : null === request.completedRootSegment || 5 !== request.completedRootSegment.status
      );
      preparePreamble(request);
      request = request.onAllReady;
      request();
    }
    function queueCompletedSegment(boundary, segment) {
      if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
        var childSegment = segment.children[0];
        childSegment.id = segment.id;
        childSegment.parentFlushed = true;
        1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
      } else boundary.completedSegments.push(segment);
    }
    function finishedSegment(request, boundary, segment) {
      if (null !== byteLengthOfChunk) {
        segment = segment.chunks;
        for (var segmentByteSize = 0, i = 0; i < segment.length; i++)
          segmentByteSize += byteLengthOfChunk(segment[i]);
        null === boundary ? request.byteSize += segmentByteSize : boundary.byteSize += segmentByteSize;
      }
    }
    function finishedTask(request, boundary, row, segment) {
      null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
      request.allPendingTasks--;
      if (null === boundary) {
        if (null !== segment && segment.parentFlushed) {
          if (null !== request.completedRootSegment)
            throw Error(
              "There can only be one root segment. This is a bug in React."
            );
          request.completedRootSegment = segment;
        }
        request.pendingRootTasks--;
        0 === request.pendingRootTasks && completeShell(request);
      } else if (boundary.pendingTasks--, 4 !== boundary.status)
        if (0 === boundary.pendingTasks)
          if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status)
            row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (request.allPendingTasks++, boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row), request.allPendingTasks--), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.preamble && preparePreamble(request);
          else {
            if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
              if (null !== request.trackedPostpones) {
                row = request.trackedPostpones;
                var postponedRow = boundary.next;
                if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment))
                  for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
                    var postponedBoundary = segment[postponedRow];
                    trackPostponedBoundary(request, row, postponedBoundary);
                    finishedTask(request, postponedBoundary, null, null);
                  }
              }
              request.allPendingTasks++;
              0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
              request.allPendingTasks--;
            }
          }
        else
          null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
      0 === request.allPendingTasks && completeAll(request);
    }
    function performWork(request$jscomp$1) {
      if (!(request$jscomp$1.aborted || 11 < request$jscomp$1.status)) {
        var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = HooksDispatcher;
        var prevAsyncDispatcher = ReactSharedInternals.A;
        ReactSharedInternals.A = DefaultAsyncDispatcher;
        var prevRequest = currentRequest;
        currentRequest = request$jscomp$1;
        var prevResumableState = currentResumableState;
        currentResumableState = request$jscomp$1.resumableState;
        try {
          var pingedTasks = request$jscomp$1.pingedTasks, i;
          for (i = 0; i < pingedTasks.length; i++) {
            var task = pingedTasks[i], request = request$jscomp$1, segment = task.blockedSegment;
            if (null === segment)
              a: {
                if (0 !== task.replay.pendingTasks) {
                  var prevTask = request.currentTask;
                  request.currentTask = task;
                  switchContext(task.context);
                  var startNode = task.node;
                  try {
                    "number" === typeof task.replay.slots ? resumeNode(
                      request,
                      task,
                      task.replay.slots,
                      task.node,
                      task.childIndex
                    ) : retryNode(request, task);
                    if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length)
                      throw Error(
                        "Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering."
                      );
                    task.replay.pendingTasks--;
                    task.abortSet.delete(task);
                    finishedTask(request, task.blockedBoundary, task.row, null);
                  } catch (thrownValue) {
                    resetHooksState();
                    var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                    if (request.aborted) {
                      thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending());
                      request.currentTask = prevTask;
                      var request$jscomp$0 = request;
                      abortTask(task, request$jscomp$0);
                      task.abortSet.delete(task);
                      finishAbortedTask(
                        task,
                        request$jscomp$0,
                        request$jscomp$0.fatalError
                      );
                    } else {
                      if ("object" === typeof x && null !== x) {
                        if ("function" === typeof x.then) {
                          var ping = task.ping;
                          x.then(ping.resolve, ping.reject);
                          task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                          break a;
                        }
                        if ("Maximum call stack size exceeded" === x.message && task.node !== startNode) {
                          task.thenableState = null;
                          request.pingedTasks.push(task);
                          break a;
                        }
                      }
                      task.replay.pendingTasks--;
                      task.abortSet.delete(task);
                      var errorInfo = getThrownInfo(task.componentStack);
                      request$jscomp$0 = request;
                      var boundary = task.blockedBoundary, error$jscomp$0 = request.aborted ? request.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots, errorDigest = logRecoverableError(
                        request$jscomp$0,
                        error$jscomp$0,
                        errorInfo
                      );
                      abortRemainingReplayNodes(
                        request$jscomp$0,
                        boundary,
                        replayNodes,
                        resumeSlots,
                        error$jscomp$0,
                        errorDigest
                      );
                      request.pendingRootTasks--;
                      0 === request.pendingRootTasks && completeShell(request);
                      request.allPendingTasks--;
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  } finally {
                    request.currentTask = prevTask;
                  }
                }
              }
            else
              a: if (request$jscomp$0 = segment, 0 === request$jscomp$0.status) {
                var prevTask$jscomp$0 = request.currentTask;
                request.currentTask = task;
                switchContext(task.context);
                var childrenLength = request$jscomp$0.children.length, chunkLength = request$jscomp$0.chunks.length, startNode$jscomp$0 = task.node;
                try {
                  retryNode(request, task), request$jscomp$0.lastPushedText && request$jscomp$0.textEmbedded && request$jscomp$0.chunks.push(textSeparator), task.abortSet.delete(task), request$jscomp$0.status = 1, finishedSegment(
                    request,
                    task.blockedBoundary,
                    request$jscomp$0
                  ), finishedTask(
                    request,
                    task.blockedBoundary,
                    task.row,
                    request$jscomp$0
                  );
                } catch (thrownValue) {
                  resetHooksState();
                  request$jscomp$0.children.length = childrenLength;
                  request$jscomp$0.chunks.length = chunkLength;
                  var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
                  if (request.aborted)
                    thrownValue === SuspenseException && (task.thenableState = getThenableStateAfterSuspending()), request.currentTask = prevTask$jscomp$0, request$jscomp$0 = request, abortTask(task, request$jscomp$0), task.abortSet.delete(task), finishAbortedTask(
                      task,
                      request$jscomp$0,
                      request$jscomp$0.fatalError
                    );
                  else {
                    if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0) {
                      if ("function" === typeof x$jscomp$0.then) {
                        request$jscomp$0.status = 0;
                        task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
                        var ping$jscomp$0 = task.ping;
                        x$jscomp$0.then(
                          ping$jscomp$0.resolve,
                          ping$jscomp$0.reject
                        );
                        break a;
                      }
                      if ("Maximum call stack size exceeded" === x$jscomp$0.message && task.node !== startNode$jscomp$0) {
                        request$jscomp$0.status = 0;
                        task.thenableState = null;
                        request.pingedTasks.push(task);
                        break a;
                      }
                    }
                    var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
                    task.abortSet.delete(task);
                    request$jscomp$0.status = 4;
                    var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
                    null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
                    request.allPendingTasks--;
                    if (null === boundary$jscomp$0)
                      if (isRecoverableError(x$jscomp$0)) {
                        var fatalRecoverableError = cloneRecoverableErrorAsFatal(x$jscomp$0);
                        logRecoverableError(
                          request,
                          fatalRecoverableError,
                          errorInfo$jscomp$0
                        );
                        fatalError(request, fatalRecoverableError);
                      } else
                        logRecoverableError(
                          request,
                          x$jscomp$0,
                          errorInfo$jscomp$0
                        ), fatalError(request, x$jscomp$0);
                    else {
                      var errorDigest$jscomp$0 = logRecoverableError(
                        request,
                        x$jscomp$0,
                        errorInfo$jscomp$0
                      );
                      boundary$jscomp$0.pendingTasks--;
                      if (4 !== boundary$jscomp$0.status) {
                        boundary$jscomp$0.status = 4;
                        boundary$jscomp$0.errorDigest = errorDigest$jscomp$0;
                        untrackBoundary(request, boundary$jscomp$0);
                        var boundaryRow = boundary$jscomp$0.row;
                        null !== boundaryRow && (request.allPendingTasks++, 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow), request.allPendingTasks--);
                        boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
                        0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.preamble && preparePreamble(request);
                      }
                      0 === request.allPendingTasks && completeAll(request);
                    }
                  }
                } finally {
                  request.currentTask = prevTask$jscomp$0;
                }
              }
          }
          pingedTasks.splice(0, i);
          null !== request$jscomp$1.destination && flushCompletedQueues(request$jscomp$1, request$jscomp$1.destination);
        } catch (error) {
          logRecoverableError(request$jscomp$1, error, {}), fatalError(request$jscomp$1, error);
        } finally {
          currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
        }
      }
    }
    function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
      segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
      for (var pendingPreambles = false, i = 0; i < segment.children.length; i++)
        pendingPreambles = preparePreambleFromSegment(
          request,
          segment.children[i],
          collectedPreambleSegments
        ) || pendingPreambles;
      return pendingPreambles;
    }
    function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
      var boundary = segment.boundary;
      if (null === boundary)
        return preparePreambleFromSubtree(
          request,
          segment,
          collectedPreambleSegments
        );
      var preamble = boundary.preamble;
      if (null === preamble) return false;
      switch (boundary.status) {
        case 1:
          hoistPreambleState(request.renderState, preamble.content);
          request.byteSize += boundary.byteSize;
          segment = boundary.completedSegments[0];
          if (!segment)
            throw Error(
              "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
            );
          return preparePreambleFromSubtree(
            request,
            segment,
            collectedPreambleSegments
          );
        case 5:
          if (null !== request.trackedPostpones) return true;
        case 4:
          if (1 === segment.status)
            return hoistPreambleState(request.renderState, preamble.fallback), preparePreambleFromSubtree(
              request,
              segment,
              collectedPreambleSegments
            );
        default:
          return true;
      }
    }
    function preparePreamble(request) {
      if (request.completedRootSegment && null === request.completedPreambleSegments) {
        var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(
          request,
          request.completedRootSegment,
          collectedPreambleSegments
        ), preamble = request.renderState.preamble;
        false === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
      }
    }
    function flushSubtree(request, destination, segment, hoistableState) {
      segment.parentFlushed = true;
      switch (segment.status) {
        case 0:
          segment.id = request.nextSegmentId++;
        case 5:
          return hoistableState = segment.id, segment.lastPushedText = false, segment.textEmbedded = false, request = request.renderState, writeChunk(destination, placeholder1), writeChunk(destination, request.placeholderPrefix), request = hoistableState.toString(16), writeChunk(destination, request), writeChunkAndReturn(destination, placeholder2);
        case 1:
          segment.status = 2;
          var r = true, chunks = segment.chunks, chunkIdx = 0;
          segment = segment.children;
          for (var childIdx = 0; childIdx < segment.length; childIdx++) {
            for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++)
              writeChunk(destination, chunks[chunkIdx]);
            r = flushSegment(request, destination, r, hoistableState);
          }
          for (; chunkIdx < chunks.length - 1; chunkIdx++)
            writeChunk(destination, chunks[chunkIdx]);
          chunkIdx < chunks.length && (r = writeChunkAndReturn(destination, chunks[chunkIdx]));
          return r;
        case 3:
          return true;
        default:
          throw Error(
            "Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React."
          );
      }
    }
    var flushedByteSize = 0;
    function flushSegment(request, destination, segment, hoistableState) {
      var boundary = segment.boundary;
      if (null === boundary)
        return flushSubtree(request, destination, segment, hoistableState);
      segment.boundary = null;
      boundary.parentFlushed = true;
      if (4 === boundary.status) {
        var row = boundary.row;
        null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
        boundary = boundary.errorDigest;
        writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
        writeChunk(destination, clientRenderedSuspenseBoundaryError1);
        null != boundary && (writeChunk(destination, clientRenderedSuspenseBoundaryError1A), writeChunk(destination, escapeTextForBrowser(boundary)), writeChunk(
          destination,
          clientRenderedSuspenseBoundaryErrorAttrInterstitial
        ));
        writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
        flushSubtree(request, destination, segment, hoistableState);
      } else if (1 !== boundary.status)
        0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState);
      else if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && (flushedByteSize + boundary.byteSize > request.progressiveChunkSize || hasSuspenseyContent(boundary.contentState, flushingShell) || boundary.defer))
        boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(
          destination,
          request.renderState,
          boundary.rootSegmentID
        ), flushSubtree(request, destination, segment, hoistableState);
      else {
        flushedByteSize += boundary.byteSize;
        hoistableState && hoistHoistables(hoistableState, boundary.contentState);
        segment = boundary.row;
        null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
        writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
        segment = boundary.completedSegments;
        if (1 !== segment.length)
          throw Error(
            "A previously unvisited boundary must have exactly one root segment. This is a bug in React."
          );
        flushSegment(request, destination, segment[0], hoistableState);
      }
      return writeChunkAndReturn(destination, endSuspenseBoundary);
    }
    function flushSegmentContainer(request, destination, segment, hoistableState) {
      writeStartSegment(
        destination,
        request.renderState,
        segment.parentFormatContext,
        segment.id
      );
      flushSegment(request, destination, segment, hoistableState);
      return writeEndSegment(destination, segment.parentFormatContext);
    }
    function flushCompletedBoundary(request, destination, boundary) {
      flushedByteSize = boundary.byteSize;
      for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++)
        flushPartiallyCompletedSegment(
          request,
          destination,
          boundary,
          completedSegments[i]
        );
      completedSegments.length = 0;
      completedSegments = boundary.row;
      null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
      writeHoistablesForBoundary(
        destination,
        boundary.contentState,
        request.renderState
      );
      completedSegments = request.resumableState;
      request = request.renderState;
      i = boundary.rootSegmentID;
      boundary = boundary.contentState;
      var requiresStyleInsertion = request.stylesToHoist, requiresViewTransitions = 0 !== (completedSegments.instructions & 128);
      request.stylesToHoist = false;
      writeChunk(destination, request.startInlineScript);
      writeChunk(destination, endOfStartTag);
      requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, writeChunk(destination, clientRenderScriptFunctionOnly)), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, writeChunk(
        destination,
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, writeChunk(destination, completeBoundaryWithStylesScript1FullPartial)) : writeChunk(destination, completeBoundaryWithStylesScript1Partial)) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), requiresViewTransitions && 0 === (completedSegments.instructions & 256) && (completedSegments.instructions |= 256, writeChunk(
        destination,
        `$RV=function(B,g){function h(a,c){var e=a.getAttribute(c);e&&(c=a.style,l.push(a,c.viewTransitionName,c.viewTransitionClass),"auto"!==e&&(c.viewTransitionClass=e),(a=a.getAttribute("vt-name"))||(a="_T_"+N++ +"_"),a=CSS.escape(a)!==a?"r-"+btoa(a).replace(/=/g,""):a,c.viewTransitionName=a,C=!0)}var C=!1,N=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var k=g[f].querySelectorAll("[vt-share]"),d=0;d<k.length;d++){var b=k[d];m.set(b.getAttribute("vt-name"),b)}var u=[];for(k=0;k<g.length;k+=2){var D=g[k],x=D.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){b=D;for(f=0;b;){if(8===b.nodeType){var t=b.data;if("/$"===t)if(0===f)break;else f--;else"$"!==t&&"$?"!==t&&"$~"!==t&&"$!"!==t||f++}else if(1===b.nodeType){d=b;var E=d.getAttribute("vt-name"),y=m.get(E);h(d,y?"vt-share":"vt-exit");y&&(h(y,"vt-share"),m.set(E,null));for(var F=d.querySelectorAll("[vt-share]"),
z=0;z<F.length;z++){var G=F[z],H=G.getAttribute("vt-name"),I=m.get(H);I&&(h(G,"vt-share"),h(I,"vt-share"),m.set(H,null))}var J=d.querySelectorAll("[vt-parent-exit]");for(d=0;d<J.length;d++)h(J[d],"vt-parent-exit")}b=b.nextSibling}for(var K=g[k+1],n=K.firstElementChild;n;){null!==m.get(n.getAttribute("vt-name"))&&h(n,"vt-enter");var L=n.querySelectorAll("[vt-parent-enter]");for(b=0;b<L.length;b++)h(L[b],"vt-parent-enter");n=n.nextElementSibling}b=x;do for(var p=b.firstElementChild;p;){var M=p.getAttribute("vt-update");
M&&"none"!==M&&!l.includes(p)&&h(p,"vt-update");p=p.nextElementSibling}while((b=b.parentNode)&&1===b.nodeType&&"none"!==b.getAttribute("vt-update"));u.push.apply(u,K.querySelectorAll('img[src]:not([loading="lazy"])'))}}}if(C){var A=document.__reactViewTransition=document.startViewTransition({update:function(){B(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],c={},e=0;e<u.length;c={g:c.g},e++)if(c.g=u[e],!c.g.complete){var q=c.g.getBoundingClientRect();0<q.bottom&&0<q.right&&
q.top<window.innerHeight&&q.left<window.innerWidth&&(q=new Promise(function(w){return function(r){w.g.addEventListener("load",r);w.g.addEventListener("error",r)}}(c)),a.push(q))}return Promise.race([Promise.all(a),new Promise(function(w){var r=performance.now();setTimeout(w,2300>r&&2E3<r?2300-r:500)})])},types:[]});A.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var c=l[a],e=c.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];""===c.getAttribute("style")&&c.removeAttribute("style")}});
A.finished.finally(function(){document.__reactViewTransition===A&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}B(g)}.bind(null,$RV);`
      )), writeChunk(destination, completeBoundaryScript1Partial));
      completedSegments = i.toString(16);
      writeChunk(destination, request.boundaryPrefix);
      writeChunk(destination, completedSegments);
      writeChunk(destination, completeBoundaryScript2);
      writeChunk(destination, request.segmentPrefix);
      writeChunk(destination, completedSegments);
      requiresStyleInsertion ? (writeChunk(destination, completeBoundaryScript3a), writeStyleResourceDependenciesInJS(destination, boundary)) : writeChunk(destination, completeBoundaryScript3b);
      boundary = writeChunkAndReturn(destination, completeBoundaryScriptEnd);
      return writeBootstrap(destination, request) && boundary;
    }
    function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
      if (2 === segment.status) return true;
      var hoistableState = boundary.contentState, segmentID = segment.id;
      if (-1 === segmentID) {
        if (-1 === (segment.id = boundary.rootSegmentID))
          throw Error(
            "A root segment ID must have been assigned by now. This is a bug in React."
          );
        return flushSegmentContainer(request, destination, segment, hoistableState);
      }
      if (segmentID === boundary.rootSegmentID)
        return flushSegmentContainer(request, destination, segment, hoistableState);
      flushSegmentContainer(request, destination, segment, hoistableState);
      boundary = request.resumableState;
      request = request.renderState;
      writeChunk(destination, request.startInlineScript);
      writeChunk(destination, endOfStartTag);
      0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, writeChunk(destination, completeSegmentScript1Full)) : writeChunk(destination, completeSegmentScript1Partial);
      writeChunk(destination, request.segmentPrefix);
      segmentID = segmentID.toString(16);
      writeChunk(destination, segmentID);
      writeChunk(destination, completeSegmentScript2);
      writeChunk(destination, request.placeholderPrefix);
      writeChunk(destination, segmentID);
      destination = writeChunkAndReturn(destination, completeSegmentScriptEnd);
      return destination;
    }
    var flushingPartialBoundaries = false;
    var flushingShell = false;
    function flushCompletedQueues(request, destination) {
      currentView = new Uint8Array(4096);
      writtenBytes = 0;
      destinationHasCapacity$1 = true;
      try {
        if (!(0 < request.pendingRootTasks)) {
          var i, completedRootSegment = request.completedRootSegment;
          if (null !== completedRootSegment) {
            if (5 === completedRootSegment.status) return;
            var completedPreambleSegments = request.completedPreambleSegments;
            if (null === completedPreambleSegments) return;
            flushedByteSize = request.byteSize;
            var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
            if (htmlChunks) {
              for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++)
                writeChunk(destination, htmlChunks[i$jscomp$0]);
              if (headChunks)
                for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                  writeChunk(destination, headChunks[i$jscomp$0]);
              else
                writeChunk(destination, startChunkForTag("head")), writeChunk(destination, endOfStartTag);
            } else if (headChunks)
              for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++)
                writeChunk(destination, headChunks[i$jscomp$0]);
            var charsetChunks = renderState.charsetChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++)
              writeChunk(destination, charsetChunks[i$jscomp$0]);
            charsetChunks.length = 0;
            renderState.preconnects.forEach(flushResource, destination);
            renderState.preconnects.clear();
            var viewportChunks = renderState.viewportChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++)
              writeChunk(destination, viewportChunks[i$jscomp$0]);
            viewportChunks.length = 0;
            renderState.fontPreloads.forEach(flushResource, destination);
            renderState.fontPreloads.clear();
            renderState.highImagePreloads.forEach(flushResource, destination);
            renderState.highImagePreloads.clear();
            currentlyFlushingRenderState = renderState;
            renderState.styles.forEach(flushStylesInPreamble, destination);
            currentlyFlushingRenderState = null;
            var importMapChunks = renderState.importMapChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++)
              writeChunk(destination, importMapChunks[i$jscomp$0]);
            importMapChunks.length = 0;
            renderState.bootstrapScripts.forEach(flushResource, destination);
            renderState.scripts.forEach(flushResource, destination);
            renderState.scripts.clear();
            renderState.bulkPreloads.forEach(flushResource, destination);
            renderState.bulkPreloads.clear();
            htmlChunks || headChunks || (resumableState.instructions |= 32);
            var hoistableChunks = renderState.hoistableChunks;
            for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++)
              writeChunk(destination, hoistableChunks[i$jscomp$0]);
            for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
              var segments = completedPreambleSegments[resumableState];
              for (renderState = 0; renderState < segments.length; renderState++)
                flushSegment(request, destination, segments[renderState], null);
            }
            var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
            (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) && writeChunk(destination, endChunkForTag("head"));
            var bodyChunks = preamble$jscomp$0.bodyChunks;
            if (bodyChunks)
              for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++)
                writeChunk(destination, bodyChunks[completedPreambleSegments]);
            flushingShell = true;
            flushSegment(request, destination, completedRootSegment, null);
            flushingShell = false;
            request.completedRootSegment = null;
            var renderState$jscomp$0 = request.renderState;
            if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
              var resumableState$jscomp$0 = request.resumableState;
              if (0 === (resumableState$jscomp$0.instructions & 64)) {
                resumableState$jscomp$0.instructions |= 64;
                writeChunk(destination, renderState$jscomp$0.startInlineScript);
                if (0 === (resumableState$jscomp$0.instructions & 32)) {
                  resumableState$jscomp$0.instructions |= 32;
                  var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
                  writeChunk(destination, completedShellIdAttributeStart);
                  writeChunk(destination, escapeTextForBrowser(shellId));
                  writeChunk(destination, attributeEnd);
                }
                writeChunk(destination, endOfStartTag);
                writeChunk(destination, shellTimeRuntimeScript);
                writeChunkAndReturn(destination, endInlineScript);
              }
            }
            writeBootstrap(destination, renderState$jscomp$0);
          }
          var renderState$jscomp$1 = request.renderState;
          completedRootSegment = 0;
          var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
          for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++)
            writeChunk(destination, viewportChunks$jscomp$0[completedRootSegment]);
          viewportChunks$jscomp$0.length = 0;
          renderState$jscomp$1.preconnects.forEach(flushResource, destination);
          renderState$jscomp$1.preconnects.clear();
          renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.fontPreloads.clear();
          renderState$jscomp$1.highImagePreloads.forEach(
            flushResource,
            destination
          );
          renderState$jscomp$1.highImagePreloads.clear();
          renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
          renderState$jscomp$1.scripts.forEach(flushResource, destination);
          renderState$jscomp$1.scripts.clear();
          renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
          renderState$jscomp$1.bulkPreloads.clear();
          var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
          for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++)
            writeChunk(destination, hoistableChunks$jscomp$0[completedRootSegment]);
          hoistableChunks$jscomp$0.length = 0;
          var clientRenderedBoundaries = request.clientRenderedBoundaries;
          for (i = 0; i < clientRenderedBoundaries.length; i++) {
            var boundary = clientRenderedBoundaries[i];
            renderState$jscomp$1 = destination;
            var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
            writeChunk(
              renderState$jscomp$1,
              renderState$jscomp$2.startInlineScript
            );
            writeChunk(renderState$jscomp$1, endOfStartTag);
            0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, writeChunk(renderState$jscomp$1, clientRenderScript1Full)) : writeChunk(renderState$jscomp$1, clientRenderScript1Partial);
            writeChunk(renderState$jscomp$1, renderState$jscomp$2.boundaryPrefix);
            writeChunk(renderState$jscomp$1, id.toString(16));
            writeChunk(renderState$jscomp$1, clientRenderScript1A);
            null != errorDigest && (writeChunk(
              renderState$jscomp$1,
              clientRenderErrorScriptArgInterstitial
            ), null == errorDigest ? writeChunk(renderState$jscomp$1, clientRenderErrorScriptNull) : writeChunk(
              renderState$jscomp$1,
              escapeJSStringsForInstructionScripts(errorDigest)
            ));
            var JSCompiler_inline_result = writeChunkAndReturn(
              renderState$jscomp$1,
              clientRenderScriptEnd
            );
            if (!JSCompiler_inline_result) {
              request.destination = null;
              i++;
              clientRenderedBoundaries.splice(0, i);
              return;
            }
          }
          clientRenderedBoundaries.splice(0, i);
          var completedBoundaries = request.completedBoundaries;
          for (i = 0; i < completedBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
              request.destination = null;
              i++;
              completedBoundaries.splice(0, i);
              return;
            }
          completedBoundaries.splice(0, i);
          completeWriting(destination);
          currentView = new Uint8Array(4096);
          writtenBytes = 0;
          flushingPartialBoundaries = destinationHasCapacity$1 = true;
          var partialBoundaries = request.partialBoundaries;
          for (i = 0; i < partialBoundaries.length; i++) {
            var boundary$71 = partialBoundaries[i];
            a: {
              clientRenderedBoundaries = request;
              boundary = destination;
              flushedByteSize = boundary$71.byteSize;
              var completedSegments = boundary$71.completedSegments;
              for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++)
                if (!flushPartiallyCompletedSegment(
                  clientRenderedBoundaries,
                  boundary,
                  boundary$71,
                  completedSegments[JSCompiler_inline_result]
                )) {
                  JSCompiler_inline_result++;
                  completedSegments.splice(0, JSCompiler_inline_result);
                  var JSCompiler_inline_result$jscomp$0 = false;
                  break a;
                }
              completedSegments.splice(0, JSCompiler_inline_result);
              var row = boundary$71.row;
              null !== row && row.together && 1 === boundary$71.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(
                clientRenderedBoundaries,
                row,
                row.hoistables
              ) : row.pendingTasks--);
              JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(
                boundary,
                boundary$71.contentState,
                clientRenderedBoundaries.renderState
              );
            }
            if (!JSCompiler_inline_result$jscomp$0) {
              request.destination = null;
              i++;
              partialBoundaries.splice(0, i);
              return;
            }
          }
          partialBoundaries.splice(0, i);
          flushingPartialBoundaries = false;
          var largeBoundaries = request.completedBoundaries;
          for (i = 0; i < largeBoundaries.length; i++)
            if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
              request.destination = null;
              i++;
              largeBoundaries.splice(0, i);
              return;
            }
          largeBoundaries.splice(0, i);
        }
      } finally {
        flushingPartialBoundaries = false, i = request.postponedState, null !== i && (i.nextSegmentId = request.nextSegmentId), 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length ? (request.flushScheduled = false, i = request.resumableState, i.hasBody && writeChunk(destination, endChunkForTag("body")), i.hasHtml && writeChunk(destination, endChunkForTag("html")), completeWriting(destination), flushBuffered(destination), endRenderLifetime(request), request.status = 13, destination.end(), request.destination = null) : (completeWriting(destination), flushBuffered(destination));
      }
    }
    function startWork(request) {
      request.flushScheduled = null !== request.destination;
      scheduleMicrotask(function() {
        return requestStorage.run(request, performWork, request);
      });
      setImmediate(function() {
        10 === request.status && (request.status = 11);
        null === request.trackedPostpones && requestStorage.run(
          request,
          enqueueEarlyPreloadsAfterInitialWork,
          request
        );
      });
    }
    function enqueueEarlyPreloadsAfterInitialWork(request) {
      safelyEmitEarlyPreloads(request, 0 === request.pendingRootTasks);
    }
    function enqueueFlush(request) {
      false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination && (request.flushScheduled = true, setImmediate(function() {
        var destination = request.destination;
        destination ? flushCompletedQueues(request, destination) : request.flushScheduled = false;
      }));
    }
    function startFlowing(request, destination) {
      if (12 === request.status)
        request.status = 13, request = request.fatalError, isRecoverableError(request) && (request = cloneRecoverableErrorAsFatal(request)), destination.destroy(request);
      else if (13 !== request.status && null === request.destination) {
        request.destination = destination;
        try {
          flushCompletedQueues(request, destination);
        } catch (error$73) {
          logRecoverableError(request, error$73, {}), fatalError(request, error$73);
        }
      }
    }
    function finishAbort(request, abortableTasks) {
      try {
        if (0 < abortableTasks.size) {
          var error = request.fatalError;
          abortableTasks.forEach(function(task) {
            return finishAbortedTask(task, request, error);
          });
          abortableTasks.clear();
        }
        null !== request.destination && flushCompletedQueues(request, request.destination);
      } catch (error$74) {
        logRecoverableError(request, error$74, {}), fatalError(request, error$74);
      }
    }
    function endRenderLifetime(request) {
      request = request.renderLifetimeController;
      null !== request && request.abort("The render ended.");
    }
    function attachAbortSignal(request, signal) {
      if (signal.aborted) abort(request, signal.reason);
      else {
        var renderLifetimeController = new AbortController();
        request.renderLifetimeController = renderLifetimeController;
        signal.addEventListener(
          "abort",
          function() {
            abort(request, signal.reason);
          },
          { signal: renderLifetimeController.signal }
        );
      }
    }
    function abort(request, reason) {
      if (!(request.aborted || 11 !== request.status && 10 !== request.status)) {
        endRenderLifetime(request);
        var isRecoverableReason = "object" === typeof reason && null !== reason && reason.$$typeof === REACT_RECOVERABLE_TYPE;
        request.aborted = true;
        reason = isRecoverableReason ? createRecoverableError(reason) : void 0 === reason ? Error("The render was aborted by the server without a reason.") : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error("The render was aborted by the server with a promise.") : reason;
        request.fatalError = reason;
        var abortableTasks = request.abortableTasks;
        abortableTasks.forEach(function(task) {
          return abortTask(task, request);
        });
        setImmediate(function() {
          return finishAbort(request, abortableTasks);
        });
      }
    }
    function addToReplayParent(node, parentKeyPath, trackedPostpones) {
      if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
      else {
        var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
        void 0 === parentNode && (parentNode = [parentKeyPath[1], parentKeyPath[2], [], null], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
        parentNode[2].push(node);
      }
    }
    function getPostponedState(request) {
      var trackedPostpones = request.trackedPostpones;
      if (null === trackedPostpones || 0 === trackedPostpones.rootNodes.length && null === trackedPostpones.rootSlots)
        return request.trackedPostpones = null;
      var hasFlushableShell = null === request.completedRootSegment || 5 !== request.completedRootSegment.status && null !== request.completedPreambleSegments;
      if (hasFlushableShell) {
        var nextSegmentId = request.nextSegmentId;
        var replaySlots = trackedPostpones.rootSlots;
        var resumableState = request.resumableState;
        resumableState.bootstrapScriptContent = void 0;
        resumableState.bootstrapScripts = void 0;
        resumableState.bootstrapModules = void 0;
      } else {
        nextSegmentId = 0;
        replaySlots = -1;
        resumableState = request.resumableState;
        var renderState = request.renderState;
        resumableState.nextFormID = 0;
        resumableState.hasBody = false;
        resumableState.hasHtml = false;
        resumableState.unknownResources = { font: renderState.resets.font };
        resumableState.dnsResources = renderState.resets.dns;
        resumableState.connectResources = renderState.resets.connect;
        resumableState.imageResources = renderState.resets.image;
        resumableState.styleResources = renderState.resets.style;
        resumableState.scriptResources = {};
        resumableState.moduleUnknownResources = {};
        resumableState.moduleScriptResources = {};
        resumableState.instructions = 0;
      }
      trackedPostpones = {
        nextSegmentId,
        rootFormatContext: request.rootFormatContext,
        progressiveChunkSize: request.progressiveChunkSize,
        resumableState: request.resumableState,
        replayNodes: trackedPostpones.rootNodes,
        replaySlots
      };
      hasFlushableShell && (request.postponedState = trackedPostpones);
      return trackedPostpones;
    }
    function ensureCorrectIsomorphicReactVersion() {
      var isomorphicReactPackageVersion = React.version;
      if ("19.3.0" !== isomorphicReactPackageVersion)
        throw Error(
          'Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:\n  - react:      ' + (isomorphicReactPackageVersion + "\n  - react-dom:  19.3.0\nLearn more: https://react.dev/warnings/version-mismatch")
        );
    }
    ensureCorrectIsomorphicReactVersion();
    function createDrainHandler(destination, request) {
      return function() {
        return startFlowing(request, destination);
      };
    }
    function createCancelHandler(request, reason) {
      return function() {
        request.destination = null;
        abort(request, Error(reason));
      };
    }
    function createRequestImpl(children, options) {
      var resumableState = createResumableState(
        options ? options.identifierPrefix : void 0,
        options ? options.unstable_externalRuntimeSrc : void 0,
        options ? options.bootstrapScriptContent : void 0,
        options ? options.bootstrapScripts : void 0,
        options ? options.bootstrapModules : void 0
      );
      return createRequest(
        children,
        resumableState,
        createRenderState(
          resumableState,
          options ? options.nonce : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.importMap : void 0,
          options ? options.onHeaders : void 0,
          options ? options.maxHeadersLength : void 0
        ),
        createRootFormatContext(options ? options.namespaceURI : void 0),
        options ? options.progressiveChunkSize : void 0,
        options ? options.onError : void 0,
        options ? options.onBrowserBailout : void 0,
        options ? options.onAllReady : void 0,
        options ? options.onShellReady : void 0,
        options ? options.onShellError : void 0,
        void 0,
        options ? options.formState : void 0
      );
    }
    function createFakeWritableFromReadableStreamController$1(controller) {
      return {
        write: function(chunk) {
          "string" === typeof chunk && (chunk = textEncoder.encode(chunk));
          controller.enqueue(chunk);
          return true;
        },
        end: function() {
          controller.close();
        },
        destroy: function(error) {
          "function" === typeof controller.error ? controller.error(error) : controller.close();
        }
      };
    }
    function resumeRequestImpl(children, postponedState, options) {
      return resumeRequest(
        children,
        postponedState,
        createRenderState(
          postponedState.resumableState,
          options ? options.nonce : void 0,
          void 0,
          void 0,
          void 0,
          void 0
        ),
        options ? options.onError : void 0,
        options ? options.onBrowserBailout : void 0,
        options ? options.onAllReady : void 0,
        options ? options.onShellReady : void 0,
        options ? options.onShellError : void 0,
        void 0
      );
    }
    ensureCorrectIsomorphicReactVersion();
    function createFakeWritableFromReadableStreamController(controller) {
      return {
        write: function(chunk) {
          "string" === typeof chunk && (chunk = textEncoder.encode(chunk));
          controller.enqueue(chunk);
          return true;
        },
        end: function() {
          controller.close();
        },
        destroy: function(error) {
          "function" === typeof controller.error ? controller.error(error) : controller.close();
        }
      };
    }
    function createFakeWritableFromReadable(readable) {
      return {
        write: function(chunk) {
          return readable.push(chunk);
        },
        end: function() {
          readable.push(null);
        },
        destroy: function(error) {
          readable.destroy(error);
        }
      };
    }
    exports2.prerender = function(children, options) {
      return new Promise(function(resolve, reject) {
        var onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
        onHeaders && (onHeadersImpl = function(headersDescriptor) {
          onHeaders(new Headers(headersDescriptor));
        });
        var resources = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0
        ), request = createPrerenderRequest(
          children,
          resources,
          createRenderState(
            resources,
            void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            onHeadersImpl,
            options ? options.maxHeadersLength : void 0
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController(controller);
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2 = { postponed: getPostponedState(request), prelude: stream2 };
            resolve(stream2);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.prerenderToNodeStream = function(children, options) {
      return new Promise(function(resolve, reject) {
        var resumableState = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0
        ), request = createPrerenderRequest(
          children,
          resumableState,
          createRenderState(
            resumableState,
            void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            options ? options.onHeaders : void 0,
            options ? options.maxHeadersLength : void 0
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var readable = new stream.Readable({
              read: function() {
                startFlowing(request, writable);
              }
            }), writable = createFakeWritableFromReadable(readable);
            readable = {
              postponed: getPostponedState(request),
              prelude: readable
            };
            resolve(readable);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.renderToPipeableStream = function(children, options) {
      var request = createRequestImpl(children, options), hasStartedFlowing = false;
      startWork(request);
      return {
        pipe: function(destination) {
          if (hasStartedFlowing)
            throw Error(
              "React currently only supports piping to one writable stream."
            );
          hasStartedFlowing = true;
          safelyEmitEarlyPreloads(
            request,
            null === request.trackedPostpones ? 0 === request.pendingRootTasks : null === request.completedRootSegment ? 0 === request.pendingRootTasks : 5 !== request.completedRootSegment.status
          );
          startFlowing(request, destination);
          destination.on("drain", createDrainHandler(destination, request));
          destination.on(
            "error",
            createCancelHandler(
              request,
              "The destination stream errored while writing data."
            )
          );
          destination.on(
            "close",
            createCancelHandler(request, "The destination stream closed early.")
          );
          return destination;
        },
        abort: function(reason) {
          abort(request, reason);
        }
      };
    };
    exports2.renderToReadableStream = function(children, options) {
      return new Promise(function(resolve, reject) {
        var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
          onAllReady = res;
          onFatalError = rej;
        }), onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
        onHeaders && (onHeadersImpl = function(headersDescriptor) {
          onHeaders(new Headers(headersDescriptor));
        });
        var resumableState = createResumableState(
          options ? options.identifierPrefix : void 0,
          options ? options.unstable_externalRuntimeSrc : void 0,
          options ? options.bootstrapScriptContent : void 0,
          options ? options.bootstrapScripts : void 0,
          options ? options.bootstrapModules : void 0
        ), request = createRequest(
          children,
          resumableState,
          createRenderState(
            resumableState,
            options ? options.nonce : void 0,
            options ? options.unstable_externalRuntimeSrc : void 0,
            options ? options.importMap : void 0,
            onHeadersImpl,
            options ? options.maxHeadersLength : void 0
          ),
          createRootFormatContext(options ? options.namespaceURI : void 0),
          options ? options.progressiveChunkSize : void 0,
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          onAllReady,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController$1(
                    controller
                  );
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2.allReady = allReady;
            resolve(stream2);
          },
          function(error) {
            allReady.catch(function() {
            });
            reject(error);
          },
          onFatalError,
          options ? options.formState : void 0
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resume = function(children, postponedState, options) {
      return new Promise(function(resolve, reject) {
        var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
          onAllReady = res;
          onFatalError = rej;
        }), request = resumeRequest(
          children,
          postponedState,
          createRenderState(
            postponedState.resumableState,
            options ? options.nonce : void 0,
            void 0,
            void 0,
            void 0,
            void 0
          ),
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          onAllReady,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController$1(
                    controller
                  );
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2.allReady = allReady;
            resolve(stream2);
          },
          function(error) {
            allReady.catch(function() {
            });
            reject(error);
          },
          onFatalError
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resumeAndPrerender = function(children, postponedState, options) {
      return new Promise(function(resolve, reject) {
        var request = resumeAndPrerenderRequest(
          children,
          postponedState,
          createRenderState(
            postponedState.resumableState,
            void 0,
            void 0,
            void 0,
            void 0,
            void 0
          ),
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var writable, stream2 = new ReadableStream(
              {
                type: "bytes",
                start: function(controller) {
                  writable = createFakeWritableFromReadableStreamController(controller);
                },
                pull: function() {
                  startFlowing(request, writable);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            stream2 = { postponed: getPostponedState(request), prelude: stream2 };
            resolve(stream2);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resumeAndPrerenderToNodeStream = function(children, postponedState, options) {
      return new Promise(function(resolve, reject) {
        var request = resumeAndPrerenderRequest(
          children,
          postponedState,
          createRenderState(
            postponedState.resumableState,
            void 0,
            void 0,
            void 0,
            void 0,
            void 0
          ),
          options ? options.onError : void 0,
          options ? options.onBrowserBailout : void 0,
          function() {
            var readable = new stream.Readable({
              read: function() {
                startFlowing(request, writable);
              }
            }), writable = createFakeWritableFromReadable(readable);
            readable = { postponed: getPostponedState(request), prelude: readable };
            resolve(readable);
          },
          void 0,
          void 0,
          reject
        );
        options && options.signal && attachAbortSignal(request, options.signal);
        startWork(request);
      });
    };
    exports2.resumeToPipeableStream = function(children, postponedState, options) {
      var request = resumeRequestImpl(children, postponedState, options), hasStartedFlowing = false;
      startWork(request);
      return {
        pipe: function(destination) {
          if (hasStartedFlowing)
            throw Error(
              "React currently only supports piping to one writable stream."
            );
          hasStartedFlowing = true;
          startFlowing(request, destination);
          destination.on("drain", createDrainHandler(destination, request));
          destination.on(
            "error",
            createCancelHandler(
              request,
              "The destination stream errored while writing data."
            )
          );
          destination.on(
            "close",
            createCancelHandler(request, "The destination stream closed early.")
          );
          return destination;
        },
        abort: function(reason) {
          abort(request, reason);
        }
      };
    };
    exports2.version = "19.3.0";
  }
});

// node_modules/react-dom/server.node.js
var require_server_node = __commonJS({
  "node_modules/react-dom/server.node.js"(exports2) {
    "use strict";
    var l;
    var s;
    if (true) {
      l = require_react_dom_server_legacy_node_production();
      s = require_react_dom_server_node_production();
    } else {
      l = null;
      s = null;
    }
    exports2.version = l.version;
    exports2.renderToString = l.renderToString;
    exports2.renderToStaticMarkup = l.renderToStaticMarkup;
    exports2.renderToPipeableStream = s.renderToPipeableStream;
    exports2.renderToReadableStream = s.renderToReadableStream;
    exports2.resumeToPipeableStream = s.resumeToPipeableStream;
    exports2.resume = s.resume;
  }
});

// node_modules/react/cjs/react-jsx-runtime.production.js
var require_react_jsx_runtime_production = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.jsx = jsxProd;
    exports2.jsxs = jsxProd;
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports2, module2) {
    "use strict";
    if (true) {
      module2.exports = require_react_jsx_runtime_production();
    } else {
      module2.exports = null;
    }
  }
});

// rwbundle/server-entry.tsx
var server_entry_exports = {};
__export(server_entry_exports, {
  BUILD_ID: () => BUILD_ID,
  DEFAULT_SITE: () => DEFAULT_SITE,
  REGIONS: () => REGIONS,
  SajuInputError: () => SajuInputError,
  fontHrefs: () => fontHrefs,
  freeReading: () => freeReading,
  normalizeSite: () => normalizeSite,
  productById: () => productById,
  renderPage: () => renderPage,
  reportProducts: () => reportProducts,
  won: () => won
});
module.exports = __toCommonJS(server_entry_exports);
var import_server = __toESM(require_server_node());

// lib/site.ts
var DISPLAY_FONTS = [
  { id: "Song Myung", label: "\uC1A1\uBA85 \xB7 \uBD93 \uBA85\uC870", scale: 1, weight: 400, google: "Song+Myung" },
  { id: "Gowun Batang", label: "\uACE0\uC6B4\uBC14\uD0D5 \xB7 \uB2E8\uC815\uD55C \uBA85\uC870", scale: 1, weight: 700, google: "Gowun+Batang:wght@400;700" },
  { id: "Nanum Myeongjo", label: "\uB098\uB214\uBA85\uC870 \xB7 \uD074\uB798\uC2DD", scale: 1, weight: 800, google: "Nanum+Myeongjo:wght@400;700;800" },
  { id: "Hahmlet", label: "\uD568\uB81B \xB7 \uD604\uB300 \uBA85\uC870", scale: 1, weight: 600, google: "Hahmlet:wght@400;600;700" },
  { id: "Noto Serif KR", label: "\uBCF8\uBA85\uC870 \xB7 \uCC45 \uB290\uB08C", scale: 1, weight: 700, google: "Noto+Serif+KR:wght@400;700" },
  { id: "Black Han Sans", label: "\uAC80\uC740\uACE0\uB515 \xB7 \uAC15\uB82C\uD558\uAC8C", scale: 0.95, weight: 400, google: "Black+Han+Sans" },
  { id: "Do Hyeon", label: "\uB3C4\uD604 \xB7 \uB610\uB837\uD55C \uACE0\uB515", scale: 1.02, weight: 400, google: "Do+Hyeon" },
  { id: "Jua", label: "\uC8FC\uC544 \xB7 \uB465\uAE00\uACE0 \uADC0\uC5FD\uAC8C", scale: 1, weight: 400, google: "Jua" },
  { id: "Gaegu", label: "\uAC1C\uAD6C \xB7 \uC190\uAE00\uC528", scale: 1.12, weight: 700, google: "Gaegu:wght@400;700" },
  { id: "Nanum Pen Script", label: "\uB098\uB214\uC190\uAE00\uC528 \uD39C \xB7 \uD3B8\uC9C0", scale: 1.4, weight: 400, google: "Nanum+Pen+Script" },
  { id: "Dongle", label: "\uB3D9\uAE00 \xB7 \uB9D0\uB791\uB9D0\uB791", scale: 1.55, weight: 700, google: "Dongle:wght@400;700" },
  { id: "East Sea Dokdo", label: "\uB3D9\uD574\uB3C5\uB3C4 \xB7 \uAC70\uCE5C \uBD93\uAE00\uC528", scale: 1.3, weight: 400, google: "East+Sea+Dokdo" },
  { id: "Yeon Sung", label: "\uC5F0\uC131 \xB7 \uC61B \uAC04\uD310", scale: 1.1, weight: 400, google: "Yeon+Sung" },
  { id: "Gowun Dodum", label: "\uACE0\uC6B4\uB3CB\uC6C0 \xB7 \uBD80\uB4DC\uB7EC\uC6B4 \uACE0\uB515", scale: 1, weight: 400, google: "Gowun+Dodum" },
  { id: "Pretendard", label: "\uD504\uB9AC\uD150\uB2E4\uB4DC \xB7 \uAE54\uB054\uD55C \uACE0\uB515", scale: 1, weight: 700 },
  { id: "Noto Sans KR", label: "\uBCF8\uACE0\uB515 \xB7 \uAE30\uBCF8 \uACE0\uB515", scale: 1, weight: 700, google: "Noto+Sans+KR:wght@400;500;700" }
];
var BODY_FONTS = [
  { id: "Pretendard", label: "\uD504\uB9AC\uD150\uB2E4\uB4DC", scale: 1, weight: 400 },
  { id: "Noto Sans KR", label: "\uBCF8\uACE0\uB515", scale: 1, weight: 400, google: "Noto+Sans+KR:wght@400;500;700" },
  { id: "IBM Plex Sans KR", label: "IBM \uD50C\uB809\uC2A4", scale: 1, weight: 400, google: "IBM+Plex+Sans+KR:wght@400;500;600;700" },
  { id: "Gowun Dodum", label: "\uACE0\uC6B4\uB3CB\uC6C0", scale: 1, weight: 400, google: "Gowun+Dodum" },
  { id: "Nanum Gothic", label: "\uB098\uB214\uACE0\uB515", scale: 1, weight: 400, google: "Nanum+Gothic:wght@400;700;800" },
  { id: "Gowun Batang", label: "\uACE0\uC6B4\uBC14\uD0D5 \xB7 \uBA85\uC870 \uBCF8\uBB38", scale: 1, weight: 400, google: "Gowun+Batang:wght@400;700" },
  { id: "Nanum Myeongjo", label: "\uB098\uB214\uBA85\uC870 \xB7 \uBA85\uC870 \uBCF8\uBB38", scale: 1, weight: 400, google: "Nanum+Myeongjo:wght@400;700;800" }
];
var PRETENDARD_CSS = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";
function fontHrefs(theme) {
  const defs = [DISPLAY_FONTS.find((f) => f.id === theme.displayFont), BODY_FONTS.find((f) => f.id === theme.bodyFont)];
  const google = [...new Set(defs.map((f) => f?.google).filter(Boolean))];
  const out = [];
  if (google.length) out.push(`https://fonts.googleapis.com/css2?${google.map((g) => `family=${g}`).join("&")}&display=swap`);
  if (theme.displayFont === "Pretendard" || theme.bodyFont === "Pretendard") out.push(PRETENDARD_CSS);
  return out;
}
var stack = (id, serif = false) => `"${id === "Pretendard" ? "Pretendard Variable" : id}", ${id === "Pretendard" ? "Pretendard, " : ""}-apple-system, "Apple SD Gothic Neo", "Malgun Gothic", ${serif ? "serif" : "sans-serif"}`;
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full, 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function mixHex(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const c = (x, y) => Math.round(x * t + y * (1 - t)).toString(16).padStart(2, "0");
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
var isDarkTheme = (t) => luminance(t.colors.bg) < 0.2;
function themeVars(t) {
  const c = t.colors;
  const display = DISPLAY_FONTS.find((f) => f.id === t.displayFont) ?? DISPLAY_FONTS[0];
  const serifBody = t.bodyFont.includes("Batang") || t.bodyFont.includes("Myeongjo");
  const vars = {
    "--ground": c.bg,
    "--surface": c.surface,
    "--ink": c.ink,
    "--muted": c.muted,
    "--accent": c.primary,
    "--gold": c.accent,
    "--night": c.night,
    "--night-ink": c.nightInk,
    "--deep": c.night,
    // 리포트 제목·표지처럼 항상 진해야 하는 곳
    "--on-accent": luminance(c.primary) > 0.45 ? "#14110d" : "#ffffff",
    "--on-gold": luminance(c.accent) > 0.45 ? "#14110d" : "#ffffff",
    "--tone-rgb": isDarkTheme(t) ? "255,255,255" : "0,0,0",
    "--display": stack(display.id, /Myung|Batang|Myeongjo|Hahmlet|Serif/.test(display.id)),
    "--display-scale": String(display.scale),
    "--display-weight": String(display.weight),
    "--body": stack(t.bodyFont, serifBody),
    "--base-size": t.fontScale === "sm" ? "15px" : t.fontScale === "lg" ? "17.5px" : "16px"
  };
  if (t.panels === "light" && !isDarkTheme(t)) {
    vars["--night"] = mixHex(c.primary, c.surface, 0.07);
    vars["--night-2"] = mixHex(c.primary, c.surface, 0.03);
    vars["--night-ink"] = c.ink;
    vars["--night-muted"] = c.muted;
    vars["--moon"] = c.primary;
  }
  return vars;
}
function themeAttrs(t) {
  return {
    "data-radius": t.radius,
    "data-shadow": t.shadow,
    "data-border": t.border,
    "data-button": t.button,
    "data-density": t.density,
    "data-pattern": t.pattern,
    "data-header": t.header,
    "data-align": t.headingAlign,
    "data-tone": isDarkTheme(t) ? "dark" : "light",
    "data-motion": t.motion,
    "data-panels": t.panels === "light" && !isDarkTheme(t) ? "light" : "dark"
  };
}
var T = (colors, rest) => ({ colors, ...rest });
var BASIC = { displayFont: "Pretendard", bodyFont: "Pretendard", fontScale: "md", pattern: "none", motion: "calm", density: "normal", panels: "light" };
var PRESETS = [
  /* ---- 베이직 ---- */
  {
    id: "basic-white",
    group: "basic",
    label: "\uBCA0\uC774\uC9C1 \uD654\uC774\uD2B8",
    desc: "\uD770 \uBC14\uD0D5\uC5D0 \uAC80\uC815 \uBC84\uD2BC, \uAC00\uC7A5 \uAE30\uBCF8",
    cover: "minimal",
    theme: T(
      { primary: "#222222", accent: "#555555", bg: "#ffffff", surface: "#f5f5f5", ink: "#1a1a1a", muted: "#6b6b6b", night: "#1f1f1f", nightInk: "#fafafa" },
      { ...BASIC, radius: "soft", shadow: "none", border: "thin", button: "fill", header: "solid", headingAlign: "left", altSections: true }
    ),
    hero: { layout: "center", visual: "none" },
    variants: { why: "columns", price: "cards", footer: "detail" }
  },
  {
    id: "basic-navy",
    group: "basic",
    label: "\uB124\uC774\uBE44 \uBCA0\uC774\uC9C1",
    desc: "\uB2E8\uC815\uD55C \uB0A8\uC0C9, \uC2E0\uB8B0\uAC10 \uC788\uAC8C",
    cover: "minimal",
    theme: T(
      { primary: "#1e3a5f", accent: "#3b6ea5", bg: "#ffffff", surface: "#f4f7fb", ink: "#16202c", muted: "#5b6878", night: "#14243a", nightInk: "#f4f7fb" },
      { ...BASIC, radius: "soft", shadow: "soft", border: "thin", button: "fill", header: "solid", headingAlign: "left", altSections: true }
    ),
    hero: { layout: "split", visual: "none" },
    variants: { why: "cards", footer: "detail" }
  },
  {
    id: "basic-gray",
    group: "basic",
    label: "\uBAA8\uB178 \uADF8\uB808\uC774",
    desc: "\uD68C\uC0C9 \uD1A4, \uAC01\uC9C4 \uC120\uC73C\uB85C \uCC28\uBD84\uD558\uAC8C",
    cover: "minimal",
    theme: T(
      { primary: "#3a3f45", accent: "#6a7078", bg: "#f5f6f7", surface: "#ffffff", ink: "#1d2025", muted: "#6a7078", night: "#23272c", nightInk: "#f5f6f7" },
      { ...BASIC, density: "compact", radius: "square", shadow: "none", border: "thin", button: "outline", header: "solid", headingAlign: "left", altSections: true }
    ),
    hero: { layout: "split", visual: "none" },
    variants: { why: "numbers", price: "list" }
  },
  {
    id: "basic-blue",
    group: "basic",
    label: "\uD074\uB9B0 \uBE14\uB8E8",
    desc: "\uBC1D\uC740 \uD30C\uB791, \uC694\uC998 \uC571\uCC98\uB7FC \uC0B0\uB73B\uD558\uAC8C",
    cover: "minimal",
    theme: T(
      { primary: "#2563eb", accent: "#1d4ed8", bg: "#ffffff", surface: "#f5f8ff", ink: "#111827", muted: "#6b7280", night: "#0f1f4a", nightInk: "#f5f8ff" },
      { ...BASIC, radius: "round", shadow: "soft", border: "none", button: "fill", header: "glass", headingAlign: "left", altSections: true }
    ),
    hero: { layout: "split", visual: "none" },
    variants: { why: "cards", free: "cards" }
  },
  {
    id: "basic-mint",
    group: "basic",
    label: "\uBBFC\uD2B8 \uBCA0\uC774\uC9C1",
    desc: "\uCCAD\uB85D \uD3EC\uC778\uD2B8, \uBD80\uB4DC\uB7FD\uACE0 \uAE68\uB057\uD558\uAC8C",
    cover: "minimal",
    theme: T(
      { primary: "#1b7f67", accent: "#2a8f82", bg: "#ffffff", surface: "#f2f8f6", ink: "#17231f", muted: "#5c6b66", night: "#12352c", nightInk: "#f2f8f6" },
      { ...BASIC, radius: "round", shadow: "soft", border: "none", button: "pill", header: "glass", headingAlign: "center", altSections: true }
    ),
    hero: { layout: "center", visual: "none" },
    variants: { why: "cards" }
  },
  {
    id: "basic-beige",
    group: "basic",
    label: "\uC18C\uD504\uD2B8 \uBCA0\uC774\uC9C0",
    desc: "\uB530\uB73B\uD55C \uBCA0\uC774\uC9C0, \uD3B8\uC548\uD558\uAC8C",
    cover: "paper",
    theme: T(
      { primary: "#6b5844", accent: "#9a7d55", bg: "#faf7f2", surface: "#ffffff", ink: "#2b251f", muted: "#7a6e62", night: "#3a3028", nightInk: "#faf7f2" },
      { ...BASIC, radius: "round", shadow: "none", border: "thin", button: "pill", header: "solid", headingAlign: "center", altSections: true }
    ),
    hero: { layout: "center", visual: "none" },
    variants: { why: "columns", process: "timeline" }
  },
  {
    id: "basic-rose",
    group: "basic",
    label: "\uB85C\uC988 \uBCA0\uC774\uC9C1",
    desc: "\uC740\uC740\uD55C \uC7A5\uBC0B\uBE5B \uD3EC\uC778\uD2B8",
    cover: "minimal",
    theme: T(
      { primary: "#a84d64", accent: "#b86a7e", bg: "#fffafa", surface: "#ffffff", ink: "#2a1e22", muted: "#7d6a70", night: "#3d2530", nightInk: "#fffafa" },
      { ...BASIC, radius: "pill", shadow: "soft", border: "thin", button: "pill", header: "solid", headingAlign: "center", altSections: true }
    ),
    hero: { layout: "center", visual: "none" },
    variants: { why: "cards", reviews: "cards" }
  },
  {
    id: "basic-dark",
    group: "basic",
    label: "\uC2EC\uD50C \uB2E4\uD06C",
    desc: "\uAC80\uC740 \uBC14\uD0D5\uC5D0 \uD770 \uAE00\uC528, \uAD70\uB354\uB354\uAE30 \uC5C6\uC774",
    cover: "minimal",
    theme: T(
      { primary: "#f2f2f2", accent: "#bdbdbd", bg: "#121212", surface: "#1c1c1c", ink: "#f2f2f2", muted: "#a0a0a0", night: "#0a0a0a", nightInk: "#f2f2f2" },
      { ...BASIC, panels: "dark", radius: "soft", shadow: "none", border: "thin", button: "fill", header: "dark", headingAlign: "left", altSections: false }
    ),
    hero: { layout: "center", visual: "none" },
    variants: { why: "numbers" }
  },
  /* ---- 개성 있는 테마 ---- */
  {
    id: "moonlight",
    group: "style",
    label: "\uB2EC\uBE5B \uCABD\uBE5B",
    desc: "\uCC28\uBD84\uD55C \uCABD\uBE5B\uACFC \uB2EC\uBE5B \uAE08\uC0C9",
    cover: "night",
    theme: T(
      { primary: "#1f4e57", accent: "#a87a33", bg: "#f1f3f1", surface: "#ffffff", ink: "#16201e", muted: "#5b6663", night: "#10292f", nightInk: "#e6eeec" },
      { displayFont: "Song Myung", bodyFont: "Pretendard", fontScale: "md", radius: "soft", shadow: "soft", border: "thin", button: "fill", density: "normal", pattern: "none", header: "glass", headingAlign: "left", altSections: true, motion: "full" }
    ),
    hero: { layout: "split", visual: "moon" }
  },
  {
    id: "ink",
    group: "style",
    label: "\uBA39\uACFC \uD55C\uC9C0",
    desc: "\uBA39\uC0C9 \uAE00\uC528\uC640 \uBD89\uC740 \uB099\uAD00",
    cover: "paper",
    theme: T(
      { primary: "#1f1d1a", accent: "#b3322b", bg: "#f3efe6", surface: "#fbf8f1", ink: "#1f1d1a", muted: "#6b645a", night: "#23211d", nightInk: "#efe9dc" },
      { displayFont: "Nanum Myeongjo", bodyFont: "Gowun Batang", fontScale: "md", radius: "square", shadow: "none", border: "thin", button: "outline", density: "airy", pattern: "hanji", header: "solid", headingAlign: "center", altSections: false, motion: "calm" }
    ),
    hero: { layout: "center", visual: "elements" },
    variants: { why: "numbers", faq: "columns", price: "list" }
  },
  {
    id: "dawn",
    group: "style",
    label: "\uC0C8\uBCBD \uBCF4\uB78F\uBE5B",
    desc: "\uBCC4\uC774 \uC9C0\uB294 \uC0C8\uBCBD \uD558\uB298",
    cover: "night",
    theme: T(
      { primary: "#4b3a78", accent: "#c0875a", bg: "#f4f1f8", surface: "#ffffff", ink: "#1f1a2b", muted: "#655d75", night: "#231a3a", nightInk: "#ece6f7" },
      { displayFont: "Gowun Batang", bodyFont: "Pretendard", fontScale: "md", radius: "round", shadow: "float", border: "none", button: "pill", density: "normal", pattern: "stars", header: "glass", headingAlign: "left", altSections: true, motion: "full" }
    ),
    hero: { layout: "today", visual: "zodiac" },
    variants: { free: "cards", reviews: "bubbles" }
  },
  {
    id: "blossom",
    group: "style",
    label: "\uBC9A\uAF43 \uD3B8\uC9C0",
    desc: "\uBD84\uD64D\uBE5B \uB465\uADFC \uCE74\uB4DC",
    cover: "minimal",
    theme: T(
      { primary: "#b23a5b", accent: "#d0843c", bg: "#fbf3f4", surface: "#ffffff", ink: "#2b1d22", muted: "#7a6167", night: "#4a2233", nightInk: "#fbe9ee" },
      { displayFont: "Jua", bodyFont: "Gowun Dodum", fontScale: "md", radius: "pill", shadow: "soft", border: "none", button: "pill", density: "airy", pattern: "clouds", header: "solid", headingAlign: "center", altSections: true, motion: "full" }
    ),
    hero: { layout: "profile", visual: "none" },
    variants: { why: "cards", process: "timeline", reviews: "bubbles" }
  },
  {
    id: "celadon",
    group: "style",
    label: "\uCCAD\uC790",
    desc: "\uB9D1\uC740 \uBE44\uCDE8\uC0C9\uACFC \uB109\uB109\uD55C \uC5EC\uBC31",
    cover: "frame",
    theme: T(
      { primary: "#3d7a70", accent: "#8a6d3b", bg: "#eef4f1", surface: "#fbfdfc", ink: "#1b2a27", muted: "#5d6f6a", night: "#1e3a35", nightInk: "#e5f1ed" },
      { displayFont: "Hahmlet", bodyFont: "IBM Plex Sans KR", fontScale: "md", radius: "soft", shadow: "none", border: "thin", button: "outline", density: "airy", pattern: "waves", header: "center", headingAlign: "center", altSections: false, motion: "calm" }
    ),
    hero: { layout: "center", visual: "elements" },
    variants: { faq: "columns", why: "numbers" }
  },
  {
    id: "palace",
    group: "style",
    label: "\uD669\uAE08 \uAD81\uAD90",
    desc: "\uC5B4\uB450\uC6B4 \uB0A8\uC0C9\uACFC \uAE08\uBE5B, \uACE0\uAE09\uC2A4\uB7FD\uAC8C",
    cover: "frame",
    theme: T(
      { primary: "#d6ae5c", accent: "#e7c983", bg: "#0f1626", surface: "#172036", ink: "#eef1f7", muted: "#a4acbf", night: "#080d18", nightInk: "#f3ecd9" },
      { displayFont: "Nanum Myeongjo", bodyFont: "Noto Sans KR", fontScale: "md", radius: "square", shadow: "float", border: "thin", button: "fill", density: "normal", pattern: "stars", header: "dark", headingAlign: "center", altSections: true, motion: "full" }
    ),
    hero: { layout: "image", visual: "moon" },
    variants: { price: "table", reviews: "quote" }
  },
  {
    id: "minimal",
    group: "style",
    label: "\uBAA8\uB358 \uBBF8\uB2C8\uBA40",
    desc: "\uD770 \uBC14\uD0D5, \uAD75\uC740 \uAE00\uC528, \uAC01\uC9C4 \uC120",
    cover: "minimal",
    theme: T(
      { primary: "#111111", accent: "#3056d3", bg: "#ffffff", surface: "#f4f4f2", ink: "#111111", muted: "#666666", night: "#111111", nightInk: "#f4f4f2" },
      { displayFont: "Black Han Sans", bodyFont: "Pretendard", fontScale: "md", radius: "square", shadow: "stamp", border: "bold", button: "fill", density: "compact", pattern: "grid", header: "solid", headingAlign: "left", altSections: false, motion: "calm" }
    ),
    hero: { layout: "center", visual: "none" },
    variants: { price: "list", why: "numbers", footer: "detail" }
  },
  {
    id: "dancheong",
    group: "style",
    label: "\uB2E8\uCCAD",
    desc: "\uCCAD\xB7\uC801\xB7\uB179 \uC624\uBC29\uC0C9\uC744 \uD798 \uC788\uAC8C",
    cover: "frame",
    theme: T(
      { primary: "#1f5f8b", accent: "#c8392e", bg: "#f5f1e8", surface: "#ffffff", ink: "#1c2330", muted: "#5f6573", night: "#173a2e", nightInk: "#f3ead4" },
      { displayFont: "Do Hyeon", bodyFont: "Noto Sans KR", fontScale: "md", radius: "soft", shadow: "stamp", border: "bold", button: "fill", density: "normal", pattern: "clouds", header: "dark", headingAlign: "left", altSections: true, motion: "full" }
    ),
    hero: { layout: "split", visual: "elements" },
    variants: { why: "cards" }
  },
  {
    id: "forest",
    group: "style",
    label: "\uC232\uC18D \uC11C\uC7AC",
    desc: "\uC9D9\uC740 \uCD08\uB85D\uACFC \uB098\uBB34 \uCC45\uC7A5",
    cover: "paper",
    theme: T(
      { primary: "#2f5d3a", accent: "#a8703a", bg: "#f0ede3", surface: "#faf8f2", ink: "#1f2a1f", muted: "#636b5d", night: "#1d2b20", nightInk: "#ebe6d6" },
      { displayFont: "Gowun Batang", bodyFont: "Gowun Dodum", fontScale: "lg", radius: "round", shadow: "soft", border: "thin", button: "outline", density: "airy", pattern: "hanji", header: "glass", headingAlign: "left", altSections: true, motion: "calm" }
    ),
    hero: { layout: "profile", visual: "moon" },
    variants: { process: "timeline", reviews: "quote" }
  },
  {
    id: "sunset",
    group: "style",
    label: "\uB178\uC744",
    desc: "\uB530\uB73B\uD55C \uC8FC\uD64D\uACFC \uC190\uAE00\uC528",
    cover: "minimal",
    theme: T(
      { primary: "#b9502b", accent: "#7a3e8f", bg: "#fbf1e9", surface: "#ffffff", ink: "#2a1a14", muted: "#7a6258", night: "#3b1f1a", nightInk: "#fde9dc" },
      { displayFont: "Gaegu", bodyFont: "Pretendard", fontScale: "md", radius: "pill", shadow: "soft", border: "none", button: "pill", density: "normal", pattern: "dots", header: "solid", headingAlign: "left", altSections: true, motion: "full" }
    ),
    hero: { layout: "today", visual: "zodiac" },
    variants: { free: "cards", why: "cards" }
  },
  {
    id: "midnight",
    group: "style",
    label: "\uBC24\uD558\uB298 \uB2E4\uD06C",
    desc: "\uC644\uC804\uD788 \uC5B4\uB450\uC6B4 \uD654\uBA74\uC5D0 \uBCC4\uBE5B",
    cover: "night",
    theme: T(
      { primary: "#8fb3ff", accent: "#f1d38a", bg: "#0d1117", surface: "#161b25", ink: "#e8ecf3", muted: "#9aa4b5", night: "#05070c", nightInk: "#e8ecf3" },
      { displayFont: "Song Myung", bodyFont: "Pretendard", fontScale: "md", radius: "round", shadow: "none", border: "thin", button: "outline", density: "normal", pattern: "stars", header: "dark", headingAlign: "left", altSections: false, motion: "full" }
    ),
    hero: { layout: "today", visual: "moon" },
    variants: { reviews: "quote" }
  },
  {
    id: "candy",
    group: "style",
    label: "\uD30C\uC2A4\uD154 \uCE94\uB514",
    desc: "\uBCF4\uB77C\xB7\uBD84\uD64D, \uD1B5\uD1B5 \uD280\uAC8C",
    cover: "minimal",
    theme: T(
      { primary: "#6a5ae0", accent: "#e0607e", bg: "#fdf7ff", surface: "#ffffff", ink: "#2a2540", muted: "#6f6a85", night: "#3a2f6b", nightInk: "#f4efff" },
      { displayFont: "Dongle", bodyFont: "Gowun Dodum", fontScale: "md", radius: "pill", shadow: "stamp", border: "bold", button: "pill", density: "airy", pattern: "dots", header: "glass", headingAlign: "center", altSections: true, motion: "full" }
    ),
    hero: { layout: "center", visual: "zodiac" },
    variants: { free: "cards", why: "cards", reviews: "bubbles" }
  },
  {
    id: "letter",
    group: "style",
    label: "\uC190\uD3B8\uC9C0",
    desc: "\uC904 \uB178\uD2B8 \uC704\uC5D0 \uD39C\uC73C\uB85C \uC4F4 \uB290\uB08C",
    cover: "paper",
    theme: T(
      { primary: "#3b4a6b", accent: "#c06c4a", bg: "#f7f3ea", surface: "#fffdf8", ink: "#2c2a26", muted: "#6e685e", night: "#2f3547", nightInk: "#f3efe4" },
      { displayFont: "Nanum Pen Script", bodyFont: "Gowun Batang", fontScale: "lg", radius: "soft", shadow: "soft", border: "thin", button: "underline", density: "airy", pattern: "lines", header: "center", headingAlign: "center", altSections: false, motion: "calm" }
    ),
    hero: { layout: "profile", visual: "none" },
    variants: { process: "timeline", faq: "columns", reviews: "quote" }
  }
];
var MOONLIGHT = PRESETS.find((p) => p.id === "moonlight");
var DEFAULT_SITE = {
  version: 1,
  brand: { name: "\uB8E8\uC6D4\uB2F9", tagline: "\uB2EC\uBE5B \uC544\uB798 \uC0AC\uC8FC\uB97C \uC77D\uB294 \uC9D1", logoImage: "", symbol: "moon" },
  contact: { ceo: "", bizNo: "", ecommerceNo: "", email: "", phone: "", address: "", kakao: "", instagram: "", threads: "", blog: "", youtube: "" },
  theme: { preset: "moonlight", panels: "dark", ...MOONLIGHT.theme },
  hero: {
    layout: "split",
    visual: "moon",
    eyebrow: "{\uBE0C\uB79C\uB4DC} \xB7 {\uD55C\uC904\uC18C\uAC1C}",
    title: "\uC0AC\uC8FC\uB294 \uC810\uC774 \uC544\uB2C8\uB77C\n*\uB098\uB97C \uC77D\uB294 \uC9C0\uB3C4*\uC608\uC694",
    lede: "\uD0DC\uC5B4\uB09C \uD574\xB7\uB2EC\xB7\uB0A0\xB7\uC2DC\uAC04\uC758 \uB124 \uAE30\uB465\uC744 \uC9C0\uAE08 \uBB34\uB8CC\uB85C \uD3BC\uCCD0\uBCF4\uC138\uC694. \uB354 \uC54C\uACE0 \uC2F6\uC5B4\uC9C0\uBA74, \uD55C \uC0AC\uB78C\uC758 \uC774\uC57C\uAE30\uB85C \uB05D\uAE4C\uC9C0 \uC774\uC5B4\uC9C0\uB294 30\uCABD \uB9AC\uD3EC\uD2B8\uB85C \uBC1B\uC544\uBCF4\uC2E4 \uC218 \uC788\uC5B4\uC694.",
    ctaPrimary: "\uBB34\uB8CC\uB85C \uB0B4 \uC0AC\uC8FC \uBCF4\uAE30",
    ctaSecondary: "\uBC14\uB85C 30\uCABD \uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD",
    image: "",
    proof: ["30\uCABD PDF \uB9AC\uD3EC\uD2B8", "\uD55C\uC790 0\uC790, \uC26C\uC6B4 \uD480\uC774", "\uD0DC\uC5B4\uB09C \uC9C0\uC5ED\uAE4C\uC9C0 \uC2DC\uAC01 \uBCF4\uC815"],
    showToday: true
  },
  sections: ["free", "about", "why", "report", "compare", "price", "process", "reviews", "faq", "final"].map((id) => ({ id, on: id !== "about" })),
  variants: { free: "tabs", why: "columns", price: "cards", process: "row", reviews: "cards", faq: "accordion", footer: "simple" },
  copy: {
    free: { eyebrow: "\uBB34\uB8CC \uCCB4\uD5D8", title: "\uC124\uBA85\uBCF4\uB2E4 \uBA3C\uC800, \uB0B4 \uC0AC\uC8FC\uBD80\uD130 \uD3BC\uCCD0\uBCF4\uC138\uC694", sub: "\uD68C\uC6D0\uAC00\uC785 \uC5C6\uC774 \uBC14\uB85C \uACB0\uACFC\uAC00 \uB098\uC640\uC694. \uC785\uB825\uD55C \uC815\uBCF4\uB294 \uC774 \uAE30\uAE30\uC5D0\uB9CC \uC7A0\uC2DC \uC800\uC7A5\uB3FC\uC694." },
    about: { eyebrow: "\uC0C1\uB2F4\uAC00 \uC18C\uAC1C", title: "\uC548\uB155\uD558\uC138\uC694, {\uBE0C\uB79C\uB4DC}\uC785\uB2C8\uB2E4", sub: "" },
    why: { eyebrow: "\uC65C {\uBE0C\uB79C\uB4DC}\uC778\uAC00", title: "\uAC19\uC740 \uC0DD\uC77C\uB3C4, \uC77D\uB294 \uBC29\uBC95\uC5D0 \uB530\uB77C \uB2E4\uB978 \uC774\uC57C\uAE30\uAC00 \uB3FC\uC694", sub: "" },
    report: { eyebrow: "\uB9AC\uD3EC\uD2B8 \uBBF8\uB9AC\uBCF4\uAE30", title: "\uC774\uB7F0 \uB9AC\uD3EC\uD2B8\uB97C \uBC1B\uAC8C \uB3FC\uC694", sub: "\uD45C 5\uCABD\uC73C\uB85C \uC0AC\uC8FC\uC758 \uBF08\uB300\uB97C \uBA3C\uC800 \uBCF4\uC5EC\uB4DC\uB9AC\uACE0, 6\uCABD\uBD80\uD130 \uD480\uC774\uAC00 \uC2DC\uC791\uB3FC\uC694." },
    compare: { eyebrow: "\uBB34\uB8CC\uC640 \uB9AC\uD3EC\uD2B8\uC758 \uCC28\uC774", title: "\uBB34\uB8CC\uB85C\uB294 \uC785\uAD6C\uAE4C\uC9C0, \uB9AC\uD3EC\uD2B8\uB85C\uB294 \uB05D\uAE4C\uC9C0", sub: "" },
    price: { eyebrow: "\uC0C1\uD488\uACFC \uAC00\uACA9", title: "\uD544\uC694\uD55C \uB9CC\uD07C \uACE8\uB77C\uC8FC\uC138\uC694", sub: "\uBAA8\uB4E0 \uB9AC\uD3EC\uD2B8\uB294 \uAC19\uC740 30\uCABD \uAD6C\uC131\uC774\uC5D0\uC694. \uAD81\uD569\uC744 \uB354\uD558\uBA74 12\uCABD \uBCC4\uCC45\uC774 \uD568\uAED8 \uAC00\uC694." },
    process: { eyebrow: "\uC9C4\uD589 \uACFC\uC815", title: "\uC2E0\uCCAD\uBD80\uD130 \uBC1B\uAE30\uAE4C\uC9C0", sub: "" },
    reviews: { eyebrow: "\uD6C4\uAE30", title: "\uBA3C\uC800 \uBC1B\uC544\uBCF8 \uBD84\uB4E4\uC758 \uC774\uC57C\uAE30", sub: "" },
    faq: { eyebrow: "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38", title: "\uC2E0\uCCAD \uC804\uC5D0 \uAD81\uAE08\uD55C \uAC83\uB4E4", sub: "" },
    final: { eyebrow: "30\uCABD \uC885\uD569\uC0AC\uC8FC", title: "", sub: "" }
  },
  about: { photo: "", name: "", role: "\uC0AC\uC8FC \uC0C1\uB2F4\uAC00", greeting: "\uD0DC\uC5B4\uB09C \uC21C\uAC04\uC758 \uAE30\uC6B4\uC744 \uC5B4\uB824\uC6B4 \uB9D0 \uC5C6\uC774 \uD480\uC5B4\uB4DC\uB9AC\uACE0 \uC788\uC5B4\uC694. \uC0AC\uC8FC\uB294 \uC815\uD574\uC9C4 \uC6B4\uBA85\uC774 \uC544\uB2C8\uB77C, \uB098\uB97C \uB354 \uC798 \uC4F0\uAE30 \uC704\uD55C \uC124\uBA85\uC11C\uB77C\uACE0 \uBBFF\uC5B4\uC694.", career: [] },
  why: [
    { fig: "\u221224\uBD84", title: "\uD0DC\uC5B4\uB09C \uACF3\uC758 \uD574 \uC2DC\uAC01\uAE4C\uC9C0", body: "\uBD80\uC0B0\uC5D0\uC11C \uC624\uC804 7\uC2DC\uC5D0 \uD0DC\uC5B4\uB0AC\uB2E4\uBA74 \uC2E4\uC81C \uD574\uC758 \uC2DC\uAC01\uC740 \uC57D 24\uBD84 \uB2A6\uC5B4\uC694. \uC9C0\uC5ED\uACFC \uC5F0\uB3C4\uBCC4 \uAE30\uC900\uC744 \uBC18\uC601\uD574 \uC2DC\uAC04 \uAE30\uB465\uC744 \uB9DE\uCDA5\uB2C8\uB2E4." },
    { fig: "30\uCABD", title: "\uB05D\uAE4C\uC9C0 \uC774\uC5B4\uC9C0\uB294 \uD55C \uC0AC\uB78C\uC758 \uC774\uC57C\uAE30", body: "\uD56D\uBAA9\uC744 \uB098\uC5F4\uD558\uC9C0 \uC54A\uC544\uC694. \uCCAB \uC7A5\uC758 \uD55C \uBB38\uC7A5\uC5D0\uC11C \uC2DC\uC791\uD574 \uC131\uACA9, \uC77C, \uB3C8, \uC0AC\uB791, \uC2DC\uAC04\uC758 \uD750\uB984\uC744 \uAC70\uCCD0 \uB9C8\uC9C0\uB9C9 \uD3B8\uC9C0\uB85C \uB3CC\uC544\uC635\uB2C8\uB2E4." },
    { fig: "0\uC790", title: "\uD55C\uC790 \uC5C6\uC774, \uC6A9\uC5B4\uB294 \uBC14\uB85C \uD480\uC5B4\uC11C", body: "\uAF2D \uD544\uC694\uD55C \uC6A9\uC5B4\uB9CC \uC4F0\uACE0, \uCC98\uC74C \uB098\uC624\uB294 \uC21C\uAC04 \uBB34\uC2A8 \uB73B\uC778\uC9C0 \uD480\uC5B4\uB4DC\uB824\uC694. \uC0AC\uC8FC\uB97C \uCC98\uC74C \uBCF4\uB294 \uBD84\uB3C4 \uB05D\uAE4C\uC9C0 \uC77D\uC744 \uC218 \uC788\uC5B4\uC694." }
  ],
  process: [
    { time: "3\uBD84", title: "\uC2E0\uCCAD\uC11C \uC791\uC131", body: "\uC0DD\uB144\uC6D4\uC77C\uC2DC, \uD0DC\uC5B4\uB09C \uC9C0\uC5ED, \uC5F0\uB77D\uCC98\uB97C \uC785\uB825\uD574\uC694." },
    { time: "\uC548\uB0B4 \uACC4\uC88C\uB85C", title: "\uC785\uAE08", body: "\uC785\uAE08\uC774 \uD655\uC778\uB418\uBA74 \uBB38\uC790\uC640 \uC774\uBA54\uC77C\uB85C \uC54C\uB824\uB4DC\uB824\uC694." },
    { time: "\uC815\uBC00 \uACC4\uC0B0 \uD6C4", title: "\uD480\uC774 \uC791\uC131", body: "\uB9CC\uC138\uB825 \uACC4\uC0B0\uC744 \uBC14\uD0D5\uC73C\uB85C 30\uCABD \uD480\uC774\uB97C \uC4F0\uACE0 \uAC80\uC218\uD574\uC694." },
    { time: "\uD558\uB8E8 \uC548\uC5D0", title: "\uC774\uBA54\uC77C\uB85C \uB3C4\uCC29", body: "PDF\uB85C \uC800\uC7A5\uD574 \uB450\uACE0 \uD544\uC694\uD560 \uB54C\uB9C8\uB2E4 \uB2E4\uC2DC \uD3B4\uBCF4\uC138\uC694." }
  ],
  reviews: [],
  faq: [
    { q: "\uD0DC\uC5B4\uB09C \uC2DC\uAC04\uC744 \uBAB0\uB77C\uB3C4 \uC2E0\uCCAD\uD560 \uC218 \uC788\uB098\uC694?", a: "\uB124. \uC2DC\uAC04\uC744 \uBAA8\uB974\uBA74 \uC2DC\uAC04 \uAE30\uB465\uC744 \uBE80 \uC138 \uAE30\uB465\uC73C\uB85C \uD480\uC774\uD574\uC694. \uC131\uACA9\uACFC \uD070 \uD750\uB984\uC740 \uCDA9\uBD84\uD788 \uC77D\uC744 \uC218 \uC788\uACE0, \uB9AC\uD3EC\uD2B8 \uCCAB\uBA38\uB9AC\uC5D0 \uC5B4\uB5A4 \uBD80\uBD84\uC774 \uB2EC\uB77C\uC9C8 \uC218 \uC788\uB294\uC9C0 \uD568\uAED8 \uC801\uC5B4\uB4DC\uB824\uC694." },
    { q: "\uC74C\uB825 \uC0DD\uC77C\uB9CC \uC54C\uC544\uC694.", a: "\uC2E0\uCCAD\uC11C\uC5D0\uC11C \uC74C\uB825\uC744 \uACE0\uB974\uACE0 \uC724\uB2EC \uC5EC\uBD80\uB9CC \uCCB4\uD06C\uD574\uC8FC\uC138\uC694. \uC591\uB825 \uBCC0\uD658\uACFC \uC808\uAE30 \uACC4\uC0B0\uC740 \uB9CC\uC138\uB825\uC774 \uCC98\uB9AC\uD574\uC694." },
    { q: "\uD0DC\uC5B4\uB09C \uC9C0\uC5ED\uC740 \uC65C \uBB3C\uC5B4\uBCF4\uB098\uC694?", a: "\uAC19\uC740 \uC624\uC804 7\uC2DC\uB77C\uB3C4 \uC11C\uC6B8\uACFC \uBD80\uC0B0\uC740 \uC2E4\uC81C \uD574\uC758 \uC704\uCE58\uAC00 \uB2EC\uB77C\uC694. \uD0DC\uC5B4\uB09C \uC9C0\uC5ED\uC758 \uACBD\uB3C4\uB85C \uCD9C\uC0DD \uC2DC\uAC01\uC744 \uBA87 \uBD84 \uB2E8\uC704\uAE4C\uC9C0 \uBCF4\uC815\uD574\uC57C \uC2DC\uAC04 \uAE30\uB465\uC774 \uC815\uD655\uD574\uC838\uC694." },
    { q: "\uC5B8\uC81C \uBC1B\uC744 \uC218 \uC788\uB098\uC694?", a: "\uC785\uAE08\uC774 \uD655\uC778\uB418\uBA74 \uD480\uC774 \uC791\uC131\uC744 \uC2DC\uC791\uD558\uACE0, \uC791\uC131\uC774 \uB05D\uB098\uBA74 \uAC80\uC218\uB97C \uAC70\uCCD0 \uC774\uBA54\uC77C\uB85C PDF\uB97C \uBCF4\uB0B4\uB4DC\uB824\uC694. \uBCF4\uD1B5 \uC785\uAE08 \uD655\uC778 \uD6C4 \uD558\uB8E8 \uC548\uC5D0 \uB3C4\uCC29\uD574\uC694." },
    { q: "\uC81C \uC815\uBCF4\uB294 \uC5B4\uB5BB\uAC8C \uAD00\uB9AC\uB418\uB098\uC694?", a: "\uC0DD\uB144\uC6D4\uC77C\uC2DC\uC640 \uC5F0\uB77D\uCC98\uB294 \uB9AC\uD3EC\uD2B8 \uC791\uC131\uACFC \uBC1C\uC1A1\uC5D0\uB9CC \uC4F0\uACE0, \uBC1C\uC1A1 \uD6C4 1\uB144\uC774 \uC9C0\uB098\uBA74 \uC0AD\uC81C\uD574\uC694. \uC678\uBD80\uC5D0 \uACF5\uC720\uD558\uC9C0 \uC54A\uC544\uC694." },
    { q: "\uD658\uBD88\uC774 \uB418\uB098\uC694?", a: "\uD480\uC774 \uC791\uC131\uC744 \uC2DC\uC791\uD558\uAE30 \uC804\uC5D0\uB294 \uC804\uC561 \uD658\uBD88\uD574\uB4DC\uB824\uC694. \uC791\uC131\uC774 \uC2DC\uC791\uB41C \uB4A4\uC5D0\uB294 \uD55C \uC0AC\uB78C\uC744 \uC704\uD574 \uB9CC\uB4DC\uB294 \uCF58\uD150\uCE20\uB77C \uD658\uBD88\uC774 \uC5B4\uB824\uC6CC\uC694." }
  ],
  final: { title: "\uD754\uB4E4\uB9B4 \uB54C\uB9C8\uB2E4 \uB2E4\uC2DC \uD3B4\uBCF4\uB294, \uB098\uC5D0 \uB300\uD55C \uD55C \uAD8C", sub: "\uC624\uB298 \uC2E0\uCCAD\uD558\uBA74 \uB098\uC758 \uC55E\uC73C\uB85C 12\uAC1C\uC6D4\uC744 \uBBF8\uB9AC \uC77D\uC5B4\uBCFC \uC218 \uC788\uC5B4\uC694.", cta: "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD\uD558\uAE30" },
  banner: { on: false, text: "\uC624\uD508 \uAE30\uB150 \uCCAB \uC2E0\uCCAD 10% \uD560\uC778", link: "/apply", start: "", end: "", style: "accent" },
  stickyCta: { on: true, text: "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD\uD558\uAE30" },
  products: {
    single: { name: "\uC885\uD569\uC0AC\uC8FC", price: 35e3, pitch: "\uB098\uB97C \uCC98\uC74C\uBD80\uD130 \uB05D\uAE4C\uC9C0 \uD55C \uAD8C\uC73C\uB85C", badge: "\uCC98\uC74C\uC774\uB77C\uBA74", visible: true },
    double: { name: "2\uC778 \uC885\uD569\uC0AC\uC8FC", price: 5e4, pitch: "\uAC00\uC871\xB7\uCE5C\uAD6C\uC640 \uD568\uAED8, \uD55C \uAD8C\uC529", badge: "", visible: true },
    "single-love": { name: "\uC885\uD569\uC0AC\uC8FC + \uC5F0\uC778\uAD81\uD569", price: 55e3, pitch: "\uB098\uB97C \uC54C\uACE0, \uC6B0\uB9AC\uB97C \uC54C\uACE0", badge: "", visible: true },
    "double-love": { name: "2\uC778 \uC885\uD569\uC0AC\uC8FC + \uC5F0\uC778\uAD81\uD569", price: 7e4, pitch: "\uB450 \uC0AC\uB78C \uBAA8\uB450\uC758 \uC774\uC57C\uAE30\uC640 \uB458\uC758 \uC774\uC57C\uAE30", badge: "", visible: true }
  },
  report: { cover: "night", signature: "{\uBE0C\uB79C\uB4DC}", coverImage: "", coverText: true },
  extras: { luckyCard: true, calendar: true }
};
function deepMerge(base, over) {
  if (over === void 0 || over === null) return base;
  if (Array.isArray(base)) return Array.isArray(over) ? over : base;
  if (typeof base === "object" && base !== null) {
    if (typeof over !== "object" || Array.isArray(over)) return base;
    const out = { ...base };
    for (const k of Object.keys(base)) out[k] = deepMerge(base[k], over[k]);
    return out;
  }
  return typeof over === typeof base ? over : base;
}
function normalizeSite(raw) {
  const cfg = deepMerge(DEFAULT_SITE, raw);
  const ids = DEFAULT_SITE.sections.map((s) => s.id);
  const seen = /* @__PURE__ */ new Set();
  cfg.sections = cfg.sections.filter((s) => ids.includes(s.id) && !seen.has(s.id) && seen.add(s.id));
  for (const id of ids) if (!seen.has(id)) cfg.sections.push({ id, on: false });
  return cfg;
}
function fill(text, cfg) {
  return text.replaceAll("{\uBE0C\uB79C\uB4DC}", cfg.brand.name).replaceAll("{\uD55C\uC904\uC18C\uAC1C}", cfg.brand.tagline);
}
function bannerActive(cfg, now = /* @__PURE__ */ new Date()) {
  const b = cfg.banner;
  if (!b.on || !b.text.trim()) return false;
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  if (b.start && day < b.start) return false;
  if (b.end && day > b.end) return false;
  return true;
}

// components/site/SiteTheme.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime());
function SiteTheme({ config, children, className = "", as = "div" }) {
  const Tag = as;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, { className: `site ${className}`, style: themeVars(config.theme), ...themeAttrs(config.theme), children: [
    fontHrefs(config.theme).map((href) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", { rel: "stylesheet", href, precedence: "default" }, href)),
    children
  ] });
}

// components/MoonCanvas.tsx
var import_react = __toESM(require_react());

// lib/moon.ts
var SYNODIC = 29.530588853;
var KNOWN_NEW_MOON = Date.UTC(2e3, 0, 6, 18, 14);
function moonInfo(date = /* @__PURE__ */ new Date()) {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 864e5;
  const age = (days % SYNODIC + SYNODIC) % SYNODIC;
  const phase = age / SYNODIC;
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
  const waxing = phase < 0.5;
  let name = "\uADF8\uBBD0\uB2EC";
  if (age < 1.5 || age > SYNODIC - 1.5) name = "\uC0AD (\uB2EC\uC774 \uC228\uC740 \uB0A0)";
  else if (age < 6.4) name = "\uCD08\uC2B9\uB2EC";
  else if (age < 8.4) name = "\uC0C1\uD604\uB2EC";
  else if (age < 13.8) name = "\uCC28\uC624\uB974\uB294 \uB2EC";
  else if (age < 15.8) name = "\uBCF4\uB984\uB2EC";
  else if (age < 21.1) name = "\uAE30\uC6B0\uB294 \uB2EC";
  else if (age < 23.1) name = "\uD558\uD604\uB2EC";
  return { age, phase, illumination, waxing, name };
}

// components/MoonCanvas.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
function MoonCanvas({ className }) {
  const ref = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const { phase } = moonInfo();
    const c = size / 2;
    const r = size * 0.3;
    const stars2 = Array.from({ length: 40 }, (_, i) => {
      const a = Math.sin(i * 12.9898) * 43758.5453;
      const b = Math.sin(i * 78.233) * 12345.6789;
      return { x: (a - Math.floor(a)) * size, y: (b - Math.floor(b)) * size, s: (a * b % 1 + 1) % 1 };
    });
    let raf = 0;
    const draw = (t) => {
      ctx.clearRect(0, 0, size, size);
      for (const st of stars2) {
        const tw = reduce ? 0.6 : 0.35 + 0.35 * Math.sin(t / 900 + st.s * 20);
        ctx.fillStyle = `rgba(230, 238, 236, ${tw * 0.7})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, 0.6 + st.s, 0, Math.PI * 2);
        ctx.fill();
      }
      const glow = ctx.createRadialGradient(c, c, r * 0.9, c, c, r * 1.9);
      glow.addColorStop(0, "rgba(241, 228, 191, 0.22)");
      glow.addColorStop(1, "rgba(241, 228, 191, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c, c, r * 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(230, 238, 236, 0.07)";
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();
      const waxing = phase < 0.5;
      const k = Math.cos(phase * 2 * Math.PI);
      ctx.fillStyle = "#f1e4bf";
      ctx.beginPath();
      ctx.arc(c, c, r, -Math.PI / 2, Math.PI / 2, !waxing);
      ctx.ellipse(c, c, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, waxing ? k > 0 : k < 0);
      ctx.closePath();
      ctx.fill();
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("canvas", { ref, className, "aria-hidden": "true" });
}

// rwbundle/shims/next-link.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
function Link({ href, children, prefetch: _prefetch, scroll: _scroll, ...rest }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("a", { href, ...rest, children });
}

// components/QuickStart.tsx
var import_react2 = __toESM(require_react());
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
function QuickStart({ primary = "\uBB34\uB8CC\uB85C \uB0B4 \uC0AC\uC8FC \uBCF4\uAE30", secondary = "\uBC14\uB85C 30\uCABD \uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD", base = "" }) {
  const [date, setDate] = (0, import_react2.useState)("");
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "form",
    {
      className: "quick",
      onSubmit: (e) => {
        e.preventDefault();
        if (!date) return;
        try {
          const prev = JSON.parse(sessionStorage.getItem("rw_birth") || "{}");
          sessionStorage.setItem("rw_birth", JSON.stringify({ ...prev, date }));
        } catch {
        }
        window.dispatchEvent(new CustomEvent("rw:quick", { detail: date }));
        document.getElementById("free")?.scrollIntoView({ behavior: "smooth" });
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { className: "quick-label", htmlFor: "quick-date", children: "\uC0DD\uB144\uC6D4\uC77C\uB9CC \uB123\uC73C\uBA74 \uBC14\uB85C \uD3BC\uCCD0\uC838\uC694" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "quick-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { id: "quick-date", className: "input", type: "date", min: "1920-01-01", value: date, onChange: (e) => setDate(e.target.value), required: true }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "btn btn-primary", type: "submit", children: primary })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "quick-foot", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "\uD68C\uC6D0\uAC00\uC785 \uC5C6\uC774 \uBB34\uB8CC" }),
          secondary && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Link, { href: `${base}/apply`, children: [
            secondary,
            " \u2192"
          ] })
        ] })
      ]
    }
  );
}

// components/site/Chrome.tsx
var import_react3 = __toESM(require_react());

// lib/paths.ts
var siteHref = (cfg, path) => (cfg.base ?? "") + path;
var userHref = (cfg, href) => href.startsWith("/") ? siteHref(cfg, href) : href;

// components/site/Chrome.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
function BrandMark({ cfg, size = 26 }) {
  if (cfg.brand.logoImage) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("img", { src: cfg.brand.logoImage, alt: "", className: "brand-logo", style: { height: size } });
  }
  if (cfg.brand.symbol === "none") return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: `brand-mark sym-${cfg.brand.symbol}`, style: { width: size, height: size, fontSize: size * 0.58 }, "aria-hidden": "true", children: cfg.brand.symbol === "seal" ? cfg.brand.name.slice(0, 1) : null });
}
function SiteHeader({ cfg }) {
  const [scrolled, setScrolled] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    const on2 = () => setScrolled(window.scrollY > 8);
    on2();
    window.addEventListener("scroll", on2, { passive: true });
    return () => window.removeEventListener("scroll", on2);
  }, []);
  const on = (id) => cfg.sections.some((s) => s.id === id && s.on);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("header", { className: `site-header ${scrolled ? "scrolled" : ""}`, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Link, { href: siteHref(cfg, "/"), className: "brand", "aria-label": `${cfg.brand.name} \uD648`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BrandMark, { cfg }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "brand-name", children: cfg.brand.name })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("nav", { className: "site-nav", "aria-label": "\uC8FC\uC694 \uBA54\uB274", children: [
      on("free") && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/#free"), children: "\uBB34\uB8CC \uCCB4\uD5D8" }),
      on("about") && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/#about"), children: "\uC18C\uAC1C" }),
      on("report") && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/#report"), children: "\uB9AC\uD3EC\uD2B8" }),
      on("price") && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/#price"), children: "\uAC00\uACA9" }),
      on("faq") && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/#faq"), children: "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/apply"), className: "btn btn-primary btn-sm", children: "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD" })
  ] }) });
}
function Banner({ cfg }) {
  const key = `rw_banner_${cfg.banner.text}`;
  const [hidden, setHidden] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    try {
      setHidden(localStorage.getItem(key) === "1");
    } catch {
    }
  }, [key]);
  if (!bannerActive(cfg) || hidden) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: `site-banner banner-${cfg.banner.style}`, role: "region", "aria-label": "\uACF5\uC9C0", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "container", children: [
    cfg.banner.link ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Link, { href: userHref(cfg, cfg.banner.link), children: [
      fill(cfg.banner.text, cfg),
      " \u2192"
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: fill(cfg.banner.text, cfg) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", "aria-label": "\uACF5\uC9C0 \uB2EB\uAE30", onClick: () => {
      setHidden(true);
      try {
        localStorage.setItem(key, "1");
      } catch {
      }
    }, children: "\xD7" })
  ] }) });
}
var SNS = [["instagram", "\uC778\uC2A4\uD0C0\uADF8\uB7A8"], ["threads", "\uC2A4\uB808\uB4DC"], ["kakao", "\uCE74\uCE74\uC624\uD1A1 \uCC44\uB110"], ["blog", "\uBE14\uB85C\uADF8"], ["youtube", "\uC720\uD29C\uBE0C"]];
function SiteFooter({ cfg }) {
  const c = cfg.contact;
  const bizParts = [
    c.ceo && `\uB300\uD45C ${c.ceo}`,
    c.bizNo && `\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 ${c.bizNo}`,
    c.ecommerceNo && `\uD1B5\uC2E0\uD310\uB9E4\uC5C5 \uC2E0\uACE0 ${c.ecommerceNo}`,
    c.address
  ].filter(Boolean);
  const business = bizParts.length ? [`\uC0C1\uD638 ${cfg.brand.name}`, ...bizParts].join(" \xB7 ") : "";
  const contactText = [c.email, c.phone].filter(Boolean).join(" \xB7 ");
  const sns = SNS.filter(([k]) => c[k]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("footer", { className: `site-footer footer-${cfg.variants.footer}`, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "footer-top", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Link, { href: siteHref(cfg, "/"), className: "brand", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BrandMark, { cfg }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "brand-name", children: cfg.brand.name })
      ] }),
      cfg.variants.footer === "detail" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "footer-tagline", children: cfg.brand.tagline })
    ] }),
    cfg.variants.footer === "detail" && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "footer-cols", children: [
      (c.email || c.phone) && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: "\uBB38\uC758" }),
        c.email && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: c.email }),
        c.phone && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: c.phone })
      ] }),
      sns.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: "\uC18C\uC2DD" }),
        sns.map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("a", { href: c[k], target: "_blank", rel: "noreferrer", children: label }, k))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("b", { children: "\uBC14\uB85C\uAC00\uAE30" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/apply"), children: "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/#faq"), children: "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("nav", { "aria-label": "\uC815\uCC45", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/policy#privacy"), children: "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/policy#refund"), children: "\uD658\uBD88 \uADDC\uC815" }),
      cfg.variants.footer === "simple" && sns.map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("a", { href: c[k], target: "_blank", rel: "noreferrer", children: label }, k)),
      !cfg.base && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: "/admin", children: "\uAD00\uB9AC\uC790" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "footer-biz", children: [
      business && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
        business,
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("br", {})
      ] }),
      cfg.variants.footer === "simple" && contactText && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
        "\uBB38\uC758 ",
        contactText,
        " \xB7 "
      ] }),
      "\uC0AC\uC8FC \uD480\uC774\uB294 \uC0B6\uC758 \uBC29\uD5A5\uC744 \uCC38\uACE0\uD558\uB294 \uCF58\uD150\uCE20\uC608\uC694."
    ] })
  ] }) });
}
function StickyCta({ cfg, minPrice }) {
  if (!cfg.stickyCta.on) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "sticky-cta", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("small", { children: [
      "30\uCABD \uB9AC\uD3EC\uD2B8",
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("br", {}),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("b", { className: "num", children: [
        minPrice.toLocaleString("ko-KR"),
        "\uC6D0\uBD80\uD130"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link, { href: siteHref(cfg, "/apply"), className: "btn btn-primary", children: cfg.stickyCta.text || "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD\uD558\uAE30" })
  ] });
}

// lib/ganji.ts
var GAN = ["\uAC11", "\uC744", "\uBCD1", "\uC815", "\uBB34", "\uAE30", "\uACBD", "\uC2E0", "\uC784", "\uACC4"];
var JI = ["\uC790", "\uCD95", "\uC778", "\uBB18", "\uC9C4", "\uC0AC", "\uC624", "\uBBF8", "\uC2E0", "\uC720", "\uC220", "\uD574"];
var ANIMAL = ["\uC950", "\uC18C", "\uD638\uB791\uC774", "\uD1A0\uB07C", "\uC6A9", "\uBC40", "\uB9D0", "\uC591", "\uC6D0\uC22D\uC774", "\uB2ED", "\uAC1C", "\uB3FC\uC9C0"];
var ELS = ["\uBAA9", "\uD654", "\uD1A0", "\uAE08", "\uC218"];
var GAN_EL = ["\uBAA9", "\uBAA9", "\uD654", "\uD654", "\uD1A0", "\uD1A0", "\uAE08", "\uAE08", "\uC218", "\uC218"];
var JI_EL = ["\uC218", "\uD1A0", "\uBAA9", "\uBAA9", "\uD1A0", "\uD654", "\uD654", "\uD1A0", "\uAE08", "\uAE08", "\uD1A0", "\uC218"];
var GAN_YANG = (i) => i % 2 === 0;
var EL_PLAIN = { \uBAA9: "\uB098\uBB34", \uD654: "\uBD88", \uD1A0: "\uD759", \uAE08: "\uC1E0", \uC218: "\uBB3C" };
var EL_COLOR_NAME = { \uBAA9: "\uCD08\uB85D", \uD654: "\uBE68\uAC15", \uD1A0: "\uB178\uB791", \uAE08: "\uD770\uC0C9", \uC218: "\uAC80\uC815\xB7\uB0A8\uC0C9" };
var EL_DIRECTION = { \uBAA9: "\uB3D9\uCABD", \uD654: "\uB0A8\uCABD", \uD1A0: "\uAC00\uC6B4\uB370", \uAE08: "\uC11C\uCABD", \uC218: "\uBD81\uCABD" };
var EL_NUMBERS = { \uBAA9: [3, 8], \uD654: [2, 7], \uD1A0: [5, 10], \uAE08: [4, 9], \uC218: [1, 6] };
var HOUR_RANGE = ["\uBC24 11\uC2DC\u2013\uC0C8\uBCBD 1\uC2DC", "\uC0C8\uBCBD 1\u20133\uC2DC", "\uC0C8\uBCBD 3\u20135\uC2DC", "\uC544\uCE68 5\u20137\uC2DC", "\uC544\uCE68 7\u20139\uC2DC", "\uC624\uC804 9\u201311\uC2DC", "\uC624\uC804 11\uC2DC\u2013\uC624\uD6C4 1\uC2DC", "\uC624\uD6C4 1\u20133\uC2DC", "\uC624\uD6C4 3\u20135\uC2DC", "\uC800\uB141 5\u20137\uC2DC", "\uC800\uB141 7\u20139\uC2DC", "\uBC24 9\u201311\uC2DC"];
var SAENG = { \uBAA9: "\uD654", \uD654: "\uD1A0", \uD1A0: "\uAE08", \uAE08: "\uC218", \uC218: "\uBAA9" };
var GEUK = { \uBAA9: "\uD1A0", \uD1A0: "\uC218", \uC218: "\uD654", \uD654: "\uAE08", \uAE08: "\uBAA9" };
var SAENG_ME = { \uD654: "\uBAA9", \uD1A0: "\uD654", \uAE08: "\uD1A0", \uC218: "\uAE08", \uBAA9: "\uC218" };
function ganji(idx) {
  const i = (idx % 60 + 60) % 60;
  return { idx: i, gan: i % 10, ji: i % 12, name: GAN[i % 10] + JI[i % 12] };
}
function ganjiFromParts(gan, ji) {
  for (let i = 0; i < 60; i++) if (i % 10 === gan && i % 12 === ji) return i;
  return -1;
}
var ANCHOR_UTC = Date.UTC(2026, 7, 20);
var ANCHOR_IDX = 2;
function dayGanji(y, m, d) {
  const days = Math.round((Date.UTC(y, m - 1, d) - ANCHOR_UTC) / 864e5);
  return ganji(ANCHOR_IDX + days);
}
function yearGanji(solarYear) {
  return ganji(solarYear - 4);
}
function todayKST(now = /* @__PURE__ */ new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const wk = { Sun: "\uC77C", Mon: "\uC6D4", Tue: "\uD654", Wed: "\uC218", Thu: "\uBAA9", Fri: "\uAE08", Sat: "\uD1A0" };
  return { y: +parts.year, m: +parts.month, d: +parts.day, weekday: wk[parts.weekday] ?? "" };
}
function relationOf(me, other) {
  if (me === other) return "same";
  if (SAENG[me] === other) return "output";
  if (GEUK[me] === other) return "wealth";
  if (GEUK[other] === me) return "power";
  return "support";
}
function dayMood(g) {
  const top = GAN_EL[g.gan];
  const bottom = JI_EL[g.ji];
  if (top === bottom) return { key: "focus", label: "\uBAB0\uC785\uD558\uB294 \uB0A0", hint: "\uD55C \uAC00\uC9C0\uC5D0 \uD798\uC774 \uBAA8\uC774\uB294 \uB0A0\uC774\uC5D0\uC694" };
  if (SAENG[bottom] === top) return { key: "steady", label: "\uB4E0\uB4E0\uD55C \uB0A0", hint: "\uC544\uB798\uC5D0\uC11C \uBC1B\uCCD0\uC8FC\uB294 \uD798\uC774 \uC788\uB294 \uB0A0\uC774\uC5D0\uC694" };
  if (GEUK[top] === bottom) return { key: "push", label: "\uBC00\uACE0 \uAC00\uB294 \uB0A0", hint: "\uBA3C\uC800 \uC6C0\uC9C1\uC774\uB294 \uCABD\uC774 \uC720\uB9AC\uD55C \uB0A0\uC774\uC5D0\uC694" };
  if (GEUK[bottom] === top) return { key: "endure", label: "\uBC84\uD2F0\uB294 \uB0A0", hint: "\uC18D\uB3C4\uB97C \uB2A6\uCD94\uACE0 \uC9C0\uD0A4\uB294 \uAC8C \uC774\uAE30\uB294 \uB0A0\uC774\uC5D0\uC694" };
  return { key: "give", label: "\uBCA0\uD478\uB294 \uB0A0", hint: "\uB0B4 \uAC83\uC744 \uB098\uB20C\uC218\uB85D \uB3CC\uC544\uC624\uB294 \uB0A0\uC774\uC5D0\uC694" };
}
var YUKHAP = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
var SAMHAP = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
var WONJIN = [[0, 7], [1, 6], [2, 9], [3, 8], [4, 11], [5, 10]];
var HYEONG = [[2, 5, 8], [1, 10, 7], [0, 3]];
function branchLink(a, b) {
  const pair = (list) => list.some(([x, y]) => x === a && y === b || x === b && y === a);
  if (a === b) return "same";
  if (pair(YUKHAP)) return "hap";
  if (SAMHAP.some((g) => g.includes(a) && g.includes(b))) return "samhap";
  if ((a + 6) % 12 === b) return "chung";
  if (pair(WONJIN)) return "wonjin";
  if (HYEONG.some((g) => g.includes(a) && g.includes(b))) return "hyeong";
  return "none";
}
function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) % 1e5 / 1e5;
  };
}

// components/site/HeroVisuals.tsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var EL_VAR = { \uBAA9: "wood", \uD654: "fire", \uD1A0: "earth", \uAE08: "metal", \uC218: "water" };
function ElementsRing({ highlight, className = "" }) {
  const c = 150, R = 96;
  const pts = ELS.map((_, i) => {
    const a = (-90 + i * 72) * Math.PI / 180;
    return { x: c + R * Math.cos(a), y: c + R * Math.sin(a) };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { className: `hero-visual visual-elements ${className}`, viewBox: "0 0 300 300", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("g", { className: "spin-slow", style: { transformOrigin: "150px 150px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: c, cy: c, r: R, style: { fill: "none", stroke: "currentColor", opacity: 0.25 }, strokeWidth: 1, strokeDasharray: "2 6" }),
    pts.map((p, i) => {
      const q = pts[(i + 2) % 5];
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, style: { stroke: "currentColor", opacity: 0.16 }, strokeWidth: 1 }, i);
    }),
    ELS.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("g", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: pts[i].x, cy: pts[i].y, r: e === highlight ? 30 : 24, style: { fill: `var(--${EL_VAR[e]}-bg)`, stroke: `var(--${EL_VAR[e]})` }, strokeWidth: e === highlight ? 3 : 1.5 }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("text", { x: pts[i].x, y: pts[i].y + 5, textAnchor: "middle", className: "counter-spin", style: { fill: `var(--${EL_VAR[e]})`, fontSize: 14, fontWeight: 700, transformOrigin: `${pts[i].x}px ${pts[i].y}px` }, children: EL_PLAIN[e] })
    ] }, e))
  ] }) });
}
function ZodiacRing({ todayJi, className = "" }) {
  const c = 150, R = 118;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { className: `hero-visual visual-zodiac ${className}`, viewBox: "0 0 300 300", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: c, cy: c, r: R + 18, style: { fill: "none", stroke: "currentColor", opacity: 0.18 } }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: c, cy: c, r: R - 20, style: { fill: "none", stroke: "currentColor", opacity: 0.12 } }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("g", { className: "spin-slower", style: { transformOrigin: "150px 150px" }, children: ANIMAL.map((a, i) => {
      const ang = ((i - todayJi) * 30 - 90) * (Math.PI / 180);
      const x = c + R * Math.cos(ang), y = c + R * Math.sin(ang);
      const on = i === todayJi;
      return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("g", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: x, cy: y, r: on ? 19 : 15, style: { fill: on ? "var(--gold)" : "transparent", stroke: "currentColor", opacity: on ? 1 : 0.35 } }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("text", { x, y: y + 4, textAnchor: "middle", style: { fill: on ? "var(--on-gold)" : "currentColor", fontSize: a.length > 2 ? 9 : 11, fontWeight: on ? 700 : 500 }, children: a })
      ] }, a);
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("text", { x: c, y: c - 4, textAnchor: "middle", style: { fill: "currentColor", fontFamily: "var(--display)", fontSize: 30 }, children: ANIMAL[todayJi] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("text", { x: c, y: c + 20, textAnchor: "middle", style: { fill: "currentColor", opacity: 0.7, fontSize: 12 }, children: "\uC624\uB298\uC758 \uB760" })
  ] });
}

// components/site/Rich.tsx
var import_react4 = __toESM(require_react());
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
function Rich({ text }) {
  const lines = text.split("\n");
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_jsx_runtime7.Fragment, { children: lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_react4.Fragment, { children: [
    line.split(/(\*[^*]+\*)/g).map(
      (part, j2) => part.startsWith("*") && part.endsWith("*") && part.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("em", { children: part.slice(1, -1) }, j2) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react4.Fragment, { children: part }, j2)
    ),
    i < lines.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("br", {})
  ] }, i)) });
}

// components/site/Hero.tsx
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
function getToday() {
  const t = todayKST();
  const g = dayGanji(t.y, t.m, t.d);
  const beforeIpchun = t.m < 2 || t.m === 2 && t.d < 4;
  return { t, g, mood: dayMood(g), yg: yearGanji(beforeIpchun ? t.y - 1 : t.y), moon: moonInfo(), luckyEl: SAENG_ME[GAN_EL[g.gan]] };
}
function Visual({ cfg, today, className = "" }) {
  switch (cfg.hero.visual) {
    case "moon":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(MoonCanvas, { className: `moon-canvas ${className}` });
    case "elements":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ElementsRing, { highlight: GAN_EL[today.g.gan], className });
    case "zodiac":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ZodiacRing, { todayJi: today.g.ji, className });
    // eslint-disable-next-line @next/next/no-img-element
    case "image":
      return cfg.hero.image ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("img", { src: cfg.hero.image, alt: "", className: `hero-visual visual-image ${className}` }) : null;
    default:
      return null;
  }
}
function Copy({ cfg }) {
  const h = cfg.hero;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "hero-copy", children: [
    h.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "eyebrow", children: fill(h.eyebrow, cfg) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h1", { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Rich, { text: fill(h.title, cfg) }) }),
    h.lede && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "lede", children: fill(h.lede, cfg) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(QuickStart, { primary: h.ctaPrimary, secondary: h.ctaSecondary, base: cfg.base ?? "" }),
    h.proof.filter(Boolean).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("ul", { className: "hero-proof", children: h.proof.filter(Boolean).map((p) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("li", { children: p }, p)) })
  ] });
}
function TodayPanel({ cfg, today }) {
  const { t, g, mood, yg, moon, luckyEl } = today;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "today-panel on-dark", "aria-label": "\uC624\uB298\uC758 \uC77C\uC9C4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Visual, { cfg, today, className: "panel-visual" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "today-top", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("b", { children: [
        t.y,
        "\uB144 ",
        t.m,
        "\uC6D4 ",
        t.d,
        "\uC77C (",
        t.weekday,
        ")"
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { children: [
        GAN[yg.gan],
        JI[yg.ji],
        "\uB144"
      ] })
    ] }),
    cfg.hero.showToday ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "today-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "today-label", children: "\uC624\uB298\uC758 \uC77C\uC9C4" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "today-ganji", children: [
        GAN[g.gan],
        JI[g.ji],
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("small", { children: "\uC77C" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "mood-chip", children: mood.label }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "today-hint", children: [
        mood.hint,
        ". ",
        EL_PLAIN[GAN_EL[g.gan]],
        " \uC704\uC5D0 ",
        EL_PLAIN[JI_EL[g.ji]],
        "\uC774 \uB193\uC778 ",
        ANIMAL[g.ji],
        "\uC758 \uB0A0\uC774\uC5D0\uC694."
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "today-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "today-ganji", style: { fontSize: "clamp(34px,4vw,46px)" }, children: cfg.brand.name }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "today-hint", children: cfg.brand.tagline })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "today-foot", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        "\uB2EC \uBAA8\uC591",
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: moon.name })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        "\uC624\uB298\uC758 \uC0C9",
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: EL_COLOR_NAME[luckyEl] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        "\uC624\uB298\uC758 \uB760",
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: ANIMAL[g.ji] })
      ] })
    ] })
  ] });
}
function TodayChips({ today }) {
  const { t, g, mood, moon, luckyEl } = today;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("ul", { className: "today-chips", "aria-label": "\uC624\uB298\uC758 \uC77C\uC9C4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { children: [
        t.m,
        "\uC6D4 ",
        t.d,
        "\uC77C"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("b", { children: [
        GAN[g.gan],
        JI[g.ji],
        "\uC77C"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "\uC624\uB298\uC740" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: mood.label })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "\uB2EC" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: moon.name })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "\uC624\uB298\uC758 \uC0C9" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: EL_COLOR_NAME[luckyEl] })
    ] })
  ] });
}
function Hero({ cfg }) {
  const today = getToday();
  const { layout, showToday } = cfg.hero;
  if (layout === "center") {
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("section", { className: "hero hero-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "container", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "center-visual", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Visual, { cfg, today }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Copy, { cfg }),
      showToday && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TodayChips, { today })
    ] }) });
  }
  if (layout === "image") {
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: "hero hero-image on-dark", style: cfg.hero.image ? { backgroundImage: `url(${cfg.hero.image})` } : void 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "hero-image-shade", "aria-hidden": "true" }),
      !cfg.hero.image && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "hero-image-art", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Visual, { cfg: { ...cfg, hero: { ...cfg.hero, visual: cfg.hero.visual === "image" || cfg.hero.visual === "none" ? "moon" : cfg.hero.visual } }, today }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "container", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Copy, { cfg }),
        showToday && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TodayChips, { today })
      ] })
    ] });
  }
  if (layout === "profile") {
    const photo = cfg.about.photo || cfg.hero.image;
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("section", { className: "hero hero-profile", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "container", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("figure", { className: "profile-figure", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "profile-arch", children: photo ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("img", { src: photo, alt: cfg.about.name || cfg.brand.name }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "profile-empty", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(BrandMark, { cfg, size: 96 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "\uC0AC\uC9C4\uC744 \uC62C\uB824\uC8FC\uC138\uC694" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("figcaption", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: cfg.about.name || cfg.brand.name }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: cfg.about.role })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Copy, { cfg }),
        showToday && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TodayChips, { today })
      ] })
    ] }) });
  }
  if (layout === "today") {
    const { t, g, mood } = today;
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("section", { className: "hero hero-today", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "container", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "today-stage on-dark", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "stage-visual", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Visual, { cfg, today }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "stage-left", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "today-label", children: [
          t.y,
          "\uB144 ",
          t.m,
          "\uC6D4 ",
          t.d,
          "\uC77C (",
          t.weekday,
          ") \xB7 \uC624\uB298\uC758 \uC77C\uC9C4"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "today-ganji", children: [
          GAN[g.gan],
          JI[g.ji],
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("small", { children: "\uC77C" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "mood-chip", children: mood.label }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "today-hint", children: mood.hint })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "stage-right", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Copy, { cfg }) })
    ] }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("section", { className: "hero hero-split", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Copy, { cfg }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TodayPanel, { cfg, today })
  ] }) });
}

// components/FreeTabs.tsx
var import_react5 = __toESM(require_react());

// lib/manse/types.ts
var GROUP_OF = {
  \uBE44\uACAC: "\uBE44\uAC81",
  \uAC81\uC7AC: "\uBE44\uAC81",
  \uC2DD\uC2E0: "\uC2DD\uC0C1",
  \uC0C1\uAD00: "\uC2DD\uC0C1",
  \uD3B8\uC7AC: "\uC7AC\uC131",
  \uC815\uC7AC: "\uC7AC\uC131",
  \uD3B8\uAD00: "\uAD00\uC131",
  \uC815\uAD00: "\uAD00\uC131",
  \uD3B8\uC778: "\uC778\uC131",
  \uC815\uC778: "\uC778\uC131"
};

// lib/manse/text.ts
var DIGIT_JONG = [21, 8, 0, 16, 0, 0, 1, 8, 8, 0];
function jongOf(word) {
  const w = word.replace(/[\s'"‘’“”)\]]+$/, "");
  const ch = w.charCodeAt(w.length - 1);
  if (ch >= 44032 && ch <= 55203) return (ch - 44032) % 28;
  if (ch >= 48 && ch <= 57) return DIGIT_JONG[ch - 48];
  return 0;
}
function josa(word, pair) {
  const jong = jongOf(word);
  const has = jong !== 0;
  switch (pair) {
    case "\uC740\uB294":
      return has ? "\uC740" : "\uB294";
    case "\uC774\uAC00":
      return has ? "\uC774" : "\uAC00";
    case "\uC744\uB97C":
      return has ? "\uC744" : "\uB97C";
    case "\uACFC\uC640":
      return has ? "\uACFC" : "\uC640";
    case "\uC73C\uB85C\uB85C":
      return has && jong !== 8 ? "\uC73C\uB85C" : "\uB85C";
    case "\uC774\uC5D0\uC694\uC608\uC694":
      return has ? "\uC774\uC5D0\uC694" : "\uC608\uC694";
  }
}
var J = (word, pair) => word + josa(word, pair);

// lib/manse/reading.ts
var GOD_PLAIN = {
  \uBE44\uACAC: "\uB098\uC640 \uC5B4\uAE68\uB97C \uB098\uB780\uD788 \uD558\uB294 \uD798",
  \uAC81\uC7AC: "\uB098\uC640 \uACA8\uB8E8\uBA70 \uC790\uADF9\uD558\uB294 \uD798",
  \uC2DD\uC2E0: "\uC5EC\uC720\uB86D\uAC8C \uC990\uAE30\uBA70 \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uD798",
  \uC0C1\uAD00: "\uD2C0\uC744 \uAE68\uACE0 \uB4DC\uB7EC\uB0B4\uB294 \uD798",
  \uD3B8\uC7AC: "\uD06C\uAC8C \uC6C0\uC9C1\uC774\uB294 \uB3C8\uACFC \uAE30\uD68C",
  \uC815\uC7AC: "\uCC28\uACE1\uCC28\uACE1 \uC313\uB294 \uB3C8\uACFC \uACB0\uACFC",
  \uD3B8\uAD00: "\uB098\uB97C \uBAB0\uC544\uBD99\uC774\uB294 \uCC45\uC784",
  \uC815\uAD00: "\uB098\uB97C \uBC14\uB85C \uC138\uC6B0\uB294 \uADDC\uCE59",
  \uD3B8\uC778: "\uB0A8\uB2E4\uB978 \uC9C1\uAC10\uACFC \uC0DD\uAC01",
  \uC815\uC778: "\uB098\uB97C \uBC1B\uCCD0\uC8FC\uB294 \uBC30\uC6C0\uACFC \uB3CC\uBD04"
};
var GOD_SELF = {
  \uBE44\uACAC: "\uC18D\uC73C\uB85C\uB294 \uB204\uAD6C\uC5D0\uAC8C\uB3C4 \uAE30\uB300\uC9C0 \uC54A\uC73C\uB824\uB294 \uB3C5\uB9BD\uC2EC\uC774 \uAC15\uD574\uC694. \uAC00\uAE4C\uC6B4 \uC0AC\uB78C\uACFC\uB3C4 \uCE5C\uAD6C\uCC98\uB7FC \uB300\uB4F1\uD55C \uAD00\uACC4\uC77C \uB54C \uD3B8\uC548\uD574\uC694.",
  \uAC81\uC7AC: "\uAC89\uC73C\uB85C\uB294 \uBD80\uB4DC\uB7EC\uC6CC\uB3C4 \uC18D\uC5D0\uC11C\uB294 \uC9C0\uAE30 \uC2EB\uC740 \uB9C8\uC74C\uC774 \uCEE4\uC694. \uAC00\uAE4C\uC6B4 \uC0AC\uC774\uC77C\uC218\uB85D \uB3C8\uACFC \uBAAB\uC744 \uBD84\uBA85\uD788 \uD574\uB450\uBA74 \uC624\uB798 \uAC00\uC694.",
  \uC2DD\uC2E0: "\uB9C8\uC74C\uC5D0 \uC5EC\uC720\uAC00 \uC788\uACE0 \uC0AC\uB78C\uC744 \uD3B8\uD558\uAC8C \uD574\uC8FC\uB294 \uC131\uD488\uC774\uC5D0\uC694. \uD568\uAED8 \uBA39\uACE0 \uC990\uAE30\uB294 \uC2DC\uAC04\uC744 \uB098\uB20C \uC218 \uC788\uB294 \uC0AC\uB78C\uACFC \uC798 \uB9DE\uC544\uC694.",
  \uC0C1\uAD00: "\uC0DD\uAC01\uC774 \uBE60\uB974\uACE0 \uB9D0\uB85C \uD45C\uD604\uD558\uB294 \uD798\uC774 \uC88B\uC544\uC694. \uAC00\uAE4C\uC6B4 \uC0AC\uB78C\uC5D0\uAC8C\uB294 \uC9C1\uC124\uC774 \uC0C1\uCC98\uAC00 \uB418\uC9C0 \uC54A\uAC8C \uC628\uB3C4\uB97C \uC870\uC808\uD558\uBA74 \uC88B\uC544\uC694.",
  \uD3B8\uC7AC: "\uD1B5\uC774 \uD06C\uACE0 \uC0AC\uB78C\uC744 \uB450\uB8E8 \uCC59\uAE30\uB294 \uD3B8\uC774\uC5D0\uC694. \uD65C\uB3D9 \uBC94\uC704\uAC00 \uB113\uC740 \uB9CC\uD07C \uAC00\uAE4C\uC6B4 \uC0AC\uB78C\uC5D0\uAC8C \uC4F0\uB294 \uC2DC\uAC04\uC744 \uB530\uB85C \uB5BC\uC5B4\uB450\uC138\uC694.",
  \uC815\uC7AC: "\uD604\uC2E4 \uAC10\uAC01\uC774 \uC88B\uACE0 \uC0DD\uD65C\uC744 \uC54C\uB730\uD558\uAC8C \uAFB8\uB824\uC694. \uC57D\uC18D\uC744 \uC9C0\uD0A4\uACE0 \uC548\uC815\uAC10\uC744 \uC8FC\uB294 \uC0AC\uB78C\uC5D0\uAC8C \uB9C8\uC74C\uC774 \uC5F4\uB824\uC694.",
  \uD3B8\uAD00: "\uCC45\uC784\uAC10\uC774 \uAC15\uD558\uACE0 \uC2A4\uC2A4\uB85C\uB97C \uBAB0\uC544\uBD99\uC774\uB294 \uD3B8\uC774\uC5D0\uC694. \uAE34\uC7A5\uC744 \uD480\uC5B4\uC8FC\uB294 \uC0AC\uB78C\uC774 \uACC1\uC5D0 \uC788\uC744 \uB54C \uD798\uC774 \uB098\uC694.",
  \uC815\uAD00: "\uC6D0\uCE59\uC744 \uC9C0\uD0A4\uACE0 \uBC18\uB4EF\uD558\uAC8C \uC0B4\uB824\uB294 \uB9C8\uC74C\uC774 \uCEE4\uC694. \uBBFF\uC74C\uC9C1\uD558\uACE0 \uC608\uC758 \uBC14\uB978 \uC0AC\uB78C\uC5D0\uAC8C \uB04C\uB824\uC694.",
  \uD3B8\uC778: "\uD63C\uC790\uB9CC\uC758 \uC2DC\uAC04\uACFC \uC0DD\uAC01\uC774 \uAF2D \uD544\uC694\uD55C \uC0AC\uB78C\uC774\uC5D0\uC694. \uAC04\uC12D\uD558\uAE30\uBCF4\uB2E4 \uC774\uD574\uD574\uC8FC\uB294 \uC0AC\uB78C\uACFC \uD3B8\uD574\uC694.",
  \uC815\uC778: "\uBC1B\uC740 \uB9CC\uD07C \uB3CC\uB824\uC8FC\uB824\uB294 \uB530\uB73B\uD55C \uB9C8\uC74C\uC774 \uC788\uC5B4\uC694. \uC11C\uB85C \uB3CC\uBD10\uC8FC\uACE0 \uBC30\uC6B8 \uAC8C \uC788\uB294 \uAD00\uACC4\uC5D0\uC11C \uC548\uC815\uAC10\uC744 \uB290\uAEF4\uC694."
};
var UNSEONG_SELF = {
  \uC7A5\uC0DD: "\uC0C8\uB85C \uC2DC\uC791\uD558\uB294 \uAE30\uC6B4\uC774\uB77C \uBC30\uC6B0\uACE0 \uC790\uB77C\uB294 \uD798\uC774 \uC88B\uC544\uC694.",
  \uBAA9\uC695: "\uD638\uAE30\uC2EC\uACFC \uAC10\uC218\uC131\uC774 \uD48D\uBD80\uD574 \uC0C8\uB85C\uC6B4 \uACBD\uD5D8\uC5D0 \uB04C\uB824\uC694.",
  \uAD00\uB300: "\uC790\uC2E0\uAC10\uC774 \uC788\uC5B4 \uC2A4\uC2A4\uB85C\uB97C \uB4DC\uB7EC\uB0B4\uACE0 \uC778\uC815\uBC1B\uACE0 \uC2F6\uC5B4\uD574\uC694.",
  \uAC74\uB85D: "\uC790\uAE30 \uD798\uC73C\uB85C \uC11C\uB294 \uAE30\uC6B4\uC774 \uB69C\uB837\uD574 \uC2E4\uBB34 \uB2A5\uB825\uC774 \uC88B\uC544\uC694.",
  \uC81C\uC655: "\uAE30\uC6B4\uC774 \uAC00\uC7A5 \uAF49 \uCC2C \uC790\uB9AC\uB77C \uC8FC\uB3C4\uAD8C\uC744 \uC7A1\uC744 \uB54C \uBE5B\uB098\uC694. \uB118\uCE58\uC9C0 \uC54A\uAC8C\uB9CC \uC870\uC808\uD558\uBA74 \uB3FC\uC694.",
  \uC1E0: "\uD55C\uBC1C \uBB3C\uB7EC\uC11C \uACBD\uD5D8\uC73C\uB85C \uD310\uB2E8\uD558\uB294 \uB178\uB828\uD568\uC774 \uC788\uC5B4\uC694.",
  \uBCD1: "\uC12C\uC138\uD558\uACE0 \uB0A8\uC758 \uC544\uD514\uC744 \uC798 \uC54C\uC544\uCC44\uC694. \uADF8\uB9CC\uD07C \uCCB4\uB825 \uAD00\uB9AC\uAC00 \uC911\uC694\uD574\uC694.",
  \uC0AC: "\uD55C \uAC00\uC9C0\uB97C \uAE4A\uC774 \uD30C\uACE0\uB4DC\uB294 \uC9D1\uC911\uB825\uC774 \uC788\uC5B4\uC694.",
  \uBB18: "\uBAA8\uC73C\uACE0 \uAC04\uC9C1\uD558\uB294 \uD798\uC774 \uC788\uC5B4 \uC54C\uB730\uD558\uACE0 \uC18D\uC774 \uAE4A\uC5B4\uC694.",
  \uC808: "\uB04A\uACE0 \uB2E4\uC2DC \uC2DC\uC791\uD558\uB294 \uACB0\uB2E8\uC774 \uBE68\uB77C \uBCC0\uD654\uC5D0 \uC798 \uC801\uC751\uD574\uC694.",
  \uD0DC: "\uC0C8\uB85C\uC6B4 \uC0DD\uAC01\uC774 \uB298 \uC2F9\uD2B8\uB294 \uAE30\uC6B4\uC774\uB77C \uAC00\uB2A5\uC131\uC774 \uB9CE\uC544\uC694.",
  \uC591: "\uBCF4\uC0B4\uD54C \uC18D\uC5D0\uC11C \uCC28\uBD84\uD788 \uD06C\uB294 \uAE30\uC6B4\uC774\uB77C \uC8FC\uBCC0\uC758 \uB3C4\uC6C0\uC744 \uC798 \uBC1B\uC544\uC694."
};
var GRADE = {
  \uADF9\uC2E0\uAC15: { title: "\uAE30\uC6B4\uC774 \uC544\uC8FC \uAC15\uD55C \uC0AC\uC8FC", text: "\uB098\uB97C \uBC1B\uCCD0\uC8FC\uB294 \uD798\uC774 \uB118\uCE58\uB294 \uAD6C\uC131\uC774\uC5D0\uC694. \uADF8 \uD798\uC744 \uBC16\uC73C\uB85C \uC368\uC57C \uD3B8\uD574\uC9C0\uB2C8 \uC77C\xB7\uC6B4\uB3D9\xB7\uD45C\uD604\uCC98\uB7FC \uC5D0\uB108\uC9C0\uB97C \uC3DF\uC744 \uACF3\uC774 \uAF2D \uD544\uC694\uD574\uC694." },
  \uC2E0\uAC15: { title: "\uAE30\uC6B4\uC774 \uAC15\uD55C \uC0AC\uC8FC", text: "\uC2A4\uC2A4\uB85C \uC11C\uB294 \uD798\uC774 \uAC15\uD55C \uD3B8\uC774\uC5D0\uC694. \uB0A8\uC5D0\uAC8C \uAE30\uB300\uAE30\uBCF4\uB2E4 \uC774\uB044\uB294 \uC790\uB9AC\uC5D0\uC11C \uC2E4\uB825\uC774 \uB4DC\uB7EC\uB098\uACE0, \uC4F0\uB294 \uB9CC\uD07C \uC6B4\uC774 \uC5F4\uB824\uC694." },
  \uC911\uAC15: { title: "\uC870\uAE08 \uAC15\uD55C \uCABD\uC758 \uADE0\uD615", text: "\uBC1B\uCCD0\uC8FC\uB294 \uD798\uC774 \uC870\uAE08 \uB354 \uB9CE\uC740 \uADE0\uD615\uD615\uC774\uC5D0\uC694. \uC8FC\uB3C4\uC801\uC73C\uB85C \uC6C0\uC9C1\uC774\uB418 \uAC00\uB054\uC740 \uC18D\uB3C4\uB97C \uB2A6\uCD94\uB294 \uC5EC\uC720\uAC00 \uC88B\uC544\uC694." },
  \uC911\uD654: { title: "\uADE0\uD615 \uC7A1\uD78C \uC0AC\uC8FC", text: "\uBC1B\uCCD0\uC8FC\uB294 \uD798\uACFC \uC4F0\uB294 \uD798\uC774 \uBE44\uC2B7\uD574\uC694. \uD55C\uCABD\uC73C\uB85C \uCE58\uC6B0\uCE58\uC9C0 \uC54A\uC544 \uC0C1\uD669\uC5D0 \uB9DE\uCDB0 \uC5ED\uD560\uC744 \uBC14\uAFB8\uB294 \uC720\uC5F0\uD568\uC774 \uC788\uC5B4\uC694." },
  \uC911\uC57D: { title: "\uC870\uAE08 \uC57D\uD55C \uCABD\uC758 \uADE0\uD615", text: "\uC4F0\uB294 \uD798\uC774 \uC870\uAE08 \uB354 \uB9CE\uC740 \uADE0\uD615\uD615\uC774\uC5D0\uC694. \uC88B\uC740 \uC0AC\uB78C, \uC88B\uC740 \uCCB4\uACC4 \uC548\uC5D0\uC11C \uD798\uC744 \uBAA8\uC744 \uB54C \uACB0\uACFC\uAC00 \uCEE4\uC838\uC694." },
  \uC2E0\uC57D: { title: "\uAE30\uC6B4\uC774 \uC12C\uC138\uD55C \uC0AC\uC8FC", text: "\uB098\uB97C \uBC1B\uCCD0\uC8FC\uB294 \uD798\uBCF4\uB2E4 \uC368\uC57C \uD560 \uACF3\uC774 \uB9CE\uC740 \uAD6C\uC131\uC774\uC5D0\uC694. \uBA3C\uC800 \uCC44\uC6B0\uACE0 \uC26C\uC5B4\uC57C \uBA40\uB9AC \uAC00\uACE0, \uB3C4\uC6C0\uC744 \uC798 \uBC1B\uB294 \uAC83\uC774 \uACE7 \uC2E4\uB825\uC774\uC5D0\uC694." },
  \uADF9\uC2E0\uC57D: { title: "\uAE30\uC6B4\uC774 \uC544\uC8FC \uC12C\uC138\uD55C \uC0AC\uC8FC", text: "\uC8FC\uBCC0 \uAE30\uC6B4\uC5D0 \uC27D\uAC8C \uC601\uD5A5\uC744 \uBC1B\uB294 \uB9CC\uD07C \uAC10\uAC01\uC774 \uC608\uBBFC\uD574\uC694. \uBBFF\uC744 \uB9CC\uD55C \uC0AC\uB78C\uACFC \uD658\uACBD\uC744 \uACE0\uB974\uB294 \uAC83\uC774 \uAC00\uC7A5 \uD070 \uC6B4 \uAD00\uB9AC\uC608\uC694." }
};
var EL_STRONG = {
  \uBAA9: "\uC0C8\uB85C \uC2DC\uC791\uD558\uACE0 \uBED7\uC5B4\uAC00\uB824\uB294 \uC131\uD5A5\uC774 \uC0B6\uC758 \uAE30\uBCF8\uAC12\uC774\uC5D0\uC694.",
  \uD654: "\uBC1D\uACE0 \uC801\uADF9\uC801\uC73C\uB85C \uB4DC\uB7EC\uB0B4\uB294 \uC131\uD5A5\uC774 \uC0B6\uC758 \uAE30\uBCF8\uAC12\uC774\uC5D0\uC694.",
  \uD1A0: "\uC9C0\uD0A4\uACE0 \uBC84\uD2F0\uBA70 \uC911\uC2EC\uC744 \uC7A1\uB294 \uC131\uD5A5\uC774 \uC0B6\uC758 \uAE30\uBCF8\uAC12\uC774\uC5D0\uC694.",
  \uAE08: "\uB9FA\uACE0 \uB04A\uC73C\uBA70 \uAE30\uC900\uC744 \uC138\uC6B0\uB294 \uC131\uD5A5\uC774 \uC0B6\uC758 \uAE30\uBCF8\uAC12\uC774\uC5D0\uC694.",
  \uC218: "\uC0DD\uAC01\uD558\uACE0 \uD750\uB984\uC744 \uC77D\uB294 \uC131\uD5A5\uC774 \uC0B6\uC758 \uAE30\uBCF8\uAC12\uC774\uC5D0\uC694."
};
var EL_MISSING = {
  \uBAA9: "\uC0C8\uB85C \uC2DC\uC791\uD558\uB294 \uCD94\uC9C4\uB825\uC740 \uC758\uC2DD\uC801\uC73C\uB85C \uCC59\uAE30\uBA74 \uC88B\uC544\uC694. \uACC4\uD68D\uC744 \uC791\uAC8C \uCABC\uAC1C \uBC14\uB85C \uC2DC\uC791\uD558\uB294 \uC2B5\uAD00\uC774 \uB3C4\uC6C0\uC774 \uB3FC\uC694.",
  \uD654: "\uB098\uB97C \uB4DC\uB7EC\uB0B4\uACE0 \uD45C\uD604\uD558\uB294 \uC77C\uC740 \uC5F0\uC2B5\uC774 \uD544\uC694\uD574\uC694. \uD587\uBCD5 \uC544\uB798 \uAC77\uACE0 \uC0AC\uB78C\uB4E4 \uC55E\uC5D0\uC11C \uB9D0\uD560 \uAE30\uD68C\uB97C \uB298\uB824\uBCF4\uC138\uC694.",
  \uD1A0: "\uD55C\uACF3\uC5D0 \uBA38\uBB34\uB974\uBA70 \uC313\uB294 \uD798\uC740 \uCC59\uAE38\uC218\uB85D \uC88B\uC544\uC694. \uB8E8\uD2F4\uACFC \uC800\uCD95\uCC98\uB7FC \uBC18\uBCF5\uB418\uB294 \uD2C0\uC744 \uB9CC\uB4E4\uC5B4 \uB450\uC138\uC694.",
  \uAE08: "\uB05D\uB9FA\uACE0 \uAC70\uC808\uD558\uB294 \uD798\uC740 \uC758\uC2DD\uC801\uC73C\uB85C \uD0A4\uC6B0\uBA74 \uC88B\uC544\uC694. \uB9C8\uAC10\uACFC \uAE30\uC900\uC744 \uBA3C\uC800 \uC815\uD558\uACE0 \uC6C0\uC9C1\uC5EC \uBCF4\uC138\uC694.",
  \uC218: "\uC26C\uC5B4\uAC00\uBA70 \uC0DD\uAC01\uC744 \uC815\uB9AC\uD558\uB294 \uC2DC\uAC04\uC774 \uBD80\uC871\uD574\uC9C0\uAE30 \uC26C\uC6CC\uC694. \uD558\uB8E8 10\uBD84\uC774\uB77C\uB3C4 \uC870\uC6A9\uD788 \uB3CC\uC544\uBCF4\uB294 \uC2DC\uAC04\uC744 \uB450\uC138\uC694."
};
var EL_TIP = {
  \uBAA9: { color: "\uCD08\uB85D\xB7\uCCAD\uB85D", place: "\uC232\uAE38\xB7\uACF5\uC6D0\xB7\uB3D9\uCABD", habit: "\uC544\uCE68 \uC0B0\uCC45, \uC2DD\uBB3C \uAE30\uB974\uAE30, \uC0C8\uB85C\uC6B4 \uAC78 \uBC30\uC6B0\uAE30" },
  \uD654: { color: "\uBE68\uAC15\xB7\uC8FC\uD669\xB7\uBD84\uD64D", place: "\uD587\uBCD5 \uB4DC\uB294 \uACF3\xB7\uB0A8\uCABD", habit: "\uD587\uBCD5 \uCB10\uAE30, \uC0AC\uB78C \uB9CC\uB098\uAE30, \uB540 \uD758\uB9AC\uB294 \uC6B4\uB3D9" },
  \uD1A0: { color: "\uB178\uB791\xB7\uBCA0\uC774\uC9C0\xB7\uAC08\uC0C9", place: "\uC0B0\xB7\uB4E4\uD310\xB7\uC9D1\uC758 \uAC00\uC6B4\uB370", habit: "\uADDC\uCE59\uC801\uC778 \uC2DD\uC0AC, \uC815\uB9AC\uC815\uB3C8, \uAFB8\uC900\uD55C \uC800\uCD95" },
  \uAE08: { color: "\uD770\uC0C9\xB7\uC740\uC0C9\xB7\uAE08\uC0C9", place: "\uD0C1 \uD2B8\uC778 \uACF3\xB7\uC11C\uCABD", habit: "\uBB3C\uAC74 \uC815\uB9AC, \uB9C8\uAC10 \uC9C0\uD0A4\uAE30, \uD638\uD761 \uC6B4\uB3D9" },
  \uC218: { color: "\uAC80\uC815\xB7\uB0A8\uC0C9", place: "\uBB3C\uAC00\xB7\uC870\uC6A9\uD55C \uACF3\xB7\uBD81\uCABD", habit: "\uCDA9\uBD84\uD55C \uC7A0, \uBB3C \uC790\uC8FC \uB9C8\uC2DC\uAE30, \uC77C\uAE30 \uC4F0\uAE30" }
};
var GYEOK = {
  \uC2DD\uC2E0\uACA9: { title: "\uC88B\uC544\uD558\uB294 \uC77C\uC744 \uAE4A\uAC8C \uD30C\uB294 \uC0AC\uB78C", text: "\uC7AC\uB2A5\uC744 \uAFB8\uC900\uD788 \uAC08\uACE0\uB2E6\uC544 \uC804\uBB38\uC131\uC73C\uB85C \uB9CC\uB4DC\uB294 \uD2C0\uC774\uC5D0\uC694. \uC990\uAC81\uAC8C \uBAB0\uC785\uD560 \uC218 \uC788\uB294 \uD658\uACBD\uC5D0\uC11C \uACB0\uACFC\uAC00 \uC624\uB798 \uAC00\uC694.", jobs: "\uC694\uB9AC\xB7\uAD50\uC721\xB7\uCF58\uD150\uCE20\xB7\uC5F0\uAD6C\xB7\uAE30\uC220\uC9C1\uCC98\uB7FC \uC190\uACFC \uBA38\uB9AC\uB85C \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uC77C" },
  \uC0C1\uAD00\uACA9: { title: "\uD2C0\uC744 \uB118\uC5B4 \uC0C8 \uAE38\uC744 \uC5EC\uB294 \uC0AC\uB78C", text: "\uB9D0\uACFC \uC544\uC774\uB514\uC5B4\uB85C \uAE30\uC874 \uBC29\uC2DD\uC744 \uBC14\uAFB8\uB294 \uD798\uC774 \uC788\uC5B4\uC694. \uC790\uC728\uC774 \uBCF4\uC7A5\uB418\uB294 \uACF3\uC5D0\uC11C \uB2A5\uB825\uC774 \uD06C\uAC8C \uB4DC\uB7EC\uB098\uC694.", jobs: "\uAE30\uD68D\xB7\uB9C8\uCF00\uD305\xB7\uAC15\uC758\xB7\uBC29\uC1A1\xB7\uC608\uC220\xB7\uCC3D\uC5C5\uCC98\uB7FC \uD45C\uD604\uD558\uACE0 \uC124\uB4DD\uD558\uB294 \uC77C" },
  \uD3B8\uC7AC\uACA9: { title: "\uB113\uAC8C \uBC8C\uC774\uACE0 \uD06C\uAC8C \uAC70\uB450\uB294 \uC0AC\uB78C", text: "\uC0AC\uB78C\uACFC \uAE30\uD68C\uB97C \uC5F0\uACB0\uD574 \uD310\uC744 \uD0A4\uC6B0\uB294 \uD2C0\uC774\uC5D0\uC694. \uD604\uC7A5\uC744 \uB204\uBE44\uBA70 \uC6C0\uC9C1\uC77C \uB54C \uB3C8\uC758 \uD750\uB984\uC774 \uBCF4\uC5EC\uC694.", jobs: "\uC601\uC5C5\xB7\uC720\uD1B5\xB7\uBB34\uC5ED\xB7\uD22C\uC790\xB7\uC0AC\uC5C5\uCC98\uB7FC \uC0AC\uB78C\uACFC \uB3C8\uC744 \uD06C\uAC8C \uC6C0\uC9C1\uC774\uB294 \uC77C" },
  \uC815\uC7AC\uACA9: { title: "\uCC28\uACE1\uCC28\uACE1 \uC313\uC544 \uC9C0\uD0A4\uB294 \uC0AC\uB78C", text: "\uC131\uC2E4\uD558\uAC8C \uAD00\uB9AC\uD558\uACE0 \uACB0\uACFC\uB97C \uC313\uB294 \uD2C0\uC774\uC5D0\uC694. \uC548\uC815\uB41C \uAD6C\uC870 \uC548\uC5D0\uC11C \uC2E0\uB8B0\uAC00 \uACE7 \uC7AC\uC0B0\uC774 \uB3FC\uC694.", jobs: "\uC7AC\uBB34\xB7\uD68C\uACC4\xB7\uAD00\uB9AC\xB7\uD589\uC815\xB7\uC804\uBB38 \uC11C\uBE44\uC2A4\uCC98\uB7FC \uC815\uD655\uD568\uC774 \uC911\uC694\uD55C \uC77C" },
  \uD3B8\uAD00\uACA9: { title: "\uC5B4\uB824\uC6B4 \uC77C\uC744 \uD574\uACB0\uD558\uB294 \uC0AC\uB78C", text: "\uC555\uBC15\uC774 \uD070 \uC790\uB9AC\uC5D0\uC11C \uC624\uD788\uB824 \uAC15\uD574\uC9C0\uB294 \uD2C0\uC774\uC5D0\uC694. \uC704\uAE30 \uB300\uC751\uACFC \uACB0\uB2E8\uC774 \uD544\uC694\uD55C \uACF3\uC5D0\uC11C \uC778\uC815\uBC1B\uC544\uC694.", jobs: "\uAD70\xB7\uACBD\xB7\uC758\uB8CC\xB7\uBC95\xB7\uD604\uC7A5 \uAD00\uB9AC\xB7\uC2A4\uD3EC\uCE20\uCC98\uB7FC \uACB0\uB2E8\uACFC \uCC45\uC784\uC774 \uD070 \uC77C" },
  \uC815\uAD00\uACA9: { title: "\uBBFF\uACE0 \uB9E1\uAE30\uB294 \uC0AC\uB78C", text: "\uC6D0\uCE59\uACFC \uC808\uCC28\uB97C \uC9C0\uCF1C \uC870\uC9C1\uC5D0\uC11C \uC2E0\uB8B0\uB97C \uC5BB\uB294 \uD2C0\uC774\uC5D0\uC694. \uCCB4\uACC4\uAC00 \uBD84\uBA85\uD55C \uACF3\uC5D0\uC11C \uCC28\uADFC\uCC28\uADFC \uC62C\uB77C\uAC00\uC694.", jobs: "\uACF5\uACF5\uAE30\uAD00\xB7\uB300\uAE30\uC5C5\xB7\uAD50\uC721\xB7\uD589\uC815\xB7\uBC95\uBB34\uCC98\uB7FC \uCCB4\uACC4\uC640 \uC2E0\uB8B0\uAC00 \uC911\uC694\uD55C \uC77C" },
  \uD3B8\uC778\uACA9: { title: "\uB0A8\uB2E4\uB978 \uB208\uC73C\uB85C \uBCF4\uB294 \uC0AC\uB78C", text: "\uC9C1\uAD00\uACFC \uB3C5\uD2B9\uD55C \uAD00\uC810\uC73C\uB85C \uC804\uBB38 \uC601\uC5ED\uC744 \uB9CC\uB4DC\uB294 \uD2C0\uC774\uC5D0\uC694. \uD63C\uC790 \uAE4A\uC774 \uD30C\uACE0\uB4DC\uB294 \uC2DC\uAC04\uC774 \uACE7 \uACBD\uC7C1\uB825\uC774\uC5D0\uC694.", jobs: "\uC5F0\uAD6C\xB7IT\xB7\uB514\uC790\uC778\xB7\uC0C1\uB2F4\xB7\uC758\uB8CC\uCC98\uB7FC \uC804\uBB38 \uC9C0\uC2DD\uACFC \uAC10\uAC01\uC744 \uC4F0\uB294 \uC77C" },
  \uC815\uC778\uACA9: { title: "\uBC30\uC6B0\uACE0 \uB098\uB204\uB294 \uC0AC\uB78C", text: "\uC9C0\uC2DD\uACFC \uC790\uACA9\uC744 \uC313\uC544 \uC778\uC815\uBC1B\uB294 \uD2C0\uC774\uC5D0\uC694. \uAC00\uB974\uCE58\uACE0 \uB3CC\uBCF4\uB294 \uC790\uB9AC\uC5D0\uC11C \uC0AC\uB78C\uB4E4\uC774 \uB530\uB77C\uC694.", jobs: "\uAD50\uC721\xB7\uCD9C\uD310\xB7\uC5F0\uAD6C\xB7\uBCF5\uC9C0\xB7\uC790\uACA9 \uC804\uBB38\uC9C1\uCC98\uB7FC \uBC30\uC6C0\uC744 \uBC14\uD0D5\uC73C\uB85C \uD55C \uC77C" },
  \uAC74\uB85D\uACA9: { title: "\uC2A4\uC2A4\uB85C \uC11C\uC11C \uC77C\uAD6C\uB294 \uC0AC\uB78C", text: "\uC790\uAE30 \uD798\uC73C\uB85C \uAE30\uBC18\uC744 \uB2E6\uB294 \uD2C0\uC774\uC5D0\uC694. \uB0A8\uC758 \uB3C4\uC6C0\uBCF4\uB2E4 \uC2E4\uB825\uC73C\uB85C \uC790\uB9AC\uB97C \uB9CC\uB4E4 \uB54C \uC624\uB798 \uAC00\uC694.", jobs: "\uC804\uBB38 \uAE30\uC220\xB7\uC790\uC601\uC5C5\xB7\uD504\uB9AC\uB79C\uC11C\xB7\uC2E4\uBB34 \uCC45\uC784\uC790\uCC98\uB7FC \uB0B4 \uC2E4\uB825\uC73C\uB85C \uC11C\uB294 \uC77C" },
  \uC591\uC778\uACA9: { title: "\uAC15\uD55C \uCD94\uC9C4\uB825\uC73C\uB85C \uBC00\uC5B4\uBD99\uC774\uB294 \uC0AC\uB78C", text: "\uACBD\uC7C1\uACFC \uB3C4\uC804 \uC55E\uC5D0\uC11C \uD798\uC774 \uB098\uB294 \uD2C0\uC774\uC5D0\uC694. \uC5D0\uB108\uC9C0\uB97C \uD55C\uACF3\uC5D0 \uBAA8\uC73C\uBA74 \uB204\uAD6C\uBCF4\uB2E4 \uD06C\uAC8C \uD574\uB0B4\uC694.", jobs: "\uC6B4\uB3D9\xB7\uAD70\uACBD\xB7\uC678\uACFC\xB7\uAC74\uC124\xB7\uACBD\uC7C1\uC774 \uC788\uB294 \uC0AC\uC5C5\uCC98\uB7FC \uAC15\uD55C \uCD94\uC9C4\uB825\uC774 \uD544\uC694\uD55C \uC77C" }
};
var GROUP_ROW = {
  \uBE44\uAC81: { label: "\uB098\uC640 \uAC19\uC740 \uAE30\uC6B4", hint: "\uC790\uB9BD\xB7\uB3D9\uB8CC" },
  \uC2DD\uC0C1: { label: "\uD45C\uD604\uD558\uB294 \uAE30\uC6B4", hint: "\uC7AC\uB2A5\xB7\uB9D0" },
  \uC7AC\uC131: { label: "\uB2E4\uC2A4\uB9AC\uB294 \uAE30\uC6B4", hint: "\uB3C8\xB7\uACB0\uACFC" },
  \uAD00\uC131: { label: "\uB2E4\uB4EC\uB294 \uAE30\uC6B4", hint: "\uCC45\uC784\xB7\uC790\uB9AC" },
  \uC778\uC131: { label: "\uBC1B\uCCD0\uC8FC\uB294 \uAE30\uC6B4", hint: "\uBC30\uC6C0\xB7\uB3C4\uC6C0" }
};
var GROUP_TOP = {
  \uBE44\uAC81: "\uB098\uC640 \uAC19\uC740 \uAE30\uC6B4(\uBE44\uAC81)\uC774 \uAC00\uC7A5 \uB9CE\uC544 \uC8FC\uAD00\uC774 \uB69C\uB837\uD558\uACE0 \uC2A4\uC2A4\uB85C \uD574\uB0B4\uB824\uB294 \uD798\uC774 \uCEE4\uC694.",
  \uC2DD\uC0C1: "\uD45C\uD604\uD558\uB294 \uAE30\uC6B4(\uC2DD\uC0C1)\uC774 \uAC00\uC7A5 \uB9CE\uC544 \uB9D0\xB7\uC190\uC7AC\uC8FC\xB7\uC544\uC774\uB514\uC5B4\uB85C \uB4DC\uB7EC\uB0B4\uB294 \uC7AC\uB2A5\uC774 \uB450\uB4DC\uB7EC\uC838\uC694.",
  \uC7AC\uC131: "\uB2E4\uC2A4\uB9AC\uB294 \uAE30\uC6B4(\uC7AC\uC131)\uC774 \uAC00\uC7A5 \uB9CE\uC544 \uD604\uC2E4 \uAC10\uAC01\uACFC \uACB0\uACFC\uB97C \uCC59\uAE30\uB294 \uD798\uC774 \uC88B\uC544\uC694.",
  \uAD00\uC131: "\uB2E4\uB4EC\uB294 \uAE30\uC6B4(\uAD00\uC131)\uC774 \uAC00\uC7A5 \uB9CE\uC544 \uCC45\uC784\uAC10\uC774 \uAC15\uD558\uACE0 \uC870\uC9C1 \uC548\uC5D0\uC11C \uC778\uC815\uBC1B\uB294 \uD798\uC774 \uC788\uC5B4\uC694.",
  \uC778\uC131: "\uBC1B\uCCD0\uC8FC\uB294 \uAE30\uC6B4(\uC778\uC131)\uC774 \uAC00\uC7A5 \uB9CE\uC544 \uBC30\uC6B0\uACE0 \uC0DD\uAC01\uD558\uB294 \uD798, \uB3C4\uC6C0\uC744 \uBC1B\uB294 \uBCF5\uC774 \uC788\uC5B4\uC694."
};
var GROUP_ZERO = {
  \uBE44\uAC81: "\uB098\uC640 \uAC19\uC740 \uAE30\uC6B4\uC774 \uC5C6\uC5B4 \uD63C\uC790 \uBC84\uD2F0\uAE30\uBCF4\uB2E4 \uBBFF\uC744 \uB9CC\uD55C \uC0AC\uB78C\uACFC \uD798\uC744 \uD569\uCE60 \uB54C \uC88B\uC544\uC694.",
  \uC2DD\uC0C1: "\uD45C\uD604\uD558\uB294 \uAE30\uC6B4\uC774 \uC5C6\uC5B4 \uC18D\uB9C8\uC74C\uC744 \uB9D0\uB85C \uAEBC\uB0B4\uB294 \uC5F0\uC2B5\uC774 \uB3C4\uC6C0\uC774 \uB3FC\uC694.",
  \uC7AC\uC131: "\uB2E4\uC2A4\uB9AC\uB294 \uAE30\uC6B4\uC774 \uC5C6\uC5B4 \uB3C8 \uAD00\uB9AC\uB294 \uC790\uB3D9\uC774\uCCB4\uCC98\uB7FC \uD2C0\uC744 \uB9CC\uB4E4\uC5B4\uB450\uBA74 \uD3B8\uD574\uC694.",
  \uAD00\uC131: "\uB2E4\uB4EC\uB294 \uAE30\uC6B4\uC774 \uC5C6\uC5B4 \uC2A4\uC2A4\uB85C \uB9C8\uAC10\uACFC \uADDC\uCE59\uC744 \uC815\uD574\uB450\uBA74 \uD750\uB984\uC774 \uC7A1\uD600\uC694.",
  \uC778\uC131: "\uBC1B\uCCD0\uC8FC\uB294 \uAE30\uC6B4\uC774 \uC5C6\uC5B4 \uC26C\uB294 \uC2DC\uAC04\uACFC \uBC30\uC6C0\uC758 \uC2DC\uAC04\uC744 \uC758\uC2DD\uC801\uC73C\uB85C \uCC59\uAE30\uBA74 \uC88B\uC544\uC694."
};
var MONEY = [
  { title: "\uB3C8\uBCF4\uB2E4 \uC2E4\uB825\uC774 \uBA3C\uC800 \uAC00\uB294 \uC0AC\uC8FC", text: "\uC0AC\uC8FC\uC5D0 \uB3C8\uC744 \uB73B\uD558\uB294 \uAE30\uC6B4(\uC7AC\uC131)\uC774 \uB4DC\uB7EC\uB098 \uC788\uC9C0 \uC54A\uC544\uC694. \uB3C8\uC744 \uC887\uAE30\uBCF4\uB2E4 \uC2E4\uB825\uACFC \uC774\uB984\uC744 \uC313\uC73C\uBA74 \uB3C8\uC774 \uB4A4\uB530\uB77C\uC624\uB294 \uAD6C\uC870\uC608\uC694. \uC6B4\uC5D0\uC11C \uB3C8\uC758 \uAE30\uC6B4\uC774 \uB4E4\uC5B4\uC624\uB294 \uD574\uC5D0 \uAE30\uD68C\uAC00 \uCEE4\uC838\uC694." },
  { title: "\uD544\uC694\uD55C \uB9CC\uD07C \uB4E4\uC5B4\uC624\uB294 \uC548\uC815\uD615", text: "\uB3C8\uC744 \uB73B\uD558\uB294 \uAE30\uC6B4(\uC7AC\uC131)\uC774 \uD55C \uC790\uB9AC \uC788\uC5B4\uC694. \uD06C\uAC8C \uBC8C\uC774\uAE30\uBCF4\uB2E4 \uC218\uC785\uC6D0 \uD558\uB098\uB97C \uD0C4\uD0C4\uD558\uAC8C \uD0A4\uC6B8 \uB54C \uC548\uC815\uC801\uC774\uC5D0\uC694." },
  { title: "\uB3C8\uC758 \uD750\uB984\uC774 \uB208\uC5D0 \uBCF4\uC774\uB294 \uC0AC\uC8FC", text: "\uB3C8\uC744 \uB73B\uD558\uB294 \uAE30\uC6B4(\uC7AC\uC131)\uC774 \uB450 \uC790\uB9AC \uC788\uC5B4 \uAE30\uD68C\uB97C \uC54C\uC544\uBCF4\uB294 \uAC10\uAC01\uC774 \uC788\uC5B4\uC694. \uB4E4\uC5B4\uC624\uB294 \uAE38\uC744 \uB113\uD790\uC218\uB85D \uAD00\uB9AC \uC2B5\uAD00\uC774 \uC911\uC694\uD574\uC838\uC694." },
  { title: "\uB3C8\uACFC \uAE30\uD68C\uAC00 \uB9CE\uC774 \uC624\uAC00\uB294 \uC0AC\uC8FC", text: "\uB3C8\uC744 \uB73B\uD558\uB294 \uAE30\uC6B4(\uC7AC\uC131)\uC774 \uC5EC\uB7EC \uC790\uB9AC\uC5D0 \uC788\uC5B4\uC694. \uBC84\uB294 \uD798\uC740 \uC88B\uC9C0\uB9CC \uADF8\uB9CC\uD07C \uB098\uAC08 \uACF3\uB3C4 \uB9CE\uC544\uC694." }
];
var SPOUSE = [
  "\uC778\uC5F0\uC774 \uB2A6\uAC8C \uC624\uAC70\uB098 \uC2A4\uC2A4\uB85C \uCC3E\uC544 \uB098\uC124 \uB54C \uB9CC\uB098\uB294 \uD3B8\uC774\uC5D0\uC694. \uC6B4\uC5D0\uC11C \uC774 \uAE30\uC6B4\uC774 \uB4E4\uC5B4\uC624\uB294 \uD574\uC5D0 \uC88B\uC740 \uC778\uC5F0\uC774 \uB2FF\uAE30 \uC26C\uC6CC\uC694.",
  "\uD55C \uC0AC\uB78C\uC5D0\uAC8C \uB9C8\uC74C\uC744 \uAE4A\uAC8C \uC8FC\uB294 \uD3B8\uC774\uC5D0\uC694.",
  "\uC778\uC5F0\uC758 \uAE30\uD68C\uAC00 \uC801\uC9C0 \uC54A\uC544\uC694. \uB9C8\uC74C\uC774 \uC5EC\uB7EC \uBC29\uD5A5\uC73C\uB85C \uD754\uB4E4\uB9B4 \uB54C\uB294 \uC624\uB798 \uBCF8 \uC0AC\uB78C\uC744 \uBBFF\uC73C\uC138\uC694.",
  "\uC8FC\uBCC0\uC5D0 \uC0AC\uB78C\uC774 \uB9CE\uACE0 \uC778\uAE30\uAC00 \uC788\uB294 \uD3B8\uC774\uC5D0\uC694. \uADF8\uB9CC\uD07C \uC120\uD0DD\uC5D0 \uC2E0\uC911\uD560\uC218\uB85D \uAD00\uACC4\uAC00 \uD3B8\uC548\uD574\uC694."
];
var EL_BODY = { \uBAA9: "\uAC04\xB7\uB208\xB7\uADFC\uC721", \uD654: "\uC2EC\uC7A5\xB7\uD608\uC561\uC21C\uD658", \uD1A0: "\uC704\uC7A5\xB7\uC18C\uD654\uAE30", \uAE08: "\uD3D0\xB7\uD638\uD761\uAE30\xB7\uD53C\uBD80", \uC218: "\uC2E0\uC7A5\xB7\uBC29\uAD11\xB7\uD5C8\uB9AC" };
var SINSAL = [
  ["\uCC9C\uC744\uADC0\uC778", "\uC5B4\uB824\uC6B8 \uB54C \uB3C4\uC640\uC8FC\uB294 \uC0AC\uB78C\uC774 \uB098\uD0C0\uB098\uB294 \uAC00\uC7A5 \uC88B\uC740 \uADC0\uC778\uC774\uC5D0\uC694."],
  ["\uCC9C\uB355\uADC0\uC778", "\uB355\uC774 \uC313\uC5EC \uD070 \uD654\uB97C \uD53C\uD558\uACE0 \uB3C4\uC6C0\uC744 \uBC1B\uB294 \uAE30\uC6B4\uC774\uC5D0\uC694."],
  ["\uC6D4\uB355\uADC0\uC778", "\uC8FC\uBCC0\uC758 \uC2E0\uB8B0\uC640 \uB3C4\uC6C0\uC73C\uB85C \uC77C\uC774 \uC21C\uD558\uAC8C \uD480\uB9AC\uB294 \uAE30\uC6B4\uC774\uC5D0\uC694."],
  ["\uD0DC\uADF9\uADC0\uC778", "\uC704\uAE30\uB97C \uAE30\uD68C\uB85C \uBC14\uAFB8\uB294 \uD798\uC774 \uC788\uC5B4\uC694."],
  ["\uBB38\uCC3D\uADC0\uC778", "\uAE00\uACFC \uACF5\uBD80, \uC2DC\uD5D8\uC5D0 \uAC15\uD55C \uCD1D\uBA85\uD568\uC774 \uC788\uC5B4\uC694."],
  ["\uD559\uB2F9\uADC0\uC778", "\uBC30\uC6C0\uC744 \uC88B\uC544\uD558\uACE0 \uAC00\uB974\uCE58\uB294 \uC7AC\uB2A5\uC774 \uC788\uC5B4\uC694."],
  ["\uBB38\uACE1\uADC0\uC778", "\uD559\uBB38\uACFC \uC608\uC220 \uAC10\uAC01\uC774 \uB6F0\uC5B4\uB098\uC694."],
  ["\uAE08\uC5EC\uB85D", "\uD488\uC704 \uC788\uB294 \uC0B6\uACFC \uC88B\uC740 \uBC30\uC6B0\uC790 \uBCF5\uC744 \uB73B\uD574\uC694."],
  ["\uD611\uB85D", "\uC7AC\uBB3C\uACFC \uBCF5\uC744 \uACC1\uC5D0\uC11C \uC9C0\uCF1C\uC8FC\uB294 \uAE30\uC6B4\uC774\uC5D0\uC694."],
  ["\uC5ED\uB9C8\uC0B4", "\uC774\uB3D9\uACFC \uBCC0\uD654\uAC00 \uB9CE\uC544\uC694. \uC5EC\uD589\xB7\uD574\uC678\xB7\uCD9C\uC7A5\uC774 \uB9CE\uC740 \uC77C\uC5D0\uC11C \uC624\uD788\uB824 \uBE5B\uB098\uC694."],
  ["\uB3C4\uD654\uC0B4", "\uC0AC\uB78C\uC744 \uB044\uB294 \uB9E4\uB825\uC774 \uC788\uC5B4\uC694. \uC778\uAE30\uC640 \uB300\uC778\uAD00\uACC4\uAC00 \uD544\uC694\uD55C \uC77C\uC5D0 \uC720\uB9AC\uD574\uC694."],
  ["\uD64D\uC5FC\uC0B4", "\uC740\uC740\uD558\uAC8C \uD48D\uAE30\uB294 \uBD84\uC704\uAE30\uC640 \uB9E4\uB825\uC774 \uC788\uC5B4\uC694."],
  ["\uD654\uAC1C\uC0B4", "\uC608\uC220\xB7\uC885\uAD50\xB7\uD559\uBB38\uCC98\uB7FC \uAE4A\uC774 \uD30C\uACE0\uB4DC\uB294 \uC77C\uC5D0 \uC7AC\uB2A5\uC774 \uC788\uC5B4\uC694. \uD63C\uC790\uB9CC\uC758 \uC2DC\uAC04\uB3C4 \uD544\uC694\uD574\uC694."],
  ["\uAD34\uAC15\uC0B4", "\uC6B0\uB450\uBA38\uB9AC \uAE30\uC9C8\uACFC \uAC15\uD55C \uACB0\uB2E8\uB825\uC774 \uC788\uC5B4\uC694."],
  ["\uC591\uC778\uC0B4", "\uAC15\uD55C \uCD94\uC9C4\uB825\uACFC \uC2B9\uBD80\uC695\uC774 \uC788\uC5B4\uC694. \uD798\uC744 \uC870\uC808\uD558\uBA74 \uD070\uC77C\uC744 \uD574\uB0B4\uC694."],
  ["\uBC31\uD638\uC0B4", "\uAE30\uC6B4\uC774 \uC138\uACE0 \uC77C \uCC98\uB9AC\uAC00 \uACFC\uAC10\uD574\uC694. \uC548\uC804\uACFC \uAC74\uAC15\uC740 \uD55C \uBC88 \uB354 \uCC59\uAE30\uC138\uC694."],
  ["\uD604\uCE68\uC0B4", "\uB0A0\uCE74\uB85C\uC6B4 \uAD00\uCC30\uB825\uACFC \uC190\uC7AC\uC8FC\uAC00 \uC788\uC5B4\uC694. \uB9D0\uB05D\uC774 \uB0A0\uCE74\uB86D\uC9C0 \uC54A\uAC8C\uB9CC \uC870\uC2EC\uD558\uC138\uC694."],
  ["\uADC0\uBB38\uAD00\uC0B4", "\uC9C1\uAD00\uACFC \uAC10\uC218\uC131\uC774 \uB6F0\uC5B4\uB098\uC694. \uC608\uBBFC\uD574\uC9C8 \uB54C\uB294 \uCDA9\uBD84\uD788 \uC26C\uC5B4\uC8FC\uC138\uC694."],
  ["\uACE0\uB780\uC0B4", "\uD63C\uC790\uC11C\uB3C4 \uC798 \uC11C\uB294 \uB3C5\uB9BD\uC2EC\uC774 \uAC15\uD574\uC694."],
  ["\uACF5\uB9DD", "\uC774 \uC790\uB9AC\uC758 \uAE30\uC6B4\uC774 \uBE44\uC5B4 \uC788\uC5B4 \uAE30\uB300\uBCF4\uB2E4 \uACB0\uACFC\uAC00 \uB2A6\uAC8C \uC624\uAE30 \uC26C\uC6CC\uC694. \uC695\uC2EC\uC744 \uB35C\uC5B4\uB0B4\uBA74 \uC624\uD788\uB824 \uD3B8\uC548\uD574\uC694."]
];
var SINSAL_TEXT = new Map(SINSAL);
var CLASH_TYPE = {
  \uCDA9: "\uC815\uBA74\uC73C\uB85C \uBD80\uB52A\uD600 \uBCC0\uD654\uB97C \uB9CC\uB4DC\uB294 \uAD00\uACC4",
  \uD615: "\uC11C\uB85C\uB97C \uB2E4\uADF8\uCCD0 \uAE34\uC7A5\uC744 \uB9CC\uB4DC\uB294 \uAD00\uACC4",
  \uD30C: "\uD2C8\uC744 \uBC8C\uB824 \uACC4\uD68D\uC744 \uD754\uB4DC\uB294 \uAD00\uACC4",
  \uD574: "\uC740\uADFC\uD788 \uBC1C\uBAA9\uC744 \uC7A1\uB294 \uAD00\uACC4",
  \uC6D0\uC9C4: "\uAD1C\uD788 \uC11C\uC6B4\uD558\uACE0 \uAEC4\uB044\uB7EC\uC6B4 \uAD00\uACC4",
  \uADC0\uBB38: "\uC608\uBBFC\uD55C \uAC10\uAC01\uC744 \uAE68\uC6B0\uB294 \uAD00\uACC4"
};
var GROUP_FLOW = {
  \uBE44\uAC81: "\uB098\uC640 \uAC19\uC740 \uAE30\uC6B4\uC774 \uB4E4\uC5B4\uC624\uB294 \uC2DC\uAE30\uB77C \uB3C5\uB9BD\xB7\uACBD\uC7C1\xB7\uB3D9\uB8CC\uAC00 \uC911\uC694\uD55C \uD654\uB450\uAC00 \uB3FC\uC694.",
  \uC2DD\uC0C1: "\uD45C\uD604\uD558\uB294 \uAE30\uC6B4\uC774 \uB4E4\uC5B4\uC624\uB294 \uC2DC\uAE30\uB77C \uC7AC\uB2A5\uC744 \uB4DC\uB7EC\uB0B4\uACE0 \uC0C8 \uC77C\uC744 \uBC8C\uC774\uAE30 \uC88B\uC544\uC694.",
  \uC7AC\uC131: "\uB3C8\uACFC \uACB0\uACFC\uC758 \uAE30\uC6B4\uC774 \uB4E4\uC5B4\uC624\uB294 \uC2DC\uAE30\uB77C \uD604\uC2E4\uC801\uC778 \uC131\uACFC\uC640 \uC7AC\uC0B0\uC744 \uC77C\uAD6C\uB294 \uB54C\uC608\uC694.",
  \uAD00\uC131: "\uCC45\uC784\uACFC \uC790\uB9AC\uC758 \uAE30\uC6B4\uC774 \uB4E4\uC5B4\uC624\uB294 \uC2DC\uAE30\uB77C \uC9C1\uC7A5\xB7\uBA85\uC608\xB7\uC5ED\uD560\uC774 \uCEE4\uC9C0\uB294 \uB54C\uC608\uC694.",
  \uC778\uC131: "\uBC30\uC6C0\uACFC \uB3C4\uC6C0\uC758 \uAE30\uC6B4\uC774 \uB4E4\uC5B4\uC624\uB294 \uC2DC\uAE30\uB77C \uACF5\uBD80\xB7\uC790\uACA9\xB7\uADC0\uC778\uC758 \uB3C4\uC6C0\uC774 \uD798\uC774 \uB3FC\uC694."
};
var SEASON_NAME = { \uBE44\uAC81: "\uB3C5\uB9BD\uACFC \uACBD\uC7C1\uC758 \uACC4\uC808", \uC2DD\uC0C1: "\uD45C\uD604\uACFC \uB3C4\uC804\uC758 \uACC4\uC808", \uC7AC\uC131: "\uC131\uACFC\uC640 \uC7AC\uBB3C\uC758 \uACC4\uC808", \uAD00\uC131: "\uCC45\uC784\uACFC \uC790\uB9AC\uC758 \uACC4\uC808", \uC778\uC131: "\uBC30\uC6C0\uACFC \uC900\uBE44\uC758 \uACC4\uC808" };
var YEAR_GROUP = {
  \uBE44\uAC81: "\uC0AC\uB78C\uC774 \uBAA8\uC774\uACE0 \uACBD\uC7C1\uB3C4 \uC0DD\uACA8\uC694. \uB0B4 \uBAAB\uC744 \uBD84\uBA85\uD788 \uD558\uBA74 \uD611\uB825\uC774 \uD798\uC774 \uB3FC\uC694.",
  \uC2DD\uC0C1: "\uD558\uACE0 \uC2F6\uC740 \uB9D0\uACFC \uC77C\uC744 \uAEBC\uB0B4\uAE30 \uC88B\uC740 \uD574\uC608\uC694. \uC0C8 \uC2DC\uB3C4\uAC00 \uACB0\uACFC\uB85C \uC774\uC5B4\uC838\uC694.",
  \uC7AC\uC131: "\uB3C8\uACFC \uACB0\uACFC\uAC00 \uC6C0\uC9C1\uC774\uB294 \uD574\uC608\uC694. \uBC8C\uC774\uB294 \uB9CC\uD07C \uAD00\uB9AC\uB3C4 \uD568\uAED8 \uCC59\uAE30\uC138\uC694.",
  \uAD00\uC131: "\uCC45\uC784\uC774 \uCEE4\uC9C0\uB294 \uB9CC\uD07C \uC778\uC815\uB3C4 \uB530\uB77C\uC624\uB294 \uD574\uC608\uC694. \uC57D\uC18D\uACFC \uC6D0\uCE59\uC744 \uC9C0\uD0A4\uC138\uC694.",
  \uC778\uC131: "\uBC30\uC6B0\uACE0 \uC900\uBE44\uD558\uAE30 \uC88B\uC740 \uD574\uC608\uC694. \uB3C4\uC6C0\uC744 \uC8FC\uB294 \uC0AC\uB78C\uC744 \uAC00\uAE4C\uC774 \uB450\uC138\uC694."
};
var KNUM = ["", "\uD55C", "\uB450", "\uC138", "\uB124", "\uB2E4\uC12F", "\uC5EC\uC12F", "\uC77C\uACF1"];
var groupOf = (god) => GROUP_OF[god] ?? "\uBE44\uAC81";
var name2 = (p) => GAN[p.gan] + JI[p.ji];
function buildReading(s, name = "") {
  const nm = name.trim() ? `${name.trim()}\uB2D8` : "\uB2F9\uC2E0";
  const dm = s.dayMaster;
  const day = s.pillars.day;
  const y = s.yongsin;
  const ilju = {
    id: "ilju",
    label: "\uD0C0\uACE0\uB09C \uB098",
    title: `${name2(day)}\uC77C\uC8FC`,
    body: [
      `\uC0AC\uC8FC\uC5D0\uC11C \uB098\uB97C \uB73B\uD558\uB294 \uAE00\uC790\uB294 \uD0DC\uC5B4\uB09C \uB0A0\uC758 \uC717\uAE00\uC790\uC608\uC694. \uC774 \uAE00\uC790\uB97C \uC77C\uAC04\uC774\uB77C\uACE0 \uD574\uC694. ${nm}\uC758 \uC77C\uAC04\uC740 '${GAN[dm.gan]}', ${EL_PLAIN[dm.el]}\uC758 \uAE30\uC6B4\uC774\uC5D0\uC694.`,
      `\uADF8 \uC544\uB798 \uC549\uC740 \uAE00\uC790\uB294 '${JI[day.ji]}', ${EL_PLAIN[day.jiEl]}\uC758 \uAE30\uC6B4\uC774\uC5D0\uC694. \uC774 \uC790\uB9AC(\uC77C\uC9C0)\uB294 \uC18D\uB9C8\uC74C\uACFC \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uC0AC\uB78C\uC758 \uC790\uB9AC\uC778\uB370, \uC5EC\uAE30 \uB193\uC778 \uAE30\uC6B4\uC740 ${J(GOD_PLAIN[day.jiGod] ?? "\uB098\uC758 \uAE30\uC6B4", "\uC744\uB97C")} \uB73B\uD558\uB294 ${J(day.jiGod, "\uC774\uC5D0\uC694\uC608\uC694")}. ${GOD_SELF[day.jiGod] ?? ""}`,
      `\uC77C\uAC04\uC774 \uC774 \uC790\uB9AC\uC5D0\uC11C \uC4F8 \uC218 \uC788\uB294 \uD798\uC758 \uD06C\uAE30\uB97C 12\uC6B4\uC131\uC73C\uB85C \uBCF4\uBA74 ${J(`'${day.unseong}'`, "\uC774\uC5D0\uC694\uC608\uC694")}. ${UNSEONG_SELF[day.unseong] ?? ""}`
    ]
  };
  const baseGrade = s.strength.grade.replace(/\(.*\)$/, "");
  const mod = /\((강변약|약변강)\)/.exec(s.strength.grade)?.[1];
  const gr = GRADE[baseGrade] ?? GRADE.\uC911\uD654;
  const ox = (v) => v === "O" ? "\uC608" : v === "X" ? "\uC544\uB2C8\uC694" : "\uC77C\uBD80";
  const strong = [...ELS].sort((a, b) => s.elements[b] - s.elements[a])[0];
  const zeros = ELS.filter((e) => s.elements[e] === 0);
  const strength = {
    id: "strength",
    label: "\uAE30\uC6B4\uC758 \uC138\uAE30",
    title: gr.title,
    body: [
      gr.text + (mod === "\uAC15\uBCC0\uC57D" ? " \uB2E4\uB9CC \uAC89\uBCF4\uAE30\uBCF4\uB2E4 \uD798\uC774 \uD769\uC5B4\uC9C0\uAE30 \uC26C\uC6CC \uADE0\uD615 \uCABD\uC73C\uB85C \uBD24\uC5B4\uC694." : mod === "\uC57D\uBCC0\uAC15" ? " \uB2E4\uB9CC \uACF3\uACF3\uC5D0 \uBFCC\uB9AC\uAC00 \uC788\uC5B4 \uAC89\uBCF4\uAE30\uBCF4\uB2E4 \uB2E8\uB2E8\uD574 \uADE0\uD615 \uCABD\uC73C\uB85C \uBD24\uC5B4\uC694." : ""),
      `\uD310\uB2E8 \uADFC\uAC70\uB294 \uC138 \uAC00\uC9C0\uC608\uC694. \uD0DC\uC5B4\uB09C \uB2EC\uC774 \uB098\uB97C \uB3D5\uB294\uC9C0(\uB4DD\uB839) ${ox(s.strength.deukryeong)}, \uB0B4\uAC00 \uC549\uC740 \uC790\uB9AC\uAC00 \uB098\uB97C \uB3D5\uB294\uC9C0(\uB4DD\uC9C0) ${ox(s.strength.deukji)}, \uB098\uBA38\uC9C0 \uAE00\uC790\uB4E4\uC774 \uB098\uB97C \uB3D5\uB294\uC9C0(\uB4DD\uC138) ${ox(s.strength.deukse)}.${s.pillars.hour ? "" : " \uD0DC\uC5B4\uB09C \uC2DC\uAC04\uC744 \uBAB0\uB77C \uC138 \uAE30\uB465\uC73C\uB85C \uD310\uB2E8\uD588\uC5B4\uC694."}`,
      `\uB2E4\uC12F \uAE30\uC6B4 \uC911 \uAC00\uC7A5 \uB9CE\uC740 \uAC74 ${EL_PLAIN[strong]}(${s.elements[strong]}\uAC1C)\uC608\uC694. ${EL_STRONG[strong]}` + (zeros.length ? ` ${zeros.map((e) => EL_PLAIN[e]).join("\xB7")}\uC758 \uAE30\uC6B4\uC740 \uC5C6\uC5B4\uC694. ${EL_MISSING[zeros[0]]}` : " \uB2E4\uC12F \uAE30\uC6B4\uC774 \uBAA8\uB450 \uC788\uC5B4 \uD06C\uAC8C \uBE44\uB294 \uACF3\uC774 \uC5C6\uC5B4\uC694.")
    ]
  };
  const season = ["\uACA8\uC6B8", "\uACA8\uC6B8", "\uBD04", "\uBD04", "\uBD04", "\uC5EC\uB984", "\uC5EC\uB984", "\uC5EC\uB984", "\uAC00\uC744", "\uAC00\uC744", "\uAC00\uC744", "\uACA8\uC6B8"][s.pillars.month.ji];
  const yongsin = {
    id: "yongsin",
    label: "\uB098\uB97C \uB3D5\uB294 \uAE30\uC6B4",
    title: `${J(EL_PLAIN[y.\uC6A9\uC2E0], "\uC774\uAC00")} \uB098\uB97C \uB3C4\uC640\uC694`,
    body: [
      `\uC0AC\uC8FC \uC804\uCCB4\uC758 \uADE0\uD615\uC744 \uB9DE\uCD94\uB294 \uB370 \uAC00\uC7A5 \uD544\uC694\uD55C \uAE30\uC6B4\uC744 \uC6A9\uC2E0\uC774\uB77C\uACE0 \uD574\uC694. ${nm}\uC5D0\uAC8C\uB294 ${EL_PLAIN[y.\uC6A9\uC2E0]}\uC758 \uAE30\uC6B4\uC774 \uC6A9\uC2E0\uC774\uACE0, \uACC1\uC5D0\uC11C \uD798\uC744 \uBCF4\uD0DC\uB294 \uAE30\uC6B4(\uD76C\uC2E0)\uC740 ${J(EL_PLAIN[y.\uD76C\uC2E0], "\uC774\uC5D0\uC694\uC608\uC694")}.`,
      `\uBC18\uB300\uB85C \uB118\uCE58\uBA74 \uADE0\uD615\uC744 \uD754\uB4DC\uB294 \uAE30\uC6B4(\uAE30\uC2E0)\uC740 ${J(EL_PLAIN[y.\uAE30\uC2E0], "\uC774\uC5D0\uC694\uC608\uC694")}. \uC774 \uAE30\uC6B4\uC774 \uAC15\uD574\uC9C0\uB294 \uD574\uB098 \uD658\uACBD\uC5D0\uC11C\uB294 \uC18D\uB3C4\uB97C \uB2A6\uCD94\uACE0 \uC26C\uC5B4\uAC00\uBA74 \uC88B\uC544\uC694.`,
      `\uD0DC\uC5B4\uB09C \uACC4\uC808(${season})\uB85C \uBCF4\uBA74 ${J(EL_PLAIN[s.johu.main], "\uC774\uAC00")} \uC788\uC5B4\uC57C \uAE30\uC6B4\uC758 \uC628\uB3C4\uAC00 \uC54C\uB9DE\uC544\uC838\uC694.` + (s.johu.main === y.\uC6A9\uC2E0 ? " \uADE0\uD615\uC73C\uB85C \uBD10\uB3C4, \uACC4\uC808\uB85C \uBD10\uB3C4 \uAC19\uC740 \uAE30\uC6B4\uC774 \uD544\uC694\uD574 \uB354 \uBD84\uBA85\uD574\uC694." : s.johu.main === y.\uD76C\uC2E0 ? " \uD798\uC744 \uBCF4\uD0DC\uB294 \uAE30\uC6B4\uACFC \uAC19\uC544 \uCC59\uAE38\uC218\uB85D \uC88B\uC544\uC694." : "")
    ]
  };
  const tips = [
    { el: y.\uC6A9\uC2E0, role: "\uB098\uB97C \uB3D5\uB294 \uAE30\uC6B4", ...EL_TIP[y.\uC6A9\uC2E0] },
    { el: y.\uD76C\uC2E0, role: "\uD798\uC744 \uBCF4\uD0DC\uB294 \uAE30\uC6B4", ...EL_TIP[y.\uD76C\uC2E0] }
  ];
  const order = ["\uBE44\uAC81", "\uC2DD\uC0C1", "\uC7AC\uC131", "\uAD00\uC131", "\uC778\uC131"];
  const groupRows = order.map((key) => ({ key, ...GROUP_ROW[key], count: s.groups[key] ?? 0 }));
  const maxG = Math.max(...groupRows.map((g) => g.count));
  const tops = groupRows.filter((g) => g.count === maxG && maxG > 0);
  const zeroG = groupRows.filter((g) => g.count === 0);
  const groups = {
    id: "groups",
    label: "\uC131\uD5A5\uC758 \uAD6C\uC131",
    title: "\uB2E4\uC12F \uAC00\uC9C0 \uC5ED\uD560\uC758 \uBD84\uD3EC",
    body: [
      "\uC77C\uAC04\uC744 \uAE30\uC900\uC73C\uB85C \uB098\uBA38\uC9C0 \uAE00\uC790\uAC00 \uB098\uC5D0\uAC8C \uC5B4\uB5A4 \uC5ED\uD560\uC778\uC9C0 \uB2E4\uC12F \uAC08\uB798\uB85C \uB098\uB208 \uAC83\uC744 \uC2ED\uC131\uC774\uB77C\uACE0 \uD574\uC694.",
      tops.length === 1 ? GROUP_TOP[tops[0].key] : `\uAC00\uC7A5 \uB9CE\uC740 \uC5ED\uD560\uC774 ${J(tops.map((t) => t.label).join(", "), "\uC73C\uB85C\uB85C")} \uB098\uB780\uD788 \uC788\uC5B4\uC694. \uD55C \uAC00\uC9C0 \uBAA8\uC2B5\uC73C\uB85C\uB9CC \uC124\uBA85\uB418\uC9C0 \uC54A\uB294 \uC785\uCCB4\uC801\uC778 \uC0AC\uB78C\uC774\uC5D0\uC694.`,
      zeroG.length ? GROUP_ZERO[zeroG[0].key] : ""
    ].filter(Boolean)
  };
  const gk = GYEOK[s.gyeokguk.name];
  const work = {
    id: "work",
    label: "\uC77C\uD558\uB294 \uBC29\uC2DD",
    title: gk?.title ?? "\uB098\uB9CC\uC758 \uBC29\uC2DD\uC73C\uB85C \uC77C\uD558\uB294 \uC0AC\uB78C",
    body: [
      `\uD0DC\uC5B4\uB09C \uB2EC\uC758 \uAE00\uC790\uB97C \uC911\uC2EC\uC73C\uB85C \uBCF8 \uC0AC\uC8FC\uC758 \uD070 \uD2C0(\uACA9\uAD6D)\uC740 ${J(s.gyeokguk.name, "\uC774\uC5D0\uC694\uC608\uC694")}. ${gk?.text ?? ""}`.trim(),
      gk ? `\uC798 \uB9DE\uB294 \uC77C: ${gk.jobs}` : "",
      s.groups.\uAD00\uC131 >= 2 ? "\uCC45\uC784\uACFC \uADDC\uCE59\uC758 \uAE30\uC6B4\uB3C4 \uB109\uB109\uD574 \uC870\uC9C1 \uC548\uC5D0\uC11C \uC790\uB9AC\uB97C \uC7A1\uB294 \uD798\uC774 \uC788\uC5B4\uC694." : s.groups.\uC2DD\uC0C1 >= 2 ? "\uD45C\uD604\uD558\uB294 \uAE30\uC6B4\uB3C4 \uB109\uB109\uD574 \uB0B4 \uC774\uB984\uC744 \uAC78\uACE0 \uD558\uB294 \uC77C\uC5D0\uC11C \uBE5B\uB098\uC694." : s.groups.\uC778\uC131 >= 2 ? "\uBC30\uC6C0\uC758 \uAE30\uC6B4\uB3C4 \uB109\uB109\uD574 \uC790\uACA9\uACFC \uC804\uBB38\uC131\uC744 \uC313\uC744\uC218\uB85D \uC720\uB9AC\uD574\uC694." : ""
    ].filter(Boolean)
  };
  const wealth = s.groups.\uC7AC\uC131 ?? 0;
  const mt = MONEY[Math.min(wealth, 3)];
  const money = {
    id: "money",
    label: "\uB3C8\uC758 \uD750\uB984",
    title: mt.title,
    body: [
      mt.text + (wealth >= 3 ? s.strength.label === "\uC57D\uD55C \uD3B8" ? " \uB0B4 \uD798\uBCF4\uB2E4 \uB3C8\uC758 \uAE30\uC6B4\uC774 \uD06C\uBA74 \uC9C0\uD0A4\uAE30 \uC5B4\uB824\uC6B0\uB2C8 \uBC8C\uC774\uB294 \uADDC\uBAA8\uB97C \uC870\uC808\uD558\uC138\uC694." : " \uBC1B\uCCD0\uC8FC\uB294 \uD798\uC774 \uC788\uC5B4 \uD06C\uAC8C \uBC8C\uC774\uB294 \uC77C\uB3C4 \uAC10\uB2F9\uD560 \uC218 \uC788\uC5B4\uC694." : ""),
      s.groups.\uC2DD\uC0C1 >= 1 ? "\uC7AC\uB2A5\uC744 \uBC16\uC73C\uB85C \uB0B4\uBCF4\uB0B4\uB294 \uAE30\uC6B4(\uC2DD\uC0C1)\uC774 \uC788\uC5B4 \uAE30\uC220\xB7\uCF58\uD150\uCE20\xB7\uC11C\uBE44\uC2A4\uB85C \uB3C8\uC744 \uB9CC\uB4DC\uB294 \uD750\uB984\uC774 \uC88B\uC544\uC694." : "",
      s.groups.\uBE44\uAC81 >= 3 ? "\uB098\uC640 \uAC19\uC740 \uAE30\uC6B4\uC774 \uB9CE\uC544 \uB3D9\uC5C5\uC774\uB098 \uB3C8 \uAC70\uB798\uC5D0\uC11C \uC0C8\uB294 \uB3C8\uC774 \uC0DD\uAE30\uAE30 \uC26C\uC6CC\uC694. \uD568\uAED8 \uC4F0\uB294 \uB3C8\uC740 \uAE30\uB85D\uC744 \uBD84\uBA85\uD788 \uD558\uC138\uC694." : ""
    ].filter(Boolean)
  };
  const female = s.input.gender === "\uC5EC";
  const cnt = s.groups[female ? "\uAD00\uC131" : "\uC7AC\uC131"] ?? 0;
  const dayJi = JI[day.ji];
  const allSinsal = [s.pillars.year, s.pillars.month, s.pillars.day, s.pillars.hour].flatMap((p) => p?.sinsal ?? []);
  const love = {
    id: "love",
    label: "\uC5F0\uC560\uC640 \uBC30\uC6B0\uC790",
    title: cnt === 0 ? "\uCC9C\uCC9C\uD788 \uAE4A\uC5B4\uC9C0\uB294 \uC778\uC5F0" : cnt === 1 ? "\uD55C \uC0AC\uB78C\uC5D0\uAC8C \uAE4A\uAC8C \uB9C8\uC74C \uC8FC\uB294 \uC0AC\uB791" : cnt === 2 ? "\uC778\uC5F0\uC758 \uAE30\uD68C\uAC00 \uB109\uB109\uD55C \uC0AC\uC8FC" : "\uC0AC\uB78C\uC774 \uB9CE\uC774 \uBAA8\uC774\uB294 \uC0AC\uC8FC",
    body: [
      `${female ? "\uC5EC\uC131\uC758 \uC0AC\uC8FC\uC5D0\uC11C \uC5F0\uC778\uACFC \uBC30\uC6B0\uC790\uB294 \uB098\uB97C \uB2E4\uB4EC\uB294 \uAE30\uC6B4(\uAD00\uC131)\uC73C\uB85C \uBD10\uC694" : "\uB0A8\uC131\uC758 \uC0AC\uC8FC\uC5D0\uC11C \uC5F0\uC778\uACFC \uBC30\uC6B0\uC790\uB294 \uB0B4\uAC00 \uC544\uB07C\uACE0 \uCC59\uAE30\uB294 \uAE30\uC6B4(\uC7AC\uC131)\uC73C\uB85C \uBD10\uC694"}. ${nm}\uC5D0\uAC8C\uB294 \uC774 \uAE30\uC6B4\uC774 ${cnt === 0 ? "\uB4DC\uB7EC\uB098 \uC788\uC9C0 \uC54A\uC544\uC694" : `${KNUM[Math.min(cnt, 7)]} \uC790\uB9AC \uC788\uC5B4\uC694`}. ${SPOUSE[Math.min(cnt, 3)]}`,
      s.relations.hap.some((r) => r.includes(dayJi)) ? "\uBC30\uC6B0\uC790 \uC790\uB9AC\uAC00 \uB2E4\uB978 \uAE00\uC790\uC640 \uC190\uC744 \uC7A1\uACE0 \uC788\uC5B4 \uC0AC\uB78C\uC744 \uB04C\uC5B4\uB2F9\uAE30\uB294 \uD798\uC774 \uC788\uC5B4\uC694. \uC778\uC5F0\uC774 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC774\uC5B4\uC9C0\uB294 \uD3B8\uC774\uC5D0\uC694." : s.relations.clash.some((r) => r.includes(dayJi)) ? "\uBC30\uC6B0\uC790 \uC790\uB9AC\uAC00 \uB2E4\uB978 \uAE00\uC790\uC640 \uAE34\uC7A5\uD558\uB294 \uAD6C\uC870\uAC00 \uC788\uC5B4\uC694. \uAC00\uAE4C\uC6B4 \uC0AC\uC774\uC77C\uC218\uB85D \uC11C\uB85C\uC758 \uACF5\uAC04\uC744 \uC874\uC911\uD558\uBA74 \uC624\uD788\uB824 \uC624\uB798 \uAC00\uC694." : "",
      allSinsal.includes("\uB3C4\uD654\uC0B4") || allSinsal.includes("\uD64D\uC5FC\uC0B4") ? "\uC0AC\uB78C\uC744 \uB044\uB294 \uB9E4\uB825\uC744 \uB73B\uD558\uB294 \uC2E0\uC0B4\uB3C4 \uC788\uC5B4 \uCCAB\uC778\uC0C1\uC5D0\uC11C \uD638\uAC10\uC744 \uC5BB\uAE30 \uC26C\uC6CC\uC694." : ""
    ].filter(Boolean)
  };
  const minCount = Math.min(...ELS.map((e) => s.elements[e]));
  const weak = ELS.filter((e) => s.elements[e] === minCount);
  const over = ELS.filter((e) => s.elements[e] >= 3);
  const health = {
    id: "health",
    label: "\uBAB8 \uCC59\uAE30\uAE30",
    title: `${weak.map((e) => EL_PLAIN[e]).join("\xB7")}\uC758 \uAE30\uC6B4\uC744 \uCC44\uC6CC\uC8FC\uC138\uC694`,
    body: [
      `\uAE30\uC6B4\uC774 \uBE44\uAC70\uB098 \uC801\uC740 \uACF3\uC740 \uBAB8\uC5D0\uC11C \uBA3C\uC800 \uC2E0\uD638\uAC00 \uC624\uAE30 \uC26C\uC6CC\uC694. ${J(nm, "\uC740\uB294")} ${weak.map((e) => EL_PLAIN[e]).join("\xB7")}\uC758 \uAE30\uC6B4\uC774 \uAC00\uC7A5 \uC801\uC5B4 ${weak.map((e) => EL_BODY[e]).join(", ")} \uCABD\uC744 \uD3C9\uC18C\uC5D0 \uCC59\uAE30\uBA74 \uC88B\uC544\uC694.`,
      over.length ? `${over.map((e) => EL_PLAIN[e]).join("\xB7")}\uC758 \uAE30\uC6B4\uC740 \uB9CE\uC740 \uD3B8\uC774\uB77C ${over.map((e) => EL_BODY[e]).join(", ")} \uCABD\uB3C4 \uBB34\uB9AC\uD558\uC9C0 \uC54A\uAC8C \uC0B4\uD3B4\uC8FC\uC138\uC694.` : "",
      "\uC0AC\uC8FC\uB294 \uBAB8\uC758 \uACBD\uD5A5\uC744 \uBCF4\uB294 \uCC38\uACE0\uC608\uC694. \uBD88\uD3B8\uD55C \uC99D\uC0C1\uC774 \uC788\uC73C\uBA74 \uAF2D \uC9C4\uB8CC\uB97C \uBC1B\uC73C\uC138\uC694."
    ].filter(Boolean)
  };
  const PLACE = { year: "\uD0DC\uC5B4\uB09C \uD574", month: "\uD0DC\uC5B4\uB09C \uB2EC", day: "\uD0DC\uC5B4\uB09C \uB0A0", hour: "\uD0DC\uC5B4\uB09C \uC2DC" };
  const found = /* @__PURE__ */ new Map();
  for (const k of ["year", "month", "day", "hour"]) {
    const p = s.pillars[k];
    if (!p) continue;
    for (const raw of p.sinsal) {
      const nameKey = raw.startsWith("\uACF5\uB9DD") ? "\uACF5\uB9DD" : raw;
      if (!SINSAL_TEXT.has(nameKey)) continue;
      const list = found.get(nameKey) ?? [];
      if (!list.includes(PLACE[k])) list.push(PLACE[k]);
      found.set(nameKey, list);
    }
  }
  const sinsal = SINSAL.filter(([n]) => found.has(n)).map(([n, text]) => ({ name: n, where: found.get(n).join("\xB7"), text }));
  const { stems, hap, clash } = s.relations;
  const types = [...new Set(clash.map((r) => /(원진|귀문|충|형|파|해)\s*$/.exec(r.replace(/\(.*\)$/, "").trim())?.[1]).filter((t) => !!t))];
  const relations = {
    id: "relations",
    label: "\uAE00\uC790\uB07C\uB9AC\uC758 \uAD00\uACC4",
    title: hap.length && clash.length ? "\uB04C\uC5B4\uB2F9\uAE40\uACFC \uAE34\uC7A5\uC774 \uD568\uAED8 \uC788\uB294 \uC0AC\uC8FC" : hap.length ? "\uAE30\uC6B4\uC774 \uC798 \uBB49\uCE58\uB294 \uC0AC\uC8FC" : clash.length ? "\uC6C0\uC9C1\uC774\uBA70 \uD06C\uB294 \uC0AC\uC8FC" : "\uB2F4\uBC31\uD558\uACE0 \uC548\uC815\uB41C \uD750\uB984",
    body: [
      hap.length ? `\uC190\uC7A1\uB294 \uACF3\uC740 ${hap.join(", ")}. \uAE30\uC6B4\uC774 \uD55C\uB370 \uBAA8\uC5EC \uD798\uC774 \uCEE4\uC9C0\uB294 \uC790\uB9AC\uB77C \uC0AC\uB78C\uACFC \uAE30\uD68C\uB97C \uB04C\uC5B4\uBAA8\uC73C\uB294 \uD798\uC73C\uB85C \uC4F0\uC5EC\uC694.` : "",
      clash.length ? `\uAE34\uC7A5\uD558\uB294 \uACF3\uC740 ${clash.join(", ")}. ${types.map((t) => `${J(t, "\uC740\uB294")} ${CLASH_TYPE[t]}`).join(", ")}\uC608\uC694. \uBCC0\uD654\uC640 \uC790\uADF9\uC774 \uB9CE\uC740 \uB300\uC2E0 \uC6C0\uC9C1\uC77C\uC218\uB85D \uC131\uC7A5\uD558\uB294 \uD798\uC774 \uB3FC\uC694.` : "",
      stems.length ? `\uC717\uAE00\uC790\uB07C\uB9AC\uB294 ${stems.join(", ")}\uC758 \uAD00\uACC4\uAC00 \uC788\uC5B4\uC694. ${[
        stems.some((x) => x.includes("\uD569")) ? "\uD569\uC740 \uC11C\uB85C \uB04C\uC5B4\uB2F9\uACA8 \uBB36\uC774\uB294 \uAD00\uACC4" : "",
        stems.some((x) => x.includes("\uCDA9")) ? "\uCDA9\uC740 \uC11C\uB85C \uBC00\uC5B4\uB0B4\uB294 \uAD00\uACC4" : "",
        stems.some((x) => x.includes("\uADF9")) ? "\uADF9\uC740 \uD55C\uCABD\uC774 \uB2E4\uB978 \uCABD\uC744 \uB204\uB974\uB294 \uAD00\uACC4" : ""
      ].filter(Boolean).join(", ")}\uC608\uC694.` : "",
      !hap.length && !clash.length ? "\uD06C\uAC8C \uBD80\uB52A\uD788\uAC70\uB098 \uBB36\uC774\uB294 \uAE00\uC790\uAC00 \uC5C6\uC5B4 \uD750\uB984\uC774 \uB2F4\uBC31\uD558\uACE0 \uC548\uC815\uC801\uC774\uC5D0\uC694." : ""
    ].filter(Boolean)
  };
  const idx = s.currentDaewoonIndex;
  const cur = idx >= 0 ? s.daewoon[idx] : null;
  const nxt = s.daewoon[idx + 1];
  const flowBody = [];
  if (cur) flowBody.push(`\uB300\uC6B4\uC740 10\uB144\uB9C8\uB2E4 \uBC14\uB00C\uB294 \uC778\uC0DD\uC758 \uACC4\uC808\uC774\uC5D0\uC694. ${J(nm, "\uC740\uB294")} ${cur.age}\uC138\uBD80\uD130 ${cur.age + 9}\uC138\uAE4C\uC9C0 ${name2(cur.pillar)} \uB300\uC6B4\uC744 \uC9C0\uB098\uACE0 \uC788\uC5B4\uC694. ${GROUP_FLOW[groupOf(cur.ganGod)]}`);
  else if (nxt) flowBody.push(`\uB300\uC6B4\uC740 10\uB144\uB9C8\uB2E4 \uBC14\uB00C\uB294 \uC778\uC0DD\uC758 \uACC4\uC808\uC774\uC5D0\uC694. ${nm}\uC758 \uCCAB \uB300\uC6B4\uC740 ${nxt.age}\uC138(${nxt.startYear}\uB144)\uC5D0 \uC2DC\uC791\uB3FC\uC694.`);
  if (cur && nxt) {
    const same = groupOf(nxt.ganGod) === groupOf(cur.ganGod);
    flowBody.push(`\uB2E4\uC74C \uB300\uC6B4\uC740 ${nxt.startYear}\uB144(${nxt.age}\uC138)\uBD80\uD130 ${name2(nxt.pillar)} \uB300\uC6B4\uC774\uC5D0\uC694. ${same ? `\uAC19\uC740 ${J(SEASON_NAME[groupOf(nxt.ganGod)], "\uC774\uAC00")} \uD55C \uBC88 \uB354 \uC774\uC5B4\uC838 \uC9C0\uAE08 \uC313\uB294 \uAC83\uC774 \uB354 \uAE4A\uC5B4\uC838\uC694.` : `${J(SEASON_NAME[groupOf(nxt.ganGod)], "\uC73C\uB85C\uB85C")} \uB118\uC5B4\uAC00\uC694.`}`);
  }
  const yr = s.sewoon[0];
  if (yr) flowBody.push(`${yr.year}\uB144\uC740 ${name2(yr.pillar)}\uB144\uC774\uC5D0\uC694. ${nm}\uC5D0\uAC8C\uB294 ${J(GOD_PLAIN[yr.ganGod] ?? "\uC0C8\uB85C\uC6B4 \uAE30\uC6B4", "\uC744\uB97C")} \uB73B\uD558\uB294 ${J(yr.ganGod, "\uC774\uAC00")} \uB4E4\uC5B4\uC640\uC694. ${YEAR_GROUP[groupOf(yr.ganGod)]}`);
  const ny = s.sewoon[1];
  if (ny) flowBody.push(`${ny.year}\uB144\uC5D0\uB294 ${J(GOD_PLAIN[ny.ganGod] ?? "\uC0C8\uB85C\uC6B4 \uAE30\uC6B4", "\uC774\uAC00")} \uB4E4\uC5B4\uC624\uB294 \uD574\uC608\uC694.`);
  const flow = {
    id: "flow",
    label: "\uC9C0\uAE08 \uC9C0\uB098\uB294 \uACC4\uC808",
    title: cur ? `\uC9C0\uAE08\uC740 ${SEASON_NAME[groupOf(cur.ganGod)]}` : "\uCCAB \uACC4\uC808\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911",
    body: flowBody
  };
  return { ilju, strength, yongsin, tips, groups, groupRows, life: [work, money, love, health], sinsal, relations, flow };
}

// lib/fortune.ts
var DAY_MASTER_CARD = [
  { symbol: "\uACE7\uAC8C \uBED7\uC740 \uD070 \uB098\uBB34", keywords: ["\uC2DC\uC791\uD558\uB294 \uD798", "\uACE7\uC740 \uB9C8\uC74C", "\uCC45\uC784\uAC10"], line: "\uD55C\uBC88 \uC815\uD55C \uBC29\uD5A5\uC73C\uB85C \uBB35\uBB35\uD788 \uC790\uB77C\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uB0A8\uB4E4\uBCF4\uB2E4 \uBA3C\uC800 \uAE38\uC744 \uC5EC\uB294 \uC5ED\uD560\uC774 \uC790\uC8FC \uB9E1\uACA8\uC838\uC694." },
  { symbol: "\uBC14\uB78C\uC5D0 \uD718\uB294 \uD480\uACFC \uB369\uAD74", keywords: ["\uC720\uC5F0\uD568", "\uC801\uC751\uB825", "\uB048\uAE30"], line: "\uBD80\uB7EC\uC9C0\uC9C0 \uC54A\uACE0 \uD718\uC5B4\uC11C \uACB0\uAD6D \uB2FF\uACE0 \uC2F6\uC740 \uACF3\uC5D0 \uB2FF\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uAD00\uACC4 \uC18D\uC5D0\uC11C \uD798\uC744 \uC5BB\uC5B4\uC694." },
  { symbol: "\uC138\uC0C1\uC744 \uBE44\uCD94\uB294 \uD574", keywords: ["\uBC1D\uC74C", "\uC194\uC9C1\uD568", "\uC874\uC7AC\uAC10"], line: "\uC788\uB294 \uACF3\uC744 \uD658\uD558\uAC8C \uB9CC\uB4DC\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uC228\uAE30\uAE30\uBCF4\uB2E4 \uB4DC\uB7EC\uB0BC \uB54C \uC6B4\uC774 \uC5F4\uB824\uC694." },
  { symbol: "\uC5B4\uB460\uC744 \uBC1D\uD788\uB294 \uCD1B\uBD88", keywords: ["\uC12C\uC138\uD568", "\uB530\uB73B\uD568", "\uC9D1\uC911\uB825"], line: "\uAC00\uAE4C\uC6B4 \uC0AC\uB78C\uC744 \uC624\uB798 \uB530\uB73B\uD558\uAC8C \uBE44\uCD94\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uD55C \uAC00\uC9C0\uC5D0 \uAE4A\uC774 \uBAB0\uC785\uD560 \uB54C \uBE5B\uB098\uC694." },
  { symbol: "\uB113\uACE0 \uB2E8\uB2E8\uD55C \uC0B0", keywords: ["\uB4EC\uC9C1\uD568", "\uD3EC\uC6A9\uB825", "\uC2E0\uC911\uD568"], line: "\uC27D\uAC8C \uD754\uB4E4\uB9AC\uC9C0 \uC54A\uC544 \uC0AC\uB78C\uB4E4\uC774 \uAE30\uB300\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uCC9C\uCC9C\uD788 \uC313\uC544 \uD06C\uAC8C \uC774\uB8E8\uB294 \uD750\uB984\uC774\uC5D0\uC694." },
  { symbol: "\uACE1\uC2DD\uC744 \uAE30\uB974\uB294 \uBC2D", keywords: ["\uC0B4\uB730\uD568", "\uD604\uC2E4\uAC10\uAC01", "\uB3CC\uBD04"], line: "\uBB34\uC5C7\uC774\uB4E0 \uC2EC\uC73C\uBA74 \uAE38\uB7EC\uB0B4\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uC2E4\uC18D\uC744 \uCC59\uAE30\uBA74\uC11C \uC8FC\uBCC0\uC744 \uD0A4\uC6CC\uC694." },
  { symbol: "\uB2E4\uB4EC\uAE30 \uC804\uC758 \uB2E8\uB2E8\uD55C \uC1E0", keywords: ["\uACB0\uB2E8\uB825", "\uCD94\uC9C4\uB825", "\uC758\uB9AC"], line: "\uC633\uB2E4\uACE0 \uBBFF\uB294 \uC77C\uC5D0 \uB9DD\uC124\uC784 \uC5C6\uC774 \uC6C0\uC9C1\uC774\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uB2E4\uB4EC\uC5B4\uC9C8\uC218\uB85D \uB0A0\uC774 \uC11C\uC694." },
  { symbol: "\uBE5B\uB098\uB294 \uBCF4\uC11D", keywords: ["\uC608\uB9AC\uD568", "\uC644\uBCBD\uC8FC\uC758", "\uD488\uC704"], line: "\uC791\uC740 \uCC28\uC774\uB97C \uC54C\uC544\uBCF4\uB294 \uB208\uC744 \uAC00\uC9C4 \uC0AC\uB78C\uC774\uC5D0\uC694. \uC790\uAE30\uB9CC\uC758 \uAE30\uC900\uC774 \uACE7 \uACBD\uC7C1\uB825\uC774\uC5D0\uC694." },
  { symbol: "\uB05D\uC5C6\uC774 \uD750\uB974\uB294 \uD070 \uAC15", keywords: ["\uB113\uC740 \uC2DC\uC57C", "\uC790\uC720\uB85C\uC6C0", "\uC9C0\uD61C"], line: "\uB9C9\uD788\uBA74 \uB3CC\uC544\uC11C\uB77C\uB3C4 \uBA40\uB9AC \uAC00\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uB113\uAC8C \uBCF4\uACE0 \uD06C\uAC8C \uB2F4\uC544\uC694." },
  { symbol: "\uC2A4\uBA70\uB4DC\uB294 \uBE44\uC640 \uC774\uC2AC", keywords: ["\uC9C1\uAD00", "\uBC30\uB824", "\uC0C1\uC0C1\uB825"], line: "\uC870\uC6A9\uD788 \uC2A4\uBA70\uB4E4\uC5B4 \uC8FC\uBCC0\uC744 \uC0B4\uB9AC\uB294 \uC0AC\uB78C\uC774\uC5D0\uC694. \uB290\uB08C\uC73C\uB85C \uBA3C\uC800 \uC54C\uC544\uCC44\uB294 \uD798\uC774 \uC788\uC5B4\uC694." }
];
var LINK_TEXT = {
  hap: {
    base: 90,
    lines: ["\uC624\uB298\uC758 \uAE30\uC6B4\uACFC \uC190\uC744 \uC7A1\uB294 \uB0A0\uC774\uC5D0\uC694. \uBBF8\uB904\uB454 \uBD80\uD0C1\uC774\uB098 \uC81C\uC548\uC744 \uAEBC\uB0B4\uBCF4\uC138\uC694.", "\uB9C8\uC74C \uB9DE\uB294 \uC0AC\uB78C\uC774 \uBA3C\uC800 \uB2E4\uAC00\uC624\uB294 \uB0A0\uC774\uC5D0\uC694. \uC57D\uC18D\uC744 \uC7A1\uAE30 \uC88B\uC544\uC694."],
    work: "\uD611\uC5C5 \uC81C\uC548\uC774 \uC21C\uC870\uB86D\uAC8C \uBC1B\uC544\uB4E4\uC5EC\uC838\uC694.",
    money: "\uC0AC\uB78C\uC744 \uD1B5\uD574 \uB4E4\uC5B4\uC624\uB294 \uC774\uB4DD\uC774 \uC788\uC5B4\uC694.",
    people: "\uBA3C\uC800 \uC5F0\uB77D\uD558\uBA74 \uBC18\uAC00\uC6B4 \uB2F5\uC774 \uC640\uC694."
  },
  samhap: {
    base: 84,
    lines: ["\uC5EC\uB7FF\uC774 \uD568\uAED8\uD560 \uB54C \uC77C\uC774 \uD480\uB9AC\uB294 \uB0A0\uC774\uC5D0\uC694. \uD63C\uC790 \uB059\uB059\uB300\uC9C0 \uB9C8\uC138\uC694.", "\uD769\uC5B4\uC838 \uC788\uB358 \uC77C\uC774 \uD55C \uBC29\uD5A5\uC73C\uB85C \uBAA8\uC774\uB294 \uB0A0\uC774\uC5D0\uC694."],
    work: "\uC5EC\uB7FF\uC774 \uD568\uAED8\uD558\uB294 \uC77C\uC5D0\uC11C \uC131\uACFC\uAC00 \uB098\uC694.",
    money: "\uBAA8\uC784\uC774\uB098 \uACF5\uB3D9 \uAD6C\uB9E4\uC5D0\uC11C \uC774\uB4DD\uC744 \uBD10\uC694.",
    people: "\uB9C8\uC74C \uB9DE\uB294 \uC0AC\uB78C\uB4E4\uACFC \uB73B\uC774 \uBAA8\uC5EC\uC694."
  },
  same: {
    base: 76,
    lines: ["\uB0B4 \uAE30\uC6B4\uC774 \uADF8\uB300\uB85C \uB4DC\uB7EC\uB098\uB294 \uB0A0\uC774\uC5D0\uC694. \uC7A5\uC810\uB3C4 \uACE0\uC9D1\uB3C4 \uD06C\uAC8C \uBCF4\uC5EC\uC694.", "\uC775\uC219\uD55C \uBC29\uC2DD\uC774 \uD1B5\uD558\uB294 \uB0A0\uC774\uC5D0\uC694. \uC0C8\uB85C\uC6B4 \uC2DC\uB3C4\uB294 \uB0B4\uC77C\uB85C \uBBF8\uB904\uB3C4 \uC88B\uC544\uC694."],
    work: "\uC775\uC219\uD55C \uBC29\uC2DD\uC774 \uAC00\uC7A5 \uBE60\uB978 \uAE38\uC774\uC5D0\uC694.",
    money: "\uD3C9\uC18C \uC9C0\uCD9C \uC2B5\uAD00\uB9CC \uC9C0\uD0A4\uBA74 \uCDA9\uBD84\uD574\uC694.",
    people: "\uBE44\uC2B7\uD55C \uC0AC\uB78C\uB07C\uB9AC\uC758 \uC790\uC874\uC2EC \uC2F8\uC6C0\uB9CC \uC870\uC2EC\uD558\uC138\uC694."
  },
  none: {
    base: 70,
    lines: ["\uD070 \uAD74\uACE1 \uC5C6\uC774 \uD758\uB7EC\uAC00\uB294 \uB0A0\uC774\uC5D0\uC694. \uAE30\uBCF8\uC5D0 \uCDA9\uC2E4\uD558\uBA74 \uCDA9\uBD84\uD574\uC694.", "\uC794\uC794\uD55C \uB0A0\uC774\uC5D0\uC694. \uC791\uC740 \uC815\uB9AC \uD558\uB098\uAC00 \uAE30\uBD84\uC744 \uBC14\uAFD4\uC918\uC694."],
    work: "\uAE30\uBCF8\uC5D0 \uCDA9\uC2E4\uD558\uBA74 \uBB34\uB09C\uD558\uAC8C \uD758\uB7EC\uAC00\uC694.",
    money: "\uD070 \uBCC0\uB3D9 \uC5C6\uB294 \uB0A0, \uC791\uC740 \uC815\uB9AC\uAC00 \uB3C4\uC6C0\uC774 \uB3FC\uC694.",
    people: "\uC794\uC794\uD55C \uB300\uD654\uAC00 \uD3B8\uC548\uD55C \uB0A0\uC774\uC5D0\uC694."
  },
  hyeong: {
    base: 60,
    lines: ["\uB9D0 \uD55C\uB9C8\uB514\uAC00 \uC624\uD574\uB85C \uBC88\uC9C0\uAE30 \uC26C\uC6B4 \uB0A0\uC774\uC5D0\uC694. \uD55C \uBC88 \uB354 \uD655\uC778\uD558\uACE0 \uBCF4\uB0B4\uC138\uC694.", "\uC11C\uB958\uC640 \uC57D\uC18D\uC744 \uAF3C\uAF3C\uD788 \uCC59\uACA8\uC57C \uD558\uB294 \uB0A0\uC774\uC5D0\uC694."],
    work: "\uC11C\uB958\uC640 \uC808\uCC28\uC5D0\uC11C \uC2E4\uC218\uAC00 \uB098\uAE30 \uC26C\uC6CC\uC694.",
    money: "\uACC4\uC57D\uC774\uB098 \uACB0\uC81C\uB294 \uD55C \uBC88 \uB354 \uD655\uC778\uD558\uC138\uC694.",
    people: "\uB18D\uB2F4\uC774 \uC624\uD574\uB85C \uBC88\uC9C8 \uC218 \uC788\uC5B4\uC694."
  },
  wonjin: {
    base: 56,
    lines: ["\uAD1C\uD788 \uC11C\uC6B4\uD55C \uB9C8\uC74C\uC774 \uC62C\uB77C\uC624\uB294 \uB0A0\uC774\uC5D0\uC694. \uAC10\uC815\uC740 \uD558\uB8E8 \uBB35\uD600\uB450\uC138\uC694.", "\uAC00\uAE4C\uC6B4 \uC0AC\uB78C\uACFC \uC628\uB3C4\uCC28\uAC00 \uC0DD\uAE30\uAE30 \uC26C\uC6B4 \uB0A0\uC774\uC5D0\uC694. \uBA3C\uC800 \uC6C3\uC5B4\uC8FC\uBA74 \uD480\uB824\uC694."],
    work: "\uAD1C\uD55C \uC9DC\uC99D\uC774 \uC77C\uC744 \uB2A6\uCD9C \uC218 \uC788\uC5B4\uC694.",
    money: "\uAE30\uBD84 \uD480\uB824\uACE0 \uC4F0\uB294 \uB3C8\uC744 \uC870\uC2EC\uD558\uC138\uC694.",
    people: "\uC11C\uC6B4\uD55C \uB9D0\uC740 \uD558\uB8E8 \uBB35\uD600\uB450\uC138\uC694."
  },
  chung: {
    base: 50,
    lines: ["\uC608\uC815\uC774 \uD754\uB4E4\uB9AC\uAE30 \uC26C\uC6B4 \uB0A0\uC774\uC5D0\uC694. \uC774\uB3D9\uACFC \uACC4\uC57D\uC740 \uD55C \uBC88 \uB354 \uC0B4\uD3B4\uBCF4\uC138\uC694.", "\uBD80\uB52A\uD788\uB294 \uAE30\uC6B4\uC774 \uC788\uB294 \uB0A0\uC774\uC5D0\uC694. \uC774\uAE30\uB824 \uD558\uAE30\uBCF4\uB2E4 \uD55C\uBC1C \uBB3C\uB7EC\uC11C\uBA74 \uC5BB\uC5B4\uC694."],
    work: "\uAC11\uC791\uC2A4\uB7EC\uC6B4 \uC77C\uC815 \uBCC0\uACBD\uC5D0 \uB300\uBE44\uD558\uC138\uC694.",
    money: "\uCDA9\uB3D9\uC801\uC778 \uD070 \uC9C0\uCD9C\uC740 \uBBF8\uB8E8\uC138\uC694.",
    people: "\uC774\uAE30\uB824 \uD558\uAE30\uBCF4\uB2E4 \uD55C\uBC1C \uBB3C\uB7EC\uC11C\uBA74 \uC5BB\uC5B4\uC694."
  }
};
var YUKHAP_PARTNER = [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
var SAMHAP_GROUPS = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
function zodiacFortunes(today, seedDate) {
  return JI.map((_, ji) => {
    const link = branchLink(today.ji, ji);
    const rnd = seeded(seedDate * 31 + ji * 7);
    const t = LINK_TEXT[link];
    const score = Math.max(40, Math.min(98, t.base + Math.round(rnd() * 10 - 5)));
    const line = t.lines[Math.floor(rnd() * t.lines.length)];
    const el = JI_EL[ji];
    const group = SAMHAP_GROUPS.find((g) => g.includes(ji)).filter((x) => x !== ji);
    const hourJi = [YUKHAP_PARTNER[ji], ...group].find((h) => h >= 3) ?? group[0];
    return {
      ji,
      animal: ANIMAL[ji],
      score,
      line,
      color: EL_COLOR_NAME[SAENG_ME[el]],
      link,
      work: t.work,
      money: t.money,
      people: t.people,
      hour: HOUR_RANGE[hourJi],
      friends: group.map((g) => ANIMAL[g])
    };
  });
}
var animalOfYear = (year) => ((year - 4) % 12 + 12) % 12;
var LUCKY_CARDS = [
  { name: "\uCCAB \uB2EC\uBE5B", message: "\uC624\uB298 \uCC98\uC74C \uB5A0\uC624\uB978 \uC0DD\uAC01\uC744 \uC801\uC5B4\uB450\uC138\uC694. \uADF8\uAC8C \uB2F5\uC774\uC5D0\uC694." },
  { name: "\uC5F4\uB9B0 \uBB38", message: "\uAC70\uC808\uB2F9\uD560\uAE4C \uBD10 \uBBF8\uB8EC \uC5F0\uB77D, \uC624\uB298\uC740 \uBC1B\uC544\uB4E4\uC5EC\uC9C8 \uD655\uB960\uC774 \uB192\uC544\uC694." },
  { name: "\uACE0\uC694\uD55C \uBB3C", message: "\uB300\uB2F5\uC744 \uC11C\uB450\uB974\uC9C0 \uB9C8\uC138\uC694. \uD558\uB8E8 \uAE30\uB2E4\uB9AC\uBA74 \uB354 \uC88B\uC740 \uC870\uAC74\uC774 \uC640\uC694." },
  { name: "\uC791\uC740 \uBD88\uC528", message: "10\uBD84\uB9CC \uD22C\uC790\uD55C \uC77C\uC774 \uC0DD\uAC01\uBCF4\uB2E4 \uD06C\uAC8C \uBC88\uC838\uC694." },
  { name: "\uB2E8\uB2E8\uD55C \uB3CC", message: "\uC624\uB298\uC740 \uC0C8\uB85C \uBC8C\uC774\uAE30\uBCF4\uB2E4 \uC9C0\uD0A4\uB294 \uCABD\uC774 \uC774\uB4DD\uC774\uC5D0\uC694." },
  { name: "\uBC14\uB78C\uC758 \uAE38", message: "\uD3C9\uC18C\uC640 \uB2E4\uB978 \uAE38\uB85C \uAC00\uBCF4\uC138\uC694. \uB73B\uBC16\uC758 \uC18C\uC2DD\uC774 \uAE30\uB2E4\uB824\uC694." },
  { name: "\uBE48 \uADF8\uB987", message: "\uC815\uB9AC\uD55C \uB9CC\uD07C \uB4E4\uC5B4\uC624\uB294 \uB0A0\uC774\uC5D0\uC694. \uC11C\uB78D \uD558\uB098\uB9CC \uBE44\uC6CC\uBCF4\uC138\uC694." },
  { name: "\uB450 \uAC1C\uC758 \uB2EC", message: "\uACE0\uBBFC\uB418\uB294 \uB450 \uC120\uD0DD\uC9C0, \uB458 \uB2E4 \uD2C0\uB9AC\uC9C0 \uC54A\uC558\uC5B4\uC694. \uB9C8\uC74C\uC774 \uD3B8\uD55C \uCABD\uC73C\uB85C." },
  { name: "\uC0C8\uBCBD \uC774\uC2AC", message: "\uC544\uCE68 \uC2DC\uAC04\uC744 \uC7A1\uC73C\uBA74 \uD558\uB8E8 \uC804\uCCB4\uAC00 \uAC00\uBCBC\uC6CC\uC838\uC694." },
  { name: "\uC740\uBE5B \uC5F4\uC1E0", message: "\uC624\uB798 \uB9C9\uD600 \uC788\uB358 \uC77C\uC758 \uC2E4\uB9C8\uB9AC\uAC00 \uC0AC\uB78C\uC744 \uD1B5\uD574 \uD480\uB824\uC694." },
  { name: "\uB530\uB73B\uD55C \uCC28", message: "\uC624\uB298\uC740 \uB098\uB97C \uCC59\uAE30\uB294 \uAC8C \uAC00\uC7A5 \uC0DD\uC0B0\uC801\uC778 \uC77C\uC774\uC5D0\uC694." },
  { name: "\uB4F1\uBD88", message: "\uB204\uAD70\uAC00\uC5D0\uAC8C \uAC74\uB128 \uC791\uC740 \uB3C4\uC6C0\uC774 \uB098\uC911\uC5D0 \uD06C\uAC8C \uB3CC\uC544\uC640\uC694." },
  { name: "\uD480\uB9B0 \uB9E4\uB4ED", message: "\uC624\uB798 \uAF2C\uC5EC \uC788\uB358 \uAD00\uACC4\uC5D0\uC11C \uBA3C\uC800 \uD55C\uB9C8\uB514 \uAC74\uB124\uBA74 \uC2A4\uB974\uB974 \uD480\uB824\uC694." },
  { name: "\uBC18\uCBE4 \uCC2C \uB2EC", message: "\uC644\uBCBD\uD558\uAC8C \uC900\uBE44\uB420 \uB54C\uAE4C\uC9C0 \uAE30\uB2E4\uB9AC\uC9C0 \uB9C8\uC138\uC694. \uC808\uBC18\uC774\uBA74 \uC2DC\uC791\uD558\uAE30 \uCDA9\uBD84\uD574\uC694." },
  { name: "\uCCAB\uB208", message: "\uCC98\uC74C \uD574\uBCF4\uB294 \uC77C\uC5D0 \uC6B4\uC774 \uBD99\uC5B4\uC694. \uC775\uC219\uD558\uC9C0 \uC54A\uC740 \uC120\uD0DD\uC744 \uD558\uB098 \uD574\uBCF4\uC138\uC694." },
  { name: "\uBD04\uBE44", message: "\uC870\uAE09\uD574\uD558\uC9C0 \uC54A\uC544\uB3C4 \uB3FC\uC694. \uC624\uB298 \uBFCC\uB9B0 \uC791\uC740 \uB178\uB825\uC774 \uCC9C\uCC9C\uD788 \uC2A4\uBA70\uB4E4\uC5B4\uC694." },
  { name: "\uB098\uCE68\uBC18", message: "\uAC08\uB9BC\uAE38\uC5D0\uC11C\uB294 \uB9C8\uC74C\uC774 \uBA3C\uC800 \uD3B8\uC548\uD574\uC9C0\uB294 \uCABD\uC774 \uC624\uB298\uC758 \uC815\uB2F5\uC774\uC5D0\uC694." },
  { name: "\uD3B8\uC9C0 \uBD09\uD22C", message: "\uD558\uACE0 \uC2F6\uB358 \uB9D0\uC744 \uAE00\uB85C \uC801\uC5B4\uBCF4\uC138\uC694. \uB9D0\uBCF4\uB2E4 \uB354 \uC798 \uC804\uD574\uC838\uC694." },
  { name: "\uB4F1\uB300", message: "\uB204\uAD70\uAC00 \uAE38\uC744 \uBB3C\uC5B4\uC624\uBA74 \uC544\uB294 \uB9CC\uD07C \uC54C\uB824\uC8FC\uC138\uC694. \uADF8 \uC778\uC5F0\uC774 \uC624\uB798 \uAC00\uC694." },
  { name: "\uB3CC\uB2E4\uB9AC", message: "\uD655\uC2E4\uD574 \uBCF4\uC774\uB294 \uC77C\uB3C4 \uD55C \uBC88 \uB354 \uB450\uB4DC\uB824 \uBCF4\uBA74 \uC2E4\uC218\uB97C \uB9C9\uC544\uC694." },
  { name: "\uC740\uD589\uC78E", message: "\uC9C0\uB098\uAC04 \uC77C\uC744 \uC815\uB9AC\uD558\uAE30 \uC88B\uC740 \uB0A0\uC774\uC5D0\uC694. \uBC84\uB9B4 \uAC83 \uD558\uB098\uB97C \uACE8\uB77C\uBCF4\uC138\uC694." },
  { name: "\uC0C8 \uACF5\uCC45", message: "\uC0C8\uB85C\uC6B4 \uACC4\uD68D\uC744 \uC801\uC5B4\uB450\uBA74 \uC774\uBC88\uC5D0\uB294 \uB05D\uAE4C\uC9C0 \uC774\uC5B4\uAC08 \uD798\uC774 \uC0DD\uACA8\uC694." },
  { name: "\uB530\uB73B\uD55C \uC190", message: "\uB3C4\uC6C0\uC744 \uBC1B\uB294 \uAC74 \uBD80\uB044\uB7EC\uC6B4 \uC77C\uC774 \uC544\uB2C8\uC5D0\uC694. \uC624\uB298\uC740 \uD3B8\uD558\uAC8C \uBD80\uD0C1\uD574\uBCF4\uC138\uC694." },
  { name: "\uBC24\uD558\uB298 \uBCC4", message: "\uB2F9\uC7A5 \uB208\uC5D0 \uBCF4\uC774\uC9C0 \uC54A\uC544\uB3C4 \uC313\uC774\uACE0 \uC788\uB294 \uAC8C \uC788\uC5B4\uC694. \uD558\uB358 \uAC78 \uBA48\uCD94\uC9C0 \uB9C8\uC138\uC694." },
  { name: "\uC791\uC740 \uC528\uC557", message: "5\uBD84\uC9DC\uB9AC \uC2B5\uAD00 \uD558\uB098\uAC00 \uD55C \uB2EC \uB4A4\uC758 \uB098\uB97C \uBC14\uAFD4\uC694. \uC624\uB298 \uC2DC\uC791\uD574\uBCF4\uC138\uC694." },
  { name: "\uB9D1\uC740 \uAC70\uC6B8", message: "\uB0A8\uC758 \uB9D0\uBCF4\uB2E4 \uB0B4 \uB9C8\uC74C\uC744 \uBA3C\uC800 \uB4E4\uC5EC\uB2E4\uBCF4\uBA74 \uB2F5\uC774 \uC120\uBA85\uD574\uC838\uC694." },
  { name: "\uBD80\uB4DC\uB7EC\uC6B4 \uBC14\uB78C", message: "\uD798\uC744 \uBE7C\uACE0 \uD750\uB984\uC5D0 \uB9E1\uAE30\uBA74 \uC624\uD788\uB824 \uC77C\uC774 \uC27D\uAC8C \uD480\uB9AC\uB294 \uB0A0\uC774\uC5D0\uC694." },
  { name: "\uB465\uADFC \uBCF4\uB984\uB2EC", message: "\uAE30\uB2E4\uB9AC\uB358 \uC18C\uC2DD\uC774 \uAC00\uAE4C\uC6CC\uC84C\uC5B4\uC694. \uC624\uB294 \uC5F0\uB77D\uC744 \uB193\uCE58\uC9C0 \uC54A\uAC8C \uCC59\uAE30\uC138\uC694." },
  { name: "\uC624\uC194\uAE38", message: "\uC0AC\uB78C \uB9CE\uC740 \uAE38\uBCF4\uB2E4 \uC870\uC6A9\uD55C \uAE38\uC5D0\uC11C \uC88B\uC740 \uC0DD\uAC01\uC774 \uB5A0\uC62C\uB77C\uC694." },
  { name: "\uCD1B\uBD88", message: "\uD55C \uC0AC\uB78C\uC5D0\uAC8C \uB9C8\uC74C\uC744 \uC4F0\uB294 \uB0A0\uC774\uC5D0\uC694. \uAC00\uAE4C\uC6B4 \uC0AC\uB78C\uC744 \uBA3C\uC800 \uCC59\uACA8\uC8FC\uC138\uC694." },
  { name: "\uBAA8\uB798\uC2DC\uACC4", message: "\uB9C8\uAC10\uC774 \uC788\uB294 \uC77C\uBD80\uD130 \uB05D\uB0B4\uBA74 \uB0A8\uC740 \uD558\uB8E8\uAC00 \uD55C\uACB0 \uC5EC\uC720\uB85C\uC6CC\uC838\uC694." },
  { name: "\uBB3C\uB808\uBC29\uC544", message: "\uB3C8\uC740 \uB3CC\uC544\uC57C \uB4E4\uC5B4\uC640\uC694. \uD544\uC694\uD55C \uACF3\uC5D0 \uAE30\uBD84 \uC88B\uAC8C \uC4F0\uBA74 \uB418\uB3CC\uC544\uC640\uC694." },
  { name: "\uBD89\uC740 \uC2E4", message: "\uC6B0\uC5F0\uD788 \uB9C8\uC8FC\uCE5C \uC0AC\uB78C\uC774 \uB098\uC911\uC5D0 \uC911\uC694\uD55C \uC778\uC5F0\uC774 \uB420 \uC218 \uC788\uC5B4\uC694." },
  { name: "\uC27C\uD45C", message: "\uC7A0\uAE50 \uBA48\uCDB0 \uC26C\uB294 \uC2DC\uAC04\uC774 \uC624\uB298 \uAC00\uC7A5 \uC88B\uC740 \uC544\uC774\uB514\uC5B4\uB97C \uB370\uB824\uC640\uC694." },
  { name: "\uC0C8\uBCBD \uC885", message: "\uC77C\uCC0D \uC6C0\uC9C1\uC778 \uB9CC\uD07C \uAE30\uD68C\uB97C \uBA3C\uC800 \uC7A1\uB294 \uB0A0\uC774\uC5D0\uC694." },
  { name: "\uD30C\uB780 \uB300\uBB38", message: "\uC0C8\uB85C\uC6B4 \uACF3\uC5D0 \uBC1C\uC744 \uB4E4\uC774\uBA74 \uBC18\uAC00\uC6B4 \uC0AC\uB78C\uC744 \uB9CC\uB098\uC694." },
  { name: "\uAC70\uBD81\uC774", message: "\uB290\uB824\uB3C4 \uAD1C\uCC2E\uC544\uC694. \uAFB8\uC900\uD788 \uAC00\uB294 \uCABD\uC774 \uACB0\uAD6D \uBA40\uB9AC \uAC00\uC694." },
  { name: "\uD770 \uAE43\uD138", message: "\uAC00\uBCCD\uAC8C \uC6C3\uC5B4\uB118\uAE30\uBA74 \uBCC4\uC77C \uC544\uB2CC \uC77C\uC774 \uB9CE\uC544\uC694. \uC624\uB298\uC740 \uB9C8\uC74C\uC744 \uAC00\uBCCD\uAC8C \uB450\uC138\uC694." },
  { name: "\uAE08\uBE5B \uB3D9\uC804", message: "\uC791\uC740 \uB3C8\uC744 \uC544\uB080 \uC120\uD0DD\uC774 \uC0DD\uAC01\uBCF4\uB2E4 \uD070 \uC5EC\uC720\uB85C \uB3CC\uC544\uC640\uC694." },
  { name: "\uC0B0\uB9C8\uB8E8", message: "\uC870\uAE08\uB9CC \uB354 \uAC00\uBA74 \uBCF4\uC774\uB294 \uD48D\uACBD\uC774 \uC788\uC5B4\uC694. \uD3EC\uAE30\uD558\uAE30\uC5D4 \uC774\uB978 \uB0A0\uC774\uC5D0\uC694." },
  { name: "\uC5F0\uAF43", message: "\uBCF5\uC7A1\uD55C \uC0C1\uD669 \uC18D\uC5D0\uC11C\uB3C4 \uB0B4 \uC790\uB9AC\uB97C \uC9C0\uD0A4\uBA74 \uC624\uD788\uB824 \uB3CB\uBCF4\uC5EC\uC694." },
  { name: "\uC30D\uBB34\uC9C0\uAC1C", message: "\uC88B\uC740 \uC77C\uC774 \uACB9\uCCD0 \uC624\uB294 \uB0A0\uC774\uC5D0\uC694. \uAE30\uC05C \uC18C\uC2DD\uC740 \uD568\uAED8 \uB098\uB204\uC138\uC694." },
  { name: "\uC639\uB2EC\uC0D8", message: "\uC9C0\uCE5C \uB9C8\uC74C\uC744 \uCC44\uC6B0\uB294 \uAC8C \uBA3C\uC800\uC608\uC694. \uC88B\uC544\uD558\uB294 \uC74C\uC2DD \uD55C \uAC00\uC9C0\uB97C \uCC59\uACA8 \uB4DC\uC138\uC694." },
  { name: "\uC624\uB798\uB41C \uC0AC\uC9C4", message: "\uC61B \uCE5C\uAD6C\uC5D0\uAC8C \uC548\uBD80\uB97C \uC804\uD558\uBA74 \uB73B\uBC16\uC758 \uBC18\uAC00\uC6B4 \uC18C\uC2DD\uC744 \uB4E4\uC5B4\uC694." },
  { name: "\uB098\uBB34 \uADF8\uB298", message: "\uC624\uB298\uC740 \uC55E\uC5D0 \uB098\uC11C\uAE30\uBCF4\uB2E4 \uD55C \uAC78\uC74C \uB4A4\uC5D0\uC11C \uC9C0\uCF1C\uBCF4\uB294 \uAC8C \uC774\uB4DD\uC774\uC5D0\uC694." },
  { name: "\uBC18\uB527\uBD88", message: "\uC791\uC740 \uCE6D\uCC2C \uD55C\uB9C8\uB514\uAC00 \uB204\uAD70\uAC00\uC758 \uD558\uB8E8\uB97C \uD658\uD558\uAC8C \uBC1D\uD600\uC694." },
  { name: "\uC794\uC794\uD55C \uD638\uC218", message: "\uAC10\uC815\uC774 \uCD9C\uB801\uC77C \uB54C\uB294 \uB300\uB2F5\uC744 \uBBF8\uB8E8\uC138\uC694. \uAC00\uB77C\uC549\uC73C\uBA74 \uAE38\uC774 \uBCF4\uC5EC\uC694." },
  { name: "\uD65C\uC9DD \uC5F0 \uCC3D", message: "\uCC3D\uBB38\uC744 \uC5F4\uB4EF \uC8FC\uBCC0\uC744 \uC815\uB9AC\uD558\uBA74 \uB9C9\uD614\uB358 \uC0DD\uAC01\uC774 \uD480\uB824\uC694." },
  { name: "\uB2EC\uBE5B \uC0B0\uCC45", message: "\uC800\uB141\uC5D0 \uC7A0\uAE50 \uAC77\uB294 \uC2DC\uAC04\uC5D0 \uACE0\uBBFC\uC758 \uC2E4\uB9C8\uB9AC\uAC00 \uD480\uB824\uC694." },
  { name: "\uC57D\uC18D \uBC18\uC9C0", message: "\uC9C0\uD0A4\uAE30\uB85C \uD55C \uC791\uC740 \uC57D\uC18D \uD558\uB098\uAC00 \uC2E0\uB8B0\uB97C \uD06C\uAC8C \uC313\uC544\uC694." },
  { name: "\uD574\uBC14\uB77C\uAE30", message: "\uBC1D\uC740 \uCABD\uC744 \uBC14\uB77C\uBCF4\uBA74 \uC88B\uC740 \uC0AC\uB78C\uC774 \uBAA8\uC5EC\uC694. \uC624\uB298\uC740 \uBA3C\uC800 \uC6C3\uC5B4\uBCF4\uC138\uC694." },
  { name: "\uC18C\uB098\uBB34", message: "\uD754\uB4E4\uB9AC\uC9C0 \uC54A\uACE0 \uB0B4 \uC6D0\uCE59\uC744 \uC9C0\uD0A4\uBA74 \uACB0\uAD6D \uC778\uC815\uBC1B\uC544\uC694." },
  { name: "\uC870\uC57D\uB3CC", message: "\uD06C\uACE0 \uC5B4\uB824\uC6B4 \uBAA9\uD45C\uBCF4\uB2E4 \uC624\uB298 \uD560 \uC218 \uC788\uB294 \uC791\uC740 \uD55C \uAC00\uC9C0\uC5D0 \uC9D1\uC911\uD558\uC138\uC694." },
  { name: "\uBC00\uBB3C", message: "\uB4E4\uC5B4\uC624\uB294 \uAE30\uC6B4\uC774 \uAC15\uD55C \uB0A0\uC774\uC5D0\uC694. \uC81C\uC548\uC774 \uC624\uBA74 \uAE0D\uC815\uC801\uC73C\uB85C \uC0B4\uD3B4\uBCF4\uC138\uC694." },
  { name: "\uC370\uBB3C", message: "\uB0B4\uB824\uB193\uC744\uC218\uB85D \uAC00\uBCBC\uC6CC\uC9C0\uB294 \uB0A0\uC774\uC5D0\uC694. \uBB34\uB9AC\uD55C \uC695\uC2EC\uC740 \uC7A0\uC2DC \uC811\uC5B4\uB450\uC138\uC694." },
  { name: "\uB465\uC9C0", message: "\uC9D1\uC744 \uB3CC\uBCF4\uB294 \uC77C\uC5D0 \uC6B4\uC774 \uB530\uB77C\uC694. \uAC00\uC871\uACFC \uB530\uB73B\uD55C \uC2DC\uAC04\uC744 \uBCF4\uB0B4\uC138\uC694." },
  { name: "\uC885\uC774\uBC30", message: "\uBD80\uB2F4 \uC5C6\uC774 \uB744\uC6CC\uBCF8 \uC2DC\uB3C4\uAC00 \uB73B\uBC16\uC758 \uACF3\uC5D0 \uB2FF\uC544\uC694." },
  { name: "\uB9E4\uD654", message: "\uCD94\uC6B4 \uC2DC\uAE30\uC77C\uC218\uB85D \uBA3C\uC800 \uD53C\uC5B4\uB098\uB294 \uC0AC\uB78C\uC774 \uB3FC\uC694. \uAE30\uC8FD\uC9C0 \uB9C8\uC138\uC694." },
  { name: "\uB2EC\uBB34\uB9AC", message: "\uD750\uB984\uC774 \uBC14\uB00C\uB294 \uC791\uC740 \uC2E0\uD638\uAC00 \uBCF4\uC5EC\uC694. \uC0AC\uC18C\uD55C \uBCC0\uD654\uC5D0 \uADC0 \uAE30\uC6B8\uC774\uC138\uC694." },
  { name: "\uC0C8 \uC2E0\uBC1C", message: "\uC0C8\uB85C\uC6B4 \uACF3\uC73C\uB85C \uD55C \uAC78\uC74C \uB0B4\uB51B\uAE30 \uC88B\uC740 \uB0A0\uC774\uC5D0\uC694. \uBBF8\uB904\uB454 \uBC29\uBB38\uC744 \uD574\uBCF4\uC138\uC694." },
  { name: "\uBAA8\uB2E5\uBD88", message: "\uC0AC\uB78C\uB4E4\uACFC \uB458\uB7EC\uC549\uC544 \uC774\uC57C\uAE30\uD558\uBA74 \uD798\uC774 \uB098\uB294 \uB0A0\uC774\uC5D0\uC694." },
  { name: "\uD669\uAE08 \uC5F4\uB9E4", message: "\uADF8\uB3D9\uC548 \uACF5\uB4E4\uC778 \uC77C\uC5D0\uC11C \uC791\uC740 \uACB0\uC2E4\uC744 \uD655\uC778\uD558\uAC8C \uB3FC\uC694." },
  { name: "\uC740\uD558\uC218", message: "\uD06C\uAC8C \uAFC8\uAFD4\uB3C4 \uAD1C\uCC2E\uC740 \uB0A0\uC774\uC5D0\uC694. \uD558\uACE0 \uC2F6\uC740 \uC77C\uC744 \uB9C8\uC74C\uAECF \uC801\uC5B4\uBCF4\uC138\uC694." },
  { name: "\uCD08\uC2B9\uB2EC", message: "\uC2DC\uC791\uC740 \uAC00\uB298\uC5B4\uB3C4 \uC810\uC810 \uCC28\uC624\uB974\uB294 \uC6B4\uC774\uC5D0\uC694. \uC624\uB298 \uCCAB\uAC78\uC74C\uC744 \uB5BC\uC138\uC694." }
];

// lib/regions.ts
var REGIONS = ["\uC11C\uC6B8", "\uBD80\uC0B0", "\uB300\uAD6C", "\uC778\uCC9C", "\uAD11\uC8FC", "\uB300\uC804", "\uC6B8\uC0B0", "\uC138\uC885", "\uACBD\uAE30", "\uAC15\uC6D0", "\uCDA9\uBD81", "\uCDA9\uB0A8", "\uC804\uBD81", "\uC804\uB0A8", "\uACBD\uBD81", "\uACBD\uB0A8", "\uC81C\uC8FC", "\uD574\uC678\xB7\uBAA8\uB984"];

// lib/manse/correction.ts
var DST_PERIODS = [
  ["1948-06-01 00:00", "1948-09-13 00:00"],
  ["1949-04-03 00:00", "1949-09-11 00:00"],
  ["1950-04-01 00:00", "1950-09-10 00:00"],
  ["1951-05-06 00:00", "1951-09-09 00:00"],
  ["1955-05-05 00:00", "1955-09-09 00:00"],
  ["1956-05-20 00:00", "1956-09-30 00:00"],
  ["1957-05-05 00:00", "1957-09-22 00:00"],
  ["1958-05-04 00:00", "1958-09-21 00:00"],
  ["1959-05-03 00:00", "1959-09-20 00:00"],
  ["1960-05-01 00:00", "1960-09-18 00:00"],
  ["1987-05-10 02:00", "1987-10-11 03:00"],
  ["1988-05-08 02:00", "1988-10-09 03:00"]
];
var pad = (n) => String(n).padStart(2, "0");
function isDST(solarDate, hh, mm) {
  const wall = `${solarDate} ${pad(hh)}:${pad(mm)}`;
  return DST_PERIODS.some(([a, b]) => wall >= a && wall < b);
}

// components/FreeTabs.tsx
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var EL_VAR2 = { \uBAA9: "wood", \uD654: "fire", \uD1A0: "earth", \uAE08: "metal", \uC218: "water" };
var TABS = [
  { id: "saju", label: "\uBB34\uB8CC\uC0AC\uC8FC" },
  { id: "today", label: "\uC624\uB298\uC758 \uC6B4\uC138" },
  { id: "zodiac", label: "\uB760 \uC6B4\uC138" },
  { id: "manse", label: "\uB9CC\uC138\uB825" }
];
var EMPTY = { name: "", date: "", time: "", timeUnknown: false, calendar: "\uC591\uB825", leap: false, gender: "\uC5EC", region: "\uC11C\uC6B8" };
function saveBirth(b) {
  try {
    sessionStorage.setItem("rw_birth", JSON.stringify(b));
  } catch {
  }
}
var TOOL_DESC = {
  saju: "\uB124 \uAE30\uB465\uACFC \uD0C0\uACE0\uB09C \uAE30\uC6B4 \uD480\uC774",
  today: "\uBD84\uC57C\uBCC4 \uC810\uC218\uC640 \uC88B\uC740 \uC2DC\uAC04\uB300",
  zodiac: "12\uB760 \uC624\uB298\uC758 \uD750\uB984",
  manse: "\uC9C0\uC7A5\uAC04\xB7\uC2E0\uC0B4\xB7\uB300\uC6B4\xB7\uC6D4\uC6B4 \uD45C"
};
function FreeTabs({ variant = "tabs", singlePrice = 35e3, base = "" }) {
  const [tab, setTab] = (0, import_react5.useState)("saju");
  const [birth, setBirth] = (0, import_react5.useState)(EMPTY);
  const [data, setData] = (0, import_react5.useState)(null);
  const [loading, setLoading] = (0, import_react5.useState)(false);
  const [error, setError] = (0, import_react5.useState)("");
  const [flip, setFlip] = (0, import_react5.useState)(0);
  (0, import_react5.useEffect)(() => {
    try {
      const saved = sessionStorage.getItem("rw_birth");
      if (saved) setBirth({ ...EMPTY, ...JSON.parse(saved) });
    } catch {
    }
    const onHash = () => {
      const h = window.location.hash.replace("#free-", "");
      if (TABS.some((t) => t.id === h)) setTab(h);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    const onQuick = (e) => {
      const d = e.detail;
      setBirth((b) => ({ ...b, date: d }));
      setTab("saju");
    };
    window.addEventListener("rw:quick", onQuick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("rw:quick", onQuick);
    };
  }, []);
  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${base}/api/saju`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          birthDate: birth.date,
          birthTime: birth.timeUnknown ? "" : birth.time,
          calendar: birth.calendar,
          isLeapMonth: birth.calendar === "\uC74C\uB825" && birth.leap,
          gender: birth.gender,
          region: birth.region
        })
      });
      const j2 = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j2.error || "\uACC4\uC0B0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC7A0\uC2DC \uB4A4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
      setData({ ...j2, name: birth.name.trim() });
      setFlip((k) => k + 1);
    } catch (e) {
      setError(e instanceof TypeError ? "\uC5F0\uACB0\uC774 \uBD88\uC548\uC815\uD574\uC694. \uC7A0\uC2DC \uB4A4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694." : e instanceof Error ? e.message : "\uACC4\uC0B0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694.");
    } finally {
      setLoading(false);
    }
  }
  const shared = { birth, setBirth, data, loading, error, submit: () => void submit(), flip, base };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
    variant === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "tool-cards", children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("button", { id: `tab-${t.id}`, type: "button", className: "tool-card", "aria-pressed": tab === t.id, "aria-controls": `panel-${t.id}`, onClick: () => setTab(t.id), children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: t.label }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: TOOL_DESC[t.id] })
    ] }, t.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "tabs", role: "tablist", "aria-label": "\uBB34\uB8CC \uCCB4\uD5D8", children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { id: `tab-${t.id}`, role: "tab", className: "tab", "aria-selected": tab === t.id, "aria-controls": `panel-${t.id}`, onClick: () => setTab(t.id), children: t.label }, t.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { id: `panel-${tab}`, role: variant === "cards" ? "region" : "tabpanel", "aria-labelledby": `tab-${tab}`, children: [
      tab === "saju" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SajuTab, { shared, singlePrice }),
      tab === "today" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TodayTab, { shared }),
      tab === "zodiac" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ZodiacTab, {}),
      tab === "manse" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ManseTab, { shared })
    ] })
  ] });
}
function BirthForm({ shared, submitLabel, idp }) {
  const { birth, setBirth, loading, error, submit } = shared;
  const [err, setErr] = (0, import_react5.useState)("");
  const set = (k, v) => setBirth({ ...birth, [k]: v });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "form",
    {
      className: "free-form",
      onSubmit: (e) => {
        e.preventDefault();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(birth.date)) return setErr("\uC0DD\uB144\uC6D4\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694");
        const y = +birth.date.slice(0, 4);
        if (y < 1920 || y > (/* @__PURE__ */ new Date()).getFullYear()) return setErr("1920\uB144 \uC774\uD6C4 \uB0A0\uC9DC\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694");
        setErr("");
        saveBirth(birth);
        submit();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { htmlFor: `${idp}-name`, children: [
            "\uC774\uB984 ",
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "hint", children: "(\uC120\uD0DD)" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { id: `${idp}-name`, className: "input", value: birth.name, onChange: (e) => set("name", e.target.value), placeholder: "\uD64D\uAE38\uB3D9", autoComplete: "name" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { htmlFor: `${idp}-date`, children: "\uC0DD\uB144\uC6D4\uC77C" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { id: `${idp}-date`, className: "input", type: "date", value: birth.date, min: "1920-01-01", onChange: (e) => set("date", e.target.value), "aria-invalid": !!err })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "row-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "seg", role: "radiogroup", "aria-label": "\uC591\uB825 \uC74C\uB825", children: ["\uC591\uB825", "\uC74C\uB825"].map((c) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "radio", name: `${idp}-cal`, checked: birth.calendar === c, onChange: () => set("calendar", c) }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: c })
          ] }, c)) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "seg", role: "radiogroup", "aria-label": "\uC131\uBCC4", children: ["\uC5EC", "\uB0A8"].map((g) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "radio", name: `${idp}-gender`, checked: birth.gender === g, onChange: () => set("gender", g) }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: g === "\uC5EC" ? "\uC5EC\uC131" : "\uB0A8\uC131" })
          ] }, g)) })
        ] }),
        birth.calendar === "\uC74C\uB825" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "check", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "checkbox", checked: birth.leap, onChange: (e) => set("leap", e.target.checked) }),
          " \uC724\uB2EC\uC774\uC5D0\uC694"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { htmlFor: `${idp}-time`, children: "\uD0DC\uC5B4\uB09C \uC2DC\uAC04" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { id: `${idp}-time`, className: "input", type: "time", value: birth.time, disabled: birth.timeUnknown, onChange: (e) => set("time", e.target.value) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "check", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { type: "checkbox", checked: birth.timeUnknown, onChange: (e) => set("timeUnknown", e.target.checked) }),
            " \uC2DC\uAC04\uC744 \uBAB0\uB77C\uC694"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DstHint, { birth }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { htmlFor: `${idp}-region`, children: [
            "\uD0DC\uC5B4\uB09C \uC9C0\uC5ED ",
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "hint", children: "(\uC2DC\uAC01 \uBCF4\uC815\uC6A9)" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("select", { id: `${idp}-region`, className: "input", value: birth.region, onChange: (e) => set("region", e.target.value), children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: r, children: r }, r)) })
        ] }),
        (err || error) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "field error", role: "alert", children: err || error }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { className: "btn btn-primary", type: "submit", disabled: loading, "aria-busy": loading, children: loading ? "\uACC4\uC0B0\uD558\uB294 \uC911\u2026" : submitLabel }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "form-hint", children: "\uC11C\uBA38\uD0C0\uC784\uACFC \uD0DC\uC5B4\uB09C \uC9C0\uC5ED\uC758 \uC2DC\uCC28\uAE4C\uC9C0 \uB9DE\uCDB0 \uACC4\uC0B0\uD574\uC694. \uC785\uB825\uD55C \uC815\uBCF4\uB294 \uC11C\uBC84\uC5D0 \uC800\uC7A5\uD558\uC9C0 \uC54A\uC544\uC694." })
      ]
    }
  );
}
var DST_YEARS = [1948, 1949, 1950, 1951, 1955, 1956, 1957, 1958, 1959, 1960, 1987, 1988];
function DstHint({ birth }) {
  const y = +birth.date.slice(0, 4);
  if (!DST_YEARS.includes(y) || birth.timeUnknown) return null;
  if (birth.calendar === "\uC591\uB825") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth.date) || !/^\d{1,2}:\d{2}$/.test(birth.time)) return null;
    const [h, m] = birth.time.split(":").map(Number);
    if (!isDST(birth.date, h, m)) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "alert-note", role: "note", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: "\uC11C\uBA38\uD0C0\uC784 \uAE30\uAC04\uC5D0 \uD0DC\uC5B4\uB0AC\uC5B4\uC694" }),
      "\uADF8\uB54C\uB294 \uC2DC\uACC4\uB97C 1\uC2DC\uAC04 \uC55E\uB2F9\uACA8 \uC37C\uC5B4\uC694. \uAE30\uB85D\uB41C \uC2DC\uAC01 \uADF8\uB300\uB85C \uB123\uC73C\uC2DC\uBA74 1\uC2DC\uAC04\uC744 \uBE7C\uC11C \uACC4\uC0B0\uD574\uC694."
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "alert-note", role: "note", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
      y,
      "\uB144\uC5D0\uB294 \uC11C\uBA38\uD0C0\uC784\uC774 \uC788\uC5C8\uC5B4\uC694"
    ] }),
    "\uC5EC\uB984 \uB3D9\uC548 \uC2DC\uACC4\uB97C 1\uC2DC\uAC04 \uC55E\uB2F9\uACA8 \uC4F0\uB358 \uD574\uC608\uC694. \uADF8 \uAE30\uAC04\uC5D0 \uD0DC\uC5B4\uB0AC\uB2E4\uBA74 1\uC2DC\uAC04\uC744 \uBE7C\uC11C \uC790\uB3D9\uC73C\uB85C \uACC4\uC0B0\uD574\uC694."
  ] }) });
}
function DstNote({ s }) {
  const c = s.correction;
  if (!c.dst) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "alert-note", role: "note", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: "\uC11C\uBA38\uD0C0\uC784\uC744 \uBC18\uC601\uD588\uC5B4\uC694" }),
    c.original,
    "\uC5D0 \uD0DC\uC5B4\uB098\uC168\uC9C0\uB9CC \uADF8\uB54C\uB294 \uC2DC\uACC4\uB97C 1\uC2DC\uAC04 \uC55E\uB2F9\uACA8 \uC4F0\uB358 \uC11C\uBA38\uD0C0\uC784 \uAE30\uAC04\uC774\uC5C8\uC5B4\uC694. \uADF8\uB798\uC11C 1\uC2DC\uAC04\uC744 \uBE7C\uACE0",
    c.local ? ` \uD0DC\uC5B4\uB09C \uC9C0\uC5ED\uC758 \uC2DC\uCC28(${c.local > 0 ? "+" : ""}${c.local}\uBD84)\uAE4C\uC9C0 \uB9DE\uCDB0` : "",
    " ",
    c.corrected,
    " \uAE30\uC900\uC73C\uB85C \uACC4\uC0B0\uD588\uC5B4\uC694. \uC774 \uBCF4\uC815\uC744 \uD558\uC9C0 \uC54A\uC73C\uBA74 \uD0DC\uC5B4\uB09C \uC2DC\uC758 \uAE30\uB465\uC774 \uB2EC\uB77C\uC9C8 \uC218 \uC788\uC5B4\uC694."
  ] }) });
}
function PillarCards({ s, flipKey }) {
  const [shown, setShown] = (0, import_react5.useState)(0);
  (0, import_react5.useEffect)(() => {
    setShown(0);
    const timers = [0, 1, 2, 3].map((i) => setTimeout(() => setShown(i + 1), 250 + i * 280));
    return () => timers.forEach(clearTimeout);
  }, [flipKey]);
  const cols = [["\uC2DC", s.pillars.hour], ["\uC77C", s.pillars.day], ["\uC6D4", s.pillars.month], ["\uB144", s.pillars.year]];
  const order = [3, 2, 1, 0];
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pillars", children: cols.map(([label, p], i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: `pillar ${shown > order[i] ? "flipped" : ""} ${p ? "" : "empty"}`, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "pillar-inner", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pillar-face pillar-front", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pillar-face pillar-back", children: p ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "pillar-cap", children: [
        label,
        "\uC8FC \xB7 ",
        label === "\uC77C" ? "\uB098" : p.ganGod
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: `glyph el-${p.ganEl}`, children: [
        GAN[p.gan],
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: EL_PLAIN[p.ganEl] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: `glyph el-${p.jiEl}`, children: [
        JI[p.ji],
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: EL_PLAIN[p.jiEl] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "pillar-god", children: p.jiGod })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "\uC2DC\uAC04 \uBAA8\uB984" }) })
  ] }) }, label)) });
}
function ElementChart({ elements, highlight }) {
  const c = 130, R = 86;
  const pts = ELS.map((_, i) => {
    const a = (-90 + i * 72) * (Math.PI / 180);
    return { x: c + R * Math.cos(a), y: c + R * Math.sin(a) };
  });
  const total = ELS.reduce((n, e) => n + elements[e], 0) || 1;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("svg", { className: "el-chart", viewBox: "0 0 260 260", role: "img", "aria-label": `\uC624\uD589 \uBD84\uD3EC: ${ELS.map((e) => `${EL_PLAIN[e]} ${elements[e]}\uAC1C`).join(", ")}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: c, cy: c, r: R, style: { fill: "none", stroke: "var(--line)" }, strokeWidth: 1.5, strokeDasharray: "3 5" }),
    pts.map((p, i) => {
      const q = pts[(i + 2) % 5];
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, style: { stroke: "var(--line)" }, strokeWidth: 1 }, `k${i}`);
    }),
    ELS.map((e, i) => {
      const r = 14 + elements[e] / total * 44;
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: pts[i].x, cy: pts[i].y, r, style: { fill: `var(--${EL_VAR2[e]}-bg)`, stroke: `var(--${EL_VAR2[e]})`, transition: "r .8s ease" }, strokeWidth: e === highlight ? 3 : 1.5 }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: pts[i].x, y: pts[i].y - 2, textAnchor: "middle", style: { fill: `var(--${EL_VAR2[e]})`, fontSize: 13, fontWeight: 700 }, children: EL_PLAIN[e] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: pts[i].x, y: pts[i].y + 13, textAnchor: "middle", style: { fill: "var(--ink)", fontSize: 11 }, children: elements[e] })
      ] }, e);
    })
  ] });
}
function ElementLegend({ elements }) {
  const max = Math.max(...ELS.map((e) => elements[e]), 1);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "el-legend", children: ELS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: EL_PLAIN[e] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "bar", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", { style: { width: `${elements[e] / max * 100}%`, background: `var(--${EL_VAR2[e]})` } }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "num", children: elements[e] })
  ] }, e)) });
}
function ReadCard({ b, top, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "read-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "read-label", children: b.label }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { children: b.title }),
    top,
    b.body.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: t }, i)),
    b.tags && b.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "chip-row", children: b.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: t }, t)) }),
    children
  ] });
}
function SajuTab({ shared, singlePrice }) {
  const { data } = shared;
  const r = (0, import_react5.useMemo)(() => data ? buildReading(data.saju, data.name) : null, [data]);
  const s = data?.saju;
  const maxG = r ? Math.max(1, ...r.groupRows.map((g) => g.count)) : 1;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "free-grid", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(BirthForm, { idp: "saju", shared, submitLabel: "\uB0B4 \uC0AC\uC8FC \uD3BC\uCE58\uAE30" }),
    s && r && data ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "result-grid", "aria-live": "polite", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PillarCards, { s, flipKey: shared.flip }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "notice", style: { margin: 0 }, children: [s.correction.text, ...s.notes].join(" \xB7 ") }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DstNote, { s }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dm-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: `dm-emblem el-${s.dayMaster.el}`, children: GAN[s.dayMaster.gan] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { style: { fontSize: 13 }, children: [
            data.name ? `${data.name}\uB2D8\uC744` : "\uB2F9\uC2E0\uC744",
            " \uC0C1\uC9D5\uD558\uB294 \uC790\uC5F0"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { children: DAY_MASTER_CARD[s.dayMaster.gan].symbol }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: DAY_MASTER_CARD[s.dayMaster.gan].line }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "keywords", children: DAY_MASTER_CARD[s.dayMaster.gan].keywords.map((k) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: k }, k)) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ReadCard, { b: r.ilju }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        ReadCard,
        {
          b: r.strength,
          top: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "el-chart-wrap", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ElementChart, { elements: s.elements, highlight: s.helpful }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ElementLegend, { elements: s.elements }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "basis", style: { marginTop: 10 }, children: [
                "\uAD75\uC740 \uD14C\uB450\uB9AC\uAC00 \uB098\uB97C \uB3D5\uB294 ",
                EL_PLAIN[s.helpful],
                "\uC758 \uAE30\uC6B4\uC774\uC5D0\uC694."
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ReadCard, { b: r.yongsin, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "tip-row", children: r.tips.map((t) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: `tip el-${t.el}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
          EL_PLAIN[t.el],
          " \xB7 ",
          t.role
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\uC0C9 \xB7 ",
          t.color
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\uC7A5\uC18C \xB7 ",
          t.place
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\uC2B5\uAD00 \xB7 ",
          t.habit
        ] })
      ] }, t.role)) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        ReadCard,
        {
          b: r.groups,
          top: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "group-rows", children: r.groupRows.map((g) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
              g.label,
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: g.hint })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "bar", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", { style: { width: `${g.count / maxG * 100}%`, background: "var(--accent)" } }) }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "num", children: g.count })
          ] }, g.key)) })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "read-duo", children: r.life.map((b) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ReadCard, { b }, b.id)) }),
      r.sinsal.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "read-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "read-label", children: "\uD0C0\uACE0\uB09C \uC2E0\uC0B4" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { children: "\uC0AC\uC8FC\uC5D0 \uC788\uB294 \uD2B9\uBCC4\uD55C \uAE30\uC6B4" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: "\uC2E0\uC0B4\uC740 \uAE00\uC790 \uC870\uD569\uC774 \uB9CC\uB4DC\uB294 \uD2B9\uBCC4\uD55C \uC131\uC9C8\uC774\uC5D0\uC694. \uC88B\uACE0 \uB098\uC068\uBCF4\uB2E4 \uC5B4\uB5BB\uAC8C \uC4F0\uB290\uB0D0\uAC00 \uC911\uC694\uD574\uC694." }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { className: "sinsal-list", children: r.sinsal.map((x) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
            x.name,
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: x.where })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: x.text })
        ] }, x.name)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ReadCard, { b: r.relations }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ReadCard, { b: r.flow, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "luck-strip", children: s.daewoon.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: i === s.currentDaewoonIndex ? "current" : "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
          GAN[d.pillar.gan],
          JI[d.pillar.ji]
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "num", children: [
          d.age,
          "\uC138"
        ] })
      ] }, d.age)) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "report-cta", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "read-label", children: "30\uCABD \uB9AC\uD3EC\uD2B8" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { children: "\uC5EC\uAE30\uAE4C\uC9C0\uAC00 \uBB34\uB8CC \uD480\uC774\uC608\uC694. \uB9AC\uD3EC\uD2B8\uC5D0\uC11C\uB294 \uD55C \uAD8C\uC73C\uB85C \uC774\uC5B4\uC11C \uD480\uC5B4\uB4DC\uB824\uC694" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { style: { margin: 0, color: "var(--night-muted)" }, children: [
          "30\uCABD \uB9AC\uD3EC\uD2B8\uB294 \uC790\uB3D9\uC73C\uB85C \uB9CC\uB4E0 \uAE00\uC774 \uC544\uB2C8\uB77C, ",
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { style: { color: "var(--night-ink)" }, children: "\uBA85\uB9AC\uD559\uC790\uAC00 \uC9C1\uC811 \uC0AC\uC8FC\uB97C \uBD84\uC11D\uD574 \uC791\uC131\uD55C \uBD84\uC11D\uC9C0" }),
          "\uB97C \uBCF4\uB0B4\uB4DC\uB824\uC694."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: "\uAC89\uC73C\uB85C \uBCF4\uC774\uB294 \uB098\uC640 \uC18D\uC758 \uB098" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: "\uB300\uC6B4 10\uB144\uC529, \uC778\uC0DD\uC758 \uACC4\uC808 \uD480\uC774" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: "\uC55E\uC73C\uB85C 12\uAC1C\uC6D4\uC758 \uD750\uB984\uACFC 5\uB144 \uB85C\uB4DC\uB9F5" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: "\uB0A8\uACA8\uC8FC\uC2E0 \uC9C8\uBB38\uC5D0 \uB300\uD55C \uB2F5" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(Link, { className: "btn btn-primary", href: `${shared.base}/apply?product=single`, children: [
          "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD\uD558\uAE30 \xB7 ",
          singlePrice.toLocaleString("ko-KR"),
          "\uC6D0"
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(EmptyState, { text: "\uC0DD\uB144\uC6D4\uC77C\uC744 \uB123\uC73C\uBA74 \uB124 \uAE30\uB465\uC774 \uD55C \uC7A5\uC529 \uB4A4\uC9D1\uD788\uBA70 \uD3BC\uCCD0\uC9C0\uACE0, \uD0C0\uACE0\uB09C \uAE30\uC6B4 \uD480\uC774\uAC00 \uC774\uC5B4\uC838\uC694." })
  ] });
}
function EmptyState({ text }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: { display: "grid", gap: 16 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pillars", "aria-hidden": "true", children: ["\uC2DC", "\uC77C", "\uC6D4", "\uB144"].map((l) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pillar", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pillar-inner", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pillar-face pillar-front", children: l }) }) }, l)) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { style: { margin: 0, color: "var(--muted)" }, children: text })
  ] });
}
var REL_WORD = { \uD569: "\uC190\uC744 \uC7A1\uC544\uC694", \uCDA9: "\uBD80\uB52A\uD600\uC694", \uD615: "\uC11C\uB85C \uAC74\uB4DC\uB824\uC694", \uC6D0\uC9C4: "\uAEC4\uB044\uB7EC\uC6CC\uC694", \uBB34\uAD00: "\uD06C\uAC8C \uBD80\uB52A\uD788\uC9C0 \uC54A\uC544\uC694" };
function TodayTab({ shared }) {
  const t = todayKST();
  const g = dayGanji(t.y, t.m, t.d);
  const f = shared.data?.today;
  const nd = f ? new Date(Date.UTC(f.date.y, f.date.m - 1, f.date.d + 1)) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "free-grid", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(BirthForm, { idp: "today", shared, submitLabel: "\uC624\uB298 \uC6B4\uC138 \uBCF4\uAE30" }),
    f && nd ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "result-grid", "aria-live": "polite", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "fortune-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "eyebrow", style: { margin: 0 }, children: [
          f.date.m,
          "\uC6D4 ",
          f.date.d,
          "\uC77C (",
          f.date.weekday,
          ") \xB7 ",
          GAN[f.pillar.gan],
          JI[f.pillar.ji],
          "\uC77C"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { children: f.title }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "score", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { className: "num", children: f.score }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
            "\uC810 \xB7 ",
            f.band
          ] })
        ] }),
        f.summary.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { style: { margin: "10px 0 0" }, children: line }, i)),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "lucky-row four", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
            "\uD589\uC6B4\uC0C9",
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: f.lucky.color })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
            "\uD589\uC6B4 \uC22B\uC790",
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { className: "num", children: f.lucky.numbers })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
            "\uC88B\uC740 \uBC29\uD5A5",
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: f.lucky.direction })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
            "\uD589\uC6B4 \uBB3C\uAC74",
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: f.lucky.item })
          ] })
        ] })
      ] }),
      shared.data && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DstNote, { s: shared.data.saju }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "read-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "read-label", children: "\uBD84\uC57C\uBCC4 \uC6B4\uC138" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "area-list", children: f.areas.map((a) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: a.key }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "bar", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", { style: { width: `${a.score}%`, background: "var(--accent)" } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "num", children: a.score }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: a.text })
        ] }, a.key)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "read-duo", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "read-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "read-label", children: "\uC88B\uC740 \uC2DC\uAC04\uB300" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("ul", { className: "hour-list", children: [
            f.bestHours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("li", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: h.range }),
              h.why
            ] }, h.ji)),
            f.cautionHour && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("li", { className: "caution", children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
                "\uC870\uC2EC\uD560 \uC2DC\uAC04 \xB7 ",
                f.cautionHour.range
              ] }),
              f.cautionHour.why
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "read-card", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "read-label", children: [
            "\uB0B4\uC77C \uBBF8\uB9AC\uBCF4\uAE30 \xB7 ",
            nd.getUTCMonth() + 1,
            "\uC6D4 ",
            nd.getUTCDate(),
            "\uC77C ",
            GAN[f.tomorrow.pillar.gan],
            JI[f.tomorrow.pillar.ji],
            "\uC77C"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { children: f.tomorrow.title }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "score", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { className: "num", style: { fontSize: 32 }, children: f.tomorrow.score }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
              "\uC810 \xB7 ",
              f.tomorrow.band
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: f.tomorrow.line })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "read-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "read-label", children: "\uC624\uB298\uC758 \uD560 \uC77C" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "do-grid", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: "\uD558\uBA74 \uC88B\uC740 \uC77C" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { children: f.doList.map((x) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: x }, x)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: "\uD53C\uD558\uBA74 \uC88B\uC740 \uC77C" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { children: f.avoidList.map((x) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("li", { children: x }, x)) })
          ] })
        ] })
      ] }),
      (f.pillarLinks.length > 0 || f.month) && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "read-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "read-label", children: "\uB0B4 \uC0AC\uC8FC\uC640 \uC624\uB298\uC758 \uB9CC\uB0A8" }),
        f.pillarLinks.map((x) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: x }, x)),
        f.month && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
            "\uC774\uBC88 \uB2EC (",
            f.month.label,
            ")"
          ] }),
          " \u2014 ",
          f.month.text
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "basis", children: [
        "\uD480\uC774 \uADFC\uAC70 \xB7 \uC624\uB298\uC758 \uC717\uAE00\uC790\uB294 \uB098\uC5D0\uAC8C ",
        f.stemGod,
        ", \uC544\uB7AB\uAE00\uC790\uB294 ",
        f.branchGod,
        " \xB7 \uC624\uB298 \uAE30\uC6B4\uC758 \uD06C\uAE30 ",
        f.unseong,
        " \xB7 \uC624\uB298\uC758 \uAE30\uC6B4\uC774 \uB0B4\uAC00 \uC549\uC740 \uC790\uB9AC\uC640 ",
        REL_WORD[f.rel] ?? f.rel
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "fortune-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "eyebrow", style: { margin: 0 }, children: [
        "\uC624\uB298 ",
        t.m,
        "\uC6D4 ",
        t.d,
        "\uC77C"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("h3", { children: [
        GAN[g.gan],
        JI[g.ji],
        "\uC77C"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { style: { margin: 0, color: "var(--muted)" }, children: "\uC0DD\uB144\uC6D4\uC77C\uC744 \uB123\uC73C\uBA74 \uC624\uB298\uC758 \uAE30\uC6B4\uC774 \uB0B4 \uC0AC\uC8FC\uC640 \uC5B4\uB5BB\uAC8C \uB9CC\uB098\uB294\uC9C0, \uBD84\uC57C\uBCC4 \uC810\uC218\uC640 \uC88B\uC740 \uC2DC\uAC04\uB300\uAE4C\uC9C0 \uBCF4\uC5EC\uB4DC\uB824\uC694." })
    ] })
  ] });
}
function ZodiacTab() {
  const t = todayKST();
  const today = dayGanji(t.y, t.m, t.d);
  const list = (0, import_react5.useMemo)(() => zodiacFortunes(today, t.y * 1e4 + t.m * 100 + t.d), [today.idx]);
  const [sel, setSel] = (0, import_react5.useState)(animalOfYear(1994));
  const [yearInput, setYearInput] = (0, import_react5.useState)("");
  const cur = list[sel];
  const c = 160, r1 = 150, r2 = 92;
  const arc = (i) => {
    const a0 = (i * 30 - 105) * Math.PI / 180, a1 = (i * 30 - 75) * Math.PI / 180;
    const p = (r, a) => `${c + r * Math.cos(a)} ${c + r * Math.sin(a)}`;
    return `M ${p(r1, a0)} A ${r1} ${r1} 0 0 1 ${p(r1, a1)} L ${p(r2, a1)} A ${r2} ${r2} 0 0 0 ${p(r2, a0)} Z`;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "zodiac-wrap", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("svg", { className: "dial", viewBox: "0 0 320 320", role: "group", "aria-label": "\uB760 \uC120\uD0DD \uB2E4\uC774\uC5BC", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("g", { style: { transform: `rotate(${-sel * 30}deg)`, transformOrigin: "160px 160px", transition: "transform .7s cubic-bezier(.2,.7,.2,1)" }, children: list.map((z, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const tx = c + (r1 + r2) / 2 * Math.cos(a), ty = c + (r1 + r2) / 2 * Math.sin(a);
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("g", { className: "seg-g", onClick: () => setSel(i), role: "button", tabIndex: 0, "aria-label": `${z.animal}\uB760`, onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") setSel(i);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: arc(i), style: { fill: i === sel ? "var(--accent)" : "var(--surface)", stroke: "var(--line)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: tx, y: ty + 4, textAnchor: "middle", transform: `rotate(${i * 30} ${tx} ${ty})`, style: { fill: i === sel ? "#fff" : "var(--ink)", fontWeight: i === sel ? 700 : 500 }, children: z.animal })
        ] }, z.ji);
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("circle", { cx: c, cy: c, r: r2 - 8, style: { fill: "var(--night)" } }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("text", { x: c, y: c - 6, textAnchor: "middle", style: { fill: "var(--moon)", fontFamily: "var(--display)", fontSize: 30 }, children: cur.score }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("text", { x: c, y: c + 18, textAnchor: "middle", style: { fill: "var(--night-muted)", fontSize: 12 }, children: [
        cur.animal,
        "\uB760 \uC624\uB298 \uC810\uC218"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: `M ${c - 7} 4 L ${c + 7} 4 L ${c} 16 Z`, style: { fill: "var(--gold)" } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "zodiac-detail", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { className: "eyebrow", style: { margin: 0 }, children: [
        t.m,
        "\uC6D4 ",
        t.d,
        "\uC77C ",
        GAN[today.gan],
        JI[today.ji],
        "\uC77C \xB7 ",
        ANIMAL[today.ji],
        "\uC758 \uB0A0"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("h3", { children: [
        cur.animal,
        "\uB760"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { style: { margin: "0 0 6px", fontSize: 17 }, children: cur.line }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("ul", { className: "zodiac-areas", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: "\uC77C" }),
          cur.work
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: "\uB3C8" }),
          cur.money
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("b", { children: "\uC0AC\uB78C" }),
          cur.people
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { style: { margin: "10px 0 0", color: "var(--muted)", fontSize: 14.5 }, children: [
        "\uD589\uC6B4\uC0C9 ",
        cur.color,
        " \xB7 \uC88B\uC740 \uC2DC\uAC04 ",
        cur.hour,
        " \xB7 \uC798 \uB9DE\uB294 \uB760 ",
        cur.friends.join("\xB7")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("form", { style: { display: "flex", gap: 8, marginTop: 14, maxWidth: 320 }, onSubmit: (e) => {
        e.preventDefault();
        const y = +yearInput;
        if (y > 1900) setSel(animalOfYear(y));
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { htmlFor: "zodiac-year", className: "sr-only", style: { position: "absolute", left: -9999 }, children: "\uD0DC\uC5B4\uB09C \uD574" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("input", { id: "zodiac-year", className: "input", inputMode: "numeric", placeholder: "\uD0DC\uC5B4\uB09C \uD574 (\uC608: 1994)", value: yearInput, onChange: (e) => setYearInput(e.target.value.replace(/\D/g, "").slice(0, 4)) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { className: "btn btn-ghost", type: "submit", children: "\uCC3E\uAE30" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "zodiac-list", children: list.map((z, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("button", { "aria-pressed": i === sel, onClick: () => setSel(i), children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          z.animal,
          "\uB760"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "mini", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", { style: { width: `${z.score}%` } }) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "num", children: z.score })
      ] }, z.ji)) })
    ] })
  ] });
}
function ManseTable({ s, detail = false }) {
  const cols = [["\uC2DC\uC8FC", s.pillars.hour], ["\uC77C\uC8FC", s.pillars.day], ["\uC6D4\uC8FC", s.pillars.month], ["\uC5F0\uC8FC", s.pillars.year]];
  const empty = /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "glyph", style: { background: "var(--ground)", color: "var(--muted)" }, children: "?" });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("table", { className: `manse-table ${detail ? "detail" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row" }),
      cols.map(([l]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "col", children: l }, l))
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tbody", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "\uC2ED\uC2E0" }),
        cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { className: "pillar-god", children: p ? l === "\uC77C\uC8FC" ? "\uB098" : p.ganGod : "-" }, l))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "\uCC9C\uAC04" }),
        cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { children: p ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: `glyph el-${p.ganEl}`, children: [
          GAN[p.gan],
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: EL_PLAIN[p.ganEl] })
        ] }) : empty }, l))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "\uC9C0\uC9C0" }),
        cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { children: p ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: `glyph el-${p.jiEl}`, children: [
          JI[p.ji],
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: EL_PLAIN[p.jiEl] })
        ] }) : empty }, l))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "\uC2ED\uC2E0" }),
        cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { className: "pillar-god", children: p ? p.jiGod : "-" }, l))
      ] }),
      detail && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "\uC9C0\uC7A5\uAC04" }),
          cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { className: "cell-sm", children: p ? p.hidden.map((h) => `${GAN[h.gan]} ${h.god}`).join("\n").split("\n").map((x) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { children: x }, x)) : "-" }, l))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "12\uC6B4\uC131" }),
          cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { className: "cell-sm", children: p?.unseong || "-" }, l))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "12\uC2E0\uC0B4" }),
          cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { className: "cell-sm", children: p?.salYear || "-" }, l))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("th", { scope: "row", children: "\uC2E0\uC0B4" }),
          cols.map(([l, p]) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("td", { className: "cell-sm", children: p && p.sinsal.length ? p.sinsal.map((x) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { children: x }, x)) : "-" }, l))
        ] })
      ] })
    ] })
  ] });
}
function ManseTab({ shared }) {
  const s = shared.data?.saju;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "free-grid", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(BirthForm, { idp: "manse", shared, submitLabel: "\uB9CC\uC138\uB825 \uBCF4\uAE30" }),
    s ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "result-grid", "aria-live": "polite", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ManseTable, { s, detail: true }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "notice", style: { margin: 0 }, children: [s.correction.text, ...s.notes].join(" \xB7 ") }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DstNote, { s }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "chip-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\uACA9\uAD6D ",
          s.gyeokguk.name
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\uC2E0\uAC15\uC57D ",
          s.strength.grade
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\uC6A9\uC2E0 ",
          EL_PLAIN[s.yongsin.\uC6A9\uC2E0],
          " \xB7 \uD76C\uC2E0 ",
          EL_PLAIN[s.yongsin.\uD76C\uC2E0],
          " \xB7 \uAE30\uC2E0 ",
          EL_PLAIN[s.yongsin.\uAE30\uC2E0]
        ] }),
        s.gongmang.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\uACF5\uB9DD ",
          s.gongmang.join("\xB7")
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { style: { margin: "0 0 8px", fontWeight: 600 }, children: [
          "\uB300\uC6B4 ",
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { fontWeight: 400, color: "var(--muted)", fontSize: 14 }, children: "\u2014 10\uB144\uB9C8\uB2E4 \uBC14\uB00C\uB294 \uC778\uC0DD\uC758 \uACC4\uC808" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "luck-strip", children: s.daewoon.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: i === s.currentDaewoonIndex ? "current" : "", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: d.ganGod }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
            GAN[d.pillar.gan],
            JI[d.pillar.ji]
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "num", children: [
            d.age,
            "\uC138"
          ] })
        ] }, d.age)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { style: { margin: "0 0 8px", fontWeight: 600 }, children: [
          "\uC138\uC6B4 ",
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { fontWeight: 400, color: "var(--muted)", fontSize: 14 }, children: "\u2014 \uD574\uB9C8\uB2E4 \uBC14\uB00C\uB294 \uD750\uB984" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "luck-strip", children: s.sewoon.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: i === 0 ? "current" : "", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: w.ganGod }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
            GAN[w.pillar.gan],
            JI[w.pillar.ji]
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "num", children: w.year })
        ] }, w.year)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { style: { margin: "0 0 8px", fontWeight: 600 }, children: [
          "\uC6D4\uC6B4 ",
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { fontWeight: 400, color: "var(--muted)", fontSize: 14 }, children: "\u2014 \uB2EC\uB9C8\uB2E4 \uBC14\uB00C\uB294 \uD750\uB984" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "luck-strip", children: s.wolwoon.map((w) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: w.current ? "current" : "", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("small", { children: w.ganGod }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("b", { children: [
            GAN[w.pillar.gan],
            JI[w.pillar.ji]
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "num", children: [
            w.month,
            "\uC6D4"
          ] })
        ] }, `${w.year}-${w.month}`)) })
      ] }),
      s.relations.stems.length + s.relations.hap.length + s.relations.clash.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("p", { style: { margin: "0 0 8px", fontWeight: 600 }, children: [
          "\uD569\xB7\uCDA9 ",
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { style: { fontWeight: 400, color: "var(--muted)", fontSize: 14 }, children: "\u2014 \uAE00\uC790\uB07C\uB9AC \uC190\uC7A1\uACE0 \uBD80\uB52A\uD788\uB294 \uACF3" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "chip-row", children: [...s.relations.stems, ...s.relations.hap, ...s.relations.clash].map((x) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: x }, x)) })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(EmptyState, { text: "\uB124 \uAE30\uB465\uACFC \uC9C0\uC7A5\uAC04\xB712\uC6B4\uC131\xB7\uC2E0\uC0B4, \uB300\uC6B4\xB7\uC138\uC6B4\xB7\uC6D4\uC6B4\uC744 \uD45C\uB85C \uBCF4\uC5EC\uB4DC\uB824\uC694. \uC11C\uBA38\uD0C0\uC784\uACFC \uC9C0\uC5ED \uC2DC\uCC28\uAE4C\uC9C0 \uB9DE\uCDB0\uC694." })
  ] });
}

// components/ReportSample.tsx
var import_react6 = __toESM(require_react());

// lib/report.ts
var hasBatchim = (w) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 44032 && c <= 55203 ? (c - 44032) % 28 !== 0 : false;
};
var j = (w, pair) => {
  if (pair === "\uC73C\uB85C\uB85C") {
    const c = w.charCodeAt(w.length - 1);
    const b = c >= 44032 && c <= 55203 ? (c - 44032) % 28 : 0;
    return w + (b === 0 || b === 8 ? "\uB85C" : "\uC73C\uB85C");
  }
  return w + (hasBatchim(w) ? pair[0] : pair[1]);
};
var P = (e) => EL_PLAIN[e];
var EL_TRAIT = { \uBAA9: "\uC0C8\uB85C \uC2DC\uC791\uD558\uACE0 \uC790\uB77C\uB098\uB824\uB294 \uD798", \uD654: "\uB4DC\uB7EC\uB0B4\uACE0 \uD45C\uD604\uD558\uB294 \uD798", \uD1A0: "\uBD99\uC7A1\uACE0 \uC911\uC2EC\uC744 \uC7A1\uB294 \uD798", \uAE08: "\uC790\uB974\uACE0 \uC815\uB9AC\uD558\uB294 \uD798", \uC218: "\uC2A4\uBA70\uB4E4\uACE0 \uAE4A\uC774 \uC0DD\uAC01\uD558\uB294 \uD798" };
var EL_BODY2 = { \uBAA9: "\uAC04\uACFC \uADFC\uC721, \uB208\uC758 \uD53C\uB85C", \uD654: "\uC2EC\uC7A5\uACFC \uD608\uC561\uC21C\uD658, \uC218\uBA74", \uD1A0: "\uC704\uC7A5\uACFC \uC18C\uD654", \uAE08: "\uD3D0\uC640 \uD638\uD761\uAE30, \uD53C\uBD80", \uC218: "\uC2E0\uC7A5\uACFC \uBC29\uAD11, \uBAB8\uC758 \uC218\uBD84 \uADE0\uD615" };
var EL_FIELD = { \uBAA9: "\uAD50\uC721, \uAE30\uD68D, \uCF58\uD150\uCE20, \uC131\uC7A5\uC2DC\uD0A4\uB294 \uC77C", \uD654: "\uBC29\uC1A1, \uB514\uC790\uC778, \uB9C8\uCF00\uD305, \uC0AC\uB78C \uC55E\uC5D0 \uC11C\uB294 \uC77C", \uD1A0: "\uBD80\uB3D9\uC0B0, \uC911\uAC1C, \uAD00\uB9AC, \uC0AC\uB78C\uC744 \uC787\uB294 \uC77C", \uAE08: "\uAE08\uC735, \uBC95, \uAE30\uC220, \uAE30\uC900\uC744 \uC138\uC6B0\uB294 \uC77C", \uC218: "\uC5F0\uAD6C, \uC0C1\uB2F4, \uC720\uD1B5, \uD750\uB984\uC744 \uB2E4\uB8E8\uB294 \uC77C" };
var EL_HABIT = { \uBAA9: "\uC544\uCE68 \uC0B0\uCC45, \uC2DD\uBB3C \uAE30\uB974\uAE30, \uC0C8 \uACC4\uD68D \uC138\uC6B0\uAE30", \uD654: "\uD587\uBE5B \uCB10\uAE30, \uAC00\uBCBC\uC6B4 \uC6B4\uB3D9, \uC0AC\uB78C \uB9CC\uB098\uAE30", \uD1A0: "\uADDC\uCE59\uC801\uC778 \uC2DD\uC0AC, \uC9D1 \uC815\uB9AC, \uAFB8\uC900\uD55C \uC800\uCD95", \uAE08: "\uBB3C\uAC74 \uBE44\uC6B0\uAE30, \uC77C\uC815 \uC815\uB9AC, \uD638\uD761 \uC6B4\uB3D9", \uC218: "\uCDA9\uBD84\uD55C \uC218\uBA74, \uBB3C \uC790\uC8FC \uB9C8\uC2DC\uAE30, \uD63C\uC790 \uC0DD\uAC01\uD558\uB294 \uC2DC\uAC04" };
var CAT_OF = { \uBE44\uACAC: "same", \uAC81\uC7AC: "same", \uC2DD\uC2E0: "output", \uC0C1\uAD00: "output", \uD3B8\uC7AC: "wealth", \uC815\uC7AC: "wealth", \uD3B8\uAD00: "power", \uC815\uAD00: "power", \uD3B8\uC778: "support", \uC815\uC778: "support" };
var CAT_NAME = { same: "\uB098\uC640 \uAC19\uC740 \uAE30\uC6B4", output: "\uD45C\uD604\uC758 \uAE30\uC6B4", wealth: "\uB3C8\uACFC \uACB0\uACFC\uC758 \uAE30\uC6B4", power: "\uCC45\uC784\uC758 \uAE30\uC6B4", support: "\uBC30\uC6C0\uACFC \uB3C4\uC6C0\uC758 \uAE30\uC6B4" };
var CAT_TEXT = {
  same: { outer: "\uC2A4\uC2A4\uB85C \uC11C\uB824\uB294 \uC0AC\uB78C, \uC790\uAE30 \uBAAB\uC744 \uBD84\uBA85\uD788 \uD558\uB294 \uC0AC\uB78C", strong: "\uD63C\uC790\uC11C\uB3C4 \uB05D\uAE4C\uC9C0 \uD574\uB0B4\uB294 \uC790\uB9BD\uC2EC", caution: "\uB3C4\uC6C0\uC744 \uCCAD\uD558\uC9C0 \uC54A\uACE0 \uB2E4 \uB5A0\uC548\uB294 \uC2B5\uAD00", work: "\uB0B4 \uC774\uB984\uC744 \uAC78\uACE0 \uCC45\uC784\uC9C0\uB294 \uBC29\uC2DD, \uB3D9\uB8CC\uC640 \uB098\uB780\uD788 \uB6F0\uB294 \uBC29\uC2DD", money: "\uB0B4\uAC00 \uC9C1\uC811 \uBC8C\uACE0 \uC9C1\uC811 \uAD00\uB9AC\uD560 \uB54C \uAC00\uC7A5 \uC798 \uBAA8\uC5EC\uC694", love: "\uB300\uB4F1\uD55C \uAD00\uACC4\uB97C \uC6D0\uD558\uACE0, \uC874\uC911\uBC1B\uC9C0 \uBABB\uD55C\uB2E4\uACE0 \uB290\uB07C\uBA74 \uBE68\uB9AC \uC2DD\uC5B4\uC694" },
  output: { outer: "\uB9D0\uACFC \uACB0\uACFC\uBB3C\uB85C \uC790\uC2E0\uC744 \uBCF4\uC5EC\uC8FC\uB294 \uC0AC\uB78C", strong: "\uC544\uC774\uB514\uC5B4\uB97C \uD615\uD0DC\uB85C \uB9CC\uB4DC\uB294 \uC7AC\uB2A5", caution: "\uC0DD\uAC01\uC774 \uC55E\uC11C \uB9C8\uBB34\uB9AC\uAC00 \uB2A6\uC5B4\uC9C0\uB294 \uC2B5\uAD00", work: "\uB9CC\uB4E4\uACE0 \uC54C\uB9AC\uB294 \uBC29\uC2DD, \uC790\uC728\uC774 \uBCF4\uC7A5\uB418\uB294 \uD658\uACBD", money: "\uC7AC\uB2A5\uC774 \uC54C\uB824\uC9C8\uC218\uB85D \uB3C8\uC774 \uB530\uB77C\uC624\uB294 \uD750\uB984\uC774\uC5D0\uC694", love: "\uD45C\uD604\uC774 \uD48D\uBD80\uD558\uACE0, \uC0C1\uB300\uB97C \uCC59\uAE30\uB294 \uB370\uC11C \uC0AC\uB791\uC744 \uB290\uAEF4\uC694" },
  wealth: { outer: "\uD604\uC2E4\uC801\uC774\uACE0 \uACB0\uACFC\uB97C \uCC59\uAE30\uB294 \uC0AC\uB78C", strong: "\uAE30\uD68C\uB97C \uC54C\uC544\uBCF4\uACE0 \uC190\uC5D0 \uC950\uB294 \uAC10\uAC01", caution: "\uB208\uC55E\uC758 \uC774\uC775 \uB54C\uBB38\uC5D0 \uC0AC\uB78C\uC744 \uB193\uCE58\uB294 \uC2B5\uAD00", work: "\uC22B\uC790\uB85C \uC131\uACFC\uAC00 \uBCF4\uC774\uB294 \uBC29\uC2DD, \uAC70\uB798\uC640 \uAD00\uB9AC\uAC00 \uC788\uB294 \uC77C", money: "\uB3C8\uC758 \uD750\uB984\uC744 \uC77D\uB294 \uB208\uC774 \uC788\uC5B4\uC694. \uAD00\uB9AC\uB9CC \uC798\uD558\uBA74 \uBD88\uC5B4\uB098\uC694", love: "\uCC45\uC784\uAC10 \uC788\uAC8C \uCC59\uAE30\uB294 \uC5F0\uC560\uB97C \uD574\uC694. \uC0DD\uD65C\uC774 \uB9DE\uB294 \uC0AC\uB78C\uC774 \uD3B8\uD574\uC694" },
  power: { outer: "\uBBFF\uC74C\uC9C1\uD558\uACE0 \uADDC\uCE59\uC744 \uC9C0\uD0A4\uB294 \uC0AC\uB78C", strong: "\uB9E1\uC740 \uC77C\uC744 \uD750\uD2B8\uB7EC\uC9D0 \uC5C6\uC774 \uB05D\uB0B4\uB294 \uCC45\uC784\uAC10", caution: "\uC2A4\uC2A4\uB85C\uB97C \uB108\uBB34 \uBAB0\uC544\uBD99\uC774\uB294 \uC2B5\uAD00", work: "\uC870\uC9C1\uACFC \uCCB4\uACC4 \uC548\uC5D0\uC11C \uC778\uC815\uBC1B\uB294 \uBC29\uC2DD", money: "\uC548\uC815\uC801\uC778 \uC218\uC785 \uAD6C\uC870\uB97C \uB9CC\uB4E4 \uB54C \uB9C8\uC74C\uC774 \uD3B8\uD574\uC694", love: "\uC2E0\uC911\uD558\uAC8C \uC2DC\uC791\uD558\uC9C0\uB9CC \uD55C\uBC88 \uC815\uD558\uBA74 \uC624\uB798 \uAC00\uC694" },
  support: { outer: "\uC0DD\uAC01\uC774 \uAE4A\uACE0 \uBC30\uC6B0\uAE30\uB97C \uC88B\uC544\uD558\uB294 \uC0AC\uB78C", strong: "\uBC30\uC6B4 \uAC83\uC744 \uB0B4 \uAC83\uC73C\uB85C \uB9CC\uB4DC\uB294 \uD761\uC218\uB825", caution: "\uC900\uBE44\uB9CC \uD558\uB2E4 \uC2DC\uC791\uC744 \uBBF8\uB8E8\uB294 \uC2B5\uAD00", work: "\uC804\uBB38\uC131\uC744 \uC313\uC544 \uC778\uC815\uBC1B\uB294 \uBC29\uC2DD, \uAC00\uB974\uCE58\uACE0 \uC870\uC5B8\uD558\uB294 \uC77C", money: "\uC790\uACA9\uACFC \uC2E4\uB825\uC774 \uACE7 \uB3C8\uC774 \uB418\uB294 \uD750\uB984\uC774\uC5D0\uC694", love: "\uB9C8\uC74C\uC774 \uD1B5\uD558\uB294 \uB300\uD654\uB97C \uC911\uC694\uD558\uAC8C \uC5EC\uAE30\uACE0, \uBCF4\uC0B4\uD54C\uC744 \uC8FC\uACE0\uBC1B\uC544\uC694" }
};
var REL_YEAR = {
  same: "\uC8FC\uBCC0\uC5D0 \uB098\uC640 \uBE44\uC2B7\uD55C \uC0AC\uB78C\uC774 \uB298\uACE0 \uACBD\uC7C1\uB3C4 \uC0DD\uAE30\uB294 \uD750\uB984\uC774\uC5D0\uC694. \uD611\uC5C5\uC758 \uADDC\uCE59\uC744 \uBD84\uBA85\uD788 \uD558\uBA74 \uD798\uC774 \uB450 \uBC30\uAC00 \uB3FC\uC694.",
  output: "\uC7AC\uB2A5\uACFC \uD45C\uD604\uC774 \uBC16\uC73C\uB85C \uB098\uAC00\uB294 \uD750\uB984\uC774\uC5D0\uC694. \uBBF8\uB904\uB454 \uC2DC\uC791\uC744 \uD574\uBCFC \uB9CC\uD55C \uC2DC\uAE30\uC608\uC694.",
  wealth: "\uACB0\uACFC\uC640 \uB3C8\uC774 \uC6C0\uC9C1\uC774\uB294 \uD750\uB984\uC774\uC5D0\uC694. \uAE30\uD68C\uAC00 \uC624\uB294 \uB9CC\uD07C \uC9C0\uCD9C \uAD00\uB9AC\uB3C4 \uD568\uAED8 \uCC59\uACA8\uC57C \uD574\uC694.",
  power: "\uCC45\uC784\uACFC \uC790\uB9AC\uAC00 \uBB34\uAC70\uC6CC\uC9C0\uB294 \uD750\uB984\uC774\uC5D0\uC694. \uBC84\uD2F0\uB294 \uB9CC\uD07C \uC778\uC815\uC774 \uB530\uB77C\uC640\uC694.",
  support: "\uBC30\uC6C0\uACFC \uB3C4\uC6C0\uC774 \uB4E4\uC5B4\uC624\uB294 \uD750\uB984\uC774\uC5D0\uC694. \uACF5\uBD80, \uC790\uACA9, \uC88B\uC740 \uC870\uC5B8\uC790\uB97C \uB9CC\uB098\uAE30 \uC88B\uC544\uC694."
};
function dominantCat(s) {
  const count = { same: 0, output: 0, wealth: 0, power: 0, support: 0 };
  const ps = [s.pillars.year, s.pillars.month, s.pillars.day, s.pillars.hour];
  ps.forEach((p, i) => {
    if (!p) return;
    if (i !== 2) count[CAT_OF[p.ganGod]]++;
    count[CAT_OF[p.jiGod]] += i === 1 ? 2 : 1;
  });
  return Object.keys(count).sort((a, b) => count[b] - count[a])[0];
}
function monthGanji(year, month) {
  const yg = yearGanji(month >= 2 ? year : year - 1);
  const ji = month % 12;
  const gan = ((yg.gan % 5 * 2 + 2) % 10 + (ji - 2 + 12) % 12) % 10;
  return ganji(ganjiFromParts(gan, ji));
}
var MAIN_TOC = [
  { no: 1, title: "\uD45C\uC9C0", part: "cover" },
  { no: 2, title: "\uBAA9\uCC28", part: "base" },
  { no: 3, title: "\uB9CC\uC138\uB825\uD45C", part: "base" },
  { no: 4, title: "\uC624\uD589\uD45C", part: "base" },
  { no: 5, title: "\uB300\uC6B4\xB7\uC138\uC6B4\uD45C", part: "base" },
  { no: 6, title: "\uB4E4\uC5B4\uAC00\uBA70: \uB2F9\uC2E0\uC758 \uC0AC\uC8FC\uB97C \uD55C \uBB38\uC7A5\uC73C\uB85C", part: "self" },
  { no: 7, title: "\uB098\uB97C \uC0C1\uC9D5\uD558\uB294 \uAE30\uC6B4", part: "self" },
  { no: 8, title: "\uB118\uCE58\uB294 \uD798, \uBAA8\uC790\uB780 \uD798", part: "self" },
  { no: 9, title: "\uB0B4\uAC8C \uD544\uC694\uD55C \uAE30\uC6B4", part: "self" },
  { no: 10, title: "\uAC89\uC73C\uB85C \uBCF4\uC774\uB294 \uB098, \uC18D\uC758 \uB098", part: "self" },
  { no: 11, title: "\uD0C0\uACE0\uB09C \uAC15\uC810\uACFC \uC870\uC2EC\uD560 \uC2B5\uAD00", part: "self" },
  { no: 12, title: "\uC798 \uB9DE\uB294 \uC77C\uC758 \uBC29\uC2DD", part: "life" },
  { no: 13, title: "\uC9C1\uC5C5\uACFC \uC9C4\uB85C \uBC29\uD5A5", part: "life" },
  { no: 14, title: "\uB3C8\uC774 \uB4E4\uC5B4\uC624\uB294 \uAE38", part: "life" },
  { no: 15, title: "\uB3C8\uC774 \uC0C8\uB294 \uAE38, \uC9C0\uD0A4\uB294 \uBC95", part: "life" },
  { no: 16, title: "\uC5F0\uC560\uD560 \uB54C\uC758 \uB098", part: "life" },
  { no: 17, title: "\uBC30\uC6B0\uC790 \uC790\uB9AC\uC640 \uACB0\uD63C \uD750\uB984", part: "life" },
  { no: 18, title: "\uAC00\uC871\uACFC \uC0AC\uB78C \uAD00\uACC4", part: "life" },
  { no: 19, title: "\uAC74\uAC15: \uC57D\uD55C \uACE0\uB9AC \uCC59\uAE30\uAE30", part: "life" },
  { no: 20, title: "\uC778\uC0DD\uC758 \uACC4\uC808, \uC9C0\uB098\uC628 \uB300\uC6B4", part: "time" },
  { no: 21, title: "\uC9C0\uAE08\uC758 \uB300\uC6B4", part: "time" },
  { no: 22, title: "\uB2E4\uC74C \uB300\uC6B4 \uC900\uBE44", part: "time" },
  { no: 23, title: "\uC62C\uD574\uC758 \uD750\uB984", part: "time" },
  { no: 24, title: "\uC55E\uC73C\uB85C 12\uAC1C\uC6D4 \u2460", part: "time" },
  { no: 25, title: "\uC55E\uC73C\uB85C 12\uAC1C\uC6D4 \u2461", part: "time" },
  { no: 26, title: "\uC55E\uC73C\uB85C 5\uB144 \uB85C\uB4DC\uB9F5", part: "time" },
  { no: 27, title: "\uAE30\uC6B4\uC744 \uCC44\uC6B0\uB294 \uC0DD\uD65C\uBC95", part: "act" },
  { no: 28, title: "\uB0A8\uACA8\uC8FC\uC2E0 \uC9C8\uBB38\uC5D0 \uB300\uD55C \uB2F5", part: "act" },
  { no: 29, title: "\uB9C8\uBB34\uB9AC \uD3B8\uC9C0", part: "act" },
  { no: 30, title: "\uB4B7\uD45C\uC9C0", part: "cover" }
];
function mainTexts(s, name, question, issued, signature) {
  const dm = s.dayMaster;
  const card = DAY_MASTER_CARD[dm.gan];
  const me = dm.el;
  const sorted = [...ELS].sort((a, b) => s.elements[b] - s.elements[a]);
  const strong = sorted[0];
  const weak = sorted[sorted.length - 1];
  const zeros = ELS.filter((e) => s.elements[e] === 0);
  const help = s.helpful;
  const cat = dominantCat(s);
  const ct = CAT_TEXT[cat];
  const dayJiCat = CAT_OF[s.pillars.day.jiGod];
  const monthCat = CAT_OF[s.pillars.month.jiGod];
  const wealthEl = GEUK[me];
  const cur = s.daewoon[Math.max(0, s.currentDaewoonIndex)];
  const next = s.daewoon[Math.min(9, Math.max(0, s.currentDaewoonIndex) + 1)];
  const relDw = (g) => relationOf(me, GAN_EL[g.gan]);
  const thisYear = s.sewoon[0];
  const nm = name || "\uB2F9\uC2E0";
  const thesis = `${j(card.symbol, "\uC774\uAC00")} ${P(help)}\uC758 \uAE30\uC6B4\uC744 \uB9CC\uB098 \uC81C \uBAA8\uC2B5\uC744 \uCC3E\uC544\uAC00\uB294 \uC774\uC57C\uAE30`;
  const months = Array.from({ length: 12 }, (_, i) => {
    const t = new Date(issued.getFullYear(), issued.getMonth() + i, 15);
    const g = monthGanji(t.getFullYear(), t.getMonth() + 1);
    const r = relationOf(me, GAN_EL[g.gan]);
    const tone = { same: "\uC0AC\uB78C\uC774 \uBAA8\uC774\uACE0 \uACBD\uC7C1\uB3C4 \uC0DD\uAE30\uB294 \uB2EC", output: "\uD45C\uD604\uD558\uACE0 \uC2DC\uC791\uD558\uAE30 \uC88B\uC740 \uB2EC", wealth: "\uC131\uACFC\uB97C \uCC59\uAE30\uACE0 \uC9C0\uCD9C\uC744 \uC0B4\uD544 \uB2EC", power: "\uCC45\uC784\uC744 \uB2E4\uD558\uBA74 \uC778\uC815\uBC1B\uB294 \uB2EC", support: "\uBC30\uC6B0\uACE0 \uB3C4\uC6C0\uC744 \uBC1B\uAE30 \uC88B\uC740 \uB2EC" };
    return `${t.getFullYear()}\uB144 ${t.getMonth() + 1}\uC6D4 \u2014 ${tone[r]}${branchLink(s.pillars.day.ji, g.ji) === "chung" ? ". \uC774\uB3D9\uACFC \uBCC0\uD654\uAC00 \uACB9\uCE58\uB2C8 \uD070 \uACB0\uC815\uC740 \uD55C \uBC88 \uB354 \uC0B4\uD53C\uC138\uC694" : ""}.`;
  });
  return {
    6: [
      `\uC0AC\uC8FC\uB294 \uD0DC\uC5B4\uB09C \uD574, \uB2EC, \uB0A0, \uC2DC\uAC04\uC744 \uB124 \uAC1C\uC758 \uAE30\uB465\uC73C\uB85C \uC138\uC6B4 \uAC83\uC774\uC5D0\uC694. \uC774 \uB124 \uAE30\uB465\uC5D0 \uB2F4\uAE34 \uAE30\uC6B4\uC774 \uC5B4\uB5BB\uAC8C \uC5B4\uC6B8\uB9AC\uB294\uC9C0\uB97C \uC77D\uB294 \uAC83\uC774 \uC0AC\uC8FC \uD480\uC774\uC785\uB2C8\uB2E4.`,
      `${nm}\uB2D8\uC758 \uC0AC\uC8FC\uB97C \uD55C \uBB38\uC7A5\uC73C\uB85C \uB9D0\uD558\uBA74 \uC774\uB807\uC2B5\uB2C8\uB2E4. "${thesis}"`,
      `\uC774 \uB9AC\uD3EC\uD2B8\uC758 \uBAA8\uB4E0 \uCABD\uC740 \uC774 \uD55C \uBB38\uC7A5\uC744 \uD480\uC5B4\uAC00\uB294 \uACFC\uC815\uC774\uC5D0\uC694. \uBA3C\uC800 \uD0C0\uACE0\uB09C \uBAA8\uC2B5\uC744 \uBCF4\uACE0, \uC77C\uACFC \uB3C8\uACFC \uC0AC\uB791\uC73C\uB85C \uB113\uD600 \uAC04 \uB2E4\uC74C, \uC2DC\uAC04\uC758 \uD750\uB984 \uC18D\uC5D0\uC11C \uC5B8\uC81C \uBB34\uC5C7\uC744 \uD558\uBA74 \uC88B\uC740\uC9C0\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4.`
    ],
    7: [
      `\uC0AC\uC8FC\uC5D0\uC11C \uAC00\uC7A5 \uC911\uC694\uD55C \uAE00\uC790\uB294 \uD0DC\uC5B4\uB09C \uB0A0\uC758 \uC717\uAE00\uC790\uC778 '\uC77C\uAC04'\uC774\uC5D0\uC694. \uC77C\uAC04\uC740 \uB098 \uC790\uC2E0\uC744 \uC0C1\uC9D5\uD558\uB294 \uAE30\uC6B4\uC73C\uB85C, \uB098\uBA38\uC9C0 \uC77C\uACF1 \uAE00\uC790\uB294 \uBAA8\uB450 \uC774 \uC77C\uAC04\uC744 \uAE30\uC900\uC73C\uB85C \uC77D\uC2B5\uB2C8\uB2E4.`,
      `${nm}\uB2D8\uC758 \uC77C\uAC04\uC740 ${GAN[dm.gan]}, \uC790\uC5F0\uC73C\uB85C \uBE44\uC720\uD558\uBA74 ${card.symbol}\uC785\uB2C8\uB2E4. ${card.line}`,
      `\uC774 \uAE30\uC6B4\uC744 \uC124\uBA85\uD558\uB294 \uC138 \uB2E8\uC5B4\uB294 ${card.keywords.join(", ")}\uC774\uC5D0\uC694. \uB2E4\uC74C \uCABD\uC5D0\uC11C\uB294 \uC774 ${P(me)}\uC758 \uAE30\uC6B4\uC774 \uC0AC\uC8FC \uC548\uC5D0\uC11C \uC5BC\uB9C8\uB098 \uD798\uC744 \uBC1B\uACE0 \uC788\uB294\uC9C0 \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.`
    ],
    8: [
      `\uC138\uC0C1\uC758 \uAE30\uC6B4\uC744 \uB098\uBB34, \uBD88, \uD759, \uC1E0, \uBB3C \uB2E4\uC12F \uAC00\uC9C0\uB85C \uB098\uB208 \uAC83\uC744 '\uC624\uD589'\uC774\uB77C\uACE0 \uD574\uC694. \uB098\uBB34\uB294 \uBD88\uC744 \uC0B4\uB9AC\uACE0, \uBD88\uC740 \uD759\uC744 \uB9CC\uB4E4\uACE0, \uD759\uC740 \uC1E0\uB97C \uD488\uACE0, \uC1E0\uB294 \uBB3C\uC744 \uB9FA\uACE0, \uBB3C\uC740 \uB2E4\uC2DC \uB098\uBB34\uB97C \uD0A4\uC6C1\uB2C8\uB2E4.`,
      `${nm}\uB2D8\uC758 \uC0AC\uC8FC\uC5D0\uC11C \uAC00\uC7A5 \uB9CE\uC740 \uAE30\uC6B4\uC740 ${P(strong)}(${s.elements[strong]}\uAC1C)\uC608\uC694. ${EL_TRAIT[strong]}\uC774 \uC0B6\uC758 \uAE30\uBCF8\uAC12\uCC98\uB7FC \uC791\uB3D9\uD55C\uB2E4\uB294 \uB73B\uC785\uB2C8\uB2E4.`,
      zeros.length ? `\uBC18\uB300\uB85C ${zeros.map(P).join(", ")}\uC758 \uAE30\uC6B4\uC740 \uC0AC\uC8FC\uC5D0 \uB4DC\uB7EC\uB098 \uC788\uC9C0 \uC54A\uC544\uC694. \uC5C6\uB2E4\uB294 \uAC83\uC740 \uBD80\uC871\uD568\uC774 \uC544\uB2C8\uB77C, \uC0B4\uBA74\uC11C \uC0AC\uB78C\uACFC \uD658\uACBD\uC73C\uB85C \uCC44\uC6CC \uAC08 \uC790\uB9AC\uAC00 \uC788\uB2E4\uB294 \uB73B\uC774\uC5D0\uC694.` : `\uAC00\uC7A5 \uC801\uC740 \uAE30\uC6B4\uC740 ${P(weak)}(${s.elements[weak]}\uAC1C)\uC608\uC694. \uB2E4\uC12F \uAE30\uC6B4\uC774 \uBAA8\uB450 \uC788\uC5B4 \uC5B4\uB290 \uD55C\uCABD\uC73C\uB85C \uD06C\uAC8C \uCE58\uC6B0\uCE58\uC9C0 \uC54A\uB294 \uAD6C\uC131\uC785\uB2C8\uB2E4.`
    ],
    9: [
      `\uC0AC\uC8FC\uC5D0\uC11C\uB294 \uB098\uB97C \uBC1B\uCCD0\uC8FC\uB294 \uAE30\uC6B4\uC774 \uB9CE\uC73C\uBA74 '\uC2E0\uAC15', \uC801\uC73C\uBA74 '\uC2E0\uC57D'\uC774\uB77C\uACE0 \uD574\uC694. \uC88B\uACE0 \uB098\uC068\uC774 \uC544\uB2C8\uB77C, \uC5D0\uB108\uC9C0\uB97C \uBC16\uC73C\uB85C \uC368\uC57C \uD3B8\uD55C \uC0AC\uB78C\uC778\uC9C0 \uCC44\uC6CC\uC57C \uD3B8\uD55C \uC0AC\uB78C\uC778\uC9C0\uB97C \uC54C\uB824\uC8FC\uB294 \uAE30\uC900\uC774\uC5D0\uC694.`,
      `${nm}\uB2D8\uC740 ${s.strength.label === "\uADE0\uD615" ? "\uBC1B\uCCD0\uC8FC\uB294 \uD798\uACFC \uC4F0\uB294 \uD798\uC774 \uBE44\uC2B7\uD55C \uADE0\uD615\uD615" : s.strength.label === "\uAC15\uD55C \uD3B8" ? "\uBC1B\uCCD0\uC8FC\uB294 \uD798\uC774 \uAC15\uD55C \uD3B8\uC774\uB77C, \uC5D0\uB108\uC9C0\uB97C \uBC16\uC73C\uB85C \uC4F8 \uB54C \uC624\uD788\uB824 \uD3B8\uD574\uC9C0\uB294 \uC0AC\uB78C" : "\uBC1B\uCCD0\uC8FC\uB294 \uD798\uC774 \uC57D\uD55C \uD3B8\uC774\uB77C, \uBA3C\uC800 \uCC44\uC6B0\uACE0 \uC26C\uC5B4\uC57C \uBA40\uB9AC \uAC00\uB294 \uC0AC\uB78C"}\uC774\uC5D0\uC694.`,
      `\uADF8\uB798\uC11C ${nm}\uB2D8\uAED8 \uAC00\uC7A5 \uB3C4\uC6C0\uC774 \uB418\uB294 \uAE30\uC6B4\uC740 ${P(help)}\uC785\uB2C8\uB2E4. ${EL_TRAIT[help]}\uC744 \uACC1\uC5D0 \uB458\uC218\uB85D \uC55E \uCABD\uC5D0\uC11C \uBCF8 ${card.symbol}\uC758 \uBAA8\uC2B5\uC774 \uB354 \uC120\uBA85\uD574\uC838\uC694.`
    ],
    10: [
      `\uC77C\uAC04\uC744 \uAE30\uC900\uC73C\uB85C \uB2E4\uB978 \uAE00\uC790\uB4E4\uC774 \uC5B4\uB5A4 \uC5ED\uD560\uC744 \uD558\uB294\uC9C0 \uB2E4\uC12F \uAC08\uB798\uB85C \uB098\uB208 \uAC83\uC744 '\uC2ED\uC2E0'\uC774\uB77C\uACE0 \uD574\uC694. \uB098\uC640 \uAC19\uC740 \uAE30\uC6B4, \uD45C\uD604\uC758 \uAE30\uC6B4, \uB3C8\uACFC \uACB0\uACFC\uC758 \uAE30\uC6B4, \uCC45\uC784\uC758 \uAE30\uC6B4, \uBC30\uC6C0\uACFC \uB3C4\uC6C0\uC758 \uAE30\uC6B4\uC785\uB2C8\uB2E4.`,
      `${nm}\uB2D8\uC758 \uC0AC\uC8FC\uC5D0\uC11C \uAC00\uC7A5 \uB450\uB4DC\uB7EC\uC9C4 \uAC83\uC740 ${CAT_NAME[cat]}\uC774\uC5D0\uC694. \uADF8\uB798\uC11C \uBC16\uC5D0\uC11C\uB294 ${ct.outer}\uC73C\uB85C \uBCF4\uC774\uAE30 \uC26C\uC6CC\uC694.`,
      `\uC0AC\uD68C\uC0DD\uD65C\uC758 \uC790\uB9AC\uC778 \uD0DC\uC5B4\uB09C \uB2EC\uC5D0\uB294 ${CAT_NAME[monthCat]}\uC774, \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uC0AC\uB78C \uC55E\uC758 \uB098\uB97C \uBCF4\uC5EC\uC8FC\uB294 \uD0DC\uC5B4\uB09C \uB0A0 \uC544\uB7AB\uC790\uB9AC\uC5D0\uB294 ${CAT_NAME[dayJiCat]}\uC774 \uC788\uC5B4\uC694. \uAC89\uACFC \uC18D\uC774 ${monthCat === dayJiCat ? "\uAC19\uC740 \uBC29\uD5A5\uC774\uB77C \uD55C\uACB0\uAC19\uB2E4\uB294 \uB9D0\uC744 \uB4E3\uB294" : "\uC870\uAE08 \uB2EC\uB77C\uC11C, \uCE5C\uD574\uC9C4 \uB4A4\uC5D0\uC57C \uBCF4\uC774\uB294 \uBAA8\uC2B5\uC774 \uC788\uB294"} \uC0AC\uB78C\uC785\uB2C8\uB2E4.`
    ],
    11: [
      `\uC9C0\uAE08\uAE4C\uC9C0 \uBCF8 \uAE30\uC6B4\uC744 \uBAA8\uC73C\uBA74 ${nm}\uB2D8\uC758 \uAC00\uC7A5 \uD070 \uAC15\uC810\uC740 ${ct.strong}\uC774\uC5D0\uC694.`,
      `\uB2E4\uB9CC \uAC15\uC810\uC774 \uC9C0\uB098\uCE58\uBA74 ${ct.caution}\uC73C\uB85C \uC774\uC5B4\uC9C0\uAE30 \uC26C\uC6CC\uC694. \uC774\uAC74 \uACE0\uCE60 \uC131\uACA9\uC774 \uC544\uB2C8\uB77C, \uC54C\uC544\uCC28\uB9AC\uAE30\uB9CC \uD574\uB3C4 \uC904\uC5B4\uB4DC\uB294 \uC2B5\uAD00\uC785\uB2C8\uB2E4.`,
      `\uC774\uC81C \uC774 \uD0C0\uACE0\uB09C \uBAA8\uC2B5\uC774 \uC77C\uACFC \uB3C8, \uC0AC\uB791\uC5D0\uC11C \uC5B4\uB5BB\uAC8C \uB4DC\uB7EC\uB098\uB294\uC9C0 \uC774\uC5B4\uC11C \uBCFC\uAC8C\uC694.`
    ],
    12: [
      `\uC55E\uC5D0\uC11C \uBCF8 ${CAT_NAME[cat]}\uC740 \uC77C\uD558\uB294 \uBC29\uC2DD\uC5D0\uC11C\uB3C4 \uADF8\uB300\uB85C \uB4DC\uB7EC\uB098\uC694. ${nm}\uB2D8\uC5D0\uAC8C \uC798 \uB9DE\uB294 \uAC74 ${ct.work}\uC785\uB2C8\uB2E4.`,
      `${s.strength.label === "\uC57D\uD55C \uD3B8" ? "\uD63C\uC790 \uBAA8\uB4E0 \uAC78 \uC9CA\uC5B4\uC9C0\uB294 \uAD6C\uC870\uBCF4\uB2E4 \uBBFF\uC744 \uB9CC\uD55C \uD300\uC774\uB098 \uCCB4\uACC4 \uC548\uC5D0\uC11C \uC2E4\uB825\uC744 \uC313\uC744 \uB54C \uC624\uB798 \uAC11\uB2C8\uB2E4." : "\uC8FC\uC5B4\uC9C4 \uD2C0 \uC548\uC5D0\uB9CC \uBA38\uBB3C\uAE30\uBCF4\uB2E4 \uC2A4\uC2A4\uB85C \uD310\uC744 \uC9DC\uB294 \uC5ED\uD560\uC5D0\uC11C \uD798\uC774 \uB0A9\uB2C8\uB2E4."}`
    ],
    13: [
      `\uC9C1\uC5C5\uC744 \uACE0\uB97C \uB54C\uB294 \uB3C4\uC6C0\uC774 \uB418\uB294 \uAE30\uC6B4\uACFC \uAC00\uC7A5 \uAC15\uD55C \uAE30\uC6B4\uC744 \uD568\uAED8 \uBD10\uC694. ${nm}\uB2D8\uAED8 \uB3C4\uC6C0\uC774 \uB418\uB294 ${P(help)}\uC758 \uAE30\uC6B4\uC740 ${EL_FIELD[help]}\uACFC \uC798 \uB9DE\uC544\uC694.`,
      `\uD0C0\uACE0\uB09C ${P(strong)}\uC758 \uAE30\uC6B4\uC740 ${EL_FIELD[strong]}\uC5D0\uC11C \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uBC1C\uD718\uB429\uB2C8\uB2E4. \uB450 \uBC29\uD5A5\uC774 \uACB9\uCE58\uB294 \uACF3\uC774 ${nm}\uB2D8\uC758 \uC624\uB798 \uAC00\uB294 \uC9C4\uB85C\uC608\uC694.`
    ],
    14: [
      `\uC0AC\uC8FC\uC5D0\uC11C \uB3C8\uC740 \uB0B4\uAC00 \uB2E4\uC2A4\uB9AC\uB294 \uAE30\uC6B4\uC73C\uB85C \uBD10\uC694. ${P(me)}\uC778 ${nm}\uB2D8\uC5D0\uAC8C \uB3C8\uC758 \uAE30\uC6B4\uC740 ${P(wealthEl)}\uC774\uC5D0\uC694.`,
      s.elements[wealthEl] > 0 ? `\uC0AC\uC8FC\uC5D0 ${P(wealthEl)}\uC758 \uAE30\uC6B4\uC774 ${s.elements[wealthEl]}\uAC1C \uC788\uC5B4 \uB3C8\uC758 \uD750\uB984\uC774 \uB208\uC5D0 \uBCF4\uC774\uB294 \uD3B8\uC774\uC5D0\uC694. ${ct.money}.` : `\uC0AC\uC8FC\uC5D0 ${P(wealthEl)}\uC758 \uAE30\uC6B4\uC774 \uB4DC\uB7EC\uB098 \uC788\uC9C0 \uC54A\uC544\uC694. \uB3C8\uC774 \uC5C6\uB2E4\uB294 \uB73B\uC774 \uC544\uB2C8\uB77C, \uB3C8 \uC790\uCCB4\uB97C \uC887\uAE30\uBCF4\uB2E4 \uC2E4\uB825\uACFC \uC774\uB984\uC744 \uC313\uC744 \uB54C \uB530\uB77C\uC624\uB294 \uAD6C\uC870\uB77C\uB294 \uB73B\uC774\uC5D0\uC694. ${ct.money}.`
    ],
    15: [
      `\uB3C8\uC774 \uC0C8\uB294 \uAE38\uC740 \uB300\uAC1C \uAC15\uC810\uC758 \uB4B7\uBA74\uC5D0\uC11C \uC0DD\uACA8\uC694. ${nm}\uB2D8\uC758 \uACBD\uC6B0 ${ct.caution}\uC774 \uC9C0\uCD9C\uB85C \uC774\uC5B4\uC9C8 \uC218 \uC788\uC5B4\uC694.`,
      `\uC9C0\uD0A4\uB294 \uBC95\uC740 \uB2E8\uC21C\uD574\uC694. \uC218\uC785\uC774 \uB4E4\uC5B4\uC624\uB294 \uB0A0 \uBA3C\uC800 \uB5BC\uC5B4\uB450\uB294 \uD1B5\uC7A5\uC744 \uB9CC\uB4E4\uACE0, ${EL_HABIT[help].split(", ")[2] ?? "\uAFB8\uC900\uD55C \uAE30\uB85D"}\uCC98\uB7FC ${P(help)}\uC758 \uAE30\uC6B4\uC744 \uB2EE\uC740 \uC2B5\uAD00\uC744 \uBD99\uC774\uC138\uC694.`
    ],
    16: [
      `\uC5F0\uC560\uC5D0\uC11C\uC758 \uBAA8\uC2B5\uC740 \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uC0AC\uB78C \uC55E\uC758 \uB098, \uACE7 \uD0DC\uC5B4\uB09C \uB0A0\uC758 \uC544\uB7AB\uAE00\uC790\uC5D0\uC11C \uB9CE\uC774 \uB4DC\uB7EC\uB098\uC694. ${nm}\uB2D8\uC740 \uADF8 \uC790\uB9AC\uC5D0 ${CAT_NAME[dayJiCat]}\uC774 \uC788\uC5B4\uC694.`,
      `\uADF8\uB798\uC11C ${CAT_TEXT[dayJiCat].love}.`
    ],
    17: [
      `\uD0DC\uC5B4\uB09C \uB0A0\uC758 \uC544\uB7AB\uAE00\uC790\uB97C '\uBC30\uC6B0\uC790 \uC790\uB9AC'\uB77C\uACE0\uB3C4 \uBD88\uB7EC\uC694. \uAC00\uC7A5 \uAC00\uAE4C\uC774\uC5D0\uC11C \uD568\uAED8 \uC0AC\uB294 \uC0AC\uB78C\uC758 \uAE30\uC6B4\uC774 \uBA38\uBB34\uB294 \uC790\uB9AC\uB77C\uB294 \uB73B\uC774\uC5D0\uC694.`,
      `${nm}\uB2D8\uC758 \uBC30\uC6B0\uC790 \uC790\uB9AC\uC5D0\uB294 ${P(JI_EL[s.pillars.day.ji])}\uC758 \uAE30\uC6B4\uC774 \uC788\uC5B4\uC694. ${EL_TRAIT[JI_EL[s.pillars.day.ji]]}\uC744 \uAC00\uC9C4 \uC0AC\uB78C, \uB610\uB294 \uADF8\uB7F0 \uC5ED\uD560\uC744 \uD574\uC8FC\uB294 \uC0AC\uB78C\uACFC \uD3B8\uC548\uD568\uC744 \uB290\uB07C\uAE30 \uC26C\uC6CC\uC694.`,
      cur ? `\uACB0\uD63C\uACFC \uB3D9\uAC70 \uAC19\uC740 \uD070 \uBCC0\uD654\uB294 \uC778\uC0DD\uC758 \uD750\uB984\uACFC\uB3C4 \uC5F0\uACB0\uB3FC\uC694. \uC774 \uD750\uB984\uC740 20\uCABD\uBD80\uD130 \uC774\uC5B4\uC11C \uBD05\uB2C8\uB2E4.` : ``
    ].filter(Boolean),
    18: [
      `\uAC00\uC871\uACFC \uC0AC\uB78C \uAD00\uACC4\uB294 \uB098\uB97C \uBC1B\uCCD0\uC8FC\uB294 \uAE30\uC6B4\uACFC \uB098\uC640 \uAC19\uC740 \uAE30\uC6B4\uC758 \uADE0\uD615\uC73C\uB85C \uBD10\uC694.`,
      `${nm}\uB2D8\uC740 ${s.strength.label === "\uAC15\uD55C \uD3B8" ? "\uC2A4\uC2A4\uB85C \uC11C\uB294 \uD798\uC774 \uAC15\uD574 \uAC00\uC871\uC5D0\uAC8C \uAE30\uB300\uAE30\uBCF4\uB2E4 \uAE30\uB300\uC5B4\uC9C0\uB294 \uCABD\uC774 \uB418\uAE30 \uC26C\uC6CC\uC694. \uAC00\uB054\uC740 \uB3C4\uC6C0\uC744 \uBC1B\uB294 \uC5F0\uC2B5\uC774 \uAD00\uACC4\uB97C \uBD80\uB4DC\uB7FD\uAC8C \uD574\uC694." : "\uC8FC\uBCC0\uC758 \uB3C4\uC6C0\uACFC \uC778\uC5F0\uC774 \uD798\uC774 \uB418\uB294 \uC0AC\uC8FC\uC608\uC694. \uC88B\uC740 \uC0AC\uB78C\uC744 \uACC1\uC5D0 \uB450\uB294 \uAC83\uC774 \uACE7 \uC6B4\uC744 \uAD00\uB9AC\uD558\uB294 \uC77C\uC774\uC5D0\uC694."}`
    ],
    19: [
      `\uC624\uD589\uC740 \uBAB8\uC758 \uD750\uB984\uACFC\uB3C4 \uC5F0\uACB0\uD574\uC11C \uBD10\uC694. \uC758\uD559\uC801\uC778 \uC9C4\uB2E8\uC774 \uC544\uB2C8\uB77C \uC0DD\uD65C \uC2B5\uAD00\uC744 \uCC59\uAE30\uB294 \uCC38\uACE0\uB85C \uC77D\uC5B4\uC8FC\uC138\uC694.`,
      `${nm}\uB2D8\uC740 ${P(weak)}\uC758 \uAE30\uC6B4\uC774 \uAC00\uC7A5 \uC801\uC5B4, ${EL_BODY2[weak]} \uCABD\uC744 \uD3C9\uC18C\uC5D0 \uCC59\uAE30\uBA74 \uC88B\uC544\uC694. \uBC18\uB300\uB85C \uB118\uCE58\uB294 ${P(strong)}\uC758 \uAE30\uC6B4\uC740 ${EL_BODY2[strong]} \uCABD\uC758 \uACFC\uB85C\uB85C \uB098\uD0C0\uB098\uAE30 \uC26C\uC6CC\uC694.`
    ],
    20: [
      `\uC0AC\uC8FC\uC5D0\uB294 \uD0C0\uACE0\uB09C \uB124 \uAE30\uB465 \uB9D0\uACE0\uB3C4 10\uB144\uB9C8\uB2E4 \uBC14\uB00C\uB294 \uD750\uB984\uC774 \uC788\uC5B4\uC694. \uC774\uAC83\uC744 '\uB300\uC6B4'\uC774\uB77C\uACE0 \uD558\uACE0, \uC778\uC0DD\uC758 \uACC4\uC808\uB85C \uBE44\uC720\uD560 \uC218 \uC788\uC5B4\uC694.`,
      `${nm}\uB2D8\uC758 \uB300\uC6B4\uC740 ${s.daewoon[0].age}\uC138\uC5D0 \uC2DC\uC791\uD574 10\uB144\uB9C8\uB2E4 \uBC14\uB01D\uB2C8\uB2E4. ${s.daewoon.slice(0, 4).map((d) => `${d.age}\uC138 ${GAN[d.pillar.gan]}${JI[d.pillar.ji]}`).join(", ")} \uC21C\uC11C\uB85C \uD758\uB7EC\uAC00\uC694.`
    ],
    21: cur ? [
      `\uC9C0\uAE08 ${nm}\uB2D8\uC774 \uC9C0\uB098\uACE0 \uC788\uB294 \uB300\uC6B4\uC740 ${cur.age}\uC138\uBD80\uD130\uC758 ${GAN[cur.pillar.gan]}${JI[cur.pillar.ji]} \uB300\uC6B4\uC774\uC5D0\uC694.`,
      `\uC774 10\uB144\uC740 ${CAT_NAME[relDw(cur.pillar)]}\uC774 \uB4E4\uC5B4\uC624\uB294 \uACC4\uC808\uC774\uC5D0\uC694. ${REL_YEAR[relDw(cur.pillar)]}`
    ] : [`\uB300\uC6B4 \uC815\uBCF4\uB97C \uD655\uC778\uD560 \uC218 \uC5C6\uC5B4\uC694.`],
    22: next ? [
      `\uB2E4\uC74C \uB300\uC6B4\uC740 ${next.age}\uC138\uBD80\uD130\uC758 ${GAN[next.pillar.gan]}${JI[next.pillar.ji]} \uB300\uC6B4\uC774\uC5D0\uC694. ${CAT_NAME[relDw(next.pillar)]}\uC758 \uACC4\uC808\uB85C \uB118\uC5B4\uAC11\uB2C8\uB2E4.`,
      `\uACC4\uC808\uC774 \uBC14\uB00C\uAE30 2~3\uB144 \uC804\uBD80\uD130 \uC900\uBE44\uD558\uBA74 \uC804\uD658\uC774 \uBD80\uB4DC\uB7EC\uC6CC\uC694. \uC9C0\uAE08\uBD80\uD130 ${P(help)}\uC758 \uAE30\uC6B4\uC744 \uB2EE\uC740 \uC2B5\uAD00\uC744 \uC313\uC544\uB450\uC138\uC694.`
    ] : [],
    23: [
      `\uB300\uC6B4\uC774 10\uB144\uC758 \uACC4\uC808\uC774\uB77C\uBA74, \uD574\uB9C8\uB2E4 \uBC14\uB00C\uB294 \uD750\uB984\uC740 '\uC138\uC6B4'\uC774\uB77C\uACE0 \uD574\uC694. \uC62C\uD574\uC758 \uB0A0\uC528 \uAC19\uC740 \uAC83\uC774\uC5D0\uC694.`,
      `${thisYear.year}\uB144\uC740 ${GAN[thisYear.pillar.gan]}${JI[thisYear.pillar.ji]}\uB144\uC774\uC5D0\uC694. ${nm}\uB2D8\uC5D0\uAC8C\uB294 ${CAT_NAME[relationOf(me, GAN_EL[thisYear.pillar.gan])]}\uC774 \uB4E4\uC5B4\uC624\uB294 \uD574\uC785\uB2C8\uB2E4. ${REL_YEAR[relationOf(me, GAN_EL[thisYear.pillar.gan])]}`
    ],
    24: months.slice(0, 6),
    25: [...months.slice(6), `\uB2EC\uB9C8\uB2E4\uC758 \uD750\uB984\uC740 \uD070 \uBC29\uD5A5\uC774 \uC544\uB2C8\uB77C \uB0A0\uC528 \uC608\uBCF4\uCC98\uB7FC \uAC00\uBCCD\uAC8C \uCC38\uACE0\uD574\uC8FC\uC138\uC694.`],
    26: s.sewoon.map((sw) => {
      const r = relationOf(me, GAN_EL[sw.pillar.gan]);
      return `${sw.year}\uB144 ${GAN[sw.pillar.gan]}${JI[sw.pillar.ji]} \u2014 ${CAT_NAME[r]}\uC758 \uD574. ${REL_YEAR[r].split(". ")[0]}.`;
    }),
    27: [
      `\uC9C0\uAE08\uAE4C\uC9C0\uC758 \uC774\uC57C\uAE30\uB97C \uC0DD\uD65C\uB85C \uC62E\uACA8\uBCFC\uAC8C\uC694. ${nm}\uB2D8\uAED8 \uD544\uC694\uD55C ${P(help)}\uC758 \uAE30\uC6B4\uC744 \uCC44\uC6B0\uB294 \uBC29\uBC95\uC774\uC5D0\uC694.`,
      `\uC0C9\uC740 ${EL_COLOR_NAME[help]} \uACC4\uC5F4, \uBC29\uD5A5\uC740 ${EL_DIRECTION[help]}\uC774 \uD3B8\uD574\uC694. \uC2B5\uAD00\uC73C\uB85C\uB294 ${EL_HABIT[help]}\uC744 \uCD94\uCC9C\uD574\uC694.`,
      `\uAC70\uCC3D\uD560 \uD544\uC694 \uC5C6\uC5B4\uC694. \uD558\uB098\uB9CC \uACE8\uB77C \uD55C \uB2EC\uC744 \uC774\uC5B4\uAC00 \uBCF4\uC138\uC694.`
    ],
    28: question.trim() ? [`\uB0A8\uACA8\uC8FC\uC2E0 \uC9C8\uBB38: "${question.trim()}"`, `\uC774 \uC9C8\uBB38\uC5D0 \uB300\uD55C \uB2F5\uC740 AI \uD480\uC774 \uC5F0\uACB0 \uD6C4 \uC0AC\uC8FC \uC804\uCCB4 \uD750\uB984\uC744 \uBC14\uD0D5\uC73C\uB85C \uC791\uC131\uB3FC\uC694. (\uC9C0\uAE08\uC740 \uAE30\uBCF8 \uBB38\uC7A5 \uB2E8\uACC4\uC608\uC694.)`] : [`\uB530\uB85C \uB0A8\uACA8\uC8FC\uC2E0 \uC9C8\uBB38\uC774 \uC5C6\uC5B4, \uAC00\uC7A5 \uB9CE\uC774 \uBC1B\uB294 \uC9C8\uBB38\uC778 "\uC9C0\uAE08 \uBC29\uD5A5\uC774 \uB9DE\uC744\uAE4C\uC694?"\uC5D0 \uB2F5\uD574\uBCFC\uAC8C\uC694.`, `${nm}\uB2D8\uC758 \uC62C\uD574\uB294 ${CAT_NAME[relationOf(me, GAN_EL[thisYear.pillar.gan])]}\uC758 \uD574\uC608\uC694. \uBC29\uD5A5\uC744 \uBC14\uAFB8\uAE30\uBCF4\uB2E4 \uC9C0\uAE08 \uAE38\uC5D0\uC11C ${P(help)}\uC758 \uAE30\uC6B4\uC744 \uB354\uD558\uB294 \uCABD\uC774 \uC774\uB86D\uC2B5\uB2C8\uB2E4.`],
    29: [
      `\uCC98\uC74C\uC5D0 ${nm}\uB2D8\uC758 \uC0AC\uC8FC\uB97C \uC774\uB807\uAC8C \uB9D0\uC500\uB4DC\uB838\uC5B4\uC694. "${thesis}"`,
      `${card.symbol}\uB294 \uC774\uBBF8 \uADF8 \uC790\uCCB4\uB85C \uCDA9\uBD84\uD574\uC694. \uB2E4\uB9CC ${P(help)}\uC758 \uAE30\uC6B4\uC744 \uB9CC\uB0A0 \uB54C \uAC00\uC7A5 ${card.keywords[0]}\uC774 \uBE5B\uB0A9\uB2C8\uB2E4.`,
      `\uC774 \uB9AC\uD3EC\uD2B8\uAC00 \uADF8 \uB9CC\uB0A8\uC744 \uC870\uAE08 \uC55E\uB2F9\uAE30\uB294 \uACC4\uAE30\uAC00 \uB418\uC5C8\uC73C\uBA74 \uC88B\uACA0\uC2B5\uB2C8\uB2E4. \u2014 ${signature}`
    ]
  };
}
function buildMainBook(s, name, question, personIndex, issued = /* @__PURE__ */ new Date(), signature = "") {
  const texts = mainTexts(s, name, question, issued, signature);
  const kindOf = (no) => no === 1 ? "cover" : no === 2 ? "toc" : no === 3 ? "manse" : no === 4 ? "elements" : no === 5 ? "luck" : no === 30 ? "back" : "text";
  return {
    kind: "main",
    personIndexes: [personIndex],
    title: `${name}\uB2D8\uC758 \uC885\uD569\uC0AC\uC8FC`,
    draft: true,
    pages: MAIN_TOC.map((t) => ({ no: t.no, part: t.part, title: t.title, kind: kindOf(t.no), paragraphs: texts[t.no] ?? [] }))
  };
}

// lib/manse/sample.json
var sample_default = {
  input: {
    name: "\uAE40\uB8E8\uC6D4",
    birthDate: "1994-03-05",
    birthTime: "07:30",
    calendar: "\uC591\uB825",
    gender: "\uC5EC",
    region: "\uC11C\uC6B8"
  },
  provisional: false,
  notes: [],
  correction: {
    minutes: -32,
    dst: false,
    local: -32,
    region: "\uC11C\uC6B8",
    original: "07:30",
    corrected: "06:58",
    text: "07:30 \u2192 06:58 \uAE30\uC900\uC73C\uB85C \uACC4\uC0B0\uD588\uC5B4\uC694 (\uC11C\uC6B8 \uC9C0\uC5ED\uC2DC -32\uBD84)"
  },
  solarDate: "1994-03-05",
  pillars: {
    year: {
      idx: 10,
      gan: 0,
      ji: 10,
      name: "\uAC11\uC220",
      ganEl: "\uBAA9",
      jiEl: "\uD1A0",
      ganGod: "\uD3B8\uC7AC",
      jiGod: "\uD3B8\uC778",
      hidden: [
        {
          gan: 7,
          el: "\uAE08",
          god: "\uAC81\uC7AC"
        },
        {
          gan: 3,
          el: "\uD654",
          god: "\uC815\uAD00"
        },
        {
          gan: 4,
          el: "\uD1A0",
          god: "\uD3B8\uC778"
        }
      ],
      unseong: "\uC1E0",
      salYear: "\uD654\uAC1C\uC0B4",
      salDay: "\uD654\uAC1C\uC0B4",
      sinsal: [
        "\uAE08\uC5EC\uB85D",
        "\uD64D\uC5FC\uC0B4",
        "\uD654\uAC1C\uC0B4",
        "\uD604\uCE68\uC0B4"
      ]
    },
    month: {
      idx: 2,
      gan: 2,
      ji: 2,
      name: "\uBCD1\uC778",
      ganEl: "\uD654",
      jiEl: "\uBAA9",
      ganGod: "\uD3B8\uAD00",
      jiGod: "\uD3B8\uC7AC",
      hidden: [
        {
          gan: 4,
          el: "\uD1A0",
          god: "\uD3B8\uC778"
        },
        {
          gan: 2,
          el: "\uD654",
          god: "\uD3B8\uAD00"
        },
        {
          gan: 0,
          el: "\uBAA9",
          god: "\uD3B8\uC7AC"
        }
      ],
      unseong: "\uC808",
      salYear: "\uC9C0\uC0B4",
      salDay: "\uC9C0\uC0B4",
      sinsal: [
        "\uD0DC\uADF9\uADC0\uC778",
        "\uC6D4\uB355\uADC0\uC778"
      ]
    },
    day: {
      idx: 26,
      gan: 6,
      ji: 2,
      name: "\uACBD\uC778",
      ganEl: "\uAE08",
      jiEl: "\uBAA9",
      ganGod: "\uBE44\uACAC",
      jiGod: "\uD3B8\uC7AC",
      hidden: [
        {
          gan: 4,
          el: "\uD1A0",
          god: "\uD3B8\uC778"
        },
        {
          gan: 2,
          el: "\uD654",
          god: "\uD3B8\uAD00"
        },
        {
          gan: 0,
          el: "\uBAA9",
          god: "\uD3B8\uC7AC"
        }
      ],
      unseong: "\uC808",
      salYear: "\uC9C0\uC0B4",
      salDay: "\uC9C0\uC0B4",
      sinsal: [
        "\uD0DC\uADF9\uADC0\uC778"
      ]
    },
    hour: {
      idx: 15,
      gan: 5,
      ji: 3,
      name: "\uAE30\uBB18",
      ganEl: "\uD1A0",
      jiEl: "\uBAA9",
      ganGod: "\uC815\uC778",
      jiGod: "\uC815\uC7AC",
      hidden: [
        {
          gan: 0,
          el: "\uBAA9",
          god: "\uD3B8\uC7AC"
        },
        {
          gan: 1,
          el: "\uBAA9",
          god: "\uC815\uC7AC"
        }
      ],
      unseong: "\uD0DC",
      salYear: "\uB144\uC0B4(\uB3C4\uD654)",
      salDay: "\uB144\uC0B4(\uB3C4\uD654)",
      sinsal: [
        "\uB3C4\uD654\uC0B4",
        "\uD604\uCE68\uC0B4"
      ]
    }
  },
  dayMaster: {
    gan: 6,
    el: "\uAE08",
    yang: true
  },
  elements: {
    \uBAA9: 4,
    \uD654: 1,
    \uD1A0: 2,
    \uAE08: 1,
    \uC218: 0
  },
  strength: {
    score: 27,
    label: "\uADE0\uD615",
    grade: "\uC911\uD654(\uC57D\uBCC0\uAC15)",
    deukryeong: "X",
    deukji: "X",
    deukse: "\u25B3"
  },
  helpful: "\uAE08",
  yongsin: {
    \uC6A9\uC2E0: "\uAE08",
    \uD76C\uC2E0: "\uD1A0",
    \uAE30\uC2E0: "\uD654",
    \uAD6C\uC2E0: "\uBAA9",
    \uD55C\uC2E0: "\uC218"
  },
  johu: {
    main: "\uD654",
    sub: [
      "\uBAA9"
    ]
  },
  gyeokguk: {
    name: "\uD3B8\uC7AC\uACA9",
    basis: "\uC6D4\uC9C0 \uC778 \uBCF8\uAE30 \uAC11 \uD22C\uCD9C"
  },
  groups: {
    \uBE44\uAC81: 0,
    \uC2DD\uC0C1: 0,
    \uC7AC\uC131: 4,
    \uAD00\uC131: 1,
    \uC778\uC131: 2
  },
  relations: {
    stems: [
      "\uAC11\uAE30\uD569(\uD1A0)",
      "\uAC11\uACBD\uCDA9"
    ],
    hap: [
      "\uBB18\uC220\uD569(\uD654)",
      "\uC778\uC220 \uBC18\uD569"
    ],
    clash: []
  },
  gongmang: [
    "\uC624",
    "\uBBF8"
  ],
  age: 32,
  daewoonStart: 10,
  daewoonForward: false,
  daewoon: [
    {
      pillar: {
        idx: 1,
        gan: 1,
        ji: 1,
        name: "\uC744\uCD95"
      },
      ganGod: "\uC815\uC7AC",
      jiGod: "\uC815\uC778",
      unseong: "\uBB18",
      age: 10,
      startYear: 2004
    },
    {
      pillar: {
        idx: 0,
        gan: 0,
        ji: 0,
        name: "\uAC11\uC790"
      },
      ganGod: "\uD3B8\uC7AC",
      jiGod: "\uC0C1\uAD00",
      unseong: "\uC0AC",
      age: 20,
      startYear: 2014
    },
    {
      pillar: {
        idx: 59,
        gan: 9,
        ji: 11,
        name: "\uACC4\uD574"
      },
      ganGod: "\uC0C1\uAD00",
      jiGod: "\uC2DD\uC2E0",
      unseong: "\uBCD1",
      age: 30,
      startYear: 2024
    },
    {
      pillar: {
        idx: 58,
        gan: 8,
        ji: 10,
        name: "\uC784\uC220"
      },
      ganGod: "\uC2DD\uC2E0",
      jiGod: "\uD3B8\uC778",
      unseong: "\uC1E0",
      age: 40,
      startYear: 2034
    },
    {
      pillar: {
        idx: 57,
        gan: 7,
        ji: 9,
        name: "\uC2E0\uC720"
      },
      ganGod: "\uAC81\uC7AC",
      jiGod: "\uAC81\uC7AC",
      unseong: "\uC81C\uC655",
      age: 50,
      startYear: 2044
    },
    {
      pillar: {
        idx: 56,
        gan: 6,
        ji: 8,
        name: "\uACBD\uC2E0"
      },
      ganGod: "\uBE44\uACAC",
      jiGod: "\uBE44\uACAC",
      unseong: "\uAC74\uB85D",
      age: 60,
      startYear: 2054
    },
    {
      pillar: {
        idx: 55,
        gan: 5,
        ji: 7,
        name: "\uAE30\uBBF8"
      },
      ganGod: "\uC815\uC778",
      jiGod: "\uC815\uC778",
      unseong: "\uAD00\uB300",
      age: 70,
      startYear: 2064
    },
    {
      pillar: {
        idx: 54,
        gan: 4,
        ji: 6,
        name: "\uBB34\uC624"
      },
      ganGod: "\uD3B8\uC778",
      jiGod: "\uC815\uAD00",
      unseong: "\uBAA9\uC695",
      age: 80,
      startYear: 2074
    },
    {
      pillar: {
        idx: 53,
        gan: 3,
        ji: 5,
        name: "\uC815\uC0AC"
      },
      ganGod: "\uC815\uAD00",
      jiGod: "\uD3B8\uAD00",
      unseong: "\uC7A5\uC0DD",
      age: 90,
      startYear: 2084
    },
    {
      pillar: {
        idx: 52,
        gan: 2,
        ji: 4,
        name: "\uBCD1\uC9C4"
      },
      ganGod: "\uD3B8\uAD00",
      jiGod: "\uD3B8\uC778",
      unseong: "\uC591",
      age: 100,
      startYear: 2094
    }
  ],
  currentDaewoonIndex: 2,
  sewoon: [
    {
      pillar: {
        idx: 42,
        gan: 2,
        ji: 6,
        name: "\uBCD1\uC624"
      },
      ganGod: "\uD3B8\uAD00",
      jiGod: "\uC815\uAD00",
      unseong: "\uBAA9\uC695",
      year: 2026
    },
    {
      pillar: {
        idx: 43,
        gan: 3,
        ji: 7,
        name: "\uC815\uBBF8"
      },
      ganGod: "\uC815\uAD00",
      jiGod: "\uC815\uC778",
      unseong: "\uAD00\uB300",
      year: 2027
    },
    {
      pillar: {
        idx: 44,
        gan: 4,
        ji: 8,
        name: "\uBB34\uC2E0"
      },
      ganGod: "\uD3B8\uC778",
      jiGod: "\uBE44\uACAC",
      unseong: "\uAC74\uB85D",
      year: 2028
    },
    {
      pillar: {
        idx: 45,
        gan: 5,
        ji: 9,
        name: "\uAE30\uC720"
      },
      ganGod: "\uC815\uC778",
      jiGod: "\uAC81\uC7AC",
      unseong: "\uC81C\uC655",
      year: 2029
    },
    {
      pillar: {
        idx: 46,
        gan: 6,
        ji: 10,
        name: "\uACBD\uC220"
      },
      ganGod: "\uBE44\uACAC",
      jiGod: "\uD3B8\uC778",
      unseong: "\uC1E0",
      year: 2030
    },
    {
      pillar: {
        idx: 47,
        gan: 7,
        ji: 11,
        name: "\uC2E0\uD574"
      },
      ganGod: "\uAC81\uC7AC",
      jiGod: "\uC2DD\uC2E0",
      unseong: "\uBCD1",
      year: 2031
    },
    {
      pillar: {
        idx: 48,
        gan: 8,
        ji: 0,
        name: "\uC784\uC790"
      },
      ganGod: "\uC2DD\uC2E0",
      jiGod: "\uC0C1\uAD00",
      unseong: "\uC0AC",
      year: 2032
    },
    {
      pillar: {
        idx: 49,
        gan: 9,
        ji: 1,
        name: "\uACC4\uCD95"
      },
      ganGod: "\uC0C1\uAD00",
      jiGod: "\uC815\uC778",
      unseong: "\uBB18",
      year: 2033
    },
    {
      pillar: {
        idx: 50,
        gan: 0,
        ji: 2,
        name: "\uAC11\uC778"
      },
      ganGod: "\uD3B8\uC7AC",
      jiGod: "\uD3B8\uC7AC",
      unseong: "\uC808",
      year: 2034
    },
    {
      pillar: {
        idx: 51,
        gan: 1,
        ji: 3,
        name: "\uC744\uBB18"
      },
      ganGod: "\uC815\uC7AC",
      jiGod: "\uC815\uC7AC",
      unseong: "\uD0DC",
      year: 2035
    }
  ],
  wolwoon: [
    {
      year: 2026,
      month: 8,
      pillar: {
        idx: 32,
        gan: 2,
        ji: 8,
        name: "\uBCD1\uC2E0"
      },
      ganGod: "\uD3B8\uAD00",
      jiGod: "\uBE44\uACAC",
      current: false
    },
    {
      year: 2026,
      month: 9,
      pillar: {
        idx: 33,
        gan: 3,
        ji: 9,
        name: "\uC815\uC720"
      },
      ganGod: "\uC815\uAD00",
      jiGod: "\uAC81\uC7AC",
      current: true
    },
    {
      year: 2026,
      month: 10,
      pillar: {
        idx: 34,
        gan: 4,
        ji: 10,
        name: "\uBB34\uC220"
      },
      ganGod: "\uD3B8\uC778",
      jiGod: "\uD3B8\uC778",
      current: false
    },
    {
      year: 2026,
      month: 11,
      pillar: {
        idx: 35,
        gan: 5,
        ji: 11,
        name: "\uAE30\uD574"
      },
      ganGod: "\uC815\uC778",
      jiGod: "\uC2DD\uC2E0",
      current: false
    },
    {
      year: 2026,
      month: 12,
      pillar: {
        idx: 36,
        gan: 6,
        ji: 0,
        name: "\uACBD\uC790"
      },
      ganGod: "\uBE44\uACAC",
      jiGod: "\uC0C1\uAD00",
      current: false
    },
    {
      year: 2027,
      month: 1,
      pillar: {
        idx: 37,
        gan: 7,
        ji: 1,
        name: "\uC2E0\uCD95"
      },
      ganGod: "\uAC81\uC7AC",
      jiGod: "\uC815\uC778",
      current: false
    },
    {
      year: 2027,
      month: 2,
      pillar: {
        idx: 38,
        gan: 8,
        ji: 2,
        name: "\uC784\uC778"
      },
      ganGod: "\uC2DD\uC2E0",
      jiGod: "\uD3B8\uC7AC",
      current: false
    },
    {
      year: 2027,
      month: 3,
      pillar: {
        idx: 39,
        gan: 9,
        ji: 3,
        name: "\uACC4\uBB18"
      },
      ganGod: "\uC0C1\uAD00",
      jiGod: "\uC815\uC7AC",
      current: false
    },
    {
      year: 2027,
      month: 4,
      pillar: {
        idx: 40,
        gan: 0,
        ji: 4,
        name: "\uAC11\uC9C4"
      },
      ganGod: "\uD3B8\uC7AC",
      jiGod: "\uD3B8\uC778",
      current: false
    },
    {
      year: 2027,
      month: 5,
      pillar: {
        idx: 41,
        gan: 1,
        ji: 5,
        name: "\uC744\uC0AC"
      },
      ganGod: "\uC815\uC7AC",
      jiGod: "\uD3B8\uAD00",
      current: false
    },
    {
      year: 2027,
      month: 6,
      pillar: {
        idx: 42,
        gan: 2,
        ji: 6,
        name: "\uBCD1\uC624"
      },
      ganGod: "\uD3B8\uAD00",
      jiGod: "\uC815\uAD00",
      current: false
    },
    {
      year: 2027,
      month: 7,
      pillar: {
        idx: 43,
        gan: 3,
        ji: 7,
        name: "\uC815\uBBF8"
      },
      ganGod: "\uC815\uAD00",
      jiGod: "\uC815\uC778",
      current: false
    }
  ]
};

// components/ReportSample.tsx
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
var SAMPLE = { name: "\uAE40\uB8E8\uC6D4" };
var saju = sample_default;
function ReportSample({ brand = "\uC0AC\uC8FC", coverImage = "", coverText = true }) {
  const book = (0, import_react6.useMemo)(() => buildMainBook(saju, SAMPLE.name, "", 0, /* @__PURE__ */ new Date("2026-09-10T09:00:00+09:00"), brand), [saju, brand]);
  const pages = [book.pages[0], book.pages[2], book.pages[3], book.pages[6], book.pages[7]];
  const [idx, setIdx] = (0, import_react6.useState)(0);
  const p = pages[idx];
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "book", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "book-stage", children: p.kind === "cover" ? coverImage ? /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sheet cover has-image", "aria-label": "\uB9AC\uD3EC\uD2B8 \uD45C\uC9C0 \uC0D8\uD50C", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("img", { src: coverImage, alt: "" }),
      coverText && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sheet-cover-text", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { style: { fontSize: 11, letterSpacing: ".14em" }, children: [
          brand,
          " \uC885\uD569\uC0AC\uC8FC"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "t", children: [
            SAMPLE.name,
            "\uB2D8\uC758",
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("br", {}),
            "\uC0AC\uC8FC \uC774\uC57C\uAE30"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { style: { margin: "10px 0 0" }, children: "\uC591\uB825 1994\uB144 3\uC6D4 5\uC77C \uC624\uC804 7\uC2DC 30\uBD84 \xB7 \uC5EC\uC131" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { fontSize: 10 }, children: "2026\uB144 9\uC6D4 \uBC1C\uD589 \xB7 \uC0D8\uD50C" })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sheet cover", "aria-label": "\uB9AC\uD3EC\uD2B8 \uD45C\uC9C0 \uC0D8\uD50C", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { style: { fontSize: 11, letterSpacing: ".14em", color: "var(--night-muted)" }, children: [
        brand,
        " \uC885\uD569\uC0AC\uC8FC"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "t", children: [
          SAMPLE.name,
          "\uB2D8\uC758",
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("br", {}),
          "\uC0AC\uC8FC \uC774\uC57C\uAE30"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { style: { margin: "10px 0 0", color: "var(--night-muted)" }, children: "\uC591\uB825 1994\uB144 3\uC6D4 5\uC77C \uC624\uC804 7\uC2DC 30\uBD84 \xB7 \uC5EC\uC131" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { style: { fontSize: 10, color: "var(--night-muted)" }, children: "2026\uB144 9\uC6D4 \uBC1C\uD589 \xB7 \uC0D8\uD50C" })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sheet sheet-small", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("h4", { children: p.title }),
      p.kind === "manse" && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ManseTable, { s: saju }),
      p.kind === "elements" && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { display: "grid", justifyItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ElementChart, { elements: saju.elements, highlight: saju.helpful }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("p", { style: { margin: 0, textAlign: "center" }, children: [
          ELS.map((e) => `${EL_PLAIN[e]} ${saju.elements[e]}`).join(" \xB7 "),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("br", {}),
          "\uB3C4\uC6C0\uC774 \uB418\uB294 \uAE30\uC6B4: ",
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("b", { children: EL_PLAIN[saju.helpful] })
        ] })
      ] }),
      p.kind === "text" && p.paragraphs.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { style: { margin: "0 0 10px" }, children: t }, i)),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "sheet-no", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { children: [
          SAMPLE.name,
          "\uB2D8\uC758 \uC885\uD569\uC0AC\uC8FC"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: "num", children: [
          p.no,
          " / 30"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "eyebrow", children: "\uC0D8\uD50C \uC778\uBB3C \xB7 \uAE40\uB8E8\uC6D4 \uB2D8" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "book-pages", children: pages.map((pg, i) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("button", { "aria-pressed": i === idx, onClick: () => setIdx(i), children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "n", children: String(pg.no).padStart(2, "0") }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: pg.title })
      ] }, pg.no)) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { style: { fontSize: 14, color: "var(--muted)", margin: "14px 0 0" }, children: "\uC2E4\uC81C \uB9AC\uD3EC\uD2B8\uB294 30\uCABD\uC774\uC5D0\uC694. \uD45C 5\uCABD \uB4A4\uB85C \uD480\uC774 24\uCABD\uACFC \uB4B7\uD45C\uC9C0\uAC00 \uC774\uC5B4\uC838\uC694." })
    ] })
  ] });
}

// components/Extras.tsx
var import_react7 = __toESM(require_react());
var import_jsx_runtime11 = __toESM(require_jsx_runtime());
var SEEN_KEY = "rw_lucky_seen";
function LuckyCard() {
  const [card, setCard] = (0, import_react7.useState)(null);
  const [ready, setReady] = (0, import_react7.useState)(false);
  const t = todayKST();
  const key = `rw_lucky_${t.y}${t.m}${t.d}`;
  (0, import_react7.useEffect)(() => {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) setCard(+v);
    } catch {
    }
    setReady(true);
  }, [key]);
  const draw = () => {
    if (card !== null) return;
    const all = LUCKY_CARDS.map((_, i) => i);
    let seen = [];
    try {
      const raw = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
      if (Array.isArray(raw)) seen = raw.filter((n) => Number.isInteger(n) && n >= 0 && n < LUCKY_CARDS.length);
    } catch {
    }
    let pool = all.filter((i) => !seen.includes(i));
    if (!pool.length) {
      seen = seen.slice(-1);
      pool = all.filter((i) => !seen.includes(i));
    }
    const idx = pool[Math.floor(Math.random() * pool.length)];
    setCard(idx);
    try {
      localStorage.setItem(key, String(idx));
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, idx]));
    } catch {
    }
  };
  const c = card !== null ? LUCKY_CARDS[card] : null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { children: "\uC624\uB298\uC758 \uD589\uC6B4 \uCE74\uB4DC" }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("button", { type: "button", className: `lucky-card ${c ? "open" : ""}`, onClick: draw, "aria-label": c ? `\uC624\uB298\uC758 \uCE74\uB4DC: ${c.name}. ${c.message}` : "\uCE74\uB4DC \uB4A4\uC9D1\uAE30", disabled: !ready, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: "lucky-inner", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "lucky-face lucky-front", children: "\uB20C\uB7EC\uC11C \uD55C \uC7A5 \uBF51\uAE30" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: "lucky-face lucky-back", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("b", { children: c?.name ?? "" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { children: c?.message ?? "" })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { style: { fontSize: 13.5, color: "var(--muted)", margin: "10px 0 0" }, children: [
      "\uD558\uB8E8\uC5D0 \uD55C \uC7A5, \uC790\uC815\uC774 \uC9C0\uB098\uBA74 \uB2E4\uC2DC \uBF51\uC744 \uC218 \uC788\uC5B4\uC694. \uCE74\uB4DC ",
      LUCKY_CARDS.length,
      "\uC7A5\uC744 \uB2E4 \uBCFC \uB54C\uAE4C\uC9C0 \uAC19\uC740 \uCE74\uB4DC\uB294 \uB098\uC624\uC9C0 \uC54A\uC544\uC694."
    ] })
  ] });
}
var MOODS = [
  { key: "steady", label: "\uB4E0\uB4E0\uD55C \uB0A0" },
  { key: "push", label: "\uBC00\uACE0 \uAC00\uB294 \uB0A0" },
  { key: "endure", label: "\uBC84\uD2F0\uB294 \uB0A0" },
  { key: "give", label: "\uBCA0\uD478\uB294 \uB0A0" },
  { key: "focus", label: "\uBAB0\uC785\uD558\uB294 \uB0A0" }
];
function MonthCalendar() {
  const t = todayKST();
  const first = new Date(t.y, t.m - 1, 1).getDay();
  const days = new Date(t.y, t.m, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("h3", { children: [
      t.m,
      "\uC6D4 \uC77C\uC9C4 \uB2EC\uB825"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "calendar", role: "grid", "aria-label": `${t.y}\uB144 ${t.m}\uC6D4 \uC77C\uC9C4`, children: [
      ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "dow", children: d }, d)),
      cells.map((d, i) => {
        if (!d) return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", {}, `e${i}`);
        const g = dayGanji(t.y, t.m, d);
        const mood = dayMood(g);
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: `day mood-${mood.key} ${d === t.d ? "today" : ""}`, title: `${mood.label} \xB7 ${mood.hint}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("b", { className: "num", children: d }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { children: [
            GAN[g.gan],
            JI[g.ji]
          ] })
        ] }, d);
      })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "cal-legend", children: MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("i", { className: `mood-${m.key}` }),
      m.label
    ] }, m.key)) })
  ] });
}

// lib/products.ts
var PRODUCT_BASE = {
  single: { persons: 1, love: false, report: true, deliverable: "30\uCABD \uB9AC\uD3EC\uD2B8 1\uAD8C" },
  double: { persons: 2, love: false, report: true, deliverable: "30\uCABD \uB9AC\uD3EC\uD2B8 2\uAD8C" },
  "single-love": { persons: 2, love: true, report: true, deliverable: "30\uCABD 1\uAD8C + \uAD81\uD569 \uBCC4\uCC45 12\uCABD" },
  "double-love": { persons: 2, love: true, report: true, deliverable: "30\uCABD 2\uAD8C + \uAD81\uD569 \uBCC4\uCC45 12\uCABD" }
};
var PRODUCT_IDS = Object.keys(PRODUCT_BASE);
function productList(cfg = DEFAULT_SITE) {
  return PRODUCT_IDS.map((id) => ({ id, ...PRODUCT_BASE[id], ...cfg.products[id] }));
}
var reportProducts = (cfg = DEFAULT_SITE) => productList(cfg).filter((p) => p.report && p.visible);
function productById(id, cfg = DEFAULT_SITE) {
  return productList(cfg).find((p) => p.id === id);
}
var won = (n) => n.toLocaleString("ko-KR") + "\uC6D0";

// components/site/Sections.tsx
var import_jsx_runtime12 = __toESM(require_jsx_runtime());
function SectionHead({ cfg, id }) {
  const c = cfg.copy[id];
  if (!c.eyebrow && !c.title && !c.sub) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "section-head", children: [
    c.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "eyebrow", children: fill(c.eyebrow, cfg) }),
    c.title && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h2", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Rich, { text: fill(c.title, cfg) }) }),
    c.sub && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: fill(c.sub, cfg) })
  ] });
}
function FreeSection({ cfg }) {
  const single = productList(cfg).find((p) => p.id === "single");
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "free" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(FreeTabs, { variant: cfg.variants.free, singlePrice: single.price, base: cfg.base ?? "" }),
    (cfg.extras.luckyCard || cfg.extras.calendar) && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "extras", children: [
      cfg.extras.luckyCard && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(LuckyCard, {}),
      cfg.extras.calendar && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(MonthCalendar, {})
    ] })
  ] });
}
function AboutSection({ cfg }) {
  const a = cfg.about;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "about", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("figure", { className: "about-photo", children: a.photo ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("img", { src: a.photo, alt: a.name || cfg.brand.name }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "profile-empty", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(BrandMark, { cfg, size: 88 }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: "\uC0AC\uC9C4\uC744 \uC62C\uB824\uC8FC\uC138\uC694" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "about" }),
      (a.name || a.role) && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("p", { className: "about-name", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("b", { children: a.name }),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: a.role })
      ] }),
      a.greeting && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "about-greeting", children: fill(a.greeting, cfg) }),
      a.career.filter(Boolean).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("ul", { className: "about-career", children: a.career.filter(Boolean).map((c) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("li", { children: c }, c)) })
    ] })
  ] });
}
function WhySection({ cfg }) {
  const v = cfg.variants.why;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "why" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: `why why-${v}`, children: cfg.why.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("article", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "fig num", children: v === "numbers" ? String(i + 1).padStart(2, "0") : w.fig }),
      v === "numbers" && w.fig && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "fig-sub", children: w.fig }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h3", { children: fill(w.title, cfg) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: fill(w.body, cfg) })
    ] }, i)) })
  ] });
}
function ReportSection({ cfg }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "report" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ReportSample,
      {
        brand: cfg.brand.name,
        coverImage: cfg.report.cover === "image" ? cfg.report.coverImage : "",
        coverText: cfg.report.coverText
      }
    )
  ] });
}
var COMPARE = [
  ["\uB124 \uAE30\uB465 \uD45C\uC640 \uC624\uD589 \uBD84\uD3EC", "\uBCF4\uAE30", "\uD45C + \uD480\uC774"],
  ["\uB098\uB97C \uC0C1\uC9D5\uD558\uB294 \uC790\uC5F0", "\uD55C \uC904", "2\uCABD"],
  ["\uAC89\uC73C\uB85C \uBCF4\uC774\uB294 \uB098, \uC18D\uC758 \uB098", "\u2014", "2\uCABD"],
  ["\uC77C\uACFC \uC9C1\uC5C5 \uBC29\uD5A5", "\u2014", "2\uCABD"],
  ["\uB3C8\uC774 \uB4E4\uC5B4\uC624\uACE0 \uC0C8\uB294 \uAE38", "\u2014", "2\uCABD"],
  ["\uC5F0\uC560\uC640 \uBC30\uC6B0\uC790 \uC790\uB9AC", "\u2014", "2\uCABD"],
  ["\uB300\uC6B4: 10\uB144 \uB2E8\uC704 \uC778\uC0DD\uC758 \uACC4\uC808", "\uD45C\uB9CC", "3\uCABD \uD480\uC774"],
  ["\uC62C\uD574 \uD750\uB984\uACFC \uC55E\uC73C\uB85C 12\uAC1C\uC6D4", "\uD55C \uC904", "3\uCABD"],
  ["\uC55E\uC73C\uB85C 5\uB144 \uB85C\uB4DC\uB9F5", "\u2014", "1\uCABD"],
  ["\uB0A8\uACA8\uC8FC\uC2E0 \uC9C8\uBB38\uC5D0 \uB300\uD55C \uB2F5", "\u2014", "1\uCABD"],
  ["PDF\uB85C \uC18C\uC7A5", "\u2014", "30\uCABD"]
];
function CompareSection({ cfg }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "compare" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "table-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("table", { className: "compare", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("th", { scope: "col", children: "\uB0B4\uC6A9" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("th", { scope: "col", children: "\uBB34\uB8CC \uCCB4\uD5D8" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("th", { scope: "col", children: "30\uCABD \uB9AC\uD3EC\uD2B8" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("tbody", { children: COMPARE.map(([k, f, r]) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { children: k }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { className: f === "\u2014" ? "n" : "", children: f }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { className: "y", children: r })
      ] }, k)) })
    ] }) })
  ] });
}
function savings(p, all) {
  const price = (id) => all.find((x) => x.id === id)?.price ?? 0;
  const single = price("single");
  const loveExtra = price("single-love") - single;
  if (p.id === "double") return single * 2 - p.price;
  if (p.id === "double-love") return single * 2 + loveExtra - p.price;
  return 0;
}
function PriceSection({ cfg }) {
  const all = productList(cfg);
  const items = reportProducts(cfg);
  const v = cfg.variants.price;
  const featuredId = items.find((p) => p.badge)?.id;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "price" }),
    v === "cards" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "products", children: items.map((p) => {
      const save = savings(p, all);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("article", { className: `product ${p.id === featuredId ? "best" : ""}`, children: [
        p.badge && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "badge", children: p.badge }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h3", { children: p.name }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "price", children: [
          p.price.toLocaleString("ko-KR"),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("small", { children: "\uC6D0" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("ul", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("li", { children: p.deliverable }),
          p.pitch && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("li", { children: p.pitch }),
          save > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("li", { className: "save", children: [
            "\uB530\uB85C \uC2E0\uCCAD\uD560 \uB54C\uBCF4\uB2E4 ",
            won(save),
            " \uC808\uC57D"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Link, { className: `btn ${p.id === featuredId ? "btn-primary" : "btn-ghost"}`, href: siteHref(cfg, `/apply?product=${p.id}`), children: "\uC2E0\uCCAD\uD558\uAE30" })
      ] }, p.id);
    }) }),
    v === "list" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("ul", { className: "price-list", children: items.map((p) => {
      const save = savings(p, all);
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("li", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "pl-name", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("b", { children: p.name }),
          p.badge && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "badge-inline", children: p.badge }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { children: [
            p.deliverable,
            p.pitch ? ` \xB7 ${p.pitch}` : ""
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "pl-price", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("b", { className: "num", children: won(p.price) }),
          save > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: "save", children: [
            won(save),
            " \uC808\uC57D"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Link, { className: "btn btn-primary btn-sm", href: siteHref(cfg, `/apply?product=${p.id}`), children: "\uC2E0\uCCAD" })
      ] }, p.id);
    }) }),
    v === "table" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "table-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("table", { className: "compare price-table", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("th", { scope: "col" }),
        items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("th", { scope: "col", children: [
          p.name,
          p.badge && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("br", {}),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "badge-inline", children: p.badge })
          ] })
        ] }, p.id))
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tbody", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { children: "\uBC1B\uB294 \uAC83" }),
          items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { children: p.deliverable }, p.id))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { children: "\uD480\uC774 \uC778\uC6D0" }),
          items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("td", { children: [
            p.persons,
            "\uBA85"
          ] }, p.id))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { children: "\uC5F0\uC778\uAD81\uD569 \uBCC4\uCC45" }),
          items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { className: p.love ? "y" : "n", children: p.love ? "\uD3EC\uD568" : "\u2014" }, p.id))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { children: "\uAC00\uACA9" }),
          items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { className: "y num", children: won(p.price) }, p.id))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", {}),
          items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Link, { className: "btn btn-primary btn-sm", href: siteHref(cfg, `/apply?product=${p.id}`), children: "\uC2E0\uCCAD" }) }, p.id))
        ] })
      ] })
    ] }) })
  ] });
}
function ProcessSection({ cfg }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "process" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("ol", { className: `steps steps-${cfg.variants.process}`, children: cfg.process.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("li", { children: [
      s.time && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "time", children: s.time }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h3", { children: s.title }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: s.body })
    ] }, i)) })
  ] });
}
var stars = (n) => "\u2605\u2605\u2605\u2605\u2605".slice(0, Math.max(0, Math.min(5, n))) + "\u2606\u2606\u2606\u2606\u2606".slice(0, 5 - Math.max(0, Math.min(5, n)));
function ReviewsSection({ cfg }) {
  const v = cfg.variants.reviews;
  const list = v === "quote" ? cfg.reviews.slice(0, 3) : cfg.reviews;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "reviews" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: `reviews reviews-${v}`, children: list.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("figure", { className: "review", children: [
      v !== "quote" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "stars", "aria-label": `\uBCC4\uC810 ${r.stars}\uC810`, children: stars(r.stars) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("blockquote", { children: r.text }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("figcaption", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("b", { children: r.name }),
        r.product && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { children: [
          " \xB7 ",
          r.product
        ] })
      ] })
    ] }, i)) })
  ] });
}
function FaqSection({ cfg }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SectionHead, { cfg, id: "faq" }),
    cfg.variants.faq === "columns" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("dl", { className: "faq-columns", children: cfg.faq.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("dt", { children: fill(f.q, cfg) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("dd", { children: fill(f.a, cfg) })
    ] }, i)) }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "faq", children: cfg.faq.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("details", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("summary", { children: fill(f.q, cfg) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: fill(f.a, cfg) })
    ] }, i)) })
  ] });
}
function FinalSection({ cfg }) {
  const c = cfg.copy.final;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("section", { id: "final", "data-section": "final", className: "final on-dark", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "final-moon", "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "container", children: [
      c.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { className: "eyebrow", children: fill(c.eyebrow, cfg) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h2", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Rich, { text: fill(cfg.final.title, cfg) }) }),
      cfg.final.sub && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: fill(cfg.final.sub, cfg) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Link, { className: "btn btn-primary", href: siteHref(cfg, "/apply"), children: cfg.final.cta || "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD\uD558\uAE30" })
    ] })
  ] });
}

// components/site/Landing.tsx
var import_jsx_runtime13 = __toESM(require_jsx_runtime());
var BODY = {
  free: FreeSection,
  about: AboutSection,
  why: WhySection,
  report: ReportSection,
  compare: CompareSection,
  price: PriceSection,
  process: ProcessSection,
  reviews: ReviewsSection,
  faq: FaqSection
};
function minReportPrice(cfg) {
  const prices = reportProducts(cfg).map((p) => p.price);
  return prices.length ? Math.min(...prices) : 0;
}
function SiteFrame({ cfg, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(SiteTheme, { config: cfg, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Banner, { cfg }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SiteHeader, { cfg }),
    children,
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SiteFooter, { cfg })
  ] });
}
function Landing({ cfg }) {
  const visible = cfg.sections.filter((s) => s.on && (s.id !== "reviews" || cfg.reviews.length > 0));
  let n = 0;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(SiteTheme, { config: cfg, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Banner, { cfg }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SiteHeader, { cfg }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("main", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Hero, { cfg }),
      visible.map((s) => {
        if (s.id === "final") return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FinalSection, { cfg }, "final");
        const Body = BODY[s.id];
        const alt = cfg.theme.altSections && n++ % 2 === 0;
        return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("section", { id: s.id, "data-section": s.id, className: `section section-${s.id} ${alt ? "alt" : ""}`, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "container", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Body, { cfg }) }) }, s.id);
      })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(SiteFooter, { cfg }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(StickyCta, { cfg, minPrice: minReportPrice(cfg) })
  ] });
}

// components/ApplyForm.tsx
var import_react8 = __toESM(require_react());

// rwbundle/shims/next-navigation.ts
function useRouter() {
  return {
    push: (url) => {
      window.location.href = url;
    },
    replace: (url) => {
      window.location.replace(url);
    },
    refresh: () => {
      window.location.reload();
    }
  };
}

// components/ApplyForm.tsx
var import_jsx_runtime14 = __toESM(require_jsx_runtime());
var emptyPerson = () => ({ name: "", gender: "\uC5EC", birthDate: "", calendar: "\uC591\uB825", isLeapMonth: false, birthTime: "", timeUnknown: false, region: "" });
var PHONE = /^01[016789]-?\d{3,4}-?\d{4}$/;
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var TYPO = { "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "naver.co": "naver.com", "navr.com": "naver.com", "nave.com": "naver.com", "daum.ne": "daum.net", "hanmail.ne": "hanmail.net" };
function sentence(p) {
  if (!p.birthDate) return "";
  const [y, m, d] = p.birthDate.split("-").map(Number);
  let time = "\uD0DC\uC5B4\uB09C \uC2DC\uAC04\uC740 \uBAA8\uB984";
  if (!p.timeUnknown && p.birthTime) {
    const [h, mi] = p.birthTime.split(":").map(Number);
    time = `${h < 12 ? "\uC624\uC804" : "\uC624\uD6C4"} ${h % 12 === 0 ? 12 : h % 12}\uC2DC${mi ? ` ${mi}\uBD84` : ""}`;
  }
  return `${p.calendar} ${y}\uB144 ${m}\uC6D4 ${d}\uC77C${p.calendar === "\uC74C\uB825" && p.isLeapMonth ? "(\uC724\uB2EC)" : ""} ${time}, ${p.region || "\uC9C0\uC5ED \uBBF8\uC785\uB825"}\uC5D0\uC11C \uD0DC\uC5B4\uB09C ${p.gender === "\uC5EC" ? "\uC5EC\uC131" : "\uB0A8\uC131"} ${p.name || "\uC774\uB984 \uBBF8\uC785\uB825"} \uB2D8`;
}
function ApplyForm({ initialProduct, products, base = "" }) {
  const router = useRouter();
  const [productId, setProductId] = (0, import_react8.useState)(initialProduct);
  const [applicant, setApplicant] = (0, import_react8.useState)({ name: "", phone: "", email: "", depositor: "", question: "" });
  const [persons, setPersons] = (0, import_react8.useState)([emptyPerson(), emptyPerson()]);
  const [relation, setRelation] = (0, import_react8.useState)("\uC5F0\uC778");
  const [consents, setConsents] = (0, import_react8.useState)({ privacy: false, refund: false });
  const [step, setStep] = (0, import_react8.useState)("form");
  const [errors, setErrors] = (0, import_react8.useState)({});
  const [sending, setSending] = (0, import_react8.useState)(false);
  const [serverError, setServerError] = (0, import_react8.useState)("");
  const product = products.find((p) => p.id === productId) ?? products[0];
  const count = product.persons;
  (0, import_react8.useEffect)(() => {
    try {
      const b = JSON.parse(sessionStorage.getItem("rw_birth") || "null");
      if (b?.date) {
        setPersons((ps) => [{ ...ps[0], name: b.name || "", birthDate: b.date, birthTime: b.time || "", timeUnknown: !!b.timeUnknown, calendar: b.calendar || "\uC591\uB825", gender: b.gender || "\uC5EC" }, ps[1]]);
        if (b.name) setApplicant((a) => ({ ...a, name: b.name, depositor: b.name }));
      }
    } catch {
    }
  }, []);
  const setP = (i, patch) => setPersons((ps) => ps.map((p, j2) => j2 === i ? { ...p, ...patch } : p));
  const emailDomain = applicant.email.split("@")[1]?.toLowerCase() ?? "";
  const suggestion = TYPO[emailDomain];
  const validate = () => {
    const e = {};
    if (!applicant.name.trim()) e.name = "\uC2E0\uCCAD\uC790 \uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694";
    if (!PHONE.test(applicant.phone.trim())) e.phone = "010-0000-0000 \uD615\uC2DD\uC73C\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694";
    if (!EMAIL.test(applicant.email.trim())) e.email = "\uB9AC\uD3EC\uD2B8\uB97C \uBC1B\uC744 \uC774\uBA54\uC77C \uC8FC\uC18C\uB97C \uC815\uD655\uD788 \uC785\uB825\uD574\uC8FC\uC138\uC694";
    if (!applicant.depositor.trim()) e.depositor = "\uC785\uAE08\uD558\uC2E4 \uBD84\uC758 \uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694";
    for (let i = 0; i < count; i++) {
      const p = persons[i];
      if (!p.name.trim()) e[`p${i}name`] = "\uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate)) e[`p${i}date`] = "\uC0DD\uB144\uC6D4\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694";
      if (!p.timeUnknown && !p.birthTime) e[`p${i}time`] = "\uC2DC\uAC04\uC744 \uC785\uB825\uD558\uAC70\uB098 '\uC2DC\uAC04\uC744 \uBAB0\uB77C\uC694'\uB97C \uCCB4\uD06C\uD574\uC8FC\uC138\uC694";
      if (!p.region) e[`p${i}region`] = "\uD0DC\uC5B4\uB09C \uC9C0\uC5ED\uC744 \uACE8\uB77C\uC8FC\uC138\uC694";
    }
    if (!consents.privacy) e.privacy = "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 \uB3D9\uC758\uD574\uC8FC\uC138\uC694";
    if (!consents.refund) e.refund = "\uD658\uBD88 \uADDC\uC815\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = async () => {
    setSending(true);
    setServerError("");
    try {
      const res = await fetch(`${base}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, applicant, persons: persons.slice(0, count), relation: product.love ? relation : void 0, consents })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "\uC2E0\uCCAD\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694");
      try {
        sessionStorage.removeItem("rw_birth");
      } catch {
      }
      router.push(`${base}/apply/done?no=${encodeURIComponent(json.no ?? "")}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "\uC2E0\uCCAD\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC7A0\uC2DC \uB4A4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
      setSending(false);
    }
  };
  const Err = ({ k }) => errors[k] ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "error", role: "alert", children: errors[k] }) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "apply-grid", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { children: step === "form" ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("form", { onSubmit: (e) => {
      e.preventDefault();
      if (validate()) {
        setStep("confirm");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, noValidate: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "form-block", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h2", { children: "\uC0C1\uD488 \uC120\uD0DD" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "pick-products", role: "radiogroup", "aria-label": "\uC0C1\uD488", children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { className: "pick", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "radio", name: "product", value: p.id, checked: productId === p.id, onChange: () => setProductId(p.id) }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("b", { children: p.name }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("em", { children: p.deliverable }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("strong", { children: won(p.price) })
          ] })
        ] }, p.id)) })
      ] }),
      Array.from({ length: count }, (_, i) => {
        const p = persons[i];
        const id = (s) => `p${i}-${s}`;
        return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "form-block", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("h2", { children: [
            count === 1 ? "\uD480\uC774 \uBC1B\uC744 \uBD84" : i === 0 ? "\uCCAB \uBC88\uC9F8 \uBD84" : product.love ? "\uC0C1\uB300\uBC29" : "\uB450 \uBC88\uC9F8 \uBD84",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("small", { children: "\uC0DD\uB144\uC6D4\uC77C\uC740 \uC815\uD655\uD560\uC218\uB85D \uC88B\uC544\uC694" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "row-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: id("name"), children: "\uC774\uB984" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { id: id("name"), className: "input", value: p.name, onChange: (e) => setP(i, { name: e.target.value }), "aria-invalid": !!errors[`p${i}name`] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: `p${i}name` })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "label", children: "\uC131\uBCC4" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "seg", role: "radiogroup", "aria-label": "\uC131\uBCC4", children: ["\uC5EC", "\uB0A8"].map((g) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "radio", name: id("gender"), checked: p.gender === g, onChange: () => setP(i, { gender: g }) }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: g === "\uC5EC" ? "\uC5EC\uC131" : "\uB0A8\uC131" })
              ] }, g)) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "row-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: id("date"), children: "\uC0DD\uB144\uC6D4\uC77C" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { id: id("date"), type: "date", min: "1920-01-01", className: "input", value: p.birthDate, onChange: (e) => setP(i, { birthDate: e.target.value }), "aria-invalid": !!errors[`p${i}date`] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: `p${i}date` })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "label", children: "\uB2EC\uB825" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "seg", role: "radiogroup", "aria-label": "\uC591\uB825 \uC74C\uB825", children: ["\uC591\uB825", "\uC74C\uB825"].map((c) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "radio", name: id("cal"), checked: p.calendar === c, onChange: () => setP(i, { calendar: c }) }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: c })
              ] }, c)) }),
              p.calendar === "\uC74C\uB825" && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { className: "check", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "checkbox", checked: p.isLeapMonth, onChange: (e) => setP(i, { isLeapMonth: e.target.checked }) }),
                " \uC724\uB2EC\uC774\uC5D0\uC694"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "row-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: id("time"), children: "\uD0DC\uC5B4\uB09C \uC2DC\uAC04" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { id: id("time"), type: "time", className: "input", value: p.birthTime, disabled: p.timeUnknown, onChange: (e) => setP(i, { birthTime: e.target.value }), "aria-invalid": !!errors[`p${i}time`] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { className: "check", children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "checkbox", checked: p.timeUnknown, onChange: (e) => setP(i, { timeUnknown: e.target.checked, birthTime: "" }) }),
                " \uC2DC\uAC04\uC744 \uBAB0\uB77C\uC694"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: `p${i}time` })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: id("region"), children: "\uD0DC\uC5B4\uB09C \uC9C0\uC5ED" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("select", { id: id("region"), className: "select", value: p.region, onChange: (e) => setP(i, { region: e.target.value }), "aria-invalid": !!errors[`p${i}region`], children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: "", children: "\uC2DC\xB7\uB3C4 \uC120\uD0DD" }),
                REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("option", { value: r, children: r }, r))
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "hint", children: "\uC9C0\uC5ED\uC5D0 \uB530\uB77C \uCD9C\uC0DD \uC2DC\uAC01\uC744 \uBA87 \uBD84 \uB2E8\uC704\uB85C \uBCF4\uC815\uD574\uC694" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: `p${i}region` })
            ] })
          ] })
        ] }, i);
      }),
      product.love && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "form-block", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h2", { children: "\uB450 \uBD84\uC758 \uAD00\uACC4" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "seg", role: "radiogroup", "aria-label": "\uAD00\uACC4", children: ["\uC5F0\uC778", "\uBC30\uC6B0\uC790"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "radio", name: "relation", checked: relation === r, onChange: () => setRelation(r) }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: r })
        ] }, r)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "form-block", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("h2", { children: [
          "\uC5F0\uB77D\uCC98 ",
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("small", { children: "\uB9AC\uD3EC\uD2B8\uB294 \uC774\uBA54\uC77C\uB85C \uBCF4\uB0B4\uB4DC\uB824\uC694" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "row-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: "ap-name", children: "\uC2E0\uCCAD\uC790 \uC774\uB984" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { id: "ap-name", className: "input", value: applicant.name, onChange: (e) => setApplicant({ ...applicant, name: e.target.value }), "aria-invalid": !!errors.name, autoComplete: "name" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: "name" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: "ap-phone", children: "\uC804\uD654\uBC88\uD638" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { id: "ap-phone", className: "input", inputMode: "tel", placeholder: "010-0000-0000", value: applicant.phone, onChange: (e) => setApplicant({ ...applicant, phone: e.target.value }), "aria-invalid": !!errors.phone, autoComplete: "tel" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: "phone" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: "ap-email", children: "\uC774\uBA54\uC77C" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { id: "ap-email", className: "input", type: "email", inputMode: "email", placeholder: "name@example.com", value: applicant.email, onChange: (e) => setApplicant({ ...applicant, email: e.target.value.trim() }), "aria-invalid": !!errors.email, autoComplete: "email" }),
          suggestion && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("button", { type: "button", className: "hint", style: { background: "none", border: 0, padding: 0, textAlign: "left", color: "var(--accent)" }, onClick: () => setApplicant({ ...applicant, email: applicant.email.split("@")[0] + "@" + suggestion }), children: [
            "\uD639\uC2DC ",
            applicant.email.split("@")[0],
            "@",
            suggestion,
            " \uC778\uAC00\uC694? \uB20C\uB7EC\uC11C \uACE0\uCE58\uAE30"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: "email" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { htmlFor: "ap-depositor", children: "\uC785\uAE08\uC790\uBA85" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { id: "ap-depositor", className: "input", value: applicant.depositor, onChange: (e) => setApplicant({ ...applicant, depositor: e.target.value }), "aria-invalid": !!errors.depositor }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: "depositor" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { htmlFor: "ap-question", children: [
            "\uB9AC\uD3EC\uD2B8\uC5D0\uC11C \uAF2D \uB2F5\uC744 \uB4E3\uACE0 \uC2F6\uC740 \uC9C8\uBB38 ",
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "hint", children: "(\uC120\uD0DD)" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("textarea", { id: "ap-question", className: "textarea", maxLength: 500, placeholder: "\uC608: \uC62C\uD574 \uC774\uC9C1\uD574\uB3C4 \uAD1C\uCC2E\uC744\uAE4C\uC694?", value: applicant.question, onChange: (e) => setApplicant({ ...applicant, question: e.target.value }) }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "hint", children: [
            applicant.question.length,
            " / 500 \xB7 \uB9AC\uD3EC\uD2B8 28\uCABD\uC5D0\uC11C \uB2F5\uD574\uB4DC\uB824\uC694"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "form-block", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h2", { children: "\uB3D9\uC758" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { className: "check", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "checkbox", checked: consents.privacy, onChange: (e) => setConsents({ ...consents, privacy: e.target.checked }) }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
            "[\uD544\uC218] \uB9AC\uD3EC\uD2B8 \uC791\uC131\uACFC \uBC1C\uC1A1\uC744 \uC704\uD55C \uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9\uC5D0 \uB3D9\uC758\uD574\uC694. \uBC1C\uC1A1 \uD6C4 1\uB144 \uB4A4 \uC0AD\uC81C\uB3FC\uC694. ",
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("a", { href: `${base}/policy#privacy`, target: "_blank", children: "\uC790\uC138\uD788" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: "privacy" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("label", { className: "check", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("input", { type: "checkbox", checked: consents.refund, onChange: (e) => setConsents({ ...consents, refund: e.target.checked }) }),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { children: [
            "[\uD544\uC218] \uD480\uC774 \uC791\uC131\uC774 \uC2DC\uC791\uB418\uBA74 \uD658\uBD88\uC774 \uC5B4\uB835\uB2E4\uB294 \uC810\uC744 \uD655\uC778\uD588\uC5B4\uC694. ",
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("a", { href: `${base}/policy#refund`, target: "_blank", children: "\uD658\uBD88 \uADDC\uC815" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Err, { k: "refund" })
      ] }),
      Object.keys(errors).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "form-error", role: "alert", children: "\uC785\uB825\uD558\uC9C0 \uC54A\uC740 \uD56D\uBAA9\uC774 \uC788\uC5B4\uC694. \uBE68\uAC04 \uC548\uB0B4\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694." }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { className: "btn btn-primary", type: "submit", style: { width: "100%" }, children: "\uC785\uB825 \uB0B4\uC6A9 \uD655\uC778\uD558\uAE30" })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "form-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h2", { children: "\uC774 \uB0B4\uC6A9\uC774 \uB9DE\uB098\uC694?" }),
      persons.slice(0, count).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "confirm-sheet", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("q", { children: sentence(p) }) }, i)),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("p", { style: { margin: 0 }, children: [
        "\uB9AC\uD3EC\uD2B8\uB294 ",
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("b", { children: applicant.email }),
        "\uB85C, \uC548\uB0B4 \uBB38\uC790\uB294 ",
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("b", { children: applicant.phone }),
        "\uB85C \uBCF4\uB0B4\uB4DC\uB824\uC694."
      ] }),
      serverError && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("p", { className: "form-error", role: "alert", children: serverError }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { className: "btn btn-ghost", onClick: () => setStep("form"), disabled: sending, children: "\uACE0\uCE58\uAE30" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { className: "btn btn-primary", onClick: submit, disabled: sending, style: { flex: 1 }, children: sending ? "\uC2E0\uCCAD \uC800\uC7A5 \uC911\u2026" : `${won(product.price)} \uC2E0\uCCAD \uC644\uB8CC\uD558\uAE30` })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("aside", { className: "summary-box on-dark", "aria-label": "\uC2E0\uCCAD \uC694\uC57D", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { style: { fontSize: 13, color: "var(--night-muted)" }, children: "\uC120\uD0DD\uD55C \uC0C1\uD488" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h3", { children: product.name }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "total", children: won(product.price) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("ul", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("li", { children: product.deliverable }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("li", { children: "\uC785\uAE08 \uD655\uC778 \uD6C4 \uD480\uC774 \uC791\uC131 \uC2DC\uC791" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("li", { children: "\uC791\uC131\uC774 \uB05D\uB098\uBA74 \uC774\uBA54\uC77C\uB85C PDF \uBC1C\uC1A1" })
      ] })
    ] })
  ] });
}

// components/site/Pages.tsx
var import_jsx_runtime15 = __toESM(require_jsx_runtime());
function ApplyView({ cfg, product }) {
  const products = reportProducts(cfg);
  const initial = products.some((p) => p.id === product) ? product : products[0]?.id ?? "single";
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(SiteFrame, { cfg, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("main", { className: "apply", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "container", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "eyebrow", children: "\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h1", { children: "\uD55C \uC0AC\uB78C\uC758 \uC774\uC57C\uAE30\uB97C \uC4F0\uAE30 \uC704\uD574 \uD544\uC694\uD55C \uAC83\uB4E4" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { style: { color: "var(--muted)", margin: "0 0 28px" }, children: "\uC785\uB825\uD558\uC2E0 \uC815\uBCF4\uB85C \uB9CC\uC138\uB825\uC744 \uACC4\uC0B0\uD574 \uD480\uC774\uB97C \uC2DC\uC791\uD574\uC694. 3\uBD84\uC774\uBA74 \uB05D\uB098\uC694." }),
    products.length ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(ApplyForm, { initialProduct: initial, products, base: cfg.base ?? "" }) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "\uC9C0\uAE08\uC740 \uC2E0\uCCAD\uC744 \uBC1B\uACE0 \uC788\uC9C0 \uC54A\uC544\uC694." })
  ] }) }) });
}
function DoneView({ cfg, no, bank, kakao }) {
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(SiteFrame, { cfg, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("main", { className: "done", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "container", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "done-card", children: [
    no && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { className: "eyebrow", style: { margin: 0 }, children: [
      "\uC811\uC218 \uBC88\uD638 ",
      no
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h1", { children: "\uC2E0\uCCAD\uC774 \uC811\uC218\uB410\uC5B4\uC694" }),
    bank ? /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "bank-box", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "read-label", children: "\uC785\uAE08 \uC548\uB0B4" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("dl", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("dt", { children: "\uC785\uAE08 \uACC4\uC88C" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("dd", { children: [bank.bankName, bank.account].filter(Boolean).join(" ") })
        ] }),
        bank.holder && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("dt", { children: "\uC608\uAE08\uC8FC" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("dd", { children: bank.holder })
        ] }),
        bank.amount != null && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("dt", { children: "\uAE08\uC561" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("dd", { className: "num", children: won(bank.amount) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: bank.notice })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { style: { margin: 0, color: "var(--muted)" }, children: "\uC785\uAE08 \uC548\uB0B4\uC640 \uC9C4\uD589 \uC18C\uC2DD\uC740 \uC785\uB825\uD558\uC2E0 \uC804\uD654\uBC88\uD638\uC640 \uC774\uBA54\uC77C\uB85C \uBCF4\uB0B4\uB4DC\uB824\uC694. \uC870\uAE08\uB9CC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694." }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("ol", { style: { margin: 0, paddingLeft: "1.2em", color: "var(--muted)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: bank ? "\uC704 \uACC4\uC88C\uB85C \uC785\uAE08\uD558\uAE30" : "\uC785\uAE08 \uC548\uB0B4 \uBC1B\uAE30" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uC785\uAE08 \uD655\uC778 \uD6C4 \uB9CC\uC138\uB825 \uC815\uBC00 \uACC4\uC0B0\uACFC 30\uCABD \uD480\uC774 \uC791\uC131" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uAC80\uC218\uB97C \uAC70\uCCD0 \uC774\uBA54\uC77C\uB85C \uB9AC\uD3EC\uD2B8 \uBC1C\uC1A1" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 }, children: [
      kakao && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("a", { className: "btn btn-primary", href: kakao, target: "_blank", rel: "noreferrer", children: "\uCE74\uCE74\uC624\uD1A1\uC73C\uB85C \uBB38\uC758\uD558\uAE30" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Link, { href: siteHref(cfg, "/"), className: "btn btn-ghost", children: "\uCC98\uC74C\uC73C\uB85C" })
    ] })
  ] }) }) }) });
}
function PolicyView({ cfg }) {
  const c = cfg.contact;
  const contact = [c.email && `\uC774\uBA54\uC77C ${c.email}`, c.phone && `\uC804\uD654 ${c.phone}`].filter(Boolean).join(" \xB7 ");
  const biz = [c.ceo && `\uB300\uD45C ${c.ceo}`, c.bizNo && `\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 ${c.bizNo}`, c.ecommerceNo && `\uD1B5\uC2E0\uD310\uB9E4\uC5C5 \uC2E0\uACE0 ${c.ecommerceNo}`, c.address].filter(Boolean).join(" \xB7 ");
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(SiteFrame, { cfg, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("main", { className: "container", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "prose", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h1", { children: "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68 \xB7 \uD658\uBD88 \uADDC\uC815" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { children: [
      cfg.brand.name,
      "\uC740 \uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD\uC5D0 \uD544\uC694\uD55C \uCD5C\uC18C\uD55C\uC758 \uC815\uBCF4\uB9CC \uBC1B\uACE0, \uC544\uB798 \uAE30\uC900\uC5D0 \uB530\uB77C \uC548\uC804\uD558\uAC8C \uAD00\uB9AC\uD574\uC694."
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h2", { id: "privacy", children: "\uC218\uC9D1\uD558\uB294 \uC815\uBCF4" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("ul", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uD544\uC218: \uC2E0\uCCAD\uC790 \uC774\uB984, \uC804\uD654\uBC88\uD638, \uC774\uBA54\uC77C, \uC785\uAE08\uC790\uBA85" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uD544\uC218: \uD480\uC774 \uB300\uC0C1\uC790\uC758 \uC774\uB984, \uC131\uBCC4, \uC0DD\uB144\uC6D4\uC77C, \uC591\uB825\xB7\uC74C\uB825, \uD0DC\uC5B4\uB09C \uC2DC\uAC04(\uC120\uD0DD \uAC00\uB2A5), \uD0DC\uC5B4\uB09C \uC9C0\uC5ED" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uC120\uD0DD: \uAD81\uAE08\uD55C \uC810" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h2", { children: "\uC774\uC6A9 \uBAA9\uC801\uACFC \uBCF4\uAD00 \uAE30\uAC04" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { children: [
      cfg.brand.name,
      "\uC740 \uC0AC\uC8FC \uACC4\uC0B0, \uB9AC\uD3EC\uD2B8 \uC791\uC131, \uC774\uBA54\uC77C \uBC1C\uC1A1, \uBB38\uC758 \uC751\uB300\uC5D0\uB9CC \uC774\uC6A9\uD574\uC694. \uB9AC\uD3EC\uD2B8 \uBC1C\uC1A1 \uD6C4 1\uB144\uC774 \uC9C0\uB098\uBA74 \uC9C0\uCCB4 \uC5C6\uC774 \uC0AD\uC81C\uD574\uC694. \uBC95\uB839\uC5D0 \uB530\uB77C \uBCF4\uAD00\uD574\uC57C \uD558\uB294 \uAC70\uB798 \uAE30\uB85D\uC740 \uD574\uB2F9 \uAE30\uAC04 \uB3D9\uC548\uB9CC \uBCF4\uAD00\uD574\uC694."
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h2", { children: "\uC81C3\uC790 \uC81C\uACF5" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "\uC774\uC6A9\uC790\uC758 \uB3D9\uC758 \uC5C6\uC774 \uC678\uBD80\uC5D0 \uC81C\uACF5\uD558\uC9C0 \uC54A\uC544\uC694. \uB2E4\uB9CC \uBC95\uB839\uC5D0 \uB530\uB77C \uC81C\uCD9C \uC758\uBB34\uAC00 \uC788\uB294 \uACBD\uC6B0\uB294 \uC608\uC678\uB85C \uD574\uC694." }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h2", { id: "refund", children: "\uD658\uBD88 \uADDC\uC815" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("ul", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uD480\uC774 \uC791\uC131 \uC2DC\uC791 \uC804: \uC804\uC561 \uD658\uBD88" }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uD480\uC774 \uC791\uC131 \uC2DC\uC791 \uD6C4: \uD55C \uC0AC\uB78C\uC744 \uC704\uD574 \uC81C\uC791\uB418\uB294 \uB514\uC9C0\uD138 \uCF58\uD150\uCE20\uB85C, \uC804\uC790\uC0C1\uAC70\uB798\uBC95\uC5D0 \uB530\uB77C \uCCAD\uC57D\uCCA0\uD68C\uAC00 \uC81C\uD55C\uB3FC\uC694. \uC2E0\uCCAD\uC11C \uC81C\uCD9C \uC804\uC5D0 \uC774 \uB0B4\uC6A9\uC744 \uC548\uB0B4\uD558\uACE0 \uB3D9\uC758\uB97C \uBC1B\uC544\uC694." }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("li", { children: "\uB9AC\uD3EC\uD2B8\uC5D0 \uC785\uB825 \uC815\uBCF4\uC640 \uB2E4\uB978 \uACC4\uC0B0 \uC624\uB958\uAC00 \uC788\uC73C\uBA74 \uBB34\uB8CC\uB85C \uB2E4\uC2DC \uC791\uC131\uD574\uB4DC\uB824\uC694." })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h2", { children: "\uCC38\uACE0 \uC0AC\uD56D" }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { children: "\uC0AC\uC8FC \uD480\uC774\uB294 \uC0B6\uC758 \uBC29\uD5A5\uC744 \uCC38\uACE0\uD558\uB294 \uCF58\uD150\uCE20\uC774\uBA70, \uC758\uD559\xB7\uBC95\uB960\xB7\uD22C\uC790 \uD310\uB2E8\uC744 \uB300\uC2E0\uD558\uC9C0 \uC54A\uC544\uC694." }),
    (contact || biz) && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(import_jsx_runtime15.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h2", { children: "\uBB38\uC758\uCC98" }),
      contact && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { children: [
        "\uAC1C\uC778\uC815\uBCF4\xB7\uD658\uBD88 \uBB38\uC758: ",
        contact
      ] }),
      biz && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { children: [
        "\uC0C1\uD638 ",
        cfg.brand.name,
        " \xB7 ",
        biz
      ] })
    ] })
  ] }) }) });
}

// lib/manse/index.ts
var import_cbFortune = require("../cbFortune.js");
var import_manseryeok = require("manseryeok");
var import_correction2 = require("./correction.js");

// lib/manse/today.ts
var GOD_DAY = {
  \uBE44\uACAC: {
    theme: "\uB0B4 \uD798\uC73C\uB85C \uBC00\uACE0 \uAC00\uB294 \uB0A0",
    good: "\uC2A4\uC2A4\uB85C \uC815\uD55C \uBC29\uC2DD\uC774 \uC798 \uD1B5\uD558\uB294 \uD558\uB8E8\uC608\uC694. \uB0A8\uC758 \uC18D\uB3C4\uC5D0 \uB9DE\uCD94\uAE30\uBCF4\uB2E4 \uB0B4 \uACC4\uD68D\uB300\uB85C \uC6C0\uC9C1\uC77C \uB54C \uACB0\uACFC\uAC00 \uC88B\uC544\uC694.",
    caution: "\uACE0\uC9D1\uC774 \uC138\uC9C0\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uC633\uB2E4\uACE0 \uB290\uAEF4\uB3C4 \uD55C \uBC88\uC740 \uB2E4\uB978 \uC0AC\uB78C\uC758 \uC758\uACAC\uC744 \uB4E4\uC5B4\uBCF4\uC138\uC694.",
    do: ["\uD63C\uC790 \uB05D\uB0BC \uC218 \uC788\uB294 \uC77C\uBD80\uD130 \uCC98\uB9AC\uD558\uAE30", "\uC6B4\uB3D9\uC774\uB098 \uC0B0\uCC45\uC73C\uB85C \uBAB8 \uD480\uAE30", "\uC624\uB798 \uC5F0\uB77D \uBABB \uD55C \uCE5C\uAD6C\uC5D0\uAC8C \uC548\uBD80 \uBCF4\uB0B4\uAE30"],
    avoid: ["\uB0A8\uACFC \uBE44\uAD50\uD558\uBA70 \uC870\uAE09\uD574\uD558\uAE30", "\uD568\uAED8 \uC4F0\uB294 \uBE44\uC6A9\uC744 \uD63C\uC790 \uB5A0\uC548\uAE30", "\uC758\uACAC \uCDA9\uB3CC\uC744 \uB05D\uAE4C\uC9C0 \uC774\uAE30\uB824 \uD558\uAE30"]
  },
  \uAC81\uC7AC: {
    theme: "\uACA8\uB8F0\uC218\uB85D \uD798\uC774 \uB098\uB294 \uB0A0",
    good: "\uB204\uAD70\uAC00\uC640 \uACA8\uB8F0 \uB54C \uC9D1\uC911\uB825\uC774 \uC62C\uB77C\uAC00\uB294 \uD558\uB8E8\uC608\uC694. \uBBF8\uB904\uB454 \uB3C4\uC804\uC774\uB098 \uD611\uC0C1\uC744 \uAEBC\uB0B4\uAE30 \uC88B\uC544\uC694.",
    caution: "\uB3C8\uACFC \uBAAB\uC744 \uB450\uACE0 \uBD80\uB52A\uD788\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uBE4C\uB824\uC8FC\uAC70\uB098 \uD568\uAED8 \uC4F0\uB294 \uB3C8 \uC774\uC57C\uAE30\uB294 \uBBF8\uB8E8\uB294 \uD3B8\uC774 \uC548\uC804\uD574\uC694.",
    do: ["\uC624\uB298 \uBAA9\uD45C\uB97C \uC22B\uC790\uB85C \uC801\uC5B4\uB450\uAE30", "\uD568\uAED8\uD558\uB294 \uC77C\uC758 \uC5ED\uD560 \uB098\uB204\uAE30", "\uC2E4\uB825\uC744 \uACA8\uB8E8\uB294 \uC77C\uC5D0 \uB3C4\uC804\uD558\uAE30"],
    avoid: ["\uB3C8 \uBE4C\uB824\uC8FC\uAC70\uB098 \uBCF4\uC99D \uC11C\uAE30", "\uAE30\uBD84\uC5D0 \uB530\uB978 \uD070 \uC9C0\uCD9C", "\uAC10\uC815 \uC11E\uC778 \uB2E8\uCCB4 \uB300\uD654"]
  },
  \uC2DD\uC2E0: {
    theme: "\uC5EC\uC720 \uC18D\uC5D0\uC11C \uC7AC\uB2A5\uC774 \uD53C\uB294 \uB0A0",
    good: "\uD558\uACE0 \uC2F6\uC740 \uC77C\uC744 \uC990\uAC81\uAC8C \uD560\uC218\uB85D \uACB0\uACFC\uAC00 \uB530\uB77C\uC624\uB294 \uD558\uB8E8\uC608\uC694. \uC798 \uBA39\uACE0 \uC798 \uC26C\uB294 \uAC83\uB3C4 \uC624\uB298\uC740 \uC88B\uC740 \uD22C\uC790\uC608\uC694.",
    caution: "\uD3B8\uD55C \uCABD\uC73C\uB85C\uB9CC \uD758\uB7EC\uAC00\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uBA39\uB294 \uAC83\uACFC \uC4F0\uB294 \uAC83\uC774 \uD3C9\uC18C\uBCF4\uB2E4 \uB298\uC9C0 \uC54A\uAC8C \uC0B4\uD3B4\uBCF4\uC138\uC694.",
    do: ["\uC88B\uC544\uD558\uB294 \uC77C\uC5D0 \uD55C \uC2DC\uAC04 \uC628\uC804\uD788 \uC4F0\uAE30", "\uC81C\uB300\uB85C \uB41C \uD55C \uB07C \uCC59\uACA8 \uBA39\uAE30", "\uB9CC\uB4E4\uB358 \uAC83\uC744 \uB9C8\uBB34\uB9AC\uD574 \uBCF4\uC5EC\uC8FC\uAE30"],
    avoid: ["\uACFC\uC2DD\uC774\uB098 \uB2A6\uC740 \uC57C\uC2DD", "\uD560 \uC77C\uC744 \uB05D\uC5C6\uC774 \uBBF8\uB8E8\uAE30", "\uBB34\uB9AC\uD55C \uC57D\uC18D \uC7A1\uAE30"]
  },
  \uC0C1\uAD00: {
    theme: "\uB9D0\uACFC \uD45C\uD604\uC774 \uD798\uC744 \uC5BB\uB294 \uB0A0",
    good: "\uC124\uBA85\uD558\uACE0 \uC124\uB4DD\uD558\uB294 \uC77C\uC774 \uC798 \uD480\uB9AC\uB294 \uD558\uB8E8\uC608\uC694. \uBA38\uB9BF\uC18D\uC5D0\uB9CC \uC788\uB358 \uC544\uC774\uB514\uC5B4\uB97C \uAEBC\uB0B4 \uC81C\uC548\uD574 \uBCF4\uC138\uC694.",
    caution: "\uB9D0\uC774 \uB0A0\uCE74\uB86D\uAC8C \uB098\uAC00\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uBCF4\uB0B4\uAE30 \uC804\uC5D0 \uD55C \uBC88 \uB354 \uC77D\uACE0, \uC717\uC0AC\uB78C \uC55E\uC5D0\uC11C\uB294 \uD55C \uBC15\uC790 \uC26C\uC5B4\uAC00\uC138\uC694.",
    do: ["\uC544\uC774\uB514\uC5B4\uB97C \uBA54\uBAA8\uB098 \uAE30\uD68D\uC11C\uB85C \uC815\uB9AC\uD558\uAE30", "\uBC1C\uD45C\xB7\uC0C1\uB2F4\xB7\uD310\uB9E4\uCC98\uB7FC \uB9D0\uD558\uB294 \uC77C", "\uC0C8\uB85C\uC6B4 \uBC29\uC2DD \uD558\uB098 \uC2DC\uB3C4\uD558\uAE30"],
    avoid: ["\uC717\uC0AC\uB78C \uC758\uACAC\uC5D0 \uBC14\uB85C \uBC18\uBC15\uD558\uAE30", "\uAC10\uC815\uC774 \uB2F4\uAE34 \uAE00 \uC62C\uB9AC\uAE30", "\uADDC\uCE59\uC744 \uAC74\uB108\uB6F0\uB294 \uC9C0\uB984\uAE38"]
  },
  \uD3B8\uC7AC: {
    theme: "\uAE30\uD68C\uAC00 \uB113\uAC8C \uB4E4\uC5B4\uC624\uB294 \uB0A0",
    good: "\uC0AC\uB78C\uACFC \uC815\uBCF4\uAC00 \uBAB0\uB824\uC624\uB294 \uD558\uB8E8\uC608\uC694. \uBC16\uC5D0\uC11C \uB9CC\uB098\uACE0 \uC0C8 \uC5F0\uB77D\uCC98\uB97C \uB298\uB9B4\uC218\uB85D \uC5BB\uB294 \uAC8C \uC788\uC5B4\uC694.",
    caution: "\uC4F8 \uACF3\uC774 \uAC11\uC790\uAE30 \uB298\uC5B4\uB098\uB294 \uD558\uB8E8\uC608\uC694. \uD070 \uACB0\uC81C\uB294 \uD558\uB8E8 \uBBF8\uB8E8\uACE0 \uB098\uAC00\uB294 \uB3C8\uBD80\uD130 \uD655\uC778\uD558\uC138\uC694.",
    do: ["\uC0C8\uB85C\uC6B4 \uC0AC\uB78C \uB9CC\uB098\uAC70\uB098 \uBAA8\uC784 \uB098\uAC00\uAE30", "\uBD80\uC218\uC785\uC774\uB098 \uD22C\uC790 \uC815\uBCF4 \uC0B4\uD3B4\uBCF4\uAE30", "\uBBF8\uB904\uB454 \uC601\uC5C5 \uC5F0\uB77D \uB3CC\uB9AC\uAE30"],
    avoid: ["\uAE30\uBD84\uC5D0 \uB530\uB978 \uD070 \uACB0\uC81C", "\uD655\uC778 \uC548 \uB41C \uD22C\uC790 \uAD8C\uC720 \uB530\uB974\uAE30", "\uC5EC\uB7EC \uC77C\uC744 \uD55C\uAEBC\uBC88\uC5D0 \uBC8C\uC774\uAE30"]
  },
  \uC815\uC7AC: {
    theme: "\uCC28\uACE1\uCC28\uACE1 \uC313\uC774\uB294 \uB0A0",
    good: "\uACC4\uC0B0\uD558\uACE0 \uC815\uB9AC\uD558\uACE0 \uB9C8\uBB34\uB9AC\uD558\uB294 \uC77C\uC5D0 \uD798\uC774 \uC2E4\uB9AC\uB294 \uD558\uB8E8\uC608\uC694. \uBBF8\uB904\uB454 \uC815\uC0B0\uC774\uB098 \uC11C\uB958\uB97C \uB05D\uB0B4\uAE30 \uC88B\uC544\uC694.",
    caution: "\uC791\uC740 \uC2E4\uC218\uC640 \uC791\uC740 \uC9C0\uCD9C\uC774 \uACB9\uCE58\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uC22B\uC790\uAC00 \uB4E4\uC5B4\uAC04 \uC77C\uC740 \uB450 \uBC88 \uD655\uC778\uD558\uC138\uC694.",
    do: ["\uC9C0\uCD9C \uB0B4\uC5ED \uC815\uB9AC\uD558\uAE30", "\uACC4\uC57D\uC11C\uC640 \uC601\uC218\uC99D \uCC59\uAE30\uAE30", "\uC57D\uC18D\uD55C \uC77C\uC744 \uAE30\uD55C \uC548\uC5D0 \uB05D\uB0B4\uAE30"],
    avoid: ["\uD655\uC778 \uC5C6\uC774 \uC1A1\uAE08\uD558\uAE30", "\uACC4\uD68D\uC5D0 \uC5C6\uB358 \uC1FC\uD551", "\uB300\uCDA9 \uB118\uAE30\uB294 \uC22B\uC790 \uD655\uC778"]
  },
  \uD3B8\uAD00: {
    theme: "\uC555\uBC15\uC744 \uC774\uACA8\uB0B4\uB294 \uB0A0",
    good: "\uBD80\uB2F4\uC2A4\uB7EC\uC6B4 \uC77C\uC77C\uC218\uB85D \uC815\uBA74\uC73C\uB85C \uBD99\uB4E4\uBA74 \uD558\uB8E8 \uC548\uC5D0 \uC815\uB9AC\uB418\uB294 \uD558\uB8E8\uC608\uC694. \uC624\uB298\uC758 \uAE34\uC7A5\uC774 \uC2E4\uB825\uC744 \uD0A4\uC6CC\uC694.",
    caution: "\uBAB8\uACFC \uB9C8\uC74C\uC5D0 \uBD80\uB2F4\uC774 \uBAB0\uB9AC\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uB2E4 \uD574\uB0B4\uB824 \uD558\uC9C0 \uB9D0\uACE0 \uC624\uB298 \uD560 \uC77C\uACFC \uBBF8\uB8F0 \uC77C\uC744 \uBA3C\uC800 \uB098\uB220\uB450\uC138\uC694.",
    do: ["\uAC00\uC7A5 \uC5B4\uB824\uC6B4 \uC77C\uC744 \uC624\uC804\uC5D0 \uCC98\uB9AC\uD558\uAE30", "\uB540 \uD758\uB9AC\uB294 \uC6B4\uB3D9\uC73C\uB85C \uAE34\uC7A5 \uD480\uAE30", "\uBB34\uB9AC\uD55C \uBD80\uD0C1\uC740 \uC815\uC911\uD788 \uAC70\uC808\uD558\uAE30"],
    avoid: ["\uBC24\uB2A6\uAC8C\uAE4C\uC9C0 \uBB34\uB9AC\uD558\uAE30", "\uC11C\uB450\uB974\uB294 \uC6B4\uC804", "\uCC38\uB2E4\uAC00 \uD55C \uBC88\uC5D0 \uD130\uB728\uB9AC\uAE30"]
  },
  \uC815\uAD00: {
    theme: "\uC2E0\uB8B0\uB97C \uC5BB\uB294 \uB0A0",
    good: "\uB9E1\uC740 \uC5ED\uD560\uC774 \uBD84\uBA85\uD574\uC9C0\uACE0 \uD3C9\uAC00\uB85C \uC774\uC5B4\uC9C0\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uC808\uCC28\uB300\uB85C \uCC98\uB9AC\uD558\uACE0 \uC815\uD655\uD788 \uBCF4\uACE0\uD558\uC138\uC694.",
    caution: "\uC791\uC740 \uC808\uCC28\uB97C \uAC74\uB108\uB6F0\uBA74 \uB098\uC911\uC5D0 \uB418\uB3CC\uC544\uC624\uB294 \uD558\uB8E8\uC608\uC694. \uC11C\uBA85\uACFC \uD655\uC778, \uAE30\uB85D\uC744 \uD2B9\uD788 \uCC59\uAE30\uC138\uC694.",
    do: ["\uBCF4\uACE0\uC640 \uC11C\uB958 \uB9C8\uAC10 \uCC59\uAE30\uAE30", "\uC57D\uC18D \uC7A5\uC18C\uC5D0 10\uBD84 \uBA3C\uC800 \uB3C4\uCC29\uD558\uAE30", "\uC120\uBC30\uB098 \uC717\uC0AC\uB78C\uC5D0\uAC8C \uC870\uC5B8 \uAD6C\uD558\uAE30"],
    avoid: ["\uADDC\uCE59\uC744 \uC5B4\uAE30\uB294 \uD3B8\uBC95", "\uC9C0\uAC01\uC774\uB098 \uAC11\uC791\uC2A4\uB7EC\uC6B4 \uC57D\uC18D \uBCC0\uACBD", "\uCC45\uC784\uC744 \uB0A8\uC5D0\uAC8C \uB118\uAE30\uAE30"]
  },
  \uD3B8\uC778: {
    theme: "\uC9C1\uAC10\uACFC \uC0DD\uAC01\uC774 \uAE4A\uC5B4\uC9C0\uB294 \uB0A0",
    good: "\uB0A8\uACFC \uB2E4\uB978 \uAC01\uB3C4\uB85C \uBCF4\uB294 \uB208\uC774 \uBE5B\uB098\uB294 \uD558\uB8E8\uC608\uC694. \uCC98\uC74C \uB5A0\uC624\uB978 \uB290\uB08C\uC774 \uB300\uCCB4\uB85C \uB9DE\uC73C\uB2C8 \uBC29\uD5A5\uBD80\uD130 \uC7A1\uC544\uBCF4\uC138\uC694.",
    caution: "\uC0DD\uAC01\uC774 \uC548\uC5D0\uC11C\uB9CC \uB9F4\uB3CC\uC544 \uBB34\uAC70\uC6CC\uC9C0\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uD55C \uAC00\uC9C0\uB77C\uB3C4 \uB9D0\uD558\uAC70\uB098 \uC801\uC5B4\uC11C \uBC16\uC73C\uB85C \uAEBC\uB0B4\uC138\uC694.",
    do: ["\uCC45\uC774\uB098 \uAC15\uC758\uB85C \uC0C8\uB85C\uC6B4 \uBD84\uC57C \uB9DB\uBCF4\uAE30", "\uD63C\uC790 \uC870\uC6A9\uD788 \uC0DD\uAC01\uC744 \uC815\uB9AC\uD558\uB294 \uC2DC\uAC04", "\uB5A0\uC624\uB978 \uC544\uC774\uB514\uC5B4 \uBC14\uB85C \uC801\uAE30"],
    avoid: ["\uD63C\uC790 \uB059\uB059 \uC553\uB2E4\uAC00 \uACB0\uB860 \uB0B4\uB9AC\uAE30", "\uC7A0\uC744 \uC904\uC5EC\uAC00\uBA70 \uACE0\uBBFC\uD558\uAE30", "\uD655\uC778 \uC548 \uB41C \uC774\uC57C\uAE30 \uBBFF\uAE30"]
  },
  \uC815\uC778: {
    theme: "\uB3C4\uC6C0\uACFC \uBC30\uC6C0\uC774 \uB4E4\uC5B4\uC624\uB294 \uB0A0",
    good: "\uBB38\uC11C\xB7\uACF5\uBD80\xB7\uC790\uACA9\uACFC \uAD00\uB828\uB41C \uC77C\uC774 \uC798 \uD480\uB9AC\uB294 \uD558\uB8E8\uC608\uC694. \uBA3C\uC800 \uBB3C\uC5B4\uBCF4\uBA74 \uB3C4\uC640\uC904 \uC0AC\uB78C\uC774 \uB098\uD0C0\uB098\uC694.",
    caution: "\uC900\uBE44\uB9CC \uAE38\uC5B4\uC9C0\uACE0 \uC2DC\uC791\uC774 \uB2A6\uC5B4\uC9C0\uAE30 \uC26C\uC6B4 \uD558\uB8E8\uC608\uC694. \uC870\uAE08 \uBD80\uC871\uD574\uB3C4 \uC624\uB298 \uC548\uC5D0 \uD55C \uBC88 \uB0B4\uB193\uC544 \uBCF4\uC138\uC694.",
    do: ["\uBC30\uC6B0\uACE0 \uC2F6\uB358 \uAC83 \uC2E0\uCCAD\uD558\uAE30", "\uBD80\uBAA8\uB2D8\uC774\uB098 \uACE0\uB9C8\uC6B4 \uBD84\uAED8 \uC5F0\uB77D\uD558\uAE30", "\uC911\uC694\uD55C \uC11C\uB958 \uAF3C\uAF3C\uD788 \uC77D\uAE30"],
    avoid: ["\uB3C4\uC6C0\uC744 \uAC70\uC808\uD558\uACE0 \uD63C\uC790 \uD558\uAE30", "\uC900\uBE44\uB9CC \uD558\uB2E4 \uD558\uB8E8 \uBCF4\uB0B4\uAE30", "\uBBF8\uB8E8\uAE30\uB97C \uD734\uC2DD\uC774\uB77C\uACE0 \uC5EC\uAE30\uAE30"]
  }
};
var UNSEONG_DAY = {
  \uC7A5\uC0DD: "\uC0C8\uB85C \uC2DC\uC791\uD558\uB294 \uD798\uC774 \uC62C\uB77C\uC624\uB294 \uB0A0\uC774\uC5D0\uC694.",
  \uBAA9\uC695: "\uB9C8\uC74C\uC774 \uB4E4\uB728\uACE0 \uBC14\uAE65\uC73C\uB85C \uB208\uC774 \uAC00\uB294 \uB0A0\uC774\uC5D0\uC694. \uAE30\uBD84 \uB530\uB77C \uC6C0\uC9C1\uC774\uC9C0 \uC54A\uAC8C \uC911\uC2EC\uB9CC \uC7A1\uC73C\uC138\uC694.",
  \uAD00\uB300: "\uC790\uC2E0\uAC10\uC774 \uBD99\uC5B4 \uC55E\uC5D0 \uB098\uC11C\uAE30 \uC88B\uC740 \uB0A0\uC774\uC5D0\uC694.",
  \uAC74\uB85D: "\uB0B4 \uC2E4\uB825\uC774 \uC81C\uB300\uB85C \uC4F0\uC774\uB294 \uB0A0\uC774\uC5D0\uC694. \uC2A4\uC2A4\uB85C \uD574\uB0B8\uB2E4\uB294 \uB290\uB08C\uC774 \uCEE4\uC694.",
  \uC81C\uC655: "\uAE30\uC6B4\uC774 \uAC00\uC7A5 \uAF49 \uCC2C \uB0A0\uC774\uC5D0\uC694. \uB2E4\uB9CC \uB118\uCE58\uBA74 \uBD80\uB52A\uD788\uB2C8 \uC18D\uB3C4\uB97C \uC870\uC808\uD558\uC138\uC694.",
  \uC1E0: "\uD798\uC744 \uBE7C\uACE0 \uACBD\uD5D8\uC73C\uB85C \uD478\uB294 \uB0A0\uC774\uC5D0\uC694. \uBC8C\uC774\uAE30\uBCF4\uB2E4 \uB2E4\uB4EC\uAE30\uAC00 \uC88B\uC544\uC694.",
  \uBCD1: "\uBAB8\uC774 \uBA3C\uC800 \uC2E0\uD638\uB97C \uBCF4\uB0B4\uB294 \uB0A0\uC774\uC5D0\uC694. \uC77C\uC815 \uC0AC\uC774\uC5D0 \uC26C\uB294 \uD2C8\uC744 \uAF2D \uB07C\uC6CC \uB123\uC73C\uC138\uC694.",
  \uC0AC: "\uC6C0\uC9C1\uC784\uBCF4\uB2E4 \uC0DD\uAC01\uC774 \uAE4A\uC5B4\uC9C0\uB294 \uB0A0\uC774\uC5D0\uC694. \uACB0\uC815\uC740 \uC815\uB9AC\uD55C \uB4A4\uC5D0 \uB0B4\uB9AC\uC138\uC694.",
  \uBB18: "\uC548\uC73C\uB85C \uBAA8\uC73C\uACE0 \uCC59\uAE30\uB294 \uB0A0\uC774\uC5D0\uC694. \uC0C8\uB85C \uBC8C\uC774\uAE30\uBCF4\uB2E4 \uC815\uB9AC\uD558\uC138\uC694.",
  \uC808: "\uD558\uB098\uAC00 \uB05D\uB098\uACE0 \uB2E4\uB978 \uAC8C \uC2DC\uC791\uB418\uB294 \uD2C8\uC774\uC5D0\uC694. \uC624\uB798 \uBD99\uB4E0 \uAC83\uC744 \uB0B4\uB824\uB193\uAE30 \uC88B\uC544\uC694.",
  \uD0DC: "\uC0C8\uB85C\uC6B4 \uC0DD\uAC01\uC774 \uC2F9\uD2B8\uB294 \uB0A0\uC774\uC5D0\uC694. \uC544\uC9C1\uC740 \uACC4\uD68D\uC73C\uB85C \uD488\uC5B4\uB450\uC138\uC694.",
  \uC591: "\uBCF4\uC0B4\uD54C\uC744 \uBC1B\uC73C\uBA70 \uD798\uC744 \uAE30\uB974\uB294 \uB0A0\uC774\uC5D0\uC694. \uB3C4\uC6C0\uC744 \uD3B8\uD558\uAC8C \uBC1B\uC544\uB3C4 \uAD1C\uCC2E\uC544\uC694."
};
var REL_DAY = {
  \uD569: "\uC624\uB298\uC758 \uAE30\uC6B4\uC774 \uB0B4\uAC00 \uC549\uC740 \uC790\uB9AC\uC640 \uC190\uC744 \uC7A1\uC544\uC694. \uBD80\uD0C1\xB7\uD654\uD574\xB7\uB9CC\uB0A8\uC774 \uBD80\uB4DC\uB7FD\uAC8C \uD480\uB824\uC694.",
  \uCDA9: "\uC624\uB298\uC758 \uAE30\uC6B4\uC774 \uB0B4\uAC00 \uC549\uC740 \uC790\uB9AC\uC640 \uC815\uBA74\uC73C\uB85C \uBD80\uB52A\uD600\uC694. \uC774\uB3D9\uC774\uB098 \uC77C\uC815 \uBCC0\uACBD\uC774 \uC0DD\uAE30\uAE30 \uC26C\uC6B0\uB2C8 \uC5EC\uC720 \uC788\uAC8C \uC6C0\uC9C1\uC774\uC138\uC694.",
  \uD615: "\uC624\uB298\uC758 \uAE30\uC6B4\uC774 \uB0B4\uAC00 \uC549\uC740 \uC790\uB9AC\uB97C \uAC74\uB4DC\uB824\uC694. \uB9D0\uC774 \uB0A0\uCE74\uB85C\uC6CC\uC9C0\uAE30 \uC26C\uC6B0\uB2C8 \uD55C \uBC88 \uB354 \uB2E4\uB4EC\uC5B4\uC11C \uC804\uD558\uC138\uC694.",
  \uC6D0\uC9C4: "\uC624\uB298\uC758 \uAE30\uC6B4\uACFC \uB0B4\uAC00 \uC549\uC740 \uC790\uB9AC\uAC00 \uC11C\uB85C \uAEC4\uB044\uB7EC\uC6CC\uC694. \uAD1C\uD55C \uC11C\uC6B4\uD568\uC774 \uC62C\uB77C\uC640\uB3C4 \uD310\uB2E8\uC740 \uB0B4\uC77C\uB85C \uBBF8\uB8E8\uC138\uC694.",
  \uBB34\uAD00: "\uC624\uB298\uC758 \uAE30\uC6B4\uC774 \uB0B4\uAC00 \uC549\uC740 \uC790\uB9AC\uC640 \uD06C\uAC8C \uBD80\uB52A\uD788\uC9C0 \uC54A\uC544\uC694. \uD3C9\uC18C \uD750\uB984\uB300\uB85C \uAC00\uBA74 \uB418\uB294 \uB0A0\uC774\uC5D0\uC694."
};
var AREA_TEXT = {
  \uC77C: ["\uB9E1\uC740 \uC77C\uC5D0\uC11C \uC874\uC7AC\uAC10\uC774 \uB4DC\uB7EC\uB098\uC694. \uBCF4\uACE0\uB098 \uC81C\uC548\uC744 \uC624\uB298 \uC62C\uB824\uBCF4\uC138\uC694.", "\uBB34\uB09C\uD558\uAC8C \uD758\uB7EC\uAC00\uC694. \uC0C8 \uC77C\uBCF4\uB2E4 \uD558\uB358 \uC77C\uC744 \uB9C8\uBB34\uB9AC\uD558\uC138\uC694.", "\uC77C\uC815\uC774 \uAF2C\uC774\uAC70\uB098 \uC9C0\uC801\uC744 \uBC1B\uAE30 \uC26C\uC6CC\uC694. \uC911\uC694\uD55C \uACB0\uC815\uC740 \uD55C \uBC88 \uB354 \uD655\uC778\uD558\uC138\uC694."],
  \uB3C8: ["\uB3C8\uC758 \uD750\uB984\uC774 \uB208\uC5D0 \uBCF4\uC774\uB294 \uB0A0\uC774\uC5D0\uC694. \uC815\uC0B0\xB7\uD310\uB9E4\xB7\uBD80\uC218\uC785\uC744 \uCC59\uAE30\uAE30 \uC88B\uC544\uC694.", "\uB4E4\uC5B4\uC624\uACE0 \uB098\uAC00\uB294 \uAC8C \uBE44\uC2B7\uD574\uC694. \uACC4\uD68D\uD55C \uC9C0\uCD9C\uB9CC \uC9C0\uD0A4\uBA74 \uCDA9\uBD84\uD574\uC694.", "\uC0C8\uB294 \uB3C8\uC774 \uC0DD\uAE30\uAE30 \uC26C\uC6CC\uC694. \uCDA9\uB3D9\uAD6C\uB9E4\uC640 \uB3C8 \uAC70\uB798\uB294 \uD53C\uD558\uC138\uC694."],
  \uC5F0\uC560: ["\uB9C8\uC74C\uC744 \uD45C\uD604\uD558\uBA74 \uC798 \uB2FF\uB294 \uB0A0\uC774\uC5D0\uC694. \uBA3C\uC800 \uC5F0\uB77D\uD574 \uBCF4\uC138\uC694.", "\uC794\uC794\uD55C \uB0A0\uC774\uC5D0\uC694. \uC791\uC740 \uBC30\uB824 \uD558\uB098\uAC00 \uBD84\uC704\uAE30\uB97C \uC88B\uAC8C \uD574\uC694.", "\uC11C\uC6B4\uD568\uC774 \uCEE4\uC9C0\uAE30 \uC26C\uC6CC\uC694. \uC624\uB298\uC740 \uB530\uC9C0\uAE30\uBCF4\uB2E4 \uB4E4\uC5B4\uC8FC\uB294 \uCABD\uC774 \uC774\uACA8\uC694."],
  \uAD00\uACC4: ["\uB3C4\uC640\uC8FC\uB294 \uC0AC\uB78C\uC774 \uAC00\uAE4C\uC774 \uC788\uC5B4\uC694. \uBD80\uD0C1\uC774\uB098 \uD611\uC5C5 \uC81C\uC548\uC5D0 \uC88B\uC544\uC694.", "\uD070 \uB9C8\uCC30 \uC5C6\uC774 \uC9C0\uB098\uAC00\uC694. \uC57D\uC18D\uB9CC \uC798 \uC9C0\uD0A4\uBA74 \uCDA9\uBD84\uD574\uC694.", "\uB9D0\uC774 \uC624\uD574\uB85C \uBC88\uC9C0\uAE30 \uC26C\uC6CC\uC694. \uB2E8\uCCB4 \uB300\uD654\uC5D0\uC11C\uB294 \uD55C \uBC88 \uB354 \uC77D\uACE0 \uBCF4\uB0B4\uC138\uC694."],
  \uAC74\uAC15: ["\uBAB8\uC774 \uAC00\uBCCD\uACE0 \uD68C\uBCF5\uC774 \uBE68\uB77C\uC694. \uBBF8\uB904\uB454 \uC6B4\uB3D9\uC744 \uC2DC\uC791\uD558\uAE30 \uC88B\uC544\uC694.", "\uBB34\uB09C\uD574\uC694. \uBB3C\uC744 \uC790\uC8FC \uB9C8\uC2DC\uACE0 \uC81C\uB54C \uC2DD\uC0AC\uD558\uC138\uC694.", "\uD53C\uB85C\uAC00 \uC313\uC774\uAE30 \uC26C\uC6CC\uC694. \uC77C\uCC0D \uC790\uACE0 \uBE61\uBE61\uD55C \uC77C\uC815\uC740 \uC904\uC774\uC138\uC694."]
};
var UNSEONG_HEALTH = { \uC7A5\uC0DD: 4, \uAD00\uB300: 3, \uAC74\uB85D: 4, \uC81C\uC655: 3, \uC591: 2, \uBAA9\uC695: 0, \uD0DC: 0, \uC1E0: -2, \uBCD1: -5, \uC0AC: -4, \uBB18: -3, \uC808: -4 };
var LINK_W = { hap: 3, samhap: 2, same: 0, none: 0, wonjin: -1, hyeong: -2, chung: -3 };
var LUCKY_ITEM = { \uBAA9: "\uCD08\uB85D \uC2DD\uBB3C\uC774\uB098 \uB098\uBB34 \uC18C\uD488", \uD654: "\uB530\uB73B\uD55C \uCC28\uB098 \uBD89\uC740 \uC18C\uD488", \uD1A0: "\uB3C4\uC790\uAE30\uB098 \uD759\uBE5B \uBB3C\uAC74", \uAE08: "\uC740\uC0C9 \uC561\uC138\uC11C\uB9AC\uB098 \uD770 \uC190\uC218\uAC74", \uC218: "\uBB3C\uBCD1\uC774\uB098 \uAC80\uC740\uC0C9 \uC18C\uC9C0\uD488" };
var MONTH_GROUP = {
  \uBE44\uAC81: "\uC0AC\uB78C\uC774 \uBAA8\uC774\uACE0 \uACBD\uC7C1\uB3C4 \uC0DD\uAE30\uB294 \uB2EC\uC774\uC5D0\uC694. \uB0B4 \uBAAB\uACFC \uC5ED\uD560\uC744 \uBD84\uBA85\uD788 \uD558\uC138\uC694.",
  \uC2DD\uC0C1: "\uD45C\uD604\uD558\uACE0 \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uC77C\uC5D0 \uD798\uC774 \uC2E4\uB9AC\uB294 \uB2EC\uC774\uC5D0\uC694. \uBBF8\uB904\uB454 \uC2DC\uB3C4\uB97C \uAEBC\uB0B4\uBCF4\uC138\uC694.",
  \uC7AC\uC131: "\uB3C8\uACFC \uACB0\uACFC\uAC00 \uC6C0\uC9C1\uC774\uB294 \uB2EC\uC774\uC5D0\uC694. \uB4E4\uC5B4\uC624\uB294 \uB9CC\uD07C \uB098\uAC00\uB294 \uAC83\uB3C4 \uCC59\uAE30\uC138\uC694.",
  \uAD00\uC131: "\uCC45\uC784\uACFC \uD3C9\uAC00\uAC00 \uB530\uB77C\uC624\uB294 \uB2EC\uC774\uC5D0\uC694. \uC57D\uC18D\uACFC \uB9C8\uAC10\uC744 \uBA3C\uC800 \uCC59\uAE30\uC138\uC694.",
  \uC778\uC131: "\uBC30\uC6B0\uACE0 \uC900\uBE44\uD558\uAE30 \uC88B\uC740 \uB2EC\uC774\uC5D0\uC694. \uB3C4\uC6C0\uC744 \uBC1B\uC744 \uAE30\uD68C\uB97C \uB193\uCE58\uC9C0 \uB9C8\uC138\uC694."
};
var SEAT = {
  year: { place: "\uC9D1\uC548\uACFC \uC717\uC0AC\uB78C\uC744 \uB73B\uD558\uB294 \uD0DC\uC5B4\uB09C \uD574\uC758 \uC790\uB9AC", good: "\uC5B4\uB978\uC774\uB098 \uC717\uC0AC\uB78C\uC5D0\uAC8C \uB3C4\uC6C0\uC744 \uCCAD\uD558\uAE30 \uC88B\uC544\uC694.", bad: "\uAC00\uC871 \uC77C\uC815\uC774 \uBC14\uB00C\uAC70\uB098 \uC717\uC0AC\uB78C\uACFC \uC758\uACAC\uC774 \uAC08\uB9AC\uAE30 \uC26C\uC6CC\uC694.", soft: "\uC5B4\uB978\uACFC\uC758 \uB300\uD654\uB294 \uBD80\uB4DC\uB7FD\uAC8C \uC2DC\uC791\uD558\uC138\uC694." },
  month: { place: "\uC77C\uD130\uC640 \uC0AC\uD68C\uC0DD\uD65C\uC744 \uB73B\uD558\uB294 \uD0DC\uC5B4\uB09C \uB2EC\uC758 \uC790\uB9AC", good: "\uD68C\uC0AC\uB098 \uAC70\uB798\uCC98 \uC77C\uC774 \uC21C\uD558\uAC8C \uD480\uB824\uC694.", bad: "\uC9C1\uC7A5\uC774\uB098 \uBC14\uAE65\uC77C\uC758 \uACC4\uD68D\uC774 \uAC11\uC790\uAE30 \uBC14\uB00C\uAE30 \uC26C\uC6CC\uC694.", soft: "\uC5C5\uBB34 \uBA54\uC2DC\uC9C0\uC758 \uB9D0\uD22C\uB97C \uD55C \uBC88 \uB354 \uC0B4\uD53C\uC138\uC694." },
  hour: { place: "\uC544\uB7AB\uC0AC\uB78C\uACFC \uC55E\uB0A0\uC744 \uB73B\uD558\uB294 \uD0DC\uC5B4\uB09C \uC2DC\uC758 \uC790\uB9AC", good: "\uD6C4\uBC30\uB098 \uC544\uC774\uC640 \uBCF4\uB0B4\uB294 \uC2DC\uAC04\uC774 \uC990\uAC70\uC6CC\uC694.", bad: "\uC55E\uC73C\uB85C\uC758 \uACC4\uD68D\uC774 \uD754\uB4E4\uB9B4 \uC218 \uC788\uC5B4\uC694. \uACB0\uB860\uC740 \uC11C\uB450\uB974\uC9C0 \uB9C8\uC138\uC694.", soft: "\uC544\uB7AB\uC0AC\uB78C\uC5D0\uAC8C \uD558\uB294 \uB9D0\uC740 \uC9E7\uACE0 \uB530\uB73B\uD558\uAC8C \uD558\uC138\uC694." }
};
function bandOf(score) {
  return score >= 82 ? "\uC544\uC8FC \uC88B\uC74C" : score >= 70 ? "\uC88B\uC74C" : score >= 58 ? "\uBCF4\uD1B5" : score >= 47 ? "\uC870\uC2EC" : "\uC8FC\uC758";
}
var clamp = (n) => Math.max(40, Math.min(97, Math.round(n)));
var godDay = (god) => GOD_DAY[god] ?? GOD_DAY.\uBE44\uACAC;
function buildToday(s, date, core, next) {
  const y = s.yongsin;
  const p = core.pillar;
  const g = godDay(core.stemGod);
  const elW = (e) => e === y.\uC6A9\uC2E0 ? 3 : e === y.\uD76C\uC2E0 ? 2 : e === y.\uAE30\uC2E0 ? -2 : e === y.\uAD6C\uC2E0 ? -1 : 0;
  const female = s.input.gender === "\uC5EC";
  const g1 = GROUP_OF[core.stemGod], g2 = GROUP_OF[core.branchGod];
  const has = (grp) => g1 === grp || g2 === grp;
  const relAdj = { \uD569: 5, \uCDA9: -6, \uD615: -5, \uC6D0\uC9C4: -4 }[core.rel] ?? 0;
  const raw = {
    \uC77C: core.score + (has("\uAD00\uC131") ? 6 : 0) + (has("\uC2DD\uC0C1") ? 3 : 0) + (has("\uC778\uC131") ? 2 : 0) - (core.stemGod === "\uAC81\uC7AC" ? 3 : 0),
    \uB3C8: core.score + (has("\uC7AC\uC131") ? 7 : 0) + (has("\uC2DD\uC0C1") ? 3 : 0) - (has("\uBE44\uAC81") ? 5 : 0),
    \uC5F0\uC560: core.score + (has(female ? "\uAD00\uC131" : "\uC7AC\uC131") ? 7 : 0) + relAdj + ([0, 3, 6, 9].includes(p.ji) ? 2 : 0),
    \uAD00\uACC4: core.score + relAdj + (has("\uC778\uC131") ? 3 : 0) + (core.stemGod === "\uBE44\uACAC" ? 2 : 0) - (core.stemGod === "\uAC81\uC7AC" || core.stemGod === "\uC0C1\uAD00" ? 4 : 0),
    \uAC74\uAC15: core.score + (UNSEONG_HEALTH[core.unseong] ?? 0) + elW(GAN_EL[p.gan]) + elW(JI_EL[p.ji]) - (core.rel === "\uCDA9" ? 4 : core.rel === "\uD615" ? 3 : 0)
  };
  const areas = Object.keys(raw).map((key) => {
    const score = clamp(raw[key]);
    return { key, score, text: AREA_TEXT[key][score >= 76 ? 0 : score >= 60 ? 1 : 2] };
  });
  const slots = [3, 4, 5, 6, 7, 8, 9, 10, 11].map((ji) => {
    const hg = (p.gan % 5 * 2 + ji) % 10;
    const link = branchLink(ji, s.pillars.day.ji);
    const els = [GAN_EL[hg], JI_EL[ji]];
    return { ji, link, els, w: elW(els[0]) + elW(els[1]) + LINK_W[link] };
  });
  const sorted = [...slots].sort((a, b) => b.w - a.w);
  const whyGood = (h) => h.link === "hap" || h.link === "samhap" ? "\uB0B4 \uAE30\uC6B4\uACFC \uC190\uC7A1\uB294 \uC2DC\uAC04\uC774\uB77C \uBD80\uD0C1\uC774\uB098 \uB9CC\uB0A8\uC5D0 \uC88B\uC544\uC694" : h.els.includes(y.\uC6A9\uC2E0) ? `\uB098\uB97C \uB3D5\uB294 ${EL_PLAIN[y.\uC6A9\uC2E0]}\uC758 \uAE30\uC6B4\uC774 \uB3C4\uB294 \uC2DC\uAC04\uC774\uB77C \uC911\uC694\uD55C \uC77C\uC744 \uB450\uAE30 \uC88B\uC544\uC694` : h.els.includes(y.\uD76C\uC2E0) ? `\uD798\uC744 \uBCF4\uD0DC\uB294 ${EL_PLAIN[y.\uD76C\uC2E0]}\uC758 \uAE30\uC6B4\uC774 \uB3C4\uB294 \uC2DC\uAC04\uC774\uC5D0\uC694` : "\uD750\uB984\uC774 \uBB34\uB09C\uD574 \uC9D1\uC911\uD558\uAE30 \uC88B\uC740 \uC2DC\uAC04\uC774\uC5D0\uC694";
  const whyBad = (h) => h.link === "chung" ? "\uB0B4 \uAE30\uC6B4\uACFC \uBD80\uB52A\uD788\uB294 \uC2DC\uAC04\uC774\uB77C \uACB0\uC815\uACFC \uC6B4\uC804\uC740 \uD55C \uBC88 \uB354 \uC870\uC2EC\uD558\uC138\uC694" : h.link === "hyeong" || h.link === "wonjin" ? "\uB9C8\uC74C\uC774 \uB0A0\uCE74\uB85C\uC6CC\uC9C0\uAE30 \uC26C\uC6B4 \uC2DC\uAC04\uC774\uB77C \uB9D0\uC744 \uC544\uB07C\uC138\uC694" : `\uC870\uC2EC\uD560 ${EL_PLAIN[y.\uAE30\uC2E0]}\uC758 \uAE30\uC6B4\uC774 \uAC15\uD55C \uC2DC\uAC04\uC774\uB77C \uBB34\uB9AC\uD55C \uC77C\uC815\uC740 \uD53C\uD558\uC138\uC694`;
  const bestHours = sorted.slice(0, 2).map((h) => ({ ji: h.ji, range: HOUR_RANGE[h.ji], why: whyGood(h) }));
  const worst = sorted[sorted.length - 1];
  const cautionHour = worst.w < 0 ? { ji: worst.ji, range: HOUR_RANGE[worst.ji], why: whyBad(worst) } : null;
  const doList = [...g.do];
  const avoidList = [...g.avoid];
  if (core.rel === "\uD569") doList[2] = "\uBBF8\uB904\uB454 \uBD80\uD0C1\uC774\uB098 \uD654\uD574\uB97C \uBA3C\uC800 \uAEBC\uB0B4\uAE30";
  if (core.rel === "\uCDA9") avoidList[2] = "\uC774\uC0AC\xB7\uACC4\uC57D\xB7\uBA3C \uC774\uB3D9\uC744 \uAE09\uD558\uAC8C \uC815\uD558\uAE30";
  if (core.rel === "\uD615") avoidList[2] = "\uB0A0 \uC120 \uB9D0\uD22C\uB85C \uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30";
  if (core.rel === "\uC6D0\uC9C4") avoidList[2] = "\uC11C\uC6B4\uD568\uC744 \uC313\uC544\uB450\uB2E4 \uD55C \uBC88\uC5D0 \uD130\uB728\uB9AC\uAE30";
  const pillarLinks = [];
  for (const k of ["month", "year", "hour"]) {
    const pp = s.pillars[k];
    if (!pp) continue;
    const link = branchLink(p.ji, pp.ji);
    if (link === "hap" || link === "samhap") pillarLinks.push(`\uC624\uB298\uC758 \uAE30\uC6B4\uC774 ${SEAT[k].place}\uC640 \uC190\uC744 \uC7A1\uC544\uC694. ${SEAT[k].good}`);
    else if (link === "chung") pillarLinks.push(`\uC624\uB298\uC758 \uAE30\uC6B4\uC774 ${SEAT[k].place}\uC640 \uBD80\uB52A\uD600\uC694. ${SEAT[k].bad}`);
    else if (link === "hyeong" || link === "wonjin") pillarLinks.push(`\uC624\uB298\uC758 \uAE30\uC6B4\uC774 ${SEAT[k].place}\uC640 \uAEC4\uB044\uB7EC\uC6CC\uC694. ${SEAT[k].soft}`);
  }
  const w = s.wolwoon.find((x) => x.current);
  const month = w ? { label: `${w.month}\uC6D4 \xB7 ${GAN[w.pillar.gan]}${JI[w.pillar.ji]}\uC6D4`, pillar: w.pillar, text: MONTH_GROUP[GROUP_OF[w.ganGod] ?? "\uBE44\uAC81"] } : null;
  const nd = godDay(next.stemGod);
  return {
    date,
    pillar: p,
    score: core.score,
    band: bandOf(core.score),
    title: g.theme,
    summary: [
      core.tone === "\uC8FC\uC758" ? g.caution : g.good,
      REL_DAY[core.rel] ?? REL_DAY.\uBB34\uAD00,
      `\uC624\uB298 \uB0B4 \uAE30\uC6B4\uC774 \uC4F0\uB294 \uD798\uC758 \uD06C\uAE30(12\uC6B4\uC131)\uB294 ${J(`'${core.unseong}'`, "\uC774\uC5D0\uC694\uC608\uC694")}. ${UNSEONG_DAY[core.unseong] ?? ""}`.trim()
    ],
    stemGod: core.stemGod,
    branchGod: core.branchGod,
    unseong: core.unseong,
    rel: core.rel,
    areas,
    bestHours,
    cautionHour,
    doList,
    avoidList,
    lucky: { color: EL_COLOR_NAME[y.\uC6A9\uC2E0], numbers: EL_NUMBERS[y.\uC6A9\uC2E0].join(", "), direction: EL_DIRECTION[y.\uC6A9\uC2E0], item: LUCKY_ITEM[y.\uC6A9\uC2E0] },
    pillarLinks,
    month,
    tomorrow: { pillar: next.pillar, score: next.score, band: bandOf(next.score), title: nd.theme, line: next.tone === "\uC8FC\uC758" ? nd.caution : nd.good }
  };
}

// lib/manse/index.ts
var SajuInputError = class extends Error {
};
var pad2 = (n) => String(n).padStart(2, "0");
var blank = (v) => typeof v === "string" && v !== "-" ? v : "";
function toGanji(ko) {
  const idx = ganjiFromParts(GAN.indexOf(ko[0]), JI.indexOf(ko[1]));
  if (idx < 0) throw new Error(`\uAC04\uC9C0\uB97C \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694: ${ko}`);
  return ganji(idx);
}
function toEl(ch) {
  if (ELS.includes(ch)) return ch;
  const g = GAN.indexOf(ch);
  if (g >= 0) return GAN_EL[g];
  throw new Error(`\uC624\uD589\uC744 \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694: ${ch}`);
}
function hiddenOf(line) {
  const m = /^(\S)\s*\((\S+)\)$/.exec(String(line).trim());
  if (!m) return null;
  const gan = GAN.indexOf(m[1]);
  return gan < 0 ? null : { gan, el: GAN_EL[gan], god: m[2] };
}
function pillarOf(w) {
  const g = toGanji(w.ganzhi);
  return {
    ...g,
    ganEl: GAN_EL[g.gan],
    jiEl: JI_EL[g.ji],
    // 일간 자리의 십성은 정의상 비견이다 (화면에서는 '나'로 적는다)
    ganGod: w.stemTenGod === "\uC77C\uAC04" ? "\uBE44\uACAC" : blank(w.stemTenGod),
    jiGod: blank(w.branchTenGod),
    hidden: w.jijanggan.map(hiddenOf).filter((h) => !!h),
    unseong: blank(w.unseong),
    salYear: blank(w.yearSal),
    salDay: blank(w.daySal),
    sinsal: Array.isArray(w.sinsal) ? w.sinsal : []
  };
}
var luckOf = (o) => ({ pillar: toGanji(o.\uAC04\uC9C0), ganGod: o.\uCC9C\uAC04\uC2ED\uC131, jiGod: o.\uC9C0\uC9C0\uC2ED\uC131, unseong: blank(o.\uC6B4\uC131) });
var localNoon = (y, m, d) => new Date(y, m - 1, d, 12);
function solarOf(y, m, d, isLunar, leap) {
  if (!isLunar) {
    const t = new Date(Date.UTC(y, m - 1, d));
    if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) {
      throw new SajuInputError("\uB2EC\uB825\uC5D0 \uC5C6\uB294 \uB0A0\uC9DC\uC608\uC694. \uC0DD\uB144\uC6D4\uC77C\uC744 \uB2E4\uC2DC \uD655\uC778\uD574\uC8FC\uC138\uC694.");
    }
    return { y, m, d };
  }
  try {
    const s = (0, import_manseryeok.lunarToSolar)(y, m, d, leap);
    if (!s || !s.year) throw new Error("empty");
    return { y: s.year, m: s.month, d: s.day };
  } catch {
    throw new SajuInputError(leap ? "\uADF8\uD574\uC5D0\uB294 \uADF8 \uB2EC\uC758 \uC724\uB2EC\uC774 \uC5C6\uC5B4\uC694. \uC74C\uB825 \uB0A0\uC9DC\uB97C \uB2E4\uC2DC \uD655\uC778\uD574\uC8FC\uC138\uC694." : "\uB2EC\uB825\uC5D0 \uC5C6\uB294 \uC74C\uB825 \uB0A0\uC9DC\uC608\uC694. \uB2E4\uC2DC \uD655\uC778\uD574\uC8FC\uC138\uC694.");
  }
}
function calcSaju(input, now = /* @__PURE__ */ new Date()) {
  const [y, mo, d] = input.birthDate.split("-").map(Number);
  const time = input.birthTime && /^\d{1,2}:\d{2}$/.test(input.birthTime) ? input.birthTime.split(":").map(Number) : null;
  const isLunar = input.calendar === "\uC74C\uB825";
  const leap = isLunar && !!input.isLeapMonth;
  const solar = solarOf(y, mo, d, isLunar, leap);
  const solarDate = `${solar.y}-${pad2(solar.m)}-${pad2(solar.d)}`;
  const region = input.region || "";
  const local = time ? (0, import_correction2.localMinutes)(region, solarDate) : 0;
  const dst = time ? (0, import_correction2.isDST)(solarDate, time[0], time[1]) : false;
  const minutes = local + (dst ? -60 : 0);
  const t = todayKST(now);
  const r = (0, import_cbFortune.\uBA85\uC2DD\uD45C\uC0C1\uC138)(
    {
      year: y,
      month: mo,
      day: d,
      hour: time ? time[0] : 12,
      minute: time ? time[1] : 0,
      isLunar,
      isLeapMonth: leap,
      gender: input.gender === "\uC5EC" ? "female" : "male",
      hourUnknown: !time,
      correctionMinutes: minutes,
      birthRegionLabel: region
    },
    "jasi",
    "\uBBF8\uC801\uC6A9",
    { now: localNoon(t.y, t.m, t.d) }
  );
  const c = r.raw.consult;
  const wonguk = r.raw.wonguk;
  const at = (key) => pillarOf(wonguk.find((w) => w.key === key));
  const pillars = { year: at("\uB144"), month: at("\uC6D4"), day: at("\uC77C"), hour: time ? at("\uC2DC") : null };
  const original = time ? `${pad2(time[0])}:${pad2(time[1])}` : null;
  const corrected = time ? (0, import_correction2.shiftTime)(time[0], time[1], minutes) : null;
  const parts = [dst ? "\uC11C\uBA38\uD0C0\uC784 -1\uC2DC\uAC04" : "", local ? `${region} \uC9C0\uC5ED\uC2DC ${local > 0 ? "+" : ""}${local}\uBD84` : ""].filter(Boolean);
  const text = !time ? "\uD0DC\uC5B4\uB09C \uC2DC\uAC04\uC744 \uBAB0\uB77C \uC2DC\uAC01 \uBCF4\uC815\uC740 \uD558\uC9C0 \uC54A\uC558\uC5B4\uC694." : parts.length ? `${original} \u2192 ${corrected} \uAE30\uC900\uC73C\uB85C \uACC4\uC0B0\uD588\uC5B4\uC694 (${parts.join(", ")})` : `${original} \uADF8\uB300\uB85C \uACC4\uC0B0\uD588\uC5B4\uC694 (\uBCF4\uC815 \uC5C6\uC74C)`;
  const notes = [];
  if (!time) notes.push("\uD0DC\uC5B4\uB09C \uC2DC\uAC04\uC744 \uBAB0\uB77C \uC2DC\uC8FC\uB294 \uBE44\uC6CC\uB450\uACE0 \uC138 \uAE30\uB465\uC73C\uB85C \uBD24\uC5B4\uC694.");
  else if (!(0, import_correction2.knownRegion)(region)) notes.push("\uD0DC\uC5B4\uB09C \uC9C0\uC5ED\uC744 \uBAB0\uB77C \uC9C0\uC5ED\uC2DC \uBCF4\uC815\uC740 \uBE7C\uACE0 \uACC4\uC0B0\uD588\uC5B4\uC694.");
  if (time && time[0] === 23 && corrected >= "23:00") notes.push("\uBC24 11\uC2DC \uC774\uD6C4 \uD0DC\uC0DD\uC774\uB77C \uB2E4\uC74C \uB0A0\uC758 \uC77C\uC8FC\uB85C \uBD24\uC5B4\uC694.");
  if (isLunar) notes.push(`\uC74C\uB825 ${y}\uB144 ${mo}\uC6D4 ${d}\uC77C${leap ? "(\uC724\uB2EC)" : ""}\uC740 \uC591\uB825 ${solar.y}\uB144 ${solar.m}\uC6D4 ${solar.d}\uC77C\uC774\uC5D0\uC694.`);
  const gradeLabel = String(c.\uC2E0\uAC15\uC57D).replace(/\s*\(시주 제외 기준\)\s*$/, "");
  const baseGrade = gradeLabel.replace(/\(.*\)$/, "");
  const label = ["\uADF9\uC2E0\uAC15", "\uC2E0\uAC15", "\uC911\uAC15"].includes(baseGrade) ? "\uAC15\uD55C \uD3B8" : baseGrade === "\uC911\uD654" ? "\uADE0\uD615" : "\uC57D\uD55C \uD3B8";
  const jm = /^(\S)(?:\s*\(보조:\s*(.+)\))?/.exec(String(c.\uC870\uD6C4)) ?? [];
  const johuMain = toEl(jm[1] ?? String(c.\uC6A9\uC2E0));
  const johuSub = [...new Set((jm[2] ? String(jm[2]).split(/,\s*/) : []).map(toEl))].filter((e) => e !== johuMain);
  const age = Number(c.\uB9CC\uB098\uC774) || 0;
  const daewoon = c.\uB300\uC6B4\uBAA9\uB85D.map((o) => ({ ...luckOf(o), age: Number(o.\uB098\uC774), startYear: solar.y + Number(o.\uB098\uC774) }));
  let currentDaewoonIndex = -1;
  daewoon.forEach((dw, i) => {
    if (age >= dw.age) currentDaewoonIndex = i;
  });
  const elements = Object.fromEntries(ELS.map((e) => [e, Number(c.\uC624\uD589\uBD84\uD3EC?.[e]) || 0]));
  const dayGan = pillars.day.gan;
  return {
    input,
    provisional: false,
    notes,
    correction: { minutes, dst, local, region, original, corrected, text },
    solarDate,
    pillars,
    dayMaster: { gan: dayGan, el: GAN_EL[dayGan], yang: GAN_YANG(dayGan) },
    elements,
    strength: { score: Number(c.\uC2E0\uAC15\uC57D\uC810\uC218) || 0, label, grade: gradeLabel, deukryeong: c.\uB4DD\uB839, deukji: c.\uB4DD\uC9C0, deukse: c.\uB4DD\uC138 },
    helpful: toEl(c.\uC6A9\uC2E0),
    yongsin: { \uC6A9\uC2E0: toEl(c.\uC6A9\uC2E0), \uD76C\uC2E0: toEl(c.\uD76C\uC2E0), \uAE30\uC2E0: toEl(c.\uAE30\uC2E0), \uAD6C\uC2E0: toEl(c.\uAD6C\uC2E0), \uD55C\uC2E0: toEl(c.\uD55C\uC2E0) },
    johu: { main: johuMain, sub: johuSub },
    gyeokguk: { name: String(c.\uACA9\uAD6D), basis: String(c.\uACA9\uAD6D\uADFC\uAC70) },
    groups: { \uBE44\uAC81: c.\uC2ED\uC131\uBD84\uD3EC.\uBE44\uAC81, \uC2DD\uC0C1: c.\uC2ED\uC131\uBD84\uD3EC.\uC2DD\uC0C1, \uC7AC\uC131: c.\uC2ED\uC131\uBD84\uD3EC.\uC7AC\uC131, \uAD00\uC131: c.\uC2ED\uC131\uBD84\uD3EC.\uAD00\uC131, \uC778\uC131: c.\uC2ED\uC131\uBD84\uD3EC.\uC778\uC131 },
    relations: { stems: c.\uCC9C\uAC04\uAD00\uACC4 ?? [], hap: c.\uD569 ?? [], clash: c.\uCDA9\uD615\uD30C\uD574 ?? [] },
    gongmang: c.\uACF5\uB9DD\uC77C ?? [],
    age,
    daewoonStart: Number(c.\uB300\uC6B4\uC218) || 0,
    daewoonForward: c.\uB300\uC6B4\uBC29\uD5A5 === "\uC21C\uD589",
    daewoon,
    currentDaewoonIndex,
    sewoon: c.\uC138\uC6B4\uBAA9\uB85D.filter((o) => o.\uB144\uB3C4 >= t.y).slice(0, 10).map((o) => ({ ...luckOf(o), year: Number(o.\uB144\uB3C4) })),
    wolwoon: r.raw.\uC6D4\uC6B4\uBAA9\uB85D.map((o) => ({
      year: Number(o.\uB144),
      month: Number(o.\uC6D4),
      pillar: toGanji(o.\uAC04\uC9C0),
      ganGod: o.\uCC9C\uAC04\uC2ED\uC131,
      jiGod: o.\uC9C0\uC9C0\uC2ED\uC131,
      current: !!o.\uD604\uC7AC
    }))
  };
}
function dayCore(s, y, m, d) {
  const t = (0, import_cbFortune.\uC624\uB298\uC758\uC6B4\uC138)({
    \uC77C\uAC04: GAN[s.dayMaster.gan],
    \uC77C\uC9C0: JI[s.pillars.day.ji],
    \uC6A9\uC2E0: s.yongsin.\uC6A9\uC2E0,
    \uD76C\uC2E0: s.yongsin.\uD76C\uC2E0,
    \uAE30\uC2E0: s.yongsin.\uAE30\uC2E0,
    \uAD6C\uC2E0: s.yongsin.\uAD6C\uC2E0,
    date: localNoon(y, m, d)
  });
  return { pillar: toGanji(t.ganzhi), stemGod: t.stemTenGod, branchGod: t.branchTenGod, unseong: t.unseong, rel: t.rel, score: t.score, tone: t.tone };
}
function freeReading(input, now = /* @__PURE__ */ new Date()) {
  const saju2 = calcSaju(input, now);
  const t = todayKST(now);
  const n = new Date(Date.UTC(t.y, t.m - 1, t.d + 1));
  const today = buildToday(saju2, t, dayCore(saju2, t.y, t.m, t.d), dayCore(saju2, n.getUTCFullYear(), n.getUTCMonth() + 1, n.getUTCDate()));
  return { saju: saju2, today };
}

// rwbundle/server-entry.tsx
var import_jsx_runtime16 = __toESM(require_jsx_runtime());
function renderPage(kind, cfg, opts = {}) {
  const brand = cfg.brand.name;
  switch (kind) {
    case "apply":
      return { html: (0, import_server.renderToString)(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ApplyView, { cfg, product: opts.product })), title: `\uB9AC\uD3EC\uD2B8 \uC2E0\uCCAD \u2014 ${brand}`, description: "" };
    case "done":
      return { html: (0, import_server.renderToString)(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DoneView, { cfg, no: opts.no, bank: opts.bank, kakao: opts.kakao })), title: `\uC2E0\uCCAD \uC644\uB8CC \u2014 ${brand}`, description: "" };
    case "policy":
      return { html: (0, import_server.renderToString)(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PolicyView, { cfg })), title: `\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68 \xB7 \uD658\uBD88 \uADDC\uC815 \u2014 ${brand}`, description: "" };
    default:
      return { html: (0, import_server.renderToString)(/* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Landing, { cfg })), title: `${brand} \u2014 ${cfg.brand.tagline}`, description: fill(cfg.hero.lede, cfg) };
  }
}
var BUILD_ID = "202609151110";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BUILD_ID,
  DEFAULT_SITE,
  REGIONS,
  SajuInputError,
  fontHrefs,
  freeReading,
  normalizeSite,
  productById,
  renderPage,
  reportProducts,
  won
});
