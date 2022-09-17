import { h } from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";

export default function Gist(id: string) {
  return <script src={`${id}.js`}></script>;
}
