import * as Marked from "https://esm.sh/marked@4.0.12";
export { default as Prism } from "https://esm.sh/prismjs@1.27.0";
import { escape as htmlEscape } from "https://esm.sh/he@1.2.0";
import Prism from "https://esm.sh/prismjs@1.27.0";

import "https://esm.sh/prismjs@1.27.0/components/prism-markup?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-css?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-clike?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-javascript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-go?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-graphql?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-js-extras?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-json?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-lua?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-makefile?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-markdown?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-jsx?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-tsx?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-rust?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-shell-session?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-sql?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-toml?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-typoscript?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-yaml?no-check";
import SSIComponents from "#content/ssi.ts";
import { render } from "#core/renderer.tsx";
import { createElement } from "hono/jsx";

export default class Renderer extends Marked.Renderer {
  constructor(private baseUrl: string, options?: Marked.marked.MarkedOptions) {
    super(options);
  }

  override link(href: string, title: string, text: string) {
    if (href.startsWith("http")) {
      return `<a href="${href}"${
        title ? ` title="${title}"` : ""
      } rel="noopener noreferrer" target="_blank">${text}</a>`;
    }
    return super.link(href, title, text);
  }

  override image(href: string, title: string, text: string): string {
    if (href.startsWith(".")) {
      href = this.baseUrl + href.slice(1);
    }
    return super.image(href, title, text);
  }

  override code(code: string, lang?: string) {
    // a language of `ts, ignore` should really be `ts`
    let language = lang?.split(",")?.[0];
    if (language === "sh") {
      language = "bash";
    }
    if (language === "rs") {
      language = "rust";
    }
    const grammar =
      language && Object.hasOwnProperty.call(Prism.languages, language)
        ? Prism.languages[language]
        : undefined;
    if (grammar === undefined) {
      return `<pre><code class="notranslate">${htmlEscape(code)}</code></pre>`;
    }
    const html = Prism.highlight(code, grammar, language!);
    return `<div class="highlight highlight-source-${language} notranslate"><pre>${html}</pre></div>`;
  }

  override html(html: string): string {
    const ssiMatch = /<!--render:(.+)-->/.exec(html);
    if (ssiMatch?.length) {
      const filename = ssiMatch[1];
      const ssi = SSIComponents.get(filename);
      if (!ssi) return html;
      const content = render(createElement(ssi.Component, {}));
      return [
        content,
        `<script type="module" src="${ssi.script}"></script>`,
      ].join("");
    }
    return html;
  }
}
