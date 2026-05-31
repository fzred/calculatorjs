import { type Operator, binaryOp, parseNumber, roundTo } from './core'
import { CalcError } from './errors'
import type { Numeric } from './types'

/** 多参数累算：以第一个参数为初值，左结合地依次运算。 */
function reduceOp(name: string, op: Operator, nums: Numeric[]): number {
    if (nums.length === 0) throw new CalcError(`${name} 至少需要一个参数`)
    let acc = parseNumber(nums[0])
    for (let i = 1; i < nums.length; i++) {
        acc = binaryOp(acc, nums[i], op)
    }
    return acc
}

/** 精确加法，支持多参数：add(1, 2, 3) === 6。 */
export function add(...nums: Numeric[]): number {
    return reduceOp('add', '+', nums)
}

/** 精确减法（左结合）：sub(10, 1, 2) === 7。 */
export function sub(...nums: Numeric[]): number {
    return reduceOp('sub', '-', nums)
}

/** 精确乘法，支持多参数：mul(2, 3, 4) === 24。 */
export function mul(...nums: Numeric[]): number {
    return reduceOp('mul', '*', nums)
}

/** 精确除法（左结合），除数为 0 抛 CalcError。 */
export function div(...nums: Numeric[]): number {
    return reduceOp('div', '/', nums)
}

/** 四舍五入到指定小数位（默认 0 位）。 */
export function round(n: Numeric, fraction = 0): number {
    return roundTo(n, fraction, 'round')
}

/** 向下取整到指定小数位（默认 0 位）。 */
export function floor(n: Numeric, fraction = 0): number {
    return roundTo(n, fraction, 'floor')
}

/** 向上取整到指定小数位（默认 0 位）。 */
export function ceil(n: Numeric, fraction = 0): number {
    return roundTo(n, fraction, 'ceil')
}

/** 取负。 */
export function neg(n: Numeric): number {
    const v = parseNumber(n)
    return v === 0 ? 0 : -v
}

/** 绝对值。 */
export function abs(n: Numeric): number {
    return Math.abs(parseNumber(n))
}

/** 取余，符号跟随被除数 a（与 JS `%` 一致），除数为 0 抛 CalcError。 */
export function mod(a: Numeric, b: Numeric): number {
    const x = parseNumber(a)
    const y = parseNumber(b)
    if (y === 0) throw new CalcError(`取余的除数不能为 0: ${x} % ${y}`)
    const quotient = Math.trunc(binaryOp(x, y, '/'))
    return binaryOp(x, binaryOp(y, quotient, '*'), '-')
}

/** 幂运算，仅支持整数指数；负指数返回倒数；0 的负次幂抛错。 */
export function pow(base: Numeric, exp: Numeric): number {
    const b = parseNumber(base)
    const e = parseNumber(exp)
    if (!Number.isInteger(e)) throw new CalcError(`pow 仅支持整数指数: ${e}`)
    if (e === 0) return 1
    if (e < 0) {
        if (b === 0) throw new CalcError('0 不能取负次幂')
        return binaryOp(1, pow(b, -e), '/')
    }
    let result = 1
    for (let i = 0; i < e; i++) {
        result = binaryOp(result, b, '*')
    }
    return result
}
