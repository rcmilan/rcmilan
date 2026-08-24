# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Two unrelated things share this repo:

- `README.md` at the root is Ricardo Milan's **GitHub profile page**. It is rendered by GitHub on the user's profile and is not part of the site build in any way. **Never edit it as part of a site change**, and never let it become a VitePress page — it's listed in `srcExclude` in `.vitepress/config.ts` for that reason.
- Everything else is **`rm`**, a static personal blog built with [VitePress](https://vitepress.dev), using a theme written from scratch (no `DefaultTheme` import anywhere — don't add one). `srcDir` is the repo root, not a `docs/` subfolder.

## Commands

Package manager is **pnpm**, pinned via `packageManager` in `package.json` — don't use npm/yarn.

```bash
pnpm install              # install deps
pnpm run docs:dev         # dev server (rebuilds the search index first)
pnpm run docs:build       # production build to .vitepress/dist (rebuilds the search index first)
pnpm run docs:preview     # serve the built .vitepress/dist locally
pnpm run search:index     # regenerate public/search-index.{pt,en}.json only
```

There is no lint or test suite configured. The closest thing to CI is `pnpm run docs:build` succeeding with no dead-link errors — run that after any change before considering it done.

Deploy is `.github/workflows/deploy.yml`, triggered manually (`workflow_dispatch` only, any branch) from the Actions tab — there is no deploy-on-push. It requires `fetch-depth: 0` because post revision dates are read from git history (see below); don't shrink that.

## Content model: markdown as the data source

Every post is one markdown file with YAML frontmatter — there are no sidecar metadata files, and revision history is never hand-written (it comes from `git log` via VitePress's `lastUpdated`, exposed as `page.lastUpdated`).

```yaml
---
title: Olá mundo
date: 2026-08-24
tags: [meta]
summary: One line shown in the archive and search results.
translationKey: hello-world   # optional — pairs this post with its translation
---
```

Treat `posts/**/*.md` as a table and frontmatter as its schema. **There are currently three independent readers of that table**, each re-parsing the same files their own way — know about all three before changing the schema (adding a field, changing how tags are stored, etc.), since a change to one won't propagate to the others:

- `.vitepress/theme/posts.data.ts` — VitePress content loader (`createContentLoader`), used at build/dev time and consumed by the Vue components (`Header.vue`, `PostList.vue`, `TagList.vue`, `TagIndex.vue`, `PostMeta.vue`) via `import { data as posts } from '../posts.data'`.
- `tags/[tag].paths.ts` — reads `posts/pt/*.md` directly with `gray-matter` to enumerate tags for dynamic tag routes. It does **not** use `createContentLoader`, because that throws when called from a `.paths.ts` file's `paths()` (VitePress resolves dynamic routes before `global.VITEPRESS_CONFIG` is set — a real limitation in vitepress@1.6.4, not a stylistic choice).
- `scripts/build-search-index.mjs` — a prebuild Node script, also using `gray-matter` directly, that writes `public/search-index.pt.json` / `public/search-index.en.json`.

If a future feature needs the same "all posts, parsed" data in a fourth place, prefer consolidating these three into one shared reader over adding a fourth independent parser.

## Locale model: Portuguese is the site, English is an extra on posts

- Portuguese is the only language for site chrome: home (`index.md`), `sobre.md`, `tags/`, `404.md` all live at the repo root with no English equivalent. There is no `en/` directory anymore and none of these pages should grow one.
- Posts are the one bilingual content type: `posts/pt/*.md` → `/posts/pt/<slug>`, `posts/en/*.md` → `/posts/en/<slug>`. An English version of a post is optional — never assume one exists. `translationKey` (matching values on both sides) is how a pair is declared; when it's absent or the counterpart doesn't exist, UI that would normally cross-link (the header's PT/EN switcher, `PostMeta`'s "also in english" line) simply doesn't render — it never links to a 404.
- VitePress determines a page's locale (`useData().localeIndex`, which drives `lang`, and which text/labels components render) by testing whether `/en/` appears anywhere in the file's path relative to `srcDir` (an unanchored regex, not a "must be a top-level directory" rule). That's why `posts/en/hello-world.md` is correctly detected as the `en` locale even though `en/` isn't a top-level directory — worth knowing before restructuring content paths again.
- Because English posts have no tag index to link to, their tags render as plain unlinked text in `PostMeta.vue`; Portuguese post tags link to `/tags/<tag>`.
- `.vitepress/config.ts` still declares an `en` locale entry even though nothing links to it directly — it's required so English posts get `lang="en"` (affects both the rendered `<html lang>` and which voice `Tts.vue` picks for text-to-speech).

## Design constraints ("paper brutalism")

Tokens and rules live in `.vitepress/theme/style.css`. The rules are load-bearing, not just current style — **never add** `border-radius` (other than the `0` reset), `box-shadow` (other than the `none` reset), `transition`, `animation`, or `linear-gradient` anywhere in this project. Monospace font stack only, no webfont requests.

## Search

`scripts/build-search-index.mjs` runs before both `docs:dev` and `docs:build` (wired through the npm/pnpm scripts, not a VitePress hook) and writes into `public/`, which VitePress then copies verbatim. This is deliberate: VitePress's `buildEnd` hook runs *after* `public/` is already copied to the output dir, and never runs at all during `vitepress dev` — a hook-based approach would leave search broken in dev. `Search.vue` fetches the locale-appropriate JSON lazily, on first input focus. The generated JSON files are gitignored and always rebuilt, never hand-edited.

## Text-to-speech

`Tts.vue` uses the browser's native `speechSynthesis` — no backend, no API key. Two things that are easy to regress: voice availability is per-OS and not guaranteed, so controls must stay hidden (not just disabled) when `hasVoice` is false rather than rendering a dead button; and Chrome truncates a single utterance beyond ~15s, so text is always spoken one paragraph-utterance at a time, never as one call for the whole post.
