// 针对「编译后产物」的冒烟测试（单元测试跑的是 src 源码，覆盖不到构建层逻辑：
// CJS 补丁、UMD footer、exports 映射、esbuild 转译）。需先 `npm run build`。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const require = createRequire(import.meta.url)

// 1) CJS：require 必须返回可调用的 calc，并挂载全部方法与错误类
{
    const calc = require('../dist/index.cjs')
    assert.equal(typeof calc, 'function', 'CJS: require 应返回函数')
    assert.equal(calc('1 + 2 * 3'), 7, 'CJS: 表达式求值')
    assert.equal(calc.add(0.1, 0.2), 0.3, 'CJS: calc.add')
    assert.equal(calc.add(1, 2, 3), 6, 'CJS: 多参数 add')
    assert.equal(calc.round(0.555, 2), 0.56, 'CJS: round 精度修复')

    const { add, div, CalcError, ParseError } = require('../dist/index.cjs')
    assert.equal(add(0.1, 0.2), 0.3, 'CJS: 解构命名导出')
    assert.equal(typeof CalcError, 'function', 'CJS: 导出 CalcError')
    assert.equal(typeof ParseError, 'function', 'CJS: 导出 ParseError')
    assert.throws(() => div(1, 0), CalcError, 'CJS: 除零抛 CalcError')
    console.log('✓ CJS (dist/index.cjs)')
}

// 2) ESM：默认导出可调用 + 命名导出
{
    const mod = await import(new URL('../dist/index.js', import.meta.url).href)
    const calc = mod.default
    assert.equal(typeof calc, 'function', 'ESM: 默认导出应为函数')
    assert.equal(calc('2.1 + 2.2'), 4.3, 'ESM: 表达式求值')
    assert.equal(mod.add(0.1, 0.2), 0.3, 'ESM: 命名导出 add')
    assert.equal(mod.cmp(0.1, 0.2), -1, 'ESM: 命名导出 cmp')
    assert.equal(typeof mod.CalcError, 'function', 'ESM: 导出 CalcError')
    console.log('✓ ESM (dist/index.js)')
}

// 3) UMD：模拟 <script> 加载，全局 calc 可调用 + 挂载方法
{
    const code = readFileSync(new URL('../dist/calc.umd.min.js', import.meta.url), 'utf8')
    const sandbox = {}
    vm.createContext(sandbox)
    vm.runInContext(code, sandbox)
    assert.equal(typeof sandbox.calc, 'function', 'UMD: 全局 calc 应为函数')
    assert.equal(sandbox.calc('1 + 1'), 2, 'UMD: 表达式求值')
    assert.equal(sandbox.calc.add(1, 2), 3, 'UMD: calc.add')
    assert.equal(sandbox.calc.mul(0.1, 0.2), 0.02, 'UMD: calc.mul')
    console.log('✓ UMD (dist/calc.umd.min.js)')
}

console.log('dist 冒烟测试全部通过')
