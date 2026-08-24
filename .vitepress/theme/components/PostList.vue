<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../posts.data'

const props = defineProps<{ locale: 'pt' | 'en' }>()

const filtered = computed(() => posts.filter((p) => p.locale === props.locale))

function tagUrl(t: string) {
  return props.locale === 'en' ? `/en/tags/${t}` : `/tags/${t}`
}
</script>

<template>
  <ul v-if="filtered.length" class="post-list">
    <li v-for="post in filtered" :key="post.url">
      <span class="date">{{ post.date }}</span>
      <a class="title" :href="post.url">{{ post.title }}</a>
      <span class="tags">
        <a v-for="t in post.tags" :key="t" class="tag" :href="tagUrl(t)">{{ t }}</a>
      </span>
    </li>
  </ul>
  <p v-else class="search-empty">
    {{ locale === 'en' ? 'no posts yet.' : 'ainda não há posts.' }}
  </p>
</template>
