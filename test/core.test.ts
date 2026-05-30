import { describe, expect, it } from 'vitest'
import { binaryOp, compareNumbers, parseNumber, roundTo, toPlainString } from '../src/core'

describe('toPlainString', () => {
    it('普通数字原样返回', () => {
        expect(toPlainString(123)).toBe('123')
        expect(toPlainString(1.5)).toBe('1.5')
        expect(toPlainString(0)).toBe('0')
        expect(toPlainString(-0.25)).toBe('-0.25')
    })

    it('负指数科学计数法转定点', () => {
        expect(toPlainString(1e-7)).toBe('0.0000001')
        expect(toPlainString(1.23e-5)).toBe('0.0000123')
        expect(toPlainString(-5e-7)).toBe('-0.0000005')
    })

    it('正指数科学计数法转定点', () => {
        expect(toPlainString(1.23e5)).toBe('123000')
        expect(toPlainString(1e21)).toBe('1000000000000000000000')
        expect(toPlainString(1.234e2)).toBe('123.4')
    })
})

describe('parseNumber', () => {
    it('接受 number 与数字字符串', () => {
        expect(parseNumber(1.5)).toBe(1.5)
        expect(parseNumber('1.5')).toBe(1.5)
        expect(parseNumber('  2.5  ')).toBe(2.5)
        expect(parseNumber('.5')).toBe(0.5)
        expect(parseNumber('5.')).toBe(5)
        expect(parseNumber('-1.5')).toBe(-1.5)
        expect(parseNumber('1e3')).toBe(1000)
    })

    it('拒绝非法输入', () => {
        expect(() => parseNumber('abc')).toThrow()
        expect(() => parseNumber('')).toThrow()
        expect(() => parseNumber('1.2.3')).toThrow()
        expect(() => parseNumber(Number.NaN)).toThrow()
        expect(() => parseNumber(Number.POSITIVE_INFINITY)).toThrow()
        expect(() => parseNumber(1 / 0)).toThrow()
    })
})

describe('binaryOp', () => {
    it('四则运算精度正确', () => {
        expect(binaryOp(0.1, 0.2, '+')).toBe(0.3)
        expect(binaryOp(1.1, 0.11, '-')).toBe(0.99)
        expect(binaryOp(0.1, 0.2, '*')).toBe(0.02)
        expect(binaryOp(10.1, 0.1, '/')).toBe(101)
    })

    it('乘法不同小数位也正确（修复旧补零对齐 bug）', () => {
        expect(binaryOp(0.57, 100, '*')).toBe(57)
        expect(binaryOp(1.111, 0.2222, '*')).toBe(0.2468642)
    })
})

describe('compareNumbers', () => {
    it('避免浮点误差的比较', () => {
        expect(compareNumbers(0.1, 0.2)).toBe(-1)
        expect(compareNumbers(0.3, 0.3)).toBe(0)
        expect(compareNumbers(1.1, 1.1)).toBe(0)
        expect(compareNumbers(2, 1)).toBe(1)
        expect(compareNumbers('1.10', '1.1')).toBe(0)
    })
})

describe('roundTo', () => {
    it('round/floor/ceil 基于字符串定点', () => {
        expect(roundTo(0.555, 2, 'round')).toBe(0.56)
        expect(roundTo(0.29, 1, 'floor')).toBe(0.2)
        expect(roundTo(0.21, 1, 'ceil')).toBe(0.3)
    })

    it('fraction 非整数抛错', () => {
        expect(() => roundTo(1.5, 0.5, 'round')).toThrow()
    })
})
