import { add, div, mul, sub } from './arithmetic'
import { parseNumber } from './core'
import { ParseError } from './errors'

enum T {
    Num = 0,
    Plus = 1,
    Minus = 2,
    Mul = 3,
    Div = 4,
    LParen = 5,
    RParen = 6,
    End = 7,
}

interface Token {
    type: T
    pos: number
    value?: string
}

/** 括号最大嵌套深度，超过则抛 ParseError（而非泄漏原生栈溢出 RangeError）。 */
const MAX_PAREN_DEPTH = 1000

const SINGLE: Record<string, T> = {
    '+': T.Plus,
    '-': T.Minus,
    '*': T.Mul,
    '/': T.Div,
    '(': T.LParen,
    ')': T.RParen,
}

function isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9'
}

function isSpace(ch: string): boolean {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r'
}

/** 词法分析：把表达式字符串切成 Token 序列，每个 Token 带起始位置。 */
function tokenize(input: string): Token[] {
    const tokens: Token[] = []
    const n = input.length
    let i = 0

    while (i < n) {
        const ch = input[i]
        if (isSpace(ch)) {
            i++
            continue
        }

        const single = SINGLE[ch]
        if (single !== undefined) {
            tokens.push({ type: single, pos: i })
            i++
            continue
        }

        if (isDigit(ch) || ch === '.') {
            const start = i
            let dotSeen = false
            let digitSeen = false
            while (i < n) {
                const c = input[i]
                if (isDigit(c)) {
                    digitSeen = true
                    i++
                } else if (c === '.') {
                    if (dotSeen) throw new ParseError('数字中包含多个小数点', i)
                    dotSeen = true
                    i++
                } else {
                    break
                }
            }
            const raw = input.slice(start, i)
            if (!digitSeen) throw new ParseError(`无效的数字: "${raw}"`, start)
            tokens.push({ type: T.Num, pos: start, value: raw })
            continue
        }

        throw new ParseError(`无法识别的字符: "${ch}"`, i)
    }

    tokens.push({ type: T.End, pos: n })
    return tokens
}

/**
 * 解析并计算算术表达式，支持 + - * / ( ) 与一元正负号。
 * 语法错误抛 ParseError（含位置信息）。
 */
export function parseExpression(input: string): number {
    if (typeof input !== 'string') {
        throw new ParseError(`表达式必须是字符串: ${typeof input}`)
    }

    const tokens = tokenize(input)
    let pos = 0
    let depth = 0
    const peek = (): Token => tokens[pos]
    const next = (): Token => tokens[pos++]

    function parsePrimary(): number {
        let token = next()
        let negate = false
        while (token.type === T.Plus || token.type === T.Minus) {
            if (token.type === T.Minus) negate = !negate
            token = next()
        }

        let value: number
        if (token.type === T.Num) {
            value = parseNumber(token.value as string)
        } else if (token.type === T.LParen) {
            // 限制括号嵌套深度，避免深层递归撑爆调用栈而泄漏原生 RangeError
            if (++depth > MAX_PAREN_DEPTH) {
                throw new ParseError('表达式嵌套层级过深', token.pos)
            }
            value = parseAddSub()
            depth--
            const close = next()
            if (close.type !== T.RParen) {
                throw new ParseError('缺少右括号 )', close.pos)
            }
        } else {
            throw new ParseError('期望数字或左括号', token.pos)
        }

        if (negate) return value === 0 ? 0 : -value
        return value
    }

    function parseMulDiv(): number {
        let value = parsePrimary()
        while (peek().type === T.Mul || peek().type === T.Div) {
            const op = next().type
            const rhs = parsePrimary()
            value = op === T.Mul ? mul(value, rhs) : div(value, rhs)
        }
        return value
    }

    function parseAddSub(): number {
        let value = parseMulDiv()
        while (peek().type === T.Plus || peek().type === T.Minus) {
            const op = next().type
            const rhs = parseMulDiv()
            value = op === T.Plus ? add(value, rhs) : sub(value, rhs)
        }
        return value
    }

    const result = parseAddSub()
    const last = peek()
    if (last.type !== T.End) {
        throw new ParseError('表达式存在多余的内容', last.pos)
    }
    return result
}
