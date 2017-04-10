const { getToken } = require('./parse')

function calc(str) {
    const tokens = getToken(str)
    tokens.forEach(item => {
        console.log(item)
    })
}

calc(`123*22`)

//export default calc
