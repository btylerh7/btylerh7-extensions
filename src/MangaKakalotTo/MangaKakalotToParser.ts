import { 
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    LanguageCode,
    Manga, 
    MangaStatus, 
    MangaTile
} from "paperback-extensions-common";
import entities = require('entities')

export class Parser {
    parseMangaDetails($:CheerioStatic, mangaId: string): Manga {
        const mangaInfoDiv = $('div.inner.db-top')
        const title = this.decodeHTMLEntity($('h3.manga-name', mangaInfoDiv).text().trim())
        const author = this.decodeHTMLEntity($('.line', mangaInfoDiv).first().find('span.result a').text().trim())
        const status = this.parseMangaStatus($('.line', mangaInfoDiv).next().find('span.result').text().trim().toLowerCase())
        const rating = 0
        const image = $('.manga-poster', mangaInfoDiv).find('img').attr('src') ?? ''
        const desc = this.decodeHTMLEntity($('.dbs-content').text().trim())

        return createManga({
            id: mangaId,
            titles: [title],
            author,
            status,
            rating,
            image,
            desc
        })
    }
    parseMangaStatus (status: string): MangaStatus {
        switch(status){
            case 'publishing':
                return MangaStatus.ONGOING
        }
        return MangaStatus.UNKNOWN
    }
    parseChapters($:CheerioStatic, mangaId: string): Chapter[] { // TODO add other language chapters
        const chapters: Chapter[] = []
        for (const chapter of $('#list-chapter-en').find('div.item').toArray()){
            
            const chapterLink = $(chapter).find('a').attr('href')?.split('/')[4]?.trim()
            const id = `en/${chapterLink}`
            const chapNum = Number(chapterLink?.replace('chapter-', ''.trim())) ?? 0
            const name = $(chapter).find('a').text().trim()
            if(!id) continue
            chapters.push(
                createChapter({
                    id,
                    mangaId,
                    chapNum,
                    name,
                    langCode: LanguageCode.ENGLISH
                })
            )
        }
        return chapters
    }
    parseChapterDetails($:CheerioStatic, mangaId: string, id: string): ChapterDetails {
        const pages = []
        for (const image of $('.card-wrap').toArray()){
            const page = $(image).attr('data-url') ?? $(image).find('img').attr('src')
            if(!page) continue
            pages.push(page)
        }
        return createChapterDetails({
            mangaId,
            id,
            pages,
            longStrip: false
        })
    }
    parseSearchResults($:CheerioStatic): MangaTile[] {
        const results: MangaTile[] = []
        for (const result of $('.manga-list.is-big-sbs').find('.item').toArray()){
            const id = $(result).find('.manga-name a').attr('href')?.slice(1)
            const title = this.decodeHTMLEntity($(result).find('.manga-name a').text().trim())
            const image = $(result).find('img').attr('src') ?? ''
            if(!id) continue
            // TODO add subtitle for most recent chapter

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
    parseHomeSections ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void {
        const featuredSection = createHomeSection({id: 'featured',title: 'Featured Manga',type: HomeSectionType.featured,view_more: false,})
        const popularSection = createHomeSection({id: 'popular',title: 'Most Popular Manga',type: HomeSectionType.singleRowNormal,view_more: false,})
        const recentlyUpdatedSection = createHomeSection({id: '2',title: 'Latest Manga Release',type: HomeSectionType.singleRowNormal,view_more: false,})
        
        const featured = []
        const popular = []
        const recentlyUpdated = []

        for(const featuredManga of $('.swiper-wrapper').find('.item-basic').toArray()){
            const id = $(featuredManga).find('.manga-poster').attr('href')?.slice(1)
            const image = $(featuredManga).find('img').attr('src') ?? ''
            const title = this.decodeHTMLEntity($(featuredManga).find('.manga-name a').text().trim())
            console.log(id, title)
            if(!id) continue

            featured.push(
                createMangaTile({
                    id,
                    image,
                    title: createIconText({
                        text: title
                    })
                })
            )
        }
        featuredSection.items = featured
        sectionCallback(featuredSection)

        for (const popularManga of $('.home-popular-list').find('.item').toArray()) {
            const title = this.decodeHTMLEntity($(popularManga).find('a').attr('title'))
            const id = $(popularManga).find('a').attr('href')?.slice(1)
            const image = ''
            if(!id) continue

            popular.push(
                createMangaTile({
                    id,
                    image,
                    title: createIconText({
                        text: title
                    })
                })
            )
        }
        popularSection.items = popular
        sectionCallback(popularSection)

        for (const recentlyUpdatedManga of $('#latest-chap').find('.item').toArray()){
            const title = this.decodeHTMLEntity($('.item-info', recentlyUpdatedManga).find('a').first().text().trim())
            const id = $('.item-info', recentlyUpdatedManga).find('a').first().attr('href')?.slice(1)
            const image = $('.item-poster', recentlyUpdatedManga).find('img').attr('src') ?? ''
            if(!id) continue

            recentlyUpdated.push(
                createMangaTile({
                    id,
                    image,
                    title: createIconText({
                        text: title
                    })
                })
            )
        }
        recentlyUpdatedSection.items = recentlyUpdated
        sectionCallback(recentlyUpdatedSection)
    }
    decodeHTMLEntity(html: any){
        return entities.decodeHTML(html)
    }
}