/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/indent */
import {
  Chapter,
  ChapterDetails,
  ContentRating,
  HomeSection,
  Manga,
  PagedResults,
  SearchRequest,
  Source,
  Request,
  Response,
  SourceInfo,
  TagType,
  TagSection,
} from 'paperback-extensions-common'
import {Parser} from './MangaGohanParser'

export const MG_DOMAIN = 'https://mangagohan.me'
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'

const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  Referer: 'https://mangagohan.me/?__cf_chl_tk=Vdie6FXxTJZv3.cpvMsRffoLHmwttqIvYSyp79VoXQI-1653012153-0-gaNycGzNCqU',
  'user-agent': userAgent
}
const method = 'GET'

export const MangaGohanInfo: SourceInfo = {
  version: '1.2.2',
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
    // Recently, bypass has not been needed. Could change in future.
    // {
    //   text: 'CloudFlare',
    //   type: TagType.RED,
    // },
  ],
}

export class MangaGohan extends Source {
  parser = new Parser()
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
    requestTimeout: 6000,
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

    return this.parser.parseMangaDetails($, mangaId)
  }
  async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
      url: encodeURI(`${MG_DOMAIN}/manga/${mangaId}`),
      method,
      headers,
    })
    const data = await this.requestManager.schedule(request, 3)
    this.CloudFlareError(data.status)
    let $ = this.cheerio.load(data.data)

    return this.parser.parseChapters($, mangaId)
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

    return this.parser.parseChapterDetails($, mangaId, chapterId)
  }
  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    let page: number = metadata?.page ?? 1
    let type: string = 'title'
    let request
    if(query.title) {
      request = createRequestObject({
        url: MG_DOMAIN,
        param: `/?s=${encodeURI(query.title)}&post_type=wp-manga`, 
        method,
        headers,
      }) 
    }
    else {
      if(query.includedTags) type = 'tag'
      request = createRequestObject({
        url:`${MG_DOMAIN}/manga-genre/${encodeURI(query.includedTags?.map((x: any) => x.id)[0])}/page/${page.toString()}`,
        method,
        headers,
      })
    }
    const data = await this.requestManager.schedule(request, 3)
    this.CloudFlareError(data.status)
    let $ = this.cheerio.load(data.data)
    const manga = this.parser.parseSearchRequest($, type)
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
    this.CloudFlareError(response.status)
    this.parser.parseHomeSections($, sectionCallback)
  }
  override async getSearchTags(): Promise<TagSection[]> {
    const request = createRequestObject({
      url: MG_DOMAIN,
      method,
      headers,
    })
    const response = await this.requestManager.schedule(request, 1)
    this.CloudFlareError(response.status)
    const $ = this.cheerio.load(response.data)
    return this.parser.parseTags($)
  }
  CloudFlareError(status: any) {
    if (status == 503) {
        throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass')
    }
  }
}
