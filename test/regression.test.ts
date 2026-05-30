import { describe, expect, it } from 'vitest'
import { add, div, mul, sub } from '../src/arithmetic'
import { cmp } from '../src/compare'
import { ParseError } from '../src/errors'
import { parseExpression } from '../src/parse'

/**
 * 多 agent 对抗式审查（calc-core-bug-hunt）发现并已修复的真实 bug 的回归用例。
 */
describe('回归：div 不再引入额外浮点误差', () => {
    it('可整除/有限小数结果精确', () => {
        expect(div(6.9, 3)).toBe(2.3) // 旧版 2.3000000000000003
        expect(div(0.621, 3)).toBe(0.207) // 旧版 0.20700000000000002
        expect(div(58990.5538, 1727.68)).toBe(34.144375) // 旧版 34.144375000000004
        expect(div(581601.761, 617.5)).toBe(941.8652) // 旧版 941.8652000000001
        expect(div(3195772.02, 0.4)).toBe(7989430.05) // 旧版 7989430.050000001
        expect(div(78886170.1, 1808)).toBe(43631.73125) // 旧版 43631.731250000004
    })
})

describe('回归：大数运算「不劣于原生」（整数化溢出 2^53 时退化为原生）', () => {
    it('mul 溢出时不再比原生更差', () => {
        // 旧版 434048564545135.06，原生与正确值均为 434048564545135
        expect(mul(605837.5, 716443872.4)).toBe(434048564545135)
        // 不劣于原生：溢出路径结果等于原生乘法
        expect(mul(69012812.5, 7711757.76)).toBe(69012812.5 * 7711757.76)
    })

    it('add/sub 大整数 + 小数不再破坏整数部分', () => {
        // 旧版 123456789012344.98，破坏了整数部分
        expect(add(123456789012345, 0.001)).toBe(123456789012345)
        expect(sub(123456789012345, 0.001)).toBe(123456789012345)
    })

    it('cmp/div 在对齐溢出时退化为原生', () => {
        expect(cmp(1e20, 1)).toBe(1) // 对齐后超 2^53 → 原生比较
        expect(cmp(1, 1e20)).toBe(-1)
        expect(div(1e20, 1e18)).toBe(100) // 对齐后超 2^53 → 原生除法
    })
})

describe('回归：深层括号嵌套抛受控 ParseError 而非裸 RangeError', () => {
    it('过深嵌套抛 ParseError', () => {
        const expr = `${'('.repeat(5000)}1${')'.repeat(5000)}`
        expect(() => parseExpression(expr)).toThrow(ParseError)
    })

    it('合理深度仍可正常计算', () => {
        const expr = `${'('.repeat(100)}1 + 2${')'.repeat(100)}`
        expect(parseExpression(expr)).toBe(3)
    })
})
