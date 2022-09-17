import { Fragment } from "https://deno.land/x/nano_jsx@v0.0.33/fragment.ts";
import { h } from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";

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

export default function Info({ tags, date }: { tags: string[]; date: Date }) {
  return (
    <section class="info">
      <span class="tags">
        {tags.map((tag, i) => (
          <Fragment>
            {i > 0 && ", "}
            <a class="tag" href={`/tags/${tag}`}>
              #{tag}
            </a>
          </Fragment>
        ))}
      </span>
      <span class="date">
        <time datetime={date.toISOString()}>
          {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </time>
      </span>
    </section>
  );
}
