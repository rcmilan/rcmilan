import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  title: string
  date: string
  dateSort: number
  tags: string[]
  summary: string
  translationKey: string
  locale: 'pt' | 'en'
}

declare const data: Post[]
export { data }

export default createContentLoader('**/posts/*.md', {
  transform(raw): Post[] {
    return raw
      .map((page) => {
        const fm = page.frontmatter
        return {
          url: page.url,
          title: fm.title ?? page.url,
          date: String(fm.date ?? '').slice(0, 10),
          dateSort: fm.date ? new Date(fm.date).getTime() : 0,
          tags: Array.isArray(fm.tags) ? fm.tags : [],
          summary: fm.summary ?? '',
          translationKey: fm.translationKey ?? '',
          locale: page.url.startsWith('/en/') ? 'en' : 'pt'
        } as Post
      })
      .sort((a, b) => b.dateSort - a.dateSort)
  }
})
