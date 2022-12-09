#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import buildBlog from "./lib/blog.ts";

// Generate assets
await buildBlog()
await dev(import.meta.url, "./main.ts");
