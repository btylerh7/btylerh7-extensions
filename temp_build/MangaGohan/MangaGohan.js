"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaGohan = exports.MangaGohanInfo = exports.MG_DOMAIN = void 0;
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/indent */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MangaGohanParser_1 = require("./MangaGohanParser");
exports.MG_DOMAIN = 'https://mangagohan.me';
const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Referer: exports.MG_DOMAIN,
};
const method = 'GET';
exports.MangaGohanInfo = {
    version: '0.5.1',
    name: 'Manga Gohan',
    icon: 'logo.png',
    author: 'btylerh7',
    authorWebsite: 'https://github.com/btylerh7',
    description: 'Extension that pulls manga from Manga Gohan',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    websiteBaseURL: exports.MG_DOMAIN,
    sourceTags: [
        {
            text: 'Japanese',
            type: paperback_extensions_common_1.TagType.GREY,
        },
    ],
};
class MangaGohan extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.cookies = [
            createCookie({
                name: 'isAdult',
                value: '1',
                domain: exports.MG_DOMAIN,
            }),
        ];
        this.requestManager = createRequestManager({
            requestsPerSecond: 4,
            requestTimeout: 15000,
        });
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${exports.MG_DOMAIN}`,
            method,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${exports.MG_DOMAIN}/manga/${mangaId}`;
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: encodeURI(`${exports.MG_DOMAIN}/manga/${mangaId}`),
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            return (0, MangaGohanParser_1.parseMangaDetails)($, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${exports.MG_DOMAIN}/manga/${mangaId}`,
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            return (0, MangaGohanParser_1.parseChapters)($, mangaId);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: encodeURI(`${exports.MG_DOMAIN}/manga/${mangaId}/${chapterId}`),
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            return (0, MangaGohanParser_1.parseChapterDetails)($, mangaId, chapterId);
        });
    }
    getSearchResults(query, metadata) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            let type = 'title';
            let request;
            if (query.title) {
                request = createRequestObject({
                    url: exports.MG_DOMAIN,
                    param: `/?s=${encodeURI(query.title)}&post_type=wp-manga&post_type=wp-manga`,
                    method,
                    headers,
                });
            }
            else {
                if (query.includedTags)
                    type = 'tag';
                request = createRequestObject({
                    url: `${exports.MG_DOMAIN}/${encodeURI((_b = query.includedTags) === null || _b === void 0 ? void 0 : _b.map((x) => x.id)[0])}`,
                    method,
                    headers,
                });
            }
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            const manga = (0, MangaGohanParser_1.parseSearchRequest)($, type);
            metadata = manga.length > 0 ? { page: page + 1 } : undefined;
            // metadata = page
            return createPagedResults({
                results: manga,
                metadata
            });
        });
    }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: exports.MG_DOMAIN,
                method,
                headers,
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            (0, MangaGohanParser_1.parseHomeSections)($, sectionCallback);
        });
    }
    getSearchTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: exports.MG_DOMAIN,
                method,
                headers,
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return (0, MangaGohanParser_1.parseTags)($);
        });
    }
}
exports.MangaGohan = MangaGohan;
