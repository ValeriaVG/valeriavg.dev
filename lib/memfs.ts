import { join } from "https://deno.land/std@0.156.0/path/mod.ts";

export default async function loadFS(dir: string): Promise<Record<string, Uint8Array>> {
    const files: Record<string, Uint8Array> = {}
    const loadDir = async (path: string) => {
        const entries = await Deno.readDir(join(dir, path))
        for await (const entry of entries) {
            const entryPath = join(path, entry.name)
            const filePath = join(dir, entryPath)
            if (entry.isDirectory) {
                // Read directory
                await loadDir(entryPath)
            } else {
                // Read file
                files[entryPath] = await Deno.readFile(filePath)
            }
        }
    }
    await loadDir('/')
    return files
}