import { Head } from "$fresh/runtime.ts";
import { Article } from "$/types.ts";
import { Layout, List } from "$/blocks/mod.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { articlesByTag } from "$/content/mod.ts";

interface Data {
  articles: Article[];
  tag: string;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    const tag = ctx.params.tag;
    if (tag in articlesByTag) {
      return ctx.render({ articles: articlesByTag[tag], tag });
    }
    return ctx.renderNotFound();
  },
};

export default function TagPage({
  data: {
    articles,
    tag,
  },
}: PageProps<Data>) {
  return (
    <Layout>
      <Head>
        <title>#{tag} - ValeriaVG</title>
      </Head>
      <h1>#{tag}</h1>
      <List articles={articles} />
    </Layout>
  );
}
