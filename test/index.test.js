const calc = require('../src/index')
const { round } = calc

test('round(1.999, 1) to equal 2', () => {
    expect(round(1.999, 1)).toBe(2)
})

test('round(1.199, 1) to equal 1.2', () => {
    expect(round(1.199, 1)).toBe(1.2)
})

test('round(1.111, 2) to equal to equal 1.11', () => {
    expect(round(1.111, 2)).toBe(1.11)
})

test('add 2.1 + 2.2 to equal 4.3', () => {
    expect(calc('2.1+2.2')).toBe(4.3)
})

test('add 1+1 to equal 2', () => {
    expect(calc('1+1')).toBe(2)
})

test('add 0.99999999999999 + 0.00000000000001 to equal 1', () => {
    expect(calc('0.99999999999999 + 0.00000000000001')).toBe(1)
})

test('sub 1.1-0.11 to equal 0.99', () => {
    expect(calc('1.1-0.11')).toBe(0.99)
})

test('sub 0.57*100 to equal 57', () => {
    expect(calc('0.57*100')).toBe(57)
})

test('sub 0.1 * 0.2 to equal 0.02', () => {
    expect(calc('0.1*0.2')).toBe(0.02)
})

test('div 10.1 / 0.1 to equal 101', () => {
    expect(calc('10.1/0.1')).toBe(101)
})

test('mixture 0.1 * (0.2/(2.1 + 2.2 - 1.1)) to equal 0.00625', () => {
    expect(calc('0.1 * (0.2/(2.1 + 2.2 - 1.1))')).toBe(0.00625)
})
