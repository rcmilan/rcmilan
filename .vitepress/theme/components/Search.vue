<script setup lang="ts">
import { ref, shallowRef, computed, watch } from 'vue'
import { useData } from 'vitepress'
import MiniSearch from 'minisearch'

const { localeIndex } = useData()
const isEn = computed(() => localeIndex.value === 'en')

const query = ref('')
const results = shallowRef<any[]>([])
const engine = shallowRef<MiniSearch | null>(null)
let loading = false

const indexUrl = computed(() =>
  isEn.value ? '/search-index.en.json' : '/search-index.pt.json'
)

async function load() {
  if (engine.value || loading) return
  loading = true
  try {
    const res = await fetch(indexUrl.value)
    const docs = await res.json()
    const ms = new MiniSearch({
      fields: ['title', 'tags', 'summary', 'body'],
      storeFields: ['title', 'summary'],
      searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 3, tags: 2 } }
    })
    ms.addAll(docs)
    engine.value = ms
  } catch {
    engine.value = null
  } finally {
    loading = false
  }
}

watch(query, (q) => {
  if (!engine.value || !q.trim()) {
    results.value = []
    return
  }
  results.value = engine.value.search(q).slice(0, 10)
})

// Switching locale invalidates the loaded index.
watch(indexUrl, () => {
  engine.value = null
  results.value = []
  query.value = ''
})
</script>

<template>
  <div>
    <input
      v-model="query"
      type="search"
      :placeholder="isEn ? 'search' : 'buscar'"
      :aria-label="isEn ? 'search posts' : 'buscar posts'"
      @focus="load"
    />
    <ul v-if="results.length" class="search-results">
      <li v-for="r in results" :key="r.id">
        <a :href="r.id">{{ r.title }}</a>
      </li>
    </ul>
    <p v-else-if="query.trim()" class="search-empty">
      {{ isEn ? 'nothing found' : 'nada encontrado' }}
    </p>
  </div>
</template>
