function split(number) {
    number = number + ''

    const index = number.indexOf('.')
    if (index > -1) {
        return [number.substr(0, index), number.substr(index + 1)]
    } else {
        return [number]
    }
}

function getDecimalLength(arr) {
    return (arr.length < 2) ? 0 : arr[1].length
}

function getMaxDecimalLength(l, r) {
    return Math.max(getDecimalLength(l), getDecimalLength(r))
}


/**
 * 只处理小数点
 * @param {*} number 
 * @param {*} f 
 */
function _mul(arr, f) {
    if (!arr[1]) {
        return arr[0] * Math.pow(10, f)
    }
    const decimal = arr[1] + '0000000000'
    const newNumber = arr[0] + decimal.substr(0, f)
    return Number(newNumber)
}

function add(l, r) {
    const arrL = split(l)
    const arrR = split(r)

    const f = getMaxDecimalLength(arrL, arrR)
    if (f === 0) return l + r

    return (_mul(arrL, f) + _mul(arrR, f)) / Math.pow(10, f)
}

function sub(l, r) {
    const arrL = split(l)
    const arrR = split(r)

    const f = getMaxDecimalLength(arrL, arrR)
    if (f === 0) return l - r

    return (_mul(arrL, f) - _mul(arrR, f)) / Math.pow(10, f)
}

function mul(l, r) {
    const arrL = split(l)
    const arrR = split(r)
    const f = getMaxDecimalLength(arrL, arrR)
    if (f === 0) return l * r
    const commonMultiple = Math.pow(10, f)
    return _mul(arrL, f) * _mul(arrR, f) / (commonMultiple * commonMultiple)
}

function div(l, r) {
    const arrL = split(l)
    const arrR = split(r)

    const f = getMaxDecimalLength(arrL, arrR)
    if (f === 0) return l / r

    return _mul(arrL, f) / _mul(arrR, f)
}

module.exports = {
    add, sub, mul, div,
}
