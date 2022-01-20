---
title: "How to Do Magic With Numbers"
date: 2021-01-24T11:05:13Z
tags: [javascript, node, webdev, tutorial]
draft: false
---

JavaScript `Number` type would have been called `double` or `float64` in a compiled language. Therefore, numbers have some limits<!--more-->

```js
const maxInt = Number.MAX_SAFE_INTEGER // 9007199254740991
const minInt = Number.MIN_SAFE_INTEGER // -9007199254740991
minInt === -maxInt // true
const maxDouble = Number.MAX_VALUE // 1.7976931348623157e+308
const minDouble = Number.MIN_VALUE // -1.7976931348623157e+308
```

See that strange long number in min and max values? That is the first magical way of representing a JavaScript number: using a base and an exponent (a.k.a `beN`):

```js
const minusTwo = -2e0 // -2
const one75 = 175e-2 // 1.75
```

In practice, you specify a base number, then write `e` and specify where you want to *move the dot*. If the last number is positive - you'll be adding zeros, if negative - you'll be moving the dot to the left:

```js
const zero = 0e0 // 0; move dot from 0.0 zero times
const zero5 = 5e-1 // 0.5; move dot from 5.0 one time left
const fifty = 5e1 // 50; move dot from 5.0 one time right
const alsoFifty = 5e+1 // 50
const minusFifty = -5e+1 //-50; move dot from -5.0 one time right
const seventeen5 = 1.75e1 // 17.5; move dot from 1.75 one time right
```


But, this representation may be a bit hard to read, so you can also use old plain *decimals* with the underscore as a separator:

```js
const million = 1_000_000; //1000000
const fiveK = 5_000 // 5000
const justLoveUnderscores = 1_2_3.3_2_1 //123.321

const oops = 1__0 // Error: Only one underscore is allowed as numeric separator
const nope = 0_1 // Error: Numeric separator can not be used after leading 0
```

Dealing with *binary* numbers instead? No worries, you can write it like this:
```js
const five = 0b101 // 5
const alsoFive = 0B101 // 5; `b` is case tolerant
const max8bit = 0b1111_1111 // 255; You can use separators in any number :-)
const lessFive = -0b0101 // -5
```

Of course, `hexadecimal` numbers are also a must-have in your arsenal:
```js
const max8bit = 0xff // 255
const hexNum = -0xabc // -2748
const max32bit = 0xffff_ffff // 4294967295; can use separators
```

And, just so you know, ECMA Script 2015 introduced `octals`:
```js
const maxBit = 0o7 // 7
const eight = 0o10 // 8
const funnyZero = 0O0 // 0
```

If so happens and you can't squeeze your integer number in 64bits, you can convert it to `BigInt` by adding an `n` to it:
```js
const maxDouble = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff // Infinity
const biggerThanMaxDouble = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn // 179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137215n

const bigTen = 10n // 10n;
const bigLess50 = -50n // -50n
```

And, there are several truly magic numbers in JavaScript:
```js
Infinity === Number.POSITIVE_INFINITY // true
-Infinity === Number.NEGATIVE_INFINITY // true
const smallestFraction = Number.EPSILON // 2.2204460492503130808472633361816e-16
smallestFraction === Math.pow(2, -52) // true
```

As everyone has that weird cousin, JavaScript numbers have a special number that is literally not a number.

`NaN` value is a special value, and every single operation with it will result in `NaN`, including comparison:

```js
NaN === Number.NaN // false !!
Number.isNaN(NaN) // true

NaN + 1 // NaN
NaN * 15 // NaN
NaN / NaN // NaN
1 * NaN // NaN
```

The most convinient way to make a `NaN` is through a failed type conversion:
```js
parseInt('abc') // NaN
parseInt({}) // NaN
parseFloat('1.1.1') // NaN
'abc' * 1 // NaN
new Number('abc') // Number {NaN}
Math.abs('abc')
```

However, there are built-in functions to help you deal with edge cases and `NaN`:
```js
Number.isNaN(123) // false
Number.isNaN('abc') // true
Number.isNaN(NaN) // true

Number.isFinite(123) // true
Number.isFinite(Infinity) // false
Number.isFinite(NaN) // false

Number.isInteger(123) // true
Number.isInteger(9007199254740992) // true !!
Number.isInteger(12.3) // false
Number.isInteger(Infinity) // false
Number.isInteger(NaN) // false

Number.isSafeInteger(123) // true
Number.isSafeInteger(9007199254740992) // false
Number.isSafeInteger(12.3) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(NaN) // false

// BigInts are not considered Integers:
Number.isInteger(1n) // false
Number.isSafeInteger(1n) // false
// But it is a number:
Number.isNaN(1n) // false
```

Thirsty for more? Check out [MDN Lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar) article. 


