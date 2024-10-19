import { css } from "@emotion/css";
import { Article } from "#types";
import { Info } from "./Info.tsx";

export function List({
  articles,
  linkOnly,
}: {
  articles: Article[];
  linkOnly?: boolean;
}) {
  if (!articles.length) return null;
  return (
    <>
      {articles.map((article) => (
        <article class={styles.article}>
          <a href={"/" + article.url} class={styles.title}>
            {linkOnly ? article.title : <h2>{article.title}</h2>}
          </a>
          <Info tags={article.tags} date={new Date(article.date)} />
          <p>{article.summary}</p>
          <a href={"/" + article.url}>[read more]</a>
        </article>
      ))}
    </>
  );
}

const styles = {
  article: css({
    padding: "1rem 0",
    "& + article": {
      borderTop: "1px solid gainsboro",
    },
    '>a': css({
      fontSize: '1rem',
      fontWeight: 'bold'
    })
  }),
  title: css({
    textDecoration: "none",
  }),
};
