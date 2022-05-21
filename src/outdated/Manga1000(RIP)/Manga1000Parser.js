"use strict";
// import {
//   Chapter,
//   ChapterDetails,
//   // HomeSection,
//   LanguageCode,
//   Manga,
//   MangaStatus,
//   MangaTile,
//   //PagedResults,
//   // SearchRequest,
//   TagSection,
//   Tag,
// } from 'paperback-extensions-common'
// export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
//   const titles: string[] = [mangaId!.split(' ')[0]!]
//   const image = $('.aligncenter').find('img').attr('src')
//   const status = MangaStatus.ONGOING //Manga1000 does not provide this info
//   const author = $('.entry-content').find('p').text().split(' ')[1]
//   const tags: Tag[] = []
//   const data = $('select').find('option')
//   for (const option of data.toArray()) {
//     const id = decodeURI($(option).attr('value')!)
//     const label = $(option).text()
//     // if (!id || !label) continue
//     tags.push({ id: id, label: label })
//   }
//   tags.shift()
//   const tagSection: TagSection[] = [
//     createTagSection({
//       id: '0',
//       label: 'genres',
//       tags: tags.map((tag) => createTag(tag)),
//     }),
//   ]
//   return createManga({
//     id: mangaId,
//     titles: titles,
//     image: image ?? 'https://i.imgur.com/GYUxEX8.png',
//     rating: 0,
//     status: status,
//     author: author,
//     tags: tagSection,
//     // desc,
//     // hentai
//   })
// }
// export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
//   const chapters: Chapter[] = []
//   const chapterLinks = $('td').find('a')
//   for (let href of chapterLinks.toArray()) {
//     const id = decodeURI(href!.attribs!.href!) //Decode link to chapter
//     const chapNum = Number(href.children[0]!.data!.match('【(.*?)】')?.[1]!.replace(/第|話/g, ''))
//     chapters.push(
//       createChapter({
//         id,
//         mangaId,
//         chapNum,
//         langCode: LanguageCode.JAPANESE,
//       })
//     )
//   }
//   return chapters
// }
// export const parseChapterDetails = (
//   $: CheerioStatic,
//   mangaId: string,
//   chapterId: string
// ): ChapterDetails => {
//   const pages: string[] = []
//   const links = $('.wp-block-image').find('img')
//   for (const img of links.toArray()) {
//     let page = img!.attribs!['data-src'] ? img!.attribs!['data-src'] : img!.attribs!.src!
//     pages.push(page)
//   }
//   return createChapterDetails({
//     id: chapterId,
//     mangaId,
//     pages,
//     longStrip: false,
//   })
// }
// export const parseSearchRequest = ($: CheerioStatic) => {
//   const tiles: MangaTile[] = []
//   const results = $('.inner-wrapper').find('article')
//   for (let article of results.toArray()) {
//     // const id = article.attribs.class[0].split('-')[1]
//     const mangaId = decodeURI($('.featured-thumb', article).find('a')!.attr('href')!)
//     const image = $(article).find('img')?.first().attr('src') ?? ''
//     const title = $(article).find('.entry-title > a').text()
//     tiles.push(
//       createMangaTile({
//         id: mangaId,
//         image: image,
//         title: createIconText({
//           text: title,
//         }),
//       })
//     )
//   }
//   return tiles
// }
// export const parseHomeSections = ($: CheerioStatic): MangaTile[] => {
//   const manga: MangaTile[] = []
//   const results = $('center').find('article')
//   for (let article of results.toArray()) {
//     // const id = article.attribs.class[0].split('-')[1]
//     const mangaId = decodeURI($('.featured-thumb', article).find('a')!.attr('href')!).split('/')[1]!
//     const image = $(article).find('img')?.first().attr('src') ?? ''
//     const title = $(article).find('.entry-title > a').text()
//     manga.push(
//       createMangaTile({
//         id: mangaId,
//         image: image,
//         title: createIconText({
//           text: title,
//         }),
//       })
//     )
//   }
//   return manga
// }
// export const parseTags = ($: CheerioSelector): TagSection[] => {
//   const tags: Tag[] = []
//   const data = $('select').find('option')
//   for (const option of data.toArray()) {
//     const id = decodeURI($(option).attr('value')!)
//     const label = $(option).text()
//     // if (!id || !label) continue
//     tags.push({ id: id, label: label })
//   }
//   tags.shift()
//   const tagSection: TagSection[] = [
//     createTagSection({
//       id: '0',
//       label: 'genres',
//       tags: tags.map((tag) => createTag(tag)),
//     }),
//   ]
//   return tagSection
// }
