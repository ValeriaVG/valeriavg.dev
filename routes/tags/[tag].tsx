import { Head } from "$fresh/runtime.ts";
import { Article } from "$/types.ts";
import { Layout, List } from "$/blocks/mod.ts";
import { Handler, Handlers, PageProps } from "$fresh/server.ts";
import { articlesByTag } from "$/content/mod.ts";

interface Data {
  articles: Article[];
  tag: string;
}

const renderTag: Handler<Data> = (_req, ctx) => {
  const tag = ctx.params.tag;
  if (tag in articlesByTag) {
    return ctx.render({ articles: articlesByTag[tag], tag });
  }
  return ctx.renderNotFound();
};

export const handler: Handlers<Data> = {
  GET: renderTag,
  HEAD: renderTag,
};

export default function TagPage({ data: { articles, tag },params }: PageProps<Data>) {
  return (
    <Layout>
      <Head>
        <title>#{tag} - ValeriaVG</title>
        <meta name="description" content={`Blog posts about ${tag}`} />
        <link rel="canonical" href={`https://valeriavg.dev/tags/${params.tag}`} />
      </Head>
      <h1>#{tag}</h1>
      <List articles={articles} />
    </Layout>
  );
}
