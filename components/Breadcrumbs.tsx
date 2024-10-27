import { css } from "@emotion/css";

export default function Breadcrumbs({
  path,
  current,
}: {
  path: Array<{ url: string; title: string }>;
  current: string;
}) {
  return (
    <ol
      itemscope
      itemtype="https://schema.org/BreadcrumbList"
      className={styles.list}
    >
      {path.map((item, i) => (
        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <a itemprop="item" href={item.url}>
            <span itemprop="name">{item.title}</span>
          </a>
          <meta itemprop="position" content={(i + 1).toString()} />
        </li>
      ))}
      <li
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <span itemprop="name">{current}</span>
        <meta itemprop="position" content={(path.length + 1).toString()} />
      </li>
    </ol>
  );
}

const styles = {
  list: css({
    display: "flex",
    gap: "0.5rem",
    listStyleType: "none",
    margin: 0,
    padding: 0,
    li: {
      "::before": {
        display:'inline-block',
        content: "›",
        margin: "0 0.5rem",
      },
    },
  }),
};
