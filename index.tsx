import { serve } from "https://deno.land/std@0.156.0/http/server.ts";
import {
  h,
  Helmet,
  renderSSR,
} from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
import { lookup } from "https://deno.land/x/mime_types@1.0.0/mod.ts";
import { extract } from "https://deno.land/std@0.145.0/encoding/front_matter.ts";
import {
  Marked,
  MarkedOptions,
  Renderer,
} from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import loadFS from "./lib/memfs.ts";
import PageNotFound from "./pages/404.tsx";
import Layout from "./pages/layout.tsx";
import { Article } from "./types.ts";
import ArticlePage from "./pages/article.tsx";
import HomePage from "./pages/home.tsx";
import TagPage from "./pages/tag.tsx";

const staticContent = await loadFS("./static");
const rawContent = await loadFS("./content");
const content: Record<string, Article> = {};
const defaultRenderer = new Renderer();

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

    const options = new MarkedOptions();
    options.renderer = new Renderer();
    options.renderer.link = (href, title, text) => {
      if (href.startsWith("http")) {
        return `<a href="${href}"${
          title ? ` title="${title}"` : ""
        } rel="noopener noreferrer">${text}</a>`;
      }
      return defaultRenderer.link(href, title, text);
    };

    options.renderer.image = (
      href: string,
      title: string,
      text: string
    ): string => {
      if (href.startsWith(".")) {
        href = article.url + href.slice(1);
      }
      return defaultRenderer.image(href, title, text);
    };

    article.content = Marked.parse(data.body, options).content;
    content[article.url] = article;
  } catch (error) {
    error.message = `${error.message} while parsing /content${pathname}`;
    throw error;
  }
}

const articlesByPubDate = Object.values(content).sort(
  (a, b) => b.date.getTime() - a.date.getTime()
);

const articlesByTag = Object.values(content).reduce((a, c) => {
  for (const tag of c.tags) {
    if (!(tag in a)) {
      a[tag] = [];
    }
    a[tag].push(c);
    a[tag].sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  return a;
}, {} as Record<string, Article[]>);

const BASE_URL = Deno.env.get("BASE_URL") || "https://valeriavg.dev";

const sitemap: string = (() => {
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.keys(articlesByTag)
  .map(
    (tag) => `<url>
  <loc>${BASE_URL}tags/${tag}</loc>
  <lastmod>${articlesByTag[tag][0].date.toISOString()}</lastmod>
</url>`
  )
  .join("\n")}
${articlesByPubDate
  .map(
    (article) => `<url>
    <loc>${BASE_URL}${article.url}</loc>
    <lastmod>${article.date.toISOString()}</lastmod>
  </url>`
  )
  .join("\n")}
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${articlesByPubDate[0].date.toISOString()}</lastmod>
  </url>
</urlset>`;
})();

const render = (app: JSX.ElementChildrenAttribute) => {
  const { body, head, footer, attributes } = Helmet.SSR(
    renderSSR(<Layout children={app} />)
  );

  return `
<!DOCTYPE html>
<html ${attributes.html.toString()}>
  <head>
    ${head.join("\n")}
  </head>
  <body ${attributes.body.toString()}>
    ${body}
    ${footer.join("\n")}
  </body>
</html>`;
};

serve((req: Request) => {
  const { pathname: rawPathname } = new URL(req.url);

  if (rawPathname === "/") {
    return new Response(render(<HomePage articles={articlesByPubDate} />), {
      headers: { "content-type": "text/html" },
    });
  }
  const pathname = rawPathname.replace(/\/$/, "");

  if (pathname === "/sitemap.xml") {
    return new Response(sitemap, {
      headers: { "content-type": "application/xml" },
    });
  }

  if (pathname in staticContent) {
    return new Response(staticContent[pathname], {
      headers: {
        "content-type": lookup(pathname) || "application/octet-stream",
      },
    });
  }

  if (pathname in content) {
    return new Response(render(<ArticlePage {...content[pathname]} />), {
      headers: {
        "content-type": "text/html",
      },
    });
  }

  if (pathname.startsWith("/tags")) {
    const tag = pathname.slice(6);
    if (tag in articlesByTag) {
      return new Response(
        render(<TagPage articles={articlesByTag[tag]} tag={tag} />),
        {
          headers: { "content-type": "text/html" },
        }
      );
    }
  }

  return new Response(render(<PageNotFound />), {
    headers: { "content-type": "text/html" },
  });
});
