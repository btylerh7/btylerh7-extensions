/* eslint-disable linebreak-style */
import {
  SourceInfo,
  ContentRating,
  TagType,
  Source,
  Manga,
  ChapterDetails,
  Chapter,
  PagedResults,
  SearchRequest
} from 'paperback-extensions-common'
  
const MR_DOMAIN = 'https://mangareader.to'

export const MangaReaderJPInfo: SourceInfo = {
  version: '1.0',
  name: 'MangaReaderTo(JP)',
  icon: 'logo.png',
  author: 'btylerh7',
  authorWebsite: 'https://github.com/btylerh7',
  description: 'Extension that pulls manga from MangaReader Japanese Titles.',
  contentRating: ContentRating.EVERYONE,
  websiteBaseURL: MR_DOMAIN,
  sourceTags: [
    {
      text: 'Japanese',
      type: TagType.GREY,
    },
    {
      text: "Experimental",
      type: TagType.YELLOW,
    }
  ],
}

class MnagaReaderToJP extends Source {
  requestManager= createRequestManager({
    requestsPerSecond: 5,
    requestTimeout: 80000,
    //interceptor
  })

  override getMangaShareUrl(mangaId: string): string {
    return `${MR_DOMAIN}/${mangaId}`
}

  async getMangaDetails(mangaId: string): Promise<Manga> {
    const request = createRequestObject({
      url: `${MR_DOMAIN}/${mangaId}`,
      method: 'GET',
    })
    const response = await this.requestManager.schedule(request, 3)
    const $ = this.cheerio.load(response.data)
    return this.parser.parseMangaDetails($, mangaId)
  }

  async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
    
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    
  }

  async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
    
  }
}
  

  