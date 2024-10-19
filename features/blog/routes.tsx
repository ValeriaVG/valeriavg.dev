import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { articlesByPubDate, articlesByTag, content } from "#content";
import HomePage from "./HomePage.tsx";
import TagPage from "./TagPage.tsx";
import ArticlePage from "./ArticlePage.tsx";
const app = new Hono();

app.get("/", (c) => {
  return c.render(<HomePage articles={articlesByPubDate} />);
});

app.get("/tags/:tag", (c) => {
  const { tag } = c.req.param();
  const articles = articlesByTag[tag];
  if (!articles) return c.notFound();
  return c.render(<TagPage tag={tag} articles={articles} />);
});

app.get("/:slug{[-a-z0-9]+}", (c) => {
  const { slug } = c.req.param();
  const article = content[slug];
  if (!article) return c.notFound();
  return c.render(<ArticlePage article={article} />);
});
app.get(
  "/:slug{[-a-z0-9]+}/:filename{.+\\.(png|svg|jpeg|jpg)$}",
  serveStatic({ root: "./content" })
);

export default app;
