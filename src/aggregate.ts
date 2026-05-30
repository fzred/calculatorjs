import { add } from './arithmetic'
import { compareNumbers, parseNumber } from './core'
import { CalcError } from './errors'
import type { Numeric } from './types'

/** 多参数最大值。 */
export function max(...nums: Numeric[]): number {
    if (nums.length === 0) throw new CalcError('max 至少需要一个参数')
    return nums.map(parseNumber).reduce((m, v) => (compareNumbers(v, m) > 0 ? v : m))
}

/** 多参数最小值。 */
export function min(...nums: Numeric[]): number {
    if (nums.length === 0) throw new CalcError('min 至少需要一个参数')
    return nums.map(parseNumber).reduce((m, v) => (compareNumbers(v, m) < 0 ? v : m))
}

/** 多参数求和。 */
export function sum(...nums: Numeric[]): number {
    if (nums.length === 0) throw new CalcError('sum 至少需要一个参数')
    return add(...nums)
}
