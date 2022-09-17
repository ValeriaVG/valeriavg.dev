---
title: "Me & React: 5 Years in 15 Minutes"
date: 2022-09-08T06:56:49+02:00
tags: [javascript, react, frontend]
draft: false
twitter: "1567745886800732160"
summary: |
  I first heard of React when a friend showed me a project he had written. It was some sort of content management system: it had tables, forms, visual editors and stuff like this. I don't remember much, except that code was really really confusing
---

I first heard of React when a friend showed me a project he had written. It was some sort of content management system: it had tables, forms, visual editors and stuff like this. I don't remember much, except that code was really really confusing, it looked like this:

```js
// hint: you can use this codepen to follow along:
// https://codepen.io/valeriavg-the-flexboxer/pen/WNJNMRp

const app = React.createElement(
  // tag
  "button",
  // properties
  {
    onClick: function () {
      alert("Hello!");
    },
  },
  // children
  "Click Me!"
);

ReactDOM.render(app, document.getElementById("app"));
// <div id="app"></div>
```

So, of course, I was quite frustrated someone would want to write _that_, when you could just write _this_ instead:

```html
<button onClick="alert('Hello!')">Click me!</button>
```

## JSX: HTML in JS

Some time passed, and, to my surprise, React was all over the place: every other job advertisement was mentioning it.

And so I gave it another try. This time around it wasn't just a library you import - somehow it turned into a whole new language, called [jsx](https://reactjs.org/docs/introducing-jsx.html). Which, however, was vaguely familiar:

```jsx
const app = <button onClick={() => alert("Hello, JSX!")}>Click me!</button>;

ReactDOM.render(app, document.getElementById("app"));
```

That was almost the same as my old pal _HTML_, except _JSX_ allowed splitting HTML pages into tiny reusable dynamic building blocks:

```jsx
const One = () => <div> One </div>;
const Two = () => <div> Two </div>;
const Three = () => <div> Three </div>;
const app = (
  <div>
    <One />
    <Two />
    <Three />
  </div>
);

ReactDOM.render(app, document.getElementById("app"));
```

Behind the scenes, however, it was still the same code:

```js
const One = () => React.createElement("div", {}, "One");
const Two = () => React.createElement("div", {}, "Two");
const Three = () => React.createElement("div", {}, "Three");
const app = React.createElement("div", {}, One(), Two(), Three());
ReactDOM.render(app, document.getElementById("app"));
```

But JSX made a lot of difference and React has finally started making sense to me.

## Stateful and stateless components

One of the first things I've learned was a "stateful" component:

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
    };
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name} </h1>
        <input
          type="text"
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
```

Or rather it was the second thing, as, apparently, I've already got familiar with it's "stateless" counterpart.

A _stateful_ component had a _state_ which was triggering a re-render on change, while the _stateless_ had only the render part and were rendering exactly the same thing as long as _props_ were the same:

```jsx
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}! </h1>
      </div>
    );
  }
}

ReactDOM.render(<App name="React" />, document.getElementById("app"));
```

Back then I worked for a startup which allowed creators distribute video content for their fans among other things. That meant we had a dashboard for creators, and website and an app for end users. And React worked perfectly well for the dashboard, especially when _functional_ components came along:

```jsx
const App = () => {
  const [name, setName] = React.useState("");
  return (
    <div>
      <h1>Hello, {name} </h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

And so, the project was growing, along with the amount of dependencies. We used [emotion](https://emotion.sh/docs/styled) styled components, [react-router](https://github.com/remix-run/react-router#readme) and of a little something to manage the state.

## State management

One of the first libraries for _state management_ I've tried was [RxJS](https://react-rxjs.org/docs/getting-started). Sure, it added even more _magic_ to the project, but hey, it was cool to share state between two components, right?

Wrong, it was chaos! I could never tell which one of them changed the state and it made debugging quite mind bending, as sometimes `console.log` has been printed a microsecond _before_ the state has been actually propagated.

[Redux](https://react-redux.js.org/introduction/getting-started) has treated me a bit better in that sense, but having one gigantic _store_ was not convenient for my preferred modular architecture.

And so I stuck to the React's own `context` because I could easily split states and trace the updates easier:

```jsx
const NameContext = React.createContext("");

const Name = () => {
  const name = React.useContext(NameContext);
  if (!name) return "";
  return <h1> Hello, {name}!</h1>;
};

const App = () => {
  const [name, setName] = React.useState("");

  return (
    <NameContext.Provider value={name}>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What's your name?"
        />
        <Name />
      </div>
    </NameContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

Which, as you can tell from the code, was precisely around the time functional components came along.

## Functional components

In a nutshell, functional components were an attempt to turn stateful components into stateless with ease and vice versa by letting them all be functions and use _hooks_ instead:

```jsx
const App = () => {
  const [name, setName] = React.useState("");
  return (
    <div>
      <h1>Hello, {name} </h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

I can't argue that code became much easier to write and read, though I had my concerns regarding [hooks](https://reactjs.org/docs/hooks-intro.html). First off, the state still needs to be stored somewhere and originally it was proposed to be built around `this`, which wouldn't work with arrow functions and would need to rely on the fact that JSX is compiled (not the case as at the moment it uses a [dispatcher](https://github.com/facebook/react/blob/main/packages/react/src/ReactHooks.js#L81) instead). And secondly, it required _thinking in React_.

While classes were a mouthful - they were straightforward - there were explicit `props` and `state`, and when state or the props would change - the `render` method would be triggered. And there were a couple of methods you could use to control this flow, like `shouldComponentUpdate` or `componentDidMount`:

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
    };
  }

  componentDidMount() {
    console.log("Component did mount!");
  }

  shouldComponentUpdate(props, state) {
    console.log({
      new: { props, state },
      old: { props: this.props, state: this.state },
    });
    return true;
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.state.name} </h1>
        <input
          type="text"
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
```

Which when turned into a succinct functional component with hooks looked liked magic:

```jsx
const App = () => {
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    console.log("Mounted!");
  }, []);
  React.useEffect(() => {
    console.log("Name changed:", name);
  }, [name]);
  return (
    <div>
      <h1>Hello, {name} </h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

I can't say I know every aspect of how it works now, years after, and back when it was some wild juju I gave up trying to comprehend. Unfortunately, things I don't understand have a tendency to bite me when I least expect it.

## Handling performance issues

As I mentioned, React was a working great for our dashboard, and so I've decided to switch our plain old MVC website to a fancy server-side rendered React. That was before [NextJS](https://nextjs.org/) became the de-facto standard for this and I've kinda just glued most pieces together myself: after all, it boiled down to replacing the template engine we were using (I _think_ it was [pug](https://pugjs.org/language/attributes.html)) with [ReactDOMServer](https://reactjs.org/docs/react-dom-server.html):

```js
//
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const script = React.createElement(
  "script",
  {},
  'console.log("ReactDOM hydrate would happen here")'
);
const page = React.createElement("h1", {}, "Hello, SSR!");
const app = React.createElement("body", {}, page, script);
ReactDOMServer.renderToString(app);
```

The new version was quite ok and I could add some real reactivity to the otherwise static pages, including the changes to a video player.

I learned that some things required dropping down plain old JS event listeners with the use of _refs_:

```jsx
const App = () => {
  const videoEl = React.useRef(null);
  const [time, setTime] = React.useState(0);

  const onTimeUpdate = (e) => {
    setTime(e.target.currentTime);
  };
  React.useEffect(() => {
    if (!videoEl.current) return;
    videoEl.current.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      if (!videoEl.current) return;
      videoEl.current.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoEl]);

  return (
    <div>
      <p>{time}s</p>
      <video
        ref={videoEl}
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        controls
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

But, as I discovered after, rendering anything on the screen is an expensive task, let alone a high abstraction like HTML/CSS. Now imagine fetching a video stream, processing it, playing and rendering UI changes every frame with the help of a virtual DOM diffing:

![Laptop on fire](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/safmfshly1u56m2b0y72.jpg)

Yup, that's what was happening. Now of course, React was not the main issue - the video processing and playing were the heavy ones, but there were so little resources available and so many optimisation required to make it work properly with React, that I gave up and wrote the player interface is plain JavaScript and just "mounted" it on the React component:

```jsx
const App = () => {
  const videoEl = React.useRef(null);

  React.useEffect(() => {
    if (!videoEl.current) return;
    mountVideo(videoEl.current);
    return () => unmountVideo(videoEl.current);
  }, []);

  return (
    <div>
      <div ref={videoEl} />
    </div>
  );
};

const mountVideo = (el) => {
  el.innerHTML = `<div class='time'>0s</div><video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls/>`;

  el.querySelector("video").ontimeupdate = (e) => {
    el.querySelector(".time").innerText = `${e.target.currentTime}s`;
  };
};

const unmountVideo = (el) => {
  el.innerHTML = "";
};

ReactDOM.render(<App />, document.getElementById("app"));
```

After this I've build several quick prototypes with the help of [GraphQL](https://graphql.org/) and React Native and worked on yet another dashboard in React / Redux.

I think by then I finally learned to _think in React_, but nonetheless from time to time I still turn `useEffect` into an endless cycle of updates and forget to memoize stuff.

But I didn't want any of it: I didn't want to learn a language within language with a dozen of libraries, I didn't want to change the way I think - I just wanted to make a performant web application as easy as possible. And I couldn't help but resent React for it.

Yet today I came across a really interesting project, called [atomico](https://atomicojs.dev/) - a WebComponents library, inspired by React hooks; And it dawned upon me that without React, and, particularly JSX - none of it would be possible, not my beloved [svelte](https://svelte.dev/), not [flutter](https://flutter.dev/), nor dozens of other frameworks.

And just as I'd advise any web developer to learn basics of so-called "vanilla" JavaScript, I highly recommend to look into a library that shaped the modern web technologies, at least out of curiosity.

Hopefully, it'd take you much less time to master than it took me :-)
