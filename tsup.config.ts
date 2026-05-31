import { defineConfig } from 'tsup'

// IIFE：esbuild 会把默认导出包成 calc.default，解包使全局 `calc` 直接可调用，
// 并把其余命名导出（含 CalcError / ParseError）一并挂到该函数上。
const iifeFooter =
    '(function(){if(typeof calc!=="undefined"&&calc.default){var d=calc.default;for(var k in calc){if(k!=="default"){try{d[k]=calc[k]}catch(e){}}}calc=d;}})();'

export default defineConfig([
    // ESM + 类型定义（支持 import 默认导出与命名导出）
    {
        entry: { index: 'src/index.ts' },
        format: ['esm'],
        dts: true,
        sourcemap: true,
        clean: true,
        treeshake: true,
    },
    // CJS（require 返回的形态由 scripts/patch-cjs.mjs 在构建后修正为可调用的 calc）
    {
        entry: { index: 'src/index.ts' },
        format: ['cjs'],
        dts: true,
        sourcemap: true,
        treeshake: true,
        outExtension: () => ({ js: '.cjs' }),
    },
    // 浏览器 <script> 全局产物（IIFE，全局名 calc）
    {
        entry: { calc: 'src/index.ts' },
        format: ['iife'],
        globalName: 'calc',
        minify: true,
        sourcemap: false,
        outExtension: () => ({ js: '.umd.min.js' }),
        footer: { js: iifeFooter },
    },
])
