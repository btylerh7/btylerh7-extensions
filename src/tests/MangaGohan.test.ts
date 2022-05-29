import cheerio from 'cheerio'
import { APIWrapper, SearchRequest, Source } from 'paperback-extensions-common' //Add SearchRequest
import { MangaGohan } from '../MangaGohan/MangaGohan'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

describe('MangaGohan Tests', () => {
  const wrapper: APIWrapper = new APIWrapper()
  const source: Source = new MangaGohan(cheerio)
  const expect = chai.expect
  chai.use(chaiAsPromised)

  /**
   * The Manga ID which this unit test uses to base it's details off of.
   * Try to choose a manga which is updated frequently, so that the historical checking test can
   * return proper results, as it is limited to searching 30 days back due to extremely long processing times otherwise.
   */
  const mangaId = 'cxahcc-彼女、お借りします' // Rent-a-Girlfriend

  it('Retrieve Manga Details', async () => {
    const details = await wrapper.getMangaDetails(source, mangaId)
    expect(details, 'No results found with test-defined ID [' + mangaId + ']').to.exist

    // Validate that the fields are filled
    const data = details
    console.log("manga details:",data)
    expect(data.image, 'Missing Image').to.be.not.empty
    expect(data.status, 'Missing Status').to.exist
    expect(data.desc, 'Missing Description').to.be.not.empty
    expect(data.titles, 'Missing Titles').to.be.not.empty
    // console.log(data.tags)
  })

  it('Get Chapters', async () => {
    const data = await wrapper.getChapters(source, mangaId)

    expect(data, 'No chapters present for: [' + mangaId + ']').to.not.be.empty

    const entry = data[0]
    // console.log(entry)
    expect(entry?.id, 'No ID present').to.not.be.empty
    // expect(entry?.name, 'No title available').to.not.be.empty
    expect(entry?.chapNum, 'No chapter number present').to.not.be.null
  })

  it('Get Chapter Details', async () => {
    const chapters = await wrapper.getChapters(source, mangaId)
    // const chapter = chapters[0]
    // console.log(chapter)

    const data = await wrapper.getChapterDetails(source, mangaId, chapters[0]?.id ?? 'unknown')
    // console.log("chapter data:", data)
    expect(data, 'No server response').to.exist
    expect(data, 'Empty server response').to.not.be.empty

    expect(data.id, 'Missing ID').to.be.not.empty
    expect(data.mangaId, 'Missing MangaID').to.be.not.empty
    expect(data.pages, 'No pages present').to.be.not.empty
  })

  it('Testing search', async () => {
    const testSearch: SearchRequest = {
      title: 'kanojo',
      parameters: {
        // includedTags: ['sf・ファンタジー'],
        includedTags:[]
      },
    }

    const search = await wrapper.searchRequest(source, testSearch, 1)
    const result = search.results[0]
    // console.log(search.results[0])

    expect(result, 'No response from server').to.exist

    expect(result?.id, 'No ID found for search query').to.be.not.empty
    expect(result?.image, 'No image found for search').to.be.not.empty
    expect(result?.title, 'No title').to.be.not.null
    expect(result?.subtitleText, 'No subtitle text').to.be.not.null
  })

  it('Testing Home-Page aquisition', async () => {
    const homePages = await wrapper.getHomePageSections(source)
    expect(homePages, 'No response from server').to.exist
    expect(homePages[0]?.items, 'No items present').to.exist
    // console.log('featured:', homePages![0]!.items![0])
    console.log('top:', homePages![1]!.items![0])
    // console.log('recently updated:', homePages![2]!.items![0])
  })
  it('Get tags', async () => {
    const tags = await wrapper.getTags(source)
    const taglist = tags![0]?.tags!
    console.log(taglist)
    expect(tags, 'No server response').to.exist
    expect(tags, 'Empty server response').to.not.be.empty
  })

  // it('Testing Notifications', async () => {
  //   const updates = await wrapper.filterUpdatedManga(
  //     source,
  //     new Date('2021-10-17'),
  //     [mangaId]
  //   )
  //   expect(updates, 'No server response').to.exist
  //   expect(updates, 'Empty server response').to.not.be.empty
  //   expect(updates[0], 'No updates').to.not.be.empty
  // })
})
