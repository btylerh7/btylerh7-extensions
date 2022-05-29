import cheerio from 'cheerio'
import { APIWrapper, SearchRequest, Source } from 'paperback-extensions-common'
import { Manga1001 } from '../Manga1001/Manga1001'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

describe('Manga1000 Tests', () => {
  const wrapper: APIWrapper = new APIWrapper()
  const source: Source = new Manga1001(cheerio)
  const expect = chai.expect
  chai.use(chaiAsPromised)

  /**
   * The Manga ID which this unit test uses to base it's details off of.
   * Try to choose a manga which is updated frequently, so that the historical checking test can
   * return proper results, as it is limited to searching 30 days back due to extremely long processing times otherwise.
   */
  const mangaId = '進撃の巨人' // Attack on Titan = 1489

  it('Retrieve Manga Details', async () => {
    const details = await wrapper.getMangaDetails(source, mangaId)
    expect(details, 'No results found with test-defined ID [' + mangaId + ']').to.exist

    // Validate that the fields are filled
    const data = details
    // console.log('manga details:', data)
    expect(data.image, 'Missing Image').to.be.not.empty
    expect(data.status, 'Missing Status').to.exist
    // expect(data.desc, 'Missing Description').to.be.not.empty
    expect(data.titles, 'Missing Titles').to.be.not.empty
    // console.log(data.tags)
  })

  it('Get Chapters', async () => {
    const data = await wrapper.getChapters(source, mangaId)
    // console.log("chapter details for",`${mangaId}: `, data)

    expect(data, 'No chapters present for: [' + mangaId + ']').to.not.be.empty

    const entry = data[0]
    expect(entry?.id, 'No ID present').to.not.be.empty
    // expect(entry?.name, 'No title available').to.not.be.empty
    expect(entry?.chapNum, 'No chapter number present').to.not.be.null
  })

  it('Get Chapter Details', async () => {
    const chapters = await wrapper.getChapters(source, mangaId)
    // console.log(`https://manga1001.top/${mangaId}-–-raw-${chapters[0]?.id}/`)
    // 'https://manga1001.top/カノジョも彼女-–-raw-【第92話】/'

    // 'https://manga1001.top/カノジョも彼女-–-raw-【第92話】/'
 
    
    const data = await wrapper.getChapterDetails(source, mangaId, chapters[0]?.id ?? 'unknown')
    // console.log(data)
    expect(data, 'No server response').to.exist
    expect(data, 'Empty server response').to.not.be.empty

    expect(data.id, 'Missing ID').to.be.not.empty
    expect(data.mangaId, 'Missing MangaID').to.be.not.empty
    expect(data.pages, 'No pages present').to.be.not.empty
  })

  it('Testing search', async () => {
    const testSearch: SearchRequest = {
      title: 'hunter',
      parameters: {
        // includedTags: ['sf・ファンタジー'],
      },
    }

    const search = await wrapper.searchRequest(source, testSearch, 1)
    const result = search.results[0]
    // console.log(search.results[7])

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
    console.log('top:', homePages![0]!.items)
    console.log('latest:', homePages![1]!.items)
  })
  // it('Get tags', async () => {
  //   const tags = await wrapper.getTags(source)
  //   const taglist = tags![0]?.tags!
  //   console.log(taglist)
  //   expect(tags, 'No server response').to.exist
  //   expect(tags, 'Empty server response').to.not.be.empty
  // })
  // it('Testing Notifications', async () => {
  //   const updates = await wrapper.filterUpdatedManga(
  //     source,
  //     new Date('2021-10-17'),
  //     [mangaId]
  //   )
  //   expect(updates, 'No server response').to.exist
  //   expect(updates, 'Empty server response').to.not.be.empty
  //   expect(updates[0], 'No updates').to.not.be.empty
//   })
})
