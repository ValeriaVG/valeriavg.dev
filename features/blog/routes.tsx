import { Hono } from "hono";
import { serveStatic } from "hono/deno";

import {
  articlesByPubDate,
  articlesByTag,
  content,
} from "#content";
import HomePage from "./HomePage.tsx";
import TagPage from "./TagPage.tsx";
import ArticlePage from "./ArticlePage.tsx";
import { paginate } from "./utils.ts";

const app = new Hono();

app.get("/:page{[0-9]+}?", (c) => {
  if (c.req.param().page === "1") return c.redirect("/");
  const page = parseInt(c.req.param().page ?? "1");
  const paginated = paginate(articlesByPubDate, { page, pageSize: 3 });
  if (!paginated) return c.notFound();
  return c.render(
    <HomePage
      articles={paginated?.items}
      totalPages={paginated?.totalPages}
      page={page}
    />
  );
});

app.get("/tags/:tag/:page{[0-9]+}?", (c) => {
  const { tag } = c.req.param();
  const allArticles = articlesByTag[tag];
  if (!allArticles) return c.notFound();
  if (c.req.param().page === "1") return c.redirect(`/tags/${tag}`);
  const page = parseInt(c.req.param().page ?? "1");
  const paginated = paginate(allArticles, { page, pageSize: 3 });
  if (!paginated) return c.notFound();
  return c.render(
    <TagPage
      tag={tag}
      articles={paginated.items}
      page={page}
      totalPages={paginated.totalPages}
    />
  );
});

app.get("/:slug{[-a-z0-9]+}", (c) => {
  const { slug } = c.req.param();
  const article = content[slug];
  if (!article) return c.notFound();
  const relatedArticles = [
    ...new Set(
      article.tags
        .flatMap((tag) => articlesByTag[tag])
        .filter((a) => a.url !== article.url)
    ),
  ];
  const idx = Math.floor(Math.random() * relatedArticles.length);
  return c.render(
    <ArticlePage article={article} relatedArticles={[relatedArticles[idx]]} />
  );
});
app.get(
  "/:slug{[-a-z0-9]+}/:filename{.+\\.(png|svg|jpeg|jpg)$}",
  serveStatic({ root: "./content" })
);

export default app;
