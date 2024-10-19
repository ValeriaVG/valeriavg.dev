import {
  createContext,
  type JSXNode,
  useContext,
  type Child,
  type FC,
  type PropsWithChildren,
} from "hono/jsx";

export const HEAD_CONTEXT = createContext<{
  addToHead: (nodes: Child) => void;
}>({ addToHead: () => {} });

const Head: FC = ({ children }: PropsWithChildren) => {
  const { addToHead } = useContext(HEAD_CONTEXT);
  addToHead(children);
  return null;
};

export const addToHead: (
  store: Array<JSXNode | string>
) => (nodes: Child) => void = (store) => (nodes) => {
  const items = Array.isArray(nodes) ? nodes : [nodes];
  for (const node of items) {
    if (typeof node === "string" || typeof node === "object")
      store.push(node as JSXNode | string);
  }
};

export default Head;

export const Meta = ({
  title,
  description,
  canonical,
}: {
  title: string;
  description?: string;
  canonical?: string;
}) => {
  return (
    <Head>
      <title>{title} - ValeriaVG</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
};
