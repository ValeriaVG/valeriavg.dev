---
title: "How Build a Web App in 11 Minutes and Fall in Love With Sveltekit"
date: 2021-09-18T13:21:35Z
tags: [svelte, node, webdev, tutorial]
draft: false
---
It's been a long time since I got excited about a framework. I often advocate *for* reinventing the wheel, how come I'm writing an ode to a framework? Short answer: because [SvelteKit](https://kit.svelte.dev/) is very good, even though it's still in *beta*. The long answer is ahead.
<!--more-->

[Svelte](https://svelte.dev/) itself is like coming back to the future: you write your user interfaces with almost old-school HTML in a declarative manner with zero-to-none boilerplate. And then `.svelte` files are compiled to the plain old `.js`,`.css` and `.html`. Apps come out fast, lightweight and easy to maintain and extend.

But SvelteKit takes it even further. Heard of *Create React App*? Not even close! SvelteKit is a full-stack framework capable of producing not only single-page applications and static websites, but a versatile full-blown HTTP server with any pages, API and handlers NodeJS can have.

Alright, enough words let's build something already! And by *something* I mean an app where users can signup, log in and see account information.

In other words, we'll build a base for a generic web service.

## Prerequisites & Architecture

For this tutorial you'll need [NodeJS](https://nodejs.org/en/) (v14.17.6 or higher). 

It's also nice to have a code editor with Svelte extension (e.g. [VSCode](https://code.visualstudio.com/) with [svelte-vscode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension).

The app will store data in a simple in-memory database (literally an object) and write to a JSON file for persistence. Though you can replace it with a database of your choice.

For speed and simplicity, we'll use a minimalistic CSS framework called [Milligram](https://milligram.io/).

## Creating the App

Open the terminal, paste or type `npm init svelte@next my-app` and choose the highlighted options:
```sh
npm init svelte@next my-app

# ✔ Which Svelte app template? › [Skeleton project]
# ✔ Use TypeScript? … No / [Yes]
# ✔ Add ESLint for code linting? … No / [Yes]
# ✔ Add Prettier for code formatting? … No / [Yes]
```

Install dependencies from the app folder:
```sh
cd my-app && npm i
```

You can now start the app in the development mode with:
```sh
npm run dev
```

Open *http://localhost:3000/* in your browser to see the ascetic home page.

Let's start with the layout: a file that will include global css styles and some constant parts of the page. Create file `src/routes/__layout.svelte`:

```html
<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic"
	/>
	<!-- CSS Reset -->
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css"
	/>
	<!-- Milligram CSS -->
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css"
	/>
</svelte:head>

<main class="container">
	<slot />
</main>
<footer class="container">
	{new Date().getFullYear()} &copy; MY APP
</footer>

<style>
	:global(body, html, #svelte) {
		width: 100vw;
		min-height: 100vh;
	}
	:global(#svelte) {
		display: flex;
		flex-direction: column;
	}
	main {
		flex: 1;
		margin-top: 3rem;
	}
	footer {
		margin-top: auto;
		font-size: 0.8em;
		opacity: 0.5;
	}
</style>
```

The page should be looking much better now because we replaced the default `<slot></slot>` layout with a bit more sophisticated one. SvelteKit will look for `__layout.svelte` file in the nearest or parent directory, so it's possible to use a different one for each nested folder.

As you can see Svelte is very close to HTML, though you probably have noticed the differences:

- `<svelte:head/>` tag that contains contents that should be inserted into the `<head/>` tag of the final page
- `:global(selector)` in style, pointing out that no scoped class should be created and instead, the selectors should be used *as is*
- JavaScript code right in the middle of HTML contents


## Creating Forms & Pages

To create a new page create a new file `src/routes/signup.svelte`:
```html
<svelte:head>
	<title>Create an account</title>
</svelte:head>

<h1>Create an account</h1>

<form method="POST" action="/signup">
	<fieldset>
		<label for="email">Email</label>
		<input type="email" placeholder="user@email.net" name="email" required />
		<label for="password">Password</label>
		<input type="password" placeholder="Your password" name="password" required />
		<label for="password">Password, again</label>
		<input
			type="password"
			placeholder="Repeat the password, please"
			name="repeat-password"
			required
		/>
		<input class="button-primary" type="submit" value="Signup" />
	</fieldset>
</form>
<p>Already have an account? <a href="/login">Login</a></p>

<style>
	form {
		max-width: 420px;
	}
</style>

```

And `src/routes/login.svelte`:
```html
<svelte:head>
	<title>Login</title>
</svelte:head>

<h1>Login</h1>
<form method="POST" action="/login">
	<fieldset>
		<label for="email">Email</label>
		<input type="email" placeholder="user@email.net" name="email" />
		<label for="password">Password</label>
		<input type="password" placeholder="Your password" name="password" />
		<input class="button-primary" type="submit" value="Login" />
	</fieldset>
</form>
<p>Don't have an account? <a href="/signup">Signup</a></p>

<style>
	form {
		max-width: 420px;
	}
</style>
```

Navigate to `http://localhost:3000/login` or `http://localhost:3000/signup` to enjoy utterly useless forms that send data to themselves.

## Creating API Route handlers

> Update: adjusted Svelte Kit API to that of v1.0.0-next.259 

To create a handler for `POST /signup` all we need to do is create a `signup.ts` (or `.js`, if you prefer) file in routes, exporting a `post` function. Simple, right?

But first, we need a couple of handy dependencies: [uuid](https://www.npmjs.com/package/uuid) to generate unique user ID's and tokens and [bcrypt](https://www.npmjs.com/package/bcrypt) to hash passwords:

```sh
npm i uuid bcrypt --save && npm i @types/uuid @types/bcrypt --save-dev
```

You might need to restart the dev server after installing new dependencies.

Now let's create `src/routes/signup.ts` with:

```ts
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const post: RequestHandler = async (event) => {
    const contentType = event.request.headers.get('content-type')
    const req = contentType === 'application/json' ? await event.request.json() : contentType?.includes('form') ? await event.request.formData() : null
    if (!req) return { status: 400, body: { error: 'Incorrect input' } };
    // Handle FormData & JSON
    const input = {
        email: ('get' in req ? req.get('email') : req.email)?.toLowerCase().trim(),
        password: 'get' in req ? req.get('password') : req.password,
        'repeat-password':
            'get' in req ? req.get('repeat-password') : req['repeat-password']
    };
    if (!input.password || !input.email)
        return { status: 400, body: { error: 'Email & password are required' } };

    if (input.password !== input['repeat-password'])
        return { status: 400, body: { error: 'Passwords do not match' } };

    const user = { id: uuidv4(), email: input.email, pwhash: await bcrypt.hash(input.password, 10) };

    return {
        status: 201,
        body: {
            user
        }
    };
};
```

If you submit the signup form now you'll see a page with JSON response like this:

```json
{"user":{"id":"60d784c7-d369-4df7-b506-a274c962880e","email":"clark.kent@daily.planet","pwhash":"$2b$10$QiLRAFF5qqGxWuQjT3dIou/gZo2A0URImJ1YMSjOx2GYs0BxHt/TC"}}
```

Writing handlers in SvelteKit is as simple as writing a function that returns an object with `status`, `body` and optional `headers` properties.

But we are not storing user information anywhere yet. To do so we need to add a global store and give our handler access to it.

First things first, let's create a poor-mans in-memory database in `src/lib/db.ts`:
```ts
import fs from 'fs/promises';

export type User = {
    id: string;
    email: string;
    pwhash: string;
};

export type UserToken = {
    id: string;
    email: string;
};

export interface DB {
    users: Map<string, User>;
    tokens: Map<string, UserToken>;
    __stop: () => void;
}

const DB_FILE = 'db.json';

export const initDB = async () => {
    let data: Record<string, Array<[string, any]>> = {};
    try {
        const str = await fs.readFile(DB_FILE);
        data = JSON.parse(str.toString());
    } catch (err) {
        console.error(`Failed to read ${DB_FILE}`, err);
    }
    const db: DB = {
        users: new Map<string, User>(data.users),
        tokens: new Map<string, UserToken>(data.tokens),
        __stop: () => { }
    };

    const interval = setInterval(async () => {
        try {
            await fs.writeFile(
                DB_FILE,
                JSON.stringify({ users: [...db.users.entries()], tokens: [...db.tokens.entries()] })
            );
        } catch (err) {
            console.error(`Failed to write ${DB_FILE}`, err);
        }
    }, 1_000);

    db.__stop = () => {
        clearInterval(interval);
    };

    return db;
};
```

To give every route access to this "database" we can use `hooks`, which allow us to *hook* middleware(s) before or after any route handler. Expectedly a file `src/hooks.ts` will do the trick:

```ts
import { initDB } from '$lib/db';
import type { Handle } from '@sveltejs/kit';

// Create a promise, therefore start execution
const setup = initDB().catch((err) => {
    console.error(err);
    // Exit the app if setup has failed
    process.exit(-1);
});

export const handle: Handle = async ({ event, resolve }) => {
    // Ensure that the promise is resolved before the first request
    // It'll stay resolved for the time being
    const db = await setup;
    event.locals['db'] = db;
    const response = await resolve(event);
    return response;
};
```

I intentionally made `initDB` function asynchronous to show how to do asynchronous startup via Promises. If it seems a bit like a *hack*, well, that's because it is, though I believe there will be a more straightforward way of doing it in the future.

Alright, now let's quickly add saving user to the database in the `src/routes/signup.ts`:
```ts
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import type { DB } from '$lib/db';

export const post: RequestHandler<
	{ db: DB },
	Partial<{ email: string; password: string; ['repeat-password']: string }>
> = async (req) => {
	if (typeof req.body == 'string' || Array.isArray(req.body))
		return { status: 400, body: { error: 'Incorrect input' } };

	// Handle FormData & JSON
	const input = {
		email: ('get' in req.body ? req.body.get('email') : req.body.email)?.toLowerCase().trim(),
		password: 'get' in req.body ? req.body.get('password') : req.body.password,
		'repeat-password':
			'get' in req.body ? req.body.get('repeat-password') : req.body['repeat-password']
	};

	if (input.password !== input['repeat-password'])
		return { status: 400, body: { error: 'Passwords do not match' } };

	const db = req.locals.db;
	const user = { id: uuidv4(), email: input.email, pwhash: await bcrypt.hash(input.password, 10) };
        // Store in DB
	db.users.set(user.email, user);
	return {
		status: 201,
		body: {
			user
		}
	};
};

```

If you submit the form again and check `db.json` in a second - you'll see your data there.

Now let's write a login function in `src/routes/login.ts`

```ts
import type { RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import type { DB } from '$lib/db';
export const post: RequestHandler = async (event) => {
    const contentType = event.request.headers.get('content-type')
    const req = contentType === 'application/json' ? await event.request.json() : contentType?.includes('form') ? await event.request.formData() : null
    if (!req) return { status: 400, body: { error: 'Incorrect input' } };

    // Handle FormData & JSON
    const input = {
        email: ('get' in req ? req.get('email') : req.email)?.toLowerCase().trim(),
        password: 'get' in req ? req.get('password') : req.password
    };

    const db = event.locals['db'] as DB;
    const user = db.users.get(input.email);

    if (!user) return { status: 400, body: { error: 'Incorrect email or password' } };

    const isPasswordValid = await bcrypt.compare(input.password, user.pwhash);

    if (!isPasswordValid) return { status: 400, body: { error: 'Incorrect email or password' } };

    const token = { id: uuidv4(), email: user.email };
    db.tokens.set(token.id, token);

    return {
        status: 200,
        body: {
            user
        },
        headers: {
            'set-cookie': `token=${token.id}`
        }
    };
};
```

In this function, we check if a user with this email exists, verify provided password against the saved hash and either return an error or create a new token and set it as a [session cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies). 

> In a production app you should set an expiration date to both cookies and stored tokens.

Go ahead and try logging in with correct and then wrong credentials. It works and it works without any client JavaScript, which is great for compatibility, but is a bit *meh*.

## Reusable Svelte components

Both of our `login` and `signup` pages are pretty much the same and the functionality is quite similar. Therefore, let's write a component to use in both of them. Create `src/routes/_form.svelte`:

```html
<script lang="ts">
	import type { User } from '$lib/db';
	import { afterUpdate } from 'svelte';
	export let action = '/';
	export let method = 'POST';

	type Result = { error?: string; user?: User };

	export let onUpdate: (state: { result: Result; isSubmitting: boolean }) => void = () => {};
	let result: Result;
	let isSubmitting = false;

	const onSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		isSubmitting = true;
		const form: HTMLFormElement = e.target.form;
		const formData = new FormData(form);
		const data: Record<string, string> = {};
		formData.forEach((value, key) => {
			data[key] = value.toString();
		});

		result = await fetch(form.action, {
			method: form.method,
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((r) => r.json())
			.catch((err) => {
				return { error: err.toString() };
			});
		isSubmitting = false;
	};
	$: error = result?.error;

	afterUpdate(() => onUpdate({ result, isSubmitting }));
</script>

<form {method} {action} on:click={onSubmit}>
	<slot />
	{#if error}
		<p class="error">{error}</p>
	{/if}
</form>

<style>
	form {
		max-width: 420px;
	}
	.error {
		color: red;
	}
</style>
```

Simply exporting values from a Svelte component makes them *properties*, similar to a `JSX / React` Component. And a `<slot/>` tag determines the spot for the inner HTML or other Svelte components.

And now let's import and use this component in `src/routes/login.svelte`:
```html
<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import Form from './_form.svelte';
	let isSubmitting: boolean;
	session.subscribe(() => {});
	const onUpdate = (form) => {
		isSubmitting = form.isSubmitting;
		if (form.result?.user) {
			session.set({ user: { email: form.result.user.email } });
			alert('You are logged in!');
			goto('/');
		}
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<h1>Login</h1>
<Form action="/login" {onUpdate}>
	<fieldset>
		<label for="email">Email</label>
		<input type="email" placeholder="user@email.net" name="email" />
		<label for="password">Password</label>
		<input type="password" placeholder="Your password" name="password" />
		<input class="button-primary" type="submit" value="Login" disabled={isSubmitting} />
	</fieldset>
</Form>

<p>Don't have an account? <a href="/signup">Signup</a></p>
```

Here we are also setting *session* state so that other pages will have access to user information. 

Let's add the `<Form/>` to `src/routes/signup.svelte` as well:
```html
<script lang="ts">
	import { goto } from '$app/navigation';
	import Form from './_form.svelte';
	let isSubmitting: boolean;
	const onUpdate = (form) => {
		isSubmitting = form.isSubmitting;
		if (form.result?.user) {
			alert('You are signed up!');
			goto('/login');
		}
	};
</script>

<svelte:head>
	<title>Create an account</title>
</svelte:head>

<h1>Create an account</h1>
<Form action="/signup" {onUpdate}>
	<fieldset>
		<label for="email">Email</label>
		<input type="email" placeholder="user@email.net" name="email" required />
		<label for="password">Password</label>
		<input type="password" placeholder="Your password" name="password" required />
		<label for="password">Password, again</label>
		<input
			type="password"
			placeholder="Repeat the password, please"
			name="repeat-password"
			required
		/>
		<input class="button-primary" type="submit" value="Signup" disabled={isSubmitting} />
	</fieldset>
</Form>
<p>Already have an account? <a href="/login">Login</a></p>
```

Now you should be able to create an account and log in without annoying raw JSON (but with annoying alerts instead :-) )


## User-only content

The whole point of user authentication is to show something that only a certain user should see. That's why we are going to make some changes to the `src/routes/index.svelte` page:

```html
<script lang="ts">
	import { session } from '$app/stores';
	import type { User } from '$lib/db';
	let user: User | undefined;
	session.subscribe((current) => {
		user = current.user;
	});
	$: username = user ? user.email : 'Guest';
</script>

<svelte:head>
	<title>Welcome, {username}!</title>
</svelte:head>

<h1>Welcome, {username}!</h1>
{#if user}
	<p>You are logged in!</p>
{:else}
	<p>Would you like to <a href="/login">Login</a>?</p>
{/if}
```

Now, when you log in, you should see your email on the home page, but if you reload the page you will only see the Guest state, as we don't have access to the server *session* yet. To pass server session state to the client we need to modify `src/hooks.ts`:
```ts
import { initDB } from '$lib/db';
import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'querystring';

// Create a promise, therefore start execution
const setup = initDB().catch((err) => {
    console.error(err);
    // Exit the app if setup has failed
    process.exit(-1);
});

export const handle: Handle = async ({ event, resolve }) => {
    // Ensure that the promise is resolved before the first request
    // It'll stay resolved for the time being
    const db = await setup;
    event.locals['db'] = db;
    const cookies = event.request.headers.get('cookie')
        ?.split(';')
        .map((v) => parse(v.trim()))
        .reduceRight((a, c) => {
            return Object.assign(a, c);
        });
    if (cookies?.token && typeof cookies.token === 'string') {
        const existingToken = db.tokens.get(cookies.token);
        if (existingToken) {
            event.locals['user'] = db.users.get(existingToken.email);
        }
    }
    const response = await resolve(event);
    return response;
};

export const getSession: GetSession = (event) => {
    return event.locals['user']
        ? {
            user: {
                // only include properties needed client-side —
                // exclude anything else attached to the user
                // like access tokens etc
                email: event.locals['user'].email
            }
        }
        : {};
};
```

We added yet another hook called `getSession` that makes server values accessible on the client-side and during pre-render. 

Another improvement has been made to the `handle` hook, which now determines which user is currently logged in based on the `token` cookie.

Load the page one more time to see something like:
```md
# Welcome, clark.kent@daily.planet!

You are logged in!
```

## What's next?

While SvelteKit is still in beta it might not be suitable for mission-critical applications yet, but it seems to be getting there fast.

Nonetheless, if you would like to deploy your app for the world to see, you'll need an [adapter](https://kit.svelte.dev/docs#adapters). For this app and overall a generic Node app you can use `@sveltejs/adapter-node@next`, but there's a lot of other options, including static site generation or oriented to a particular type of deployment. And you can always write your own, it's really simple.

I love how close to the actual Web ( as in HTML, CSS, JS) Svelte is and SvelteKit feels the same way with its predictable HTTP abstractions.

What do you think, reader? Excited to give it a try yet?