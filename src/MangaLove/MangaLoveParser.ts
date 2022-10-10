import { 
    Chapter,
    ChapterDetails,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    Section,
    TagSection
} from "paperback-extensions-common";

export class Parser {
    parseMangaDetails($: CheerioStatic, mangaId: string): Manga {
        const titles = [$('div#post-data > h1').first().text().replace('(Raw – Free)', '').trim()]
        const image = $('div#post-data img').attr('src')
        const desc = $('div#post-content > p').last().text().trim()
        let arrayTags = []
        for (let tag of $('.post-category > a').toArray()){
            const id = $(tag).attr('href')?.replace(/https:\/\/mangalove.top\/category\//, '').replace('/', '')
            const label = $(tag).attr('title')?.trim()
            if(!id || !label) continue
            arrayTags.push({id:id, label: label})
        }
        const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]

        return createManga({
            id: mangaId,
            titles,
            image: image ?? 'https://i.imgur.com/GYUxEX8.png',
            desc,
            tags: tagSections,
            status: MangaStatus.UNKNOWN,
        })
    }

    parseChapters($: CheerioStatic, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []

        for (let chapter of $('table.table').find('tr').toArray()) {
            const title = $('a', chapter).attr('title')?.split('【')[1]?.replace('】', '') ?? ''
            const id = $('a', chapter).attr('href')?.replace(/\/chapters\//, '').replace('/', '')
            const chapNum = Number(title?.replace(/第|話/g, ''))
            if(!id) continue

            chapters.push(createChapter({
                id,
                mangaId,
                name: title,
                chapNum: isNaN(chapNum) ? 0 : chapNum,
                langCode: LanguageCode.JAPANESE
            }))
        }
        return chapters
    }

    parseChapterDetails($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails {
        const pages = []

        for (let page of $('div.container-chapter-reader').find('img').toArray()){
            const url = $(page).attr('data-src') ?? $(page).attr('src')
            if (!url) continue
            
            pages.push(url)
        }
        return createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
            longStrip: false
        })
    }

    parseResultSet($:CheerioStatic, id?:Section['id']) : MangaTile[] {
        const results: MangaTile[] = []
        const selector = id == '/' ? $('.post-list .item').next() : $('.post-list .item')
        for (let result of $(selector).toArray()) {
            const image = $(result).find('img').attr('data-src') ?? $(result).attr('src')
            const id = $('a', result).attr('href')?.replace(/https:\/\/mangalove.top\//, '').replace('/', '')
            const title = $('a > h3', result)?.text().replace('(Raw – Free)', '').trim() ?? ''
            const subtitle = $('div.relative > a.post-list-duration', result).text().trim() ?? ''
            if (!id) continue

            results.push(
                createMangaTile({
                    id,
                    image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
                    title: createIconText({ text: title }),
                    subtitleText: createIconText({ text: subtitle }),
                })
            )
        }

        return results
    }

    parseTags($: CheerioStatic): TagSection[] {
        let arrayTags = []
        for (let tag of $('.pr10 > a').toArray()){
            const id = $(tag).attr('href')?.replace(/https:\/\/mangalove.top\/category\//, '').replace('/', '')
            const label = $(tag).attr('title')?.trim()
            if(!id || !label) continue
            arrayTags.push({id:id, label: label})
        }
        return [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]
    }

    isLastPage = ($: CheerioStatic): boolean => {
        let isLast = true
        const lastPage = Number($('span.pages').text().replace(/\d*\//, '').trim())
        const currentPage = Number($('span.current').text().trim())
        if (currentPage <= lastPage) isLast = false
        return isLast
    }
}