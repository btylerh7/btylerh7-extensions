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
exports.Manga1000 = exports.Manga1000Info = exports.M1000_DOMAIN = void 0;
/* eslint-disable linebreak-style */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const Manga1000Parser_1 = require("./Manga1000Parser");
exports.M1000_DOMAIN = 'https://mangapro.top';
const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Referer: `${exports.M1000_DOMAIN}`,
};
const method = 'GET';
exports.Manga1000Info = {
    version: '1.0',
    name: 'Manga1000',
    icon: 'logo.png',
    author: 'btylerh7',
    authorWebsite: 'https://github.com/btylerh7',
    description: 'Extension that pulls manga from Manga1000',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    websiteBaseURL: exports.M1000_DOMAIN,
    sourceTags: [
        {
            text: 'Japanese',
            type: paperback_extensions_common_1.TagType.GREY,
        },
    ],
};
class Manga1000 extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.cookies = [
            createCookie({
                name: 'isAdult',
                value: '1',
                domain: `https://manga1000.top`,
            }),
        ];
        this.requestManager = createRequestManager({
            requestsPerSecond: 4,
            requestTimeout: 15000,
        });
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${exports.M1000_DOMAIN}`,
            method,
        });
    }
    getMangaShareUrl(mangaId) {
        return `${exports.M1000_DOMAIN}/${mangaId}/`;
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: encodeURI(`${exports.M1000_DOMAIN}/${mangaId}`),
                method,
                headers,
                cookies: this.cookies,
            });
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            return (0, Manga1000Parser_1.parseMangaDetails)($, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: encodeURI(`${exports.M1000_DOMAIN}/${mangaId}`),
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            return (0, Manga1000Parser_1.parseChapters)($, mangaId);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: encodeURI(`${exports.M1000_DOMAIN}/${chapterId}`),
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            return (0, Manga1000Parser_1.parseChapterDetails)($, mangaId, chapterId);
        });
    }
    getSearchResults(query, metadata) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            let request;
            if (query.includedTags) {
                request = createRequestObject({
                    url: encodeURI(`${exports.M1000_DOMAIN}${(_b = query.includedTags) === null || _b === void 0 ? void 0 : _b.map((x) => x.id)[0]}`),
                    method,
                    headers,
                });
            }
            else {
                request = createRequestObject({
                    url: encodeURI(`${exports.M1000_DOMAIN}/?s=${query.title}`),
                    method,
                    headers,
                });
            }
            const data = yield this.requestManager.schedule(request, 1);
            let $ = this.cheerio.load(data.data);
            const manga = (0, Manga1000Parser_1.parseSearchRequest)($);
            metadata = manga.length > 0 ? { page: page + 1 } : undefined;
            return createPagedResults({
                results: manga,
                metadata,
            });
        });
    }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = [
                {
                    request: createRequestObject({
                        url: exports.M1000_DOMAIN,
                        method,
                        cookies: this.cookies,
                    }),
                    section: createHomeSection({
                        id: 'latest',
                        title: 'Latest Manga',
                        view_more: false,
                    }),
                },
                {
                    request: createRequestObject({
                        url: `${exports.M1000_DOMAIN}/seachlist`,
                        method,
                        cookies: this.cookies,
                    }),
                    section: createHomeSection({
                        id: 'top',
                        title: 'Top Manga',
                        view_more: false,
                    }),
                },
            ];
            // const promises: Promise<void>[] = []
            for (const section of sections) {
                // Load empty sections
                sectionCallback(section.section);
            }
            for (const section of sections) {
                // Populate data in sections
                let response = yield this.requestManager.schedule(section.request, 1);
                let $ = this.cheerio.load(response.data);
                // this.cloudflareError(response.status);
                section.section.items = (0, Manga1000Parser_1.parseHomeSections)($);
                sectionCallback(section.section);
            }
            // Make sure the function completes
            // await Promise.all(promises)
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: exports.M1000_DOMAIN,
                method,
                headers,
                cookies: this.cookies,
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return (0, Manga1000Parser_1.parseTags)($);
        });
    }
    globalRequestHeaders() {
        return {
            referer: `${exports.M1000_DOMAIN}/`,
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        };
    }
}
exports.Manga1000 = Manga1000;
