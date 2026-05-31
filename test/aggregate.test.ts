import { describe, expect, it } from 'vitest'
import { max, min, sum } from '../src/aggregate'

describe('aggregate', () => {
    it('max / min', () => {
        expect(max(3, 1, 2)).toBe(3)
        expect(min(3, 1, 2)).toBe(1)
        expect(max('1.5', 2, '0.5')).toBe(2)
        expect(min(0.1, 0.2, 0.05)).toBe(0.05)
    })

    it('sum 精确求和', () => {
        expect(sum(1, 2, 3)).toBe(6)
        expect(sum(0.1, 0.2)).toBe(0.3)
        expect(sum(0.1, 0.2, 0.3)).toBe(0.6)
    })

    it('单参数', () => {
        expect(max(42)).toBe(42)
        expect(sum(42)).toBe(42)
    })

    it('空参数抛错', () => {
        expect(() => max()).toThrow()
        expect(() => min()).toThrow()
        expect(() => sum()).toThrow()
    })
})
