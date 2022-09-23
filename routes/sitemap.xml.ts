import { Handlers } from "$fresh/server.ts";
import { articlesByPubDate, articlesByTag } from "$/content/mod.ts";


const BASE_URL = Deno.env.get("BASE_URL") || "https://valeriavg.dev";

const sitemap: string = (() => {
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.keys(articlesByTag)
      .map(
        (tag) => `<url>
  <loc>${BASE_URL}/tags/${tag}</loc>
  <lastmod>${articlesByTag[tag][0].date.toISOString()}</lastmod>
</url>`
      )
      .join("\n")}
${articlesByPubDate
      .map(
        (article) => `<url>
    <loc>${BASE_URL}/${article.url}</loc>
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

export const handler: Handlers = {
  GET(_req, _ctx) {
    return new Response(sitemap, { headers: { 'content-type': 'application/xml' } })
  }
}