import type { PropsWithChildren } from "hono/jsx";
import "./global.ts";
import { css } from "@emotion/css";
import { html } from "hono/html";
import Head from "#core/Head.tsx";

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {html`<script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-0K48DBJ4GD"
          ></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "G-0K48DBJ4GD");
          </script>`}
      </Head>
      <header class={styles.header}>
        <a href="/" class={styles.logo}>
          <img src="/logo.svg" alt="Female behind a laptop with a heart" />
          <span>ValeriaVG</span>
        </a>
        <navbar class={styles.navbar}>
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
      {children}
      <footer class={styles.footer}>
        ©Valeria Viana Gusmao {new Date().getFullYear()}
      </footer>
    </>
  );
}

const styles = {
  header: css({
    display: "flex",
    margin: "0 auto",
    padding: "0.5rem 1rem",
    maxWidth: "40rem",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    boxSizing: "border-box",
  }),
  footer: css({
    display: "flex",
    margin: "1rem auto 0",
    padding: "0.5rem 1rem",
    maxWidth: "40rem",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    fontSize: "0.8rem",
    opacity: 0.75,
    boxSizing: "border-box",
  }),
  logo: css({
    display: "flex",
    alignItems: "center",
    fontWeight: "bolder",
    lineHeight: "2rem",
    textDecoration: "none",
    opacity: 1,
    img: {
      height: "2rem",
      marginRight: "0.5rem",
    },
  }),
  navbar: css({
    ul: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      "li + li": {
        marginLeft: "0.5rem",
      },
    },
  }),
};
