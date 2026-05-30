import { describe, expect, it } from 'vitest'
import { abs, add, ceil, div, floor, mod, mul, neg, pow, round, sub } from '../src/arithmetic'

describe('add / sub / mul / div', () => {
    it('两参运算保持旧行为', () => {
        expect(add(2.1, 2.2)).toBe(4.3)
        expect(add(0.1, 0.2)).toBe(0.3)
        expect(sub(1.1, 0.11)).toBe(0.99)
        expect(mul(0.1, 0.2)).toBe(0.02)
        expect(div(10.1, 0.1)).toBe(101)
    })

    it('支持字符串数字输入', () => {
        expect(add('0.1', '0.2')).toBe(0.3)
        expect(add('2.1', 2.2)).toBe(4.3)
    })

    it('支持多参数累算（左结合）', () => {
        expect(add(1, 2, 3)).toBe(6)
        expect(mul(2, 3, 4)).toBe(24)
        expect(sub(10, 1, 2)).toBe(7)
        expect(div(100, 2, 5)).toBe(10)
    })

    it('单参数返回归一化值', () => {
        expect(add(5)).toBe(5)
        expect(mul('1.5')).toBe(1.5)
    })

    it('空参数抛错', () => {
        expect(() => add()).toThrow()
        expect(() => div()).toThrow()
    })

    it('负数', () => {
        expect(add(-0.1, 0.2)).toBe(0.1)
        expect(sub(-0.1, -0.2)).toBe(0.1)
    })
})

describe('round / floor / ceil', () => {
    it('round 半进位（修正旧浮点误差）', () => {
        expect(round(1.999, 1)).toBe(2)
        expect(round(1.199, 1)).toBe(1.2)
        expect(round(1.111, 2)).toBe(1.11)
        expect(round(0.555, 2)).toBe(0.56) // 旧实现误返回 0.55
        expect(round(1.005, 2)).toBe(1.01) // 旧实现误返回 1.0
        expect(round(2.5)).toBe(3)
        expect(round(-2.5)).toBe(-3) // half away from zero
    })

    it('floor 朝 -∞', () => {
        expect(floor(2.7)).toBe(2)
        expect(floor(0.29, 1)).toBe(0.2)
        expect(floor(-0.21, 1)).toBe(-0.3)
    })

    it('ceil 朝 +∞', () => {
        expect(ceil(2.1)).toBe(3)
        expect(ceil(0.21, 1)).toBe(0.3)
        expect(ceil(-0.21, 1)).toBe(-0.2)
    })

    it('fraction 可为负（取整到十/百位）', () => {
        expect(round(1250, -2)).toBe(1300)
        expect(round(1234, -2)).toBe(1200)
    })
})

describe('neg / abs / mod / pow', () => {
    it('neg', () => {
        expect(neg(0.1)).toBe(-0.1)
        expect(neg(-0.1)).toBe(0.1)
        expect(neg(0)).toBe(0)
    })

    it('abs', () => {
        expect(abs(-1.5)).toBe(1.5)
        expect(abs(1.5)).toBe(1.5)
    })

    it('mod 符号跟随被除数', () => {
        expect(mod(0.3, 0.1)).toBe(0)
        expect(mod(10, 3)).toBe(1)
        expect(mod(-10, 3)).toBe(-1)
        expect(mod(5.5, 2)).toBe(1.5)
        expect(() => mod(1, 0)).toThrow()
    })

    it('pow 仅整数指数', () => {
        expect(pow(2, 10)).toBe(1024)
        expect(pow(0.1, 2)).toBe(0.01)
        expect(pow(2, -2)).toBe(0.25)
        expect(pow(5, 0)).toBe(1)
        expect(() => pow(2, 0.5)).toThrow()
        expect(() => pow(0, -1)).toThrow()
    })
})
