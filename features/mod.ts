import { Hono } from "hono";
import jsxRendererMiddleware from "../core/renderer.tsx";
import blog from "./blog/routes.tsx";
import sitemap from "./sitemap/routes.ts";

const app = new Hono();
// Technical
app.route("/", sitemap);
// Pages
app.use(jsxRendererMiddleware);
app.route("/", blog);

export default app;
