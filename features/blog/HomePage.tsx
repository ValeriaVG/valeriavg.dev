import Head, { Meta } from "#core/Head.tsx";
import type { Article } from "#types";
import { List } from "./List.tsx";
import Pagination from "./Pagination.tsx";

export default function HomePage({
  articles,
  page,
  totalPages,
}: {
  articles: Article[];
  page: number;
  totalPages: number;
}) {
  return (
    <main>
      <Meta
        title={page > 1 ? `Blog posts / Page ${page}` : "Blog posts"}
        description={
          page > 1
            ? "Blog about frontend, backend and everything in between"
            : undefined
        }
      />
      <Head>
        <link
          href="/feed"
          type="application/atom+xml"
          rel="alternate"
          title="ValeriaVG Blog feed"
        />
      </Head>
      <List articles={articles} />
      <Pagination current={page} total={totalPages} baseUrl="" />
    </main>
  );
}
