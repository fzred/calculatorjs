const precisionCalc = require('../src/precisionCalc')

console.time('precisionCalc')
for (let i = 0; i < 100000; i++) {
    precisionCalc.add(1.111, 0.2222)
    precisionCalc.sub(1.111, 0.2222)
    precisionCalc.mul(1.111, 0.2222)
    precisionCalc.div(1.111, 0.2222)
    precisionCalc.round(1.555, 2)
    precisionCalc.add(0.99999999999999, 0.00000000000001)
}
console.timeEnd('precisionCalc')

console.log(precisionCalc.add('0.99999999999999', '0.00000000000001'))
console.log(precisionCalc.add(0.99999999999999, 0.00000000000001))
// console.log(precisionCalc.add(0.9999999, 0.0000001))
