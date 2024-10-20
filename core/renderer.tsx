import { jsxRenderer } from "hono/jsx-renderer";
import { cache } from "@emotion/css";
import { Layout } from "../theme/Layout.tsx";
import HTML from "./html.ts";
import createEmotionServer from "@emotion/server/create-instance";
import type { FC, JSX, JSXNode, PropsWithChildren } from "hono/jsx";
import { HEAD_CONTEXT, addToHead } from "./Head.tsx";
import { raw } from "hono/html";

export const renderPage = ({ children }: PropsWithChildren) => {
  const head: Array<JSXNode | string> = [];
  const body = (
    <HEAD_CONTEXT.Provider value={{ addToHead: addToHead(head) }}>
      <Layout>{children}</Layout>
    </HEAD_CONTEXT.Provider>
  );
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);
  const chunks = extractCriticalToChunks(body.toString());
  const tags = constructStyleTagsFromChunks(chunks);
  head.push(raw(tags));
  return <HTML head={head}>{body}</HTML>;
};

export const render = (element: JSXNode) => {
  const body = element.toString() as string
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);
  const chunks = extractCriticalToChunks(body);
  const style = constructStyleTagsFromChunks(chunks);
  return [style,body].join('')
}

export default jsxRenderer(renderPage);
