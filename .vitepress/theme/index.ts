import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import PostList from './components/PostList.vue'
import TagList from './components/TagList.vue'
import TagIndex from './components/TagIndex.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('TagList', TagList)
    app.component('TagIndex', TagIndex)
  }
} satisfies Theme
