const precisionCalc = require('./precisionCalc')

const NUMBER_TOKEN = 1
const ADD_OPERATOR_TOKEN = 2
const SUB_OPERATOR_TOKEN = 3
const MUL_OPERATOR_TOKEN = 4
const DIV_OPERATOR_TOKEN = 5
const LEFT_PAREN_TOKEN = 6
const RIGHT_PAREN_TOKEN = 7
const END_TOKEN = 8

const INITIAL_STATUS = 1  // 初始化
const IN_INT_PART_STATUS = 2 // 整数
const IN_FRAC_PART_STATUS = 4 // 小数

const tokensEnum = {
    '+': ADD_OPERATOR_TOKEN,
    '-': SUB_OPERATOR_TOKEN,
    '*': MUL_OPERATOR_TOKEN,
    '/': DIV_OPERATOR_TOKEN,
    '(': LEFT_PAREN_TOKEN,
    ')': RIGHT_PAREN_TOKEN,
}

function getToken(str) {
    let linePos = 0
    let curStr

    const tokens = []

    let status = INITIAL_STATUS // 初始化状态

    while (str[linePos]) {
        curStr = str[linePos]
        const token = tokensEnum[curStr]
        if (token) {
            tokens.push({
                type: token,
            })
            status = INITIAL_STATUS
        } else if (/[0-9]/.test(curStr)) {
            if (status == INITIAL_STATUS) {
                // 数字开始
                tokens.push({
                    type: NUMBER_TOKEN,
                    value: curStr
                })
                status = IN_INT_PART_STATUS
            } else if (status == IN_INT_PART_STATUS || status == IN_FRAC_PART_STATUS) {
                // 追加数字
                const curToken = tokens[tokens.length - 1]
                curToken.value += curStr
            }
        } else if (curStr == '.') { // 小数点
            if (status == IN_INT_PART_STATUS) {
                // 输入整数状态才能有小数点
                status = IN_FRAC_PART_STATUS
                const curToken = tokens[tokens.length - 1]
                curToken.value += '.'
            } else {
                throw '语法错误'
            }
        } else if (curStr == ' ') { // 空格
            status = INITIAL_STATUS
        } else {
            throw '语法错误'
        }

        linePos++
    }

    tokens.push({
        type: END_TOKEN,
    })
    return tokens
}

function parseExpression(str) {
    const tokens = getToken(str)
    let curPos = 0
    let curToken = tokens[curPos]

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

        if (curToken.type == SUB_OPERATOR_TOKEN) {
            minusFlog = true
            nextToken()
        }

        if (curToken.type == NUMBER_TOKEN) {
            value = curToken.value
        } else if (curToken.type == LEFT_PAREN_TOKEN) {
            // 优先计算 ( ) 里的表达式
            value = parseExpression()
            nextToken()
            if (curToken.type != RIGHT_PAREN_TOKEN) {
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
            if (token.type != MUL_OPERATOR_TOKEN
                && token.type != DIV_OPERATOR_TOKEN) {
                aheadToken()
                break
            }
            v2 = parsePrimaryExpression()
            if (token.type == MUL_OPERATOR_TOKEN) {
                v1 = precisionCalc.mul(v1, v2)
            } else if (token.type == DIV_OPERATOR_TOKEN) {
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
            if (token.type != ADD_OPERATOR_TOKEN
                && token.type != SUB_OPERATOR_TOKEN) {
                aheadToken()
                break
            }
            v2 = parseTerm()
            if (token.type == ADD_OPERATOR_TOKEN) {
                v1 = precisionCalc.add(v1, v2)
            } else if (token.type == SUB_OPERATOR_TOKEN) {
                v1 = precisionCalc.sub(v1, v2)
            }
        }
        return v1
    }

    return parseExpression()

}

module.exports = {
    parseExpression,
}
