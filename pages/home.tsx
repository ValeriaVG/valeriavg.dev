import {
  Fragment,
  h,
  Helmet,
} from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
import { List } from "../components/list.tsx";
import { Article } from "../types.ts";
export default function HomePage({ articles }: { articles: Article[] }) {
  return (
    <Fragment>
      <Helmet>
        <title>ValeriaVG</title>
      </Helmet>
      <List articles={articles} />
    </Fragment>
  );
}
