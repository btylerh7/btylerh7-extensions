import {
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    Manga,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    Source,
    SourceInfo,
    TagSection,
    TagType
} from 'paperback-extensions-common'
import { Parser } from './MangaLoveParser'

const ML_DOMAIN = 'https://mangalove.top'
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'

export const MangaLoveInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Manga Love',
    description: `Extension that pulls manga from ${ML_DOMAIN}`,
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: ML_DOMAIN,
    sourceTags: [
        {
            text: 'Japanese',
            type: TagType.GREY,
        },
    ],
}

export class MangaLove extends Source {
    requestManager = createRequestManager({
        requestsPerSecond: 3,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
    
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': userAgent,
                        'referer': ML_DOMAIN
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
        return `${ML_DOMAIN}/${mangaId}/`
    }
    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${ML_DOMAIN}/${mangaId}/`,
            method: 'GET',
        })
    
        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseMangaDetails($, mangaId)
    }
    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${ML_DOMAIN}/${mangaId}/`,
            method: 'GET',
        })
    
        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapters($, mangaId)
    }
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${ML_DOMAIN}/chapters/${chapterId}`,
            method: 'GET',
        })
    
        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapterDetails($, mangaId, chapterId)
    }
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let searchUrl = `${ML_DOMAIN}/?s=${encodeURI(query.title ?? '')}`
        if (!query.title) searchUrl = `${ML_DOMAIN}/category/${encodeURI(query.includedTags![0]?.id ?? '')}`
        const request = createRequestObject({
            url: searchUrl,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        const manga = this.parser.parseResultSet($)
        metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined

        return createPagedResults({
            results: manga,
            metadata
        })
    }
    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            createHomeSection({id: '/hot', title: 'ホット', view_more: true}),
            createHomeSection({id: '/top', title:'トップ', view_more: true}),
            createHomeSection({id: '/', title: '最新の更新マンガ', view_more: false})
        ]
        for (let section of sections) {
            const request = createRequestObject({
                url: `${ML_DOMAIN}${section.id}`,
                method: 'GET'
            })
    
            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)
            section.items = this.parser.parseResultSet($, section.id)
            sectionCallback(section)
        }
    }
    override async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let param = ''
        switch (homepageSectionId) {
            case '/hot':
                param = `/hot/?page=${page}`
                break
            case '/top':
                param = `/top/?page=${page}`
                break
            default:
                throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }
        const request = createRequestObject({
            url: `${ML_DOMAIN}`,
            method: 'GET',
            param
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = this.parser.parseResultSet($)
        metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
        return createPagedResults({
            results: manga,
            metadata
        })
    }
    override async getTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${ML_DOMAIN}/list/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseTags($)
    }
}