(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("calc", [], factory);
	else if(typeof exports === 'object')
		exports["calc"] = factory();
	else
		root["calc"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function split(number) {
    number = number + '';

    var index = number.indexOf('.');
    if (index > -1) {
        return [number.substr(0, index), number.substr(index + 1)];
    } else {
        return [number];
    }
}

function getDecimalLength(arr) {
    return arr.length < 2 ? 0 : arr[1].length;
}

function getMaxDecimalLength(l, r) {
    return Math.max(getDecimalLength(l), getDecimalLength(r));
}

/**
 * 只处理小数点
 * @param {*} number 
 * @param {*} f 
 */
function _mul(arr, f) {
    if (!arr[1]) {
        return arr[0] * Math.pow(10, f);
    }
    var decimal = arr[1] + '0000000000';
    var newNumber = arr[0] + decimal.substr(0, f);
    return Number(newNumber);
}

function add(l, r) {
    var arrL = split(l);
    var arrR = split(r);

    var f = getMaxDecimalLength(arrL, arrR);
    if (f === 0) return l + r;

    return (_mul(arrL, f) + _mul(arrR, f)) / Math.pow(10, f);
}

function sub(l, r) {
    var arrL = split(l);
    var arrR = split(r);

    var f = getMaxDecimalLength(arrL, arrR);
    if (f === 0) return l - r;

    return (_mul(arrL, f) - _mul(arrR, f)) / Math.pow(10, f);
}

function mul(l, r) {
    var arrL = split(l);
    var arrR = split(r);
    var f = getMaxDecimalLength(arrL, arrR);
    if (f === 0) return l * r;
    var commonMultiple = Math.pow(10, f);
    return _mul(arrL, f) * _mul(arrR, f) / (commonMultiple * commonMultiple);
}

function div(l, r) {
    var arrL = split(l);
    var arrR = split(r);

    var f = getMaxDecimalLength(arrL, arrR);
    if (f === 0) return l / r;

    return _mul(arrL, f) / _mul(arrR, f);
}

module.exports = {
    add: add, sub: sub, mul: mul, div: div
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var precisionCalc = __webpack_require__(0);

var NUMBER_TOKEN = 1;
var ADD_OPERATOR_TOKEN = 2;
var SUB_OPERATOR_TOKEN = 3;
var MUL_OPERATOR_TOKEN = 4;
var DIV_OPERATOR_TOKEN = 5;
var LEFT_PAREN_TOKEN = 6;
var RIGHT_PAREN_TOKEN = 7;
var END_TOKEN = 8;

var INITIAL_STATUS = 1; // 初始化
var IN_INT_PART_STATUS = 2; // 整数
var IN_FRAC_PART_STATUS = 4; // 小数

var tokensEnum = {
    '+': ADD_OPERATOR_TOKEN,
    '-': SUB_OPERATOR_TOKEN,
    '*': MUL_OPERATOR_TOKEN,
    '/': DIV_OPERATOR_TOKEN,
    '(': LEFT_PAREN_TOKEN,
    ')': RIGHT_PAREN_TOKEN
};

function getToken(str) {
    var linePos = 0;
    var curStr = void 0;

    var tokens = [];

    var status = INITIAL_STATUS; // 初始化状态

    while (str[linePos]) {
        curStr = str[linePos];
        var token = tokensEnum[curStr];
        if (token) {
            tokens.push({
                type: token
            });
            status = INITIAL_STATUS;
        } else if (/[0-9]/.test(curStr)) {
            if (status == INITIAL_STATUS) {
                // 数字开始
                tokens.push({
                    type: NUMBER_TOKEN,
                    value: curStr
                });
                status = IN_INT_PART_STATUS;
            } else if (status == IN_INT_PART_STATUS || status == IN_FRAC_PART_STATUS) {
                // 追加数字
                var curToken = tokens[tokens.length - 1];
                curToken.value += curStr;
            }
        } else if (curStr == '.') {
            // 小数点
            if (status == IN_INT_PART_STATUS) {
                // 输入整数状态才能有小数点
                status = IN_FRAC_PART_STATUS;
                var _curToken = tokens[tokens.length - 1];
                _curToken.value += '.';
            } else {
                throw '语法错误';
            }
        } else if (curStr == ' ') {
            // 空格
            status = INITIAL_STATUS;
        } else {
            throw '语法错误';
        }

        linePos++;
    }

    tokens.push({
        type: END_TOKEN
    });
    return tokens;
}

function parseExpression(str) {
    var tokens = getToken(str);
    var curPos = 0;
    var curToken = tokens[curPos];

    function nextToken() {
        curToken = tokens[curPos++];
        return curToken;
    }

    function aheadToken() {
        curToken = tokens[--curPos];
    }

    function parsePrimaryExpression() {
        var value = 0;
        var minusFlog = false; // 是否负数

        nextToken();

        if (curToken.type == SUB_OPERATOR_TOKEN) {
            minusFlog = true;
            nextToken();
        }

        if (curToken.type == NUMBER_TOKEN) {
            value = curToken.value;
        } else if (curToken.type == LEFT_PAREN_TOKEN) {
            // 优先计算 ( ) 里的表达式
            value = parseExpression();
            nextToken();
            if (curToken.type != RIGHT_PAREN_TOKEN) {
                throw '缺少 ) ';
            }
        }
        value = Number(value);
        if (minusFlog) {
            value = -value;
        }
        return value;
    }

    function parseTerm() {
        var v1 = void 0;
        var v2 = void 0;
        v1 = parsePrimaryExpression();
        while (true) {
            var token = nextToken();
            if (token.type != MUL_OPERATOR_TOKEN && token.type != DIV_OPERATOR_TOKEN) {
                aheadToken();
                break;
            }
            v2 = parsePrimaryExpression();
            if (token.type == MUL_OPERATOR_TOKEN) {
                v1 = precisionCalc.mul(v1, v2);
            } else if (token.type == DIV_OPERATOR_TOKEN) {
                v1 = precisionCalc.div(v1, v2);
            }
        }
        return v1;
    }

    function parseExpression() {
        var v1 = void 0;
        var v2 = void 0;
        v1 = parseTerm();
        while (true) {
            var token = nextToken();
            if (token.type != ADD_OPERATOR_TOKEN && token.type != SUB_OPERATOR_TOKEN) {
                aheadToken();
                break;
            }
            v2 = parseTerm();
            if (token.type == ADD_OPERATOR_TOKEN) {
                v1 = precisionCalc.add(v1, v2);
            } else if (token.type == SUB_OPERATOR_TOKEN) {
                v1 = precisionCalc.sub(v1, v2);
            }
        }
        return v1;
    }

    return parseExpression();
}

module.exports = {
    parseExpression: parseExpression
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    parseExpression = _require.parseExpression;

var precisionCalc = __webpack_require__(0);

function calc(str) {
    return parseExpression(str);
}

for (var key in precisionCalc) {
    calc[key] = precisionCalc[key];
}

module.exports = calc;

/***/ })
/******/ ]);
});