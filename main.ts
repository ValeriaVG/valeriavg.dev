import { serveStatic } from "hono/deno";
import app from "./features/mod.ts";
import PageNotFound from "#theme/PageNotFound.tsx";
import { render } from "./core/renderer.tsx";
import { createElement } from "hono/jsx";

app.use(
  "/:filename{.+\\.(png|svg|jpeg|jpg|txt|css)$}",
  serveStatic({
    root: "./static",
  })
);
app.notFound((c) => {
  const rendered = render({ children: createElement(PageNotFound, {}) });
  return c.html(rendered, 404);
});
Deno.serve(app.fetch);
