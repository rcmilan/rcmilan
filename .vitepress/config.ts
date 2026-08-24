import { defineConfig } from 'vitepress'

export default defineConfig({
  srcDir: '.',
  srcExclude: ['README.md', 'CLAUDE.md', '**/node_modules/**'],
  base: '/rcmilan/',

  title: 'rm',
  cleanUrls: true,
  appearance: true,
  lastUpdated: true,

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' }
  },

  locales: {
    root: {
      label: 'Português',
      lang: 'pt-BR',
      title: 'rm',
      description: 'Notas e escritos.'
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'rm',
      description: 'Notes and writing.'
    }
  }
})
