import { Head } from "$fresh/runtime.ts";
import { ComponentChildren } from "preact";
export function Layout({
  children,
}: {
  children: ComponentChildren;
}) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <header>
        <a href="/" class="logo">
          <img src="/logo.svg" alt="Female behind a laptop with a heart" />
          <span>ValeriaVG</span>
        </a>
        <navbar>
          <ul>
            <li>
              <a
                href="https://github.com/ValeriaVG"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/valeria-viana-gusmao-80b210b6/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </navbar>
      </header>
      <main>{children}</main>
      <footer>©Valeria Viana Gusmao {new Date().getFullYear()}</footer>
    </>
  );
}
