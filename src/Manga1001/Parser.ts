import { Chapter, ChapterDetails, Manga, MangaStatus, MangaTile } from "paperback-extensions-common";

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
        for(let chapterInfo in $('.chaplist').find('a').toArray() {
            const id = 
        }

    }
    parseChapterDetails($:CheerioStatic, mangaId: string, id:string):ChapterDetails{

    }
    parseSearchResults($:CheerioStatic): MangaTile[]{

    }
    parseHomeSections($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void {

    }
}