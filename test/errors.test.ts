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

    it('错误带可定位的堆栈（instanceof Error 且 stack 可用）', () => {
        try {
            div(1, 0)
            expect.unreachable()
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(typeof (e as Error).stack).toBe('string')
            expect((e as Error).stack).toContain('CalcError')
        }
    })

    it('除零/取余错误信息带上操作数', () => {
        expect(() => div(7, 0)).toThrow(/7 \/ 0/)
        expect(() => mod(5, 0)).toThrow(/5 % 0/)
    })

    it('ParseError 携带 expression 与可视化指针', () => {
        try {
            parseExpression('1 + (2 * )')
            expect.unreachable()
        } catch (e) {
            expect(e).toBeInstanceOf(ParseError)
            const err = e as ParseError
            expect(err.position).toBe(9)
            expect(err.expression).toBe('1 + (2 * )')
            // message 第二/三行渲染表达式与 ^ 指针
            expect(err.message).toContain('1 + (2 * )')
            expect(err.message).toContain('^')
        }
    })
})
