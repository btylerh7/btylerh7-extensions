import {
    Manga,
    Chapter,
    LanguageCode,
    ChapterDetails,
    MangaTile
} from 'paperback-extensions-common'

export class Parser {
    parseMangaDetails(mangaDetails: any, mangaId:string): Manga {
        const title = mangaDetails.comic.title
        const status = mangaDetails.comic.status
        const hentai = mangaDetails.comic.hentai
        const desc = mangaDetails.comic.desc
        const rating = Number(mangaDetails.comic.bayesian_rating)
        const image = mangaDetails.comic.md_covers[0].gpurl

        return createManga({
            id: mangaId,
            titles: [title],
            status,
            hentai,
            desc,
            rating,
            image,
        })
    }
    parseChapters(mangaDetails:any, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []
        for (const chapter of mangaDetails.chapters) {
            const name = chapter.title
            const id = chapter.hid
            const chapNum = Number(chapter.chap)
            const langCode = LanguageCode.ENGLISH
            if(!id || !name) continue

            chapters.push(
                createChapter({
                    id,
                    mangaId,
                    chapNum,
                    langCode,
                    name
                })
            )
        }
        return chapters
    }
    parseChapterDetails(chapterDetails: any, mangaId: string, id: string): ChapterDetails {
        const pages: string[] = []
        for (const img of chapterDetails.chapter.images) {
            const imageUrl = img.url
            if(!imageUrl) continue
            pages.push(imageUrl)
        }
        return createChapterDetails({
            id,
            mangaId,
            pages,
            longStrip: false
        })
    }
    parseSearchResults(searchResults: any): MangaTile[] {
        const results: MangaTile[] = []
        for (const manga of searchResults){
            const id = manga.slug
            const title = manga.title
            const image = manga.md_covers[0].gpurl
            results.push(
                createMangaTile({
                    id,
                    image,
                    title: createIconText({
                        text: title
                    })
                })
            )
        }
        return results
    }
}