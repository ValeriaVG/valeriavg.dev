import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { parse } from "https://deno.land/x/xml@6.0.0/mod.ts";
import app from "./mod.ts";

describe("Routes", () => {
  const urls: Array<{ loc: string; lastmod: string }> = [];
  beforeAll(async () => {
    Deno.env.set("BASE_URL", "/");
    const res = await app.request("/sitemap.xml");
    expect(res).toHaveProperty("status", 200);
    const xml = parse(await res.text());
    urls.push(...(xml["urlset"] as any)["url"]);
  });
  it("has more that one URL", () => {
    expect(urls.length).toBeGreaterThan(1);
  });
  it("has home page url", () => {
    expect(urls.find((url) => url.loc === "/")).toBeTruthy();
  });
  it("all routes defined in sitemap.xml respond with 200", async () => {
    for (const url of urls) {
      const resp = await app.request(url.loc);
      expect(resp).toHaveProperty("status", 200);
    }
  });
});
