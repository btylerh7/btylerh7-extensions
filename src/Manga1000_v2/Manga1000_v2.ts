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

  export const M1000_DOMAIN = 'https://manga1000.top/'
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Referer: M1000_DOMAIN,
  }
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'


  export const Manga1000Info: SourceInfo = {
    version: '0.5.2',
    name: 'Manga 1000',
    author: 'btylerh7',
    icon: 'logo.png',
    authorWebsite: 'https://github.com/btylerh7',
    description: 'Extension that pulls manga from Manga 1000',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: M1000_DOMAIN,
    sourceTags: [
      {
        text: 'Japanese',
        type: TagType.GREY,
      },
    ],
  }



  export class Manga1000 extends Source {
 

    requestManager = createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
          interceptRequest: async (request: Request): Promise<Request> => {
    
              request.headers = {
                  ...(request.headers ?? {}),
                  ...{
                      'user-agent': userAgent,
                      'referer': `${M1000_DOMAIN}/`
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
            url: `${M1000_DOMAIN}/${mangaId}`,
            method: 'GET',
            headers
        })

        const response = await this.requestManager.schedule(request, 3)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapters($, mangaId)
    }
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${M1000_DOMAIN}/${mangaId}/${chapterId}`,
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

        const param = `/search?keyword=${(query.title ?? '').replaceAll(' ', '+')}&page=${page}`
        const request = createRequestObject({
            url: `${M1000_DOMAIN}/manga-list.html`,
            method: 'GET',
            param,
            headers
        })

        const data = await this.requestManager.schedule(request, 2)
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
  