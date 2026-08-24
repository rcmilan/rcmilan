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
