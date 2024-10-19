import { css } from "@emotion/css";

export default function Pagination({
  current = 1,
  total,
  baseUrl,
}: {
  current?: number;
  total: number;
  baseUrl: string;
}) {
  if (total < 2) return null;
  return (
    <nav>
      <ul class={styles.list}>
        {Array(total)
          .fill(0)
          .map((_, i) => {
            const page = i + 1;
            if (current === page)
              return (
                <li>
                  <span>{current}</span>
                </li>
              );
            return (
              <li>
                <a href={`${baseUrl}/${page}`}>{page}</a>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}

const styles = {
  list: css({
    margin: "2rem 0 0",
    padding: 0,
    display: "inline-flex",
    gap: "0.25rem",
    listStyleType: "none",
    "a, span": {
      display: "inline-flex",
      padding: "0.25rem",
    },
  }),
};
