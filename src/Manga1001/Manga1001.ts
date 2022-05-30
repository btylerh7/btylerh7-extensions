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
    // TagSection,
  } from 'paperback-extensions-common'

import { Parser } from './Parser'

export const M1001_DOMAIN = 'https://manga1001.top'
const headers = {
'content-type': 'application/x-www-form-urlencoded',
Referer: M1001_DOMAIN,
}
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'

export const Manga1001Info: SourceInfo = {
    version: '1.1.0',
    name: 'Manga 1001',
    description: 'Extension that pulls manga from Manga1001.top. This is a different site than Manga1000.',
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: M1001_DOMAIN,
    sourceTags: [
        {
            text: 'Japanese',
            type: TagType.GREY,
        },
        {
            text: 'In Development',
            type: TagType.YELLOW
        }
    ],
}




export class Manga1001 extends Source {


    requestManager = createRequestManager({
        requestsPerSecond: 3,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {

                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': userAgent,
                        'referer': `${M1001_DOMAIN}`
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
        return `${M1001_DOMAIN}/${mangaId}`
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: encodeURI(`${M1001_DOMAIN}/${mangaId}-raw-–-free/?asgtbndr=1`),
            method: 'GET',
            headers
        })

        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseMangaDetails($, mangaId)
    }
    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: encodeURI(`${M1001_DOMAIN}/${mangaId}-raw-–-free/?asgtbndr=1`),
            method: 'GET',
            headers
        })

        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapters($, mangaId)
    }
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: encodeURI(`${M1001_DOMAIN}/${mangaId}-–-raw-${chapterId}/?asgtbndr=1`),
            method: 'GET',
            headers
        })

        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapterDetails($, mangaId, chapterId)
        
    }
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> { //make changes TODO
        let page = metadata?.page ?? 1
        if (page == -1) return createPagedResults({ results: [], metadata: { page: -1 } })

        const request = createRequestObject({
            url: `${M1001_DOMAIN}/?s=${encodeURI((query.title ?? '')).replace(/ /g, '+')}`, //&page=${page}
            method: 'GET',
            headers
        })

        const data = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(data.data)
        const manga = await this.parser.parseSearchResults($)

        page++
        if (manga.length < 18) page = -1

        return createPagedResults({
            results: manga,
            metadata: { page: page },
        })
    }
    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        for (const section of ['top', 'recently updated']){
            const url = section == 'top' ? `${M1001_DOMAIN}/?asgtbndr=1` : `${M1001_DOMAIN}/newmanga/?asgtbndr=1`
            const request = createRequestObject({
            url,
            method: 'GET',
            headers,
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)
            this.parser.parseHomeSections($, section, sectionCallback)
        }
        return
    }
}
  