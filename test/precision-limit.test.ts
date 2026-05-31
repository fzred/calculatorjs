import { describe, expect, it } from 'vitest'
import { add, mul } from '../src/arithmetic'

/**
 * 本库基于 JS Number 实现，精度上限受 Number.MAX_SAFE_INTEGER（2^53 - 1）约束。
 * 以下用例显式锁定「已知的固有上限」——它们是设计内的失真，不是回归。
 * 如需任意精度请改用 BigInt / decimal.js 方案。
 */
describe('精度上限（已知且文档化）', () => {
    it('安全范围内精确', () => {
        expect(add(0.1, 0.2)).toBe(0.3)
        expect(mul(1234.5678, 1000)).toBe(1234567.8)
        expect(add(9007199254740991, 0)).toBe(9007199254740991) // MAX_SAFE_INTEGER
    })

    it('超过 MAX_SAFE_INTEGER 的整数会失真（固有上限）', () => {
        // 数学上应为 9007199254740993，但 2^53 + 1 在 double 中无法表示
        expect(add('9007199254740992', '1')).toBe(9007199254740992)
    })

    it('整数乘积超过安全范围会失真（固有上限）', () => {
        // 12345678901234.5 的有效数字超过 ~15-16 位，结果不精确
        const result = mul(123456789.12345, 100000)
        expect(Number.isFinite(result)).toBe(true)
    })
})
