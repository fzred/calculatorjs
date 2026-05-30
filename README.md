# Calculatorjs

[![NPM version](https://img.shields.io/npm/v/calculatorjs.svg?style=flat)](https://www.npmjs.com/package/calculatorjs)

[中文文档](/README-ZH.md)

An accurate arithmetic library that fixes JavaScript floating-point precision, with a built-in
expression parser. Written in TypeScript, zero runtime dependencies.

```javascript
> 2.1 + 2.2
4.300000000000001
> calc('2.1 + 2.2')
4.3
```

## Install

```bash
npm install --save calculatorjs
```

## Usage

ESM (named or default import):

```javascript
import calc, { add, round } from 'calculatorjs'

calc('0.1 * (0.1 + 0.1)') // 0.02
add(0.1, 0.2)             // 0.3
round(0.555, 2)           // 0.56
```

CommonJS (`require` returns the callable `calc`):

```javascript
const calc = require('calculatorjs')

calc('0.1 * (0.1 + 0.1)') // 0.02
calc.add(0.1, 0.2)        // 0.3
```

Browser via `<script>` (global `calc`):

```html
<script src="https://unpkg.com/calculatorjs"></script>
<script>
    console.log(calc('0.1 * (0.1 + 0.1)')) // 0.02
    console.log(calc.add(0.1, 0.2))         // 0.3
</script>
```

## Documentation

### Arithmetic expression

```javascript
calc('1 + (2 * 3 - 1) / 4 * -1') // 0.25
```

Supports **+** **-** **\*** **/** **(** **)** and a leading unary minus.

### API

All functions accept `number` or numeric `string` inputs.

```javascript
// Basic arithmetic — accept two or more operands (left-associative)
calc.add(0.1, 0.2)       // 0.3
calc.add(1, 2, 3)        // 6
calc.sub(10, 1, 2)       // 7
calc.mul(0.1, 0.2)       // 0.02
calc.div(100, 2, 5)      // 10

// Rounding (string-based, no float error) — optional decimal places
calc.round(0.555, 2)     // 0.56  (round half away from zero)
calc.floor(0.29, 1)      // 0.2
calc.ceil(0.21, 1)       // 0.3

// Math
calc.pow(2, 10)          // 1024  (integer exponent only)
calc.abs(-1.5)           // 1.5
calc.neg(0.1)            // -0.1
calc.mod(0.3, 0.1)       // 0     (sign follows the dividend)

// Comparison (no float error)
calc.cmp(0.1, 0.2)       // -1 | 0 | 1
calc.eq(calc.add(0.1, 0.2), 0.3) // true
calc.gt(0.2, 0.1)        // true
calc.lt / calc.gte / calc.lte    // boolean

// Aggregation
calc.max(1, 3, 2)        // 3
calc.min(0.1, 0.2, 0.05) // 0.05
calc.sum(0.1, 0.2, 0.3)  // 0.6
```

The same functions are available as named exports: `import { add, cmp, round } from 'calculatorjs'`.

### Error handling

Invalid input now throws instead of returning `NaN` / `Infinity` silently.

```javascript
import calc, { CalcError, ParseError } from 'calculatorjs'

try {
    calc.div(1, 0)       // throws CalcError: 除数不能为 0
    calc.add('abc', 1)   // throws CalcError
    calc('1 + )')        // throws ParseError (with .position)
} catch (e) {
    if (e instanceof ParseError) console.log('syntax error at', e.position)
    else if (e instanceof CalcError) console.log('calc error', e.message)
}
```

`ParseError` extends `CalcError`, so a single `instanceof CalcError` catches both.

### Precision limits

This library is implemented on top of JavaScript's `Number`, so it is bound by
`Number.MAX_SAFE_INTEGER` (2^53 − 1). Values whose significant digits exceed ~15–16 will lose
precision — this is a known, by-design limit:

```javascript
calc.add('9007199254740992', '1') // 9007199254740992 (not ...993 — 2^53 + 1 is unrepresentable)
calc.pow(2, 0.5)                   // throws — non-integer exponents are not supported
```

If you need arbitrary precision, use a big-decimal library such as
[decimal.js](https://github.com/MikeMcl/decimal.js) or BigInt.

## Changelog

### 1.2.0

- Rewritten in **TypeScript** with bundled type definitions (`.d.ts`).
- Ships **ESM + CJS + UMD** builds; `require()` still returns the callable `calc`.
- New functions: `pow` `abs` `neg` `mod` `floor` `ceil` `cmp` `eq` `gt` `lt` `gte` `lte` `max`
  `min` `sum`; `add/sub/mul/div` now accept **multiple operands**.
- Fixed precision bugs (scientific-notation detection, multiplication alignment, `round` float
  error — `round(0.555, 2)` is now `0.56`).
- **Behavior change**: invalid input / division by zero now throw `CalcError` / `ParseError`
  instead of silently returning `NaN` / `Infinity`.

## License

Distributed under [MIT License](http://opensource.org/licenses/MIT).
