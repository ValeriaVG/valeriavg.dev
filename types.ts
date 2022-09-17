export interface Article {
    url: string
    title: string
    tags: string[]
    date: Date
    summary?: string
    content: string
    dev_to?: string
    twitter?: string
    isDraft?: boolean
}