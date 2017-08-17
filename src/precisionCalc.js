const _cf = (function () {
    function _shift(x) {
        const parts = x.toString().split('.')
        return (parts.length < 2) ? 1 : Math.pow(10, parts[1].length)
    }

    return function (l, r) {
        return Math.max(_shift(l), _shift(r))
    }
})()

/**
 * 只处理小数点
 * @param {*} number 
 * @param {*} f 
 */
function _mul(number, f) {
    f = '' + f
    const index = f.indexOf('0')
    if (index > -1) {
        f = f.length - f.indexOf('0')
    } else {
        f = 0
    }
    const arr = String(number).split('.')
    const decimal = (arr[1] || '') + Array(f + 1).join('0')
    const newNumber = arr[0] + decimal.slice(0, f)
    return parseInt(newNumber)
}

function add(l, r) {
    const f = _cf(l, r)
    return parseInt(_mul(l, f) + _mul(r, f)) / f
}

function sub(l, r) {
    const f = _cf(l, r)
    return (_mul(l, f) - _mul(r, f)) / f
}

function mul(l, r) {
    const f = _cf(l, r)
    return _mul(l, f) * _mul(r, f) / (f * f)
}

function div(l, r) {
    const f = _cf(l, r)
    return _mul(l, f) / _mul(r, f)
}

module.exports = {
    add, sub, mul, div,
}
