const { praseExpression } = require('./parse')

function calc(str) {
    praseExpression(str)
}

calc(`0.1*0.2`)

//export default calc
