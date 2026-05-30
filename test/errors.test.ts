import { describe, expect, it } from 'vitest'
import { add, div, mod, pow } from '../src/arithmetic'
import { CalcError, ParseError } from '../src/errors'
import { parseExpression } from '../src/parse'

describe('错误处理', () => {
    it('除零抛 CalcError', () => {
        expect(() => div(1, 0)).toThrow(CalcError)
        expect(() => div(0, 0)).toThrow(CalcError)
        expect(() => mod(1, 0)).toThrow(CalcError)
    })

    it('非法输入抛 CalcError', () => {
        expect(() => add('abc', 1)).toThrow(CalcError)
        expect(() => add(Number.NaN, 1)).toThrow(CalcError)
        expect(() => add(Number.POSITIVE_INFINITY, 1)).toThrow(CalcError)
    })

    it('pow 非整数指数抛 CalcError', () => {
        expect(() => pow(2, 1.5)).toThrow(CalcError)
    })

    it('ParseError 是 CalcError 的子类（可统一捕获）', () => {
        expect(() => parseExpression('1@')).toThrow(CalcError)
        expect(new ParseError('x', 0)).toBeInstanceOf(CalcError)
    })
})
