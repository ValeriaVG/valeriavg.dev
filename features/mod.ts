import { Hono } from "hono";
import jsxRendererMiddleware from "../core/renderer.tsx";
import blog from "./blog/routes.tsx";
import sitemap from "./sitemap/routes.ts";
import feed from "./feed/routes.ts";

const app = new Hono();
// Technical
app.route("/", sitemap);
app.route("/feed", feed);
// Pages
app.use(jsxRendererMiddleware);
app.route("/", blog);

export default app;
