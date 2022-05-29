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

// export class Parser {
//   parseMangaDetails($:CheerioStatic, mangaId: string): Manga {
//     const title = [$('.post-title').find('h1').first().text().split(' ')[0]!] ?? ''
//     const image = $('.summary_image').find('img').attr('data-src') ?? 'https://i.imgur.com/GYUxEX8.png'
//     const rating = Number($('.score.font-meta.total_votes').text()) ?? 0




export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
  const titles= [$('.post-title').find('h1').first().text().replace('(Raw - Free)', '').trim() ?? '']
  const image = $('.summary_image').find('img').attr('data-src')
  let status = MangaStatus.UNKNOWN //All manga is listed as ongoing
  const author = $('.author-content').find('a').first().text()
  const artist = $('.artist-content').find('a').first().text()
  const rating = Number($('.score.font-meta.total_votes').text())
  const desc = $('.description-summary').find('p').first().text().trim()
  let hentai = false
  const tags: Tag[] = []
  const data = $('.genres-content').find('a')
  for (const link of data.toArray()) {
    const id = decodeURI($(link).attr('href')!.split('com/')[1]!)
    const label = $(link).text().trim()
    if (!id || !label) continue
    if (!decodeURI($(link).attr('href')!.split('com/')[1]!)?.startsWith('manga-genre')) continue
    if (label === 'manga-genre/hentai/') hentai = true
    tags.push({ id: id!, label: label })
  }
  const tagSection: TagSection[] = [
    createTagSection({
      id: '0',
      label: 'genres',
      tags: tags.map((tag) => createTag(tag)),
    }),
  ]
  console.log('Get Manga Function: title:',titles,'image',image,'mangaId', mangaId)
  return createManga({
    id: mangaId,
    titles: titles,
    image: image ?? 'https://i.imgur.com/GYUxEX8.png',
    rating: rating ?? 0,
    status: status,
    author: author,
    artist: artist,
    tags: tagSection,
    desc: desc ?? '',
    hentai
  })
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
  const chapters: Chapter[] = []
  const chapterLinks = $('.page-content-listing.single-page').find('li')

  for (let href of chapterLinks.toArray()) {
    // const id = $('a', href).text()
    const chapNum = $('a', href).text().replace(/第|話/g, '').trim()
    const id = `第${chapNum}話`
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

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
  const pages: string[] = []
  const links = $('.reading-content').find('img')

  for (const img of links.toArray()) {
    const page = img.attribs['data-src']?.trim()
    console.log(page)
    // img.attribs['data-src']?.trim() ?? 
    if (!page) continue
    pages.push(page)
  }
  return createChapterDetails({
    id: chapterId,
    mangaId,
    pages,
    longStrip: false,
  })
}

export const parseSearchRequest = ($: CheerioStatic, type: string): MangaTile[] => {
  const tiles: MangaTile[] = []
  let results
  
  //If serch is a title
  if (type === 'title') {
  results = $('.tab-content-wrap').find('.row.c-tabs-item__content')

  for (let result of results.toArray()) {
    // const id = article.attribs.class[0].split('-')[1]
    const mangaId = $(result).find('.h4').find('a').first().attr('href')?.split('manga/')[1] ?? ''
    const image = $('.tab-thumb.c-image-hover > a > img',result).attr('data-src')
    const title = $(result).find('.h4').first().text().replace(/(Raw-Free)/g, '').trim() ?? ''

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
}
  // TODO If there is a genre search
  if(type === 'tag') {
    results = $('.tab-content-wrap').find('.page-item-detail.manga')
    for (let result of results.toArray()) {
    const mangaId = $('h3.h5', result).find('a').first().attr('href')?.split('manga/')[1] ?? ''
    const image = $(result).find('img').first().attr('data-src') ?? ''
    const title = $('h3.h5', result).find('a').first().text().trim() ?? ''
    if (!mangaId || !title) continue

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
  }
  return tiles
}

export const parseHomeSections = ($: CheerioStatic, sectionCallback: (section: HomeSection) => void): void => {
  
  const featuredSection = createHomeSection({id: '0', title: 'Featured Manga', type: HomeSectionType.singleRowLarge, view_more: false,})
  const topSection = createHomeSection({id: '1', title: 'Top Manga', type: HomeSectionType.singleRowNormal, view_more: false,})
  const recentlyUpdatedSection = createHomeSection({id: '2', title: 'Reccently Updated Manga', type: HomeSectionType.singleRowNormal, view_more: false,})

  const featured = []
  const top = []
  const recentlyUpdated = []

  //Retrieve Featured Manga Section

  for (let featuredManga of $('.popular-slider.style-1').find('.slider__item').toArray()) {
    const mangaId = decodeURI($('.slider__content', featuredManga).find('a').first().attr('href')!)?.split('/manga/')[1] ?? ''
    const title = $('h4', featuredManga).find('a').first().text().replace(/(Raw-Free)/g, '').trim() ?? ''
    const image = $('.slider__thumb', featuredManga).find('img').first().attr('data-src')

    featured.push(
      createMangaTile({
        id: mangaId!,
        image: image ?? 'https://i.imgur.com/GYUxEX8.png',
        title: createIconText({text: title,}),
      })
    )
  }
  featuredSection.items = featured
  sectionCallback(featuredSection)

  
 



  for (let topManga of $('.c-blog__content').first().find('.page-item-detail.manga').toArray()) {
    const mangaId = decodeURI($('a', topManga).first().attr('href')!.split('/manga/')[1] ?? '')
    const title = $(topManga).find('h3 > a').first().text().split(' ')[0] ?? ''
    const image = $(topManga).find('img').first().attr('src')

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
  

  for (let recentlyUpdatedManga of $('.main-col-inner.c-page').next().find('.page-item-detail.manga').toArray()) {
    const mangaId = $('a', recentlyUpdatedManga).first().attr('href')?.split('/manga/')[1]
    const title = $(recentlyUpdatedManga).find('h3 > a').first().text().split(' ')[0]
    const image = $(recentlyUpdatedManga).find('img').first().attr('data-src')

    recentlyUpdated.push(
      createMangaTile({
        id: mangaId!,
        image: image ?? 'https://i.imgur.com/GYUxEX8.png',
        title: createIconText({
          text: title!,
        }),
      })
    )
  }
  recentlyUpdatedSection.items = recentlyUpdated
  sectionCallback(recentlyUpdatedSection)
}

export const parseTags = ($: CheerioSelector): TagSection[] => {
  const tags: Tag[] = []
  const data = $('.sub-menu').find('a')
  for (const link of data.toArray()) {
    const id = decodeURI($(link).attr('href')!.split('com/')[1]!)
    const label = $(link).text().trim()
    if (!id || !label) continue
    if (!decodeURI($(link).attr('href')!.split('com/')[1]!)?.startsWith('manga-genre')) continue
    tags.push({ id: id!, label: label })
  }
  const tagSection: TagSection[] = [
    createTagSection({
      id: '0',
      label: 'genres',
      tags: tags.map((tag) => createTag(tag)),
    }),
  ]
  return tagSection
}
