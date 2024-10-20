import { serveStatic } from "hono/deno";
import app from "./features/mod.ts";
import PageNotFound from "#theme/PageNotFound.tsx";
import { renderPage } from "./core/renderer.tsx";
import { createElement } from "hono/jsx";

app.use(
  "/:filename{.+\\.(png|svg|jpeg|jpg|txt|css|js)$}",
  serveStatic({
    root: "./static",
  })
);
app.notFound((c) => {
  const rendered = renderPage({ children: createElement(PageNotFound, {}) });
  return c.html(rendered, 404);
});
Deno.serve(app.fetch);
