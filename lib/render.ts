import { renderMarkdown } from "https://deno.land/x/markdown_renderer@0.1.3/mod.ts";

export const renderFile = async (filePath: string) => {
    const text = await Deno.readTextFile(filePath);
    return renderMarkdown(text)
}