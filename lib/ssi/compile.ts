import * as esbuild from "esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

export default async function compileSSI(
  filenames: string[]
): Promise<string[] | undefined> {
  await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./features/example.ssi.ts", ...filenames],
    bundle: true,
    write: true,
    outdir: "./static",
    minify: true,
    format: "esm",
    tsconfig: "./ssi-tsconfig.json",
    sourcemap: "external",
  });

  return filenames.map((name) => name.slice(1).replace(/\.tsx$/, ".js"));
}
