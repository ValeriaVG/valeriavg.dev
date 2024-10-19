import { Hono } from "hono";
import { createSitemap } from "./sitemap.ts";

const app = new Hono();

const sitemap = createSitemap();
app.get("/sitemap.xml", (c) =>
  c.text(sitemap, 200, { "Content-Type": "application/xml" })
);

export default app;
