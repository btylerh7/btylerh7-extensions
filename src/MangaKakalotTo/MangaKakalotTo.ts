import {
    Chapter,
    ChapterDetails,
    ContentRating,
    Manga,
    HomeSection,
    Source,
    SourceInfo,
    Request,
    Response,
    TagType,
    PagedResults,
    SearchRequest,
  } from 'paperback-extensions-common'

import { Parser } from './MangaKakalotToParser'

export const MKT_DOMAIN = 'https://mangakakalot.to'
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'

export const MangaKakalotToInfo: SourceInfo = {
    version: '0.8.0',
    name: 'MangaKakalotTo',
    description: `Extension that pulls manga from ${MKT_DOMAIN}`,
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: MKT_DOMAIN,
    sourceTags: [
        {
            text: 'Multi-Language',
            type: TagType.GREY,
        },
        {
            text: 'In Development',
            type: TagType.YELLOW
        }
    ],
}

export class MangaKakalotTo extends Source {
    requestManager = createRequestManager({
        requestsPerSecond: 3,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
    
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': userAgent,
                        'referer': `${MKT_DOMAIN}`
                    }
                }
    
                return request
            },
    
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
        })
    parser = new Parser()
    override getMangaShareUrl(mangaId: string): string {
        return `${MKT_DOMAIN}/${mangaId}`
    }
    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${MKT_DOMAIN}/${mangaId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseMangaDetails($, mangaId)
    }
    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${MKT_DOMAIN}/ajax/manga/list-chapter-volume?id=${mangaId.replace(/[a-xA-Z]|-/g,'')}`,
            method: 'GET',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
        })

        const data = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(data.data)
        return this.parser.parseChapters($, mangaId)
    }
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const numericId = await this.getNumericId(mangaId, chapterId)
        console.log(numericId)
        const request = createRequestObject({
            url: `${MKT_DOMAIN}/ajax/manga/images?id=${numericId}&type=chap`,
            method: 'GET'
        })
        console.log(request.url)
        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapterDetails($, mangaId, chapterId)
    }
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        let page = metadata?.page ?? 1
        if (page == -1) return createPagedResults({ results: [], metadata: { page: -1 } })

        const request = createRequestObject({
            url: `${MKT_DOMAIN}/search?keyword=${(query.title ?? '').replace(/ /g, '+')}&page=${page}`,
            method: 'GET',
        })

        const data = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(data.data)
        const manga = this.parser.parseSearchResults($)

        page++
        if (manga.length < 18) page = -1

        return createPagedResults({
            results: manga,
            metadata: { page: page },
        })
    }
    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const request = createRequestObject({
          url: `${MKT_DOMAIN}/home`,
          method: 'GET',
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseHomeSections($, sectionCallback)
      }
    async getNumericId(mangaId: string, chapterId:string): Promise<string> {
        const request = createRequestObject({
            url: `${MKT_DOMAIN}/read/${mangaId}/${chapterId}`,
            method: 'GET'
        })

        const data = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(data.data)
        const numericId = $('#reading').attr('data-reading-id')
        if (!numericId) {
            throw new Error(`Failed to parse the numeric ID for ${mangaId}`)
        }
        return numericId
    }
}