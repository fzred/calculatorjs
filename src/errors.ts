/** 运算层错误：除零、非法输入、非整数指数、空参数等。 */
export class CalcError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CalcError'
        // 保证在被向下编译为 ES5 的环境中 instanceof 仍然可靠
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

/** 解析层错误：携带出错字符在表达式中的位置（position）。 */
export class ParseError extends CalcError {
    position?: number

    constructor(message: string, position?: number) {
        super(position != null ? `${message} (位置 ${position})` : message)
        this.name = 'ParseError'
        this.position = position
    }
}
