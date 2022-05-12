/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/indent */
import {
  Chapter,
  ChapterDetails,
  ContentRating,
  HomeSection,
  // LanguageCode,
  Manga,
  // MangaUpdates,
  PagedResults,
  SearchRequest,
  // Section,
  Source,
  // Request,
  // Response,
  SourceInfo,
  // RequestHeaders,
  TagType,
  TagSection,
} from 'paperback-extensions-common'
import {
    parseMangaDetails,
    parseChapters,
    parseChapterDetails,
    parseSearchRequest,
    parseHomeSections,
  parseTags,
} from './MangaGohanParser'

export const MG_DOMAIN = 'https://mangagohan.com'
const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  Referer: MG_DOMAIN,
}
const method = 'GET'

export const MangaGohanInfo: SourceInfo = {
  version: '0.5',
  name: 'Manga Gohan',
  icon: 'logo.png',
  author: 'btylerh7',
  authorWebsite: 'https://github.com/btylerh7',
  description: 'Extension that pulls manga from Manga Gohan',
  contentRating: ContentRating.EVERYONE,
  websiteBaseURL: MG_DOMAIN,
  sourceTags: [
    {
      text: 'Japanese',
      type: TagType.GREY,
    },
  ],
}

export class MangaGohan extends Source {
  readonly cookies = [
    createCookie({
      name: 'isAdult',
      value: '1',
      domain: MG_DOMAIN,
    }),
  ]
  override getCloudflareBypassRequest() {
    return createRequestObject({
      url: `${MG_DOMAIN}`,
      method,
    })
  }
  requestManager = createRequestManager({
    requestsPerSecond: 4,
    requestTimeout: 15000,
  })
  override getMangaShareUrl(mangaId: string): string {
    return `${MG_DOMAIN}/manga/${mangaId}`
  }
  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: encodeURI(`${MG_DOMAIN}/manga/${mangaId}`),
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)

    return parseMangaDetails($, mangaId)
  }
  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: `${MG_DOMAIN}/manga/${mangaId}`,
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)

    return parseChapters($, mangaId)
  }
  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    const request = createRequestObject({
      url: encodeURI(`${MG_DOMAIN}/manga/${mangaId}/${chapterId}`),
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)

    return parseChapterDetails($, mangaId, chapterId)
  }
  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    let page: number = metadata?.page ?? 1
    let type: string = 'title'
    let request
    if(query.title) {
      request = createRequestObject({
        url: MG_DOMAIN,
        param: `/?s=${encodeURI(query.title)}&post_type=wp-manga&post_type=wp-manga`,
        method,
        headers,
      })
    }
    else {
      if(query.includedTags) type = 'tag'
      request = createRequestObject({
        url:`${MG_DOMAIN}/${encodeURI(query.includedTags?.map((x: any) => x.id)[0])}`,
        method,
        headers,
      })}
    const data = await this.requestManager.schedule(request, 1)
    let $ = this.cheerio.load(data.data)
    const manga = parseSearchRequest($, type)
    metadata = manga.length > 0 ? { page: page + 1 } : undefined
    // metadata = page

    return createPagedResults({
      results: manga,
      metadata
    })
  }
  override async getHomePageSections(
    sectionCallback: (section: HomeSection) => void
  ): Promise<void> {
    const request = createRequestObject({
      url: MG_DOMAIN,
      method,
      headers,
    })

    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    parseHomeSections($, sectionCallback)
  }
  override async getSearchTags(): Promise<TagSection[]> {
    const request = createRequestObject({
      url: MG_DOMAIN,
      method,
      headers,
    })
    const response = await this.requestManager.schedule(request, 1)
    const $ = this.cheerio.load(response.data)
    return parseTags($)
  }
}
