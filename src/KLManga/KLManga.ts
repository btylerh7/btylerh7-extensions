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
    // TagSection,
      Request,
      Response,
    SourceInfo,
    TagType,
} from 'paperback-extensions-common'
import {
  parseMangaDetails,
  parseChapters,
  parseChapterDetails,
  parseSearchRequest,
  parseHomeSections,
} from './KLMangaParser'

export const KLM_DOMAIN = 'https://klmag.net'
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'
const method = 'GET'

export const KLMangaInfo: SourceInfo = {
  version: '0.2.0',
  name: 'KLManga',
  icon: 'logo.ico',
  author: 'btylerh7',
  authorWebsite: 'https://github.com/btylerh7',
  description: 'Extension that pulls manga from KLManga',
  contentRating: ContentRating.EVERYONE,
  websiteBaseURL: KLM_DOMAIN,
  sourceTags: [
    {
      text: 'Japanese',
      type: TagType.GREY,
    },
    {
        text: 'In Development',
        type: TagType.YELLOW,
    }
  ],
}

export class KLManga extends Source {
    readonly cookies = [
        createCookie({
        name: 'isAdult',
        value: '1',
        domain: KLM_DOMAIN,
        }),
    ]
    override getCloudflareBypassRequest(): any {
        return createRequestObject({
        url: `${KLM_DOMAIN}/rzdz-kimetsu-no-yaiba-raw-chapter-205.5.html`, //CloudFlare is only checked on individual chapters
        method,
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
                    'referer': KLM_DOMAIN
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
        return `${KLM_DOMAIN}/${mangaId}`
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${KLM_DOMAIN}/${mangaId}`,
            method,
        })
        const data = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(data.status)
        const $ = this.cheerio.load(data.data)
        return parseMangaDetails($, mangaId)
    }
    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${KLM_DOMAIN}/${mangaId}`,
            method,
        })
        const data = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(data.status)
        const $ = this.cheerio.load(data.data)

        return parseChapters($, mangaId)
    }
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
        url: `${KLM_DOMAIN}/${chapterId}`,
        method,
        })
        const data = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(data.status)
        const $ = this.cheerio.load(data.data)
        const chapterDetails = parseChapterDetails($, mangaId, chapterId)
        if (chapterDetails.pages == []){
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass')
        }
        return chapterDetails
    }
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        let page
        if (metadata && metadata.page) {
            page = metadata.page
        } else {
            page = 1
        }
        const request = createRequestObject({
            url: encodeURI(`${KLM_DOMAIN}/manga-list.html${page > 1 && `?listType=pagination&page=${page}`}?name=${query.title}`),
            method,
        })
        const data = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(data.status)
        const $ = this.cheerio.load(data.data)
        const manga = parseSearchRequest($)
        metadata = manga.length > 0 ? { page: page + 1 } : undefined

        return createPagedResults({
        results: manga,
        metadata,
        })
    }
    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const request = createRequestObject({
          url: KLM_DOMAIN,
          method,
        })
    
        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        this.CloudFlareError(response.status)
        parseHomeSections($, sectionCallback)
      }
    CloudFlareError(status: any) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass')
        }
      }
}
