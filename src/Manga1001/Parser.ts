import { Chapter, ChapterDetails, LanguageCode, Manga, MangaStatus, MangaTile } from "paperback-extensions-common";

export class Parser {
    parseMangaDetails($:CheerioStatic, mangaId: string):Manga {
        const wrapper = $('.content-wrap-inner')
        const titles = []
        const title = $('h1.entry-title', wrapper).text().replace('(Raw - Free)','').trim()
        // const otherTitles = $('.entry-title', wrapper).text().replace('(Raw - Free)','').trim()
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
            const id = $(chapterInfo).text().split('Raw ')[1]?.trim() ?? ''
            const chapNum = id?.replace(/第|話|【|】/g, '').trim()
            // console.log("id:", id, "chapNum:", chapNum)
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
        for (let article of $('#main').find('article').toArray()){
            const image = $(article).find('img').attr('data-src')
            console.log(image)
            const title = $(article).find('img').attr('alt')?.replace('(Raw – Free)', '').trim() ?? '' //Title and MangaId are same
            results.push(createMangaTile({
                id: title,
                image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title ?? ''
                }),
            }))
        }
        return results
    }
    // parseHomeSections($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void {

    // }
}