import {
  Fragment,
  h,
  Helmet,
} from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
import { List } from "../components/list.tsx";
import { Article } from "../types.ts";
export default function TagPage({
  articles,
  tag,
}: {
  articles: Article[];
  tag: string;
}) {
  return (
    <Fragment>
      <Helmet>
        <title>#{tag} - ValeriaVG</title>
      </Helmet>
      <h1>#{tag}</h1>
      <List articles={articles} />
    </Fragment>
  );
}
