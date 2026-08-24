# Implementation tasks — `rm` blog

Step-by-step build instructions derived from [`SPEC.md`](./SPEC.md).

Work through the tasks **in order**. Each task lists the exact files to create, the
content to put in them, and a command that must succeed before you move on.

---

## Rules — read before starting

1. **Do not modify `README.md`.** It is the GitHub profile page. It is not part of
   the site. Never delete it, never rename it, never add site content to it.
2. **Do the tasks in order.** Later tasks import files created by earlier ones.
3. **Run the verification command at the end of every task.** If it fails, fix it
   before starting the next task. Do not batch tasks and verify once at the end.
4. **Use the exact package versions given in Task 1.** Do not upgrade to a major
   version that is newer than what is written here.
5. **When code is given in full, copy it exactly.** Do not "improve" it, do not
   rename variables, do not reformat it. When only a description is given, follow
   the description literally.
6. **Never add** a CSS `border-radius`, `box-shadow`, `transition`, `animation`, or
   `linear-gradient` anywhere in this project. The design forbids all five. See
   `SPEC.md` §6.
7. **Do not add any dependency** that is not listed in Task 1.
8. **Do not create a pull request.** A pull request already exists for this branch;
   pushing commits updates it.
9. If an instruction here contradicts `SPEC.md`, **this file wins** — the
   differences are deliberate and explained where they occur.

### Terminology

| Term | Meaning |
|---|---|
| repo root | the directory containing `README.md` and `SPEC.md` |
| PT | Portuguese locale, served at `/`, files at the repo root |
| EN | English locale, served at `/en/`, files under `en/` |
| post | a markdown file in `posts/` (PT) or `en/posts/` (EN) |

---

## Task overview

| # | Task | Creates |
|---|---|---|
| 1 | Project scaffolding | `package.json`, `.gitignore` |
| 2 | VitePress config | `.vitepress/config.ts` |
| 3 | Design tokens | `.vitepress/theme/style.css` |
| 4 | Theme entry + Layout | `.vitepress/theme/index.ts`, `Layout.vue` |
| 5 | Posts data loader | `.vitepress/theme/posts.data.ts` |
| 6 | Header | `components/Header.vue` |
| 7 | Home pages (archive) | `components/PostList.vue`, `index.md`, `en/index.md` |
| 8 | Post chrome | `components/PostMeta.vue`, `components/PostArticle.vue` |
| 9 | Tag pages | `tags/…`, `en/tags/…` |
| 10 | Search index script | `scripts/build-search-index.mjs` |
| 11 | Search UI | `components/Search.vue` |
| 12 | TTS + heading anchors | `components/Tts.vue`, decoration logic |
| 13 | Seed content | about, 404, one post per locale |
| 14 | Deploy workflow | `.github/workflows/deploy.yml` |
| 15 | Final verification | — |

---

## Task 1 — Project scaffolding

**Goal:** an installable npm project.

### 1.1 Create `package.json` at the repo root

```json
{
  "name": "rm-blog",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "search:index": "node scripts/build-search-index.mjs",
    "docs:dev": "npm run search:index && vitepress dev",
    "docs:build": "npm run search:index && vitepress build",
    "docs:preview": "vitepress preview"
  },
  "devDependencies": {
    "gray-matter": "^4.0.3",
    "vitepress": "^1.6.4",
    "vue": "^3.5.41"
  },
  "dependencies": {
    "minisearch": "^7.2.0"
  }
}
```

There is no `docs` argument on the `vitepress` commands. That is correct — the
source directory is the repo root.

### 1.2 Create `.gitignore` at the repo root

```
node_modules/
.vitepress/cache/
.vitepress/dist/
public/search-index.*.json
*.log
.DS_Store
```

The generated search indexes are ignored on purpose. They are rebuilt by
`npm run search:index`, which runs automatically before dev and before build.

### 1.3 Install

```bash
npm install
```

**Verify:** `npm ls vitepress` prints `vitepress@1.6.x` with no error.

---

## Task 2 — VitePress config

**Goal:** two locales, correct exclusions, git-derived dates.

Create `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  srcDir: '.',
  srcExclude: ['README.md', 'SPEC.md', 'TASKS.md', '**/node_modules/**'],

  title: 'rm',
  cleanUrls: true,
  appearance: true,
  lastUpdated: true,

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' }
  },

  locales: {
    root: {
      label: 'Português',
      lang: 'pt-BR',
      title: 'rm',
      description: 'Notas e escritos de Ricardo Milan.'
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'rm',
      description: 'Notes and writing by Ricardo Milan.'
    }
  }
})
```

### Why each setting matters — do not change these

- **`srcExclude`** — the source directory is the repo root, so without this line
  VitePress turns `README.md` into a page and it stops being just a profile page.
  This is the single most important line in the file.
- **`appearance: true`** — follows the reader's operating system setting. VitePress
  injects the anti-flicker script itself and toggles a `.dark` class on `<html>`.
  Do **not** write your own localStorage handling.
- **`lastUpdated: true`** — makes `page.lastUpdated` available, read from git. Task 8
  depends on it.
- **`cleanUrls: true`** — produces `/posts/slug` instead of `/posts/slug.html`.

**Verify:** `npx vitepress build` runs. It will warn that no pages were found, or
build zero pages. That is expected — there is no content yet. It must not *error*.

---

## Task 3 — Design tokens

**Goal:** the complete stylesheet for the site.

Create `.vitepress/theme/style.css`:

```css
:root {
  --bg:      #F2EDE3;
  --surface: #E9E2D4;
  --text:    #23211C;
  --muted:   #6E685C;
  --border:  #D6CFC0;
  --accent:  #8A6F4E;

  --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  --measure: 68ch;
  --space: 1rem;
}

.dark {
  --bg:      #14130F;
  --surface: #1C1A16;
  --text:    #E6E1D4;
  --muted:   #9A9384;
  --border:  #2E2B24;
  --accent:  #C9A227;
}

* { box-sizing: border-box; }

html { color-scheme: light dark; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1.6;
}

a { color: var(--accent); text-decoration: underline; }
a:hover { background: var(--accent); color: var(--bg); text-decoration: none; }

hr { border: 0; border-top: 1px solid var(--border); margin: 2rem 0; }

img { max-width: 100%; }

/* Every box in this project is square and flat. */
button, input, pre, code, blockquote, table, td, th {
  border-radius: 0;
  box-shadow: none;
}

button {
  font: inherit;
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0.15rem 0.5rem;
  cursor: pointer;
}
button:hover { background: var(--surface); }

input {
  font: inherit;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0.35rem 0.5rem;
  width: 100%;
}

pre {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: var(--space);
  overflow-x: auto;
}

code { font-family: var(--font-mono); }

blockquote {
  border-left: 2px solid var(--border);
  margin-left: 0;
  padding-left: var(--space);
  color: var(--muted);
}

table { border-collapse: collapse; width: 100%; }
td, th { border: 1px solid var(--border); padding: 0.3rem 0.5rem; text-align: left; }

/* ---- layout ---- */

.wrap {
  max-width: var(--measure);
  margin: 0 auto;
  padding: 0 var(--space) 4rem;
}

.site-header {
  display: flex;
  gap: var(--space);
  align-items: baseline;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
  padding: var(--space) 0;
  margin-bottom: 2rem;
}
.site-header .brand { font-weight: 700; text-decoration: none; color: var(--text); }
.site-header nav { display: flex; gap: 0.75rem; flex: 1; }
.site-header a { text-decoration: none; }

.site-footer {
  border-top: 1px solid var(--border);
  margin-top: 4rem;
  padding-top: var(--space);
  color: var(--muted);
  font-size: 13px;
}

/* ---- archive list ---- */

.post-list { list-style: none; padding: 0; margin: 0; }
.post-list li {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  flex-wrap: wrap;
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--border);
}
.post-list .date { color: var(--muted); white-space: nowrap; }
.post-list .title { flex: 1; }
.post-list .tags { color: var(--muted); font-size: 13px; }

.tag { color: var(--muted); text-decoration: none; }
.tag::before { content: "["; }
.tag::after { content: "]"; }

/* ---- post ---- */

.post-meta { color: var(--muted); font-size: 13px; margin-bottom: 2rem; }
.post-content { line-height: 1.7; }
.post-content h1, .post-content h2, .post-content h3 { line-height: 1.3; }
.post-content p { position: relative; }

.anchor {
  margin-left: 0.4rem;
  color: var(--muted);
  text-decoration: none;
  opacity: 0;
}
h2:hover .anchor, h3:hover .anchor, h4:hover .anchor { opacity: 1; }

/* ---- tts ---- */

.tts-btn {
  margin-left: 0.4rem;
  padding: 0 0.3rem;
  font-size: 12px;
  line-height: 1.4;
  border: 1px solid var(--border);
  opacity: 0;
  vertical-align: middle;
}
/* Per-paragraph buttons only exist where a real pointer can hover them. */
@media (hover: hover) {
  .post-content p:hover .tts-btn { opacity: 1; }
}
@media (hover: none) {
  .tts-btn { display: none; }
}
.tts-btn:focus-visible { opacity: 1; }

/* ---- search ---- */

.search-results { list-style: none; padding: 0; margin: 0.5rem 0 0; }
.search-results li { padding: 0.35rem 0; border-bottom: 1px solid var(--border); }
.search-empty { color: var(--muted); padding: 0.5rem 0; }
```

**Verify:** the file exists. Nothing to run yet.

---

## Task 4 — Theme entry and Layout

**Goal:** a working custom theme shell.

### 4.1 Create `.vitepress/theme/index.ts`

```ts
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './style.css'

export default { Layout } satisfies Theme
```

Do **not** import `DefaultTheme`. There is no default theme in this project.

### 4.2 Create `.vitepress/theme/Layout.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useData, Content } from 'vitepress'
import Header from './components/Header.vue'
import PostArticle from './components/PostArticle.vue'

const { page, frontmatter, localeIndex } = useData()

const isPost = computed(() => /(^|\/)posts\//.test(page.value.relativePath))
const isEn = computed(() => localeIndex.value === 'en')
</script>

<template>
  <div class="wrap">
    <Header />

    <main>
      <div v-if="page.isNotFound">
        <h1>404</h1>
        <p>
          <a :href="isEn ? '/en/' : '/'">
            {{ isEn ? 'back home' : 'voltar ao início' }}
          </a>
        </p>
      </div>

      <PostArticle v-else-if="isPost" />

      <div v-else class="post-content">
        <h1 v-if="frontmatter.title">{{ frontmatter.title }}</h1>
        <Content />
      </div>
    </main>

    <footer class="site-footer">
      <a href="https://github.com/rcmilan">github.com/rcmilan</a>
    </footer>
  </div>
</template>
```

`isPost` decides the post layout from the file path, so you never have to write
`layout:` in a post's frontmatter.

**Verify:** cannot build yet — `Header.vue` and `PostArticle.vue` do not exist. Move
straight to Task 5.

---

## Task 5 — Posts data loader

**Goal:** one list of every post in both locales, usable from any component.

Create `.vitepress/theme/posts.data.ts`:

```ts
import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  title: string
  date: string
  dateSort: number
  tags: string[]
  summary: string
  translationKey: string
  locale: 'pt' | 'en'
}

declare const data: Post[]
export { data }

export default createContentLoader('**/posts/*.md', {
  transform(raw): Post[] {
    return raw
      .map((page) => {
        const fm = page.frontmatter
        return {
          url: page.url,
          title: fm.title ?? page.url,
          date: String(fm.date ?? '').slice(0, 10),
          dateSort: fm.date ? new Date(fm.date).getTime() : 0,
          tags: Array.isArray(fm.tags) ? fm.tags : [],
          summary: fm.summary ?? '',
          translationKey: fm.translationKey ?? '',
          locale: page.url.startsWith('/en/') ? 'en' : 'pt'
        } as Post
      })
      .sort((a, b) => b.dateSort - a.dateSort)
  }
})
```

Key points:

- The glob `**/posts/*.md` is **relative to the source directory** (the repo root),
  so it matches both `posts/*.md` and `en/posts/*.md`.
- The locale is derived from the URL prefix. There is no second loader.
- The file **must** be named `*.data.ts` or VitePress will not treat it as a loader.
- Import it elsewhere as `import { data as posts } from '../posts.data'`.

**Verify:** nothing to run yet. Continue.

---

## Task 6 — Header

**Goal:** brand, navigation, language switcher, theme toggle, search.

Create `.vitepress/theme/components/Header.vue`.

It must render, in one row:

1. `rm` — a link to `/` in PT, `/en/` in EN, with class `brand`.
2. A `<nav>` containing two links:
   - PT: `TAGS` → `/tags`, `SOBRE` → `/sobre`
   - EN: `TAGS` → `/en/tags`, `ABOUT` → `/en/about`
3. A language switcher button (Task 6.1).
4. A theme toggle button (Task 6.2).
5. `<Search />` (created in Task 11 — import it now, the build will fail until
   Task 11 is done, which is expected).

Wrap the whole thing in `<header class="site-header">`.

### 6.1 Language switcher

```ts
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../posts.data'

const { page, localeIndex, frontmatter } = useData()
const isEn = computed(() => localeIndex.value === 'en')

const otherLocaleUrl = computed(() => {
  const targetLocale = isEn.value ? 'pt' : 'en'
  const key = frontmatter.value.translationKey

  if (key) {
    const pair = posts.find(
      (p) => p.translationKey === key && p.locale === targetLocale
    )
    if (pair) return pair.url
  }
  // No counterpart: fall back to that locale's home. Never produce a 404.
  return targetLocale === 'en' ? '/en/' : '/'
})
```

Render it as a link labelled `EN` when currently PT, and `PT` when currently EN.

**The fallback is required.** A missing translation must send the reader to the
locale home page, not to a URL that does not exist.

### 6.2 Theme toggle

```ts
const { isDark } = useData()
function toggleTheme() {
  isDark.value = !isDark.value
}
```

`isDark` is a writable ref from VitePress core. Do **not** write to `localStorage`
and do **not** add or remove the `.dark` class yourself — VitePress does both.

Label the button `☾` when light and `☀` when dark, and give it
`aria-label="alternar tema"` (PT) / `aria-label="toggle theme"` (EN).

**Verify:** nothing to run yet. Continue.

---

## Task 7 — Home pages (the archive)

**Goal:** the homepage lists every post in that locale, one line each.

### 7.1 Create `.vitepress/theme/components/PostList.vue`

It takes one prop:

```ts
const props = defineProps<{ locale: 'pt' | 'en' }>()
```

It imports `{ data as posts } from '../posts.data'`, filters to
`p.locale === props.locale`, and renders:

```html
<ul class="post-list">
  <li v-for="post in filtered" :key="post.url">
    <span class="date">{{ post.date }}</span>
    <a class="title" :href="post.url">{{ post.title }}</a>
    <span class="tags">
      <a v-for="t in post.tags" :key="t" class="tag" :href="tagUrl(t)">{{ t }}</a>
    </span>
  </li>
</ul>
```

`tagUrl(t)` returns `/tags/${t}` for PT and `/en/tags/${t}` for EN.

When the filtered list is empty, render `<p class="search-empty">` with
`ainda não há posts.` (PT) or `no posts yet.` (EN).

The posts arrive already sorted newest-first from the loader. **Do not sort again.**

### 7.2 Register the component globally

Change `.vitepress/theme/index.ts` so markdown files can use `<PostList>`:

```ts
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import PostList from './components/PostList.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
  }
} satisfies Theme
```

### 7.3 Create `index.md` at the repo root (PT home)

```markdown
---
title: rm
---

# rm

Notas, código e escritos.

<PostList locale="pt" />
```

### 7.4 Create `en/index.md` (EN home)

```markdown
---
title: rm
---

# rm

Notes, code and writing.

<PostList locale="en" />
```

**Verify:** still blocked on `PostArticle.vue` and `Search.vue`. Continue.

---

## Task 8 — Post chrome

**Goal:** the header line above a post, and the article wrapper.

### 8.1 Create `.vitepress/theme/components/PostMeta.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../posts.data'

const { page, frontmatter, localeIndex } = useData()
const isEn = computed(() => localeIndex.value === 'en')

const published = computed(() => String(frontmatter.value.date ?? '').slice(0, 10))

// page.lastUpdated is a millisecond timestamp taken from git.
// It is undefined when the file has never been committed.
const revised = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return ''
  const d = new Date(ts).toISOString().slice(0, 10)
  return d === published.value ? '' : d
})

const translation = computed(() => {
  const key = frontmatter.value.translationKey
  if (!key) return null
  const target = isEn.value ? 'pt' : 'en'
  return posts.find((p) => p.translationKey === key && p.locale === target) ?? null
})

const tagBase = computed(() => (isEn.value ? '/en/tags/' : '/tags/'))
</script>

<template>
  <div class="post-meta">
    <span>{{ isEn ? 'published' : 'publicado' }} {{ published }}</span>
    <span v-if="revised"> · {{ isEn ? 'revised' : 'revisado' }} {{ revised }}</span>
    <span v-if="translation">
      ·
      <a :href="translation.url">
        {{ isEn ? 'também em português ↗' : 'also in english ↗' }}
      </a>
    </span>
    <div v-if="frontmatter.tags?.length">
      <a
        v-for="t in frontmatter.tags"
        :key="t"
        class="tag"
        :href="tagBase + t"
      >{{ t }}</a>
    </div>
  </div>
</template>
```

The `revised` line appears **only** when the git timestamp differs from the
published date. Never print both dates when they are the same day.

### 8.2 Create `.vitepress/theme/components/PostArticle.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useData, Content } from 'vitepress'
import PostMeta from './PostMeta.vue'
import Tts from './Tts.vue'

const { frontmatter } = useData()
const contentEl = ref<HTMLElement | null>(null)
</script>

<template>
  <article>
    <h1>{{ frontmatter.title }}</h1>
    <PostMeta />
    <Tts :container="contentEl" />
    <div class="post-content" ref="contentEl">
      <Content />
    </div>
  </article>
</template>
```

**Verify:** still blocked on `Tts.vue` and `Search.vue`. Continue.

---

## Task 9 — Tag pages

**Goal:** `/tags`, `/tags/<tag>`, and the English equivalents.

VitePress builds one page per tag from a *dynamic route*: a `[tag].md` template
plus a `[tag].paths.ts` loader that lists which tags exist.

### 9.1 Create `tags/[tag].paths.ts` (PT)

```ts
import { createContentLoader } from 'vitepress'

export default {
  async paths() {
    const posts = await createContentLoader('posts/*.md').load()
    const tags = new Set<string>()
    for (const post of posts) {
      for (const tag of post.frontmatter.tags ?? []) tags.add(tag)
    }
    return [...tags].map((tag) => ({ params: { tag } }))
  }
}
```

### 9.2 Create `tags/[tag].md` (PT)

```markdown
---
title: tag
---

# [{{ $params.tag }}]

<TagList locale="pt" :tag="$params.tag" />
```

### 9.3 Create `en/tags/[tag].paths.ts` (EN)

Identical to 9.1, but the glob is `'en/posts/*.md'`.

### 9.4 Create `en/tags/[tag].md` (EN)

Identical to 9.2, but `locale="en"`.

### 9.5 Create `.vitepress/theme/components/TagList.vue`

Same markup as `PostList.vue`, with one extra prop `tag: string`, filtering on
`p.locale === locale && p.tags.includes(tag)`.

Register it globally in `.vitepress/theme/index.ts` alongside `PostList`.

### 9.6 Create the tag index pages

`tags/index.md` (PT) and `en/tags/index.md` (EN). Each lists every tag in use for
that locale as a link. Build the tag list from `posts.data` inside a small
`TagIndex.vue` component, registered globally the same way.

**Important:** a tag with no posts must not appear. Derive the list from the posts,
never from a hardcoded array.

**Verify:** still blocked on `Tts.vue` and `Search.vue`. Continue.

---

## Task 10 — Search index script

**Goal:** two JSON files the browser can fetch.

> **Deviation from `SPEC.md` §8 — deliberate.** The spec describes generating these
> in VitePress's `buildEnd` hook. Do not do that. `buildEnd` runs *after* `public/`
> has already been copied to the output directory, and it never runs during
> `vitepress dev`, so search would be broken while developing. A prebuild script
> produces exactly the same two files and works in both modes.

Create `scripts/build-search-index.mjs`:

```js
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
      date: data.date ? String(data.date).slice(0, 10) : ''
    })
  }

  const out = join(ROOT, 'public', `search-index.${locale.code}.json`)
  await writeFile(out, JSON.stringify(docs), 'utf-8')
  console.log(`[search] ${out} — ${docs.length} posts`)
}
```

Notes:

- It must write an **empty array** rather than crash when a posts directory is
  missing. The first build has no English posts yet.
- `id` is the post URL, which is what the search UI links to.
- `String(data.date)` is required — YAML parses an unquoted date into a `Date`
  object, which does not serialise the way you expect.

**Verify:**

```bash
npm run search:index
```

It must print two lines and create `public/search-index.pt.json` and
`public/search-index.en.json`.

---

## Task 11 — Search UI

Create `.vitepress/theme/components/Search.vue`:

```vue
<script setup lang="ts">
import { ref, shallowRef, computed, watch } from 'vue'
import { useData } from 'vitepress'
import MiniSearch from 'minisearch'

const { localeIndex } = useData()
const isEn = computed(() => localeIndex.value === 'en')

const query = ref('')
const results = shallowRef<any[]>([])
const engine = shallowRef<MiniSearch | null>(null)
let loading = false

const indexUrl = computed(() =>
  isEn.value ? '/search-index.en.json' : '/search-index.pt.json'
)

async function load() {
  if (engine.value || loading) return
  loading = true
  try {
    const res = await fetch(indexUrl.value)
    const docs = await res.json()
    const ms = new MiniSearch({
      fields: ['title', 'tags', 'summary', 'body'],
      storeFields: ['title', 'summary'],
      searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3, tags: 2 } }
    })
    ms.addAll(docs)
    engine.value = ms
  } catch {
    engine.value = null
  } finally {
    loading = false
  }
}

watch(query, (q) => {
  if (!engine.value || !q.trim()) {
    results.value = []
    return
  }
  results.value = engine.value.search(q).slice(0, 10)
})

// Switching locale invalidates the loaded index.
watch(indexUrl, () => {
  engine.value = null
  results.value = []
  query.value = ''
})
</script>

<template>
  <div>
    <input
      v-model="query"
      type="search"
      :placeholder="isEn ? 'search' : 'buscar'"
      :aria-label="isEn ? 'search posts' : 'buscar posts'"
      @focus="load"
    />
    <ul v-if="results.length" class="search-results">
      <li v-for="r in results" :key="r.id">
        <a :href="r.id">{{ r.title }}</a>
      </li>
    </ul>
    <p v-else-if="query.trim()" class="search-empty">
      {{ isEn ? 'nothing found' : 'nada encontrado' }}
    </p>
  </div>
</template>
```

The index loads on **first focus**, not on page load, so a reader who never searches
never downloads it.

**Verify:** `npx vitepress build` — should now fail only on the missing `Tts.vue`.

---

## Task 12 — TTS and heading anchors

**Goal:** click-to-speak, and `#` links on headings.

Create `.vitepress/theme/components/Tts.vue`:

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

const props = defineProps<{ container: HTMLElement | null }>()
const { lang, localeIndex } = useData()
const route = useRoute()

const isEn = computed(() => localeIndex.value === 'en')
const hasVoice = ref(false)
const speaking = ref(false)
let voice: SpeechSynthesisVoice | null = null

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const wanted = lang.value.toLowerCase().slice(0, 2)
  const voices = window.speechSynthesis.getVoices()
  voice = voices.find((v) => v.lang.toLowerCase().startsWith(wanted)) ?? null
  hasVoice.value = voice !== null
  if (hasVoice.value) decorate()
}

function stop() {
  window.speechSynthesis?.cancel()
  speaking.value = false
}

function speak(texts: string[]) {
  const synth = window.speechSynthesis
  synth.cancel()
  const chunks = texts.map((t) => t.trim()).filter(Boolean)
  if (!chunks.length) return
  chunks.forEach((text, i) => {
    const u = new SpeechSynthesisUtterance(text)
    u.voice = voice
    u.lang = lang.value
    if (i === chunks.length - 1) u.onend = () => (speaking.value = false)
    synth.speak(u)
  })
  speaking.value = true
}

function paragraphText(p: Element) {
  const clone = p.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.tts-btn').forEach((b) => b.remove())
  return clone.textContent ?? ''
}

function readAll() {
  const el = props.container
  if (!el) return
  if (speaking.value) return stop()
  speak([...el.querySelectorAll('p')].map(paragraphText))
}

// Adds heading anchors and per-paragraph speaker buttons to rendered markdown.
// Markdown is rendered as raw HTML, so this is done by hand after each render.
function decorate() {
  const el = props.container
  if (!el) return

  el.querySelectorAll('h2[id], h3[id], h4[id]').forEach((h) => {
    if (h.querySelector('.anchor')) return
    const a = document.createElement('a')
    a.className = 'anchor'
    a.href = '#' + h.id
    a.textContent = '#'
    a.setAttribute('aria-label', isEn.value ? 'link to section' : 'link para a seção')
    h.appendChild(a)
  })

  if (!hasVoice.value) return
  el.querySelectorAll('p').forEach((p) => {
    if (p.querySelector('.tts-btn')) return
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'tts-btn'
    b.textContent = '🔊'
    b.setAttribute('aria-label', isEn.value ? 'read paragraph' : 'ler parágrafo')
    p.appendChild(b)
  })
}

function onClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('.tts-btn')
  if (!btn) return
  e.preventDefault()
  if (speaking.value) return stop()
  const p = btn.closest('p')
  if (p) speak([paragraphText(p)])
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') stop()
}

onMounted(() => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  pickVoice()
  // getVoices() is empty until the browser has loaded them.
  window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
  props.container?.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  stop()
  window.speechSynthesis?.removeEventListener('voiceschanged', pickVoice)
  props.container?.removeEventListener('click', onClick)
  window.removeEventListener('keydown', onKey)
})

// Re-decorate after client-side navigation to another post.
watch(() => route.path, async () => {
  stop()
  await nextTick()
  decorate()
})
</script>

<template>
  <p v-if="hasVoice">
    <button type="button" @click="readAll">
      {{ speaking ? (isEn ? '■ stop' : '■ parar') : (isEn ? '▶ read post' : '▶ ler post') }}
    </button>
  </p>
</template>
```

### The three rules this code exists to satisfy

1. **No voice → no controls.** `hasVoice` gates both the global button (`v-if`) and
   the per-paragraph buttons. A browser with no Portuguese voice shows nothing at
   all rather than a button that does nothing. Never render the controls
   unconditionally.
2. **Chunk per paragraph.** Chrome silently truncates any utterance longer than
   roughly 15 seconds. `speak()` queues one utterance per paragraph, which stays
   under that limit. Never pass a whole post as a single utterance.
3. **Touch devices get the global button only.** The per-paragraph buttons are
   hidden by the `@media (hover: none)` rule already in `style.css`.

There is no pause, no highlighting, no auto-scroll, and no progress display. Do not
add them.

**Verify:**

```bash
npx vitepress build
```

The build must now succeed.

---

## Task 13 — Seed content

Create these six files. The prose is placeholder text for the author to rewrite —
keep it short.

| File | Notes |
|---|---|
| `sobre.md` | PT about page, `title: sobre` |
| `en/about.md` | EN about page, `title: about` |
| `404.md` | PT, frontmatter `title: 404` |
| `en/404.md` | EN, frontmatter `title: 404` |
| `posts/ola-mundo.md` | PT seed post |
| `en/posts/hello-world.md` | EN seed post |

The two seed posts must be a **translation pair**, to prove the pairing works:

`posts/ola-mundo.md`

```markdown
---
title: Olá mundo
date: 2026-08-24
tags: [meta]
summary: O primeiro post deste blog.
translationKey: hello-world
---

Este é o primeiro post. Escreva o conteúdo real aqui.

## Um subtítulo

Mais um parágrafo, para testar a leitura em voz alta e as âncoras de título.
```

`en/posts/hello-world.md`

```markdown
---
title: Hello world
date: 2026-08-24
tags: [meta]
summary: The first post on this blog.
translationKey: hello-world
---

This is the first post. Replace this with real writing.

## A subheading

Another paragraph, to exercise text-to-speech and the heading anchors.
```

Both use `translationKey: hello-world`. **The values must match exactly** or the
pairing will not be found.

Also create `public/.nojekyll` as an empty file. It stops GitHub Pages from
attempting any Jekyll processing on the output.

**Verify:**

```bash
npm run docs:build && npx vitepress preview
```

Open the preview and confirm all of the following:

- [ ] `/` lists **one** post (Olá mundo), not two
- [ ] `/en/` lists **one** post (Hello world)
- [ ] `/posts/ola-mundo` shows `publicado 2026-08-24` and an `also in english ↗` link
- [ ] Clicking that link lands on `/en/posts/hello-world`
- [ ] The `EN` switcher in the header goes to the paired post, not the home page
- [ ] From `/sobre` (which has no pair) the `EN` switcher goes to `/en/`, not a 404
- [ ] `/tags/meta` lists the PT post
- [ ] Typing `olá` in the search box returns the PT post
- [ ] Hovering a heading reveals a `#` link
- [ ] The theme toggle switches palettes and survives a page reload

---

## Task 14 — Deploy workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run docs:build

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Two things that must not be changed:

- **`fetch-depth: 0`** — the default shallow clone has no history, so every post's
  git timestamp collapses to the same value and the `revised` date breaks.
- **`on: workflow_dispatch:` only** — no `push:` trigger and no branch condition.
  Deployment is manual and any branch may be published. This is intentional.

**Verify:** `.github/workflows/deploy.yml` parses as valid YAML.

---

## Task 15 — Final verification

Run the full build from a clean state:

```bash
rm -rf node_modules .vitepress/cache .vitepress/dist
npm install
npm run docs:build
```

Then confirm every item:

- [ ] The build completes with no errors and no dead-link warnings.
- [ ] `README.md` is unchanged — `git diff README.md` prints nothing.
- [ ] `.vitepress/dist/` contains **no** `README.html`, `SPEC.html`, or `TASKS.html`.
- [ ] `.vitepress/dist/index.html` exists (PT home).
- [ ] `.vitepress/dist/en/index.html` exists (EN home).
- [ ] `.vitepress/dist/search-index.pt.json` and `search-index.en.json` exist.
- [ ] `grep -rE "border-radius: *[^0]|box-shadow: *[^n]|transition:|animation:|linear-gradient" .vitepress/theme/` returns **nothing** except the `border-radius: 0` and `box-shadow: none` reset rules.
- [ ] No file imports `vitepress/theme` (the default theme).
- [ ] `git status` shows no generated files staged — `public/search-index.*.json`
      must be ignored.

Then commit and push to the current branch. **Do not open a pull request** — one
already exists and your push updates it.

---

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| `README.html` appears in the output | `srcExclude` missing or misspelled | Task 2 |
| Every post shows the same `revised` date | shallow git clone | `fetch-depth: 0`, Task 14 |
| `revised` never appears locally | the file has no commit yet | commit the post, then rebuild |
| Search box does nothing | index not generated | run `npm run search:index` |
| Search 404s in dev | you used `buildEnd` instead of the script | Task 10 |
| TTS button present but silent | no voice for the locale | `hasVoice` gate is missing — Task 12 |
| TTS cuts off mid-post | one long utterance | chunk per paragraph — Task 12 |
| Language switcher 404s | no fallback for unpaired pages | Task 6.1 |
| Anchors vanish after clicking a link | decoration not re-run on navigation | the `watch(() => route.path)` in Task 12 |
| `document is not defined` at build | DOM access outside `onMounted` | move it into `onMounted` |
| Tag page builds but is empty | glob wrong in the paths loader | globs are relative to the repo root |

### Server-side rendering

VitePress renders every page in Node at build time, where `window` and `document` do
not exist. Any code touching them **must** be inside `onMounted`, or guarded with
`typeof window === 'undefined'`. This is the most common way to break the build.

### After the first deploy

`cleanUrls: true` relies on GitHub Pages resolving `/posts/slug` to `slug.html`.
It does. If a deployed page unexpectedly 404s while working in local preview, set
`cleanUrls: false` in `.vitepress/config.ts` and redeploy — that is the only
fallback needed, and nothing else has to change.
