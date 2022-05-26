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
  Request,
  Response,
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

export const MG_DOMAIN = 'https://mangagohan.me'
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'

const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  Referer: 'https://mangagohan.me/?__cf_chl_tk=Vdie6FXxTJZv3.cpvMsRffoLHmwttqIvYSyp79VoXQI-1653012153-0-gaNycGzNCqU',
  'user-agent': userAgent
}
const method = 'GET'

export const MangaGohanInfo: SourceInfo = {
  version: '1.0.0',
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
    {
      text: "Site Down",
      type: TagType.RED,
    }
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
      headers,
    })
  }
  requestManager = createRequestManager({
    requestsPerSecond: 4,
    requestTimeout: 80000,
    interceptor: {
      interceptRequest: async (request: Request): Promise<Request> => {

          request.headers = {
              ...(request.headers ?? {}),
              ...{
                  'user-agent': userAgent,
                  'referer': 'https://mangagohan.me/?__cf_chl_tk=Vdie6FXxTJZv3.cpvMsRffoLHmwttqIvYSyp79VoXQI-1653012153-0-gaNycGzNCqU'
              }
          }

          return request
      },

      interceptResponse: async (response: Response): Promise<Response> => {
          return response
      }
  }
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
    const data = await this.requestManager.schedule(request, 3)
    this.CloudFlareError(data.status)
    let $ = this.cheerio.load(data.data)

    return parseMangaDetails($, mangaId)
  }
  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: `${MG_DOMAIN}/manga/${mangaId}`,
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 3)
    this.CloudFlareError(data.status)
    let $ = this.cheerio.load(data.data)

    return parseChapters($, mangaId)
  }
  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    const request = createRequestObject({
      url: encodeURI(`${MG_DOMAIN}/manga/${mangaId}/${chapterId}/`),
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 3)
    this.CloudFlareError(data.status)
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
    const data = await this.requestManager.schedule(request, 3)
    let $ = this.cheerio.load(data.data)
    const manga = parseSearchRequest($, type)
    metadata = manga.length > 0 ? { page: page + 1 } : undefined
    // metadata = page

    return createPagedResults({
      results: manga,
      metadata
    })
  }
  override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
    const request = createRequestObject({
      url: MG_DOMAIN,
      method,
      headers,
    })

    const response = await this.requestManager.schedule(request, 3)
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
  CloudFlareError(status: any) {
    if (status == 503) {
        throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass')
    }
}
}
