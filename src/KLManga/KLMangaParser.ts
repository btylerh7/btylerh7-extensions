import {
	Chapter,
  	ChapterDetails,
	HomeSection,
	HomeSectionType,
	LanguageCode,
	Manga,
	MangaStatus,
	MangaTile,
	//PagedResults,
	// SearchRequest,
  	// TagSection,
} from 'paperback-extensions-common'

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const image = $('.thumbnail').attr('src')
    const titles: string[] = []
    const title = $('.manga-info > h3').text().replace('- RAW', '').trim() ?? ''
    titles.push(title)

    const rating = 0
    const statusText = $('btn.btn-xs.btn-success').text()
    let status: MangaStatus
    if (statusText) {
        status = statusText === 'Incomplete' ? MangaStatus.ONGOING : MangaStatus.COMPLETED
    } else {
        status = MangaStatus.UNKNOWN
    }

    let desc = $('div.row').find('p').text()
    if (desc == '') desc = $('div.row').find('p').next().text() ?? ''

    return createManga({
        id: mangaId,
        titles: titles,
        image: image ?? 'https://i.imgur.com/GYUxEX8.png',
        status,
        desc,
        rating,
    })
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  	const chapters: Chapter[] = []
  	for (let chapter of $('table.table.table-hover tbody').find('a').toArray()) {
    	const id = $(chapter).attr('href') ?? ''
    	const chapNum = $(chapter).attr('title')?.split('Chapter ')[1] ?? 0

    	chapters.push(
      		createChapter({
        		id,
        		mangaId,
        		chapNum: Number(chapNum),
        		langCode: LanguageCode.JAPANESE,
      		})
    	)
  	}
  	return chapters
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string,chapterId: string): ChapterDetails => {
  	const pages: string[] = []

  	for (const img of $('.chapter-content').find('img').toArray()) {
    	let page = $(img).attr('data-aload')?.trim() ?? $(img).attr('src')?.trim()
    	if(!page) continue
    	pages.push(page)
  	}
	return createChapterDetails({
		id: chapterId,
		mangaId,
		pages,
		longStrip: false,
	})
}

export const parseSearchRequest = ($: CheerioStatic) => {
	const tiles: MangaTile[] = []

	for (let result of $('.bodythumb').find('.thumb-item-flow.col-6.col-md-3').toArray()) {
		const mangaId = $('.thumb-wrapper > a', result).attr('href') ?? ''
		const image = $('.thumb-wrapper', result).find('.content.img-in-ratio.lazyloaded').attr('data-bg')
		const title = $('.thumb_attr.series-title', result).find('.title-thumb').text().replace('- Raw', '').trim() ?? ''

		tiles.push(
		createMangaTile({
			id: mangaId,
			image: image ?? 'https://i.imgur.com/GYUxEX8.png',
			title: createIconText({
			text: title,
			}),
		})
		)
	}
	return tiles
}

export const parseHomeSections = ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void => {
    const topSection = createHomeSection({id: '0', title: 'Top Today', type: HomeSectionType.singleRowNormal, view_more: false,})
    const recentlyUpdatedSection = createHomeSection({id: '1', title: 'LatestRelease', type: HomeSectionType.singleRowNormal, view_more: false,})
  
    const top: MangaTile[]= []
    const recentlyUpdated: MangaTile[] = []  

    const divArray = $('.owl-stage')
    console.log($('div',divArray).toArray())
    for (const topManga of $('div',divArray).toArray()){
        const image = $(topManga).find('div.content.img-in-ratio').css('background-image')?.replace('url("','').replace('")','').trim()
        console.log(image)
        const title = $(topManga).find('.thumb_attr.series-title > a').text().replace('- Raw', '').trim() ?? ''
        const mangaId = $(topManga).find('.thumb_attr.series-title > a').attr('href') ?? ''
        top.push(
            createMangaTile({
                id: mangaId,
                image: image ?? 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title,
                }),
            })
        )
    }
    topSection.items = top
    sectionCallback(topSection)

    for (const recentlyUpdatedManga of $('.bodythumb').find('.thumb-item-flow.col-6.col-md-3').toArray()) {
        const mangaId = $('.thumb_attr.series-title > a', recentlyUpdatedManga).attr('href') ?? ''
        if(mangaId == '') continue
        const image = $('.thumb-wrapper.tooltipstered > a > div > div', recentlyUpdatedManga).css('background-image')?.replace('url("','').replace('")','').trim()
        const title = $('.thumb_attr.series-title', recentlyUpdatedManga).find('.title-thumb').text().replace('- Raw', '').trim() ?? ''

        recentlyUpdated.push(createMangaTile({
            id: mangaId,
            image: image ?? 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({
                text: title
                })
            })
        )
    }
    recentlyUpdatedSection.items = recentlyUpdated
    sectionCallback(recentlyUpdatedSection)
}
