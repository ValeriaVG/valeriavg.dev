import { Article } from "../types.ts";
import { Info } from "$/blocks/mod.ts";

export function List({ articles }: { articles: Article[] }) {
  return (
    <>
      {articles?.map((article) => (
        <article>
          <a href={"/" + article.url} class="title">
            <h2>{article.title}</h2>
          </a>
          <Info tags={article.tags} date={article.date} />
          <p>{article.summary}</p>
          <a href={"/" + article.url}>[read more]</a>
        </article>
      ))}
      <style type="text/css">
        {`
      article {
        padding: 1rem 0;
      }
      article .title {
        text-decoration: none;
      }
      article + article {
        border-top: 1px solid gainsboro;
      }`}
      </style>
    </>
  );
}
