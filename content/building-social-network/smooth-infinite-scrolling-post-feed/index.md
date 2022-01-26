---
title: "Smooth Infinite Scrolling Post Feed"
date: 2022-01-26T12:03:29+01:00
tags: [tutorial, javascript, go, postgres, encore]
draft: false
---

Content is the king they say. I'd say it's a whole legion! The more posts a network has the more new posts appear. The content mass keeps growing like a landslide and keeps pouring into the endless feeds of procrastinating users 😁

And even though we have exactly two posts on the feed now, it's not a reason not to think big!

Let's build a never-ending scrolling feed and do a neat trick to optimise it for large amounts of loaded data.
<!--more-->
**TL;DR;** You can see my final version at [pix.valeriavg.dev](https://pix.valeriavg.dev/)

## API Pagination

There are multiple ways of implementing pagination on the backend and any of them can be used to create the infinite scroll effect. 

They all revolve around the idea of providing data in smaller parts and the only thing that differs is what parameters are used to control these parts. 

The most common are:
- *page-based* pagination, accepting page number and amount of items per page
- *offset-based* pagination, accepting the number of items to skip and the amount to return, e.g. `offset` and `limit`
- *cursor-based* pagination, using the end of the previous batch as a reference

The first two methods are almost identical and meant for the case where new data is added to the end, i.e. entries that were created before are shown first and therefore the same page will always return the same results. They also can be used in cases where data is sorted dynamically, doesn't change often or when keeping page results the same is not a requirement.

With this said, the post feed is better off with the third option: the *cursor*-based pagination. Newly created posts are placed at the beginning of the list, so that whenever a user opens the app - a fresh batch of something interesting is already there 😎

The simplest way of implementing such a thing is to use a *monotonously increasing* field, e.g. a number or a timestamp. Then sort data in descending order and return a specific amount of items *after* the last seen. Even though the next items were created *before*, I find it easier to refer to all the chunks we are yet to load as the future chunks and call the cursor accordingly, but feel free to alter that if you must.

Implementation in [Encore](https://encore.dev/) is pretty straightforward:
```go
package feed

import (
	"context"

	"encore.dev/storage/sqldb"
)

type Post struct {
	ID      int
	Title   string
	Content string
	Image   string
	Liked   bool
}

type PostList struct {
	Items     []*Post
	Total     int
	NextAfter int `json:",omitempty"`
}

type ListParams struct {
	Limit int
	After int
}

// ListPosts returns post feed
//encore:api method=GET public path=/feed
func ListPosts(ctx context.Context, params *ListParams) (*PostList, error) {
	list := PostList{Items: []*Post{}}
	if params.Limit == 0 {
		params.Limit = 10
	}
	if params.Limit > 50 {
		params.Limit = 50
	}
	rows, err := sqldb.Query(ctx,
		/*sql*/ `
			SELECT id, title, content, image 
			FROM posts 
			WHERE $1 = 0 OR id<$1 
			ORDER BY id DESC 
			LIMIT $2
		`, params.After, params.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		post := Post{}
		err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.Image)
		if err != nil {
			return &list, err
		}
		list.Items = append(list.Items, &post)
	}
	if err = rows.Err(); err != nil {
		return &list, err
	}
	err = sqldb.QueryRow(ctx,
		/*sql*/ `
		SELECT COUNT(*) 
		FROM posts`).Scan(&list.Total)
	if err != nil {
		return &list, err
	}
	if len(list.Items) > 0 {
		list.NextAfter = list.Items[len(list.Items)-1].ID
	}
	return &list, nil
}

```

We validate user input to make sure they won't require a gazillion of posts at once (and knock the database out):
```go
if params.Limit == 0 {
  params.Limit = 10
}
if params.Limit > 50 {
  params.Limit = 50
}
```

Start a *select* query:
```go
rows, err := sqldb.Query(ctx,
		/*sql*/ `
			SELECT id, title, content, image 
			FROM posts 
			WHERE $1 = 0 OR id<$1 
			ORDER BY id DESC 
			LIMIT $2
		`, params.After, params.Limit)
if err != nil {
	return nil, err
}
```
The `$1 = 0` bit is there to avoid `id<0` when the cursor is empty.

And then *scan* rows one-by-one (and don't forget to close rows):
```go
defer rows.Close()
for rows.Next() {
		post := Post{}
		rows.Scan(&post.ID, &post.Title, &post.Content, &post.Image)
		list.Items = append(list.Items, &post)
}
```

Finally, we calculate the total amount of posts with:
```go
err = sqldb.QueryRow(ctx,
		/*sql*/ `
		SELECT COUNT(*) 
		FROM posts`).Scan(&list.Total)
	if err != nil {
		return &list, err
	}
```

And calculate the cursor for the next batch, if there is any:
```go
if len(list.Items) > 0 {
		list.NextAfter = list.Items[len(list.Items)-1].ID
	}
```

Add a couple of posts directly to the database and give it a try:
```sh
curl http://localhost:4000/feed
{
  "Items": [
    {
      "ID": 2,
      "Title": "Broken Voxel Tower",
      "Content": "Another #magicavoxel creation of mine. It's a scary broken tower that didn't turn out as scary as I imagined it, but it has some furniture inside and even candles! Though you probably can't see them ...",
      "Image": "/images/002.webp",
      "Liked": false
    },
    {
      "ID": 1,
      "Title": "Voxel Coffee Stand",
      "Content": "This is a #magicavoxel coffee stand I made for the game I want to make one day. Do you like it?",
      "Image": "/images/001.webp",
      "Liked": false
    }
  ],
  "Total": 2,
  "NextAfter": 1
}
```

And the next batch:
```sh
curl http://localhost:4000/feed\?after\=1
{
  "Items": [],
  "Total": 2
}
```

I wrote a unit test that's [too boring to share](https://github.com/ValeriaVG/pixelgram/blob/main/feed/feed_test.go), except maybe for the [quicktest package](https://github.com/frankban/quicktest) that made it a lot easier to handle assertions.

Nonetheless, not the reason to skip testing 🤓

## Fetching data from the API

I've created a helper file in `app/scripts/api.js`:
```js
// @ts-check

/**
 * @typedef Post
 * @type {{
 *  ID: number,
 *  Title: string,
 *  Content: string,
 *  Image: string,
 *  Liked: boolean
 * }}
 */

/**
 * @typedef PostList 
 * @type {{
 *   Items: Array<Post>,
 *   Total: number,
 *   NextAfter: number
 *  }}
 */


const URL = document.location.host.startsWith("localhost") ? "http://localhost:4000" : "https://<encore-id>.encoreapi.com/prod" // set to your Encore App ID

/**
 * 
 * @param {{limit?:number,after?:number}} params 
 * @returns {Promise<PostList>}
 */
export async function listPosts(params) {
    try {
        const res = await fetch(`${URL}/feed${params ? `?${encodeQuery(params)}` : ''}`)
        return await res.json()
    } catch (err) {
        console.error(err)
    }
}

/**
 * Encodes JSON parameters to a query
 * @param {Record<string,string|number|boolean>} obj 
 * @returns {string} query string
 */
function encodeQuery(obj) {
    const pairs = []
    for (const [key, val] of Object.entries(obj)) {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    }
    return pairs.join("&")
}
```

It's a lot of comments and typings, but thats the core of it:
```js
export async function listPosts(params) {
    try {
        const res = await fetch(`${URL}/feed${params ? `?${encodeQuery(params)}` : ''}`)
        return await res.json()
    } catch (err) {
        console.error(err)
    }
}
```

The `encodeQuery` helper is just turning a JSON to a *query string*, e.g.:
```json
{
 "after": 1,
 "limit":10
}
```

Becomes:
```
after=1&limit=10
```

And the `encodeURIComponent` is there to make sure that keys and values will for any string and won't break anything:
```js
encodeURIComponent('&a=b')
//'%26a%3Db'
```

Encore is actually capable of [generating](https://encore.dev/docs/develop/cli-reference#code-generation) a strongly typed TypeScript client API library on it's own 😎

## Creating posts from template

With HTML *template* tag we can create a *document fragment*, that's not visible on the page, but can be cloned and added to the document. Replace the `index.html` *body* with:
```html
  <body>
    <main>
      <loading-indicator>Loading articles...</loading-indicator>
    </main>
    <template>
      <article>
        <like-button>Like</like-button>
        <img src="" alt="Image Description" />
        <p>Post Content</p>
      </article>
    </template>
    <script type="module" src="/scripts/index.js"></script>
  </body>
```

And, in the end of `/scripts/index.js` add this:
```js
import createFeed from './feed.js'
window.addEventListener("DOMContentLoaded", async () => {
    const main = document.querySelector("main")
    /**
    * @type {HTMLElement}
    **/
    const loader = document.querySelector("loading-indicator");
    await createFeed(main, document.querySelector("template")).catch(console.error)
    loader.hidden = true
});
```

The imported `scripts/feed.js` file has a helper function to *clone* the template and set *img* and *p* accordingly:
```js

/**
 * Creates post from template
 * @param {import("./api").Post} post
 * @param {HTMLTemplateElement} template 
 * @returns {Element} post article
 */
const createPost = (post, template) => {
    /**
    * @type {DocumentFragment}
    */
    // @ts-expect-error
    const article = template.content.cloneNode(true)
    /**
     * @type {HTMLImageElement}
     */
    const img = article.querySelector('img')
    img.alt = post.Title
    img.src = post.Image
    /**
    * @type {HTMLParagraphElement}
    */
    const p = article.querySelector("p")
    p.textContent = post.Content
    if (post.Liked) {
        /**
         * @type {import("./LikeButton").default}
         */
        const likeButton = article.querySelector("like-button")
        likeButton.setAttribute("liked", "")
    }
    return article.firstElementChild
}
```

And the actual fetching:
```js

/**
 * 
 * @param {HTMLElement} main 
 * @param {HTMLTemplateElement} template 
 * @returns 
 */
export default async function createFeed(main, template) {
    const res = await listPosts({})

    for (const post of res.Items) {
        const postElement = createPost(post, template)
        main.appendChild(postElement)
    }
}
```

It works, but the posts are loaded only once. We don't have more, but for the sake of testing, let's keep loading the same posts over and over 🙃

## Intersection Observer

The code is quite short, just change the `createFeed` function to:
```js
/**
 * 
 * @param {HTMLElement} main 
 * @param {HTMLTemplateElement} template 
 * @returns 
 */
export default async function createFeed(main, template) {
   let nextAfter = 0
    const lastPostObserver = new IntersectionObserver((entries) => {
        if (entries.length && entries[0].isIntersecting) {
            loadMorePosts()
        }
    }, { threshold: 0.5 });

    const loadMorePosts = async () => {
        lastPostObserver.disconnect()
        const res = await listPosts({ /*after: nextAfter*/ })
        nextAfter = res.NextAfter
        let lastPost;
        for (const post of res.Items) {
            const postElement = createPost(post, template)
            main.appendChild(postElement)
            lastPost = postElement
        }
        lastPostObserver.observe(lastPost)
    }
    await loadMorePosts()
}
```

It uses [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to get notified whenever a post is in or out of view.

And that observer is always *observing* the last post, so whenever this post is visible, more posts are loaded:
```js
const lastPostObserver = new IntersectionObserver((entries) => {
        if (entries.length && entries[0].isIntersecting) {
            loadMorePosts()
        }
    }, { threshold: 0.5 });
```

The `threshold: 0.5` means that the item will be considered *intersecting* once at least half is visible. A `0` would make it trigger when any part is up and `1` would require it to be fully within the view.

Here's how it looks so far:
![Infinite scroll](./j6kg945r3zccnuljhpu9.gif)
 
But, if we scroll long enough we'll end up with a lot of posts on the page, even though we can barely see two of them at once...

## Limiting amount of DOM elements

According to [Lighthouse recommendations](https://web.dev/dom-size/) it's not recommended to have more than `60` nested elements at once or a tree deeper than `32` levels. Such a huge Document Object Model may cause severe performance issues on render and interactions.

But, if the browser doesn't need to render, it doesn't mind storing whatever huge list we feed him as long as there's enough memory 😉. 

Add this to `scripts/index.js`:
```js
/**
 * 
 * @param {HTMLElement} container 
 * @param {number} limit 
 */
const limitChildren = (container, limit) => {
    const before = []
    const after = []
    let top = 0;
    let bottom = 0
    const mutationsObserver = new MutationObserver((changes) => {
        changes.forEach(change => {
            if (container.childElementCount > limit) {
                const child = container.firstElementChild
                const height = child.getBoundingClientRect().height
                top += height
                container.removeChild(child)
                before.push({ child, height })
                container.setAttribute("style", `padding:${top}px 0 ${bottom}px`)
            }
        })
    });
    mutationsObserver.observe(container, { childList: true });
    const onScroll = (event) => {
        const y = document.scrollingElement.scrollTop - container.offsetTop
        if (top > 0 && y <= top) {
            const child = container.lastElementChild
            const height = child.getBoundingClientRect().height
            bottom += height
            container.removeChild(child)
            after.unshift({ child, height })
            const prev = before.pop()
            top -= prev.height
            container.prepend(prev.child)
            container.setAttribute("style", `padding:${top}px 0 ${bottom}px`)
            return
        }
        if (bottom && y >= container.clientHeight - bottom - window.innerHeight) {
            const child = container.firstElementChild
            const height = child.getBoundingClientRect().height
            top += height
            container.removeChild(child)
            before.push({ child, height })
            const next = after.shift()
            container.appendChild(next.child)
            bottom -= next.height
            container.setAttribute("style", `padding:${top}px 0 ${bottom}px`)
            return
        }

    }
    document.addEventListener("scroll", onScroll)
    return () => {
        mutationsObserver.disconnect()
        document.removeEventListener("scroll", onScroll)
    }
}
```

And add this to the `DOMContentLoaded` listener:
```js
 const main = document.querySelector("main")
 limitChildren(main, 10) // <- add this line
```

No matter how long you scroll, it'll never be more than 10 items at the same time:
![Inspector showing how articles appear and disappear](./yqfeix5as0i4wtrrpjh2.gif)
 
There is a lot of code, but the main idea is to remove items from the DOM, increase the container *padding* for the same height as the removed element and keep them in memory till they are needed again.

This *mutation observer* is set to notify on any changes in the direct *child list* of a container, i.e. `main`:
```js
const mutationsObserver = new MutationObserver((changes) => {
        changes.forEach(change => {
            /* process changes */
        })
    });
    mutationsObserver.observe(container, { childList: true });
```

Whenever children change we check if there are too many, remove the first item from the top and attach it to an object as a property, that allows us to keep it as a *reference* in , push to the `before` array and adjust the styles:
```js
 if (container.childElementCount > limit) {
                const child = container.firstElementChild
                const height = child.getBoundingClientRect().height
                top += height
                container.removeChild(child)
                before.push({ child, height })
                container.setAttribute("style", `padding:${top}px 0 ${bottom}px`)
            }
```

This works because we so far have been adding items one by one, so there can never be more than one "extra" element, it'll be removed right after it was added.

The rest of the code is listening to a `scroll` event:
```js
const onScroll = (event) => {
        const y = document.scrollingElement.scrollTop - container.offsetTop
        if (top > 0 && y <= top) {
            /** needs more on top **/
          return
        }
        if (bottom && y >= container.clientHeight - bottom - window.innerHeight) {
            /** needs more on the bottom **/
            return
        }

    }
    document.addEventListener("scroll", onScroll)
```

It's already looking pretty good, wouldn't you say?
But I can think of something to make it even better...

## Bonus Challenge

I find the current `loading-indicator` quite meh, how about you make it into an actual WebComponent using, e.g. one of [CSS-only loaders by Temani Afif](https://dev.to/afif/i-am-back-with-100-dark-mode-css-loaders-4gp6)?

Oh and to make the loading experience even smoother, add a little bit of animation to the articles, e.g. a fade-in effect:
```css
@keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
```

What's the perfect duration for it in your opinion and why?

Till the next time! And good luck!
