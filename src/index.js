const { praseExpression } = require('./parse')

function calc(str) {
    console.log(praseExpression(str))
}

calc(`0.1*0.2`)
calc(`0.1*(1+0.2)`)
calc(' 1+1 * 0.2 + 0.4')
//export default calc
