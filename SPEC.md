# `rm` — bilingual brutalist blog

Specification for turning `rcmilan/rcmilan` into a static personal blog served from
GitHub Pages. Settled through a design interview; every decision below was chosen
against at least one named alternative, recorded in [Decision log](#decision-log).

Status: **agreed, not yet implemented.**

---

## 1. Stack

| | |
|---|---|
| Generator | [VitePress](https://vitepress.dev) (Vue 3, static site generation) |
| Theme | Written from scratch — no `DefaultTheme` import, no inherited markup or CSS |
| Runtime | Node 22 / npm 10 |
| `srcDir` | repository root |
| Backend | none — fully static |
| Host | GitHub Pages, user site, base path `/` |

Every post pre-renders to real static HTML, so the site is crawlable and paints
without waiting on JavaScript.

## 2. Repository layout

```
rcmilan/
├─ README.md                     ← GitHub profile page ONLY; srcExclude'd
├─ SPEC.md                       ← this file; srcExclude'd
├─ package.json
├─ index.md                      ← PT home = full archive
├─ sobre.md
├─ 404.md
├─ posts/
│  └─ <slug>.md                  → /posts/<slug>
├─ tags/
│  ├─ index.md                   → /tags
│  └─ [tag].md + [tag].paths.ts  → /tags/<tag>
├─ en/
│  ├─ index.md                   → /en/
│  ├─ about.md
│  ├─ 404.md
│  ├─ posts/<slug>.md            → /en/posts/<slug>
│  └─ tags/…
├─ .vitepress/
│  ├─ config.ts                  ← locales, appearance, lastUpdated, srcExclude, buildEnd
│  ├─ buildSearchIndex.ts
│  └─ theme/
│     ├─ index.ts
│     ├─ Layout.vue
│     ├─ style.css               ← design tokens
│     └─ components/
│        ├─ Header.vue           ← rm · TAGS · SOBRE · lang · theme · search
│        ├─ Search.vue           ← minisearch, locale-scoped
│        ├─ PostList.vue         ← one dense line per post
│        ├─ PostMeta.vue         ← publicado · revisado · tags · also in english
│        ├─ Tts.vue              ← speak / stop
│        └─ ThemeToggle.vue
└─ .github/workflows/deploy.yml
```

> **`srcExclude` matters.** With `srcDir` at the repository root, VitePress would
> otherwise turn `README.md` and `SPEC.md` into routes. Both must be listed in
> `srcExclude`.

## 3. Content model

Metadata lives in **YAML frontmatter only**. There are no sidecar files.

```yaml
---
title: Notas sobre brutalismo
date: 2026-08-24
tags: [design, web]
summary: Uma linha que aparece no índice e no resultado de busca.
translationKey: brutalism        # optional; pairs this post with its translation
---
```

- Files are flat inside `posts/`, named by slug. The date lives in frontmatter,
  never in the path, so a wrong date can be corrected without breaking a permalink.
- `/posts/<slug>` — no date segment, no year folders.
- Revision history is **derived from git**, never hand-written.

## 4. Internationalisation

Portuguese is the root locale; English is prefixed.

```
/                 → PT home            /en/                → EN home
/posts/<slug>     → PT post            /en/posts/<slug>    → EN post
/tags/<tag>       → PT tags            /en/tags/<tag>      → EN tags
/sobre            → PT about           /en/about           → EN about
```

```ts
locales: {
  root: { label: 'Português', lang: 'pt-BR' },
  en:   { label: 'English',   lang: 'en', link: '/en/' },
}
```

**Translation parity is optional.** Write in either language with no obligation to
translate. Giving two posts the same `translationKey` pairs them:

- the post header renders a muted `também em inglês ↗` / `also in portuguese ↗` link;
- the header language switcher jumps straight to the counterpart.

When no counterpart exists the switcher **falls back to that locale's home page** —
it must never produce a 404.

VitePress does not redirect the bare root, and GitHub Pages cannot do server-side
redirects, which is why one language has to own `/` outright.

## 5. Pages

- **Home is the complete archive.** Every post, newest first, one dense line each:
  `date · title · tags`. No pagination, no "read more", no landing-page hero, no
  separate archive route.
- `/tags` — every tag in use.
- `/tags/<tag>` — posts carrying that tag, within the current locale.
- `/sobre` ÷ `/en/about`.
- `404` per locale.

## 6. Design — "paper brutalism"

Brutalist *structure*, soft *surface*: raw and unornamented, but warm rather than
punishing. Resolves the tension between "internet brutalism" and "easy on the eyes".

**Rules**

- Monospace system stack throughout —
  `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`.
  No webfont request, so text paints immediately.
- `border-radius: 0` everywhere.
- No shadows, no gradients, no transitions, no animation.
- Hard 1px rules and visible boxes.
- Single column. No sidebars.

**Tokens**

| token | dark | light |
|---|---|---|
| `--bg` | `#14130F` | `#F2EDE3` |
| `--surface` | `#1C1A16` | `#E9E2D4` |
| `--text` | `#E6E1D4` | `#23211C` |
| `--muted` | `#9A9384` | `#6E685C` |
| `--border` | `#2E2B24` | `#D6CFC0` |
| `--accent` | `#C9A227` | `#8A6F4E` |

Both pairings clear WCAG AA for body text and muted text alike.

**Appearance**

```ts
appearance: true   // follows the visitor's OS preference
```

VitePress core (not the default theme) injects the no-flash inline script, toggles
`.dark` on `<html>`, and persists the reader's choice under the
`vitepress-theme-appearance` localStorage key. The custom theme supplies the
`:root` / `.dark` token blocks and its own toggle button.

> ⚠️ This reverses the opening brief of "dark mode enabled by default". It was a
> deliberate reversal — the OS preference wins instead. Revisit by setting
> `appearance: 'dark'` if that turns out to be the wrong call.

**Code blocks** — Shiki, themed to the palette above rather than Shiki's defaults.

## 7. Post page

Deliberately sparse. **No** table of contents, **no** prev/next links, **no**
reading-time estimate.

### Dates

`lastUpdated` is derived from git at build time:

```
publicado 2026-08-24 · revisado 2026-09-12
```

The second date appears only when the file was actually modified after publication.
This is why the deploy workflow needs full history (`fetch-depth: 0`).

### Heading anchors

A `#` appears beside each heading on hover, giving a copyable deep link. Invisible
until hovered, so it costs nothing visually.

### Text to speech

Browser-native [`speechSynthesis`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) —
no backend, no API key, no audio files in git.

- A speaker icon appears next to a paragraph on hover (desktop pointers only).
- A global button reads the whole post.
- **Click to speak; click again or press `Esc` to stop.** That is the entire
  interaction — no pause, no highlighting, no auto-scroll, no progress indicator.

Three constraints the implementation must respect:

1. **Voice availability is not guaranteed.** Voices come from the OS; a pt-BR voice
   is absent on some Linux/Firefox setups. When no voice matches the page locale,
   the controls **hide entirely** rather than rendering a dead button. `getVoices()`
   populates asynchronously, so wait for `voiceschanged`.
2. **Chrome truncates utterances beyond roughly 15 seconds.** Feed the synthesiser
   paragraph-sized chunks rather than one long utterance.
3. **Hover does not exist on touch devices.** The global button is the mobile path;
   gate per-paragraph icons behind `@media (hover: hover)`.

## 8. Search

Locale-scoped, generated at build time, queried entirely in the browser.

- A `buildEnd` hook walks the content tree and emits `search-index.pt.json` and
  `search-index.en.json` (title, tags, summary, body text, slug).
- A custom brutalist search box loads only the index for the current locale and
  queries it with [minisearch](https://github.com/lucaong/minisearch).
- Results are always in the language the reader is already reading. Paired posts
  bridge the gap through their `também em inglês ↗` link.

VitePress's built-in local search is documented as a **default-theme** feature; its
`@localSearchIndex` virtual module is not public API. Owning the index avoids
building on an undocumented internal.

## 9. Deployment

`.github/workflows/deploy.yml`

```yaml
on:
  workflow_dispatch:        # manual only — no push trigger, no branch guard
```

You choose the branch in the *Run workflow* dropdown, so any branch can be
published — useful for previewing a draft on real Pages before merging. The
trade-off is accepted: nothing prevents publishing an unfinished branch.

Steps:

1. `actions/checkout@v4` with **`fetch-depth: 0`** — required for git-derived
   revision dates.
2. `npm ci`
3. `npm run docs:build`
4. `actions/upload-pages-artifact` → `actions/deploy-pages@v4`

Permissions: `pages: write`, `id-token: write`. No `gh-pages` branch; no build
output committed to git.

### Manual step required

**Settings → Pages → Source → "GitHub Actions."** This cannot be set through the
API, and the first dispatch fails without it.

## 10. Explicitly out of scope

- **RSS.** Dropped. The content loader already carries every field a feed needs, so
  it can be added later without disturbing anything else.
- **Sidecar JSON metadata files.** Dropped — see the decision log.
- **README as page content or footer.** `README.md` stays the GitHub profile page and
  nothing else. The site footer is hand-written and simply links to the profile.
- **Any backend.** Nothing at runtime beyond static files.

---

## Decision log

Each row records what was chosen, what it was chosen *over*, and why.

| # | Decision | Rejected alternative | Reason |
|---|---|---|---|
| 1 | VitePress + custom theme | Vite + Vue SPA; Nuxt Content | SSG gives real HTML per post — crawlable, instant paint — without hand-rolling routing and indexes |
| 2 | Blog at repo root, README excluded | Blog in `docs/`; README as homepage | Keeps the profile page untouched while the homepage stays ordinary content |
| 3 | Frontmatter only | Paired `.json` sidecars | Two files per post can silently contradict each other; git already stores version history, so a `versions` array is manual work that rots |
| 4 | Flat `posts/`, slug filenames | Date-prefixed names; year folders | A date welded into the URL cannot be corrected later without breaking links |
| 5 | Home = full archive | Recent posts + separate archive | The index *is* the content; matches "extremely minimalist" |
| 6 | Paper brutalism (mono) | Serif body; hard `#000`/`#fff` brutalism | Brutalist structure with a warm palette resolves "brutalist" against "easy on the eyes"; pure black/white is the harshest possible reading pairing |
| 7 | `appearance: true` | `'dark'`; `'force-dark'` | Deliberate reversal of the opening brief — respect the OS setting, keep the toggle |
| 8 | Last-revised line only | Full commit list per post; no history | Commit messages would become public editorial prose (`wip`, `fix typo again`) |
| 9 | Hand-written footer | README slice via markers; whole README | The two surfaces have different jobs; the README's cards are hotlinked over plain `http://` and would be blocked as mixed content on an HTTPS site |
| 10 | `workflow_dispatch`, any branch | Locked to `trunk`; PR preview builds | Deliberate: enables previewing a draft branch on real Pages |
| 11 | Bilingual pt-BR + en | English only; Portuguese only | Chosen knowing every post must otherwise sit half-translated — mitigated by decision 13 |
| 12 | pt-BR at `/`, en at `/en/` | English at root; symmetric `/en/` + `/pt/` | Portuguese is the primary voice; a symmetric layout would need a redirect hack Pages cannot serve properly |
| 13 | Optional `translationKey` pairs | Fully independent trees; strict parity | Strict parity blocks publishing a quick thought until it is translated — that is how bilingual blogs die |
| 14 | Locale-scoped search indexes | One global index; scoped + "search all" toggle | Results stay in the language being read, and each index stays small |
| 15 | Anchors + minimal TTS | Prev/next; TOC; reading time; paragraph-aware player | Each addition spends some of the minimalism; the sparse set was chosen on purpose |
| 16 | No RSS | Per-locale feeds; one combined feed | Deferrable at no cost |

## Open items

Assumptions carried into implementation, all cheap to revise:

1. Shiki code highlighting themed to the palette in §6.
2. A minimal `404.md` per locale.
3. Seed content — one placeholder post and one about page per locale, written in
   that locale's language, to be rewritten.
4. Site tagline / meta description still to be written.
