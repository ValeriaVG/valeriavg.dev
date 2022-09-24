---
title: "ES Modules & Import Maps: Back to the Future"
date: 2022-09-24T09:13:15Z
tags: [javascript, webdev, beginners, esm]
draft: false
summary: |
  There was a time when creating a web page meant creating an html file, yet nowadays it seems impossible to build any frontend without the bottomless pit of node_modules, yielding a finely chewed yet hefty bundle.xyz.js. Well, I got to learn that it might not be the case soon and, naturally, I feel the urge to share it with the rest of you.
---

There was a time when creating a web page meant creating an html file, yet nowadays it seems impossible to build any frontend without the bottomless pit of node_modules, yielding a finely chewed yet hefty _bundle.xyz.js_. Well, I got to learn that it might not be the case soon and, naturally, I feel the urge to share it with the rest of you.

## Start with HTML

The barebones page in HTML5 looks like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

> _Hint_: I got this template by typing `html:5` in my VSCode thanks to [Emmet abbreviations](https://code.visualstudio.com/docs/editor/emmet)

## Add a module

Now, let's say we would like to add a framework to it, [Preact](https://preactjs.com/), for example.
We could do it like this:

```html
<body>
  <div id="app"></div>
  <script type="module">
    import { h, Component, render } from "https://esm.sh/preact@10.11.0";
    import htm from "https://esm.sh/htm@3.1.1";

    // Initialize htm with Preact
    const html = htm.bind(h);

    function App(props) {
      return html`<h1>Hello ${props.name}!</h1>`;
    }

    render(html`<${App} name="World" />`, document.getElementById("app"));
  </script>
</body>
```

You can open the page in your browser as a simple file and see that it actually works. And that is the power of modern ECMAScript modules, that are defined by simply adding `type="module"` to a script tag.

For such a simple page it works great, but it can quickly become hard to work with once we add more pages.

Let's create another:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Counter</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import { h, Component, render } from "https://esm.sh/preact@10.11.0";
      import { useState } from "https://esm.sh/preact@10.11.0/hooks";
      import htm from "https://esm.sh/htm@3.1.1";
      const html = htm.bind(h);

      function Counter() {
        const [count, setCount] = useState(0);
        return html`<button onClick=${() => setCount((n) => n + 1)}>
          Count: ${count}
        </button>`;
      }

      render(html`<${Counter} />`, document.getElementById("app"));
    </script>
  </body>
</html>
```

It's a good practice to specify the exact version of dependencies to avoid breaking changes, but updating those will be a mess, right?

Gladly, no! Because we could write an [import-map](https://wicg.github.io/import-maps/)!

## Import Maps

An import map is a JSON that tells browser where to find a certain import by its alias. For example, we could create an import map with the following contents:

```json
{
  "imports": {
    "preact": "https://esm.sh/preact@10.11.0",
    "preact/": "https://esm.sh/preact@10.11.0/",
    "htm": "https://esm.sh/htm@3.1.1"
  }
}
```

And include it on both pages like this:

```html
<body>
  <div id="app"></div>
  <script type="importmap">
    {
      "imports": {
        "preact": "https://esm.sh/preact@10.11.0",
        "preact/": "https://esm.sh/preact@10.11.0/",
        "htm": "https://esm.sh/htm@3.1.1"
      }
    }
  </script>
  <script type="module">
    import { h, Component, render } from "preact";
    import { useState } from "preact/hooks";
    import htm from "htm";

    // Initialize htm with Preact
    const html = htm.bind(h);

    function App(props) {
      return html`<h1>Hello ${props.name}!</h1>`;
    }

    render(html`<${App} name="World" />`, document.getElementById("app"));
  </script>
</body>
```

Quite neat, right? You could also use it to reference your own components and avoid long paths. Ah, future is bright!

... But we're not quite there yet.

Unfortunately, import maps are still unofficial draft and therefore some vital features, like including an external import map from a json file, is not supported or they are not [supported at all](https://caniuse.com/?search=importmap) in some browsers (e.g. Safari).

## But I want to use it RIGHT NOW!

I hear you, so am I!

And I do have some good news for us: there is a mature JavaScript runtime, called [deno](https://deno.land/) that supports ESM and import maps out of the box. And [fresh](https://fresh.deno.dev/) framework, for example, is a delight to work with.

I've recently migrated my [blog](https://github.com/ValeriaVG/valeriavg.dev) to Fresh from Hugo and I can't wait to finally implement some of the dynamic features I have been postponing for too long.
