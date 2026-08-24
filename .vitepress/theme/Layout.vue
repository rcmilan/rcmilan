<script setup lang="ts">
import { computed } from 'vue'
import { useData, Content, withBase } from 'vitepress'
import Header from './components/Header.vue'
import PostArticle from './components/PostArticle.vue'

const { page, frontmatter } = useData()

const isPost = computed(() => /(^|\/)posts\//.test(page.value.relativePath))
const isHome = computed(() => page.value.relativePath === 'index.md')
</script>

<template>
  <div class="wrap">
    <Header />

    <main>
      <div v-if="page.isNotFound">
        <h1>404</h1>
        <p><a :href="withBase('/')">voltar ao início</a></p>
      </div>

      <PostArticle v-else-if="isPost" />

      <div v-else class="post-content">
        <h1 v-if="frontmatter.title && !isHome">{{ frontmatter.title }}</h1>
        <Content />
      </div>
    </main>

    <footer class="site-footer">
      <a href="https://github.com/rcmilan">github.com/rcmilan</a>
    </footer>
  </div>
</template>
