import {
    Chapter,
    ChapterDetails,
    ContentRating,
    Manga,
    PagedResults,
    SearchRequest,
    Source,
    SourceInfo,
    TagType
} from 'paperback-extensions-common'

import { Parser } from './ComickFunParser'

export const CFDOMAIN = 'https://api.comick.fun'

export const ComickFunInfo: SourceInfo = {
    version: '0.7.0',
    name: 'ComicFun',
    description: 'Extension that pulls manga from Comick.fun.',
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: CFDOMAIN,
    sourceTags: [
        {
            text: 'Multi-Language',
            type: TagType.GREY,
        },
    ],
}

export class ComickFun extends Source {
    requestManager = createRequestManager({
        requestsPerSecond: 3,
    })
    parser = new Parser()
    //share url

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${CFDOMAIN}/comic/${mangaId}?tachiyomi=true`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const json = (typeof response.data) === 'string' ? JSON.parse(response.data) : response.data
        return this.parser.parseMangaDetails(json, mangaId)
    }
    async getChapters(mangaId: string): Promise<Chapter[]> {
        const numericalId = await this.getNumericalId(mangaId)
        const request = createRequestObject({
            url: `${CFDOMAIN}/comic/${numericalId}/chapter?lang=en&tachiyomi=true`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const json = (typeof response.data) === 'string' ? JSON.parse(response.data) : response.data
        return this.parser.parseChapters(json, mangaId)
    }
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${CFDOMAIN}/chapter/${chapterId}?tachiyomi=true`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const json = (typeof response.data) === 'string' ? JSON.parse(response.data) : response.data
        return this.parser.parseChapterDetails(json, mangaId, chapterId)
    }
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        let page = metadata?.page ?? 1
        if (page == -1) return createPagedResults({ results: [], metadata: { page: -1 } })

        const request = createRequestObject({
            url: `${CFDOMAIN}/search?page=${page}&limit=50&tachiyomi=true&q=${(query.title ?? '').replace(/ /g, '+')}&t=false`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const json = (typeof response.data) === 'string' ? JSON.parse(response.data) : response.data
        const manga = this.parser.parseSearchResults(json)
        page++
        if (manga.length < 18) page = -1
        return createPagedResults({
            results: manga,
            metadata: { page: page },
        })
    }
    async getNumericalId(mangaId: string): Promise<string>{
        const request = createRequestObject({
            url: `${CFDOMAIN}/comic/${mangaId}?tachiyomi=true`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const json = (typeof response.data) === 'string' ? JSON.parse(response.data) : response.data
        return json.comic.id
    }
}