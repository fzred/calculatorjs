import { describe, expect, it } from 'vitest'
import calc, { CalcError, add, cmp, round } from '../src/index'

describe('公共 API（向后兼容）', () => {
    it('默认导出既能求表达式又能调用方法', () => {
        expect(calc('2.1 + 2.2')).toBe(4.3)
        expect(calc('0.1*(0.1+0.1)')).toBe(0.02)
        expect(calc.add(0.1, 0.2)).toBe(0.3)
        expect(calc.sub(0.1, 0.2)).toBe(-0.1)
        expect(calc.mul(0.1, 0.2)).toBe(0.02)
        expect(calc.div(0.1, 0.2)).toBe(0.5)
        expect(calc.round(0.555, 2)).toBe(0.56)
    })

    it('挂载了全部新增方法', () => {
        expect(calc.pow(2, 10)).toBe(1024)
        expect(calc.abs(-1.5)).toBe(1.5)
        expect(calc.cmp(0.1, 0.2)).toBe(-1)
        expect(calc.max(1, 3, 2)).toBe(3)
        expect(calc.sum(0.1, 0.2)).toBe(0.3)
        expect(calc.add(1, 2, 3)).toBe(6)
    })

    it('命名导出可用', () => {
        expect(add(0.1, 0.2)).toBe(0.3)
        expect(round(0.555, 2)).toBe(0.56)
        expect(cmp(1, 2)).toBe(-1)
    })

    it('导出错误类', () => {
        expect(() => calc.div(1, 0)).toThrow(CalcError)
    })
})
