const { parseExpression } = require('./parse')

function calc(str) {
    return parseExpression(str)
}

module.exports = calc
