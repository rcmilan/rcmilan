<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'

const tags = computed(() => {
  const set = new Set<string>()
  for (const p of posts) {
    if (p.locale !== 'pt') continue
    for (const t of p.tags) set.add(t)
  }
  return [...set].sort()
})
</script>

<template>
  <p v-if="tags.length">
    <a v-for="t in tags" :key="t" class="tag" :href="withBase(`/tags/${t}`)">{{ t }}</a>
  </p>
  <p v-else class="search-empty">ainda não há tags.</p>
</template>
