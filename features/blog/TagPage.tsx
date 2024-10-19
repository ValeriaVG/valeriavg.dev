import { Meta } from "#core/Head.tsx";
import type { Article } from "#types";
import { List } from "./List.tsx";

export default function TagPage({
  articles,
  tag,
}: {
  tag: string;
  articles: Article[];
}) {
  return (
    <main>
      <Meta
        title={`#${tag}`}
        description={`Blog posts about ${tag}`}
        canonical={`https://valeriavg.dev/tags/${tag}`}
      />
      <List articles={articles} />
    </main>
  );
}
