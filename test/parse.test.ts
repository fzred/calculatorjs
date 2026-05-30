import { describe, expect, it } from 'vitest'
import { ParseError } from '../src/errors'
import { parseExpression as calc } from '../src/parse'

describe('表达式求值', () => {
    it('基础四则与精度', () => {
        expect(calc('1+1')).toBe(2)
        expect(calc('2.1+2.2')).toBe(4.3)
        expect(calc('1.1-0.11')).toBe(0.99)
        expect(calc('0.57*100')).toBe(57)
        expect(calc('0.1*0.2')).toBe(0.02)
        expect(calc('10.1/0.1')).toBe(101)
    })

    it('括号、优先级与负号', () => {
        expect(calc('0.1 * (0.2/(2.1 + 2.2 - 1.1))')).toBe(0.00625)
        expect(calc(' 1 + (2 * 3 - 1) / 4 * -1 ')).toBe(-0.25)
        expect(calc('-0.1 + 0.2')).toBe(0.1)
        expect(calc('.5 + .5')).toBe(1)
    })

    it('极端浮点', () => {
        expect(calc('0.99999999999999 + 0.00000000000001')).toBe(1)
    })

    it('语法错误抛 ParseError 并带位置', () => {
        expect(() => calc('1+')).toThrow(ParseError)
        expect(() => calc('(1+2')).toThrow(ParseError)
        expect(() => calc('1.2.3')).toThrow(ParseError)
        expect(() => calc('1 @ 2')).toThrow(ParseError)
        expect(() => calc('')).toThrow(ParseError)
        expect(() => calc('1 2')).toThrow(ParseError)
    })

    it('ParseError 含 position', () => {
        try {
            calc('1@2')
            expect.unreachable()
        } catch (e) {
            expect(e).toBeInstanceOf(ParseError)
            expect((e as ParseError).position).toBe(1)
        }
    })

    it('表达式中除以 0 抛错', () => {
        expect(() => calc('1/0')).toThrow()
    })
})
