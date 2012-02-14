/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true
         forin: true latedef: false supernew: true */
/*global define: true */

!(typeof(define) !== "function" ? function($) { $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports, typeof(module) === 'undefined' ? {} : module); } : define)(function(require, exports, module) {

"use strict";

var OIgnore = Object.getOwnPropertyNames(Object.prototype).concat('length')
var FIgnore = Object.getOwnPropertyNames(Function).concat('keys')

function hasnt(item) { return !~this.indexOf(item) }
function mirror(name) { this.to[name] = unbind(this.from[name]) }
function copy(name) { this.to[name] = this.from[name] }

// Function reflection API.
var unbind = Function.call.bind(Function.bind, Function.call)
var FunctionReflection = Function.bind(Function)
exports.FunctionReflection = FunctionReflection
exports.fn = exports.f = FunctionReflection
FunctionReflection.unbind = unbind
FunctionReflection.bind = unbind(Function.bind)
FunctionReflection.call = unbind(Function.call)
FunctionReflection.apply = unbind(Function.apply)
FunctionReflection.invoke = function invoke(f) {
  return f.call(this, slice(arguments, 1))
}

// Array reflection API.
var ArrayReflection = Array.bind(Array)
exports.ArrayReflection = ArrayReflection
exports.array = ArrayReflection

Object.getOwnPropertyNames(Array.prototype).
  filter(hasnt, OIgnore).
  forEach(mirror, { from: Array.prototype, to: ArrayReflection })

// String reflection API.
var StringRelection = String.bind(String)
exports.StringRelection = StringRelection
exports.string = StringRelection
exports.fromCharCode = String.fromCharCode

var StringPrototype = String.prototype
Object.getOwnPropertyNames(String.prototype).
  filter(hasnt, OIgnore).
  forEach(mirror, { from: String.prototype, to: StringRelection })

// Number reflection API.

var NumberReflection = Number.bind(Number)
exports.NumberReflection = NumberReflection
exports.number = NumberReflection
Object.getOwnPropertyNames(Number).
  filter(hasnt, FIgnore).
  forEach(copy, { from: Number, to: NumberReflection })
Object.getOwnPropertyNames(Number.prototype).
  filter(hasnt, OIgnore).
  forEach(mirror, { from: Number.prototype, to: NumberReflection })

// Object reflection API

function reducePrototype(object, f, result) {
  result = f(result, object)
  while ((object = getPrototypeOf(object))) result = f(result, object)
  return result
}

function add(items, item) {
  if (!items.indexOf(item)) items.push(item)
  return items
}

var ObjectReflection = Object.bind(Object)
var getOwnPropertyNames = Object.getOwnPropertyNames
var keys = Object.keys
var create = Object.create
var defineProperty = Object.defineProperty
var defineProperties = Object.defineProperties
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
var getPrototypeOf = Object.getPrototypeOf
exports.ObjectReflection = ObjectReflection
exports.object = ObjectReflection
ObjectReflection.getOwnKeys = Object.keys

Object.getOwnPropertyNames(Object).
  filter(hasnt, FIgnore).
  forEach(copy, { from: Object, to: ObjectReflection })

Object.getOwnPropertyNames(Object.prototype).
  filter(hasnt, OIgnore).
  forEach(mirror, { from: Object.prototype, to: ObjectReflection })

ObjectReflection.isEnumerable = ObjectReflection.propertyIsEnumerable
ObjectReflection.owns = ObjectReflection.hasOwnProperty

function defineAccessor(object, key, getter, setter, enumerable, configurable) {
  var descriptor = {}
  descriptor.configurable = configurable !== false
  descriptor.enumerable = enumerable !== false
  if (getter) descriptor.get = getter
  if (setter) descriptor.set = setter
  return defineProperty(object, key, descriptor)
}
ObjectReflection.defineAccessor = defineAccessor

function define(object, properties) {
  return defineProperties(object, getOwnPropertiesDescriptor(properties))
}
ObjectReflection.define = define

function getPropertyDescriptor(object, name) {
  var proto
  return getOwnPropertyDescriptor(object, name) ||
         (proto = getPrototypeOf(object) && getPropertyDescriptor(proto))
}
ObjectReflection.getPropertyDescriptor = ObjectReflection

function getKeys(object) {
  return reducePrototype(object, function(keys, object) {
    return keys(object).reduce(add, keys)
  }, [])
}
ObjectReflection.getKeys = getKeys

function getPropertyNames(object) {
  return reducePrototype(object, function(names, object) {
    getOwnPropertyNames(object).reduce(add, names)
  }, [])
}
ObjectReflection.getPropertyNames = getPropertyNames

function getOwnPropertiesDescriptor(object) {
  return getOwnPropertyNames(object).reduce(function(descriptor, name) {
    descriptor[name] = getOwnPropertyDescriptor(object, name)
    return descriptor
  }, {})
}
ObjectReflection.getOwnPropertiesDescriptor = getOwnPropertiesDescriptor

function getPropertiesDescriptor(object) {
  return reducePrototype(object, function(descriptor, object) {
    return getOwnPropertyNames(object).reduce(function(descriptor, names) {
      return names.reduce(function(name) {
        if (!(name in descriptor))
          defineProperty(descriptor, name, getOwnPropertyDescriptor(object, name))
          return descriptor
      }, descriptor)
    }, descriptor)
  }, {})
}
ObjectReflection.getPropertiesDescriptor = getPropertiesDescriptor

function extend(object, extension) {
  return create(object, getOwnPropertiesDescriptor(extension))
}
ObjectReflection.extend = extend


function hasProperty(object, name) {
  return name in object
}
ObjectReflection.hasProperty = hasProperty
ObjectReflection.has = hasProperty

function removeProperty(object, name) {
  return delete object[name]
}
ObjectReflection.removeProperty = removeProperty

function get(object, name) {
  return object[name]
}
ObjectReflection.get = get

function set(object, name, value) {
  return object[name] = value
}
ObjectReflection.set = set

// Expose shortcuts to all the APIs.

![ FunctionReflection, NumberReflection, StringRelection,
   ArrayReflection, ObjectReflection
].forEach(function(reflection) {
  Object.keys(reflection).forEach(copy, { from: reflection, to: exports })
})

});
