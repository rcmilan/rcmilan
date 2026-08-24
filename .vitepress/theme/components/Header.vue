<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../posts.data'
import Search from './Search.vue'

const { page, localeIndex, frontmatter, isDark } = useData()
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

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>

<template>
  <header class="site-header">
    <a class="brand" :href="isEn ? '/en/' : '/'">rm</a>

    <nav>
      <a :href="isEn ? '/en/tags' : '/tags'">{{ isEn ? 'TAGS' : 'TAGS' }}</a>
      <a :href="isEn ? '/en/about' : '/sobre'">{{ isEn ? 'ABOUT' : 'SOBRE' }}</a>
    </nav>

    <Search />

    <a :href="otherLocaleUrl">{{ isEn ? 'PT' : 'EN' }}</a>

    <button
      type="button"
      @click="toggleTheme"
      :aria-label="isEn ? 'toggle theme' : 'alternar tema'"
    >{{ isDark ? '☀' : '☾' }}</button>
  </header>
</template>
