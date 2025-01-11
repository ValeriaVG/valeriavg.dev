import * as uuid from "jsr:@std/uuid";

const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");
};

const articleTemplate = ({ title }: { title: string }) =>
  `---
title: "${title}"
date: ${new Date().toISOString()}
tags: []
draft: true
summary: |
  Description here
id: "${uuid.v1.generate()}"
---

Content here
`;

const [title] = Deno.args;
if (!title) throw new Error("Please provide title");
const slug = slugify(title);
await Deno.mkdir(`./content/${slug}`)
await Deno.writeFile(
  `./content/${slug}/index.md`,
  new TextEncoder().encode(articleTemplate({ title }))
);
