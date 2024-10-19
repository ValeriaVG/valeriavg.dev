import type { Article } from "#types";
import Head, { Meta } from "#core/Head.tsx";
import { raw } from "hono/html";
import { Info } from "./Info.tsx";
import { css } from "@emotion/css";
import { List } from "./List.tsx";

export default function ArticlePage({
  article,
  relatedArticles,
}: {
  article: Article;
  relatedArticles: Article[];
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    datePublished: new Date(article.date).toISOString(),
    author: [
      {
        "@type": "Person",
        name: "Valeria Viana Gusmao",
      },
    ],
    abstract: article.summary,
    keywords: article.tags,
  };

  return (
    <main>
      <Meta
        title={article.title}
        description={article.summary || ""}
        canonical={`https://valeriavg.dev/${article.url}`}
      />
      <Head>
        <link rel="stylesheet" href="/prism.css" />
      </Head>
      <script type="application/ld+json">
        {raw(JSON.stringify(structuredData))}
      </script>
      <h1 style="margin-bottom: 0.5rem">{article.title}</h1>
      <Info tags={article.tags} date={new Date(article.date)} />
      <div>{raw(article.content)}</div>
      <section class={styles.links}>
        {!!article.dev_to && (
          <a
            href={`${article.dev_to}#comments`}
            target="_blank"
            rel="noopener noreferrer"
            class={styles.devToLink}
          >
            Discuss on Dev
          </a>
        )}
        {!!article.twitter && (
          <a
            href={`https://twitter.com/intent/tweet?in_reply_to=${article.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            class={styles.twitterLink}
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
      {relatedArticles.length > 0 && (
        <section class={styles.related}>
          <header>Related articles</header>
          <List articles={relatedArticles} linkOnly />
        </section>
      )}
    </main>
  );
}

const styles = {
  links: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: "0.5rem",
    },
  }),
  devToLink: css({
    color: "white",
    background: "black",
    padding: "0.5rem 1rem",
    textDecoration: "none",
  }),
  twitterLink: css({
    color: "white",
    background: "#1da1f2",
    padding: "0.5rem 1rem",
    textDecoration: "none",
  }),
  related: css({
    marginTop: "2rem",
    header: {
      fontSize: "1.25rem",
      fontWeight: "bold",
    },
  }),
};
