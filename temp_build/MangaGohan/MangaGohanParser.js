"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = exports.parseHomeSections = exports.parseSearchRequest = exports.parseChapterDetails = exports.parseChapters = exports.parseMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
// export class Parser {
//   parseMangaDetails($:CheerioStatic, mangaId: string): Manga {
//     const title = [$('.post-title').find('h1').first().text().split(' ')[0]!] ?? ''
//     const image = $('.summary_image').find('img').attr('data-src') ?? 'https://i.imgur.com/GYUxEX8.png'
//     const rating = Number($('.score.font-meta.total_votes').text()) ?? 0
//   }
// }
const parseMangaDetails = ($, mangaId) => {
    var _a;
    const titles = [$('.post-title').find('h1').first().text().split(' ')[0]];
    const image = $('.summary_image').find('img').attr('data-src');
    let status = paperback_extensions_common_1.MangaStatus.UNKNOWN; //All manga is listed as ongoing
    const author = $('.author-content').find('a').first().text();
    const artist = $('.artist-content').find('a').first().text();
    const rating = Number($('.score.font-meta.total_votes').text());
    const desc = $('.description-summary').find('p').first().text().trim();
    let hentai = false;
    const tags = [];
    const data = $('.genres-content').find('a');
    for (const link of data.toArray()) {
        const id = decodeURI($(link).attr('href').split('com/')[1]);
        const label = $(link).text().trim();
        if (!id || !label)
            continue;
        if (!((_a = decodeURI($(link).attr('href').split('com/')[1])) === null || _a === void 0 ? void 0 : _a.startsWith('manga-genre')))
            continue;
        if (label === 'manga-genre/hentai/')
            hentai = true;
        tags.push({ id: id, label: label });
    }
    const tagSection = [
        createTagSection({
            id: '0',
            label: 'genres',
            tags: tags.map((tag) => createTag(tag)),
        }),
    ];
    console.log('Get Manga Function: title:', titles, 'image', image, 'mangaId', mangaId);
    return createManga({
        id: mangaId,
        titles: titles,
        image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
        rating: rating !== null && rating !== void 0 ? rating : 0,
        status: status,
        author: author,
        artist: artist,
        tags: tagSection,
        desc: desc !== null && desc !== void 0 ? desc : '',
        hentai
    });
};
exports.parseMangaDetails = parseMangaDetails;
const parseChapters = ($, mangaId) => {
    const chapters = [];
    const chapterLinks = $('.page-content-listing.single-page').find('li');
    for (let href of chapterLinks.toArray()) {
        const id = $('a', href).text().trim();
        const chapNum = $('a', href).text().replace(/第|話/g, '');
        chapters.push(createChapter({
            id,
            mangaId,
            chapNum: Number(chapNum),
            langCode: paperback_extensions_common_1.LanguageCode.JAPANESE,
        }));
    }
    return chapters;
};
exports.parseChapters = parseChapters;
const parseChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    const links = $('.reading-content').find('img');
    for (const img of links.toArray()) {
        let page = img.attribs['data-src'] ? img.attribs['data-src'].trim() : img.attribs.src;
        pages.push(page);
    }
    return createChapterDetails({
        id: chapterId,
        mangaId,
        pages,
        longStrip: false,
    });
};
exports.parseChapterDetails = parseChapterDetails;
const parseSearchRequest = ($, type) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const tiles = [];
    let results;
    //If serch is a title
    if (type === 'title') {
        results = $('.tab-content-wrap').find('.row.c-tabs-item__content');
        for (let result of results.toArray()) {
            // const id = article.attribs.class[0].split('-')[1]
            const mangaId = (_b = (_a = $(result).find('.h4').find('a').first().attr('href')) === null || _a === void 0 ? void 0 : _a.split('manga/')[1]) !== null && _b !== void 0 ? _b : '';
            const image = (_d = (_c = $(result).find('img')) === null || _c === void 0 ? void 0 : _c.first().attr('data-src')) !== null && _d !== void 0 ? _d : '';
            const title = (_e = $(result).find('.h4').first().text().split(' ')[0]) !== null && _e !== void 0 ? _e : '';
            tiles.push(createMangaTile({
                id: mangaId,
                image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title,
                }),
            }));
        }
    }
    // If there is a genre search
    if (type === 'tag') {
        results = $('.tab-content-wrap').find('.page-item-detail.manga');
        for (let result of results.toArray()) {
            const mangaId = (_g = (_f = $('h3.h5', result).find('a').first().attr('href')) === null || _f === void 0 ? void 0 : _f.split('manga/')[1]) !== null && _g !== void 0 ? _g : '';
            const image = (_h = $(result).find('img').first().attr('data-src')) !== null && _h !== void 0 ? _h : '';
            const title = (_j = $('h3.h5', result).find('a').first().text().trim()) !== null && _j !== void 0 ? _j : '';
            if (!mangaId || !title)
                continue;
            tiles.push(createMangaTile({
                id: mangaId,
                image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title,
                }),
            }));
        }
    }
    return tiles;
};
exports.parseSearchRequest = parseSearchRequest;
const parseHomeSections = ($, sectionCallback) => {
    var _a;
    const featuredSection = createHomeSection({
        id: '0',
        title: 'Featured',
        type: paperback_extensions_common_1.HomeSectionType.featured,
        view_more: false,
    });
    const topSection = createHomeSection({
        id: '1',
        title: 'Top Manga',
        type: paperback_extensions_common_1.HomeSectionType.singleRowNormal,
        view_more: false,
    });
    const recentlyUpdatedSection = createHomeSection({
        id: '2',
        title: 'Reccently Updated',
        type: paperback_extensions_common_1.HomeSectionType.singleRowNormal,
        view_more: false,
    });
    const featured = [];
    const top = [];
    const recentlyUpdated = [];
    //Retrieve Featured Manga Section
    for (let featuredManga of $('.c-sidebar.c-top-sidebar').find('.slider__item').toArray()) {
        const mangaId = $(featuredManga).find('a').first().attr('href').split('/manga/')[1];
        const title = $(featuredManga).find('a').first().text().trim();
        const image = $(featuredManga).find('img').first().attr('data-src');
        featured.push(createMangaTile({
            id: mangaId,
            image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({
                text: title,
            }),
        }));
    }
    sectionCallback(featuredSection);
    featuredSection.items = featured;
    for (let topManga of $('.main-sticky-mangas.main-col-inner.c-page')
        .find('.page-item-detail.manga')
        .toArray()) {
        const mangaId = $(topManga).find('a').first().attr('href').split('/manga/')[1];
        const title = $(topManga).find('h3 > a').first().text().split(' ')[0];
        const image = (_a = $(topManga).find('img').first().attr('data-src')) !== null && _a !== void 0 ? _a : $(topManga).find('img').first().attr('src');
        top.push(createMangaTile({
            id: mangaId,
            image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({
                text: title,
            }),
        }));
    }
    sectionCallback(topSection);
    topSection.items = top;
    for (let recentlyUpdatedManga of $('.main-col-inner.c-page')
        .next()
        .find('.page-item-detail.manga')
        .toArray()) {
        const mangaId = $(recentlyUpdatedManga).find('a').first().attr('href').split('/manga/')[1];
        const title = $(recentlyUpdatedManga).find('h3 > a').first().text().split(' ')[0];
        const image = $(recentlyUpdatedManga).find('img').first().attr('data-src');
        recentlyUpdated.push(createMangaTile({
            id: mangaId,
            image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({
                text: title,
            }),
        }));
    }
    recentlyUpdatedSection.items = recentlyUpdated;
    sectionCallback(recentlyUpdatedSection);
};
exports.parseHomeSections = parseHomeSections;
const parseTags = ($) => {
    var _a;
    const tags = [];
    const data = $('.sub-menu').find('a');
    for (const link of data.toArray()) {
        const id = decodeURI($(link).attr('href').split('com/')[1]);
        const label = $(link).text().trim();
        if (!id || !label)
            continue;
        if (!((_a = decodeURI($(link).attr('href').split('com/')[1])) === null || _a === void 0 ? void 0 : _a.startsWith('manga-genre')))
            continue;
        tags.push({ id: id, label: label });
    }
    const tagSection = [
        createTagSection({
            id: '0',
            label: 'genres',
            tags: tags.map((tag) => createTag(tag)),
        }),
    ];
    return tagSection;
};
exports.parseTags = parseTags;
