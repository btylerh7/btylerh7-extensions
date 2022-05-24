import {
    Chapter,
    LanguageCode,
    ChapterDetails,
    // HomeSection,
    Manga,
    MangaStatus,
    MangaTile,
    // MangaTile,
    // HomeSectionType,
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

        const desc = $('.summary-content').find('p').text()
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
    parseAuthor($:CheerioStatic) {
        let author = ''
        const detailSet = $('.manga-info').find('li')
        for (const detail of detailSet.toArray()){
            const detailText = detail.attribs.text?.toLowerCase()
            if(!detailText) continue
            if (detailText.includes('author')){return author = $('a',detail).text()}
        }
        return author
    }
    
    async parseChapters($:CheerioStatic, mangaId:string): Promise<Chapter[]> {
        const chapters: Chapter[] = []
        const chapterList = $('.card-body.bg-light').find('a')
        console.log(chapterList[0]?.attribs['title'])
        console.log(chapterList[0])
        for (const chapter of $('.list-chapters.at-series').find('a').toArray()){
            const id = chapter.attribs['href']
            console.log(id)
            /* ?.replace(/\//g, '').trim() */
            const chapNum = chapter.attribs['title']?.match(/[0-9]/g)
            if(id == undefined) continue
            if(id.includes('manga')) continue
            chapters.push(
                createChapter({
                    id: id ?? '',
                    mangaId,
                    chapNum: Number(chapNum),
                    langCode: LanguageCode.JAPANESE
                })
            )
        }
        console.log("chapter length is ", chapters.length)
        console.log(chapters[0])
        
        return chapters
    }
    async parseChapterDetails($:CheerioStatic, mangaId:string, id: string): Promise<ChapterDetails>{
        const pages: string[] = []
        const chapterImages = $('.chapter-content img').toArray()
        for (const img of chapterImages) {
            const imgUrl = img.attribs['data-src'] ?? img.attribs['src']
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
    async parseSearchResults($:CheerioStatic): Promise<MangaTile[]>{
        const results: MangaTile[] = []
        for(const result in $('.row-last-update div').toArray()){
            const id = $('.thumb-wrapper', result).attr('data-id') ?? ''
            const image = $('.content.img-in-ratio.lazyloaded', result).attr('data-bg') ?? ''
            const title = ''
            results.push(createMangaTile({
                id,
                image,
                title: createIconText({ text: title})
            }))
            
        }
        return results
    }
}