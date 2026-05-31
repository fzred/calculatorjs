import { describe, expect, it } from 'vitest'
import { add } from '../src/arithmetic'
import { cmp, eq, gt, gte, lt, lte } from '../src/compare'

describe('compare', () => {
    it('cmp 返回 -1 / 0 / 1', () => {
        expect(cmp(0.1, 0.2)).toBe(-1)
        expect(cmp(0.3, 0.3)).toBe(0)
        expect(cmp(0.2, 0.1)).toBe(1)
    })

    it('避免浮点误差：0.1 + 0.2 等于 0.3', () => {
        expect(eq(add(0.1, 0.2), 0.3)).toBe(true)
    })

    it('eq / gt / lt / gte / lte', () => {
        expect(eq(1.1, 1.1)).toBe(true)
        expect(eq('1.10', 1.1)).toBe(true)
        expect(gt(0.2, 0.1)).toBe(true)
        expect(lt(0.1, 0.2)).toBe(true)
        expect(gte(0.2, 0.2)).toBe(true)
        expect(gte(0.3, 0.2)).toBe(true)
        expect(lte(0.2, 0.2)).toBe(true)
        expect(lte(0.1, 0.2)).toBe(true)
        expect(gt(0.1, 0.2)).toBe(false)
    })
})
