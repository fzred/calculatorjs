const _cf = (function () {
    function _shift(x) {
        const parts = x.toString().split('.')
        return (parts.length < 2) ? 1 : Math.pow(10, parts[1].length)
    }

    return function (l, r) {
        return Math.max(_shift(l), _shift(r))
    }
})()

function add(l, r) {
    const f = _cf(l, r)
    return parseInt(l * f + r * f) / f
}

function sub(l, r) {
    const f = _cf(l, r)
    return parseInt(l * f - r * f) / f
}

function mul(l, r) {
    const f = _cf(l, r)
    return parseInt(l * f) * parseInt(r * f) / (f * f)
}

function div(l, r) {
    const f = _cf(l, r)
    return parseInt(l * f) / parseInt(r * f)
}

module.exports = {
    add, sub, mul, div,
}
