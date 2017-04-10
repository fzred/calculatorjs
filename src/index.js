const { praseExpression } = require('./parse')

function calc(str) {
    return praseExpression(str)
}

module.exports = calc
