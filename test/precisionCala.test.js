const precisionCala = require('../src/precisionCalc')

test('add 2.1 + 2.2 to equal 4.3', () => {
    expect(precisionCala.add(2.1, 2.2)).toBe(4.3)
})

test('sub 1.1 - 0.11 to equal 0.99', () => {
    expect(precisionCala.sub(1.1, 0.11)).toBe(0.99)
})

test('sub 0.1 * 0.2 to equal 0.02', () => {
    expect(precisionCala.mul(0.1, 0.2)).toBe(0.02)
})

test('div 10.1 / 0.1 to equal 101', () => {
    expect(precisionCala.div(10.1, 0.1)).toBe(101)
})
