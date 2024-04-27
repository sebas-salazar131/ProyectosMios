(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3099:
/***/ (function(module) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ 6077:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),

/***/ 1223:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);
var create = __webpack_require__(30);
var definePropertyModule = __webpack_require__(3070);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 1530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(8710).charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ 5787:
/***/ (function(module) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),

/***/ 9670:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),

/***/ 4019:
/***/ (function(module) {

module.exports = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';


/***/ }),

/***/ 260:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(4019);
var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);
var has = __webpack_require__(6656);
var classof = __webpack_require__(648);
var createNonEnumerableProperty = __webpack_require__(8880);
var redefine = __webpack_require__(1320);
var defineProperty = __webpack_require__(3070).f;
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var wellKnownSymbol = __webpack_require__(5112);
var uid = __webpack_require__(9711);

var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var isPrototypeOf = ObjectPrototype.isPrototypeOf;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || has(TypedArrayConstructorsList, klass)
    || has(BigIntArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return has(TypedArrayConstructorsList, klass)
    || has(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (setPrototypeOf) {
    if (isPrototypeOf.call(TypedArray, C)) return C;
  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
      return C;
    }
  } throw TypeError('Target is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
      delete TypedArrayConstructor.prototype[KEY];
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
        delete TypedArrayConstructor[KEY];
      }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ 3331:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(7854);
var DESCRIPTORS = __webpack_require__(9781);
var NATIVE_ARRAY_BUFFER = __webpack_require__(4019);
var createNonEnumerableProperty = __webpack_require__(8880);
var redefineAll = __webpack_require__(2248);
var fails = __webpack_require__(7293);
var anInstance = __webpack_require__(5787);
var toInteger = __webpack_require__(9958);
var toLength = __webpack_require__(7466);
var toIndex = __webpack_require__(7067);
var IEEE754 = __webpack_require__(1179);
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var getOwnPropertyNames = __webpack_require__(8006).f;
var defineProperty = __webpack_require__(3070).f;
var arrayFill = __webpack_require__(1285);
var setToStringTag = __webpack_require__(8003);
var InternalStateModule = __webpack_require__(9909);

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global[DATA_VIEW];
var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype = Object.prototype;
var RangeError = global.RangeError;

var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
  /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayB.6s1.8-2.6 2.3-.2l.4-3.5s-1.6-2.5-2-4z"/>
  <path fill="#007934" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M246.7 307s-.6-6.5-3.8-2c0 0-.3 2.7 0 3.3 0 .8.9 1.8 1.3 2.5.7 1 1.4-.3 1.4-.3s.7-1 1-3.5z"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M221.7 252.7c-.2-3.7-1.3-9.8-1.4-14l-12.8-13.1s-1.6 10.5-6.2 16.6l20.3 10.5"/>
  <path fill="#ffe000" stroke="#000" stroke-width=".1" d="M222.6 253.2c.5-2.6 1.2-5.5 1.6-11l-8.2-8c0 3.4-3.8 8.6-4.1 15"/>
  <path fill="#007934" stroke="#000" stroke-width=".1" d="M229.7 261c1-4.5-1.4-5.1 2-11.5l-7.6-7.3c-1.4 4.3-2.3 7-2.2 10.8l6.5 4.6"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M200 288c-1.5-4.5.6-13.5.4-19.3-.2-3.7 2.5-17.6 2.5-21.9l-15-9.4s-.7 15.3-2.5 32a66.3 66.3 0 0 0-.4 22.8c1.6 9.3 3.2 13.1 7 17 6.6 7 20.9 3 20.9 3 12-2.6 19-10.2 19-10.2s-4 1-10.3 1.6c-14-1-19.4 2.5-19.8-11.8"/>
  <path fill="#f7e214" stroke="#000" stroke-width=".1" d="m240.4 297.4.2-.1c-2.6 1-6.2 2-6.2 2l-8.5.7c-18.4.4-16.1-11-15.4-29.4.2-7 1.6-15.8 1.2-18.9l-12.3-7c-4 11.3-2.8 19.3-3.6 25-.4 6.4-1.8 18.6.3 24 2.9 12.4 12.6 11.9 25.8 10.8 6.5-.6 10-2.3 10-2.3l8.5-4.9"/>
  <path fill="#007a3d" stroke="#000" stroke-width=".1" d="M240.6 297.1a37.3 37.3 0 0 1-6.3 2.3l-8.6.9c-13.3 1-21.1-8.3-19.4-29.5A66 66 0 0 1 209 250l7.3 4.3v.7c-.4 2.2-1.4 7.5-1.4 9.9 0 17 10.7 30 25.4 32.3l.2-.1"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M192 246c1.2 2 8.6 13.3 12.7 15.5m-11.5-8.2c1.2 2.1 10.3 14.9 14.4 15.6m-16.5 3.9c2 2.5 4.1 7.4 10.3 10.6M194 287c4.1 4 14.4 12.4 24.3 12.8m-24.3-6.4c2 2.5 6.6 14.2 25.6 8.9m-28.5-6.7c1.2 2.8 10.8 18.4 27.7 12.3"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M211 282.5c-1.6-4.6.5-13.6.3-19.4-.2-3.7 1.5-16.5 1.5-20.8l-14.1-10.5s-.7 15.3-2.4 32c-1.6 8.5-2.7 19-1.6 25.5 2 10.6 7 13.6 8 14.5 7.2 6.4 23.4 5.7 25 5.2 11.6-4.2 16.6-11.6 16.6-11.6s-5.5 0-11.8.6c-14-1-21-.4-21.4-14.7"/>
  <path fill="#ffe000" stroke="#000" stroke-width=".1" d="m251.3 291.8.2-.2c-2.6 1-6.2 2.1-6.2 2.1l-8.5.7c-18.4.4-16.1-11-15.4-29.4.2-7 .4-13.3 0-16.4l-11-8c-4 11.3-3 17.8-3.7 23.6-.4 6.3-1.8 18.5.3 23.8 2.8 12.5 12.6 12 25.7 10.9 6.6-.6 10-2.3 10-2.3l8.6-4.9"/>
  <path fill="#007934" stroke="#000" stroke-width=".1" d="M251.6 291.6a37 37 0 0 1-6.3 2.3l-8.6.8c-13.3 1.2-21.2-8.2-19.5-29.4 0-7.5-.2-8 2.4-18 4 2.6 11.9 9.3 11.9 9.3s-2.1 3-1.6 7.2c0 17 6.8 25.7 21.5 27.9l1.6-14"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M202.8 240.3a60.7 60.7 0 0 0 12.8 15.6m-11.5-8.2c1.2 2.2 10.3 14.9 14.4 15.6m-16.5 3.9c2 2.5 4.1 7.4 10.3 10.6m-7.4 3.5c4.1 4 14.4 12.4 24.3 12.8m-24.3-6.4c2 2.5 6.6 14.2 25.6 8.9m-28.5-6.7c1.2 2.8 10.7 18.4 27.7 12.3"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="m188 238.9-.8 6.4c-.3 4.7-.1 8.2.1 10.5 0 .2.9 5.8.6 6.1-1 1.3-1.1 1.4-2.3.5-.1-.2.5-6 .6-6.8l.4-10.5c0-1.1 1-6.8 1-6.8s.1-1.3.3.6"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="m188 238.9-.8 6.4c-.3 4.7-.1 8.2.1 10.5 0 .2 1.1 8 .7 6.1-1 1.3-1.3 1.7-2.4.8-.2-.2.5-6.3.6-7l.4-10.6c0-1.1 1-6.8 1-6.8s.1-1.3.3.6z"/>
  <path fill="#f7e214" stroke="#000" stroke-width=".1" d="M187.8 237s-1.2 6.5-1.3 10.2c-.2 4.5-.4 5.8-.3 8.5l-.6 4.8c-.1.7.1.1 0 .2-1 .6-1.6.1-2.1-.3-.2-.2 1.5-4 1.5-4.9.9-11.4 2.5-18.2 2.5-18.2s-.6 4.1.3-.3"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M187.8 237s-1.2 6.5-1.3 10.2c-.2 4.5-.4 5.8-.3 8.5l-.6 4.8c-.1.7.1.1 0 .2-1 .6-1.6.1-2.1-.3-.2-.2 1.5-4 1.5-4.9.9-11.4 2.5-18.2 2.5-18.2s-.6 4.1.3-.3zm-.5 18.5s-1 .4-1.1.2m0-1.4s.8 0 1-.2m-.1-1.2s-.7.4-.8.2m.7-1.8h-.6m.7-1.6h-.7m.6-2.3s-.4.2-.4 0m.5-1.9h-.5m-.5 10.2s-1 .1-1.1-.2m1.1-2s-1 0-1-.2m1-1.4h-.8m1-1.5h-.7m.7-1.8-.5-.1m.7-1.5s-.5 0-.6-.2m.7-1.7s-.4.3-.4 0m0 9.6s-1 0-1-.3m13.6-21.1-.7 6.4c-.3 4.7-.1 8.3 0 10.5 0 .2 1 5.8.7 6.1-1.1 1.3-1.2 1.4-2.3.5-.2-.2.5-6 .5-6.8.2-.8.3-7.5.5-10.5 0-1.1 1-6.8 1-6.8s.1-1.3.3.6"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="m198.8 233.3-.7 6.4a70 70 0 0 0 0 10.5c0 .2 1.2 8 .8 6.1-1 1.3-1.3 1.7-2.4.8-.2-.2.5-6.3.6-7l.4-10.6c0-1.1 1-6.8 1-6.8s.1-1.3.3.6z"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M198.7 231.4s-1.2 6.5-1.4 10.2c-.1 4.5-.3 5.8-.2 8.5l-.6 4.8c-.1.7 0 .2 0 .2-1 .6-1.6.1-2.2-.3-.1-.2 1.5-4 1.6-4.9.9-11.4 2.5-18.2 2.5-18.2l.3-.3"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M198.7 231.4s-1.2 6.5-1.3 10.2c-.2 4.5-.4 5.8-.3 8.5l-.6 4.8c-.1.7 0 .2 0 .2-1 .6-1.6.1-2.2-.3-.1-.2 1.5-4 1.6-4.9.9-11.4 2.5-18.2 2.5-18.2l.3-.3zm-.5 18.5s-1 .4-1.1.2m0-1.4s.7 0 .9-.2m0-1.2s-.7.4-.8.2m.7-1.8h-.6m.7-1.6h-.7m.6-2.3s-.4.2-.5 0m.6-1.9h-.6m-.5 10.2s-1 .1-1-.2m1.1-2s-1 0-1-.2m1-1.4h-.8m1-1.5h-.8m.8-1.8-.5-.1m.7-1.5s-.5 0-.6-.2m.7-1.7s-.5.3-.5 0m0 9.6s-1 0-1-.3"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M207.3 225.3s.5 5.5.2 8.6c-.4 3.8-.3 4.9-.7 7v4.3c.9.5 1.6.2 2.2-.1.2-.1-1-3.5-1-4.2.4-9.5-.5-15.3-.5-15.3l-.2-.2"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M207.3 225.3s.5 5.5.2 8.6c-.4 3.8-.3 4.9-.7 7v4.3c.9.5 1.6.2 2.2-.1.2-.1-1-3.5-1-4.2.4-9.5-.5-15.2-.5-15.2l-.2-.4zm-.4 15.7s1 .2 1.1 0m-.8-1.8s.9.1 1-.1m-1-1.3h.9m-.8-1.2h.7m-.5-1.6h.5m-.5-1.3h.5m-.4-1.5s.4.3.4 0m-1 8s1 0 1-.2"/>
  <path fill="#005000" stroke="#000" stroke-width=".1" d="M241 236.4h1-1z"/>
  <path fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M252.5 273.5s-.4-.2-.5 0l.2.2.3-.2zm-1 1.2 2.2-.2"/>
  <path fill="#e8a30e" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M226.3 303.1c-.2 3.3-7.8 7-13.5.2-6-4.8-4.7-12.2 0-13.2l58.3-56.8c2.4-1.3 2.6-2.5 3.8-3.7 2.4 2.6 7.5 7.2 10.2 9.5-1.7 1.4-3 2.7-3.4 3.8l-55.4 60.2z"/>
  <path fill="#e7e7e7" fill-rule="evenodd" stroke="#000" stroke-linejoin="round" stroke-width=".1" d="M275 229.4c2.8-3.8 13.6 6 10.7 9.2-2.9 3-13.3-5.4-10.7-9.2z"/>
  <path fill="#cccccf" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M284.8 237.8c-2 1.6-10-5-8.6-7.6 2.1-2.4 10.8 6.1 8.6 7.6z"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M281.6 243a16.8 16.8 0 0 1-10.5-9.6m-24.5 48a17.3 17.3 0 0 1-12.2-12.5m9.7 15.3a17.3 17.3 0 0 1-12.2-12.4m-2.3 27.5a19 19 0 0 1-13-13m10.5 15.8a19.2 19.2 0 0 1-13-13"/>
  <path fill="none" stroke="#000" stroke-linecap="round" stroke-width=".1" d="M212.6 304c-.3 1.5-1 2-2.2 1.5m14.7-2c-2.3 3.6-4.9 2.5-7 2.5"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M209.5 304.2c0 1 .8 1.8 1.8 1.8a1.8 1.8 0 0 0 1.9-1.8c0-1-.8-1.8-1.9-1.8-1 0-1.8 1.1-1.8 2"/>
  <path fill="none" stroke="#000" stroke-linecap="round" stroke-width=".1" d="M212.8 303.9c-.3 1.4-1 1.9-2.2 1.4m14.5-1.9c-2.3 3.7-4.9 2.6-7 2.6"/>
  <path fill="#007934" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="m268.6 309.7 1 9.6-1.9-2.4c-.3-.6-1.6-2.2-1.9-7.9 0 0 1-3 1.5-3 .8-.5 1.3 3.7 1.3 3.7zm-2.4-21.5 2.9 16.9c0 .4-1.3 1.7-2.3-1.3l-1.5-11.2 1-4.4z"/>
  <path fill="#d52b1e" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M260.4 303.5c.6-.8 1.4-1.7 1.5-2.1l.4 3.4s-2.2 1.5-1.8 4.6l-.5-.6-.2-1.3-.5-3.2s.5-.2 1.1-.8z"/>
  <path fill="#ffe000" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M269.6 319.3s-3.6-3-3.8-10.3l-.4-2s0 1.6-.8.4c-.7-1.6-.7-3-.7-3s-1.3-1.6-1.7.4a1925.6 1925.6 0 0 0 1.6 12.4s.7-1.2 1.4 0c.8 1.3 2 2.9 4.4 2.1zm-4.3-26.7 1.5 11.2s-1.2.6-1.4 3.2c-.1 1.2-.6.6-.8.4-.3-.8 0-2.4 0-2.4l-.8-7.8s1.4-3.6 1.5-4.6z"/>
  <path fill="#ffe000" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="m266.5 318.7.2 2.8s-1 0-1.7-1.2c-.9-1.3-1.2-3-1.2-3s.8-1.3 1.4 0a4 4 0 0 0 1.3 1.4zm-2-11.3a6.3 6.3 0 0 1-.6-3l.7.6c-.2 1.2 0 2.4 0 2.4z"/>
  <path fill="#d52b1e" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M261 306.3c.6-1 1.4-1.6 1.4-1.6l1.6 12.7s.4 3.2 2.4 4c0 0-1.1 11-4.7 8-.5-.5-1.2-3.9-1-5.9l1-6.4a28.5 28.5 0 0 0-1.2-7.8c-.2-.2 0-1.8.6-3z"/>
  <path fill="#d52b1e" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M259.4 304.3s-1 1-1.2 1c-.2 0 2.5 20.7 2.5 20.7s0-2.2.7-6.4c.7-3.4-.2-8-1-10.2 0 0-.8-.7-1-5z"/>
  <path fill="#f7e214" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="m264 297.4.6 7.6s-1.8-2.6-2.3-.2l-.4-3.5s1.6-2.5 2-4z"/>
  <path fill="#007934" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M265.3 307s.6-6.5 3.8-2c0 0 .3 2.7 0 3.3 0 .8-.9 1.8-1.3 2.5-.7 1-1.4-.3-1.4-.3s-.7-1-1-3.5z"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M290.4 252.7c0-3.7 1.2-9.8 1.3-14l12.8-13.1s1.6 10.5 6.2 16.6l-20.3 10.5"/>
  <path fill="#ffe000" stroke="#000" stroke-width=".1" d="M289.4 253.2c-.5-2.6-1.2-5.5-1.6-11l8.2-8c0 3.4 3.9 8.6 4.1 15"/>
  <path fill="#007934" stroke="#000" stroke-width=".1" d="M282.3 261c-1-4.5 1.4-5.1-2-11.5l7.6-7.3c1.4 4.3 2.3 7 2.2 10.8l-6.5 4.6"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M312 288c1.5-4.5-.6-13.5-.4-19.3.2-3.7-2.5-17.6-2.5-21.9l15-9.4s.7 15.3 2.5 32c1.5 8.5 1.5 16.3.4 22.8-1.6 9.3-3.2 13.1-7 17-6.6 7-20.9 3-20.9 3-12-2.6-19-10.2-19-10.2s4 1 10.3 1.6c14-1 19.4 2.5 19.8-11.8"/>
  <path fill="#f7e214" stroke="#000" stroke-width=".1" d="m271.6 297.4-.2-.1c2.6 1 6.2 2 6.2 2l8.5.7c18.4.4 16.1-11 15.4-29.4-.2-7-1.6-15.8-1.2-18.9l12.3-7c4 11.3 2.8 19.3 3.6 25 .4 6.4 1.8 18.6-.3 24-2.8 12.4-12.6 11.9-25.7 10.8a31.7 31.7 0 0 1-10.1-2.3l-8.5-4.9"/>
  <path fill="#007a3d" stroke="#000" stroke-width=".1" d="M271.4 297.1a37 37 0 0 0 6.3 2.3l8.6.9c13.3 1 21.1-8.3 19.4-29.5A66 66 0 0 0 303 250l-7.3 4.3v.7c.4 2.2 1.4 7.5 1.4 9.9 0 17-10.7 30-25.4 32.3l-.2-.1"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M320 246c-1.2 2-8.6 13.3-12.8 15.5m11.6-8.2c-1.2 2.1-10.3 14.9-14.4 15.6m16.5 3.9c-2 2.5-4.1 7.4-10.3 10.6m7.4 3.5c-4.2 4-14.4 12.4-24.4 12.8m24.4-6.4c-2 2.5-6.6 14.2-25.6 8.9m28.5-6.7c-1.2 2.8-10.7 18.4-27.7 12.3"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M301 282.5c1.6-4.6-.5-13.6-.3-19.4.2-3.7-1.5-16.5-1.5-20.8l14.1-10.5s.7 15.3 2.4 32c1.6 8.5 2.7 19 1.6 25.5-2 10.6-7 13.6-8 14.5-7.2 6.4-23.4 5.7-25 5.2-11.6-4.2-16.7-11.6-16.7-11.6s5.5 0 11.9.6c14-1 21-.4 21.4-14.7"/>
  <path fill="#ffe000" stroke="#000" stroke-width=".1" d="m260.7 291.8-.2-.2c2.6 1 6.2 2.1 6.2 2.1l8.5.7c18.4.4 16.1-11 15.4-29.4-.2-7-.4-13.3 0-16.4l11-8c4 11.3 3 17.8 3.7 23.6.4 6.3 1.8 18.5-.3 23.8-2.8 12.5-12.5 12-25.7 10.9-6.6-.6-10-2.3-10-2.3l-8.6-4.9"/>
  <path fill="#007934" stroke="#000" stroke-width=".1" d="M260.4 291.6a36.8 36.8 0 0 0 6.3 2.3l8.6.8c13.3 1.2 21.2-8.2 19.5-29.4 0-7.5.2-8-2.4-18-4 2.6-11.9 9.3-11.9 9.3s2.1 3 1.6 7.2c0 17-6.8 25.7-21.5 27.9l-1.6-14"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M309.2 240.3a60.7 60.7 0 0 1-12.8 15.6m11.6-8.2c-1.3 2.2-10.4 14.9-14.5 15.6m16.5 3.9c-2 2.5-4.1 7.4-10.3 10.6m7.4 3.5c-4.1 4-14.4 12.4-24.3 12.8m24.3-6.4c-2 2.5-6.6 14.2-25.6 8.9m28.5-6.7c-1.2 2.8-10.7 18.4-27.7 12.3"/>
  <path fill="#f7e214" stroke="#000" stroke-width=".1" d="m324 238.9.8 6.4c.3 4.7.1 8.2-.1 10.5 0 .2-.9 5.8-.6 6.1 1 1.3 1.1 1.4 2.3.5.1-.2-.5-6-.6-6.8l-.4-10.5c0-1.1-1-6.8-1-6.8s-.1-1.3-.3.6"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="m324 238.9.8 6.4c.3 4.7.1 8.2-.1 10.5l-.8 6.1c1.1 1.3 1.4 1.7 2.5.8a64 64 0 0 0-.6-7l-.4-10.6c0-1.1-1-6.8-1-6.8s-.1-1.3-.3.6z"/>
  <path fill="#f7e214" stroke="#000" stroke-width=".1" d="M324.2 237s1.2 6.5 1.3 10.2c.2 4.5.4 5.8.3 8.5l.6 4.8c.1.7-.1.1 0 .2 1 .6 1.6.1 2.1-.3.2-.2-1.5-4-1.5-4.9-.9-11.4-2.6-18.2-2.6-18.2s.7 4.1-.2-.3"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M324.2 237s1.2 6.5 1.3 10.2c.2 4.5.4 5.8.3 8.5l.6 4.8c.1.7-.1.1 0 .2 1 .6 1.6.1 2.1-.3.2-.2-1.5-4-1.5-4.9-.9-11.4-2.6-18.2-2.6-18.2s.7 4.1-.2-.3zm.5 18.5s1 .4 1.1.2m0-1.4s-.8 0-1-.2m.1-1.2s.6.4.8.2m-.7-1.8h.5m-.6-1.6h.7m-.6-2.3s.4.2.4 0m-.5-1.9h.5m.5 10.2s1 .1 1.1-.2m-1.1-2s1 0 1-.2m-1-1.4h.7m-1-1.5h.8m-.7-1.8.5-.1m-.7-1.5s.4 0 .5-.2m-.6-1.7s.4.3.4 0m0 9.6s1 0 1-.3"/>
  <path fill="#f7e214" stroke="#000" stroke-width=".1" d="m313.2 233.3.7 6.4c.3 4.7.1 8.3 0 10.5 0 .2-1 5.8-.7 6.1 1.1 1.3 1.2 1.4 2.3.5.2-.2-.5-6-.5-6.8-.2-.8-.3-7.5-.5-10.5 0-1.1-1-6.8-1-6.8s-.1-1.3-.3.6"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="m313.2 233.3.7 6.4a70 70 0 0 1 0 10.5c0 .2-1.2 8-.8 6.1 1 1.3 1.3 1.7 2.4.8a64 64 0 0 0-.6-7l-.4-10.6c0-1.1-1-6.8-1-6.8s-.1-1.3-.3.6z"/>
  <path fill="#f7e214" stroke="#000" stroke-width=".1" d="M313.3 231.4s1.2 6.5 1.4 10.2c.1 4.5.3 5.8.2 8.5l.6 4.8c.1.7 0 .2 0 .2 1 .6 1.6.1 2.2-.3.1-.2-1.5-4-1.6-4.9-.9-11.4-2.5-18.2-2.5-18.2l-.3-.3"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M313.3 231.4s1.2 6.5 1.3 10.2c.2 4.5.4 5.8.3 8.5l.6 4.8c.1.7 0 .2 0 .2 1 .6 1.6.1 2.1-.3.2-.2-1.5-4-1.5-4.9-.9-11.4-2.5-18.2-2.5-18.2l-.3-.3zm.5 18.5s1 .4 1.1.2m0-1.4s-.8 0-.9-.2m0-1.2s.7.4.8.2m-.7-1.8h.6m-.7-1.6h.7m-.6-2.3s.4.2.4 0m-.5-1.9h.5m.6 10.2s1 .1 1-.2m-1.1-2s1 0 1-.2m-1-1.4h.8m-1-1.5h.8m-.8-1.8.5-.1m-.7-1.5s.5 0 .6-.2m-.7-1.7s.5.3.4 0m.1 9.6s1 0 1-.3m-11.3-23.4s-.5 5.4-.2 8.5c.4 3.8.3 4.9.7 7v4.3c-.9.5-1.6.2-2.2-.1-.2-.1 1-3.5 1-4.2-.4-9.5.5-15.3.5-15.3l.2-.2"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M304.7 225.3s-.5 5.5-.2 8.6c.4 3.8.3 4.9.7 7v4.3c-.9.5-1.6.2-2.2-.1-.2-.1 1-3.5 1-4.2-.4-9.5.5-15.2.5-15.2l.2-.4zm.4 15.7s-1 .2-1.1 0m.8-1.8s-.9.1-1-.1m1-1.3h-.9m.8-1.2h-.7m.5-1.6h-.5m.5-1.3h-.5m.4-1.5s-.4.3-.4 0m1 8s-1 0-1-.2"/>
  <path fill="#005000" stroke="#000" stroke-width=".1" d="M271 236.4h-1 1z"/>
  <path fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M259.5 273.5s.4-.2.5 0l-.2.2-.3-.2zm1 1.2-2.2-.2"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M225.8 229.8c0-2.2 2-3.5 2.4-3.7 1-.7 1.7-1.3 4-1.6l.1.9c0 .4-.5 1.7-2.2 2.9a12.3 12.3 0 0 1-4.3 1.5z"/>
  <path fill="#a05a2c" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="m225.8 229 31.6 41 1.5-1.4-32.3-41.8-.8 2.2z"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M225.3 221s3.4-.4 3-2.3c-.6-2-2.9-2-3.8-2-1 0-4.2.6-5 1.6-1 1-3 2.6-2.4 5.3a21.3 21.3 0 0 0 2.5 6.3c1 1.8.7 3.5.5 4.2-.1.3-.4 1.4.4 1.8 1.3.5 1.6.5 2.7-.7s2.6-3.1 2.6-5.4c0-2.2 2-3.5 2.4-3.7 1-.7 1.7-1.3 4-1.6 0 0-.9-1.3-2-1.2a9 9 0 0 1-5-2.3z"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M225.3 221s3.4-.4 3-2.3c-.6-2-2.9-2-3.8-2-1 0-4.2.6-5 1.6-1 1-3 2.6-2.4 5.3a21.3 21.3 0 0 0 2.5 6.3c1 1.8.7 3.5.5 4.2-.1.3-.4 1.4.4 1.8 1.3.5 1.6.5 2.7-.7s2.6-3.1 2.6-5.4c0-2.2 2-3.5 2.4-3.7 1-.7 1.7-1.3 4-1.6 0 0-.9-1.3-2-1.2a9 9 0 0 1-5-2.3z"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M225.3 221c-.5 0-1.9-.6-2.8-.3-1 .4-2.8 1.5-2.5 3.1m11-.2s-1.9.8-3.3 1.8a42 42 0 0 0-3.7 3.4c-1.1 1.1-1.4 2.6-3.7 4.2m9.5-9.7-1.5 1.1c-.6.4-.8 1-1.3 1.4"/>
  <path fill="#e8a30e" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M285.7 303.1c.2 3.3 7.8 7 13.5.2 6-4.8 4.7-12.2 0-13.2l-58.3-56.8c-2.4-1.3-2.6-2.5-3.8-3.7-2.4 2.6-7.5 7.2-10.2 9.5 1.6 1.4 3 2.7 3.4 3.8l55.4 60.2z"/>
  <path fill="#e7e7e7" fill-rule="evenodd" stroke="#000" stroke-linejoin="round" stroke-width=".1" d="M237 229.4c-2.8-3.8-13.6 6-10.7 9.2 2.9 3 13.3-5.4 10.7-9.2z"/>
  <path fill="#cccccf" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M227.2 237.8c2 1.6 10-5 8.6-7.6-2.1-2.4-10.8 6.1-8.6 7.6z"/>
  <path fill="none" stroke="#000" stroke-width=".1" d="M230.4 243c4.8-1.5 8.3-4.7 10.5-9.6m24.5 48a17.3 17.3 0 0 0 12.2-12.5m-9.7 15.3a17.3 17.3 0 0 0 12.2-12.4m2.3 27.5a19 19 0 0 0 13-13M285 302.2a19.2 19.2 0 0 0 13-13"/>
  <path fill="none" stroke="#000" stroke-linecap="round" stroke-width=".1" d="M299.4 304c.3 1.5 1 2 2.2 1.5m-14.7-2c2.3 3.6 4.9 2.5 7 2.5"/>
  <path fill="#e8a30e" stroke="#000" stroke-width=".1" d="M302.5 304.2c0 1-.8 1.8-1.8 1.8a1.8 1.8 0 0 1-1.9-1.8c0-1 .9-1.8 1.9-1.8 1 0 1.8 1.1 1.8 2"/>
  <path fill="none" stroke="#000" stroke-linecap="round" stroke-width=".1" d="M299.2 303.9c.3 1.4 1 1.9 2.2 1.4m-14.5-1.9c2.3 3.7 4.9 2.6 7 2.6"/>
  <path fill="#007934" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M277 187.2c1.9 3 4.7 8.5 5.4 12.7a24 24 0 0 1-7.5 22.3c-5.5 5-14 6.5-17.7 7.2-3.5.8-6.1 2-6.7 2.7 0-.6-.1-1.1.5-1.7 1.7-.7 4.4-1.2 8.3-2 7.7-1.6 15.8-4.5 20.2-12.9 5.8-11 2.4-19.7-2.6-28.2z"/>
  <path fill="#d52b1e" stroke="#000" stroke-width=".1" d="M279 220a.5.6 49.9 0 1-.6-.7.5.6 49.9 0 1 .7.7z"/>
  <path fill="#007934" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M284.4 218.6c-1.2.7-2.3.9-3.2 1.2l-2.4.7-1.6.7c-.8.4-1.7 1.5-1.7 1.5s1.3 1.3 2.8 1.1c1.2-.1 1.8-.5 2.4-.8.7-.3.6-.6 1.6-1.3 1-.7 1.6-2.1 2-3.1zm-6 1.3c-.4.6-1.3.5-1.8.4l-.3.3c.7 0 1.7 0 2.1-.6v-.1z"/>
  <path fill="#007934" fill-rule="evenodd" stroke="#000" stroke-width=".1" d="M284.3 218.7a17.7 17.7 0 0 1-4.9 3c-2 .8-4.2 1-5.3 1l-.3.3a19.6 1vbar-brand:focus,.navbar-dark .navbar-brand:hover{color:#fff}.navbar-dark .navbar-nav .nav-link{color:rgba(255,255,255,.75)}.navbar-dark .navbar-nav .nav-link:focus,.navbar-dark .navbar-nav .nav-link:hover{color:#fff}.navbar-dark .navbar-nav .nav-link.disabled{color:rgba(255,255,255,.25)}.navbar-dark .navbar-nav .active>.nav-link,.navbar-dark .navbar-nav .nav-link.active,.navbar-dark .navbar-nav .nav-link.show,.navbar-dark .navbar-nav .show>.nav-link{color:#fff}.navbar-dark .navbar-toggler{color:rgba(255,255,255,.75);border-color:rgba(255,255,255,.1)}.navbar-dark .navbar-toggler-icon{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28255, 255, 255, 0.75%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E")}.navbar-dark .navbar-text{color:rgba(255,255,255,.75)}.navbar-dark .navbar-text a{color:#fff}.navbar-dark .navbar-text a:focus,.navbar-dark .navbar-text a:hover{color:#fff}.card{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:0 solid rgba(0,0,0,.125);border-radius:.25rem}.card>hr{margin-right:0;margin-left:0}.card>.list-group{border-top:inherit;border-bottom:inherit}.card>.list-group:first-child{border-top-width:0;border-top-left-radius:calc(.25rem - 0);border-top-right-radius:calc(.25rem - 0)}.card>.list-group:last-child{border-bottom-width:0;border-bottom-right-radius:calc(.25rem - 0);border-bottom-left-radius:calc(.25rem - 0)}.card>.card-header+.list-group,.card>.list-group+.card-footer{border-top:0}.card-body{-ms-flex:1 1 auto;flex:1 1 auto;min-height:1px;padding:1.25rem}.card-title{margin-bottom:.75rem}.card-subtitle{margin-top:-.375rem;margin-bottom:0}.card-text:last-child{margin-bottom:0}.card-link:hover{text-decoration:none}.card-link+.card-link{margin-left:1.25rem}.card-header{padding:.75rem 1.25rem;margin-bottom:0;background-color:rgba(0,0,0,.03);border-bottom:0 solid rgba(0,0,0,.125)}.card-header:first-child{border-radius:calc(.25rem - 0) calc(.25rem - 0) 0 0}.card-footer{padding:.75rem 1.25rem;background-color:rgba(0,0,0,.03);border-top:0 solid rgba(0,0,0,.125)}.card-footer:last-child{border-radius:0 0 calc(.25rem - 0) calc(.25rem - 0)}.card-header-tabs{margin-right:-.625rem;margin-bottom:-.75rem;margin-left:-.625rem;border-bottom:0}.card-header-pills{margin-right:-.625rem;margin-left:-.625rem}.card-img-overlay{position:absolute;top:0;right:0;bottom:0;left:0;padding:1.25rem;border-radius:calc(.25rem - 0)}.card-img,.card-img-bottom,.card-img-top{-ms-flex-negative:0;flex-shrink:0;width:100%}.card-img,.card-img-top{border-top-left-radius:calc(.25rem - 0);border-top-right-radius:calc(.25rem - 0)}.card-img,.card-img-bottom{border-bottom-right-radius:calc(.25rem - 0);border-bottom-left-radius:calc(.25rem - 0)}.card-deck .card{margin-bottom:7.5px}@media (min-width:576px){.card-deck{display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap;margin-right:-7.5px;margin-left:-7.5px}.card-deck .card{-ms-flex:1 0 0%;flex:1 0 0%;margin-right:7.5px;margin-bottom:0;margin-left:7.5px}}.card-group>.card{margin-bottom:7.5px}@media (min-width:576px){.card-group{display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap}.card-group>.card{-ms-flex:1 0 0%;flex:1 0 0%;margin-bottom:0}.card-group>.card+.card{margin-left:0;border-left:0}.card-group>.card:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0}.card-group>.card:not(:last-child) .card-header,.card-group>.card:not(:last-child) .card-img-top{border-top-right-radius:0}.card-group>.card:not(:last-child) .card-footer,.card-group>.card:not(:last-child) .card-img-bottom{border-bottom-right-radius:0}.card-group>.card:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.card-group>.card:not(:first-child) .card-header,.card-group>.card:not(:first-child) .card-img-top{border-top-left-radius:0}.card-group>.card:not(:first-child) .card-footer,.card-group>.card:not(:first-child) .card-img-bottom{border-bottom-left-radius:0}}.card-columns .card{margin-bottom:.75rem}@media (min-width:576px){.card-columns{-webkit-column-count:3;-moz-column-count:3;column-count:3;-webkit-column-gap:1.25rem;-moz-column-gap:1.25rem;column-gap:1.25rem;orphans:1;widows:1}.card-columns .card{display:inline-block;width:100%}}.accordion{overflow-anchor:none}.accordion>.card{overflow:hidden}.accordion>.card:not(:last-of-type){border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.accordion>.card:not(:first-of-type){border-top-left-radius:0;border-top-right-radius:0}.accordion>.card>.card-header{border-radius:0;margin-bottom:0}.breadcrumb{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:.75rem 1rem;margin-bottom:1rem;list-style:none;background-color:#e9ecef;border-radius:.25rem}.breadcrumb-item+.breadcrumb-item{padding-left:.5rem}.breadcrumb-item+.breadcrumb-item::before{float:left;padding-right:.5rem;color:#6c757d;content:"/"}.breadcrumb-item+.breadcrumb-item:hover::before{text-decoration:underline}.breadcrumb-item+.breadcrumb-item:hover::before{text-decoration:none}.breadcrumb-item.active{color:#6c757d}.pagination{display:-ms-flexbox;display:flex;padding-left:0;list-style:none;border-radius:.25rem}.page-link{position:relative;display:block;padding:.5rem .75rem;margin-left:-1px;line-height:1.25;color:#007bff;background-color:#fff;border:1px solid #dee2e6}.page-link:hover{z-index:2;color:#0056b3;text-decoration:none;background-color:#e9ecef;border-color:#dee2e6}.page-link:focus{z-index:3;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.page-item:first-child .page-link{margin-left:0;border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.page-item:last-child .page-link{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.page-item.active .page-link{z-index:3;color:#fff;background-color:#007bff;border-color:#007bff}.page-item.disabled .page-link{color:#6c757d;pointer-events:none;cursor:auto;background-color:#fff;border-color:#dee2e6}.pagination-lg .page-link{padding:.75rem 1.5rem;font-size:1.25rem;line-height:1.5}.pagination-lg .page-item:first-child .page-link{border-top-left-radius:.3rem;border-bottom-left-radius:.3rem}.pagination-lg .page-item:last-child .page-link{border-top-right-radius:.3rem;border-bottom-right-radius:.3rem}.pagination-sm .page-link{padding:.25rem .5rem;font-size:.875rem;line-height:1.5}.pagination-sm .page-item:first-child .page-link{border-top-left-radius:.2rem;border-bottom-left-radius:.2rem}.pagination-sm .page-item:last-child .page-link{border-top-right-radius:.2rem;border-bottom-right-radius:.2rem}.badge{display:inline-block;padding:.25em .4em;font-size:75%;font-weight:700;line-height:1;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.badge{transition:none}}a.badge:focus,a.badge:hover{text-decoration:none}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.badge-pill{padding-right:.6em;padding-left:.6em;border-radius:10rem}.badge-primary{color:#fff;background-color:#007bff}a.badge-primary:focus,a.badge-primary:hover{color:#fff;background-color:#0062cc}a.badge-primary.focus,a.badge-primary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.badge-secondary{color:#fff;background-color:#6c757d}a.badge-secondary:focus,a.badge-secondary:hover{color:#fff;background-color:#545b62}a.badge-secondary.focus,a.badge-secondary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.badge-success{color:#fff;background-color:#28a745}a.badge-success:focus,a.badge-success:hover{color:#fff;background-color:#1e7e34}a.badge-success.focus,a.badge-success:focus{outline:0;box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.badge-info{color:#fff;background-color:#17a2b8}a.badge-info:focus,a.badge-info:hover{color:#fff;background-color:#117a8b}a.badge-info.focus,a.badge-info:focus{outline:0;box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.badge-warning{color:#1f2d3d;background-color:#ffc107}a.badge-warning:focus,a.badge-warning:hover{color:#1f2d3d;background-color:#d39e00}a.badge-warning.focus,a.badge-warning:focus{outline:0;box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.badge-danger{color:#fff;background-color:#dc3545}a.badge-danger:focus,a.badge-danger:hover{color:#fff;background-color:#bd2130}a.badge-danger.focus,a.badge-danger:focus{outline:0;box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.badge-light{color:#1f2d3d;background-color:#f8f9fa}a.badge-light:focus,a.badge-light:hover{color:#1f2d3d;background-color:#dae0e5}a.badge-light.focus,a.badge-light:focus{outline:0;box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.badge-dark{color:#fff;background-color:#343a40}a.badge-dark:focus,a.badge-dark:hover{color:#fff;background-color:#1d2124}a.badge-dark.focus,a.badge-dark:focus{outline:0;box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.jumbotron{padding:2rem 1rem;margin-bottom:2rem;background-color:#e9ecef;border-radius:.3rem}@media (min-width:576px){.jumbotron{padding:4rem 2rem}}.jumbotron-fluid{padding-right:0;padding-left:0;border-radius:0}.alert{position:relative;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.alert-heading{color:inherit}.alert-link{font-weight:700}.alert-dismissible{padding-right:4rem}.alert-dismissible .close,.alert-dismissible .mailbox-attachment-close{position:absolute;top:0;right:0;z-index:2;padding:.75rem 1.25rem;color:inherit}.alert-primary{color:#004085;background-color:#cce5ff;border-color:#b8daff}.alert-primary hr{border-top-color:#9fcdff}.alert-primary .alert-link{color:#002752}.alert-secondary{color:#383d41;background-color:#e2e3e5;border-color:#d6d8db}.alert-secondary hr{border-top-color:#c8cbcf}.alert-secondary .alert-link{color:#202326}.alert-success{color:#155724;background-color:#d4edda;border-color:#c3e6cb}.alert-success hr{border-top-color:#b1dfbb}.alert-success .alert-link{color:#0b2e13}.alert-info{color:#0c5460;background-color:#d1ecf1;border-color:#bee5eb}.alert-info hr{border-top-color:#abdde5}.alert-info .alert-link{color:#062c33}.alert-warning{color:#856404;background-color:#fff3cd;border-color:#ffeeba}.alert-warning hr{border-top-color:#ffe8a1}.alert-warning .alert-link{color:#533f03}.alert-danger{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb}.alert-danger hr{border-top-color:#f1b0b7}.alert-danger .alert-link{color:#491217}.alert-light{color:#818182;background-color:#fefefe;border-color:#fdfdfe}.alert-light hr{border-top-color:#ececf6}.alert-light .alert-link{color:#686868}.alert-dark{color:#1b1e21;background-color:#d6d8d9;border-color:#c6c8ca}.alert-dark hr{border-top-color:#b9bbbe}.alert-dark .alert-link{color:#040505}@-webkit-keyframes progress-bar-stripes{from{background-position:1rem 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:1rem 0}to{background-position:0 0}}.progress{display:-ms-flexbox;display:flex;height:1rem;overflow:hidden;line-height:0;font-size:.75rem;background-color:#e9ecef;border-radius:.25rem;box-shadow:inset 0 .1rem .1rem rgba(0,0,0,.1)}.progress-bar{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;overflow:hidden;color:#fff;text-align:center;white-space:nowrap;background-color:#007bff;transition:width .6s ease}@media (prefers-reduced-motion:reduce){.progress-bar{transition:none}}.progress-bar-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.progress-bar-animated{-webkit-animation:1s linear infinite progress-bar-stripes;animation:1s linear infinite progress-bar-stripes}@media (prefers-reduced-motion:reduce){.progress-bar-animated{-webkit-animation:none;animation:none}}.media{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start}.media-body{-ms-flex:1;flex:1}.list-group{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding-left:0;margin-bottom:0;border-radius:.25rem}.list-group-item-action{width:100%;color:#495057;text-align:inherit}.list-group-item-action:focus,.list-group-item-action:hover{z-index:1;color:#495057;text-decoration:none;background-color:#f8f9fa}.list-group-item-action:active{color:#212529;background-color:#e9ecef}.list-group-item{position:relative;display:block;padding:.75rem 1.25rem;background-color:#fff;border:1px solid rgba(0,0,0,.125)}.list-group-item:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.list-group-item:last-child{border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.list-group-item.disabled,.list-group-item:disabled{color:#6c757d;pointer-events:none;background-color:#fff}.list-group-item.active{z-index:2;color:#fff;background-color:#007bff;border-color:#007bff}.list-group-item+.list-group-item{border-top-width:0}.list-group-item+.list-group-item.active{margin-top:-1px;border-top-width:1px}.list-group-horizontal{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal>.list-group-item.active{margin-top:0}.list-group-horizontal>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}@media (min-width:576px){.list-group-horizontal-sm{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-sm>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-sm>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-sm>.list-group-item.active{margin-top:0}.list-group-horizontal-sm>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-sm>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}@media (min-width:768px){.list-group-horizontal-md{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-md>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-md>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-md>.list-group-item.active{margin-top:0}.list-group-horizontal-md>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-md>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}@media (min-width:992px){.list-group-horizontal-lg{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-lg>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-lg>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-lg>.list-group-item.active{margin-top:0}.list-group-horizontal-lg>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-lg>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}@media (min-width:1200px){.list-group-horizontal-xl{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-xl>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-xl>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-xl>.list-group-item.active{margin-top:0}.list-group-horizontal-xl>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-xl>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}.list-group-flush{border-radius:0}.list-group-flush>.list-group-item{border-width:0 0 1px}.list-group-flush>.list-group-item:last-child{border-bottom-width:0}.list-group-item-primary{cet-user-2 .widget-user-image > img {\n  float: left;\n  height: auto;\n  width: 65px;\n}\n\n.mailbox-messages > .table {\n  margin: 0;\n}\n\n.mailbox-controls {\n  padding: 5px;\n}\n\n.mailbox-controls.with-border {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n}\n\n.mailbox-read-info {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n  padding: 10px;\n}\n\n.mailbox-read-info h3 {\n  font-size: 20px;\n  margin: 0;\n}\n\n.mailbox-read-info h5 {\n  margin: 0;\n  padding: 5px 0 0;\n}\n\n.mailbox-read-time {\n  color: #999;\n  font-size: 13px;\n}\n\n.mailbox-read-message {\n  padding: 10px;\n}\n\n.mailbox-attachments {\n  padding-left: 0;\n  list-style: none;\n}\n\n.mailbox-attachments li {\n  border: 1px solid #eee;\n  float: left;\n  margin-bottom: 10px;\n  margin-right: 10px;\n  width: 200px;\n}\n\n.mailbox-attachment-name {\n  color: #666;\n  font-weight: 700;\n}\n\n.mailbox-attachment-icon,\n.mailbox-attachment-info,\n.mailbox-attachment-size {\n  display: block;\n}\n\n.mailbox-attachment-info {\n  background-color: #f8f9fa;\n  padding: 10px;\n}\n\n.mailbox-attachment-size {\n  color: #999;\n  font-size: 12px;\n}\n\n.mailbox-attachment-size > span {\n  display: inline-block;\n  padding-top: .75rem;\n}\n\n.mailbox-attachment-icon {\n  color: #666;\n  font-size: 65px;\n  max-height: 132.5px;\n  padding: 20px 10px;\n  text-align: center;\n}\n\n.mailbox-attachment-icon.has-img {\n  padding: 0;\n}\n\n.mailbox-attachment-icon.has-img > img {\n  height: auto;\n  max-width: 100%;\n}\n\n.lockscreen {\n  background-color: #e9ecef;\n}\n\n.lockscreen .lockscreen-name {\n  font-weight: 600;\n  text-align: center;\n}\n\n.lockscreen-logo {\n  font-size: 35px;\n  font-weight: 300;\n  margin-bottom: 25px;\n  text-align: center;\n}\n\n.lockscreen-logo a {\n  color: #495057;\n}\n\n.lockscreen-wrapper {\n  margin: 0 auto;\n  margin-top: 10%;\n  max-width: 400px;\n}\n\n.lockscreen-item {\n  border-radius: 4px;\n  background-color: #fff;\n  margin: 10px auto 30px;\n  padding: 0;\n  position: relative;\n  width: 290px;\n}\n\n.lockscreen-image {\n  border-radius: 50%;\n  background-color: #fff;\n  left: -10px;\n  padding: 5px;\n  position: absolute;\n  top: -25px;\n  z-index: 10;\n}\n\n.lockscreen-image > img {\n  border-radius: 50%;\n  height: 70px;\n  width: 70px;\n}\n\n.lockscreen-credentials {\n  margin-left: 70px;\n}\n\n.lockscreen-credentials .form-control {\n  border: 0;\n}\n\n.lockscreen-credentials .btn {\n  background-color: #fff;\n  border: 0;\n  padding: 0 10px;\n}\n\n.lockscreen-footer {\n  margin-top: 10px;\n}\n\n.dark-mode .lockscreen-item {\n  background-color: #343a40;\n}\n\n.dark-mode .lockscreen-logo a {\n  color: #fff;\n}\n\n.dark-mode .lockscreen-credentials .btn {\n  background-color: #343a40;\n}\n\n.dark-mode .lockscreen-image {\n  background-color: #6c757d;\n}\n\n.login-logo,\n.register-logo {\n  font-size: 2.1rem;\n  font-weight: 300;\n  margin-bottom: .9rem;\n  text-align: center;\n}\n\n.login-logo a,\n.register-logo a {\n  color: #495057;\n}\n\n.login-page,\n.register-page {\n  align-items: center;\n  background-color: #e9ecef;\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  justify-content: center;\n}\n\n.login-box,\n.register-box {\n  width: 360px;\n}\n\n@media (max-width: 576px) {\n  .login-box,\n  .register-box {\n    margin-top: .5rem;\n    width: 90%;\n  }\n}\n\n.login-box .card,\n.register-box .card {\n  margin-bottom: 0;\n}\n\n.login-card-body,\n.register-card-body {\n  background-color: #fff;\n  border-top: 0;\n  color: #666;\n  padding: 20px;\n}\n\n.login-card-body .input-group .form-control,\n.register-card-body .input-group .form-control {\n  border-right: 0;\n}\n\n.login-card-body .input-group .form-control:focus,\n.register-card-body .input-group .form-control:focus {\n  box-shadow: none;\n}\n\n.login-card-body .input-group .form-control:focus ~ .input-group-prepend .input-group-text,\n.login-card-body .input-group .form-control:focus ~ .input-group-append .input-group-text,\n.register-card-body .input-group .form-control:focus ~ .input-group-prepend .input-group-text,\n.register-card-body .input-group .form-control:focus ~ .input-group-append .input-group-text {\n  border-color: #80bdff;\n}\n\n.login-card-body .input-group .form-control.is-valid:focus,\n.register-card-body .input-group .form-control.is-valid:focus {\n  box-shadow: none;\n}\n\n.login-card-body .input-group .form-control.is-valid ~ .input-group-prepend .input-group-text,\n.login-card-body .input-group .form-control.is-valid ~ .input-group-append .input-group-text,\n.register-card-body .input-group .form-control.is-valid ~ .input-group-prepend .input-group-text,\n.register-card-body .input-group .form-control.is-valid ~ .input-group-append .input-group-text {\n  border-color: #28a745;\n}\n\n.login-card-body .input-group .form-control.is-invalid:focus,\n.register-card-body .input-group .form-control.is-invalid:focus {\n  box-shadow: none;\n}\n\n.login-card-body .input-group .form-control.is-invalid ~ .input-group-append .input-group-text,\n.register-card-body .input-group .form-control.is-invalid ~ .input-group-append .input-group-text {\n  border-color: #dc3545;\n}\n\n.login-card-body .input-group .input-group-text,\n.register-card-body .input-group .input-group-text {\n  background-color: transparent;\n  border-bottom-right-radius: 0.25rem;\n  border-left: 0;\n  border-top-right-radius: 0.25rem;\n  color: #777;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n\n.login-box-msg,\n.register-box-msg {\n  margin: 0;\n  padding: 0 20px 20px;\n  text-align: center;\n}\n\n.social-auth-links {\n  margin: 10px 0;\n}\n\n.dark-mode .login-card-body,\n.dark-mode .register-card-body {\n  background-color: #343a40;\n  border-color: #6c757d;\n  color: #fff;\n}\n\n.dark-mode .login-logo a,\n.dark-mode .register-logo a {\n  color: #fff;\n}\n\n.error-page {\n  margin: 20px auto 0;\n  width: 600px;\n}\n\n@media (max-width: 767.98px) {\n  .error-page {\n    width: 100%;\n  }\n}\n\n.error-page > .headline {\n  float: left;\n  font-size: 100px;\n  font-weight: 300;\n}\n\n@media (max-width: 767.98px) {\n  .error-page > .headline {\n    float: none;\n    text-align: center;\n  }\n}\n\n.error-page > .error-content {\n  display: block;\n  margin-left: 190px;\n}\n\n@media (max-width: 767.98px) {\n  .error-page > .error-content {\n    margin-left: 0;\n  }\n}\n\n.error-page > .error-content > h3 {\n  font-size: 25px;\n  font-weight: 300;\n}\n\n@media (max-width: 767.98px) {\n  .error-page > .error-content > h3 {\n    text-align: center;\n  }\n}\n\n.invoice {\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.125);\n  position: relative;\n}\n\n.invoice-title {\n  margin-top: 0;\n}\n\n.dark-mode .invoice {\n  background-color: #343a40;\n}\n\n.profile-user-img {\n  border: 3px solid #adb5bd;\n  margin: 0 auto;\n  padding: 3px;\n  width: 100px;\n}\n\n.profile-username {\n  font-size: 21px;\n  margin-top: 5px;\n}\n\n.post {\n  border-bottom: 1px solid #adb5bd;\n  color: #666;\n  margin-bottom: 15px;\n  padding-bottom: 15px;\n}\n\n.post:last-of-type {\n  border-bottom: 0;\n  margin-bottom: 0;\n  padding-bottom: 0;\n}\n\n.post .user-block {\n  margin-bottom: 15px;\n  width: 100%;\n}\n\n.post .row {\n  width: 100%;\n}\n\n.dark-mode .post {\n  color: #fff;\n  border-color: #6c757d;\n}\n\n.product-image {\n  max-width: 100%;\n  height: auto;\n  width: 100%;\n}\n\n.product-image-thumbs {\n  align-items: stretch;\n  display: flex;\n  margin-top: 2rem;\n}\n\n.product-image-thumb {\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075);\n  border-radius: 0.25rem;\n  background-color: #fff;\n  border: 1px solid #dee2e6;\n  display: flex;\n  margin-right: 1rem;\n  max-width: 7rem;\n  padding: 0.5rem;\n}\n\n.product-image-thumb img {\n  max-width: 100%;\n  height: auto;\n  align-self: center;\n}\n\n.product-image-thumb:hover {\n  opacity: .5;\n}\n\n.product-share a {\n  margin-right: .5rem;\n}\n\n.projects td {\n  vertical-align: middle;\n}\n\n.projects .list-inline {\n  margin-bottom: 0;\n}\n\n.projects img.table-avatar,\n.projects .table-avatar img {\n  border-radius: 50%;\n  display: inline;\n  width: 2.5rem;\n}\n\n.projects .project-state {\n  text-align: center;\n}\n\nbody.iframe-mode .main-sidebar {\n  display: none;\n}\n\nbody.iframe-mode .content-wrapper {\n  margin-left: 0 !important;\n  margin-top: 0 !important;\n  padding-bottom: 0 !important;\n}\n\nbody.iframe-mode .main-header,\nbody.iframe-mode .main-footer {\n  display: none;\n}\n\nbody.iframe-mode-fullscreen {\n  overflow: hidden;\n}\n\nbody.iframe-mode-fullscreen.layout-navbar-fixed .wrapper .content-wrapper {\n  margin-top: 0 !important;\n}\n\n.content-wrapper {\n  height: 100%;\n}\n\n.content-wrapper.iframe-mode .btn-iframe-close {\n  color: #dc3545;\n  position: absolute;\n  line-height: 1;\n  right: .125rem;\n  top: .125rem;\n  z-index: 10;\n  visibility: hidden;\n}\n\n.content-wrapper.iframe-mode .btn-iframe-close:hover, .content-wrapper.iframe-mode .btn-iframe-close:focus {\n  animation-name: fadeIn;\n  animation-duration: 0.3s;\n  animation-fill-mode: both;\n  visibility: visible;\n}\n\n@media (hover: none) and (pointer: coarse) {\n  .content-wrapper.iframe-mode .btn-iframe-close {\n    visibility: visible;\n  }\n}\n\n.content-wrapper.iframe-mode .navbar-nav {\n  overflow-y: auto;\n  width: 100%;\n}\n\n.content-wrapper.iframe-mode .navbar-nav .nav-link {\n  white-space: nowrap;\n}\n\n.content-wrapper.iframe-mode .navbar-nav .nav-item {\n  position: relative;\n}\n\n.content-wrapper.iframe-mode .navbar-nav .nav-item:hover .btn-iframe-close, .content-wrapper.iframe-mode .navbar-nav .nav-item:focus .btn-iframe-close {\n  animation-name: fadeIn;\n  animation-duration: 0.3s;\n  animation-fill-mode: both;\n  visibility: visible;\n}\n\n@media (hover: none) and (pointer: coarse) {\n  .content-wrapper.iframe-mode .navbar-nav .nav-item:hover .btn-iframe-close, .content-wrapper.iframe-mode .navbar-nav .nav-item:focus .btn-iframe-close {\n    visibility: visible;\n  }\n}\n\n.content-wrapper.iframe-mode .tab-content {\n  position: relative;\n}\n\n.content-wrapper.iframe-mode .tab-pane + .tab-empty {\n  display: none;\n}\n\n.content-wrapper.iframe-mode .tab-empty {\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.content-wrapper.iframe-mode .tab-loading {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  display: none;\n  background-color: #f4f6f9;\n}\n\n.content-wrapper.iframe-mode .tab-loading > div {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n}\n\n.content-wrapper.iframe-mode iframe {\n  border: 0;\n  width: 100%;\n  height: 100%;\n  margin-bottom: -8px;\n}\n\n.content-wrapper.iframe-mode iframe .content-wrapper {\n  padding-bottom: 0 !important;\n}\n\nbody.iframe-mode-fullscreen .content-wrapper.iframe-mode {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  margin-left: 0 !important;\n  height: 100%;\n  min-height: 100%;\n  z-index: 1048;\n}\n\n.permanent-btn-iframe-close .btn-iframe-close {\n  animation: none !important;\n  visibility: visible !important;\n  opacity: 1;\n}\n\n.dark-mode .content-wrapper.iframe-mode .tab-loading {\n  background-color: #343a40;\n}\n\n.content-wrapper.kanban {\n  height: 1px;\n}\n\n.content-wrapper.kanban .content {\n  height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.content-wrapper.kanban .content .container,\n.content-wrapper.kanban .content .container-fluid,\n.content-wrapper.kanban .content .container-sm,\n.content-wrapper.kanban .content .container-md,\n.content-wrapper.kanban .content .container-lg,\n.content-wrapper.kanban .content .container-xl {\n  width: max-content;\n  display: flex;\n  align-items: stretch;\n}\n\n.content-wrapper.kanban .content-header + .content {\n  height: calc(100% - ((2 * 15px) + (1.8rem * 1.2)));\n}\n\n.content-wrapper.kanban .card .card-body {\n  padding: .5rem;\n}\n\n.content-wrapper.kanban .card.card-row {\n  width: 340px;\n  display: inline-block;\n  margin: 0 .5rem;\n}\n\n.content-wrapper.kanban .card.card-row:first-child {\n  margin-left: 0;\n}\n\n.content-wrapper.kanban .card.card-row .card-body {\n  height: calc(100% - (12px + (1.8rem * 1.2) + .5rem));\n  overflow-y: auto;\n}\n\n.content-wrapper.kanban .card.card-row .card:last-child {\n  margin-bottom: 0;\n  border-bottom-width: 1px;\n}\n\n.content-wrapper.kanban .card.card-row .card .card-header {\n  padding: .5rem .75rem;\n}\n\n.content-wrapper.kanban .card.card-row .card .card-body {\n  padding: .75rem;\n}\n\n.content-wrapper.kanban .btn-tool.btn-link {\n  text-decoration: underline;\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.fc-button {\n  background: #f8f9fa;\n  background-image: none;\n  border-bottom-color: #ddd;\n  border-color: #ddd;\n  color: #495057;\n}\n\n.fc-button:hover, .fc-button:active, .fc-button.hover {\n  background-color: #e9e9e9;\n}\n\n.fc-header-title h2 {\n  color: #666;\n  font-size: 15px;\n  line-height: 1.6em;\n  margin-left: 10px;\n}\n\n.fc-header-right {\n  padding-right: 10px;\n}\n\n.fc-header-left {\n  padding-left: 10px;\n}\n\n.fc-widget-header {\n  background: #fafafa;\n}\n\n.fc-grid {\n  border: 0;\n  width: 100%;\n}\n\n.fc-widget-header:first-of-type,\n.fc-widget-content:first-of-type {\n  border-left: 0;\n  border-right: 0;\n}\n\n.fc-widget-header:last-of-type,\n.fc-widget-content:last-of-type {\n  border-right: 0;\n}\n\n.fc-toolbar,\n.fc-toolbar.fc-header-toolbar {\n  margin: 0;\n  padding: 1rem;\n}\n\n@media (max-width: 575.98px) {\n  .fc-toolbar {\n    flex-direction: column;\n  }\n  .fc-toolbar .fc-left {\n    order: 1;\n    margin-bottom: .5rem;\n  }\n  .fc-toolbar .fc-center {\n    order: 0;\n    margin-bottom: .375rem;\n  }\n  .fc-toolbar .fc-right {\n    order: 2;\n  }\n}\n\n.fc-day-number {\n  font-size: 20px;\n  font-weight: 300;\n  padding-right: 10px;\n}\n\n.fc-color-picker {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.fc-color-picker > li {\n  float: left;\n  font-size: 30px;\n  line-height: 30px;\n  margin-right: 5px;\n}\n\n.fc-color-picker > li .fa,\n.fc-color-picker > li .fas,\n.fc-color-picker > li .far,\n.fc-color-picker > li .fab,\n.fc-color-picker > li .fal,\n.fc-color-picker > li .fad,\n.fc-color-picker > li .svg-inline--fa,\n.fc-color-picker > li .ion {\n  transition: transform linear .3s;\n}\n\n.fc-color-picker > li .fa:hover,\n.fc-color-picker > li .fas:hover,\n.fc-color-picker > li .far:hover,\n.fc-color-picker > li .fab:hover,\n.fc-color-picker > li .fal:hover,\n.fc-color-picker > li .fad:hover,\n.fc-color-picker > li .svg-inline--fa:hover,\n.fc-color-picker > li .ion:hover {\n  transform: rotate(30deg);\n}\n\n#add-new-event {\n  transition: all linear .3s;\n}\n\n.external-event {\n  box-shadow: 0 0 1px rgba(0, 0, 0, 0.125), 0 1px 3px rgba(0, 0, 0, 0.2);\n  border-radius: 0.25rem;\n  cursor: move;\n  font-weight: 700;\n  margin-bottom: 4px;\n  padding: 5px 10px;\n}\n\n.external-event:hover {\n  box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.2);\n}\n\n.select2-container--default .select2-selection--single {\n  border: 1px solid #ced4da;\n  padding: 0.46875rem 0.75rem;\n  height: calc(2.25rem + 2px);\n}\n\n.select2-container--default.select2-container--open .select2-selection--single {\n  border-color: #80bdff;\n}\n\n.select2-container--default .select2-dropdown {\n  border: 1px solid #ced4da;\n}\n\n.select2-container--default .select2-results__option {\n  padding: 6px 12px;\n  user-select: none;\n}\n\n.select2-container--default .select2-selection--single .select2-selection__rendered {\n  padding-left: 0;\n  height: auto;\n  margin-top: -3px;\n}\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--single .select2-selection__rendered {\n  padding-right: 6px;\n  padding-left: 20px;\n}\n\n.select2-container--default .select2-selection--single .select2-selection__arrow {\n  height: 31px;\n  right: 6px;\n}\n\n.select2-container--default .select2-selection--single .select2-selection__arrow b {\n  margin-top: 0;\n}\n\n.select2-container--default .select2-dropdown .select2-search__field,\n.select2-container--default .select2-search--inline .select2-search__field {\n  border: 1px solid #ced4da;\n}\n\n.select2-container--default .select2-dropdown .select2-search__field:focus,\n.select2-container--default .select2-search--inline .select2-search__fiel