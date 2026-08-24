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
      <template v-for="t in frontmatter.tags" :key="t">
        <a v-if="!isEn" class="tag" :href="'/tags/' + t">{{ t }}</a>
        <span v-else class="tag">{{ t }}</span>
      </template>
    </div>
  </div>
</template>
