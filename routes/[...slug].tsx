import { Head } from "$fresh/runtime.ts";
import { Handler, Handlers, PageProps } from "$fresh/server.ts";
import { Info, Layout } from "$/blocks/mod.ts";
import { Article } from "../types.ts";
import { lookup } from "https://deno.land/x/mime_types@1.0.0/mod.ts";
import { content, staticContent } from "$/content/mod.ts";

interface Data {
  article: Article;
}

const renderArticle: Handler<Data> = async (_req, ctx) => {
  const slug = ctx.params.slug;
  const article = content[slug];
  if (article) {
    return ctx.render({ article });
  }
  const file = staticContent[slug];
  if (file) {
    const mime = lookup(slug);
    return new Response(await Deno.readFile(file), {
      headers: { "content-type": mime || "application/octet-stream" },
    });
  }
  return ctx.renderNotFound();
};

export const handler: Handlers<Data> = {
  GET: renderArticle,
  HEAD: renderArticle,
};

export default function ArticlePage({ data, params }: PageProps<Data>) {
  const { title, tags, date, content, dev_to, twitter, summary } = data.article;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: new Date(date).toISOString(),
    author: [
      {
        "@type": "Person",
        name: "Valeria Viana Gusmao"
      },
    ],
    abstract: summary,
    keywords: tags
  };

  return (
    <Layout>
      <Head>
        <title>{title} - ValeriaVG</title>
        <meta name="description" content={summary} />
        <link rel="stylesheet" href="/prism.css" />
        <link rel="canonical" href={`https://valeriavg.dev/${params.slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <h1 style="margin-bottom: 0.5rem">{title}</h1>
      <Info tags={tags} date={new Date(date)} />
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
    </Layout>
  );
}
