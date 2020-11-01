var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module) => () => {
  if (!module) {
    module = {exports: {}};
    callback(module.exports, module);
  }
  return module.exports;
};
var __exportStar = (target, module, desc) => {
  __markAsModule(target);
  if (typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module) => {
  if (module && module.__esModule)
    return module;
  return __exportStar(__defProp(__create(__getProtoOf(module)), "default", {value: module, enumerable: true}), module);
};

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS((exports, module) => {
  "use strict";
  module.exports = function bind(fn, thisArg) {
    return function wrap2() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };
});

// node_modules/axios/lib/utils.js
var require_utils = __commonJS((exports, module) => {
  "use strict";
  var bind = require_bind();
  var toString = Object.prototype.toString;
  function isArray(val) {
    return toString.call(val) === "[object Array]";
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
  }
  function isArrayBuffer(val) {
    return toString.call(val) === "[object ArrayBuffer]";
  }
  function isFormData(val) {
    return typeof FormData !== "undefined" && val instanceof FormData;
  }
  function isArrayBufferView(val) {
    var result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && val.buffer instanceof ArrayBuffer;
    }
    return result;
  }
  function isString(val) {
    return typeof val === "string";
  }
  function isNumber(val) {
    return typeof val === "number";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isPlainObject(val) {
    if (toString.call(val) !== "[object Object]") {
      return false;
    }
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }
  function isDate(val) {
    return toString.call(val) === "[object Date]";
  }
  function isFile(val) {
    return toString.call(val) === "[object File]";
  }
  function isBlob(val) {
    return toString.call(val) === "[object Blob]";
  }
  function isFunction(val) {
    return toString.call(val) === "[object Function]";
  }
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
  }
  function trim(str) {
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
  }
  function isStandardBrowserEnv() {
    if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
      return false;
    }
    return typeof window !== "undefined" && typeof document !== "undefined";
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function merge() {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === "function") {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }
  function stripBOM(content) {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  }
  module.exports = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    isURLSearchParams,
    isStandardBrowserEnv,
    forEach,
    merge,
    extend,
    trim,
    stripBOM
  };
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  module.exports = function buildURL(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  };
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  function InterceptorManager() {
    this.handlers = [];
  }
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    });
    return this.handlers.length - 1;
  };
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };
  module.exports = InterceptorManager;
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  module.exports = function transformData(data, headers2, fns) {
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers2);
    });
    return data;
  };
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS((exports, module) => {
  "use strict";
  module.exports = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  module.exports = function normalizeHeaderName(headers2, normalizedName) {
    utils.forEach(headers2, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers2[normalizedName] = value;
        delete headers2[name];
      }
    });
  };
});

// node_modules/axios/lib/core/enhanceError.js
var require_enhanceError = __commonJS((exports, module) => {
  "use strict";
  module.exports = function enhanceError(error, config2, code, request2, response) {
    error.config = config2;
    if (code) {
      error.code = code;
    }
    error.request = request2;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: this.config,
        code: this.code
      };
    };
    return error;
  };
});

// node_modules/axios/lib/core/createError.js
var require_createError = __commonJS((exports, module) => {
  "use strict";
  var enhanceError = require_enhanceError();
  module.exports = function createError(message, config2, code, request2, response) {
    var error = new Error(message);
    return enhanceError(error, config2, code, request2, response);
  };
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS((exports, module) => {
  "use strict";
  var createError = require_createError();
  module.exports = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError("Request failed with status code " + response.status, response.config, null, response.request, response));
    }
  };
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }() : function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove() {
      }
    };
  }();
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS((exports, module) => {
  "use strict";
  module.exports = function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS((exports, module) => {
  "use strict";
  module.exports = function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS((exports, module) => {
  "use strict";
  var isAbsoluteURL = require_isAbsoluteURL();
  var combineURLs = require_combineURLs();
  module.exports = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var ignoreDuplicateOf = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  module.exports = function parseHeaders(headers2) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers2) {
      return parsed;
    }
    utils.forEach(headers2.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));
      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === "set-cookie") {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      }
    });
    return parsed;
  };
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  module.exports = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement("a");
    var originURL;
    function resolveURL(url) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin(requestURL) {
      var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }() : function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  }();
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var settle = require_settle();
  var cookies = require_cookies();
  var buildURL = require_buildURL();
  var buildFullPath = require_buildFullPath();
  var parseHeaders = require_parseHeaders();
  var isURLSameOrigin = require_isURLSameOrigin();
  var createError = require_createError();
  module.exports = function xhrAdapter(config2) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config2.data;
      var requestHeaders = config2.headers;
      if (utils.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      if ((utils.isBlob(requestData) || utils.isFile(requestData)) && requestData.type) {
        delete requestHeaders["Content-Type"];
      }
      var request2 = new XMLHttpRequest();
      if (config2.auth) {
        var username = config2.auth.username || "";
        var password = unescape(encodeURIComponent(config2.auth.password)) || "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      var fullPath = buildFullPath(config2.baseURL, config2.url);
      request2.open(config2.method.toUpperCase(), buildURL(fullPath, config2.params, config2.paramsSerializer), true);
      request2.timeout = config2.timeout;
      request2.onreadystatechange = function handleLoad() {
        if (!request2 || request2.readyState !== 4) {
          return;
        }
        if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
          return;
        }
        var responseHeaders = "getAllResponseHeaders" in request2 ? parseHeaders(request2.getAllResponseHeaders()) : null;
        var responseData = !config2.responseType || config2.responseType === "text" ? request2.responseText : request2.response;
        var response = {
          data: responseData,
          status: request2.status,
          statusText: request2.statusText,
          headers: responseHeaders,
          config: config2,
          request: request2
        };
        settle(resolve, reject, response);
        request2 = null;
      };
      request2.onabort = function handleAbort() {
        if (!request2) {
          return;
        }
        reject(createError("Request aborted", config2, "ECONNABORTED", request2));
        request2 = null;
      };
      request2.onerror = function handleError() {
        reject(createError("Network Error", config2, null, request2));
        request2 = null;
      };
      request2.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = "timeout of " + config2.timeout + "ms exceeded";
        if (config2.timeoutErrorMessage) {
          timeoutErrorMessage = config2.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config2, "ECONNABORTED", request2));
        request2 = null;
      };
      if (utils.isStandardBrowserEnv()) {
        var xsrfValue = (config2.withCredentials || isURLSameOrigin(fullPath)) && config2.xsrfCookieName ? cookies.read(config2.xsrfCookieName) : void 0;
        if (xsrfValue) {
          requestHeaders[config2.xsrfHeaderName] = xsrfValue;
        }
      }
      if ("setRequestHeader" in request2) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
            delete requestHeaders[key];
          } else {
            request2.setRequestHeader(key, val);
          }
        });
      }
      if (!utils.isUndefined(config2.withCredentials)) {
        request2.withCredentials = !!config2.withCredentials;
      }
      if (config2.responseType) {
        try {
          request2.responseType = config2.responseType;
        } catch (e) {
          if (config2.responseType !== "json") {
            throw e;
          }
        }
      }
      if (typeof config2.onDownloadProgress === "function") {
        request2.addEventListener("progress", config2.onDownloadProgress);
      }
      if (typeof config2.onUploadProgress === "function" && request2.upload) {
        request2.upload.addEventListener("progress", config2.onUploadProgress);
      }
      if (config2.cancelToken) {
        config2.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request2) {
            return;
          }
          request2.abort();
          reject(cancel);
          request2 = null;
        });
      }
      if (!requestData) {
        requestData = null;
      }
      request2.send(requestData);
    });
  };
});

// node_modules/ms/index.js
var require_ms = __commonJS((exports, module) => {
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + "s";
    }
    return ms + "ms";
  }
  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
  }
  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS((exports, module) => {
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = require_ms();
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.instances = [];
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      function debug(...args) {
        if (!debug.enabled) {
          return;
        }
        const self = debug;
        const curr = Number(new Date());
        const ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return match;
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self, args);
        const logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }
      debug.namespace = namespace;
      debug.enabled = createDebug.enabled(namespace);
      debug.useColors = createDebug.useColors();
      debug.color = selectColor(namespace);
      debug.destroy = destroy;
      debug.extend = extend;
      if (typeof createDebug.init === "function") {
        createDebug.init(debug);
      }
      createDebug.instances.push(debug);
      return debug;
    }
    function destroy() {
      const index = createDebug.instances.indexOf(this);
      if (index !== -1) {
        createDebug.instances.splice(index, 1);
        return true;
      }
      return false;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.names = [];
      createDebug.skips = [];
      let i;
      const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      const len = split.length;
      for (i = 0; i < len; i++) {
        if (!split[i]) {
          continue;
        }
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          createDebug.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
      for (i = 0; i < createDebug.instances.length; i++) {
        const instance = createDebug.instances[i];
        instance.enabled = createDebug.enabled(instance.namespace);
      }
    }
    function disable() {
      const namespaces = [
        ...createDebug.names.map(toNamespace),
        ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      if (name[name.length - 1] === "*") {
        return true;
      }
      let i;
      let len;
      for (i = 0, len = createDebug.skips.length; i < len; i++) {
        if (createDebug.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = createDebug.names.length; i < len; i++) {
        if (createDebug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    function toNamespace(regexp) {
      return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  module.exports = setup;
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS((exports, module) => {
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = localstorage();
  exports.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
    if (!this.useColors) {
      return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
      if (match === "%%") {
        return;
      }
      index++;
      if (match === "%c") {
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  function log(...args) {
    return typeof console === "object" && console.log && console.log(...args);
  }
  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem("debug", namespaces);
      } else {
        exports.storage.removeItem("debug");
      }
    } catch (error) {
    }
  }
  function load() {
    let r;
    try {
      r = exports.storage.getItem("debug");
    } catch (error) {
    }
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = process.env.DEBUG;
    }
    return r;
  }
  function localstorage() {
    try {
      return localStorage;
    } catch (error) {
    }
  }
  module.exports = require_common()(exports);
  const {formatters} = module.exports;
  formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return "[UnexpectedJSONParseError]: " + error.message;
    }
  };
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS((exports, module) => {
  "use strict";
  module.exports = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS((exports, module) => {
  "use strict";
  const os = require("os");
  const tty = require("tty");
  const hasFlag = require_has_flag();
  const {env} = process;
  let forceColor;
  if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
    forceColor = 0;
  } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
  }
  module.exports = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
});

// node_modules/debug/src/node.js
var require_node = __commonJS((exports, module) => {
  const tty = require("tty");
  const util = require("util");
  exports.init = init;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.colors = [6, 2, 3, 4, 5, 1];
  try {
    const supportsColor = require_supports_color();
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
      exports.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ];
    }
  } catch (error) {
  }
  exports.inspectOpts = Object.keys(process.env).filter((key) => {
    return /^debug_/i.test(key);
  }).reduce((obj, key) => {
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
      return k.toUpperCase();
    });
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
      val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
      val = false;
    } else if (val === "null") {
      val = null;
    } else {
      val = Number(val);
    }
    obj[prop] = val;
    return obj;
  }, {});
  function useColors() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
  }
  function formatArgs(args) {
    const {namespace: name, useColors: useColors2} = this;
    if (useColors2) {
      const c = this.color;
      const colorCode = "[3" + (c < 8 ? c : "8;5;" + c);
      const prefix = `  ${colorCode};1m${name} [0m`;
      args[0] = prefix + args[0].split("\n").join("\n" + prefix);
      args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "[0m");
    } else {
      args[0] = getDate() + name + " " + args[0];
    }
  }
  function getDate() {
    if (exports.inspectOpts.hideDate) {
      return "";
    }
    return new Date().toISOString() + " ";
  }
  function log(...args) {
    return process.stderr.write(util.format(...args) + "\n");
  }
  function save(namespaces) {
    if (namespaces) {
      process.env.DEBUG = namespaces;
    } else {
      delete process.env.DEBUG;
    }
  }
  function load() {
    return process.env.DEBUG;
  }
  function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for (let i = 0; i < keys.length; i++) {
      debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
  }
  module.exports = require_common()(exports);
  const {formatters} = module.exports;
  formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).replace(/\s*\n\s*/g, " ");
  };
  formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
  };
});

// node_modules/debug/src/index.js
var require_src = __commonJS((exports, module) => {
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    module.exports = require_browser();
  } else {
    module.exports = require_node();
  }
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS((exports, module) => {
  var debug;
  try {
    debug = require_src()("follow-redirects");
  } catch (error) {
    debug = function() {
    };
  }
  module.exports = debug;
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS((exports, module) => {
  var url = require("url");
  var URL = url.URL;
  var http = require("http");
  var https = require("https");
  var Writable = require("stream").Writable;
  var assert = require("assert");
  var debug = require_debug();
  var eventHandlers = Object.create(null);
  ["abort", "aborted", "connect", "error", "socket", "timeout"].forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });
  var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "");
  var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
  var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
  var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
  function RedirectableRequest(options, responseCallback) {
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
    if (responseCallback) {
      this.on("response", responseCallback);
    }
    var self = this;
    this._onNativeResponse = function(response) {
      self._processResponse(response);
    };
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);
  RedirectableRequest.prototype.write = function(data, encoding, callback) {
    if (this._ending) {
      throw new WriteAfterEndError();
    }
    if (!(typeof data === "string" || typeof data === "object" && "length" in data)) {
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }
    if (data.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data.length;
      this._requestBodyBuffers.push({data, encoding});
      this._currentRequest.write(data, encoding, callback);
    } else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
  };
  RedirectableRequest.prototype.end = function(data, encoding, callback) {
    if (typeof data === "function") {
      callback = data;
      data = encoding = null;
    } else if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }
    if (!data) {
      this._ended = this._ending = true;
      this._currentRequest.end(null, null, callback);
    } else {
      var self = this;
      var currentRequest = this._currentRequest;
      this.write(data, encoding, function() {
        self._ended = true;
        currentRequest.end(null, null, callback);
      });
      this._ending = true;
    }
  };
  RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };
  RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };
  RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    if (callback) {
      this.once("timeout", callback);
    }
    if (this.socket) {
      startTimer(this, msecs);
    } else {
      var self = this;
      this._currentRequest.once("socket", function() {
        startTimer(self, msecs);
      });
    }
    this.once("response", clearTimer);
    this.once("error", clearTimer);
    return this;
  };
  function startTimer(request2, msecs) {
    clearTimeout(request2._timeout);
    request2._timeout = setTimeout(function() {
      request2.emit("timeout");
    }, msecs);
  }
  function clearTimer() {
    clearTimeout(this._timeout);
  }
  [
    "abort",
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
  ].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a, b) {
      return this._currentRequest[method](a, b);
    };
  });
  ["aborted", "connection", "socket"].forEach(function(property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function() {
        return this._currentRequest[property];
      }
    });
  });
  RedirectableRequest.prototype._sanitizeOptions = function(options) {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.host) {
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      } else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }
  };
  RedirectableRequest.prototype._performRequest = function() {
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      this.emit("error", new TypeError("Unsupported protocol " + protocol));
      return;
    }
    if (this._options.agents) {
      var scheme = protocol.substr(0, protocol.length - 1);
      this._options.agent = this._options.agents[scheme];
    }
    var request2 = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    this._currentUrl = url.format(this._options);
    request2._redirectable = this;
    for (var event in eventHandlers) {
      if (event) {
        request2.on(event, eventHandlers[event]);
      }
    }
    if (this._isRedirect) {
      var i = 0;
      var self = this;
      var buffers = this._requestBodyBuffers;
      (function writeNext(error) {
        if (request2 === self._currentRequest) {
          if (error) {
            self.emit("error", error);
          } else if (i < buffers.length) {
            var buffer = buffers[i++];
            if (!request2.finished) {
              request2.write(buffer.data, buffer.encoding, writeNext);
            }
          } else if (self._ended) {
            request2.end();
          }
        }
      })();
    }
  };
  RedirectableRequest.prototype._processResponse = function(response) {
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode
      });
    }
    var location = response.headers.location;
    if (location && this._options.followRedirects !== false && statusCode >= 300 && statusCode < 400) {
      this._currentRequest.removeAllListeners();
      this._currentRequest.on("error", noop);
      this._currentRequest.abort();
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
      }
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) || url.parse(this._currentUrl).hostname;
      var redirectUrl = url.resolve(this._currentUrl, location);
      debug("redirecting to", redirectUrl);
      this._isRedirect = true;
      var redirectUrlParts = url.parse(redirectUrl);
      Object.assign(this._options, redirectUrlParts);
      if (redirectUrlParts.hostname !== previousHostName) {
        removeMatchingHeaders(/^authorization$/i, this._options.headers);
      }
      if (typeof this._options.beforeRedirect === "function") {
        var responseDetails = {headers: response.headers};
        try {
          this._options.beforeRedirect.call(null, this._options, responseDetails);
        } catch (err) {
          this.emit("error", err);
          return;
        }
        this._sanitizeOptions(this._options);
      }
      try {
        this._performRequest();
      } catch (cause) {
        var error = new RedirectionError("Redirected request failed: " + cause.message);
        error.cause = cause;
        this.emit("error", error);
      }
    } else {
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);
      this._requestBodyBuffers = [];
    }
  };
  function wrap2(protocols) {
    var exports2 = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024
    };
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function(scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports2[scheme] = Object.create(nativeProtocol);
      wrappedProtocol.request = function(input, options, callback) {
        if (typeof input === "string") {
          var urlStr = input;
          try {
            input = urlToOptions(new URL(urlStr));
          } catch (err) {
            input = url.parse(urlStr);
          }
        } else if (URL && input instanceof URL) {
          input = urlToOptions(input);
        } else {
          callback = options;
          options = input;
          input = {protocol};
        }
        if (typeof options === "function") {
          callback = options;
          options = null;
        }
        options = Object.assign({
          maxRedirects: exports2.maxRedirects,
          maxBodyLength: exports2.maxBodyLength
        }, input, options);
        options.nativeProtocols = nativeProtocols;
        assert.equal(options.protocol, protocol, "protocol mismatch");
        debug("options", options);
        return new RedirectableRequest(options, callback);
      };
      wrappedProtocol.get = function(input, options, callback) {
        var request2 = wrappedProtocol.request(input, options, callback);
        request2.end();
        return request2;
      };
    });
    return exports2;
  }
  function noop() {
  }
  function urlToOptions(urlObject) {
    var options = {
      protocol: urlObject.protocol,
      hostname: urlObject.hostname.startsWith("[") ? urlObject.hostname.slice(1, -1) : urlObject.hostname,
      hash: urlObject.hash,
      search: urlObject.search,
      pathname: urlObject.pathname,
      path: urlObject.pathname + urlObject.search,
      href: urlObject.href
    };
    if (urlObject.port !== "") {
      options.port = Number(urlObject.port);
    }
    return options;
  }
  function removeMatchingHeaders(regex, headers2) {
    var lastValue;
    for (var header in headers2) {
      if (regex.test(header)) {
        lastValue = headers2[header];
        delete headers2[header];
      }
    }
    return lastValue;
  }
  function createErrorType(code, defaultMessage) {
    function CustomError(message) {
      Error.captureStackTrace(this, this.constructor);
      this.message = message || defaultMessage;
    }
    CustomError.prototype = new Error();
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = "Error [" + code + "]";
    CustomError.prototype.code = code;
    return CustomError;
  }
  module.exports = wrap2({http, https});
  module.exports.wrap = wrap2;
});

// node_modules/axios/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "axios",
    version: "0.20.0",
    description: "Promise based HTTP client for the browser and node.js",
    main: "index.js",
    scripts: {
      test: "grunt test && bundlesize",
      start: "node ./sandbox/server.js",
      build: "NODE_ENV=production grunt build",
      preversion: "npm test",
      version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
      postversion: "git push && git push --tags",
      examples: "node ./examples/server.js",
      coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
      fix: "eslint --fix lib/**/*.js"
    },
    repository: {
      type: "git",
      url: "https://github.com/axios/axios.git"
    },
    keywords: [
      "xhr",
      "http",
      "ajax",
      "promise",
      "node"
    ],
    author: "Matt Zabriskie",
    license: "MIT",
    bugs: {
      url: "https://github.com/axios/axios/issues"
    },
    homepage: "https://github.com/axios/axios",
    devDependencies: {
      bundlesize: "^0.17.0",
      coveralls: "^3.0.0",
      "es6-promise": "^4.2.4",
      grunt: "^1.0.2",
      "grunt-banner": "^0.6.0",
      "grunt-cli": "^1.2.0",
      "grunt-contrib-clean": "^1.1.0",
      "grunt-contrib-watch": "^1.0.0",
      "grunt-eslint": "^20.1.0",
      "grunt-karma": "^2.0.0",
      "grunt-mocha-test": "^0.13.3",
      "grunt-ts": "^6.0.0-beta.19",
      "grunt-webpack": "^1.0.18",
      "istanbul-instrumenter-loader": "^1.0.0",
      "jasmine-core": "^2.4.1",
      karma: "^1.3.0",
      "karma-chrome-launcher": "^2.2.0",
      "karma-coverage": "^1.1.1",
      "karma-firefox-launcher": "^1.1.0",
      "karma-jasmine": "^1.1.1",
      "karma-jasmine-ajax": "^0.1.13",
      "karma-opera-launcher": "^1.0.0",
      "karma-safari-launcher": "^1.0.0",
      "karma-sauce-launcher": "^1.2.0",
      "karma-sinon": "^1.0.5",
      "karma-sourcemap-loader": "^0.3.7",
      "karma-webpack": "^1.7.0",
      "load-grunt-tasks": "^3.5.2",
      minimist: "^1.2.0",
      mocha: "^5.2.0",
      sinon: "^4.5.0",
      typescript: "^2.8.1",
      "url-search-params": "^0.10.0",
      webpack: "^1.13.1",
      "webpack-dev-server": "^1.14.1"
    },
    browser: {
      "./lib/adapters/http.js": "./lib/adapters/xhr.js"
    },
    jsdelivr: "dist/axios.min.js",
    unpkg: "dist/axios.min.js",
    typings: "./index.d.ts",
    dependencies: {
      "follow-redirects": "^1.10.0"
    },
    bundlesize: [
      {
        path: "./dist/axios.min.js",
        threshold: "5kB"
      }
    ]
  };
});

// node_modules/axios/lib/adapters/http.js
var require_http = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var settle = require_settle();
  var buildFullPath = require_buildFullPath();
  var buildURL = require_buildURL();
  var http = require("http");
  var https = require("https");
  var httpFollow = require_follow_redirects().http;
  var httpsFollow = require_follow_redirects().https;
  var url = require("url");
  var zlib = require("zlib");
  var pkg = require_package();
  var createError = require_createError();
  var enhanceError = require_enhanceError();
  var isHttps = /https:?/;
  module.exports = function httpAdapter(config2) {
    return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
      var resolve = function resolve2(value) {
        resolvePromise(value);
      };
      var reject = function reject2(value) {
        rejectPromise(value);
      };
      var data = config2.data;
      var headers2 = config2.headers;
      if (!headers2["User-Agent"] && !headers2["user-agent"]) {
        headers2["User-Agent"] = "axios/" + pkg.version;
      }
      if (data && !utils.isStream(data)) {
        if (Buffer.isBuffer(data)) {
        } else if (utils.isArrayBuffer(data)) {
          data = Buffer.from(new Uint8Array(data));
        } else if (utils.isString(data)) {
          data = Buffer.from(data, "utf-8");
        } else {
          return reject(createError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", config2));
        }
        headers2["Content-Length"] = data.length;
      }
      var auth = void 0;
      if (config2.auth) {
        var username = config2.auth.username || "";
        var password = config2.auth.password || "";
        auth = username + ":" + password;
      }
      var fullPath = buildFullPath(config2.baseURL, config2.url);
      var parsed = url.parse(fullPath);
      var protocol = parsed.protocol || "http:";
      if (!auth && parsed.auth) {
        var urlAuth = parsed.auth.split(":");
        var urlUsername = urlAuth[0] || "";
        var urlPassword = urlAuth[1] || "";
        auth = urlUsername + ":" + urlPassword;
      }
      if (auth) {
        delete headers2.Authorization;
      }
      var isHttpsRequest = isHttps.test(protocol);
      var agent = isHttpsRequest ? config2.httpsAgent : config2.httpAgent;
      var options = {
        path: buildURL(parsed.path, config2.params, config2.paramsSerializer).replace(/^\?/, ""),
        method: config2.method.toUpperCase(),
        headers: headers2,
        agent,
        agents: {http: config2.httpAgent, https: config2.httpsAgent},
        auth
      };
      if (config2.socketPath) {
        options.socketPath = config2.socketPath;
      } else {
        options.hostname = parsed.hostname;
        options.port = parsed.port;
      }
      var proxy = config2.proxy;
      if (!proxy && proxy !== false) {
        var proxyEnv = protocol.slice(0, -1) + "_proxy";
        var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        if (proxyUrl) {
          var parsedProxyUrl = url.parse(proxyUrl);
          var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
          var shouldProxy = true;
          if (noProxyEnv) {
            var noProxy = noProxyEnv.split(",").map(function trim(s) {
              return s.trim();
            });
            shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
              if (!proxyElement) {
                return false;
              }
              if (proxyElement === "*") {
                return true;
              }
              if (proxyElement[0] === "." && parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                return true;
              }
              return parsed.hostname === proxyElement;
            });
          }
          if (shouldProxy) {
            proxy = {
              host: parsedProxyUrl.hostname,
              port: parsedProxyUrl.port
            };
            if (parsedProxyUrl.auth) {
              var proxyUrlAuth = parsedProxyUrl.auth.split(":");
              proxy.auth = {
                username: proxyUrlAuth[0],
                password: proxyUrlAuth[1]
              };
            }
          }
        }
      }
      if (proxy) {
        options.hostname = proxy.host;
        options.host = proxy.host;
        options.headers.host = parsed.hostname + (parsed.port ? ":" + parsed.port : "");
        options.port = proxy.port;
        options.path = protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path;
        if (proxy.auth) {
          var base64 = Buffer.from(proxy.auth.username + ":" + proxy.auth.password, "utf8").toString("base64");
          options.headers["Proxy-Authorization"] = "Basic " + base64;
        }
      }
      var transport;
      var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
      if (config2.transport) {
        transport = config2.transport;
      } else if (config2.maxRedirects === 0) {
        transport = isHttpsProxy ? https : http;
      } else {
        if (config2.maxRedirects) {
          options.maxRedirects = config2.maxRedirects;
        }
        transport = isHttpsProxy ? httpsFollow : httpFollow;
      }
      if (config2.maxBodyLength > -1) {
        options.maxBodyLength = config2.maxBodyLength;
      }
      var req = transport.request(options, function handleResponse(res) {
        if (req.aborted)
          return;
        var stream = res;
        var lastRequest = res.req || req;
        if (res.statusCode !== 204 && lastRequest.method !== "HEAD" && config2.decompress !== false) {
          switch (res.headers["content-encoding"]) {
            case "gzip":
            case "compress":
            case "deflate":
              stream = stream.pipe(zlib.createUnzip());
              delete res.headers["content-encoding"];
              break;
          }
        }
        var response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          config: config2,
          request: lastRequest
        };
        if (config2.responseType === "stream") {
          response.data = stream;
          settle(resolve, reject, response);
        } else {
          var responseBuffer = [];
          stream.on("data", function handleStreamData(chunk) {
            responseBuffer.push(chunk);
            if (config2.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config2.maxContentLength) {
              stream.destroy();
              reject(createError("maxContentLength size of " + config2.maxContentLength + " exceeded", config2, null, lastRequest));
            }
          });
          stream.on("error", function handleStreamError(err) {
            if (req.aborted)
              return;
            reject(enhanceError(err, config2, null, lastRequest));
          });
          stream.on("end", function handleStreamEnd() {
            var responseData = Buffer.concat(responseBuffer);
            if (config2.responseType !== "arraybuffer") {
              responseData = responseData.toString(config2.responseEncoding);
              if (!config2.responseEncoding || config2.responseEncoding === "utf8") {
                responseData = utils.stripBOM(responseData);
              }
            }
            response.data = responseData;
            settle(resolve, reject, response);
          });
        }
      });
      req.on("error", function handleRequestError(err) {
        if (req.aborted && err.code !== "ERR_FR_TOO_MANY_REDIRECTS")
          return;
        reject(enhanceError(err, config2, null, req));
      });
      if (config2.timeout) {
        req.setTimeout(config2.timeout, function handleRequestTimeout() {
          req.abort();
          reject(createError("timeout of " + config2.timeout + "ms exceeded", config2, "ECONNABORTED", req));
        });
      }
      if (config2.cancelToken) {
        config2.cancelToken.promise.then(function onCanceled(cancel) {
          if (req.aborted)
            return;
          req.abort();
          reject(cancel);
        });
      }
      if (utils.isStream(data)) {
        data.on("error", function handleStreamError(err) {
          reject(enhanceError(err, config2, null, req));
        }).pipe(req);
      } else {
        req.end(data);
      }
    });
  };
});

// node_modules/axios/lib/defaults.js
var require_defaults = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var normalizeHeaderName = require_normalizeHeaderName();
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers2, value) {
    if (!utils.isUndefined(headers2) && utils.isUndefined(headers2["Content-Type"])) {
      headers2["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== "undefined") {
      adapter = require_xhr();
    } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = require_http();
    }
    return adapter;
  }
  var defaults = {
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data, headers2) {
      normalizeHeaderName(headers2, "Accept");
      normalizeHeaderName(headers2, "Content-Type");
      if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers2, "application/x-www-form-urlencoded;charset=utf-8");
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers2, "application/json;charset=utf-8");
        return JSON.stringify(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
        }
      }
      return data;
    }],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };
  defaults.headers = {
    common: {
      Accept: "application/json, text/plain, */*"
    }
  };
  utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });
  utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });
  module.exports = defaults;
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var transformData = require_transformData();
  var isCancel = require_isCancel();
  var defaults = require_defaults();
  function throwIfCancellationRequested(config2) {
    if (config2.cancelToken) {
      config2.cancelToken.throwIfRequested();
    }
  }
  module.exports = function dispatchRequest(config2) {
    throwIfCancellationRequested(config2);
    config2.headers = config2.headers || {};
    config2.data = transformData(config2.data, config2.headers, config2.transformRequest);
    config2.headers = utils.merge(config2.headers.common || {}, config2.headers[config2.method] || {}, config2.headers);
    utils.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
      delete config2.headers[method];
    });
    var adapter = config2.adapter || defaults.adapter;
    return adapter(config2).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config2);
      response.data = transformData(response.data, response.headers, config2.transformResponse);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config2);
        if (reason && reason.response) {
          reason.response.data = transformData(reason.response.data, reason.response.headers, config2.transformResponse);
        }
      }
      return Promise.reject(reason);
    });
  };
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  module.exports = function mergeConfig(config1, config2) {
    config2 = config2 || {};
    var config3 = {};
    var valueFromConfig2Keys = ["url", "method", "data"];
    var mergeDeepPropertiesKeys = ["headers", "auth", "proxy", "params"];
    var defaultToConfig2Keys = [
      "baseURL",
      "transformRequest",
      "transformResponse",
      "paramsSerializer",
      "timeout",
      "timeoutMessage",
      "withCredentials",
      "adapter",
      "responseType",
      "xsrfCookieName",
      "xsrfHeaderName",
      "onUploadProgress",
      "onDownloadProgress",
      "decompress",
      "maxContentLength",
      "maxBodyLength",
      "maxRedirects",
      "transport",
      "httpAgent",
      "httpsAgent",
      "cancelToken",
      "socketPath",
      "responseEncoding"
    ];
    var directMergeKeys = ["validateStatus"];
    function getMergedValue(target, source) {
      if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
        return utils.merge(target, source);
      } else if (utils.isPlainObject(source)) {
        return utils.merge({}, source);
      } else if (utils.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config3[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config3[prop] = getMergedValue(void 0, config1[prop]);
      }
    }
    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config3[prop] = getMergedValue(void 0, config2[prop]);
      }
    });
    utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config3[prop] = getMergedValue(void 0, config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config3[prop] = getMergedValue(void 0, config1[prop]);
      }
    });
    utils.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config3[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config3[prop] = getMergedValue(void 0, config1[prop]);
      }
    });
    var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
    var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });
    utils.forEach(otherKeys, mergeDeepProperties);
    return config3;
  };
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var buildURL = require_buildURL();
  var InterceptorManager = require_InterceptorManager();
  var dispatchRequest = require_dispatchRequest();
  var mergeConfig = require_mergeConfig();
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  Axios.prototype.request = function request2(config2) {
    if (typeof config2 === "string") {
      config2 = arguments[1] || {};
      config2.url = arguments[0];
    } else {
      config2 = config2 || {};
    }
    config2 = mergeConfig(this.defaults, config2);
    if (config2.method) {
      config2.method = config2.method.toLowerCase();
    } else if (this.defaults.method) {
      config2.method = this.defaults.method.toLowerCase();
    } else {
      config2.method = "get";
    }
    var chain = [dispatchRequest, void 0];
    var promise = Promise.resolve(config2);
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  };
  Axios.prototype.getUri = function getUri(config2) {
    config2 = mergeConfig(this.defaults, config2);
    return buildURL(config2.url, config2.params, config2.paramsSerializer).replace(/^\?/, "");
  };
  utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config2) {
      return this.request(mergeConfig(config2 || {}, {
        method,
        url
      }));
    };
  });
  utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    Axios.prototype[method] = function(url, data, config2) {
      return this.request(mergeConfig(config2 || {}, {
        method,
        url,
        data
      }));
    };
  });
  module.exports = Axios;
});

// node_modules/axios/lib/cancel/Cancel.js
var require_Cancel = __commonJS((exports, module) => {
  "use strict";
  function Cancel(message) {
    this.message = message;
  }
  Cancel.prototype.toString = function toString() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  };
  Cancel.prototype.__CANCEL__ = true;
  module.exports = Cancel;
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS((exports, module) => {
  "use strict";
  var Cancel = require_Cancel();
  function CancelToken(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        return;
      }
      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  };
  module.exports = CancelToken;
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS((exports, module) => {
  "use strict";
  module.exports = function spread(callback) {
    return function wrap2(arr) {
      return callback.apply(null, arr);
    };
  };
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS((exports, module) => {
  "use strict";
  var utils = require_utils();
  var bind = require_bind();
  var Axios = require_Axios();
  var mergeConfig = require_mergeConfig();
  var defaults = require_defaults();
  function createInstance(defaultConfig) {
    var context3 = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context3);
    utils.extend(instance, Axios.prototype, context3);
    utils.extend(instance, context3);
    return instance;
  }
  var axios5 = createInstance(defaults);
  axios5.Axios = Axios;
  axios5.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios5.defaults, instanceConfig));
  };
  axios5.Cancel = require_Cancel();
  axios5.CancelToken = require_CancelToken();
  axios5.isCancel = require_isCancel();
  axios5.all = function all(promises) {
    return Promise.all(promises);
  };
  axios5.spread = require_spread();
  module.exports = axios5;
  module.exports.default = axios5;
});

// node_modules/axios/index.js
var require_axios2 = __commonJS((exports, module) => {
  module.exports = require_axios();
});

// node_modules/node-rsa/src/utils.js
var require_utils2 = __commonJS((exports, module) => {
  var crypt = require("crypto");
  module.exports.linebrk = function(str, maxLen) {
    var res = "";
    var i = 0;
    while (i + maxLen < str.length) {
      res += str.substring(i, i + maxLen) + "\n";
      i += maxLen;
    }
    return res + str.substring(i, str.length);
  };
  module.exports.detectEnvironment = function() {
    if (typeof window !== "undefined" && window && !(process && process.title === "node")) {
      return "browser";
    }
    return "node";
  };
  module.exports.get32IntFromBuffer = function(buffer, offset) {
    offset = offset || 0;
    var size = 0;
    if ((size = buffer.length - offset) > 0) {
      if (size >= 4) {
        return buffer.readUIntBE(offset, size);
      } else {
        var res = 0;
        for (var i = offset + size, d = 0; i > offset; i--, d += 2) {
          res += buffer[i - 1] * Math.pow(16, d);
        }
        return res;
      }
    } else {
      return NaN;
    }
  };
  module.exports._ = {
    isObject: function(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    },
    isString: function(value) {
      return typeof value == "string" || value instanceof String;
    },
    isNumber: function(value) {
      return typeof value == "number" || !isNaN(parseFloat(value)) && isFinite(value);
    },
    omit: function(obj, removeProp) {
      var newObj = {};
      for (var prop in obj) {
        if (!obj.hasOwnProperty(prop) || prop === removeProp) {
          continue;
        }
        newObj[prop] = obj[prop];
      }
      return newObj;
    }
  };
  module.exports.trimSurroundingText = function(data, opening, closing) {
    var trimStartIndex = 0;
    var trimEndIndex = data.length;
    var openingBoundaryIndex = data.indexOf(opening);
    if (openingBoundaryIndex >= 0) {
      trimStartIndex = openingBoundaryIndex + opening.length;
    }
    var closingBoundaryIndex = data.indexOf(closing, openingBoundaryIndex);
    if (closingBoundaryIndex >= 0) {
      trimEndIndex = closingBoundaryIndex;
    }
    return data.substring(trimStartIndex, trimEndIndex);
  };
});

// node_modules/node-rsa/src/libs/jsbn.js
var require_jsbn = __commonJS((exports, module) => {
  var crypt = require("crypto");
  var _ = require_utils2()._;
  var dbits;
  var canary = 244837814094590;
  var j_lm = (canary & 16777215) == 15715070;
  function BigInteger(a, b) {
    if (a != null) {
      if (typeof a == "number") {
        this.fromNumber(a, b);
      } else if (Buffer.isBuffer(a)) {
        this.fromBuffer(a);
      } else if (b == null && typeof a != "string") {
        this.fromByteArray(a);
      } else {
        this.fromString(a, b);
      }
    }
  }
  function nbi() {
    return new BigInteger(null);
  }
  function am3(i, x, w, j, c, n) {
    var xl = x & 16383, xh = x >> 14;
    while (--n >= 0) {
      var l = this[i] & 16383;
      var h = this[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 16383) << 14) + w[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w[j++] = l & 268435455;
    }
    return c;
  }
  BigInteger.prototype.am = am3;
  dbits = 28;
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP;
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr;
  var vv;
  rr = "0".charCodeAt(0);
  for (vv = 0; vv <= 9; ++vv)
    BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
  function int2char(n) {
    return BI_RM.charAt(n);
  }
  function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return c == null ? -1 : c;
  }
  function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i)
      r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }
  function bnpFromInt(x) {
    this.t = 1;
    this.s = x < 0 ? -1 : 0;
    if (x > 0)
      this[0] = x;
    else if (x < -1)
      this[0] = x + DV;
    else
      this.t = 0;
  }
  function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
  }
  function bnpFromString(data, radix, unsigned) {
    var k;
    switch (radix) {
      case 2:
        k = 1;
        break;
      case 4:
        k = 2;
        break;
      case 8:
        k = 3;
        break;
      case 16:
        k = 4;
        break;
      case 32:
        k = 5;
        break;
      case 256:
        k = 8;
        break;
      default:
        this.fromRadix(data, radix);
        return;
    }
    this.t = 0;
    this.s = 0;
    var i = data.length;
    var mi = false;
    var sh = 0;
    while (--i >= 0) {
      var x = k == 8 ? data[i] & 255 : intAt(data, i);
      if (x < 0) {
        if (data.charAt(i) == "-")
          mi = true;
        continue;
      }
      mi = false;
      if (sh === 0)
        this[this.t++] = x;
      else if (sh + k > this.DB) {
        this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
        this[this.t++] = x >> this.DB - sh;
      } else
        this[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB)
        sh -= this.DB;
    }
    if (!unsigned && k == 8 && (data[0] & 128) != 0) {
      this.s = -1;
      if (sh > 0)
        this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }
    this.clamp();
    if (mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpFromByteArray(a, unsigned) {
    this.fromString(a, 256, unsigned);
  }
  function bnpFromBuffer(a) {
    this.fromString(a, 256, true);
  }
  function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c)
      --this.t;
  }
  function bnToString(b) {
    if (this.s < 0)
      return "-" + this.negate().toString(b);
    var k;
    if (b == 16)
      k = 4;
    else if (b == 8)
      k = 3;
    else if (b == 2)
      k = 1;
    else if (b == 32)
      k = 5;
    else if (b == 4)
      k = 2;
    else
      return this.toRadix(b);
    var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
    var p = this.DB - i * this.DB % k;
    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) > 0) {
        m = true;
        r = int2char(d);
      }
      while (i >= 0) {
        if (p < k) {
          d = (this[i] & (1 << p) - 1) << k - p;
          d |= this[--i] >> (p += this.DB - k);
        } else {
          d = this[i] >> (p -= k) & km;
          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }
        if (d > 0)
          m = true;
        if (m)
          r += int2char(d);
      }
    }
    return m ? r : "0";
  }
  function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
  }
  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  }
  function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0)
      return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0)
      return this.s < 0 ? -r : r;
    while (--i >= 0)
      if ((r = this[i] - a[i]) != 0)
        return r;
    return 0;
  }
  function nbits(x) {
    var r = 1, t;
    if ((t = x >>> 16) != 0) {
      x = t;
      r += 16;
    }
    if ((t = x >> 8) != 0) {
      x = t;
      r += 8;
    }
    if ((t = x >> 4) != 0) {
      x = t;
      r += 4;
    }
    if ((t = x >> 2) != 0) {
      x = t;
      r += 2;
    }
    if ((t = x >> 1) != 0) {
      x = t;
      r += 1;
    }
    return r;
  }
  function bnBitLength() {
    if (this.t <= 0)
      return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
  }
  function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i)
      r[i + n] = this[i];
    for (i = n - 1; i >= 0; --i)
      r[i] = 0;
    r.t = this.t + n;
    r.s = this.s;
  }
  function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i)
      r[i - n] = this[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  }
  function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
    for (i = this.t - 1; i >= 0; --i) {
      r[i + ds + 1] = this[i] >> cbs | c;
      c = (this[i] & bm) << bs;
    }
    for (i = ds - 1; i >= 0; --i)
      r[i] = 0;
    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  }
  function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
      r.t = 0;
      return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i) {
      r[i - ds - 1] |= (this[i] & bm) << cbs;
      r[i - ds] = this[i] >> bs;
    }
    if (bs > 0)
      r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  }
  function bnpSubTo(a, r) {
    var i = 0, c = 0, m = Math.min(a.t, this.t);
    while (i < m) {
      c += this[i] - a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c -= a.s;
      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c -= a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c < -1)
      r[i++] = this.DV + c;
    else if (c > 0)
      r[i++] = c;
    r.t = i;
    r.clamp();
  }
  function bnpMultiplyTo(a, r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0)
      r[i] = 0;
    for (i = 0; i < y.t; ++i)
      r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s)
      BigInteger.ZERO.subTo(r, r);
  }
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0)
      r[i] = 0;
    for (i = 0; i < x.t - 1; ++i) {
      var c = x.am(i, x[i], r, 2 * i, 0, 1);
      if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r[i + x.t] -= x.DV;
        r[i + x.t + 1] = 1;
      }
    }
    if (r.t > 0)
      r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  }
  function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0)
      return;
    var pt = this.abs();
    if (pt.t < pm.t) {
      if (q != null)
        q.fromInt(0);
      if (r != null)
        this.copyTo(r);
      return;
    }
    if (r == null)
      r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]);
    if (nsh > 0) {
      pm.lShiftTo(nsh, y);
      pt.lShiftTo(nsh, r);
    } else {
      pm.copyTo(y);
      pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 === 0)
      return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
    var i = r.t, j = i - ys, t = q == null ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y);
    while (y.t < ys)
      y[y.t++] = 0;
    while (--j >= 0) {
      var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
      if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
        y.dlShiftTo(j, t);
        r.subTo(t, r);
        while (r[i] < --qd)
          r.subTo(t, r);
      }
    }
    if (q != null) {
      r.drShiftTo(ys, q);
      if (ts != ms)
        BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0)
      r.rShiftTo(nsh, r);
    if (ts < 0)
      BigInteger.ZERO.subTo(r, r);
  }
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
      a.subTo(r, r);
    return r;
  }
  function Classic(m) {
    this.m = m;
  }
  function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0)
      return x.mod(this.m);
    else
      return x;
  }
  function cRevert(x) {
    return x;
  }
  function cReduce(x) {
    x.divRemTo(this.m, null, x);
  }
  function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  function bnpInvDigit() {
    if (this.t < 1)
      return 0;
    var x = this[0];
    if ((x & 1) === 0)
      return 0;
    var y = x & 3;
    y = y * (2 - (x & 15) * y) & 15;
    y = y * (2 - (x & 255) * y) & 255;
    y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
    y = y * (2 - x * y % this.DV) % this.DV;
    return y > 0 ? this.DV - y : -y;
  }
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  }
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
      this.m.subTo(r, r);
    return r;
  }
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  function montReduce(x) {
    while (x.t <= this.mt2)
      x[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
      var j = x[i] & 32767;
      var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
      j = i + this.m.t;
      x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
      while (x[j] >= x.DV) {
        x[j] -= x.DV;
        x[++j]++;
      }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0)
      x.subTo(this.m, x);
  }
  function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  function bnpIsEven() {
    return (this.t > 0 ? this[0] & 1 : this.s) === 0;
  }
  function bnpExp(e, z) {
    if (e > 4294967295 || e < 1)
      return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
      z.sqrTo(r, r2);
      if ((e & 1 << i) > 0)
        z.mulTo(r2, g, r);
      else {
        var t = r;
        r = r2;
        r2 = t;
      }
    }
    return z.revert(r);
  }
  function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven())
      z = new Classic(m);
    else
      z = new Montgomery(m);
    return this.exp(e, z);
  }
  function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r;
  }
  function bnIntValue() {
    if (this.s < 0) {
      if (this.t == 1)
        return this[0] - this.DV;
      else if (this.t === 0)
        return -1;
    } else if (this.t == 1)
      return this[0];
    else if (this.t === 0)
      return 0;
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
  }
  function bnByteValue() {
    return this.t == 0 ? this.s : this[0] << 24 >> 24;
  }
  function bnShortValue() {
    return this.t == 0 ? this.s : this[0] << 16 >> 16;
  }
  function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
  }
  function bnSigNum() {
    if (this.s < 0)
      return -1;
    else if (this.t <= 0 || this.t == 1 && this[0] <= 0)
      return 0;
    else
      return 1;
  }
  function bnpToRadix(b) {
    if (b == null)
      b = 10;
    if (this.signum() === 0 || b < 2 || b > 36)
      return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0) {
      r = (a + z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d, y, z);
    }
    return z.intValue().toString(b) + r;
  }
  function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null)
      b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
    for (var i = 0; i < s.length; ++i) {
      var x = intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-" && this.signum() === 0)
          mi = true;
        continue;
      }
      w = b * w + x;
      if (++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w, 0);
        j = 0;
        w = 0;
      }
    }
    if (j > 0) {
      this.dMultiply(Math.pow(b, j));
      this.dAddOffset(w, 0);
    }
    if (mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpFromNumber(a, b) {
    if (typeof b == "number") {
      if (a < 2)
        this.fromInt(1);
      else {
        this.fromNumber(a);
        if (!this.testBit(a - 1))
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        if (this.isEven())
          this.dAddOffset(1, 0);
        while (!this.isProbablePrime(b)) {
          this.dAddOffset(2, 0);
          if (this.bitLength() > a)
            this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
        }
      }
    } else {
      var x = crypt.randomBytes((a >> 3) + 1);
      var t = a & 7;
      if (t > 0)
        x[0] &= (1 << t) - 1;
      else
        x[0] = 0;
      this.fromByteArray(x);
    }
  }
  function bnToByteArray() {
    var i = this.t, r = new Array();
    r[0] = this.s;
    var p = this.DB - i * this.DB % 8, d, k = 0;
    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
        r[k++] = d | this.s << this.DB - p;
      while (i >= 0) {
        if (p < 8) {
          d = (this[i] & (1 << p) - 1) << 8 - p;
          d |= this[--i] >> (p += this.DB - 8);
        } else {
          d = this[i] >> (p -= 8) & 255;
          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }
        if ((d & 128) != 0)
          d |= -256;
        if (k === 0 && (this.s & 128) != (d & 128))
          ++k;
        if (k > 0 || d != this.s)
          r[k++] = d;
      }
    }
    return r;
  }
  function bnToBuffer(trimOrSize) {
    var res = Buffer.from(this.toByteArray());
    if (trimOrSize === true && res[0] === 0) {
      res = res.slice(1);
    } else if (_.isNumber(trimOrSize)) {
      if (res.length > trimOrSize) {
        for (var i = 0; i < res.length - trimOrSize; i++) {
          if (res[i] !== 0) {
            return null;
          }
        }
        return res.slice(res.length - trimOrSize);
      } else if (res.length < trimOrSize) {
        var padded = Buffer.alloc(trimOrSize);
        padded.fill(0, 0, trimOrSize - res.length);
        res.copy(padded, trimOrSize - res.length);
        return padded;
      }
    }
    return res;
  }
  function bnEquals(a) {
    return this.compareTo(a) == 0;
  }
  function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a;
  }
  function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a;
  }
  function bnpBitwiseTo(a, op, r) {
    var i, f, m = Math.min(a.t, this.t);
    for (i = 0; i < m; ++i)
      r[i] = op(this[i], a[i]);
    if (a.t < this.t) {
      f = a.s & this.DM;
      for (i = m; i < this.t; ++i)
        r[i] = op(this[i], f);
      r.t = this.t;
    } else {
      f = this.s & this.DM;
      for (i = m; i < a.t; ++i)
        r[i] = op(f, a[i]);
      r.t = a.t;
    }
    r.s = op(this.s, a.s);
    r.clamp();
  }
  function op_and(x, y) {
    return x & y;
  }
  function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r;
  }
  function op_or(x, y) {
    return x | y;
  }
  function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r;
  }
  function op_xor(x, y) {
    return x ^ y;
  }
  function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r;
  }
  function op_andnot(x, y) {
    return x & ~y;
  }
  function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r;
  }
  function bnNot() {
    var r = nbi();
    for (var i = 0; i < this.t; ++i)
      r[i] = this.DM & ~this[i];
    r.t = this.t;
    r.s = ~this.s;
    return r;
  }
  function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0)
      this.rShiftTo(-n, r);
    else
      this.lShiftTo(n, r);
    return r;
  }
  function bnShiftRight(n) {
    var r = nbi();
    if (n < 0)
      this.lShiftTo(-n, r);
    else
      this.rShiftTo(n, r);
    return r;
  }
  function lbit(x) {
    if (x === 0)
      return -1;
    var r = 0;
    if ((x & 65535) === 0) {
      x >>= 16;
      r += 16;
    }
    if ((x & 255) === 0) {
      x >>= 8;
      r += 8;
    }
    if ((x & 15) === 0) {
      x >>= 4;
      r += 4;
    }
    if ((x & 3) === 0) {
      x >>= 2;
      r += 2;
    }
    if ((x & 1) === 0)
      ++r;
    return r;
  }
  function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i)
      if (this[i] != 0)
        return i * this.DB + lbit(this[i]);
    if (this.s < 0)
      return this.t * this.DB;
    return -1;
  }
  function cbit(x) {
    var r = 0;
    while (x != 0) {
      x &= x - 1;
      ++r;
    }
    return r;
  }
  function bnBitCount() {
    var r = 0, x = this.s & this.DM;
    for (var i = 0; i < this.t; ++i)
      r += cbit(this[i] ^ x);
    return r;
  }
  function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t)
      return this.s != 0;
    return (this[j] & 1 << n % this.DB) != 0;
  }
  function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
  }
  function bnSetBit(n) {
    return this.changeBit(n, op_or);
  }
  function bnClearBit(n) {
    return this.changeBit(n, op_andnot);
  }
  function bnFlipBit(n) {
    return this.changeBit(n, op_xor);
  }
  function bnpAddTo(a, r) {
    var i = 0, c = 0, m = Math.min(a.t, this.t);
    while (i < m) {
      c += this[i] + a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c += a.s;
      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c += a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c > 0)
      r[i++] = c;
    else if (c < -1)
      r[i++] = this.DV + c;
    r.t = i;
    r.clamp();
  }
  function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r;
  }
  function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r;
  }
  function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r;
  }
  function bnSquare() {
    var r = nbi();
    this.squareTo(r);
    return r;
  }
  function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r;
  }
  function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r;
  }
  function bnDivideAndRemainder(a) {
    var q = nbi(), r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
  }
  function bnpDMultiply(n) {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp();
  }
  function bnpDAddOffset(n, w) {
    if (n === 0)
      return;
    while (this.t <= w)
      this[this.t++] = 0;
    this[w] += n;
    while (this[w] >= this.DV) {
      this[w] -= this.DV;
      if (++w >= this.t)
        this[this.t++] = 0;
      ++this[w];
    }
  }
  function NullExp() {
  }
  function nNop(x) {
    return x;
  }
  function nMulTo(x, y, r) {
    x.multiplyTo(y, r);
  }
  function nSqrTo(x, r) {
    x.squareTo(r);
  }
  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo;
  function bnPow(e) {
    return this.exp(e, new NullExp());
  }
  function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0;
    r.t = i;
    while (i > 0)
      r[--i] = 0;
    var j;
    for (j = r.t - this.t; i < j; ++i)
      r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
    for (j = Math.min(a.t, n); i < j; ++i)
      this.am(0, a[i], r, i, 0, n - i);
    r.clamp();
  }
  function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0;
    while (--i >= 0)
      r[i] = 0;
    for (i = Math.max(n - this.t, 0); i < a.t; ++i)
      r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
    r.clamp();
    r.drShiftTo(1, r);
  }
  function Barrett(m) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }
  function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t)
      return x.mod(this.m);
    else if (x.compareTo(this.m) < 0)
      return x;
    else {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
  }
  function barrettRevert(x) {
    return x;
  }
  function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
      x.t = this.m.t + 1;
      x.clamp();
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0)
      x.dAddOffset(1, this.m.t + 1);
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0)
      x.subTo(this.m, x);
  }
  function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }
  function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo;
  function bnModPow(e, m) {
    var i = e.bitLength(), k, r = nbv(1), z;
    if (i <= 0)
      return r;
    else if (i < 18)
      k = 1;
    else if (i < 48)
      k = 3;
    else if (i < 144)
      k = 4;
    else if (i < 768)
      k = 5;
    else
      k = 6;
    if (i < 8)
      z = new Classic(m);
    else if (m.isEven())
      z = new Barrett(m);
    else
      z = new Montgomery(m);
    var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1) {
      var g2 = nbi();
      z.sqrTo(g[1], g2);
      while (n <= km) {
        g[n] = nbi();
        z.mulTo(g2, g[n - 2], g[n]);
        n += 2;
      }
    }
    var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
    i = nbits(e[j]) - 1;
    while (j >= 0) {
      if (i >= k1)
        w = e[j] >> i - k1 & km;
      else {
        w = (e[j] & (1 << i + 1) - 1) << k1 - i;
        if (j > 0)
          w |= e[j - 1] >> this.DB + i - k1;
      }
      n = k;
      while ((w & 1) === 0) {
        w >>= 1;
        --n;
      }
      if ((i -= n) < 0) {
        i += this.DB;
        --j;
      }
      if (is1) {
        g[w].copyTo(r);
        is1 = false;
      } else {
        while (n > 1) {
          z.sqrTo(r, r2);
          z.sqrTo(r2, r);
          n -= 2;
        }
        if (n > 0)
          z.sqrTo(r, r2);
        else {
          t = r;
          r = r2;
          r2 = t;
        }
        z.mulTo(r2, g[w], r);
      }
      while (j >= 0 && (e[j] & 1 << i) === 0) {
        z.sqrTo(r, r2);
        t = r;
        r = r2;
        r2 = t;
        if (--i < 0) {
          i = this.DB - 1;
          --j;
        }
      }
    }
    return z.revert(r);
  }
  function bnGCD(a) {
    var x = this.s < 0 ? this.negate() : this.clone();
    var y = a.s < 0 ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
      var t = x;
      x = y;
      y = t;
    }
    var i = x.getLowestSetBit(), g = y.getLowestSetBit();
    if (g < 0)
      return x;
    if (i < g)
      g = i;
    if (g > 0) {
      x.rShiftTo(g, x);
      y.rShiftTo(g, y);
    }
    while (x.signum() > 0) {
      if ((i = x.getLowestSetBit()) > 0)
        x.rShiftTo(i, x);
      if ((i = y.getLowestSetBit()) > 0)
        y.rShiftTo(i, y);
      if (x.compareTo(y) >= 0) {
        x.subTo(y, x);
        x.rShiftTo(1, x);
      } else {
        y.subTo(x, y);
        y.rShiftTo(1, y);
      }
    }
    if (g > 0)
      y.lShiftTo(g, y);
    return y;
  }
  function bnpModInt(n) {
    if (n <= 0)
      return 0;
    var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
    if (this.t > 0)
      if (d === 0)
        r = this[0] % n;
      else
        for (var i = this.t - 1; i >= 0; --i)
          r = (d * r + this[i]) % n;
    return r;
  }
  function bnModInverse(m) {
    var ac = m.isEven();
    if (this.isEven() && ac || m.signum() === 0)
      return BigInteger.ZERO;
    var u = m.clone(), v = this.clone();
    var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
    while (u.signum() != 0) {
      while (u.isEven()) {
        u.rShiftTo(1, u);
        if (ac) {
          if (!a.isEven() || !b.isEven()) {
            a.addTo(this, a);
            b.subTo(m, b);
          }
          a.rShiftTo(1, a);
        } else if (!b.isEven())
          b.subTo(m, b);
        b.rShiftTo(1, b);
      }
      while (v.isEven()) {
        v.rShiftTo(1, v);
        if (ac) {
          if (!c.isEven() || !d.isEven()) {
            c.addTo(this, c);
            d.subTo(m, d);
          }
          c.rShiftTo(1, c);
        } else if (!d.isEven())
          d.subTo(m, d);
        d.rShiftTo(1, d);
      }
      if (u.compareTo(v) >= 0) {
        u.subTo(v, u);
        if (ac)
          a.subTo(c, a);
        b.subTo(d, b);
      } else {
        v.subTo(u, v);
        if (ac)
          c.subTo(a, c);
        d.subTo(b, d);
      }
    }
    if (v.compareTo(BigInteger.ONE) != 0)
      return BigInteger.ZERO;
    if (d.compareTo(m) >= 0)
      return d.subtract(m);
    if (d.signum() < 0)
      d.addTo(m, d);
    else
      return d;
    if (d.signum() < 0)
      return d.add(m);
    else
      return d;
  }
  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
  var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
  function bnIsProbablePrime(t) {
    var i, x = this.abs();
    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
      for (i = 0; i < lowprimes.length; ++i)
        if (x[0] == lowprimes[i])
          return true;
      return false;
    }
    if (x.isEven())
      return false;
    i = 1;
    while (i < lowprimes.length) {
      var m = lowprimes[i], j = i + 1;
      while (j < lowprimes.length && m < lplim)
        m *= lowprimes[j++];
      m = x.modInt(m);
      while (i < j)
        if (m % lowprimes[i++] === 0)
          return false;
    }
    return x.millerRabin(t);
  }
  function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0)
      return false;
    var r = n1.shiftRight(k);
    t = t + 1 >> 1;
    if (t > lowprimes.length)
      t = lowprimes.length;
    var a = nbi();
    for (var i = 0; i < t; ++i) {
      a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
      var y = a.modPow(r, this);
      if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
        var j = 1;
        while (j++ < k && y.compareTo(n1) != 0) {
          y = y.modPowInt(2, this);
          if (y.compareTo(BigInteger.ONE) === 0)
            return false;
        }
        if (y.compareTo(n1) != 0)
          return false;
      }
    }
    return true;
  }
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.fromByteArray = bnpFromByteArray;
  BigInteger.prototype.fromBuffer = bnpFromBuffer;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin;
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.toBuffer = bnToBuffer;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
  BigInteger.int2char = int2char;
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  BigInteger.prototype.square = bnSquare;
  module.exports = BigInteger;
});

// node_modules/node-rsa/src/schemes/pkcs1.js
var require_pkcs1 = __commonJS((exports, module) => {
  var BigInteger = require_jsbn();
  var crypt = require("crypto");
  var constants2 = require("constants");
  var SIGN_INFO_HEAD = {
    md2: Buffer.from("3020300c06082a864886f70d020205000410", "hex"),
    md5: Buffer.from("3020300c06082a864886f70d020505000410", "hex"),
    sha1: Buffer.from("3021300906052b0e03021a05000414", "hex"),
    sha224: Buffer.from("302d300d06096086480165030402040500041c", "hex"),
    sha256: Buffer.from("3031300d060960864801650304020105000420", "hex"),
    sha384: Buffer.from("3041300d060960864801650304020205000430", "hex"),
    sha512: Buffer.from("3051300d060960864801650304020305000440", "hex"),
    ripemd160: Buffer.from("3021300906052b2403020105000414", "hex"),
    rmd160: Buffer.from("3021300906052b2403020105000414", "hex")
  };
  var SIGN_ALG_TO_HASH_ALIASES = {
    ripemd160: "rmd160"
  };
  var DEFAULT_HASH_FUNCTION = "sha256";
  module.exports = {
    isEncryption: true,
    isSignature: true
  };
  module.exports.makeScheme = function(key, options) {
    function Scheme(key2, options2) {
      this.key = key2;
      this.options = options2;
    }
    Scheme.prototype.maxMessageLength = function() {
      if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == constants2.RSA_NO_PADDING) {
        return this.key.encryptedDataLength;
      }
      return this.key.encryptedDataLength - 11;
    };
    Scheme.prototype.encPad = function(buffer, options2) {
      options2 = options2 || {};
      var filled;
      if (buffer.length > this.key.maxMessageLength) {
        throw new Error("Message too long for RSA (n=" + this.key.encryptedDataLength + ", l=" + buffer.length + ")");
      }
      if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == constants2.RSA_NO_PADDING) {
        filled = Buffer.alloc(this.key.maxMessageLength - buffer.length);
        filled.fill(0);
        return Buffer.concat([filled, buffer]);
      }
      if (options2.type === 1) {
        filled = Buffer.alloc(this.key.encryptedDataLength - buffer.length - 1);
        filled.fill(255, 0, filled.length - 1);
        filled[0] = 1;
        filled[filled.length - 1] = 0;
        return Buffer.concat([filled, buffer]);
      } else {
        filled = Buffer.alloc(this.key.encryptedDataLength - buffer.length);
        filled[0] = 0;
        filled[1] = 2;
        var rand = crypt.randomBytes(filled.length - 3);
        for (var i = 0; i < rand.length; i++) {
          var r = rand[i];
          while (r === 0) {
            r = crypt.randomBytes(1)[0];
          }
          filled[i + 2] = r;
        }
        filled[filled.length - 1] = 0;
        return Buffer.concat([filled, buffer]);
      }
    };
    Scheme.prototype.encUnPad = function(buffer, options2) {
      options2 = options2 || {};
      var i = 0;
      if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == constants2.RSA_NO_PADDING) {
        var unPad;
        if (typeof buffer.lastIndexOf == "function") {
          unPad = buffer.slice(buffer.lastIndexOf("\0") + 1, buffer.length);
        } else {
          unPad = buffer.slice(String.prototype.lastIndexOf.call(buffer, "\0") + 1, buffer.length);
        }
        return unPad;
      }
      if (buffer.length < 4) {
        return null;
      }
      if (options2.type === 1) {
        if (buffer[0] !== 0 || buffer[1] !== 1) {
          return null;
        }
        i = 3;
        while (buffer[i] !== 0) {
          if (buffer[i] != 255 || ++i >= buffer.length) {
            return null;
          }
        }
      } else {
        if (buffer[0] !== 0 || buffer[1] !== 2) {
          return null;
        }
        i = 3;
        while (buffer[i] !== 0) {
          if (++i >= buffer.length) {
            return null;
          }
        }
      }
      return buffer.slice(i + 1, buffer.length);
    };
    Scheme.prototype.sign = function(buffer) {
      var hashAlgorithm = this.options.signingSchemeOptions.hash || DEFAULT_HASH_FUNCTION;
      if (this.options.environment === "browser") {
        hashAlgorithm = SIGN_ALG_TO_HASH_ALIASES[hashAlgorithm] || hashAlgorithm;
        var hasher = crypt.createHash(hashAlgorithm);
        hasher.update(buffer);
        var hash = this.pkcs1pad(hasher.digest(), hashAlgorithm);
        var res = this.key.$doPrivate(new BigInteger(hash)).toBuffer(this.key.encryptedDataLength);
        return res;
      } else {
        var signer = crypt.createSign("RSA-" + hashAlgorithm.toUpperCase());
        signer.update(buffer);
        return signer.sign(this.options.rsaUtils.exportKey("private"));
      }
    };
    Scheme.prototype.verify = function(buffer, signature, signature_encoding) {
      if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == constants2.RSA_NO_PADDING) {
        return false;
      }
      var hashAlgorithm = this.options.signingSchemeOptions.hash || DEFAULT_HASH_FUNCTION;
      if (this.options.environment === "browser") {
        hashAlgorithm = SIGN_ALG_TO_HASH_ALIASES[hashAlgorithm] || hashAlgorithm;
        if (signature_encoding) {
          signature = Buffer.from(signature, signature_encoding);
        }
        var hasher = crypt.createHash(hashAlgorithm);
        hasher.update(buffer);
        var hash = this.pkcs1pad(hasher.digest(), hashAlgorithm);
        var m = this.key.$doPublic(new BigInteger(signature));
        return m.toBuffer().toString("hex") == hash.toString("hex");
      } else {
        var verifier = crypt.createVerify("RSA-" + hashAlgorithm.toUpperCase());
        verifier.update(buffer);
        return verifier.verify(this.options.rsaUtils.exportKey("public"), signature, signature_encoding);
      }
    };
    Scheme.prototype.pkcs0pad = function(buffer) {
      var filled = Buffer.alloc(this.key.maxMessageLength - buffer.length);
      filled.fill(0);
      return Buffer.concat([filled, buffer]);
    };
    Scheme.prototype.pkcs0unpad = function(buffer) {
      var unPad;
      if (typeof buffer.lastIndexOf == "function") {
        unPad = buffer.slice(buffer.lastIndexOf("\0") + 1, buffer.length);
      } else {
        unPad = buffer.slice(String.prototype.lastIndexOf.call(buffer, "\0") + 1, buffer.length);
      }
      return unPad;
    };
    Scheme.prototype.pkcs1pad = function(hashBuf, hashAlgorithm) {
      var digest = SIGN_INFO_HEAD[hashAlgorithm];
      if (!digest) {
        throw Error("Unsupported hash algorithm");
      }
      var data = Buffer.concat([digest, hashBuf]);
      if (data.length + 10 > this.key.encryptedDataLength) {
        throw Error("Key is too short for signing algorithm (" + hashAlgorithm + ")");
      }
      var filled = Buffer.alloc(this.key.encryptedDataLength - data.length - 1);
      filled.fill(255, 0, filled.length - 1);
      filled[0] = 1;
      filled[filled.length - 1] = 0;
      var res = Buffer.concat([filled, data]);
      return res;
    };
    return new Scheme(key, options);
  };
});

// node_modules/node-rsa/src/schemes/oaep.js
var require_oaep = __commonJS((exports, module) => {
  var BigInteger = require_jsbn();
  var crypt = require("crypto");
  module.exports = {
    isEncryption: true,
    isSignature: false
  };
  module.exports.digestLength = {
    md4: 16,
    md5: 16,
    ripemd160: 20,
    rmd160: 20,
    sha1: 20,
    sha224: 28,
    sha256: 32,
    sha384: 48,
    sha512: 64
  };
  var DEFAULT_HASH_FUNCTION = "sha1";
  module.exports.eme_oaep_mgf1 = function(seed, maskLength, hashFunction) {
    hashFunction = hashFunction || DEFAULT_HASH_FUNCTION;
    var hLen = module.exports.digestLength[hashFunction];
    var count = Math.ceil(maskLength / hLen);
    var T = Buffer.alloc(hLen * count);
    var c = Buffer.alloc(4);
    for (var i = 0; i < count; ++i) {
      var hash = crypt.createHash(hashFunction);
      hash.update(seed);
      c.writeUInt32BE(i, 0);
      hash.update(c);
      hash.digest().copy(T, i * hLen);
    }
    return T.slice(0, maskLength);
  };
  module.exports.makeScheme = function(key, options) {
    function Scheme(key2, options2) {
      this.key = key2;
      this.options = options2;
    }
    Scheme.prototype.maxMessageLength = function() {
      return this.key.encryptedDataLength - 2 * module.exports.digestLength[this.options.encryptionSchemeOptions.hash || DEFAULT_HASH_FUNCTION] - 2;
    };
    Scheme.prototype.encPad = function(buffer) {
      var hash = this.options.encryptionSchemeOptions.hash || DEFAULT_HASH_FUNCTION;
      var mgf = this.options.encryptionSchemeOptions.mgf || module.exports.eme_oaep_mgf1;
      var label = this.options.encryptionSchemeOptions.label || Buffer.alloc(0);
      var emLen = this.key.encryptedDataLength;
      var hLen = module.exports.digestLength[hash];
      if (buffer.length > emLen - 2 * hLen - 2) {
        throw new Error("Message is too long to encode into an encoded message with a length of " + emLen + " bytes, increaseemLen to fix this error (minimum value for given parameters and options: " + (emLen - 2 * hLen - 2) + ")");
      }
      var lHash = crypt.createHash(hash);
      lHash.update(label);
      lHash = lHash.digest();
      var PS = Buffer.alloc(emLen - buffer.length - 2 * hLen - 1);
      PS.fill(0);
      PS[PS.length - 1] = 1;
      var DB = Buffer.concat([lHash, PS, buffer]);
      var seed = crypt.randomBytes(hLen);
      var mask = mgf(seed, DB.length, hash);
      for (var i = 0; i < DB.length; i++) {
        DB[i] ^= mask[i];
      }
      mask = mgf(DB, hLen, hash);
      for (i = 0; i < seed.length; i++) {
        seed[i] ^= mask[i];
      }
      var em = Buffer.alloc(1 + seed.length + DB.length);
      em[0] = 0;
      seed.copy(em, 1);
      DB.copy(em, 1 + seed.length);
      return em;
    };
    Scheme.prototype.encUnPad = function(buffer) {
      var hash = this.options.encryptionSchemeOptions.hash || DEFAULT_HASH_FUNCTION;
      var mgf = this.options.encryptionSchemeOptions.mgf || module.exports.eme_oaep_mgf1;
      var label = this.options.encryptionSchemeOptions.label || Buffer.alloc(0);
      var hLen = module.exports.digestLength[hash];
      if (buffer.length < 2 * hLen + 2) {
        throw new Error("Error decoding message, the supplied message is not long enough to be a valid OAEP encoded message");
      }
      var seed = buffer.slice(1, hLen + 1);
      var DB = buffer.slice(1 + hLen);
      var mask = mgf(DB, hLen, hash);
      for (var i = 0; i < seed.length; i++) {
        seed[i] ^= mask[i];
      }
      mask = mgf(seed, DB.length, hash);
      for (i = 0; i < DB.length; i++) {
        DB[i] ^= mask[i];
      }
      var lHash = crypt.createHash(hash);
      lHash.update(label);
      lHash = lHash.digest();
      var lHashEM = DB.slice(0, hLen);
      if (lHashEM.toString("hex") != lHash.toString("hex")) {
        throw new Error("Error decoding message, the lHash calculated from the label provided and the lHash in the encrypted data do not match.");
      }
      i = hLen;
      while (DB[i++] === 0 && i < DB.length)
        ;
      if (DB[i - 1] != 1) {
        throw new Error("Error decoding message, there is no padding message separator byte");
      }
      return DB.slice(i);
    };
    return new Scheme(key, options);
  };
});

// node_modules/node-rsa/src/schemes/pss.js
var require_pss = __commonJS((exports, module) => {
  var BigInteger = require_jsbn();
  var crypt = require("crypto");
  module.exports = {
    isEncryption: false,
    isSignature: true
  };
  var DEFAULT_HASH_FUNCTION = "sha1";
  var DEFAULT_SALT_LENGTH = 20;
  module.exports.makeScheme = function(key, options) {
    var OAEP = require_schemes().pkcs1_oaep;
    function Scheme(key2, options2) {
      this.key = key2;
      this.options = options2;
    }
    Scheme.prototype.sign = function(buffer) {
      var mHash = crypt.createHash(this.options.signingSchemeOptions.hash || DEFAULT_HASH_FUNCTION);
      mHash.update(buffer);
      var encoded = this.emsa_pss_encode(mHash.digest(), this.key.keySize - 1);
      return this.key.$doPrivate(new BigInteger(encoded)).toBuffer(this.key.encryptedDataLength);
    };
    Scheme.prototype.verify = function(buffer, signature, signature_encoding) {
      if (signature_encoding) {
        signature = Buffer.from(signature, signature_encoding);
      }
      signature = new BigInteger(signature);
      var emLen = Math.ceil((this.key.keySize - 1) / 8);
      var m = this.key.$doPublic(signature).toBuffer(emLen);
      var mHash = crypt.createHash(this.options.signingSchemeOptions.hash || DEFAULT_HASH_FUNCTION);
      mHash.update(buffer);
      return this.emsa_pss_verify(mHash.digest(), m, this.key.keySize - 1);
    };
    Scheme.prototype.emsa_pss_encode = function(mHash, emBits) {
      var hash = this.options.signingSchemeOptions.hash || DEFAULT_HASH_FUNCTION;
      var mgf = this.options.signingSchemeOptions.mgf || OAEP.eme_oaep_mgf1;
      var sLen = this.options.signingSchemeOptions.saltLength || DEFAULT_SALT_LENGTH;
      var hLen = OAEP.digestLength[hash];
      var emLen = Math.ceil(emBits / 8);
      if (emLen < hLen + sLen + 2) {
        throw new Error("Output length passed to emBits(" + emBits + ") is too small for the options specified(" + hash + ", " + sLen + "). To fix this issue increase the value of emBits. (minimum size: " + (8 * hLen + 8 * sLen + 9) + ")");
      }
      var salt = crypt.randomBytes(sLen);
      var Mapostrophe = Buffer.alloc(8 + hLen + sLen);
      Mapostrophe.fill(0, 0, 8);
      mHash.copy(Mapostrophe, 8);
      salt.copy(Mapostrophe, 8 + mHash.length);
      var H = crypt.createHash(hash);
      H.update(Mapostrophe);
      H = H.digest();
      var PS = Buffer.alloc(emLen - salt.length - hLen - 2);
      PS.fill(0);
      var DB = Buffer.alloc(PS.length + 1 + salt.length);
      PS.copy(DB);
      DB[PS.length] = 1;
      salt.copy(DB, PS.length + 1);
      var dbMask = mgf(H, DB.length, hash);
      var maskedDB = Buffer.alloc(DB.length);
      for (var i = 0; i < dbMask.length; i++) {
        maskedDB[i] = DB[i] ^ dbMask[i];
      }
      var bits = 8 * emLen - emBits;
      var mask = 255 ^ 255 >> 8 - bits << 8 - bits;
      maskedDB[0] = maskedDB[0] & mask;
      var EM = Buffer.alloc(maskedDB.length + H.length + 1);
      maskedDB.copy(EM, 0);
      H.copy(EM, maskedDB.length);
      EM[EM.length - 1] = 188;
      return EM;
    };
    Scheme.prototype.emsa_pss_verify = function(mHash, EM, emBits) {
      var hash = this.options.signingSchemeOptions.hash || DEFAULT_HASH_FUNCTION;
      var mgf = this.options.signingSchemeOptions.mgf || OAEP.eme_oaep_mgf1;
      var sLen = this.options.signingSchemeOptions.saltLength || DEFAULT_SALT_LENGTH;
      var hLen = OAEP.digestLength[hash];
      var emLen = Math.ceil(emBits / 8);
      if (emLen < hLen + sLen + 2 || EM[EM.length - 1] != 188) {
        return false;
      }
      var DB = Buffer.alloc(emLen - hLen - 1);
      EM.copy(DB, 0, 0, emLen - hLen - 1);
      var mask = 0;
      for (var i = 0, bits = 8 * emLen - emBits; i < bits; i++) {
        mask |= 1 << 7 - i;
      }
      if ((DB[0] & mask) !== 0) {
        return false;
      }
      var H = EM.slice(emLen - hLen - 1, emLen - 1);
      var dbMask = mgf(H, DB.length, hash);
      for (i = 0; i < DB.length; i++) {
        DB[i] ^= dbMask[i];
      }
      bits = 8 * emLen - emBits;
      mask = 255 ^ 255 >> 8 - bits << 8 - bits;
      DB[0] = DB[0] & mask;
      for (i = 0; DB[i] === 0 && i < DB.length; i++)
        ;
      if (DB[i] != 1) {
        return false;
      }
      var salt = DB.slice(DB.length - sLen);
      var Mapostrophe = Buffer.alloc(8 + hLen + sLen);
      Mapostrophe.fill(0, 0, 8);
      mHash.copy(Mapostrophe, 8);
      salt.copy(Mapostrophe, 8 + mHash.length);
      var Hapostrophe = crypt.createHash(hash);
      Hapostrophe.update(Mapostrophe);
      Hapostrophe = Hapostrophe.digest();
      return H.toString("hex") === Hapostrophe.toString("hex");
    };
    return new Scheme(key, options);
  };
});

// node_modules/node-rsa/src/schemes/schemes.js
var require_schemes = __commonJS((exports, module) => {
  module.exports = {
    pkcs1: require_pkcs1(),
    pkcs1_oaep: require_oaep(),
    pss: require_pss(),
    isEncryption: function(scheme) {
      return module.exports[scheme] && module.exports[scheme].isEncryption;
    },
    isSignature: function(scheme) {
      return module.exports[scheme] && module.exports[scheme].isSignature;
    }
  };
});

// node_modules/node-rsa/src/encryptEngines/js.js
var require_js = __commonJS((exports, module) => {
  var BigInteger = require_jsbn();
  var schemes = require_schemes();
  module.exports = function(keyPair, options) {
    var pkcs1Scheme = schemes.pkcs1.makeScheme(keyPair, options);
    return {
      encrypt: function(buffer, usePrivate) {
        var m, c;
        if (usePrivate) {
          m = new BigInteger(pkcs1Scheme.encPad(buffer, {type: 1}));
          c = keyPair.$doPrivate(m);
        } else {
          m = new BigInteger(keyPair.encryptionScheme.encPad(buffer));
          c = keyPair.$doPublic(m);
        }
        return c.toBuffer(keyPair.encryptedDataLength);
      },
      decrypt: function(buffer, usePublic) {
        var m, c = new BigInteger(buffer);
        if (usePublic) {
          m = keyPair.$doPublic(c);
          return pkcs1Scheme.encUnPad(m.toBuffer(keyPair.encryptedDataLength), {type: 1});
        } else {
          m = keyPair.$doPrivate(c);
          return keyPair.encryptionScheme.encUnPad(m.toBuffer(keyPair.encryptedDataLength));
        }
      }
    };
  };
});

// node_modules/node-rsa/src/encryptEngines/io.js
var require_io = __commonJS((exports, module) => {
  var crypto = require("crypto");
  var constants2 = require("constants");
  var schemes = require_schemes();
  module.exports = function(keyPair, options) {
    var pkcs1Scheme = schemes.pkcs1.makeScheme(keyPair, options);
    return {
      encrypt: function(buffer, usePrivate) {
        var padding;
        if (usePrivate) {
          padding = constants2.RSA_PKCS1_PADDING;
          if (options.encryptionSchemeOptions && options.encryptionSchemeOptions.padding) {
            padding = options.encryptionSchemeOptions.padding;
          }
          return crypto.privateEncrypt({
            key: options.rsaUtils.exportKey("private"),
            padding
          }, buffer);
        } else {
          padding = constants2.RSA_PKCS1_OAEP_PADDING;
          if (options.encryptionScheme === "pkcs1") {
            padding = constants2.RSA_PKCS1_PADDING;
          }
          if (options.encryptionSchemeOptions && options.encryptionSchemeOptions.padding) {
            padding = options.encryptionSchemeOptions.padding;
          }
          var data = buffer;
          if (padding === constants2.RSA_NO_PADDING) {
            data = pkcs1Scheme.pkcs0pad(buffer);
          }
          return crypto.publicEncrypt({
            key: options.rsaUtils.exportKey("public"),
            padding
          }, data);
        }
      },
      decrypt: function(buffer, usePublic) {
        var padding;
        if (usePublic) {
          padding = constants2.RSA_PKCS1_PADDING;
          if (options.encryptionSchemeOptions && options.encryptionSchemeOptions.padding) {
            padding = options.encryptionSchemeOptions.padding;
          }
          return crypto.publicDecrypt({
            key: options.rsaUtils.exportKey("public"),
            padding
          }, buffer);
        } else {
          padding = constants2.RSA_PKCS1_OAEP_PADDING;
          if (options.encryptionScheme === "pkcs1") {
            padding = constants2.RSA_PKCS1_PADDING;
          }
          if (options.encryptionSchemeOptions && options.encryptionSchemeOptions.padding) {
            padding = options.encryptionSchemeOptions.padding;
          }
          var res = crypto.privateDecrypt({
            key: options.rsaUtils.exportKey("private"),
            padding
          }, buffer);
          if (padding === constants2.RSA_NO_PADDING) {
            return pkcs1Scheme.pkcs0unpad(res);
          }
          return res;
        }
      }
    };
  };
});

// node_modules/node-rsa/src/encryptEngines/node12.js
var require_node12 = __commonJS((exports, module) => {
  var crypto = require("crypto");
  var constants2 = require("constants");
  var schemes = require_schemes();
  module.exports = function(keyPair, options) {
    var jsEngine = require_js()(keyPair, options);
    var pkcs1Scheme = schemes.pkcs1.makeScheme(keyPair, options);
    return {
      encrypt: function(buffer, usePrivate) {
        if (usePrivate) {
          return jsEngine.encrypt(buffer, usePrivate);
        }
        var padding = constants2.RSA_PKCS1_OAEP_PADDING;
        if (options.encryptionScheme === "pkcs1") {
          padding = constants2.RSA_PKCS1_PADDING;
        }
        if (options.encryptionSchemeOptions && options.encryptionSchemeOptions.padding) {
          padding = options.encryptionSchemeOptions.padding;
        }
        var data = buffer;
        if (padding === constants2.RSA_NO_PADDING) {
          data = pkcs1Scheme.pkcs0pad(buffer);
        }
        return crypto.publicEncrypt({
          key: options.rsaUtils.exportKey("public"),
          padding
        }, data);
      },
      decrypt: function(buffer, usePublic) {
        if (usePublic) {
          return jsEngine.decrypt(buffer, usePublic);
        }
        var padding = constants2.RSA_PKCS1_OAEP_PADDING;
        if (options.encryptionScheme === "pkcs1") {
          padding = constants2.RSA_PKCS1_PADDING;
        }
        if (options.encryptionSchemeOptions && options.encryptionSchemeOptions.padding) {
          padding = options.encryptionSchemeOptions.padding;
        }
        var res = crypto.privateDecrypt({
          key: options.rsaUtils.exportKey("private"),
          padding
        }, buffer);
        if (padding === constants2.RSA_NO_PADDING) {
          return pkcs1Scheme.pkcs0unpad(res);
        }
        return res;
      }
    };
  };
});

// node_modules/node-rsa/src/encryptEngines/encryptEngines.js
var require_encryptEngines = __commonJS((exports, module) => {
  var crypt = require("crypto");
  module.exports = {
    getEngine: function(keyPair, options) {
      var engine = require_js();
      if (options.environment === "node") {
        if (typeof crypt.publicEncrypt === "function" && typeof crypt.privateDecrypt === "function") {
          if (typeof crypt.privateEncrypt === "function" && typeof crypt.publicDecrypt === "function") {
            engine = require_io();
          } else {
            engine = require_node12();
          }
        }
      }
      return engine(keyPair, options);
    }
  };
});

// node_modules/node-rsa/src/libs/rsa.js
var require_rsa = __commonJS((exports, module) => {
  var _ = require_utils2()._;
  var crypt = require("crypto");
  var BigInteger = require_jsbn();
  var utils = require_utils2();
  var schemes = require_schemes();
  var encryptEngines = require_encryptEngines();
  exports.BigInteger = BigInteger;
  module.exports.Key = function() {
    function RSAKey() {
      this.n = null;
      this.e = 0;
      this.d = null;
      this.p = null;
      this.q = null;
      this.dmp1 = null;
      this.dmq1 = null;
      this.coeff = null;
    }
    RSAKey.prototype.setOptions = function(options) {
      var signingSchemeProvider = schemes[options.signingScheme];
      var encryptionSchemeProvider = schemes[options.encryptionScheme];
      if (signingSchemeProvider === encryptionSchemeProvider) {
        this.signingScheme = this.encryptionScheme = encryptionSchemeProvider.makeScheme(this, options);
      } else {
        this.encryptionScheme = encryptionSchemeProvider.makeScheme(this, options);
        this.signingScheme = signingSchemeProvider.makeScheme(this, options);
      }
      this.encryptEngine = encryptEngines.getEngine(this, options);
    };
    RSAKey.prototype.generate = function(B, E) {
      var qs = B >> 1;
      this.e = parseInt(E, 16);
      var ee = new BigInteger(E, 16);
      while (true) {
        while (true) {
          this.p = new BigInteger(B - qs, 1);
          if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) === 0 && this.p.isProbablePrime(10))
            break;
        }
        while (true) {
          this.q = new BigInteger(qs, 1);
          if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) === 0 && this.q.isProbablePrime(10))
            break;
        }
        if (this.p.compareTo(this.q) <= 0) {
          var t = this.p;
          this.p = this.q;
          this.q = t;
        }
        var p1 = this.p.subtract(BigInteger.ONE);
        var q1 = this.q.subtract(BigInteger.ONE);
        var phi = p1.multiply(q1);
        if (phi.gcd(ee).compareTo(BigInteger.ONE) === 0) {
          this.n = this.p.multiply(this.q);
          if (this.n.bitLength() < B) {
            continue;
          }
          this.d = ee.modInverse(phi);
          this.dmp1 = this.d.mod(p1);
          this.dmq1 = this.d.mod(q1);
          this.coeff = this.q.modInverse(this.p);
          break;
        }
      }
      this.$$recalculateCache();
    };
    RSAKey.prototype.setPrivate = function(N, E, D, P, Q, DP, DQ, C) {
      if (N && E && D && N.length > 0 && (_.isNumber(E) || E.length > 0) && D.length > 0) {
        this.n = new BigInteger(N);
        this.e = _.isNumber(E) ? E : utils.get32IntFromBuffer(E, 0);
        this.d = new BigInteger(D);
        if (P && Q && DP && DQ && C) {
          this.p = new BigInteger(P);
          this.q = new BigInteger(Q);
          this.dmp1 = new BigInteger(DP);
          this.dmq1 = new BigInteger(DQ);
          this.coeff = new BigInteger(C);
        } else {
        }
        this.$$recalculateCache();
      } else {
        throw Error("Invalid RSA private key");
      }
    };
    RSAKey.prototype.setPublic = function(N, E) {
      if (N && E && N.length > 0 && (_.isNumber(E) || E.length > 0)) {
        this.n = new BigInteger(N);
        this.e = _.isNumber(E) ? E : utils.get32IntFromBuffer(E, 0);
        this.$$recalculateCache();
      } else {
        throw Error("Invalid RSA public key");
      }
    };
    RSAKey.prototype.$doPrivate = function(x) {
      if (this.p || this.q) {
        return x.modPow(this.d, this.n);
      }
      var xp = x.mod(this.p).modPow(this.dmp1, this.p);
      var xq = x.mod(this.q).modPow(this.dmq1, this.q);
      while (xp.compareTo(xq) < 0) {
        xp = xp.add(this.p);
      }
      return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    };
    RSAKey.prototype.$doPublic = function(x) {
      return x.modPowInt(this.e, this.n);
    };
    RSAKey.prototype.encrypt = function(buffer, usePrivate) {
      var buffers = [];
      var results = [];
      var bufferSize = buffer.length;
      var buffersCount = Math.ceil(bufferSize / this.maxMessageLength) || 1;
      var dividedSize = Math.ceil(bufferSize / buffersCount || 1);
      if (buffersCount == 1) {
        buffers.push(buffer);
      } else {
        for (var bufNum = 0; bufNum < buffersCount; bufNum++) {
          buffers.push(buffer.slice(bufNum * dividedSize, (bufNum + 1) * dividedSize));
        }
      }
      for (var i = 0; i < buffers.length; i++) {
        results.push(this.encryptEngine.encrypt(buffers[i], usePrivate));
      }
      return Buffer.concat(results);
    };
    RSAKey.prototype.decrypt = function(buffer, usePublic) {
      if (buffer.length % this.encryptedDataLength > 0) {
        throw Error("Incorrect data or key");
      }
      var result = [];
      var offset = 0;
      var length = 0;
      var buffersCount = buffer.length / this.encryptedDataLength;
      for (var i = 0; i < buffersCount; i++) {
        offset = i * this.encryptedDataLength;
        length = offset + this.encryptedDataLength;
        result.push(this.encryptEngine.decrypt(buffer.slice(offset, Math.min(length, buffer.length)), usePublic));
      }
      return Buffer.concat(result);
    };
    RSAKey.prototype.sign = function(buffer) {
      return this.signingScheme.sign.apply(this.signingScheme, arguments);
    };
    RSAKey.prototype.verify = function(buffer, signature, signature_encoding) {
      return this.signingScheme.verify.apply(this.signingScheme, arguments);
    };
    RSAKey.prototype.isPrivate = function() {
      return this.n && this.e && this.d && true || false;
    };
    RSAKey.prototype.isPublic = function(strict) {
      return this.n && this.e && !(strict && this.d) || false;
    };
    Object.defineProperty(RSAKey.prototype, "keySize", {
      get: function() {
        return this.cache.keyBitLength;
      }
    });
    Object.defineProperty(RSAKey.prototype, "encryptedDataLength", {
      get: function() {
        return this.cache.keyByteLength;
      }
    });
    Object.defineProperty(RSAKey.prototype, "maxMessageLength", {
      get: function() {
        return this.encryptionScheme.maxMessageLength();
      }
    });
    RSAKey.prototype.$$recalculateCache = function() {
      this.cache = this.cache || {};
      this.cache.keyBitLength = this.n.bitLength();
      this.cache.keyByteLength = this.cache.keyBitLength + 6 >> 3;
    };
    return RSAKey;
  }();
});

// node_modules/asn1/lib/ber/errors.js
var require_errors = __commonJS((exports, module) => {
  module.exports = {
    newInvalidAsn1Error: function(msg) {
      var e = new Error();
      e.name = "InvalidAsn1Error";
      e.message = msg || "";
      return e;
    }
  };
});

// node_modules/asn1/lib/ber/types.js
var require_types = __commonJS((exports, module) => {
  module.exports = {
    EOC: 0,
    Boolean: 1,
    Integer: 2,
    BitString: 3,
    OctetString: 4,
    Null: 5,
    OID: 6,
    ObjectDescriptor: 7,
    External: 8,
    Real: 9,
    Enumeration: 10,
    PDV: 11,
    Utf8String: 12,
    RelativeOID: 13,
    Sequence: 16,
    Set: 17,
    NumericString: 18,
    PrintableString: 19,
    T61String: 20,
    VideotexString: 21,
    IA5String: 22,
    UTCTime: 23,
    GeneralizedTime: 24,
    GraphicString: 25,
    VisibleString: 26,
    GeneralString: 28,
    UniversalString: 29,
    CharacterString: 30,
    BMPString: 31,
    Constructor: 32,
    Context: 128
  };
});

// node_modules/safer-buffer/safer.js
var require_safer = __commonJS((exports, module) => {
  "use strict";
  var buffer = require("buffer");
  var Buffer2 = buffer.Buffer;
  var safer = {};
  var key;
  for (key in buffer) {
    if (!buffer.hasOwnProperty(key))
      continue;
    if (key === "SlowBuffer" || key === "Buffer")
      continue;
    safer[key] = buffer[key];
  }
  var Safer = safer.Buffer = {};
  for (key in Buffer2) {
    if (!Buffer2.hasOwnProperty(key))
      continue;
    if (key === "allocUnsafe" || key === "allocUnsafeSlow")
      continue;
    Safer[key] = Buffer2[key];
  }
  safer.Buffer.prototype = Buffer2.prototype;
  if (!Safer.from || Safer.from === Uint8Array.from) {
    Safer.from = function(value, encodingOrOffset, length) {
      if (typeof value === "number") {
        throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value);
      }
      if (value && typeof value.length === "undefined") {
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
      }
      return Buffer2(value, encodingOrOffset, length);
    };
  }
  if (!Safer.alloc) {
    Safer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size);
      }
      if (size < 0 || size >= 2 * (1 << 30)) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
      var buf = Buffer2(size);
      if (!fill || fill.length === 0) {
        buf.fill(0);
      } else if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
      return buf;
    };
  }
  if (!safer.kStringMaxLength) {
    try {
      safer.kStringMaxLength = process.binding("buffer").kStringMaxLength;
    } catch (e) {
    }
  }
  if (!safer.constants) {
    safer.constants = {
      MAX_LENGTH: safer.kMaxLength
    };
    if (safer.kStringMaxLength) {
      safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength;
    }
  }
  module.exports = safer;
});

// node_modules/asn1/lib/ber/reader.js
var require_reader = __commonJS((exports, module) => {
  var assert = require("assert");
  var Buffer2 = require_safer().Buffer;
  var ASN1 = require_types();
  var errors = require_errors();
  var newInvalidAsn1Error = errors.newInvalidAsn1Error;
  function Reader(data) {
    if (!data || !Buffer2.isBuffer(data))
      throw new TypeError("data must be a node Buffer");
    this._buf = data;
    this._size = data.length;
    this._len = 0;
    this._offset = 0;
  }
  Object.defineProperty(Reader.prototype, "length", {
    enumerable: true,
    get: function() {
      return this._len;
    }
  });
  Object.defineProperty(Reader.prototype, "offset", {
    enumerable: true,
    get: function() {
      return this._offset;
    }
  });
  Object.defineProperty(Reader.prototype, "remain", {
    get: function() {
      return this._size - this._offset;
    }
  });
  Object.defineProperty(Reader.prototype, "buffer", {
    get: function() {
      return this._buf.slice(this._offset);
    }
  });
  Reader.prototype.readByte = function(peek) {
    if (this._size - this._offset < 1)
      return null;
    var b = this._buf[this._offset] & 255;
    if (!peek)
      this._offset += 1;
    return b;
  };
  Reader.prototype.peek = function() {
    return this.readByte(true);
  };
  Reader.prototype.readLength = function(offset) {
    if (offset === void 0)
      offset = this._offset;
    if (offset >= this._size)
      return null;
    var lenB = this._buf[offset++] & 255;
    if (lenB === null)
      return null;
    if ((lenB & 128) === 128) {
      lenB &= 127;
      if (lenB === 0)
        throw newInvalidAsn1Error("Indefinite length not supported");
      if (lenB > 4)
        throw newInvalidAsn1Error("encoding too long");
      if (this._size - offset < lenB)
        return null;
      this._len = 0;
      for (var i = 0; i < lenB; i++)
        this._len = (this._len << 8) + (this._buf[offset++] & 255);
    } else {
      this._len = lenB;
    }
    return offset;
  };
  Reader.prototype.readSequence = function(tag) {
    var seq = this.peek();
    if (seq === null)
      return null;
    if (tag !== void 0 && tag !== seq)
      throw newInvalidAsn1Error("Expected 0x" + tag.toString(16) + ": got 0x" + seq.toString(16));
    var o = this.readLength(this._offset + 1);
    if (o === null)
      return null;
    this._offset = o;
    return seq;
  };
  Reader.prototype.readInt = function() {
    return this._readTag(ASN1.Integer);
  };
  Reader.prototype.readBoolean = function() {
    return this._readTag(ASN1.Boolean) === 0 ? false : true;
  };
  Reader.prototype.readEnumeration = function() {
    return this._readTag(ASN1.Enumeration);
  };
  Reader.prototype.readString = function(tag, retbuf) {
    if (!tag)
      tag = ASN1.OctetString;
    var b = this.peek();
    if (b === null)
      return null;
    if (b !== tag)
      throw newInvalidAsn1Error("Expected 0x" + tag.toString(16) + ": got 0x" + b.toString(16));
    var o = this.readLength(this._offset + 1);
    if (o === null)
      return null;
    if (this.length > this._size - o)
      return null;
    this._offset = o;
    if (this.length === 0)
      return retbuf ? Buffer2.alloc(0) : "";
    var str = this._buf.slice(this._offset, this._offset + this.length);
    this._offset += this.length;
    return retbuf ? str : str.toString("utf8");
  };
  Reader.prototype.readOID = function(tag) {
    if (!tag)
      tag = ASN1.OID;
    var b = this.readString(tag, true);
    if (b === null)
      return null;
    var values = [];
    var value = 0;
    for (var i = 0; i < b.length; i++) {
      var byte = b[i] & 255;
      value <<= 7;
      value += byte & 127;
      if ((byte & 128) === 0) {
        values.push(value);
        value = 0;
      }
    }
    value = values.shift();
    values.unshift(value % 40);
    values.unshift(value / 40 >> 0);
    return values.join(".");
  };
  Reader.prototype._readTag = function(tag) {
    assert.ok(tag !== void 0);
    var b = this.peek();
    if (b === null)
      return null;
    if (b !== tag)
      throw newInvalidAsn1Error("Expected 0x" + tag.toString(16) + ": got 0x" + b.toString(16));
    var o = this.readLength(this._offset + 1);
    if (o === null)
      return null;
    if (this.length > 4)
      throw newInvalidAsn1Error("Integer too long: " + this.length);
    if (this.length > this._size - o)
      return null;
    this._offset = o;
    var fb = this._buf[this._offset];
    var value = 0;
    for (var i = 0; i < this.length; i++) {
      value <<= 8;
      value |= this._buf[this._offset++] & 255;
    }
    if ((fb & 128) === 128 && i !== 4)
      value -= 1 << i * 8;
    return value >> 0;
  };
  module.exports = Reader;
});

// node_modules/asn1/lib/ber/writer.js
var require_writer = __commonJS((exports, module) => {
  var assert = require("assert");
  var Buffer2 = require_safer().Buffer;
  var ASN1 = require_types();
  var errors = require_errors();
  var newInvalidAsn1Error = errors.newInvalidAsn1Error;
  var DEFAULT_OPTS = {
    size: 1024,
    growthFactor: 8
  };
  function merge(from, to) {
    assert.ok(from);
    assert.equal(typeof from, "object");
    assert.ok(to);
    assert.equal(typeof to, "object");
    var keys = Object.getOwnPropertyNames(from);
    keys.forEach(function(key) {
      if (to[key])
        return;
      var value = Object.getOwnPropertyDescriptor(from, key);
      Object.defineProperty(to, key, value);
    });
    return to;
  }
  function Writer(options) {
    options = merge(DEFAULT_OPTS, options || {});
    this._buf = Buffer2.alloc(options.size || 1024);
    this._size = this._buf.length;
    this._offset = 0;
    this._options = options;
    this._seq = [];
  }
  Object.defineProperty(Writer.prototype, "buffer", {
    get: function() {
      if (this._seq.length)
        throw newInvalidAsn1Error(this._seq.length + " unended sequence(s)");
      return this._buf.slice(0, this._offset);
    }
  });
  Writer.prototype.writeByte = function(b) {
    if (typeof b !== "number")
      throw new TypeError("argument must be a Number");
    this._ensure(1);
    this._buf[this._offset++] = b;
  };
  Writer.prototype.writeInt = function(i, tag) {
    if (typeof i !== "number")
      throw new TypeError("argument must be a Number");
    if (typeof tag !== "number")
      tag = ASN1.Integer;
    var sz = 4;
    while (((i & 4286578688) === 0 || (i & 4286578688) === 4286578688 >> 0) && sz > 1) {
      sz--;
      i <<= 8;
    }
    if (sz > 4)
      throw newInvalidAsn1Error("BER ints cannot be > 0xffffffff");
    this._ensure(2 + sz);
    this._buf[this._offset++] = tag;
    this._buf[this._offset++] = sz;
    while (sz-- > 0) {
      this._buf[this._offset++] = (i & 4278190080) >>> 24;
      i <<= 8;
    }
  };
  Writer.prototype.writeNull = function() {
    this.writeByte(ASN1.Null);
    this.writeByte(0);
  };
  Writer.prototype.writeEnumeration = function(i, tag) {
    if (typeof i !== "number")
      throw new TypeError("argument must be a Number");
    if (typeof tag !== "number")
      tag = ASN1.Enumeration;
    return this.writeInt(i, tag);
  };
  Writer.prototype.writeBoolean = function(b, tag) {
    if (typeof b !== "boolean")
      throw new TypeError("argument must be a Boolean");
    if (typeof tag !== "number")
      tag = ASN1.Boolean;
    this._ensure(3);
    this._buf[this._offset++] = tag;
    this._buf[this._offset++] = 1;
    this._buf[this._offset++] = b ? 255 : 0;
  };
  Writer.prototype.writeString = function(s, tag) {
    if (typeof s !== "string")
      throw new TypeError("argument must be a string (was: " + typeof s + ")");
    if (typeof tag !== "number")
      tag = ASN1.OctetString;
    var len = Buffer2.byteLength(s);
    this.writeByte(tag);
    this.writeLength(len);
    if (len) {
      this._ensure(len);
      this._buf.write(s, this._offset);
      this._offset += len;
    }
  };
  Writer.prototype.writeBuffer = function(buf, tag) {
    if (typeof tag !== "number")
      throw new TypeError("tag must be a number");
    if (!Buffer2.isBuffer(buf))
      throw new TypeError("argument must be a buffer");
    this.writeByte(tag);
    this.writeLength(buf.length);
    this._ensure(buf.length);
    buf.copy(this._buf, this._offset, 0, buf.length);
    this._offset += buf.length;
  };
  Writer.prototype.writeStringArray = function(strings) {
    if (!strings instanceof Array)
      throw new TypeError("argument must be an Array[String]");
    var self = this;
    strings.forEach(function(s) {
      self.writeString(s);
    });
  };
  Writer.prototype.writeOID = function(s, tag) {
    if (typeof s !== "string")
      throw new TypeError("argument must be a string");
    if (typeof tag !== "number")
      tag = ASN1.OID;
    if (!/^([0-9]+\.){3,}[0-9]+$/.test(s))
      throw new Error("argument is not a valid OID string");
    function encodeOctet(bytes2, octet) {
      if (octet < 128) {
        bytes2.push(octet);
      } else if (octet < 16384) {
        bytes2.push(octet >>> 7 | 128);
        bytes2.push(octet & 127);
      } else if (octet < 2097152) {
        bytes2.push(octet >>> 14 | 128);
        bytes2.push((octet >>> 7 | 128) & 255);
        bytes2.push(octet & 127);
      } else if (octet < 268435456) {
        bytes2.push(octet >>> 21 | 128);
        bytes2.push((octet >>> 14 | 128) & 255);
        bytes2.push((octet >>> 7 | 128) & 255);
        bytes2.push(octet & 127);
      } else {
        bytes2.push((octet >>> 28 | 128) & 255);
        bytes2.push((octet >>> 21 | 128) & 255);
        bytes2.push((octet >>> 14 | 128) & 255);
        bytes2.push((octet >>> 7 | 128) & 255);
        bytes2.push(octet & 127);
      }
    }
    var tmp = s.split(".");
    var bytes = [];
    bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
    tmp.slice(2).forEach(function(b) {
      encodeOctet(bytes, parseInt(b, 10));
    });
    var self = this;
    this._ensure(2 + bytes.length);
    this.writeByte(tag);
    this.writeLength(bytes.length);
    bytes.forEach(function(b) {
      self.writeByte(b);
    });
  };
  Writer.prototype.writeLength = function(len) {
    if (typeof len !== "number")
      throw new TypeError("argument must be a Number");
    this._ensure(4);
    if (len <= 127) {
      this._buf[this._offset++] = len;
    } else if (len <= 255) {
      this._buf[this._offset++] = 129;
      this._buf[this._offset++] = len;
    } else if (len <= 65535) {
      this._buf[this._offset++] = 130;
      this._buf[this._offset++] = len >> 8;
      this._buf[this._offset++] = len;
    } else if (len <= 16777215) {
      this._buf[this._offset++] = 131;
      this._buf[this._offset++] = len >> 16;
      this._buf[this._offset++] = len >> 8;
      this._buf[this._offset++] = len;
    } else {
      throw newInvalidAsn1Error("Length too long (> 4 bytes)");
    }
  };
  Writer.prototype.startSequence = function(tag) {
    if (typeof tag !== "number")
      tag = ASN1.Sequence | ASN1.Constructor;
    this.writeByte(tag);
    this._seq.push(this._offset);
    this._ensure(3);
    this._offset += 3;
  };
  Writer.prototype.endSequence = function() {
    var seq = this._seq.pop();
    var start = seq + 3;
    var len = this._offset - start;
    if (len <= 127) {
      this._shift(start, len, -2);
      this._buf[seq] = len;
    } else if (len <= 255) {
      this._shift(start, len, -1);
      this._buf[seq] = 129;
      this._buf[seq + 1] = len;
    } else if (len <= 65535) {
      this._buf[seq] = 130;
      this._buf[seq + 1] = len >> 8;
      this._buf[seq + 2] = len;
    } else if (len <= 16777215) {
      this._shift(start, len, 1);
      this._buf[seq] = 131;
      this._buf[seq + 1] = len >> 16;
      this._buf[seq + 2] = len >> 8;
      this._buf[seq + 3] = len;
    } else {
      throw newInvalidAsn1Error("Sequence too long");
    }
  };
  Writer.prototype._shift = function(start, len, shift) {
    assert.ok(start !== void 0);
    assert.ok(len !== void 0);
    assert.ok(shift);
    this._buf.copy(this._buf, start + shift, start, start + len);
    this._offset += shift;
  };
  Writer.prototype._ensure = function(len) {
    assert.ok(len);
    if (this._size - this._offset < len) {
      var sz = this._size * this._options.growthFactor;
      if (sz - this._offset < len)
        sz += len;
      var buf = Buffer2.alloc(sz);
      this._buf.copy(buf, 0, 0, this._offset);
      this._buf = buf;
      this._size = sz;
    }
  };
  module.exports = Writer;
});

// node_modules/asn1/lib/ber/index.js
var require_ber = __commonJS((exports, module) => {
  var errors = require_errors();
  var types2 = require_types();
  var Reader = require_reader();
  var Writer = require_writer();
  module.exports = {
    Reader,
    Writer
  };
  for (var t in types2) {
    if (types2.hasOwnProperty(t))
      module.exports[t] = types2[t];
  }
  for (var e in errors) {
    if (errors.hasOwnProperty(e))
      module.exports[e] = errors[e];
  }
});

// node_modules/asn1/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var Ber = require_ber();
  module.exports = {
    Ber,
    BerReader: Ber.Reader,
    BerWriter: Ber.Writer
  };
});

// node_modules/node-rsa/src/formats/pkcs1.js
var require_pkcs12 = __commonJS((exports, module) => {
  var ber = require_lib().Ber;
  var _ = require_utils2()._;
  var utils = require_utils2();
  const PRIVATE_OPENING_BOUNDARY = "-----BEGIN RSA PRIVATE KEY-----";
  const PRIVATE_CLOSING_BOUNDARY = "-----END RSA PRIVATE KEY-----";
  const PUBLIC_OPENING_BOUNDARY = "-----BEGIN RSA PUBLIC KEY-----";
  const PUBLIC_CLOSING_BOUNDARY = "-----END RSA PUBLIC KEY-----";
  module.exports = {
    privateExport: function(key, options) {
      options = options || {};
      var n = key.n.toBuffer();
      var d = key.d.toBuffer();
      var p = key.p.toBuffer();
      var q = key.q.toBuffer();
      var dmp1 = key.dmp1.toBuffer();
      var dmq1 = key.dmq1.toBuffer();
      var coeff = key.coeff.toBuffer();
      var length = n.length + d.length + p.length + q.length + dmp1.length + dmq1.length + coeff.length + 512;
      var writer = new ber.Writer({size: length});
      writer.startSequence();
      writer.writeInt(0);
      writer.writeBuffer(n, 2);
      writer.writeInt(key.e);
      writer.writeBuffer(d, 2);
      writer.writeBuffer(p, 2);
      writer.writeBuffer(q, 2);
      writer.writeBuffer(dmp1, 2);
      writer.writeBuffer(dmq1, 2);
      writer.writeBuffer(coeff, 2);
      writer.endSequence();
      if (options.type === "der") {
        return writer.buffer;
      } else {
        return PRIVATE_OPENING_BOUNDARY + "\n" + utils.linebrk(writer.buffer.toString("base64"), 64) + "\n" + PRIVATE_CLOSING_BOUNDARY;
      }
    },
    privateImport: function(key, data, options) {
      options = options || {};
      var buffer;
      if (options.type !== "der") {
        if (Buffer.isBuffer(data)) {
          data = data.toString("utf8");
        }
        if (_.isString(data)) {
          var pem = utils.trimSurroundingText(data, PRIVATE_OPENING_BOUNDARY, PRIVATE_CLOSING_BOUNDARY).replace(/\s+|\n\r|\n|\r$/gm, "");
          buffer = Buffer.from(pem, "base64");
        } else {
          throw Error("Unsupported key format");
        }
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else {
        throw Error("Unsupported key format");
      }
      var reader = new ber.Reader(buffer);
      reader.readSequence();
      reader.readString(2, true);
      key.setPrivate(reader.readString(2, true), reader.readString(2, true), reader.readString(2, true), reader.readString(2, true), reader.readString(2, true), reader.readString(2, true), reader.readString(2, true), reader.readString(2, true));
    },
    publicExport: function(key, options) {
      options = options || {};
      var n = key.n.toBuffer();
      var length = n.length + 512;
      var bodyWriter = new ber.Writer({size: length});
      bodyWriter.startSequence();
      bodyWriter.writeBuffer(n, 2);
      bodyWriter.writeInt(key.e);
      bodyWriter.endSequence();
      if (options.type === "der") {
        return bodyWriter.buffer;
      } else {
        return PUBLIC_OPENING_BOUNDARY + "\n" + utils.linebrk(bodyWriter.buffer.toString("base64"), 64) + "\n" + PUBLIC_CLOSING_BOUNDARY;
      }
    },
    publicImport: function(key, data, options) {
      options = options || {};
      var buffer;
      if (options.type !== "der") {
        if (Buffer.isBuffer(data)) {
          data = data.toString("utf8");
        }
        if (_.isString(data)) {
          var pem = utils.trimSurroundingText(data, PUBLIC_OPENING_BOUNDARY, PUBLIC_CLOSING_BOUNDARY).replace(/\s+|\n\r|\n|\r$/gm, "");
          buffer = Buffer.from(pem, "base64");
        }
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else {
        throw Error("Unsupported key format");
      }
      var body = new ber.Reader(buffer);
      body.readSequence();
      key.setPublic(body.readString(2, true), body.readString(2, true));
    },
    autoImport: function(key, data) {
      if (/^[\S\s]*-----BEGIN RSA PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END RSA PRIVATE KEY-----[\S\s]*$/g.test(data)) {
        module.exports.privateImport(key, data);
        return true;
      }
      if (/^[\S\s]*-----BEGIN RSA PUBLIC KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END RSA PUBLIC KEY-----[\S\s]*$/g.test(data)) {
        module.exports.publicImport(key, data);
        return true;
      }
      return false;
    }
  };
});

// node_modules/node-rsa/src/formats/pkcs8.js
var require_pkcs8 = __commonJS((exports, module) => {
  var ber = require_lib().Ber;
  var _ = require_utils2()._;
  var PUBLIC_RSA_OID = "1.2.840.113549.1.1.1";
  var utils = require_utils2();
  const PRIVATE_OPENING_BOUNDARY = "-----BEGIN PRIVATE KEY-----";
  const PRIVATE_CLOSING_BOUNDARY = "-----END PRIVATE KEY-----";
  const PUBLIC_OPENING_BOUNDARY = "-----BEGIN PUBLIC KEY-----";
  const PUBLIC_CLOSING_BOUNDARY = "-----END PUBLIC KEY-----";
  module.exports = {
    privateExport: function(key, options) {
      options = options || {};
      var n = key.n.toBuffer();
      var d = key.d.toBuffer();
      var p = key.p.toBuffer();
      var q = key.q.toBuffer();
      var dmp1 = key.dmp1.toBuffer();
      var dmq1 = key.dmq1.toBuffer();
      var coeff = key.coeff.toBuffer();
      var length = n.length + d.length + p.length + q.length + dmp1.length + dmq1.length + coeff.length + 512;
      var bodyWriter = new ber.Writer({size: length});
      bodyWriter.startSequence();
      bodyWriter.writeInt(0);
      bodyWriter.writeBuffer(n, 2);
      bodyWriter.writeInt(key.e);
      bodyWriter.writeBuffer(d, 2);
      bodyWriter.writeBuffer(p, 2);
      bodyWriter.writeBuffer(q, 2);
      bodyWriter.writeBuffer(dmp1, 2);
      bodyWriter.writeBuffer(dmq1, 2);
      bodyWriter.writeBuffer(coeff, 2);
      bodyWriter.endSequence();
      var writer = new ber.Writer({size: length});
      writer.startSequence();
      writer.writeInt(0);
      writer.startSequence();
      writer.writeOID(PUBLIC_RSA_OID);
      writer.writeNull();
      writer.endSequence();
      writer.writeBuffer(bodyWriter.buffer, 4);
      writer.endSequence();
      if (options.type === "der") {
        return writer.buffer;
      } else {
        return PRIVATE_OPENING_BOUNDARY + "\n" + utils.linebrk(writer.buffer.toString("base64"), 64) + "\n" + PRIVATE_CLOSING_BOUNDARY;
      }
    },
    privateImport: function(key, data, options) {
      options = options || {};
      var buffer;
      if (options.type !== "der") {
        if (Buffer.isBuffer(data)) {
          data = data.toString("utf8");
        }
        if (_.isString(data)) {
          var pem = utils.trimSurroundingText(data, PRIVATE_OPENING_BOUNDARY, PRIVATE_CLOSING_BOUNDARY).replace("-----END PRIVATE KEY-----", "").replace(/\s+|\n\r|\n|\r$/gm, "");
          buffer = Buffer.from(pem, "base64");
        } else {
          throw Error("Unsupported key format");
        }
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else {
        throw Error("Unsupported key format");
      }
      var reader = new ber.Reader(buffer);
      reader.readSequence();
      reader.readInt(0);
      var header = new ber.Reader(reader.readString(48, true));
      if (header.readOID(6, true) !== PUBLIC_RSA_OID) {
        throw Error("Invalid Public key format");
      }
      var body = new ber.Reader(reader.readString(4, true));
      body.readSequence();
      body.readString(2, true);
      key.setPrivate(body.readString(2, true), body.readString(2, true), body.readString(2, true), body.readString(2, true), body.readString(2, true), body.readString(2, true), body.readString(2, true), body.readString(2, true));
    },
    publicExport: function(key, options) {
      options = options || {};
      var n = key.n.toBuffer();
      var length = n.length + 512;
      var bodyWriter = new ber.Writer({size: length});
      bodyWriter.writeByte(0);
      bodyWriter.startSequence();
      bodyWriter.writeBuffer(n, 2);
      bodyWriter.writeInt(key.e);
      bodyWriter.endSequence();
      var writer = new ber.Writer({size: length});
      writer.startSequence();
      writer.startSequence();
      writer.writeOID(PUBLIC_RSA_OID);
      writer.writeNull();
      writer.endSequence();
      writer.writeBuffer(bodyWriter.buffer, 3);
      writer.endSequence();
      if (options.type === "der") {
        return writer.buffer;
      } else {
        return PUBLIC_OPENING_BOUNDARY + "\n" + utils.linebrk(writer.buffer.toString("base64"), 64) + "\n" + PUBLIC_CLOSING_BOUNDARY;
      }
    },
    publicImport: function(key, data, options) {
      options = options || {};
      var buffer;
      if (options.type !== "der") {
        if (Buffer.isBuffer(data)) {
          data = data.toString("utf8");
        }
        if (_.isString(data)) {
          var pem = utils.trimSurroundingText(data, PUBLIC_OPENING_BOUNDARY, PUBLIC_CLOSING_BOUNDARY).replace(/\s+|\n\r|\n|\r$/gm, "");
          buffer = Buffer.from(pem, "base64");
        }
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else {
        throw Error("Unsupported key format");
      }
      var reader = new ber.Reader(buffer);
      reader.readSequence();
      var header = new ber.Reader(reader.readString(48, true));
      if (header.readOID(6, true) !== PUBLIC_RSA_OID) {
        throw Error("Invalid Public key format");
      }
      var body = new ber.Reader(reader.readString(3, true));
      body.readByte();
      body.readSequence();
      key.setPublic(body.readString(2, true), body.readString(2, true));
    },
    autoImport: function(key, data) {
      if (/^[\S\s]*-----BEGIN PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PRIVATE KEY-----[\S\s]*$/g.test(data)) {
        module.exports.privateImport(key, data);
        return true;
      }
      if (/^[\S\s]*-----BEGIN PUBLIC KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PUBLIC KEY-----[\S\s]*$/g.test(data)) {
        module.exports.publicImport(key, data);
        return true;
      }
      return false;
    }
  };
});

// node_modules/node-rsa/src/formats/components.js
var require_components = __commonJS((exports, module) => {
  var _ = require_utils2()._;
  var utils = require_utils2();
  module.exports = {
    privateExport: function(key, options) {
      return {
        n: key.n.toBuffer(),
        e: key.e,
        d: key.d.toBuffer(),
        p: key.p.toBuffer(),
        q: key.q.toBuffer(),
        dmp1: key.dmp1.toBuffer(),
        dmq1: key.dmq1.toBuffer(),
        coeff: key.coeff.toBuffer()
      };
    },
    privateImport: function(key, data, options) {
      if (data.n && data.e && data.d && data.p && data.q && data.dmp1 && data.dmq1 && data.coeff) {
        key.setPrivate(data.n, data.e, data.d, data.p, data.q, data.dmp1, data.dmq1, data.coeff);
      } else {
        throw Error("Invalid key data");
      }
    },
    publicExport: function(key, options) {
      return {
        n: key.n.toBuffer(),
        e: key.e
      };
    },
    publicImport: function(key, data, options) {
      if (data.n && data.e) {
        key.setPublic(data.n, data.e);
      } else {
        throw Error("Invalid key data");
      }
    },
    autoImport: function(key, data) {
      if (data.n && data.e) {
        if (data.d && data.p && data.q && data.dmp1 && data.dmq1 && data.coeff) {
          module.exports.privateImport(key, data);
          return true;
        } else {
          module.exports.publicImport(key, data);
          return true;
        }
      }
      return false;
    }
  };
});

// node_modules/node-rsa/src/formats/openssh.js
var require_openssh = __commonJS((exports, module) => {
  var _ = require_utils2()._;
  var utils = require_utils2();
  var BigInteger = require_jsbn();
  const PRIVATE_OPENING_BOUNDARY = "-----BEGIN OPENSSH PRIVATE KEY-----";
  const PRIVATE_CLOSING_BOUNDARY = "-----END OPENSSH PRIVATE KEY-----";
  module.exports = {
    privateExport: function(key, options) {
      const nbuf = key.n.toBuffer();
      let ebuf = Buffer.alloc(4);
      ebuf.writeUInt32BE(key.e, 0);
      while (ebuf[0] === 0)
        ebuf = ebuf.slice(1);
      const dbuf = key.d.toBuffer();
      const coeffbuf = key.coeff.toBuffer();
      const pbuf = key.p.toBuffer();
      const qbuf = key.q.toBuffer();
      let commentbuf;
      if (typeof key.sshcomment !== "undefined") {
        commentbuf = Buffer.from(key.sshcomment);
      } else {
        commentbuf = Buffer.from([]);
      }
      const pubkeyLength = 11 + 4 + ebuf.byteLength + 4 + nbuf.byteLength;
      const privateKeyLength = 8 + 11 + 4 + nbuf.byteLength + 4 + ebuf.byteLength + 4 + dbuf.byteLength + 4 + coeffbuf.byteLength + 4 + pbuf.byteLength + 4 + qbuf.byteLength + 4 + commentbuf.byteLength;
      let length = 15 + 16 + 4 + 4 + 4 + pubkeyLength + 4 + privateKeyLength;
      const paddingLength = Math.ceil(privateKeyLength / 8) * 8 - privateKeyLength;
      length += paddingLength;
      const buf = Buffer.alloc(length);
      const writer = {buf, off: 0};
      buf.write("openssh-key-v1", "utf8");
      buf.writeUInt8(0, 14);
      writer.off += 15;
      writeOpenSSHKeyString(writer, Buffer.from("none"));
      writeOpenSSHKeyString(writer, Buffer.from("none"));
      writeOpenSSHKeyString(writer, Buffer.from(""));
      writer.off = writer.buf.writeUInt32BE(1, writer.off);
      writer.off = writer.buf.writeUInt32BE(pubkeyLength, writer.off);
      writeOpenSSHKeyString(writer, Buffer.from("ssh-rsa"));
      writeOpenSSHKeyString(writer, ebuf);
      writeOpenSSHKeyString(writer, nbuf);
      writer.off = writer.buf.writeUInt32BE(length - 47 - pubkeyLength, writer.off);
      writer.off += 8;
      writeOpenSSHKeyString(writer, Buffer.from("ssh-rsa"));
      writeOpenSSHKeyString(writer, nbuf);
      writeOpenSSHKeyString(writer, ebuf);
      writeOpenSSHKeyString(writer, dbuf);
      writeOpenSSHKeyString(writer, coeffbuf);
      writeOpenSSHKeyString(writer, pbuf);
      writeOpenSSHKeyString(writer, qbuf);
      writeOpenSSHKeyString(writer, commentbuf);
      let pad = 1;
      while (writer.off < length) {
        writer.off = writer.buf.writeUInt8(pad++, writer.off);
      }
      if (options.type === "der") {
        return writer.buf;
      } else {
        return PRIVATE_OPENING_BOUNDARY + "\n" + utils.linebrk(buf.toString("base64"), 70) + "\n" + PRIVATE_CLOSING_BOUNDARY + "\n";
      }
    },
    privateImport: function(key, data, options) {
      options = options || {};
      var buffer;
      if (options.type !== "der") {
        if (Buffer.isBuffer(data)) {
          data = data.toString("utf8");
        }
        if (_.isString(data)) {
          var pem = utils.trimSurroundingText(data, PRIVATE_OPENING_BOUNDARY, PRIVATE_CLOSING_BOUNDARY).replace(/\s+|\n\r|\n|\r$/gm, "");
          buffer = Buffer.from(pem, "base64");
        } else {
          throw Error("Unsupported key format");
        }
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else {
        throw Error("Unsupported key format");
      }
      const reader = {buf: buffer, off: 0};
      if (buffer.slice(0, 14).toString("ascii") !== "openssh-key-v1")
        throw "Invalid file format.";
      reader.off += 15;
      if (readOpenSSHKeyString(reader).toString("ascii") !== "none")
        throw Error("Unsupported key type");
      if (readOpenSSHKeyString(reader).toString("ascii") !== "none")
        throw Error("Unsupported key type");
      if (readOpenSSHKeyString(reader).toString("ascii") !== "")
        throw Error("Unsupported key type");
      reader.off += 4;
      reader.off += 4;
      if (readOpenSSHKeyString(reader).toString("ascii") !== "ssh-rsa")
        throw Error("Unsupported key type");
      readOpenSSHKeyString(reader);
      readOpenSSHKeyString(reader);
      reader.off += 12;
      if (readOpenSSHKeyString(reader).toString("ascii") !== "ssh-rsa")
        throw Error("Unsupported key type");
      const n = readOpenSSHKeyString(reader);
      const e = readOpenSSHKeyString(reader);
      const d = readOpenSSHKeyString(reader);
      const coeff = readOpenSSHKeyString(reader);
      const p = readOpenSSHKeyString(reader);
      const q = readOpenSSHKeyString(reader);
      const dint = new BigInteger(d);
      const qint = new BigInteger(q);
      const pint = new BigInteger(p);
      const dp = dint.mod(pint.subtract(BigInteger.ONE));
      const dq = dint.mod(qint.subtract(BigInteger.ONE));
      key.setPrivate(n, e, d, p, q, dp.toBuffer(), dq.toBuffer(), coeff);
      key.sshcomment = readOpenSSHKeyString(reader).toString("ascii");
    },
    publicExport: function(key, options) {
      let ebuf = Buffer.alloc(4);
      ebuf.writeUInt32BE(key.e, 0);
      while (ebuf[0] === 0)
        ebuf = ebuf.slice(1);
      const nbuf = key.n.toBuffer();
      const buf = Buffer.alloc(ebuf.byteLength + 4 + nbuf.byteLength + 4 + "ssh-rsa".length + 4);
      const writer = {buf, off: 0};
      writeOpenSSHKeyString(writer, Buffer.from("ssh-rsa"));
      writeOpenSSHKeyString(writer, ebuf);
      writeOpenSSHKeyString(writer, nbuf);
      let comment = key.sshcomment || "";
      if (options.type === "der") {
        return writer.buf;
      } else {
        return "ssh-rsa " + buf.toString("base64") + " " + comment + "\n";
      }
    },
    publicImport: function(key, data, options) {
      options = options || {};
      var buffer;
      if (options.type !== "der") {
        if (Buffer.isBuffer(data)) {
          data = data.toString("utf8");
        }
        if (_.isString(data)) {
          if (data.substring(0, 8) !== "ssh-rsa ")
            throw Error("Unsupported key format");
          let pemEnd = data.indexOf(" ", 8);
          if (pemEnd === -1) {
            pemEnd = data.length;
          } else {
            key.sshcomment = data.substring(pemEnd + 1).replace(/\s+|\n\r|\n|\r$/gm, "");
          }
          const pem = data.substring(8, pemEnd).replace(/\s+|\n\r|\n|\r$/gm, "");
          buffer = Buffer.from(pem, "base64");
        } else {
          throw Error("Unsupported key format");
        }
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else {
        throw Error("Unsupported key format");
      }
      const reader = {buf: buffer, off: 0};
      const type = readOpenSSHKeyString(reader).toString("ascii");
      if (type !== "ssh-rsa")
        throw Error("Invalid key type: " + type);
      const e = readOpenSSHKeyString(reader);
      const n = readOpenSSHKeyString(reader);
      key.setPublic(n, e);
    },
    autoImport: function(key, data) {
      if (/^[\S\s]*-----BEGIN OPENSSH PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END OPENSSH PRIVATE KEY-----[\S\s]*$/g.test(data)) {
        module.exports.privateImport(key, data);
        return true;
      }
      if (/^[\S\s]*ssh-rsa \s*(?=(([A-Za-z0-9+/=]+\s*)+))\1[\S\s]*$/g.test(data)) {
        module.exports.publicImport(key, data);
        return true;
      }
      return false;
    }
  };
  function readOpenSSHKeyString(reader) {
    const len = reader.buf.readInt32BE(reader.off);
    reader.off += 4;
    const res = reader.buf.slice(reader.off, reader.off + len);
    reader.off += len;
    return res;
  }
  function writeOpenSSHKeyString(writer, data) {
    writer.buf.writeInt32BE(data.byteLength, writer.off);
    writer.off += 4;
    writer.off += data.copy(writer.buf, writer.off);
  }
});

// node_modules/node-rsa/src/formats/formats.js
var require_formats = __commonJS((exports, module) => {
  var _ = require_utils2()._;
  function formatParse(format) {
    format = format.split("-");
    var keyType = "private";
    var keyOpt = {type: "default"};
    for (var i = 1; i < format.length; i++) {
      if (format[i]) {
        switch (format[i]) {
          case "public":
            keyType = format[i];
            break;
          case "private":
            keyType = format[i];
            break;
          case "pem":
            keyOpt.type = format[i];
            break;
          case "der":
            keyOpt.type = format[i];
            break;
        }
      }
    }
    return {scheme: format[0], keyType, keyOpt};
  }
  module.exports = {
    pkcs1: require_pkcs12(),
    pkcs8: require_pkcs8(),
    components: require_components(),
    openssh: require_openssh(),
    isPrivateExport: function(format) {
      return module.exports[format] && typeof module.exports[format].privateExport === "function";
    },
    isPrivateImport: function(format) {
      return module.exports[format] && typeof module.exports[format].privateImport === "function";
    },
    isPublicExport: function(format) {
      return module.exports[format] && typeof module.exports[format].publicExport === "function";
    },
    isPublicImport: function(format) {
      return module.exports[format] && typeof module.exports[format].publicImport === "function";
    },
    detectAndImport: function(key, data, format) {
      if (format === void 0) {
        for (var scheme in module.exports) {
          if (typeof module.exports[scheme].autoImport === "function" && module.exports[scheme].autoImport(key, data)) {
            return true;
          }
        }
      } else if (format) {
        var fmt = formatParse(format);
        if (module.exports[fmt.scheme]) {
          if (fmt.keyType === "private") {
            module.exports[fmt.scheme].privateImport(key, data, fmt.keyOpt);
          } else {
            module.exports[fmt.scheme].publicImport(key, data, fmt.keyOpt);
          }
        } else {
          throw Error("Unsupported key format");
        }
      }
      return false;
    },
    detectAndExport: function(key, format) {
      if (format) {
        var fmt = formatParse(format);
        if (module.exports[fmt.scheme]) {
          if (fmt.keyType === "private") {
            if (!key.isPrivate()) {
              throw Error("This is not private key");
            }
            return module.exports[fmt.scheme].privateExport(key, fmt.keyOpt);
          } else {
            if (!key.isPublic()) {
              throw Error("This is not public key");
            }
            return module.exports[fmt.scheme].publicExport(key, fmt.keyOpt);
          }
        } else {
          throw Error("Unsupported key format");
        }
      }
    }
  };
});

// node_modules/node-rsa/src/NodeRSA.js
var require_NodeRSA = __commonJS((exports, module) => {
  /*!
   * RSA library for Node.js
   *
   * Author: rzcoder
   * License MIT
   */
  var constants2 = require("constants");
  var rsa = require_rsa();
  var crypt = require("crypto");
  var ber = require_lib().Ber;
  var _ = require_utils2()._;
  var utils = require_utils2();
  var schemes = require_schemes();
  var formats = require_formats();
  if (typeof constants2.RSA_NO_PADDING === "undefined") {
    constants2.RSA_NO_PADDING = 3;
  }
  module.exports = function() {
    var SUPPORTED_HASH_ALGORITHMS = {
      node10: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"],
      node: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"],
      iojs: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"],
      browser: ["md5", "ripemd160", "sha1", "sha256", "sha512"]
    };
    var DEFAULT_ENCRYPTION_SCHEME = "pkcs1_oaep";
    var DEFAULT_SIGNING_SCHEME = "pkcs1";
    var DEFAULT_EXPORT_FORMAT = "private";
    var EXPORT_FORMAT_ALIASES = {
      private: "pkcs1-private-pem",
      "private-der": "pkcs1-private-der",
      public: "pkcs8-public-pem",
      "public-der": "pkcs8-public-der"
    };
    function NodeRSA2(key, format, options) {
      if (!(this instanceof NodeRSA2)) {
        return new NodeRSA2(key, format, options);
      }
      if (_.isObject(format)) {
        options = format;
        format = void 0;
      }
      this.$options = {
        signingScheme: DEFAULT_SIGNING_SCHEME,
        signingSchemeOptions: {
          hash: "sha256",
          saltLength: null
        },
        encryptionScheme: DEFAULT_ENCRYPTION_SCHEME,
        encryptionSchemeOptions: {
          hash: "sha1",
          label: null
        },
        environment: utils.detectEnvironment(),
        rsaUtils: this
      };
      this.keyPair = new rsa.Key();
      this.$cache = {};
      if (Buffer.isBuffer(key) || _.isString(key)) {
        this.importKey(key, format);
      } else if (_.isObject(key)) {
        this.generateKeyPair(key.b, key.e);
      }
      this.setOptions(options);
    }
    NodeRSA2.prototype.setOptions = function(options) {
      options = options || {};
      if (options.environment) {
        this.$options.environment = options.environment;
      }
      if (options.signingScheme) {
        if (_.isString(options.signingScheme)) {
          var signingScheme = options.signingScheme.toLowerCase().split("-");
          if (signingScheme.length == 1) {
            if (SUPPORTED_HASH_ALGORITHMS.node.indexOf(signingScheme[0]) > -1) {
              this.$options.signingSchemeOptions = {
                hash: signingScheme[0]
              };
              this.$options.signingScheme = DEFAULT_SIGNING_SCHEME;
            } else {
              this.$options.signingScheme = signingScheme[0];
              this.$options.signingSchemeOptions = {
                hash: null
              };
            }
          } else {
            this.$options.signingSchemeOptions = {
              hash: signingScheme[1]
            };
            this.$options.signingScheme = signingScheme[0];
          }
        } else if (_.isObject(options.signingScheme)) {
          this.$options.signingScheme = options.signingScheme.scheme || DEFAULT_SIGNING_SCHEME;
          this.$options.signingSchemeOptions = _.omit(options.signingScheme, "scheme");
        }
        if (!schemes.isSignature(this.$options.signingScheme)) {
          throw Error("Unsupported signing scheme");
        }
        if (this.$options.signingSchemeOptions.hash && SUPPORTED_HASH_ALGORITHMS[this.$options.environment].indexOf(this.$options.signingSchemeOptions.hash) === -1) {
          throw Error("Unsupported hashing algorithm for " + this.$options.environment + " environment");
        }
      }
      if (options.encryptionScheme) {
        if (_.isString(options.encryptionScheme)) {
          this.$options.encryptionScheme = options.encryptionScheme.toLowerCase();
          this.$options.encryptionSchemeOptions = {};
        } else if (_.isObject(options.encryptionScheme)) {
          this.$options.encryptionScheme = options.encryptionScheme.scheme || DEFAULT_ENCRYPTION_SCHEME;
          this.$options.encryptionSchemeOptions = _.omit(options.encryptionScheme, "scheme");
        }
        if (!schemes.isEncryption(this.$options.encryptionScheme)) {
          throw Error("Unsupported encryption scheme");
        }
        if (this.$options.encryptionSchemeOptions.hash && SUPPORTED_HASH_ALGORITHMS[this.$options.environment].indexOf(this.$options.encryptionSchemeOptions.hash) === -1) {
          throw Error("Unsupported hashing algorithm for " + this.$options.environment + " environment");
        }
      }
      this.keyPair.setOptions(this.$options);
    };
    NodeRSA2.prototype.generateKeyPair = function(bits, exp) {
      bits = bits || 2048;
      exp = exp || 65537;
      if (bits % 8 !== 0) {
        throw Error("Key size must be a multiple of 8.");
      }
      this.keyPair.generate(bits, exp.toString(16));
      this.$cache = {};
      return this;
    };
    NodeRSA2.prototype.importKey = function(keyData, format) {
      if (!keyData) {
        throw Error("Empty key given");
      }
      if (format) {
        format = EXPORT_FORMAT_ALIASES[format] || format;
      }
      if (!formats.detectAndImport(this.keyPair, keyData, format) && format === void 0) {
        throw Error("Key format must be specified");
      }
      this.$cache = {};
      return this;
    };
    NodeRSA2.prototype.exportKey = function(format) {
      format = format || DEFAULT_EXPORT_FORMAT;
      format = EXPORT_FORMAT_ALIASES[format] || format;
      if (!this.$cache[format]) {
        this.$cache[format] = formats.detectAndExport(this.keyPair, format);
      }
      return this.$cache[format];
    };
    NodeRSA2.prototype.isPrivate = function() {
      return this.keyPair.isPrivate();
    };
    NodeRSA2.prototype.isPublic = function(strict) {
      return this.keyPair.isPublic(strict);
    };
    NodeRSA2.prototype.isEmpty = function(strict) {
      return !(this.keyPair.n || this.keyPair.e || this.keyPair.d);
    };
    NodeRSA2.prototype.encrypt = function(buffer, encoding, source_encoding) {
      return this.$$encryptKey(false, buffer, encoding, source_encoding);
    };
    NodeRSA2.prototype.decrypt = function(buffer, encoding) {
      return this.$$decryptKey(false, buffer, encoding);
    };
    NodeRSA2.prototype.encryptPrivate = function(buffer, encoding, source_encoding) {
      return this.$$encryptKey(true, buffer, encoding, source_encoding);
    };
    NodeRSA2.prototype.decryptPublic = function(buffer, encoding) {
      return this.$$decryptKey(true, buffer, encoding);
    };
    NodeRSA2.prototype.$$encryptKey = function(usePrivate, buffer, encoding, source_encoding) {
      try {
        var res = this.keyPair.encrypt(this.$getDataForEncrypt(buffer, source_encoding), usePrivate);
        if (encoding == "buffer" || !encoding) {
          return res;
        } else {
          return res.toString(encoding);
        }
      } catch (e) {
        throw Error("Error during encryption. Original error: " + e);
      }
    };
    NodeRSA2.prototype.$$decryptKey = function(usePublic, buffer, encoding) {
      try {
        buffer = _.isString(buffer) ? Buffer.from(buffer, "base64") : buffer;
        var res = this.keyPair.decrypt(buffer, usePublic);
        if (res === null) {
          throw Error("Key decrypt method returns null.");
        }
        return this.$getDecryptedData(res, encoding);
      } catch (e) {
        throw Error("Error during decryption (probably incorrect key). Original error: " + e);
      }
    };
    NodeRSA2.prototype.sign = function(buffer, encoding, source_encoding) {
      if (!this.isPrivate()) {
        throw Error("This is not private key");
      }
      var res = this.keyPair.sign(this.$getDataForEncrypt(buffer, source_encoding));
      if (encoding && encoding != "buffer") {
        res = res.toString(encoding);
      }
      return res;
    };
    NodeRSA2.prototype.verify = function(buffer, signature, source_encoding, signature_encoding) {
      if (!this.isPublic()) {
        throw Error("This is not public key");
      }
      signature_encoding = !signature_encoding || signature_encoding == "buffer" ? null : signature_encoding;
      return this.keyPair.verify(this.$getDataForEncrypt(buffer, source_encoding), signature, signature_encoding);
    };
    NodeRSA2.prototype.getKeySize = function() {
      return this.keyPair.keySize;
    };
    NodeRSA2.prototype.getMaxMessageSize = function() {
      return this.keyPair.maxMessageLength;
    };
    NodeRSA2.prototype.$getDataForEncrypt = function(buffer, encoding) {
      if (_.isString(buffer) || _.isNumber(buffer)) {
        return Buffer.from("" + buffer, encoding || "utf8");
      } else if (Buffer.isBuffer(buffer)) {
        return buffer;
      } else if (_.isObject(buffer)) {
        return Buffer.from(JSON.stringify(buffer));
      } else {
        throw Error("Unexpected data type");
      }
    };
    NodeRSA2.prototype.$getDecryptedData = function(buffer, encoding) {
      encoding = encoding || "buffer";
      if (encoding == "buffer") {
        return buffer;
      } else if (encoding == "json") {
        return JSON.parse(buffer.toString());
      } else {
        return buffer.toString(encoding);
      }
    };
    return NodeRSA2;
  }();
});

// src/runtimeLoader.ts
const axios = __toModule(require_axios2());

// src/constants.ts
const RUNTIME_PATH = "https://cdn.jsdelivr.net/gh/yjmirror/selfcheck/lib/runtime.json";

// src/configStore.ts
const config = {
  headers: {
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    Pragma: "no-cache",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36"
  },
  manualUpdate: false,
  publicKey: `30820122300d06092a864886f70d01010105000382010f003082010a0282010100f357429c22add0d547ee3e4e876f921a0114d1aaa2e6eeac6177a6a2e2565ce9593b78ea0ec1d8335a9f12356f08e99ea0c3455d849774d85f954ee68d63fc8d6526918210f28dc51aa333b0c4cdc6bf9b029d1c50b5aef5e626c9c8c9c16231c41eef530be91143627205bbbf99c2c261791d2df71e69fbc83cdc7e37c1b3df4ae71244a691c6d2a73eab7617c713e9c193484459f45adc6dd0cba1d54f1abef5b2c34dee43fc0c067ce1c140bc4f81b935c94b116cce404c5b438a0395906ff0133f5b1c6e3b2bb423c6c350376eb4939f44461164195acc51ef44a34d4100f6a837e3473e3ce2e16cedbe67ca48da301f64fc4240b878c9cc6b3d30c316b50203010001`
};
var configStore_default = config;
function disableAutoUpdate() {
  config.manualUpdate = true;
}

// src/runtimeLoader.ts
async function loadRuntime() {
  const {
    data: {code, version, options}
  } = await axios.default.get(RUNTIME_PATH);
  if (options)
    Object.assign(configStore_default, options);
  const runtime = {
    function: interop(new Function(wrap(code))()),
    version
  };
  configStore_default.runtime = runtime;
}
function wrap(code) {
  return `"use strict";const m={exports:{}};(function(module,exports){${code}}).call(m.exports,m,m.exports);return m.exports;`;
}
function interop(mod) {
  return "__esModule" in mod ? mod.default : mod;
}

// src/encrypt.ts
const node_rsa = __toModule(require_NodeRSA());
let encoder = null;
function encrypt(payload) {
  if (!encoder)
    encoder = loadKey(configStore_default.publicKey);
  return encoder.encrypt(payload, "base64");
}
function loadKey(hex) {
  return new node_rsa.default(Buffer.from(hex, "hex"), "pkcs8-public-der", {
    encryptionScheme: "pkcs1"
  });
}

// src/request.ts
const axios3 = __toModule(require_axios2());

// src/headers.ts
function createTemplate(base) {
  return (headers2) => {
    return headers2 ? {...base, ...configStore_default.headers, ...headers2} : {...base, ...configStore_default.headers};
  };
}
const apiHeaders = createTemplate({
  Accept: "application/json, text/plain, */*",
  Origin: "https://hcs.eduro.go.kr",
  Referer: "https://hcs.eduro.go.kr/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin"
});

// src/request.ts
async function apiGetRequest(api, {token, baseURL, ...options}) {
  const {data} = await axios3.default.get(api, {
    headers: apiHeaders(injectToken(token)),
    baseURL: baseURL && normalizeUrl(baseURL),
    ...options
  });
  return data;
}
async function apiPostRequest(api, request2, {token, baseURL, ...options}) {
  const {data} = await axios3.default.post(api, request2, {
    headers: apiHeaders(injectToken(token)),
    baseURL: baseURL && normalizeUrl(baseURL),
    ...options
  });
  return data;
}
function injectToken(token) {
  return token ? {Authorization: token} : null;
}
function normalizeUrl(url) {
  return url.startsWith("https://") ? url : `https://${url}`;
}

// src/context.ts
const context = {
  get: apiGetRequest,
  post: apiPostRequest,
  encrypt
};

// src/index.ts
class SelfcheckError extends Error {
}
async function selfcheck(user) {
  if (!configStore_default.manualUpdate || !configStore_default.runtime)
    await loadRuntime();
  if (!configStore_default.runtime || !configStore_default.runtime.function)
    throw new SelfcheckError("cannot load runtime");
  try {
    const result = await configStore_default.runtime.function(user, context);
    if (result.inveYmd && result.registerDtm)
      return result;
    else
      throw new SelfcheckError("SELFCHECK_FAILED");
  } catch (err) {
    console.log(err);
    throw Object.assign(new SelfcheckError("HCS_FAILED"), err);
  }
}
export {
  SelfcheckError,
  selfcheck as default,
  disableAutoUpdate,
  selfcheck as hcs,
  selfcheck as healthCheck,
  loadRuntime as manualUpdate,
  selfcheck
};
