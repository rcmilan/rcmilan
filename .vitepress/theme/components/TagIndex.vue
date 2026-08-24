<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../posts.data'

const props = defineProps<{ locale: 'pt' | 'en' }>()

const tags = computed(() => {
  const set = new Set<string>()
  for (const p of posts) {
    if (p.locale !== props.locale) continue
    for (const t of p.tags) set.add(t)
  }
  return [...set].sort()
})

function tagUrl(t: string) {
  return props.locale === 'en' ? `/en/tags/${t}` : `/tags/${t}`
}
</script>

<template>
  <p v-if="tags.length">
    <a v-for="t in tags" :key="t" class="tag" :href="tagUrl(t)">{{ t }}</a>
  </p>
  <p v-else class="search-empty">
    {{ locale === 'en' ? 'no tags yet.' : 'ainda não há tags.' }}
  </p>
</template>
