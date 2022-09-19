import { Head } from "$fresh/runtime.ts";
import { UnknownPageProps } from "$fresh/server.ts";
import { Layout } from "$/blocks/mod.ts";
export default function PageNotFound(props: UnknownPageProps) {
  return (
    <Layout>
      <Head>
        <title>Page Not Found - ValeriaVG</title>
      </Head>
      <h1>Page Not Found</h1>
      <p>This page doesn't exist.</p>
    </Layout>
  );
}
