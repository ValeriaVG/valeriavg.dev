---
title: "Five Pro Tips to Master Promises in Js"
date: 2021-06-05T09:25:36Z
tags: [javascript, node, tutorial, beginners]
draft: false
dev_to: "https://dev.to/valeriavg/five-pro-tips-to-master-promises-in-js-c2h"
---

Events handling and promises in particular are hands down the best JavaScript feature. You're probably familiar with the concept itself, but in short, a `Promise` in JavaScript is *a promise to call back with the result*. 
<!--more-->
Therefore, a promise can be constructed with two functions: one to be called on success and the other - in case of error. Here is a promise that would randomly fail or reject after one second:
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const randomBool = Math.random() > 0.5;
    console.log(randomBool);
    // Return any value, or no value at all
    if (randomBool) resolve("I am resolved!");
    // Reject with an error, some value or nothing at all
    else reject("On no!");
  }, 1_000);
});
```
Try this in your browser console or in node repl (run `node` with no arguments). You should see `true` or `false` logged to a console after a second and, if promise failed, you'll see an error message (or a warning that promise was not caught in node). Now that we got something to play with, the tips I've promised (pun intended):

## Tip #1: Promise starts right away

As you've seen in the example, a promise will resolve or reject even if it have not been chained with `.then`, `.catch` or `await`. As soon as you've created the promise, it'll start doing whatever it had been told to do.

## Tip #2: Once complete, promise will yield the same result over and over

Try running `promise.then(console.log)` in the same console or repl where you defined the promise from previous example. It'll log the exact same result over and over, without a delay. Try logging `console.log(promise)`, what do you see? I bet it's either: 
```js
Promise {<rejected>: "On no!"}
```
Or , if it has resolved,:
```js
Promise { "I am resolved!" }
```
You've probably guessed by now, that a promise can be in one of the three states: `pending`,`rejected` or `fulfilled` (resolved to a value). The trick here is that it'll stay in its final state till the garbage collector wipes it from existence 🪦. 

## Tip #3: Promise.prototype.then accepts two callbacks

You can get promise results by chaining `then` and `catch` to it:
```js
promise.then(console.log).catch(console.error)
```
Or, simply:
```js
promise.then(console.log,console.error)
```

## Tip #4: Promise.prototype.then and Promise.prototype.catch return a new promise

If you `console.log(promise.then(()=>{},()=>{}))`, you'll get `Promise { <pending> }`, even if the promise have been resolved. This, however, does not mean that the async operation itself will be retried, just that these methods *always* create a new promise, even if your callback functions are synchronous.

```js
promise === promise.then(()=>{},()=>{})
// false
promise === promise.then(()=>promise,()=>promise)
// false
```

## Tip #5: Use Promise.all, Promise.race and async/await when appropriate

Before ES5 introduced `async-await` syntax we all lived in a *callback hell*:
```js
promise.then(() => {
  promise.then(() => {
    promise.then(() => {
      promise.then(() => {
        console.warn("Callback hell in action");
      });
    });
  });
});
```
But it's important to remember that *async/await* is just a syntax sugar over that construction. In it's core, it still is the same chain, meaning that the next promise won't be *created* until the previous one is fulfilled:

```js
const createTimeoutPromise = (n, timeout) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`Promise #${n} is fulfilled`);
      resolve(n);
    }, timeout)
  );

(async () => {
  const now = Date.now();
  await createTimeoutPromise(1, 1_000);
  await createTimeoutPromise(2, 1_000);
  await createTimeoutPromise(3, 1_000);
  console.log(`Operation took`, ((Date.now() - now) / 1_000).toFixed(1), "s");
})();

// Promise #1 is fulfilled
// Promise #2 is fulfilled
// Promise #3 is fulfilled
// Operation took 3.0 s
```

Therefore, if you just want it *all done*, no matter in what order, use `Promise.all` to speed things up:

```js
(async () => {
  const now = Date.now();
  const results = await Promise.all([
    createTimeoutPromise(1,1_000),
    createTimeoutPromise(2,999),
    createTimeoutPromise(3,998),
  ]);
  console.log(results)
  console.log(`Operation took`, ((Date.now() - now) / 1_000).toFixed(1), "s");
})();

// Promise #3 is fulfilled
// Promise #2 is fulfilled
// Promise #1 is fulfilled
// [ 1, 2, 3 ]
// Operation took 1.0 s
```

As you can see, you'll still get the results of the promises in the same order as you specified them, despite of the order in which they were fulfilled. 

In rare cases, you may not need *all* of your promises to fulfil, but *any* of them. Let them `Promise.race` for the sire's favour 👑:
```js
(async () => {
  const now = Date.now();
  const results = await Promise.race([
    createTimeoutPromise(1,1_000),
    createTimeoutPromise(2,999),
    createTimeoutPromise(3,998),
  ]);
  console.log(results)
  console.log(`Operation took`, ((Date.now() - now) / 1_000).toFixed(1), "s");
})();

// Promise #3 is fulfilled
// 3
// Operation took 1.0 s
// Promise #2 is fulfilled
// Promise #1 is fulfilled
```

Keep in mind, that if any of the promises fail, both `Promise.all` and `Promise.race` will reject.

That's all I had for today, but I *promise* there'll be more (see what I did here?).