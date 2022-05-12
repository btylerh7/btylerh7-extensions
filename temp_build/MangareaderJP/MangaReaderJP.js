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
exports.MangaReaderJPInfo = void 0;
/* eslint-disable linebreak-style */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MR_DOMAIN = 'https://mangareader.to';
exports.MangaReaderJPInfo = {
    version: '1.0',
    name: 'MangaReaderTo(JP)',
    icon: 'logo.png',
    author: 'btylerh7',
    authorWebsite: 'https://github.com/btylerh7',
    description: 'Extension that pulls manga from MangaReader Japanese Titles.',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    websiteBaseURL: MR_DOMAIN,
    sourceTags: [
        {
            text: 'Japanese',
            type: paperback_extensions_common_1.TagType.GREY,
        },
        {
            text: "Experimental",
            type: paperback_extensions_common_1.TagType.YELLOW,
        }
    ],
};
class MnagaReaderToJP extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 5,
            requestTimeout: 80000,
            //interceptor
        });
    }
    getMangaShareUrl(mangaId) {
        return `${MR_DOMAIN}/${mangaId}`;
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${MR_DOMAIN}/${mangaId}`,
                method: 'GET',
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseMangaDetails($, mangaId);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getSearchResults(query, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
