# Calculatorjs

[![NPM version](https://img.shields.io/npm/v/calculatorjs.svg?style=flat)](https://www.npmjs.com/package/calculatorjs)

```javascript
> 2.1+2.2
4.300000000000001
> calc(' 2.1+2.2 ')
4.3
```

## Installation
In browser
```html
<script src="calc.js"></script>
<script>
    console.log(calc(' 0.1*(0.1+0.1) '))
</script>
```
Using npm:
```bash
npm install --save calculatorjs
```
In Node.js:
```javascript
const calc = require('calculatorjs')

console.log(calc(' 0.1*(0.1+0.1) '))
```

## DOC
```javascript
calc(' 1+1-1*1/2+(1/1)/-1 ')
```
Support **+** **-** **\*** **/** **(** **)** **minus**

### Fast API
**If you need fast calculations,you can use it,10 times faster than calc.**
```javascript
calc.add(0.1, 0.2) // 0.3
calc.sub(0.1, 0.2) // -0.1
calc.mul(0.1, 0.2) // 0.02
calc.div(0.1, 0.2) // 0.5
```
## License

Distributed under [MIT License](http://opensource.org/licenses/MIT).
