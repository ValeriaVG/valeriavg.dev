import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Article } from "$/types.ts";
import { Layout, List } from "$/blocks/mod.ts";
import { articlesByPubDate } from "$/content/mod.ts";

interface Data {
  articles: Article[];
}

export const handler: Handlers<Data> = {
  HEAD(_req, ctx) {
    return ctx.render({ articles: articlesByPubDate });
  },
  GET(_req, ctx) {
    return ctx.render({ articles: articlesByPubDate });
  },
};

export default function HomePage({ data }: PageProps<Data>) {
  return (
    <Layout>
      <Head>
        <title>ValeriaVG</title>
        <meta
          name="description"
          content="Blog about frontend, backend and everything in between"
        />
      </Head>
      <List articles={data.articles} />
    </Layout>
  );
}
