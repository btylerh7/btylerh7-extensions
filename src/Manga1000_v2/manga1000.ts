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
    // Request,
    // Response,
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
  export const MangaGohanInfo: SourceInfo = {
    version: '0.5.1',
    name: 'Manga 1000',
    icon: 'logo.png',
    author: 'btylerh7',
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
        requestsPerSecond: 5,
        requestTimeout: 80000,
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
  