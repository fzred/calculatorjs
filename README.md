# Calculatorjs

[![NPM version](https://img.shields.io/npm/v/calculatorjs.svg?style=flat)](https://www.npmjs.com/package/calculatorjs)

```javascript
> 2.1+2.2
4.300000000000001
> calc('2.1+2.2')
4.3

> 0.1*(0.2/(2.1+2.2-1.1))
0.0062499999999999995
> calc('0.1*(0.2/(2.1+2.2-1.1))')
0.00625
```

## Installation
In browser
```html
<script src="calc.js"></script>
<script>
    console.log(calc('0.1*(0.1+0.1)'))
</script>
```
Using npm:
```bash
npm install --save calculatorjs
```
In Node.js:
```javascript
const calc = require('calculatorjs')

console.log(calc('0.1*(0.1+0.1)'))
```
## License

Distributed under [MIT License](http://opensource.org/licenses/MIT).
