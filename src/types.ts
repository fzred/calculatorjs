/** 可接受的数字输入：原生 number 或数字字符串（如 '0.1'、'-1.5e3'）。 */
export type Numeric = number | string

/**
 * `calc` 的完整类型：既是一个对表达式字符串求值的函数，
 * 又在其上挂载了全部精度运算方法。
 */
export interface CalcFn {
    /** 解析并计算算术表达式字符串，例如 `calc('1 + (2 * 3 - 1) / 4')`。 */
    (expression: string): number

    /** 精确加法，支持多参数累算：`add(1, 2, 3) === 6`。 */
    add(...nums: Numeric[]): number
    /** 精确减法（左结合）：`sub(10, 1, 2) === 7`。 */
    sub(...nums: Numeric[]): number
    /** 精确乘法：`mul(0.1, 0.2) === 0.02`，支持多参数。 */
    mul(...nums: Numeric[]): number
    /** 精确除法（左结合），除数为 0 抛 `CalcError`。 */
    div(...nums: Numeric[]): number

    /** 四舍五入（half away from zero）到指定小数位，默认 0 位。 */
    round(n: Numeric, fraction?: number): number
    /** 向下取整到指定小数位，默认 0 位。 */
    floor(n: Numeric, fraction?: number): number
    /** 向上取整到指定小数位，默认 0 位。 */
    ceil(n: Numeric, fraction?: number): number

    /** 幂运算，仅支持整数指数；负指数返回倒数。 */
    pow(base: Numeric, exp: Numeric): number
    /** 绝对值。 */
    abs(n: Numeric): number
    /** 取负。 */
    neg(n: Numeric): number
    /** 取余，符号跟随被除数（与 JS `%` 一致），除数为 0 抛 `CalcError`。 */
    mod(a: Numeric, b: Numeric): number

    /** 比较，返回 -1 / 0 / 1。 */
    cmp(a: Numeric, b: Numeric): -1 | 0 | 1
    /** a === b。 */
    eq(a: Numeric, b: Numeric): boolean
    /** a > b。 */
    gt(a: Numeric, b: Numeric): boolean
    /** a < b。 */
    lt(a: Numeric, b: Numeric): boolean
    /** a >= b。 */
    gte(a: Numeric, b: Numeric): boolean
    /** a <= b。 */
    lte(a: Numeric, b: Numeric): boolean

    /** 多参数最大值。 */
    max(...nums: Numeric[]): number
    /** 多参数最小值。 */
    min(...nums: Numeric[]): number
    /** 多参数求和。 */
    sum(...nums: Numeric[]): number
}
