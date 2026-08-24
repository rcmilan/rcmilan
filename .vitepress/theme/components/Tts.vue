<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

const props = defineProps<{ container: HTMLElement | null }>()
const { lang, localeIndex } = useData()
const route = useRoute()

const isEn = computed(() => localeIndex.value === 'en')
const hasVoice = ref(false)
const speaking = ref(false)
let voice: SpeechSynthesisVoice | null = null

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const wanted = lang.value.toLowerCase().slice(0, 2)
  const voices = window.speechSynthesis.getVoices()
  voice = voices.find((v) => v.lang.toLowerCase().startsWith(wanted)) ?? null
  hasVoice.value = voice !== null
  if (hasVoice.value) decorate()
}

function stop() {
  window.speechSynthesis?.cancel()
  speaking.value = false
}

function speak(texts: string[]) {
  const synth = window.speechSynthesis
  synth.cancel()
  const chunks = texts.map((t) => t.trim()).filter(Boolean)
  if (!chunks.length) return
  chunks.forEach((text, i) => {
    const u = new SpeechSynthesisUtterance(text)
    u.voice = voice
    u.lang = lang.value
    if (i === chunks.length - 1) u.onend = () => (speaking.value = false)
    synth.speak(u)
  })
  speaking.value = true
}

function paragraphText(p: Element) {
  const clone = p.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.tts-btn').forEach((b) => b.remove())
  return clone.textContent ?? ''
}

function readAll() {
  const el = props.container
  if (!el) return
  if (speaking.value) return stop()
  speak([...el.querySelectorAll('p')].map(paragraphText))
}

// Adds heading anchors and per-paragraph speaker buttons to rendered markdown.
// Markdown is rendered as raw HTML, so this is done by hand after each render.
function decorate() {
  const el = props.container
  if (!el) return

  el.querySelectorAll('h2[id], h3[id], h4[id]').forEach((h) => {
    if (h.querySelector('.anchor')) return
    const a = document.createElement('a')
    a.className = 'anchor'
    a.href = '#' + h.id
    a.textContent = '#'
    a.setAttribute('aria-label', isEn.value ? 'link to section' : 'link para a seção')
    h.appendChild(a)
  })

  if (!hasVoice.value) return
  el.querySelectorAll('p').forEach((p) => {
    if (p.querySelector('.tts-btn')) return
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'tts-btn'
    b.textContent = '🔊'
    b.setAttribute('aria-label', isEn.value ? 'read paragraph' : 'ler parágrafo')
    p.appendChild(b)
  })
}

function onClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('.tts-btn')
  if (!btn) return
  e.preventDefault()
  if (speaking.value) return stop()
  const p = btn.closest('p')
  if (p) speak([paragraphText(p)])
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') stop()
}

onMounted(() => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  pickVoice()
  // getVoices() is empty until the browser has loaded them.
  window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
  props.container?.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  stop()
  window.speechSynthesis?.removeEventListener('voiceschanged', pickVoice)
  props.container?.removeEventListener('click', onClick)
  window.removeEventListener('keydown', onKey)
})

// Re-decorate after client-side navigation to another post.
watch(() => route.path, async () => {
  stop()
  await nextTick()
  decorate()
})
</script>

<template>
  <p v-if="hasVoice">
    <button type="button" @click="readAll">
      {{ speaking ? (isEn ? '■ stop' : '■ parar') : (isEn ? '▶ read post' : '▶ ler post') }}
    </button>
  </p>
</template>
