// /* eslint-disable linebreak-style */
// import {
//     Chapter,
//     ChapterDetails,
//     ContentRating,
//     HomeSection,
//     //   LanguageCode,
//     Manga,
//     // MangaUpdates,
//     PagedResults,
//     SearchRequest,
//     Source,
//     // TagSection,
//     //   Request,
//     //   Response,
//     SourceInfo,
//     TagType,
// } from 'paperback-extensions-common'
// import {
//   parseMangaDetails,
//   parseChapters,
//   parseChapterDetails,
//   parseSearchRequest,
//   parseHomeSections,
// } from './KLMangaParser'

// export const KLM_DOMAIN = 'https://klmag.net'
// const headers = {
//   'content-type': 'application/x-www-form-urlencoded',
//   Referer: 'https://klmag.net/',
// }
// const method = 'GET'

// export const KLMangaInfo: SourceInfo = {
//   version: '1.0',
//   name: 'KLManga',
//   icon: 'logo.ico',
//   author: 'btylerh7',
//   authorWebsite: 'https://github.com/btylerh7',
//   description: 'Extension that pulls manga from KLManga',
//   contentRating: ContentRating.EVERYONE,
//   websiteBaseURL: KLM_DOMAIN,
//   sourceTags: [
//     {
//       text: 'Japanese',
//       type: TagType.GREY,
//     },
//   ],
// }

// export class KLManga extends Source {
//   readonly cookies = [
//     createCookie({
//       name: 'isAdult',
//       value: '1',
//       domain: `https://klmag.net`,
//     }),
//   ]
//   override getCloudflareBypassRequest() {
//     return createRequestObject({
//       url: `${KLM_DOMAIN}`,
//       method,
//       headers,
//     })
//   }
//   requestManager = createRequestManager({
//     requestsPerSecond: 4,
//     requestTimeout: 40000,
//   })
//   //   override getMangaShareUrl(mangaId: string): string {
//   //     return `${KLM_DOMAIN}/${mangaId}/`
//   //   }

//   async getMangaDetails(mangaId: string): Promise<Manga> {
//     const request = createRequestObject({
//       url: `${KLM_DOMAIN}/${mangaId}?PageSpeed=0`,
//       method,
//       headers,
//       cookies: this.cookies,
//     })
//     this.getCloudflareBypassRequest()
//     const data = await this.requestManager.schedule(request, 1)
//     let $ = this.cheerio.load(data.data)

//     return parseMangaDetails($, mangaId)
//   }
//   async getChapters(mangaId: string): Promise<Chapter[]> {
//     const request = createRequestObject({
//       url: `${KLM_DOMAIN}/${mangaId}`,
//       method,
//       headers,
//       cookies: this.cookies,
//     })
//     const data = await this.requestManager.schedule(request, 1)
//     let $ = this.cheerio.load(data.data)

//     const chapterList = parseChapters($, mangaId)
//     return chapterList
//   }
//   async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
//     const request = createRequestObject({
//       url: `${KLM_DOMAIN}/${chapterId}`,
//       method,
//       headers,
//       cookies: this.cookies,
//     })
//     const data = await this.requestManager.schedule(request, 1)
//     let $ = await this.cheerio.load(data.data)

//     return parseChapterDetails($, mangaId, chapterId)
//   }
//   async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
//     let page
//     if (metadata && metadata.page) {
//       page = metadata.page
//     } else {
//       page = 1
//     }
//     const request = createRequestObject({
//       url: encodeURI(
//         `${KLM_DOMAIN}/manga-list.html${page > 1 && `?listType=pagination&page=${page}`}?name=${
//           query.title
//         }`
//       ),
//       method,
//       headers,
//       cookies: this.cookies,
//     })
//     const data = await this.requestManager.schedule(request, 1)
//     let $ = await this.cheerio.load(data.data)
//     const manga = parseSearchRequest($)
//     metadata = manga.length > 0 ? { page: page + 1 } : undefined

//     return createPagedResults({
//       results: manga,
//       metadata,
//     })
//   }
//   override async getHomePageSections(
//     sectionCallback: (section: HomeSection) => void
//   ): Promise<void> {
//     const sections = [
//       {
//         request: createRequestObject({
//           url: `${KLM_DOMAIN}/manga-list.html`,
//           method,
//           cookies: this.cookies,
//         }),
//         section: createHomeSection({
//           id: 'top',
//           title: 'Top Manga',
//           view_more: false,
//         }),
//       },
//       // {
//       //   request: createRequestObject({
//       //     url: `${M1000_DOMAIN}/seachlist`,
//       //     method,
//       //     cookies: this.cookies,
//       //   }),
//       //   section: createHomeSection({
//       //     id: 'top',
//       //     title: 'Top Manga',
//       //     view_more: false,
//       //   }),
//       // },
//     ]
//     // const promises: Promise<void>[] = []
//     for (const section of sections) {
//       // Load empty sections
//       sectionCallback(section.section)
//     }

//     for (const section of sections) {
//       // Populate data in sections
//       let response = await this.requestManager.schedule(section.request, 1)
//       let $ = this.cheerio.load(response.data)
//       // this.cloudflareError(response.status);
//       section.section.items = parseHomeSections($)
//       sectionCallback(section.section)
//     }
//     // Make sure the function completes
//     // await Promise.all(promises)
//   }
// }
