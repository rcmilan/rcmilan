import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

export default {
  paths() {
    const dir = join(process.cwd(), 'posts', 'en')
    const tags = new Set<string>()
    let files: string[] = []
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.md'))
    } catch {
      files = []
    }
    for (const file of files) {
      const { data } = matter(readFileSync(join(dir, file), 'utf-8'))
      for (const tag of data.tags ?? []) tags.add(tag)
    }
    return [...tags].map((tag) => ({ params: { tag } }))
  }
}
