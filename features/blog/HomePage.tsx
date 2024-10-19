import { Meta } from "#core/Head.tsx";
import type { Article } from "#types";
import { List } from "./List.tsx";

export default function HomePage({articles}:{articles: Article[]}) {
  return (
    <main>
      <Meta
        title="Blog posts"
        description="Blog about frontend, backend and everything in between"
      />
      <List articles={articles} />
    </main>
  );
}
