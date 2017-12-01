'use strict'
var data = {}

var bValue = 1
Object.defineProperty(data, 'value', {
  // value: 1,
  get: () => {
    return bValue
  },
  set: (newVal) => {
    bValue = newVal
    return bValue
  },
  // default value
  // enumerable: false,
  // configurable: false,
  // writable: false,
  // for (i in data) {
  //   console.log(i)
  // }
  configurable: false, // 特性表示对象的属性是否可以被删除，以及除writable特性外的其他特性是否可以被修改。
  // detail: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  enumerable: true // 可枚举
})

console.log(data.value)
data.value = 123
// delete data.value
console.log(data.value)
