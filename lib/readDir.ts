import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

export default async function readDir(dir: string): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    const loadDir = async (path = '') => {
        const entries = await Deno.readDir(join(dir, path))
        for await (const entry of entries) {
            const entryPath = join(path, entry.name)
            const filePath = join(dir, entryPath)
            if (entry.isDirectory) {
                // Read directory
                await loadDir(entryPath)
            } else {
                // Read file
                files[entryPath] = filePath
            }
        }
    }
    await loadDir()
    return files
}