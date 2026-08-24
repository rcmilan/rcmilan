<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import Search from './Search.vue'

const { page, localeIndex, frontmatter, isDark } = useData()
const isEn = computed(() => localeIndex.value === 'en')
const isPost = computed(() => /(^|\/)posts\//.test(page.value.relativePath))

// Only posts are bilingual. Home, tags and about exist in Portuguese only,
// so the switcher only ever appears on a post that actually has a pair.
const pair = computed(() => {
  if (!isPost.value) return null
  const key = frontmatter.value.translationKey
  if (!key) return null
  const target = isEn.value ? 'pt' : 'en'
  return posts.find((p) => p.translationKey === key && p.locale === target) ?? null
})

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>

<template>
  <header class="site-header">
    <a class="brand" :href="withBase('/')">rm</a>

    <nav>
      <a :href="withBase('/tags')">TAGS</a>
      <a :href="withBase('/sobre')">SOBRE</a>
    </nav>

    <Search />

    <a v-if="pair" :href="withBase(pair.url)">{{ isEn ? 'PT' : 'EN' }}</a>

    <button
      type="button"
      @click="toggleTheme"
      :aria-label="isEn ? 'toggle theme' : 'alternar tema'"
    >{{ isDark ? '☀' : '☾' }}</button>
  </header>
</template>
