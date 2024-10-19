import { Meta } from "#core/Head.tsx";
import type { Article } from "#types";
import { List } from "./List.tsx";
import Pagination from "./Pagination.tsx";

export default function TagPage({
  articles,
  tag,
  page,
  totalPages,
}: {
  tag: string;
  articles: Article[];
  page: number;
  totalPages: number;
}) {
  return (
    <main>
      <Meta
        title={`#${tag}`}
        description={`Blog posts about ${tag}`}
        canonical={`https://valeriavg.dev/tags/${tag}`}
      />
      <List articles={articles} />
      <Pagination current={page} total={totalPages} baseUrl={`/tags/${tag}`} />
    </main>
  );
}
