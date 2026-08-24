import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import PostList from './components/PostList.vue'
import TagList from './components/TagList.vue'
import TagIndex from './components/TagIndex.vue'

// Icons come from Font Awesome. Only the core + solid stylesheets are imported
// so the build ships one webfont (fa-solid-900.woff2) instead of also pulling
// the brands and regular faces, which nothing here uses.
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/css/solid.css'

import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('TagList', TagList)
    app.component('TagIndex', TagIndex)
  }
} satisfies Theme
