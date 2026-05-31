import { max, min, sum } from './aggregate'
import { abs, add, ceil, div, floor, mod, mul, neg, pow, round, sub } from './arithmetic'
import { cmp, eq, gt, gte, lt, lte } from './compare'
import { parseExpression } from './parse'
import type { CalcFn } from './types'

const calcFn = (expression: string): number => parseExpression(expression)

/**
 * 默认导出：既能作为函数计算表达式 `calc('1+2*3')`，
 * 又挂载了全部精度运算方法 `calc.add(0.1, 0.2)`。
 */
const calc: CalcFn = Object.assign(calcFn, {
    add,
    sub,
    mul,
    div,
    round,
    floor,
    ceil,
    pow,
    abs,
    neg,
    mod,
    cmp,
    eq,
    gt,
    lt,
    gte,
    lte,
    max,
    min,
    sum,
})

export {
    add,
    sub,
    mul,
    div,
    round,
    floor,
    ceil,
    pow,
    abs,
    neg,
    mod,
    cmp,
    eq,
    gt,
    lt,
    gte,
    lte,
    max,
    min,
    sum,
    calc,
}
export { CalcError, ParseError } from './errors'
export type { CalcFn, Numeric } from './types'
export default calc
