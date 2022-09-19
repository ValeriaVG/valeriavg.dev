import loadFS from "$/lib/memfs.ts";
import { Article } from "$/types.ts";
import { extract } from "https://deno.land/std@0.145.0/encoding/front_matter.ts";
import * as Marked from "https://esm.sh/marked@4.0.12"
import Renderer from "$/lib/renderer.ts";

const staticContent: Record<string, Uint8Array> = {}
const rawContent = await loadFS("./content");
const content: Record<string, Article> = {};



for (const pathname in rawContent) {
    if (!pathname.endsWith(".md")) {
        // Store static files in the relative paths
        staticContent[pathname] = rawContent[pathname];
        continue;
    }
    try {
        const text = new TextDecoder().decode(rawContent[pathname]);
        const data = extract<Omit<Article, "url" | "content">>(text);
        const article = { ...data.attrs } as Article;
        article.url = pathname.replace(/(\/index|)\.md$/, "");
        const renderer = new Renderer(article.url)
        article.content = await Marked.marked(data.body, { renderer });
        content[article.url] = article;
    } catch (error) {
        error.message = `${error.message} while parsing /content${pathname}`;
        throw error;
    }
}

export const articlesByPubDate = Object.values(content).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
);

export const articlesByTag = Object.values(content).reduce((a, c) => {
    for (const tag of c.tags) {
        if (!(tag in a)) {
            a[tag] = [];
        }
        a[tag].push(c);
        a[tag].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    return a;
}, {} as Record<string, Article[]>);

export { content, staticContent }