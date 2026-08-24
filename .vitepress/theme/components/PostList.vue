<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../posts.data'

const filtered = computed(() => posts.filter((p) => p.locale === 'pt'))
</script>

<template>
  <ul v-if="filtered.length" class="post-list">
    <li v-for="post in filtered" :key="post.url">
      <span class="date">{{ post.date }}</span>
      <a class="title" :href="post.url">{{ post.title }}</a>
      <span class="tags">
        <a v-for="t in post.tags" :key="t" class="tag" :href="`/tags/${t}`">{{ t }}</a>
      </span>
    </li>
  </ul>
  <p v-else class="search-empty">ainda não há posts.</p>
</template>
