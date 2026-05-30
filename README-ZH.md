# Calculatorjs

[![NPM version](https://img.shields.io/npm/v/calculatorjs.svg?style=flat)](https://www.npmjs.com/package/calculatorjs)

[English](/README.md)

精确算术库，解决 JavaScript 浮点精度问题，并内置表达式解析器。使用 TypeScript 编写，零运行时依赖。

```javascript
> 2.1 + 2.2
4.300000000000001
> calc('2.1 + 2.2')
4.3
```

## 安装

```bash
npm install --save calculatorjs
```

## 使用

ESM（命名导入或默认导入）：

```javascript
import calc, { add, round } from 'calculatorjs'

calc('0.1 * (0.1 + 0.1)') // 0.02
add(0.1, 0.2)             // 0.3
round(0.555, 2)           // 0.56
```

CommonJS（`require` 直接返回可调用的 `calc`）：

```javascript
const calc = require('calculatorjs')

calc('0.1 * (0.1 + 0.1)') // 0.02
calc.add(0.1, 0.2)        // 0.3
```

浏览器 `<script>` 引入（全局 `calc`）：

```html
<script src="https://unpkg.com/calculatorjs"></script>
<script>
    console.log(calc('0.1 * (0.1 + 0.1)')) // 0.02
    console.log(calc.add(0.1, 0.2))         // 0.3
</script>
```

## 文档

### 算术表达式

```javascript
calc('1 + (2 * 3 - 1) / 4 * -1') // 0.25
```

支持 **+** **-** **\*** **/** **(** **)** 以及前置负号。

### API

所有函数都接受 `number` 或数字字符串输入。

```javascript
// 基础四则 —— 支持两个或多个操作数（左结合）
calc.add(0.1, 0.2)       // 0.3
calc.add(1, 2, 3)        // 6
calc.sub(10, 1, 2)       // 7
calc.mul(0.1, 0.2)       // 0.02
calc.div(100, 2, 5)      // 10

// 取整（基于字符串，无浮点误差）—— 可选小数位
calc.round(0.555, 2)     // 0.56  （四舍五入，half away from zero）
calc.floor(0.29, 1)      // 0.2
calc.ceil(0.21, 1)       // 0.3

// 数学
calc.pow(2, 10)          // 1024  （仅支持整数指数）
calc.abs(-1.5)           // 1.5
calc.neg(0.1)            // -0.1
calc.mod(0.3, 0.1)       // 0     （符号跟随被除数）

// 比较（无浮点误差）
calc.cmp(0.1, 0.2)       // -1 | 0 | 1
calc.eq(calc.add(0.1, 0.2), 0.3) // true
calc.gt(0.2, 0.1)        // true
calc.lt / calc.gte / calc.lte    // boolean

// 聚合
calc.max(1, 3, 2)        // 3
calc.min(0.1, 0.2, 0.05) // 0.05
calc.sum(0.1, 0.2, 0.3)  // 0.6
```

以上函数同样以命名方式导出：`import { add, cmp, round } from 'calculatorjs'`。

### 错误处理

非法输入不再静默返回 `NaN` / `Infinity`，而是抛出异常。

```javascript
import calc, { CalcError, ParseError } from 'calculatorjs'

try {
    calc.div(1, 0)       // 抛出 CalcError：除数不能为 0
    calc.add('abc', 1)   // 抛出 CalcError
    calc('1 + )')        // 抛出 ParseError（带 .position 位置信息）
} catch (e) {
    if (e instanceof ParseError) console.log('语法错误，位置', e.position)
    else if (e instanceof CalcError) console.log('运算错误', e.message)
}
```

`ParseError` 继承自 `CalcError`，因此用一个 `instanceof CalcError` 即可统一捕获。

### 精度限制

本库基于 JavaScript 的 `Number` 实现，因此受 `Number.MAX_SAFE_INTEGER`（2^53 − 1）约束。
有效数字超过约 15–16 位的数值会失真——这是设计内的已知上限：

```javascript
calc.add('9007199254740992', '1') // 9007199254740992（并非 ...993，因为 2^53 + 1 无法表示）
calc.pow(2, 0.5)                   // 抛错 —— 不支持非整数指数
```

如需任意精度，请改用 [decimal.js](https://github.com/MikeMcl/decimal.js) 或 BigInt 等大数库。

## 更新日志

### 1.2.0

- 使用 **TypeScript** 重写，附带类型定义（`.d.ts`）。
- 提供 **ESM + CJS + UMD** 产物；`require()` 仍返回可调用的 `calc`。
- 新增函数：`pow` `abs` `neg` `mod` `floor` `ceil` `cmp` `eq` `gt` `lt` `gte` `lte` `max`
  `min` `sum`；`add/sub/mul/div` 现支持**多参数累算**。
- 修复精度 bug（科学计数法判定、乘法对齐、`round` 浮点误差——`round(0.555, 2)` 现为 `0.56`）。
- **行为变化**：非法输入 / 除以 0 现在会抛出 `CalcError` / `ParseError`，不再静默返回
  `NaN` / `Infinity`。

## License

基于 [MIT License](http://opensource.org/licenses/MIT) 发布。
