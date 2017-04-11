const { parseExpression } = require('./parse')

function cdalc(str) {
    return parseExpression(str)
}

module.exports = cdalc
