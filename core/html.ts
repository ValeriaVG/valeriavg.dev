import type { Child, PropsWithChildren } from "hono/jsx";
import { html } from "hono/html";

export default function HTML({
  head = "",
  children = "",
  html: htmlProps,
  lang = "en",
}: PropsWithChildren<{
  head?: Child;
  html?: Record<string, string>;
  lang?: string;
}>) {
  const htmlAttributes = Object.entries(Object.assign({ lang }, htmlProps));

  return html`<!DOCTYPE html>
    <html ${htmlAttributes}>
      <head>
        <meta charset="UTF-8" />
        ${head}
      </head>
      <body>
        ${children}
      </body>
    </html>`;
}
