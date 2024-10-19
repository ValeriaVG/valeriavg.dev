import { injectGlobal } from "@emotion/css";
injectGlobal`
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
  font-family: sans-serif;
  line-height: 1.2;
}
body {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
img {
  max-width: 100%;
}

main {
  margin: 0 auto;
  padding: 0.5rem 1rem;
  max-width: 40rem;
  width: 100%;
  box-sizing: border-box;
  min-height: 80vh;
}

main > p > img {
  margin: 0 auto;
  display: block;
}

a {
  color: inherit;
  opacity: 0.75;
}
a:hover {
  opacity: 1;
}
blockquote {
  border-left: 0.25rem solid gainsboro;
  padding-left: 1rem;
  margin-left: 0;
}
.highlight pre {
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
  background: #2d2d2d;
  color: white;
}
`;
