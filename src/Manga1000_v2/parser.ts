import {
    Chapter,
    ChapterDetails,
    HomeSection,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    HomeSectionType,
    // PagedResults,
    // SearchRequest,
    TagSection,
    Tag,
  } from 'paperback-extensions-common'

export class Parser {
    parseMangaDetails($:CheerioStatic, mangaId: string): Manga {
        const titles = []
        const title = $('.manga-details h3').first().text()
        titles.push(title)
        const otherTitles = $('.manga-details li').first().text().split(': ')[1]?.split(',')
        if (otherTitles){
            for (const title of otherTitles){
                titles.push(title)
            }
        }
        let author = ''
        let status = MangaStatus.ONGOING
        const image = $('.thumbnail').attr('src')
        const rating = 0 //Not provided by source
        for (const li of $('.manga-detals').toArray()) {
            const listItem = li.attribs.text?.toLowerCase()
            if (!listItem) break
            if (listItem.includes('author')) {author = $('a', li).text()}
            // if (listItem.includes('status')) {

            // }
            else break
        }
        
        return createManga({
            id: mangaId,
            titles: titles,
            image: image ?? 'https://i.imgur.com/GYUxEX8.png',
            rating,
            author,
            status



        })
    }
}