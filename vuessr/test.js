var data = {
  value: 1
}

let bValue = 1
Object.defineProperty(data, 'value', {
  // value: 1,
  get: () => {
    return bValue
  },
  set: (newVal) => {
    bValue = newVal
    return bValue
  },
  enumerable: true, // 可枚举
  configurable: false // 可设置
})

console.log(data.value)
data.value = 123
delete data.value
console.log(data.value)