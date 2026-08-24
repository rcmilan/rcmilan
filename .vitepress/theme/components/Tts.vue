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
let activeParagraph: Element | null = null

// The same API exposes everything from a 1980s formant synthesiser to a neural
// cloud voice, in arbitrary order, so the first lang match is often the worst
// one available. Score instead of taking whatever comes first.
const NATURAL = /google|natural|neural|premium|enhanced|wavenet|siri|multilingual/i
const ROBOTIC = /espeak|e-speak|festival|pico|compact|robo/i

function score(v: SpeechSynthesisVoice, wanted: string) {
  const vlang = v.lang.toLowerCase().replace('_', '-')
  let s = 0
  if (vlang === wanted) s += 8               // pt-BR beats a generic pt
  else if (vlang.startsWith(wanted.slice(0, 2))) s += 4
  if (!v.localService) s += 6                // cloud voices are the natural ones
  if (NATURAL.test(v.name)) s += 5
  if (ROBOTIC.test(v.name)) s -= 10
  if (v.default) s += 1
  return s
}

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const wanted = lang.value.toLowerCase().replace('_', '-')
  const prefix = wanted.slice(0, 2)
  const candidates = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(prefix))
  voice = candidates.length
    ? candidates.reduce((best, v) => (score(v, wanted) > score(best, wanted) ? v : best))
    : null
  hasVoice.value = voice !== null
  if (hasVoice.value) decorate()
}

function stop() {
  window.speechSynthesis?.cancel()
  speaking.value = false
  activeParagraph = null
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
    if (i === chunks.length - 1) u.onend = () => {
      speaking.value = false
      activeParagraph = null
    }
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
    b.innerHTML = '<i class="fa-solid fa-volume"></i>'
    b.setAttribute('aria-label', isEn.value ? 'read paragraph' : 'ler parágrafo')
    p.appendChild(b)
  })
}

function onClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('.tts-btn')
  if (!btn) return
  e.preventDefault()
  const p = btn.closest('p')
  if (!p) return
  // Clicking the paragraph being read stops it; any other one switches to it.
  const wasActive = speaking.value && activeParagraph === p
  stop()
  if (wasActive) return
  activeParagraph = p
  speak([paragraphText(p)])
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') stop()
}

// The container is a ref owned by the parent and is still null while this
// component mounts, so listeners and decoration wait for it to arrive rather
// than being wired up in onMounted.
let bound: HTMLElement | null = null
function bind(el: HTMLElement | null) {
  if (bound === el) return
  bound?.removeEventListener('click', onClick)
  bound = el
  bound?.addEventListener('click', onClick)
}

watch(
  () => props.container,
  (el) => {
    bind(el)
    decorate()
  },
  { immediate: true }
)

onMounted(() => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  pickVoice()
  // getVoices() is empty until the browser has loaded them.
  window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  stop()
  window.speechSynthesis?.removeEventListener('voiceschanged', pickVoice)
  bind(null)
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
      <i :class="speaking ? 'fa-solid fa-stop' : 'fa-solid fa-play'"></i>
      {{ speaking ? (isEn ? 'stop' : 'parar') : (isEn ? 'read post' : 'ler post') }}
    </button>
  </p>
</template>
