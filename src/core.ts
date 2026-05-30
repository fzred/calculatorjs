import { CalcError } from './errors'
import type { Numeric } from './types'

/** 二元运算符。 */
export type Operator = '+' | '-' | '*' | '/'

/** 取整模式。 */
export type RoundMode = 'round' | 'floor' | 'ceil'

/**
 * 把数字转为不含科学计数法的定点字符串。
 * 例：1.23e-5 → '0.0000123'，1.23e21 → '1230000...'。
 * 以 `String(n)` 是否含 e/E 作为唯一开关，避免旧实现用数值阈值判断带来的误判。
 */
export function toPlainString(n: number): string {
    const s = String(n)
    if (!/[eE]/.test(s)) return s

    const [mantissa, expPart] = s.split(/[eE]/)
    const exp = Number(expPart)
    const sign = mantissa.startsWith('-') ? '-' : ''
    const body = mantissa.replace('-', '')
    const dotIndex = body.indexOf('.')
    const digits = body.replace('.', '')
    const intLen = dotIndex < 0 ? digits.length : dotIndex
    // 重建后小数点应处的位置
    const point = intLen + exp

    if (point <= 0) {
        return `${sign}0.${'0'.repeat(-point)}${digits}`
    }
    if (point >= digits.length) {
        return `${sign}${digits}${'0'.repeat(point - digits.length)}`
    }
    return `${sign}${digits.slice(0, point)}.${digits.slice(point)}`
}

/**
 * 校验并归一化输入为有限 number。
 * 非有限数（NaN / Infinity）、非法字符串、不支持的类型都会抛 CalcError。
 */
export function parseNumber(input: Numeric): number {
    if (typeof input === 'number') {
        if (!Number.isFinite(input)) throw new CalcError(`非法数值: ${input}`)
        return input
    }
    if (typeof input === 'string') {
        const s = input.trim()
        if (s === '' || !/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s)) {
            throw new CalcError(`无法解析为数字: "${input}"`)
        }
        const n = Number(s)
        if (!Number.isFinite(n)) throw new CalcError(`非法数值: "${input}"`)
        return n
    }
    throw new CalcError(`不支持的输入类型: ${typeof input}`)
}

interface Split {
    /** 去掉符号与小数点后的数字串（可能含前导 0）。 */
    digits: string
    /** 小数位数。 */
    scale: number
    /** 符号。 */
    sign: 1 | -1
}

/** 把一个数拆成 { 纯数字串, 小数位数, 符号 }。 */
function split(n: number): Split {
    const plain = toPlainString(n)
    const sign: 1 | -1 = plain.startsWith('-') ? -1 : 1
    const body = plain.replace('-', '')
    const dot = body.indexOf('.')
    if (dot < 0) {
        return { digits: body, scale: 0, sign }
    }
    return { digits: body.slice(0, dot) + body.slice(dot + 1), scale: body.length - dot - 1, sign }
}

/**
 * 加减：对齐到相同小数位后用整数运算，再缩放回去。
 * 整数化超出 Number 安全范围（2^53）时退化为原生运算——保证「不劣于原生」。
 */
function addSub(l: number, r: number, op: '+' | '-'): number {
    const a = split(l)
    const b = split(r)
    const scale = Math.max(a.scale, b.scale)
    const intA = a.sign * Number(a.digits + '0'.repeat(scale - a.scale))
    const intB = b.sign * Number(b.digits + '0'.repeat(scale - b.scale))
    const result = op === '+' ? intA + intB : intA - intB
    if (
        !Number.isSafeInteger(intA) ||
        !Number.isSafeInteger(intB) ||
        !Number.isSafeInteger(result)
    ) {
        return op === '+' ? l + r : l - r
    }
    return result / 10 ** scale
}

/**
 * 乘法：各自取整后相乘，再除以 10^(两边小数位之和)，不对齐补零。
 * 整数串乘积超出安全范围时退化为原生乘法——保证「不劣于原生」。
 */
function multiply(l: number, r: number): number {
    const a = split(l)
    const b = split(r)
    const intA = Number(a.digits)
    const intB = Number(b.digits)
    const product = intA * intB
    if (
        !Number.isSafeInteger(intA) ||
        !Number.isSafeInteger(intB) ||
        !Number.isSafeInteger(product)
    ) {
        return l * r
    }
    return (a.sign * b.sign * product) / 10 ** (a.scale + b.scale)
}

/**
 * 除法：把两边对齐到相同小数位后做一次整数除法（10^scale 相消），
 * 避免「乘以分数次幂」引入额外浮点误差。除数为 0 抛错；
 * 对齐后整数超出安全范围时退化为原生除法。
 */
function divide(l: number, r: number): number {
    const a = split(l)
    const b = split(r)
    if (Number(b.digits) === 0) throw new CalcError('除数不能为 0')
    const scale = Math.max(a.scale, b.scale)
    const intA = a.sign * Number(a.digits + '0'.repeat(scale - a.scale))
    const intB = b.sign * Number(b.digits + '0'.repeat(scale - b.scale))
    if (!Number.isSafeInteger(intA) || !Number.isSafeInteger(intB)) {
        return l / r
    }
    return intA / intB
}

/** 对两个归一化后的输入执行一次二元运算。 */
export function binaryOp(l: Numeric, r: Numeric, op: Operator): number {
    const a = parseNumber(l)
    const b = parseNumber(r)
    switch (op) {
        case '+':
        case '-':
            return addSub(a, b, op)
        case '*':
            return multiply(a, b)
        case '/':
            return divide(a, b)
    }
}

/** 把两个数对齐到相同小数位后的整数表示，用于无浮点误差的比较。 */
function alignToInt(l: number, r: number): [number, number] {
    const a = split(l)
    const b = split(r)
    const scale = Math.max(a.scale, b.scale)
    return [
        a.sign * Number(a.digits + '0'.repeat(scale - a.scale)),
        b.sign * Number(b.digits + '0'.repeat(scale - b.scale)),
    ]
}

/** 比较两个数，返回 -1 / 0 / 1（在对齐后的整数上比较，避免浮点误差）。 */
export function compareNumbers(l: Numeric, r: Numeric): -1 | 0 | 1 {
    const x = parseNumber(l)
    const y = parseNumber(r)
    const [a, b] = alignToInt(x, y)
    // 对齐后超出安全范围时退化为原生比较
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) {
        if (x < y) return -1
        if (x > y) return 1
        return 0
    }
    if (a < b) return -1
    if (a > b) return 1
    return 0
}

/** 对无符号数字串执行 +1，处理进位。例：'099' → '100'。 */
function addOneToDigits(s: string): string {
    const arr = s.split('')
    let i = arr.length - 1
    while (i >= 0) {
        if (arr[i] === '9') {
            arr[i] = '0'
            i--
        } else {
            arr[i] = String(Number(arr[i]) + 1)
            break
        }
    }
    if (i < 0) arr.unshift('1')
    return arr.join('')
}

/**
 * 基于十进制字符串的取整，彻底避开 `Math.round(n * 10 ** f)` 的二次浮点误差。
 * round 采用 half away from zero；floor 朝 -∞；ceil 朝 +∞。fraction 支持负数。
 */
export function roundTo(input: Numeric, fraction: number, mode: RoundMode): number {
    if (!Number.isInteger(fraction)) {
        throw new CalcError(`fraction 必须为整数: ${fraction}`)
    }
    const num = parseNumber(input)
    if (num === 0) return 0

    const { digits, scale, sign } = split(num)
    const dropCount = scale - fraction
    if (dropCount <= 0) return num // 已满足精度，无需取整

    // 左侧补零，保证至少能切出一位（结果可能为 0）
    const padded =
        dropCount >= digits.length ? '0'.repeat(dropCount - digits.length + 1) + digits : digits
    const cutIndex = padded.length - dropCount
    let kept = padded.slice(0, cutIndex)
    const dropped = padded.slice(cutIndex)
    const hasRemainder = /[1-9]/.test(dropped)

    let roundUp = false
    if (mode === 'round') {
        roundUp = dropped.charCodeAt(0) >= 53 // '5'
    } else if (mode === 'ceil') {
        roundUp = sign > 0 && hasRemainder
    } else {
        roundUp = sign < 0 && hasRemainder
    }
    if (roundUp) kept = addOneToDigits(kept)

    const magnitude = Number(kept)
    if (magnitude === 0) return 0
    // kept 表示 |结果| * 10^fraction
    return fraction >= 0 ? (sign * magnitude) / 10 ** fraction : sign * magnitude * 10 ** -fraction
}
