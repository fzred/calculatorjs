const precisionCalc = require('./precisionCalc')

const tokenEnum = {
    NUMBER_TOKEN: 1,
    ADD_OPERATOR_TOKEN: 2,
    SUB_OPERATOR_TOKEN: 3,
    MUL_OPERATOR_TOKEN: 4,
    DIV_OPERATOR_TOKEN: 5,
    LEFT_PAREN_TOKEN: 6,
    RIGHT_PAREN_TOKEN: 7,
    END_TOKEN: 8,
}

const lexerStatusEnum = {
    INITIAL_STATUS: 1, // 初始化
    IN_INT_PART_STATUS: 2, // 整数
    IN_FRAC_PART_STATUS: 4, // 小数
}

function getToken(str) {
    let linePos = 0
    let curStr

    const tokens = []

    let status = lexerStatusEnum.INITIAL_STATUS // 初始化状态

    while (str[linePos]) {
        curStr = str[linePos]

        if (curStr == '+') {
            tokens.push({
                type: tokenEnum.ADD_OPERATOR_TOKEN,
            })
            status = lexerStatusEnum.INITIAL_STATUS
        } else if (curStr == '-') {
            status = lexerStatusEnum.INITIAL_STATUS
            tokens.push({
                type: tokenEnum.SUB_OPERATOR_TOKEN,
            })
            status = lexerStatusEnum.INITIAL_STATUS
        } else if (curStr == '*') {
            tokens.push({
                type: tokenEnum.MUL_OPERATOR_TOKEN,
            })
            status = lexerStatusEnum.INITIAL_STATUS
        } else if (curStr == '/') {
            tokens.push({
                type: tokenEnum.DIV_OPERATOR_TOKEN,
            })
            status = lexerStatusEnum.INITIAL_STATUS
        } else if (curStr == '(') {
            tokens.push({
                type: tokenEnum.LEFT_PAREN_TOKEN,
            })
            status = lexerStatusEnum.INITIAL_STATUS
        } else if (curStr == ')') {
            tokens.push({
                type: tokenEnum.RIGHT_PAREN_TOKEN,
            })
            status = lexerStatusEnum.INITIAL_STATUS
        } else if (/[0-9]/.test(curStr)) {
            if (status == lexerStatusEnum.INITIAL_STATUS) {
                // 数字开始
                tokens.push({
                    type: tokenEnum.NUMBER_TOKEN,
                    value: curStr
                })
                status = lexerStatusEnum.IN_INT_PART_STATUS
            } else if (status == lexerStatusEnum.IN_INT_PART_STATUS || status == lexerStatusEnum.IN_FRAC_PART_STATUS) {
                // 追加数字
                const curToken = tokens[tokens.length - 1]
                curToken.value += curStr
            }
        } else if (curStr == '.') { // 小数点
            if (status == lexerStatusEnum.IN_INT_PART_STATUS) {
                // 输入整数状态才能有小数点
                status = lexerStatusEnum.IN_FRAC_PART_STATUS
                const curToken = tokens[tokens.length - 1]
                curToken.value += '.'
            } else {
                throw '语法错误'
            }
        } else if (curStr == ' ') { // 空格
            status = lexerStatusEnum.INITIAL_STATUS
        } else {
            throw '语法错误'
        }

        linePos++
    }

    tokens.push({
        type: tokenEnum.END_TOKEN,
    })
    return tokens
}

function praseExpression(str) {
    const tokens = getToken(str)
    let curPos = 0
    let curToken = tokens[curPos]
//    tokens.forEach(item => {
//        console.log(item)
//    })

    function nextToken() {
        curToken = tokens[curPos++]
        return curToken
    }

    function aheadToken() {
        curToken = tokens[--curPos]
    }

    function parsePrimaryExpression() {
        let value = 0
        let minusFlog = false // 是否负数

        nextToken()

        if (curToken.type == tokenEnum.SUB_OPERATOR_TOKEN) {
            minusFlog = true
            nextToken()
        }

        if (curToken.type == tokenEnum.NUMBER_TOKEN) {
            value = curToken.value
        } else if (curToken.type == tokenEnum.LEFT_PAREN_TOKEN) {
            // 优先计算 ( ) 里的表达式
            value = parseExpression()
            nextToken()
            if (curToken.type != tokenEnum.RIGHT_PAREN_TOKEN) {
                throw '缺少 ) '
            }
        }
        value = Number(value)
        if (minusFlog) {
            value = -value
        }
        return value
    }

    function parseTerm() {
        let v1
        let v2
        v1 = parsePrimaryExpression()
        while (true) {
            let token = nextToken()
            console.log('parseTerm', token)
            if (token.type != tokenEnum.MUL_OPERATOR_TOKEN
                && token.type != tokenEnum.DIV_OPERATOR_TOKEN) {
                aheadToken()
                break
            }
            v2 = parsePrimaryExpression()
            if (token.type == tokenEnum.MUL_OPERATOR_TOKEN) {
                v1 = precisionCalc.mul(v1, v2)
            } else if (token.type == tokenEnum.DIV_OPERATOR_TOKEN) {
                v1 = precisionCalc.div(v1, v2)
            }
        }
        return v1
    }

    function parseExpression() {
        let v1
        let v2
        v1 = parseTerm()
        while (true) {
            let token = nextToken()
            console.log('parseExpression', token)
            if (token.type != tokenEnum.ADD_OPERATOR_TOKEN
                && token.type != tokenEnum.SUB_OPERATOR_TOKEN) {
                aheadToken()
                break
            }
            v2 = parseTerm()
            if (token.type == tokenEnum.ADD_OPERATOR_TOKEN) {
                v1 = precisionCalc.add(v1, v2)
            } else if (token.type == tokenEnum.SUB_OPERATOR_TOKEN) {
                v1 = precisionCalc.sub(v1, v2)
            }
        }
        return v1
    }

    console.log(parseExpression())
}

module.exports = {
    praseExpression,
}
