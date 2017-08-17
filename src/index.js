const { parseExpression } = require('./parse')
const precisionCalc = require('./precisionCalc')

function calc(str) {
    return parseExpression(str)
}

for (const key in precisionCalc) {
    calc[key] = precisionCalc[key]
}

module.exports = calc
