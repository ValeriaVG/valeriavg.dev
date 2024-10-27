import { articlesByPubDate } from "#content";
import { html } from "hono/html";
export const generateFeed = () =>
  `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
	<title>ValeriaVG Blog</title>
	<subtitle>Blog about frontend, backend and everything in between.</subtitle>
	<link href="https://valeriavg.dev/feed" rel="self" />
	<link href="https://valeriavg.dev/" />
	<id>urn:uuid:0623df77-4f14-442d-a72b-e7fd2f4ac96a</id>
	<updated>${new Date().toISOString()}</updated>
	${articlesByPubDate
    .map(
      (article) => `<entry>
		<title>${html`${article.title}`}</title>
		<link href="https://valeriavg.dev/${article.url}" />
		<id>urn:uuid:${article.id}</id>
        <published>${article.date}</published>
		<updated>${article.updatedAt}</updated>
		<summary>${html`${article.summary}`}</summary>
		<author>
			<name>Valeria Viana Gusmao</name>
			<email>mail@valeriavg.dev</email>
		</author>
	</entry>`
    )
    .join("\n")}
</feed>
`;
