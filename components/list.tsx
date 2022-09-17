import { h, Fragment } from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
import { Article } from "../types.ts";
import Info from "./info.tsx";

export function List({ articles }: { articles: Article[] }) {
  return (
    <Fragment>
      {articles.map((article) => (
        <article>
          <a href={article.url} class="title">
            <h2>{article.title}</h2>
          </a>
          <Info tags={article.tags} date={article.date} />
          <p>{article.summary}</p>
          <a href={article.url}>[read more]</a>
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
    </Fragment>
  );
}
