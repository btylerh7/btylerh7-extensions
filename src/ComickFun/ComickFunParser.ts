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
        const desc = mangaDetails.comic.desc.split('<br')[0]
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
            if(!id) continue

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
    parseHomeSection(response: any, selector: boolean): MangaTile[]{
        const results = []
        let id, title, image
        const data = selector ? response.rank : response
        for (const manga of data) {
            if(selector) {
                id = manga.slug
                title = manga.slug
                image = manga.md_covers[0].gpurl
            } else {
                id = manga.md_comics.slug
                title = manga.md_comics.title
                image = manga.md_comics.md_covers[0].gpurl
            }
            if (!id) continue
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