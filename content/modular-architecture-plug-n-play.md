---
title: "Plug & Play Modular Architecture for Scalable and Maintainable Apps"
date: 2023-06-27T16:24:13Z
tags: [architecture, javascript]
draft: false
twitter: "1673699596218793986"
dev_to: https://dev.to/valeriavg/plug-play-modular-architecture-for-scalable-and-maintainable-apps-2je9
summary: |
  A new project is always a joy: the code hasn't yet been bloated with deprecated features, rushed decisions and questionable dependencies. When my projects get to this state I become increasingly less productive and the urge to refactor grows exponentially, which, as you would imagine, halts any progress entirely.
id: "1ea64520-9437-11ef-af43-558f8bb50797"
---

A new project is always a joy: the code hasn't yet been bloated with deprecated features, rushed decisions and questionable dependencies. When my projects get to this state I become increasingly less productive and the urge to refactor grows exponentially, which, as you would imagine, halts any progress entirely.

After a bit of trial and error I developed some rules that help me keep the code maintainable and scalable for longer and I'm excited to dive into it as [promised](https://dev.to/valeriavg/comment/275kp).

## General Idea and Principles

I needed a structure that would free me from distractions as much as possible and would allow me to concentrate on task at hand. At the same time it should be possible to make changes of any magnitude confidently. And, finally, it needed to be simple and easy to replicate on different types of projects, regardless of it being a website, a mobile app or a distributed backend system as I was tinkering with them all.

It might seem like a lot of requirements, but it all boils down to having a proper and very limited scope for features. While looking for ideas I stumbled upon an article (that I sadly cannot find anymore, but would love to give credit) that described modular architecture for a NodeJS app and it inspired me greatly: the core principle was that the code that belongs together should stay together and that the structure should allow easy addition and removals of features as a whole.

With time I settled for the following rules when structuring an app:

1. Each separate feature should fit entirely in it's own folder.

2. Only imports from shared folders or within current feature folder are allowed.

3. Each feature can be written and structured differently from the others, as long as it has the same "public" interface.

4. Features can be composed of nested features, but it shouldn't be more than two levels deep (up to a grandparent).

5. Code structure should reflect how code is deployed or packaged, if applicable.

For visual reference imagine a communal house with three roommates:
![Top block: Shared Space:Kitchen, Bathrooms, Living Room; Three rooms below, labeled "Room 1", "Room 2" and "Room 3". Room 1 has a "Bed" and a "Drawer", Room 2 has a "Bed" and "Walk-in closet" that in it's turn has "Shoes", "Dresses", and "Lingerie". Room 3 has nothing but a "Mattress"](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2f0n97ts6q36qy92t7nt.png)

Each one of them can use shared space, provided they'd keep it tidy and don't leave anything that's not necessary there. Roommates would not allow other roommates take things from their rooms; and anyone of them might move out at any given time and it shouldn't affect the others. At the same time every roommate should be free to organise their space to their liking and do whatever they please there.

As you can see this structure works perfectly for dorm living arrangements ;-) Let's see how it might look like for actual apps. I'll use JavaScript and some popular frameworks, but it should be possible to apply this paradigm for any other language or tool as well.

## React Frontend App: Dashboard

Say you're working on an internal tool to manage some eCommerce website. You'd probably need the following features:

- Ability to authenticate users
- Ability to manage blog posts
- Ability to see and manage the shop

I created React App with:
```sh
npm create vite@latest
```

And outlined the basic folder structure: 
![New folders within "src": "context","components" and "modules". Modules have "authentication","blog" and "shop"](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u03mgph4tkghu15w4m27.png)

Each module will have it's own set of dynamic and static pages and, probably, menu elements. Let's add a router:

```sh
npm i react-router-dom --save-dev
```

And define the interface for the modules in `src/types.d.ts`:
```ts
import { ReactComponentElement } from "react";
import { RouteObject } from "react-router-dom";

declare global {
  type AppMenu = {
    title: string;
  };

  type AppModule = {
    routes: Array<RouteObject & { menu?: AppMenu }>;
    wrapper?: (node: ReactNode, modules: AppModule[]) => ReactNode
  };
}

```

The gist of each module is a set of routes, with the addition of a wrapper to allow access to other modules, e.g. for the menu, as well as allow different layouts, e.g. for login page.

And example module would look like this:
```tsx
import { wrapper } from "../../components/Layout";
import CategoriesPage from "./categories/CategoriesPage";
import OrdersPage from "./orders/CategoriesPage";

const shopModule: AppModule = {
  routes: [
    {
      path: "/categories",
      element: <CategoriesPage />,
      menu: { title: "Category" },
    },
    { path: "/products", element: <OrdersPage />, menu: { title: "products" } },
    { path: "/orders", element: <OrdersPage />, menu: { title: "orders" } },
  ],
  wrapper,
};

export default shopModule;
```

Then the code to connect multiple modules together could look like this:
```tsx
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import modules from "./modules";
import { ReactNode } from "react";

const wrapWithLayout = (
  routes: RouteObject[],
  wrapper?: (node: ReactNode, modules: AppModule[]) => ReactNode
): RouteObject[] => {
  return routes.map((route) => ({
    ...route,
    element: wrapper ? wrapper(route.element, modules) : route.element,
  }));
};

const router = createBrowserRouter(
  modules.reduce(
    (a, c) => [...a, ...wrapWithLayout(c.routes, c.wrapper)],
    [] as RouteObject[]
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
```

You can check full implementation and try it yourself in this [example repo](https://github.com/ValeriaVG/modular-arch/tree/main/dashboard).

## NodeJS API with Express

For this example let's bootstrap it with express.js:
```sh
npm init -y && 
npm install express --save &&
npm install @types/express typescript ts-node-dev --save-dev 
```

Add `tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "classic",
    "esModuleInterop": true
  },
  "include": ["src"],
  "ts-node": {
    "files": true
  },
  "files": [
    "src/types.d.ts"
  ],
}

```

And, once again, let's create basic interface for the modules:
```ts
//src/types.d.ts
import { Express } from "express";
declare global {
  type APIModule = {
    middleware: Array<(app: Express) => void>;
  };
}
```

An example module could look like this:
```ts
const helloModule: APIModule = {
  middleware: (app) => {
    app.get("/hello/:name", (req, res) => {
      res.send({ hello: req.params.name });
    });
  },
};
export default helloModule
```

And the glue to make all the modules and app as a whole work together is as simple as:

```ts
import Express from "express";
import healthModule from "./health/index";
import helloModule from "./hello/index";

const modules = [healthModule, helloModule]

const app = Express();

modules.forEach(mod=>mod.middleware(app))

app.listen(3000, "localhost", () => {
  console.log("Listening on http://localhost:3000");
});
```

You can explore the full example in [this repo](https://github.com/ValeriaVG/modular-arch/tree/main/api).

With middleware one can overload context and handle bunch of complex use cases, including authentication, but most importantly this kind of structure allows almost seamless migration to microservices architecture!

Not a fan of Express or middleware? Check out my work-in-progress [Deno headless CMS implementation](https://github.com/en-di/web-core/tree/main/cms/api) that is built using the same principles.

Those examples are relatively simple, but the only difference between these projects and bigger systems are amount of folders within `modules`! And those of you who enjoy freelancing or consulting could appreciate building a library of "modules" to reuse, I sure did ;-) 

So, what do you think? Ready to give it a try? 
I'd love to see what implementations you come up with! 























