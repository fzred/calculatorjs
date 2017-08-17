const calc = require('../src/index')
const precisionCalc = require('../src/precisionCalc')
var Big = require('./big.js')

const l = 0.22
const r = 0.33

console.time('node add')
for (let i = 1; i < 1000000; i++) {
  l + r
}
console.timeEnd('node add')


console.time('big add')
for (let i = 1; i < 1000000; i++) {
 new Big(l).plus(r)
}
console.timeEnd('big add')


console.time('calc add')
for (let i = 1; i < 1000000; i++) {
  calc(`${l} + ${r}`)
}
console.timeEnd('calc add')


console.time('precisionCalc add')
for (let i = 1; i < 1000000; i++) {
  precisionCalc.add(l, r)
}
console.timeEnd('precisionCalc add')
