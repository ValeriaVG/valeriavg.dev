import { useEffect } from "preact/hooks";

export default function Content({ html }: { html: string }) {
  useEffect(() => {
    (window as unknown as Window & { hljs: { highlightAll: () => void } }).hljs
      .highlightAll();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}
