import {
    Chapter,
    LanguageCode,
    ChapterDetails,
    HomeSection,
    Manga,
    MangaStatus,
    MangaTile,
    HomeSectionType,
    // // PagedResults,
    // // SearchRequest,
    // TagSection,
    // Tag,
} from 'paperback-extensions-common'

export class Parser {
    parseMangaDetails($:CheerioStatic, mangaId: string): Manga {
        const titles = []
        const title = $('.manga-info h3').first().text()
        titles.push(title)

        let desc = $('.summary-content').find('p').text()
        if(desc == ''){desc = $('.summary-content').find('p').next().text()}
        const image = $('.thumbnail').attr('src')
        const rating = 0
        const status = MangaStatus.ONGOING
        const author = this.parseAuthor($)        
        return createManga({
            id: mangaId,
            titles: titles,
            image: image ?? 'https://i.imgur.com/GYUxEX8.png',
            rating,
            author,
            status,
            desc



        })
    }
    parseAuthor($:CheerioStatic): string {
        let author = ''
        const detailSet = $('.manga-info').find('li')
        for (const detail of detailSet.toArray()){
            const detailText = detail.attribs.text?.toLowerCase()
            if(!detailText) continue
            if (detailText.includes('author')){return author = $('a',detail).text()}
        }
        return author
    }
    
    parseChapters($:CheerioStatic, mangaId:string): Chapter[] {
        const chapters: Chapter[] = []
        // const chapterList = $('.card-body.bg-light').find('a')
        // console.log(chapterList[0]?.attribs['title'])
        // console.log(chapterList[0])
        for (const chapter of $('.list-chapters.at-series').find('a').toArray()){
 
            const id = chapter.attribs['href']?.split(`${mangaId}/`)[1]?.replace('/','').trim()
            const chapNum = chapter.attribs['title']?.replace('Chapter ', '').trim()
            if(id == undefined) continue
            // if(id.includes('manga')) continue
            chapters.push(
                createChapter({
                    id,
                    mangaId,
                    chapNum: Number(chapNum),
                    langCode: LanguageCode.JAPANESE
                })
            )
        }
        // console.log("chapter length is ", chapters.length)
        // console.log(chapters[0])
        
        return chapters
    }
    parseChapterDetails($:CheerioStatic, mangaId:string, id: string): ChapterDetails{
        const pages: string[] = []
        for (const img of $('.chapter-content').find('img').toArray()) {
            const imgUrl = $(img).attr('data-src')?.trim() ?? $(img).attr('src')?.trim()
            if (!imgUrl) continue
            pages.push(imgUrl)
        }
        return createChapterDetails({
            id,
            mangaId,
            pages,
            longStrip: false,
        })
    }
    parseSearchResults($:CheerioStatic): MangaTile[]{
        const results: MangaTile[] = []
        for(const result of $('#history').find('.thumb-wrapper').toArray()){
            const id = $(result).attr('data-id') ?? ''
            const image = $(result).find('.content.img-in-ratio.lazyloaded').attr('data-bg') ?? ''
            const title = ''
            results.push(createMangaTile({
                id,
                image,
                title: createIconText({ text: title})
            }))
        }
        return results
    }
    parseHomeSections ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void {
        const popularSection = createHomeSection({id: '0',title: 'Popular Manga',type: HomeSectionType.singleRowNormal,view_more: false,})
        const recentlyUpdatedSection = createHomeSection({id: '1',title: 'Recently Updated Manga',type: HomeSectionType.singleRowNormal,view_more: false,})
        const newMangaSection = createHomeSection({id: '2',title: 'New Manga',type: HomeSectionType.singleRowNormal,view_more: false,})
      
        const popular = []
        const recentlyUpdated = []
        const newManga = []
      
      
        for (const popularManga of $('.owl-stage-outer').find('.thumb-wrapper').toArray()) {
            const mangaId = $('a', popularManga).attr('href')?.replace('/','').trim()
            const title = '' //Not provided by site
            const image = $('.content.img-in-ratio', popularManga).css('background-image').split('url("')[1]?.replace('")','').trim()
      
            popular.push(
                createMangaTile({
                    id: mangaId!,
                    image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                    title: createIconText({
                        text: title,
                    }),
                })
            )
        }
        
        popularSection.items = popular
        sectionCallback(popularSection)
      

        for (const recentlyUpdatedManga of $('.thumb-item-flow.col-6.col-md-3',$('.row-last-update')).toArray()) {
            const mangaId = $('a',recentlyUpdatedManga).attr('href')?.split('/')[1]?.replace('/', '') ?? ''
            if (mangaId == 'manga-list.html?sort=last_update') continue
            const image = $(recentlyUpdatedManga).find('.content.img-in-ratio.lazyloaded').attr('data-bg') ?? ''
            const title = '' //Not provided by site
            // console.log("recent:", image)
      
            recentlyUpdated.push(
                createMangaTile({
                    id: mangaId,
                    image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                    title: createIconText({
                        text: title,
                    }),
                })
            )
        }
        
        recentlyUpdatedSection.items = recentlyUpdated
        sectionCallback(recentlyUpdatedSection)
      
        const newMangaDiv = $('.row-last-update').next()
        for (const newMangaItem of $('.thumb-item-flow.col-6.col-md-3',newMangaDiv).toArray()) {
            const mangaId = $('a',newMangaItem).attr('href')?.split('/')[1]?.replace('/', '') ?? ''
            if (mangaId == 'manga-list.html?sort=last_update') continue
            const image = $(newMangaItem).find('.content.img-in-ratio.lazyloaded').attr('data-bg') ?? ''
            const title = '' //Not provided by site
            console.log('new:', $('a',newMangaItem).attr('href'))
            newManga.push(
                createMangaTile({
                    id: mangaId,
                    image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                    title: createIconText({
                        text: title,
                    }),
                })
            )
        }
        newMangaSection.items = newManga
        sectionCallback(newMangaSection)
    }
}