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
    <section class="info">
      <span class="tags">
        {tags.map((tag, i) => (
          <>
            {i > 0 && ", "}
            <a class="tag" href={`/tags/${tag}`}>
              #{tag}
            </a>
          </>
        ))}
      </span>
      <span class="date">
        <time dateTime={date.toISOString()}>
          {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </time>
      </span>
    </section>
  );
}
