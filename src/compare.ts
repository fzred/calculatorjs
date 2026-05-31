import { compareNumbers } from './core'
import type { Numeric } from './types'

/** 比较 a 与 b，返回 -1 / 0 / 1。 */
export function cmp(a: Numeric, b: Numeric): -1 | 0 | 1 {
    return compareNumbers(a, b)
}

/** a === b。 */
export function eq(a: Numeric, b: Numeric): boolean {
    return compareNumbers(a, b) === 0
}

/** a > b。 */
export function gt(a: Numeric, b: Numeric): boolean {
    return compareNumbers(a, b) > 0
}

/** a < b。 */
export function lt(a: Numeric, b: Numeric): boolean {
    return compareNumbers(a, b) < 0
}

/** a >= b。 */
export function gte(a: Numeric, b: Numeric): boolean {
    return compareNumbers(a, b) >= 0
}

/** a <= b。 */
export function lte(a: Numeric, b: Numeric): boolean {
    return compareNumbers(a, b) <= 0
}
