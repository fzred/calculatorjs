/** 运算层错误：除零、非法输入、非整数指数、空参数等。 */
export class CalcError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CalcError'
        // 保证在被向下编译为 ES5 的环境中 instanceof 仍然可靠
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

/**
 * 把错误信息格式化为带位置与可视化指针的形式，方便定位：
 *
 *   期望数字或左括号 (位置 9)
 *     1 + (2 * )
 *              ^
 */
function formatParseMessage(message: string, position?: number, expression?: string): string {
    const head = position != null ? `${message} (位置 ${position})` : message
    if (expression == null || position == null || expression.length > 200) {
        return head
    }
    return `${head}\n  ${expression}\n  ${' '.repeat(Math.max(0, position))}^`
}

/**
 * 解析层错误：携带出错字符在表达式中的位置（position）与原始表达式（expression），
 * 并在 message 中渲染可视化指针。继承自 CalcError，可用 `instanceof CalcError` 统一捕获。
 */
export class ParseError extends CalcError {
    position?: number
    expression?: string

    constructor(message: string, position?: number, expression?: string) {
        super(formatParseMessage(message, position, expression))
        this.name = 'ParseError'
        this.position = position
        this.expression = expression
    }
}
