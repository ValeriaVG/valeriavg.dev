import { Hono } from "hono";

const app = new Hono();

const feed = new TextDecoder().decode(
  await Deno.readFile("./features/feed/feed.xml")
);

app.get("/", (c) => {
  return c.text(feed, 200, {
    "Content-Type": "application/atom+xml",
  });
});

export default app