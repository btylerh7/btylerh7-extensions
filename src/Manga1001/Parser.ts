import { Chapter, ChapterDetails, LanguageCode, Manga, MangaStatus, MangaTile } from "paperback-extensions-common";

export class Parser {
    parseMangaDetails($:CheerioStatic, mangaId: string):Manga {
        const wrapper = $('.content-wrap-inner')
        const titles = []
        const title = $('.entry-title', wrapper).text().replace('(Raw - Free)','').trim()
        titles.push(title)
        const image = $('.entry-content', wrapper).find('img').attr('data-src') ?? ''
        const rating = 0 //Not Provided
        const status = MangaStatus.ONGOING //Not Provided
    
        return createManga({
            id: mangaId,
            titles,
            image,
            rating,
            status
        })
    }

    parseChapters($:CheerioStatic, mangaId: string): Chapter[]{
        const chapters = []
        for(let chapterInfo of $('.chaplist').find('a').toArray()) {
            const id = encodeURI($(chapterInfo).attr('href')!).split('Raw ')[1] ?? ''
            const chapNum = id?.replace(/第|話/g, '').trim()
            console.log("id:", id, "chapNum:", chapNum)
            chapters.push(createChapter({
                id,
                mangaId,
                chapNum: Number(chapNum),
                langCode: LanguageCode.JAPANESE
            }))

        }
            return chapters
    }
    parseChapterDetails($:CheerioStatic, mangaId: string, id:string):ChapterDetails{
        const pages = []
        const wrapper = $('div.entry-content')
        for (let img of $(wrapper).find('img').toArray()) {
            const image = $(img).attr('src')
            if(!image) continue
            pages.push(image)
        }
        return createChapterDetails({
            id,
            mangaId,
            pages,
            longStrip: false,
        })
    }
    parseSearchResults($:CheerioStatic): MangaTile[]{
        const results = []
        for (let article in $('.inner-wrapper').find('article').toArray()){
            const image = $('.featured-thumb.wp-block-image', article).find('img').attr('src')
            const title = $(article).find('.entry-title').first().find('a').text().trim()
            const link =  $(article).find('.entry-title').first().find('a').attr('href') ?? ''
            const mangaId = encodeURI(link)?.split('.top/')[1]?.trim() ?? ''
            results.push(createMangaTile({
                id: mangaId,
                image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title
                }),
            }))
        }
        return results
    }
    // parseHomeSections($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void {

    // }
}