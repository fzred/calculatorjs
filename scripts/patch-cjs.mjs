// 构建后修正 CJS 产物：tsup/esbuild 对「默认导出 + 命名导出」会生成
// `exports.default = calc` + `exports.add = ...` 的形态，导致 `require('calculatorjs')`
// 返回的是对象而非可调用的 calc。此脚本在所有 `exports.x=` 之后追加一行，
// 把默认导出（可调用的 calc，已挂载全部方法）提升为 module.exports，
// 并把命名导出（含 CalcError / ParseError）一并挂到该函数上。
import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../dist/index.cjs', import.meta.url)
const marker = 'Object.assign(exports.default, exports)'

let code = readFileSync(file, 'utf8')
if (!code.includes(marker)) {
    const snippet = `
// require() 直接返回可调用的 calc（含全部方法与错误类）
if (exports.default) {
    module.exports = ${marker};
    module.exports.default = module.exports;
}
`
    const idx = code.indexOf('//# sourceMappingURL')
    code = idx >= 0 ? code.slice(0, idx) + snippet + code.slice(idx) : code + snippet
    writeFileSync(file, code)
    console.log('patched dist/index.cjs for callable require()')
}
