import { Fragment } from "https://deno.land/x/nano_jsx@v0.0.33/fragment.ts";
import { h, Helmet } from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
import Info from "../components/info.tsx";
import { Article } from "../types.ts";
export default function ArticlePage({
  title,
  tags,
  date,
  content,
  dev_to,
  twitter,
}: Article) {
  return (
    <Fragment>
      <Helmet>
        <title>{title} - ValeriaVG</title>
        <link rel="stylesheet" href="/dracula.css">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
        </link>
      </Helmet>
      <Helmet footer>
        <script>hljs.highlightAll();</script>
      </Helmet>
      <h1 style="margin-bottom: 0.5rem">{title}</h1>
      <Info tags={tags} date={date} />
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      <section class="links">
        {!!dev_to && (
          <a
            href={`${dev_to}#comments`}
            target="_blank"
            rel="noopener noreferrer"
            class="dev-to-link"
          >
            Discuss on Dev
          </a>
        )}
        {!!twitter && (
          <a
            href={`https://twitter.com/intent/tweet?in_reply_to=${twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            class="twitter-link"
          >
            Discuss on Twitter
          </a>
        )}

        <script
          type="text/javascript"
          src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
          data-name="bmc-button"
          data-slug="valeriavg"
          data-color="#ffffff"
          data-emoji=""
          data-font="Cookie"
          data-text="Buy me a coffee"
          data-outline-color="#000000"
          data-font-color="#000000"
          data-coffee-color="#FFDD00"
        ></script>
      </section>
    </Fragment>
  );
}
