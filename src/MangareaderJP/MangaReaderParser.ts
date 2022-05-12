import {
    Manga, MangaStatus
} from 'paperback-extensions-common'

export class Parser {
    parseMangaDetails($:CheerioStatic, mangaId: string): Manga {
        const image = $('.manga-poster-img').attr('src') ?? ''
        const title = $('.manga-name').text() ?? ''
        const desc = $('.description').text() ?? ''
        let rating = 0
        let status = MangaStatus.ONGOING
        let author = ''
        let views = 0
        for (const mangaDetail of $('.anisc-info .item').toArray()) {
            const detailTitle = $('.item-head').text().toLowerCase()
            if (detailTitle.includes('status')) status = this.mangaStatus($('.name', mangaDetail).text().toLowerCase())
            if (detailTitle.includes('authors')) author = $('a', mangaDetail).text().trim() ?? ''
            if (detailTitle.includes('views'))  views  = Number($('.name', mangaDetail).text().replace(',', '').trim() ?? '0')
            if (detailTitle.includes('score'))  rating = Number($('.name', mangaDetail).text().trim() ?? '0')
        }
        
        return createManga({
            id: mangaId,
            titles: [title],
            author: author,
            image: image,
            desc: this.encodeText(desc),
            status: status,
            rating: rating,
        })
    }

    mangaStatus(str: string): MangaStatus {
        if (str.includes('publishing'))   return MangaStatus.ONGOING
        if (str.includes('finished'))  return MangaStatus.COMPLETED
        if (str.includes('haitus'))    return MangaStatus.HIATUS
        if (str.includes('discontinued')) return MangaStatus.ABANDONED
        if (str.includes('published'))    return MangaStatus.UNKNOWN
        return MangaStatus.ONGOING
    }
}

