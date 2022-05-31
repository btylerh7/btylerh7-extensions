import { 
    Chapter,
    ChapterDetails,
    LanguageCode,
    HomeSection,
    HomeSectionType,
    Manga,
    MangaStatus,
    MangaTile 
} from 'paperback-extensions-common'

export class Parser {
    parseMangaDetails($:CheerioStatic, mangaId: string):Manga {
        const wrapper = $('.content-wrap-inner')
        const titles = []
        const title = $('h1.entry-title', wrapper).text().replace('(Raw – Free)','').trim()
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
        for(const chapterInfo of $('.chaplist').find('a').toArray()) {
            const id = $(chapterInfo).text().split('Raw ')[1]?.trim() ?? ''
            const chapNum = id?.replace(/第|話|【|】/g, '').trim()
            chapters.push(
                createChapter({
                    id,
                    mangaId,
                    chapNum: Number(chapNum),
                    langCode: LanguageCode.JAPANESE
                })
            )
        }
        return chapters
    }
    parseChapterDetails($:CheerioStatic, mangaId: string, id:string):ChapterDetails{
        const pages = []
        const wrapper = $('div.entry-content')
        for (const img of $(wrapper).find('img').toArray()) {
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
        for (const article of $('#main').find('article').toArray()){
            const image = $(article).find('img').attr('data-src')
            const title = $(article).find('img').attr('alt')?.replace('(Raw – Free)', '').trim() ?? ''
            const mangaId = decodeURI($(article).find('a').attr('href')!)?.split('.top/')[1]?.replace('-raw-–-free/', '').trim() ?? ''
            results.push(createMangaTile({
                id: mangaId,
                image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title ?? ''
                }),
            }))
        }
        return results
    }
    parseHomeSections($: CheerioStatic, sectionTitle:string, sectionCallback: (section: HomeSection) => void): void {
        const topSection = createHomeSection({id: '0', title: 'Top Manga', type: HomeSectionType.singleRowNormal, view_more: false,})
        const recentlyUpdatedSection = createHomeSection({id: '1', title: 'Reccently Updated', type: HomeSectionType.singleRowNormal, view_more: false,})

        if(sectionTitle == 'top'){
            const top = []
            for (const topManga of $('#main').find('article').toArray()){
                const image = $(topManga).find('img').attr('data-src')
                const title = $(topManga).find('img').attr('alt')?.replace('(Raw – Free)', '').trim() ?? ''
                const mangaId = decodeURI($(topManga).find('a').attr('href')!)?.split('.top/')[1]?.replace('-raw-–-free/', '').trim() ?? ''
                top.push(createMangaTile({
                    id: mangaId,
                    image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                    title: createIconText({
                        text: title ?? ''
                    }),
                }))
            }
            topSection.items = top
            return sectionCallback(topSection)
        }
        if(sectionTitle == 'recently updated'){
            const recentlyUpdated = []
            for (const recentlyUpdatedManga of $('#main').find('article').toArray()){
                const image = $(recentlyUpdatedManga).find('img').attr('src')
                const title = $(recentlyUpdatedManga).find('img').attr('alt')?.replace('(Raw – Free)', '').trim() ?? ''
                const mangaId = $(recentlyUpdatedManga).find('img').attr('alt')?.replace('(Raw – Free)', '').trim() ?? ''
                recentlyUpdated.push(createMangaTile({
                    id: mangaId.toLowerCase(),
                    image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                    title: createIconText({
                        text: title ?? ''
                    }),
                }))
            }
            recentlyUpdatedSection.items = recentlyUpdated
            return sectionCallback(recentlyUpdatedSection)
        }
        return
    }
}