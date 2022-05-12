"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = exports.parseHomeSections = exports.parseSearchRequest = exports.parseChapterDetails = exports.parseChapters = exports.parseMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const parseMangaDetails = ($, mangaId) => {
    const titles = [mangaId.split(' ')[0]];
    const image = $('.aligncenter').find('img').attr('src');
    const status = paperback_extensions_common_1.MangaStatus.ONGOING; //Manga1000 does not provide this info
    const author = $('.entry-content').find('p').text().split(' ')[1];
    const tags = [];
    const data = $('select').find('option');
    for (const option of data.toArray()) {
        const id = decodeURI($(option).attr('value'));
        const label = $(option).text();
        // if (!id || !label) continue
        tags.push({ id: id, label: label });
    }
    tags.shift();
    const tagSection = [
        createTagSection({
            id: '0',
            label: 'genres',
            tags: tags.map((tag) => createTag(tag)),
        }),
    ];
    return createManga({
        id: mangaId,
        titles: titles,
        image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
        rating: 0,
        status: status,
        author: author,
        tags: tagSection,
        // desc,
        // hentai
    });
};
exports.parseMangaDetails = parseMangaDetails;
const parseChapters = ($, mangaId) => {
    var _a;
    const chapters = [];
    const chapterLinks = $('td').find('a');
    for (let href of chapterLinks.toArray()) {
        const id = decodeURI(href.attribs.href); //Decode link to chapter
        const chapNum = Number((_a = href.children[0].data.match('【(.*?)】')) === null || _a === void 0 ? void 0 : _a[1].replace(/第|話/g, ''));
        chapters.push(createChapter({
            id,
            mangaId,
            chapNum,
            langCode: paperback_extensions_common_1.LanguageCode.JAPANESE,
        }));
    }
    return chapters;
};
exports.parseChapters = parseChapters;
const parseChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    const links = $('.wp-block-image').find('img');
    for (const img of links.toArray()) {
        let page = img.attribs['data-src'] ? img.attribs['data-src'] : img.attribs.src;
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
const parseSearchRequest = ($) => {
    var _a, _b;
    const tiles = [];
    const results = $('.inner-wrapper').find('article');
    for (let article of results.toArray()) {
        // const id = article.attribs.class[0].split('-')[1]
        const mangaId = decodeURI($('.featured-thumb', article).find('a').attr('href'));
        const image = (_b = (_a = $(article).find('img')) === null || _a === void 0 ? void 0 : _a.first().attr('src')) !== null && _b !== void 0 ? _b : '';
        const title = $(article).find('.entry-title > a').text();
        tiles.push(createMangaTile({
            id: mangaId,
            image: image,
            title: createIconText({
                text: title,
            }),
        }));
    }
    return tiles;
};
exports.parseSearchRequest = parseSearchRequest;
const parseHomeSections = ($) => {
    var _a, _b;
    const manga = [];
    const results = $('center').find('article');
    for (let article of results.toArray()) {
        // const id = article.attribs.class[0].split('-')[1]
        const mangaId = decodeURI($('.featured-thumb', article).find('a').attr('href')).split('/')[1];
        const image = (_b = (_a = $(article).find('img')) === null || _a === void 0 ? void 0 : _a.first().attr('src')) !== null && _b !== void 0 ? _b : '';
        const title = $(article).find('.entry-title > a').text();
        manga.push(createMangaTile({
            id: mangaId,
            image: image,
            title: createIconText({
                text: title,
            }),
        }));
    }
    return manga;
};
exports.parseHomeSections = parseHomeSections;
const parseTags = ($) => {
    const tags = [];
    const data = $('select').find('option');
    for (const option of data.toArray()) {
        const id = decodeURI($(option).attr('value'));
        const label = $(option).text();
        // if (!id || !label) continue
        tags.push({ id: id, label: label });
    }
    tags.shift();
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
