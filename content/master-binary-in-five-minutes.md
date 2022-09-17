---
title: "Master Binary in Five Minutes"
date: 2021-06-13T08:37:41Z
tags: [webdev, javascript, beginners, tutorial]
draft: false
dev_to: "https://dev.to/valeriavg/master-binary-in-five-minutes-2lj5"
summary: |
  Binary is the very core of everything digital, not only in web development, but literally everything: from variables and file data to transport protocols and executables themselves.
---

Binary is the very core of everything digital, not only in web development, but literally everything: from variables and file data to transport protocols and executables themselves.

_Binary_ means that there are only two values you can operate: yes and no. Or _on_ and _off_, if you will. Or 0 and 1. If you have one light bulb you could use it to signal to your friend across the street something you've agreed on, e.g. _light on_ would mean that you're up for a party and _off_ - that you don't want to be disturbed today.

The possibilities grow with the amount of light bulbs you have. With a bunch you can encode any number or any letter and join them into phrases. Of course, computers don't really have a couple of "bulbs". In fact, the laptop I'm using to write this article has 16Gb of operational memory. That means that I can operate a 128 billion cells long stack of data. This tiny "cell", that can be either 0 or 1, is called a _bit_.

## Binary number system

We normally count in the decimal number system. This means that we can use 0,1,2,3,4,5,6,7,8,9 and, if we need to describe a number, higher than that, we add more digits: 10,11,12 etc. Now, if we limit ourselves to just two digits: 0 and 1 and follow the same principle we will get: 0, 1, 10, 11, 100, 101 etc. This is the _binary number system_.

I'll not dive into the conversion between systems, but in JavaScript you could do it with:

```js
// try in node repl (just `node`) or your browser console
0b101(
  // 5
  5
).toString(2); // '101'
```

You don't really need to convert anything, apart from debugging and very rare cases: `0b101` it's just a `5` entered in a different way, behind the curtains everything that your program operates is in binary form.

## Binary logic

Binary operations are limited to `and`,`or` and `xor` (exclusive "or") for two operands and unary `shift` and `not` operations.

_Bitwise_ operations are performed on every single "pair".
The rules are quite simple:

```js
// bitwise "and"
// 1 only if both values are 1
1 & 1; // 1
0 & 1; // 0
1 & 0; // 0
0b101 & 0b110; // 4 (0b100)

// bitwise "or"
// 1 if any value is 1
1 | 1; // 1
0 | 1; // 1
1 | 0; // 1
0b101 | 0b110; // 7 (0b111)

// bitwise "xor"
// same as or, except both 1 will produce 0
1 ^ 1; // 0
0 ^ 1; // 1
1 ^ 0; // 1
0b101 ^ 0b110; // 3 (0b011)
```

These operations are essential because all the digital math is done using them. And in their raw form they can be used to manage boolean flags among other things:

```js
// [hot][smart][funny]
let person = 0b000;
// make them hot
person |= 0b100;
// 4 (0b100)
// make them smart
person |= 0b010;
// 6 (0b110)
// make them funny
person |= 0b001;
// 7 (0b111)

// are they hot?
Boolean(person & 0b100); // true
// are they smart?
Boolean(person & 0b010); // true
// are they funny?
Boolean(person & 0b001); // true
```

Keep in mind, that unary _not_ operation may produce unexpected results on JavaScript numbers:

```js
// bitwise "not"
// flip values: turn 0 to 1 and 1 to 0
~0b01; // you'd correctly expect 0b10 or 2, but you'll get -2
~0b011111111111111111111111111111111; // 0
```

This happens because JavaScript stores numbers as _doubles_: a 64 bit representation with one bit in particular being the sign bit. So when we flip what we imagine to be a `01`, we are actually flipping a 64 digit long binary, and end up flipping the sign bit as well.

To get rid of some unwanted bits (like the sign bit for instance), we can use _shift_ operation:

```js
// left shift
// throws X digits off the left edge
// adding X zeros on the right
0b01 << 1; // 2 (0b10)

// right shift
// throws X digits off the right edge
// adding X zeros on the left
((0b01 >>
  (1 - // 0 (0b00)
    // unsigned right shift
    // same as right shift, but always turns sign bit to 0
    // making result always positive
    2)) >>>
  (1 - // 2147483647
    2)) >>
  1; // -1
2 >>> 1; // 1
```

## Octals & Hex

So far we have only been using bitwise logic to operate numbers, but even they are quite lengthy in JavaScript as we found out. To simplify things, the bits are grouped into 8-bit long _bytes_:

```js
//[0][0][0][0][1][0][1][0]
0b00001010; // 10
0o12; // 10
0xa; // 10
```

The last two lines in the example above show representation of the same decimal number 10 in 8-based number system (_octal_) and 16-based number system (_hexadecimal_). Those two are just a short way of recording binary data and, if you ever need to you can convert to these systems the same way we did with the binary:

```js
(10)
  .toString(8)(
    // 12
    10
  )
  .toString(16); // a
```

# Binary data

Of course, numbers are not the only thing you can store.
To store strings, for example, we could assign each letter to a number. Different agreements on how letters translate to numbers are called _encoding_ or _charset_. Take a look at this example:

```js
const hello = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21]);
// Uint8Array(6) [ 72, 101, 108, 108, 111, 33 ]
new TextDecoder("utf-8").decode(hello);
// 'Hello!'
```

In JavaScript a raw chunk of binary data can be stored in `Uint8Array`. As the name suggest, it's and array of 8 bit unsigned values. However, it's not the most conventional abstraction if you need to get data in certain positions and intervals. But that's when `DataView` and `ArrayBuffer` (and additionally `Buffer` in node) come in:

```js
// Create empty buffer with 6 bytes
const buffer = new ArrayBuffer(6);
// Create buffer view
const view = new DataView(buffer);
// Record some data
view.setUint8(0, 72); // H
view.setUint8(1, 101); // e
view.setUint8(2, 108); // l
view.setUint8(3, 108); // l
view.setUint8(4, 111); // o

new TextDecoder("utf-8").decode(buffer);
// "Hello\u0000"
// or 'Hello\x00' in node
```

`DataView` has many other useful functions, e.g. `getInt32` or even `setBigInt64`, allowing you to write and read longer values than just one byte and assign them to a proper type.

Ability to slice and dice raw binary data comes in handy when you need to implement a protocol (TCP, SMTP, FTP etc) or coder/decoder for a specific file format to name a few.

Let's take a look on a real world example. In particular on this post cover image data:

```js
// Open browser console on this page
const img = document.querySelector("header img");
// Get data
let buffer;
fetch(img.src)
  .then((r) => r.arrayBuffer())
  .then((b) => (buffer = b));
console.log(buffer);
// ArrayBuffer(392)
// [82, 73, 70, 70, 128, 1, 0, 0, 87, 69, 66 ....]
new TextDecoder("ascii").decode(buffer.slice(0, 4)); // "RIFF"
new TextDecoder("ascii").decode(buffer.slice(8, 12)); // "WEBP"
```

We got the exact values[WebP specification](https://developers.google.com/speed/webp/docs/riff_container) describes. But we did skip some data between "RIFF" and "WEBP", can you read file size there with `DataView`?

Hint: order in which we "read" binary numbers bytes is specified by `endianness` and `little endian` means that the closer to the end the smaller the address number, i.e. right to left. Here's an example:

```js
// 01 00 00 00 = 32 bit integer 1 in little-endian
// 00 00 00 01 = 32 bit integer 1 in big-endian
const littleEndian = new DataView(
  new Uint8Array([0x01, 0x00, 0x00, 0x00]).buffer
);
littleEndian.getUint32(0, true); // littleEndian: true
// 1
const bigEndian = new DataView(new Uint8Array([0x00, 0x00, 0x00, 0x01]).buffer);
bigEndian.getUint32(0); // littleEndian: false
// 1
```

Congratulations on making it to the end. I hope you won't feel intimidated by binary protocols or formats anymore.
