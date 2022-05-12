"use strict";
// import {
//   Chapter,
//   ChapterDetails,
//   // HomeSection,
//   // // HomeSection,
//   LanguageCode,
//   Manga,
//   MangaStatus,
//   MangaTile,
//   //PagedResults,
//   // SearchRequest,
//   // TagSection,
// } from 'paperback-extensions-common'
// export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
//   //   const image = $('.thumbnail').attr('src')
//   const image = $('img').first().attr('src')
//   const titles: string[] = []
//   const title = $('title')!.text()!.split(' - ')![0]!
//   titles.push(title)
//   const rating = 0
//   const statusText = $('btn.btn-xs.btn-success').text()
//   let status: MangaStatus
//   if (statusText) {
//     status =
//       statusText === 'Incomplete' ? MangaStatus.ONGOING : MangaStatus.COMPLETED
//   } else {
//     status = MangaStatus.UNKNOWN
//   }
//   const desc = $('.row > h3').find('p').text()
//   return createManga({
//     id: mangaId,
//     titles: titles,
//     image: image ?? 'https://i.imgur.com/GYUxEX8.png',
//     status,
//     desc,
//     rating,
//   })
// }
// export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {
//   const chapters: Chapter[] = []
//   const chapterTable = $('tbody').find('a')
//   for (let chapter of chapterTable.toArray()) {
//     const id = chapter.attribs.href! //Decode link to chapter
//     const chapNum = $('a', chapter).find('b').first().text()!.split(' ')[1]
//     chapters.push(
//       createChapter({
//         id,
//         mangaId,
//         chapNum: Number(chapNum),
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
//   const links = $('.chapter-content').find('img')
//   for (const img of links.toArray()) {
//     let page = img!.attribs!.src
//     // let page = img!.attribs!['data-src']
//     //   ? img!.attribs!['data-src']
//     //   : img!.attribs!.src!
//     pages.push(page!)
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
//   const results = $('.bodythumb').find('.thumb-item-flow')
//   for (let result of results.toArray()) {
//     const mangaId = $('.thumb-wrapper > a', result).attr('href')
//     const image = $('.img-in-ratio', result).attr('data-bg')
//     const title = $('.title-thumb', result).text()
//     tiles.push(
//       createMangaTile({
//         id: mangaId!,
//         image: image ?? 'https://i.imgur.com/GYUxEX8.png',
//         title: createIconText({
//           text: title,
//         }),
//       })
//     )
//   }
//   return tiles
// }
// export const parseHomeSections = ($: CheerioStatic) => {
//   const tiles: MangaTile[] = []
//   const results = $('.bodythumb').find('.thumb-item-flow.col-6.col-md-3')
//   for (let result of results.toArray()) {
//     const mangaId = $(result).find('a').first().attr('href')
//     const image = $(result).find('.img-in-ratio.lazyloaded').attr('data-bg')
//     const title = $(result).find('.title-thumb').text()
//     tiles.push(
//       createMangaTile({
//         id: mangaId!,
//         image: image ?? 'https://i.imgur.com/GYUxEX8.png',
//         title: createIconText({
//           text: title,
//         }),
//       })
//     )
//   }
//   return tiles
// }
