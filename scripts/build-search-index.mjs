import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, basename } from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()

const LOCALES = [
  { code: 'pt', dir: 'posts',    urlBase: '/posts/' },
  { code: 'en', dir: 'en/posts', urlBase: '/en/posts/' }
]

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

await mkdir(join(ROOT, 'public'), { recursive: true })

for (const locale of LOCALES) {
  let files = []
  try {
    files = (await readdir(join(ROOT, locale.dir))).filter((f) => f.endsWith('.md'))
  } catch {
    console.warn(`[search] no ${locale.dir}/ directory, writing empty index`)
  }

  const docs = []
  for (const file of files) {
    const raw = await readFile(join(ROOT, locale.dir, file), 'utf-8')
    const { data, content } = matter(raw)
    if (data.draft) continue
    const slug = basename(file, '.md')
    docs.push({
      id: locale.urlBase + slug,
      title: data.title ?? slug,
      tags: Array.isArray(data.tags) ? data.tags.join(' ') : '',
      summary: data.summary ?? '',
      body: stripMarkdown(content).slice(0, 20000),
      date: data.date
        ? (data.date instanceof Date
            ? data.date.toISOString()
            : String(data.date)
          ).slice(0, 10)
        : ''
    })
  }

  const out = join(ROOT, 'public', `search-index.${locale.code}.json`)
  await writeFile(out, JSON.stringify(docs), 'utf-8')
  console.log(`[search] ${out} — ${docs.length} posts`)
}
