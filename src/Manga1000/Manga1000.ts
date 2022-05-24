/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/indent */
import {
    Chapter,
    ChapterDetails,
    ContentRating,
    // HomeSection,
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

import { Parser } from './parser'

export const M1000_DOMAIN = 'https://manga1000.top'
const headers = {
'content-type': 'application/x-www-form-urlencoded',
Referer: M1000_DOMAIN,
}
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'

export const Manga1000Info: SourceInfo = {
    version: '0.6.0',
    name: 'Manga 1000',
    description: 'Extension that pulls manga from Manga1000.top.',
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: M1000_DOMAIN,
    sourceTags: [
        {
            text: 'Japanese',
            type: TagType.GREY,
        },
        {
            text: 'Search does not return titles',
            type: TagType.YELLOW
        }
    ],
}




export class Manga1000 extends Source {

override getCloudflareBypassRequest() {
    return createRequestObject({
        url: `${M1000_DOMAIN}`,
        method: 'GET',
        headers
    })
    }

requestManager = createRequestManager({
    requestsPerSecond: 3,
    // requestTimeout: 5000,
    interceptor: {
        interceptRequest: async (request: Request): Promise<Request> => {

            request.headers = {
                ...(request.headers ?? {}),
                ...{
                    'user-agent': userAgent,
                    'referer': `${M1000_DOMAIN}`
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
    return `${M1000_DOMAIN}/${mangaId}`
}

async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
        url: `${M1000_DOMAIN}/${mangaId}/`,
        method: 'GET',
        headers
    })

    const response = await this.requestManager.schedule(request, 3)
    const $ = this.cheerio.load(response.data)
    return this.parser.parseMangaDetails($, mangaId)
}
async getChapters(mangaId: string): Promise<Chapter[]> {
    const request = createRequestObject({
        url: `${M1000_DOMAIN}/${mangaId}/`,
        method: 'GET',
        headers
    })

    const response = await this.requestManager.schedule(request, 3)
    const $ = this.cheerio.load(response.data)
    return this.parser.parseChapters($, mangaId)
}
async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    const request = createRequestObject({
        url: `${M1000_DOMAIN}/${mangaId}/${chapterId}/`,
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
        url: `${M1000_DOMAIN}/manga-list.html?name=${(query.title ?? '').replace(/ /g, '+')}&page=${page}`,
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
}
  