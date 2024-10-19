import { css } from "@emotion/css";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function Info({ tags, date }: { tags: string[]; date: Date }) {
  return (
    <section class={styles.info}>
      <span>
        {tags.map((tag, i) => (
          <>
            {i > 0 && ", "}
            <a href={`/tags/${tag}`}>
              #{tag}
            </a>
          </>
        ))}
      </span>
      <span class={styles.date}>
        <time dateTime={date.toISOString()}>
          {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </time>
      </span>
    </section>
  );
}

const styles = {
  info: css({
    display: "flex",
    flexDirection: "column-reverse",
    marginBottom: "2rem",
    "@media screen and (min-width: 800px)": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
    },
  }),
  date: css({
    fontSize: "0.8rem",
    opacity: 0.75,
    padding: "0.25rem 0",
  }),
};
