import {
  Fragment,
  h,
  Helmet,
} from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";
export default function PageNotFound() {
  return (
    <Fragment>
      <Helmet>
        <title>Page Not Found - ValeriaVG</title>
      </Helmet>
      <h1>Page Not Found</h1>
      <p>This page doesn't exist.</p>
    </Fragment>
  );
}
