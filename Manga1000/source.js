(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
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
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    getTags() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            return (_a = this.getSearchTags) === null || _a === void 0 ? void 0 : _a.call(this);
        });
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    var _a;
    let time;
    let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
class Tracker {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Tracker = Tracker;

},{}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./Tracker"), exports);

},{"./Source":2,"./Tracker":3}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./APIWrapper"), exports);

},{"./APIWrapper":1,"./base":4,"./models":47}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],7:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],8:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],9:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],10:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],11:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],12:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],13:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],14:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],15:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],16:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],17:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],18:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],19:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],20:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],21:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],22:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],23:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],24:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Button"), exports);
__exportStar(require("./Form"), exports);
__exportStar(require("./Header"), exports);
__exportStar(require("./InputField"), exports);
__exportStar(require("./Label"), exports);
__exportStar(require("./Link"), exports);
__exportStar(require("./MultilineLabel"), exports);
__exportStar(require("./NavigationButton"), exports);
__exportStar(require("./OAuthButton"), exports);
__exportStar(require("./Section"), exports);
__exportStar(require("./Select"), exports);
__exportStar(require("./Switch"), exports);
__exportStar(require("./WebViewButton"), exports);
__exportStar(require("./FormRow"), exports);
__exportStar(require("./Stepper"), exports);

},{"./Button":9,"./Form":10,"./FormRow":11,"./Header":12,"./InputField":13,"./Label":14,"./Link":15,"./MultilineLabel":16,"./NavigationButton":17,"./OAuthButton":18,"./Section":19,"./Select":20,"./Stepper":21,"./Switch":22,"./WebViewButton":23}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
    MangaStatus[MangaStatus["UNKNOWN"] = 2] = "UNKNOWN";
    MangaStatus[MangaStatus["ABANDONED"] = 3] = "ABANDONED";
    MangaStatus[MangaStatus["HIATUS"] = 4] = "HIATUS";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],28:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],29:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],30:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],31:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],32:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],33:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],34:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],35:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],36:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],37:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOperator = void 0;
var SearchOperator;
(function (SearchOperator) {
    SearchOperator["AND"] = "AND";
    SearchOperator["OR"] = "OR";
})(SearchOperator = exports.SearchOperator || (exports.SearchOperator = {}));

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = void 0;
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],40:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],41:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],43:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],44:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],45:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],46:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],47:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./SourceStateManager"), exports);
__exportStar(require("./RequestInterceptor"), exports);
__exportStar(require("./DynamicUI"), exports);
__exportStar(require("./TrackedManga"), exports);
__exportStar(require("./SourceManga"), exports);
__exportStar(require("./TrackedMangaChapterReadAction"), exports);
__exportStar(require("./TrackerActionQueue"), exports);
__exportStar(require("./SearchField"), exports);
__exportStar(require("./RawData"), exports);

},{"./Chapter":6,"./ChapterDetails":7,"./Constants":8,"./DynamicUI":24,"./HomeSection":25,"./Languages":26,"./Manga":27,"./MangaTile":28,"./MangaUpdate":29,"./PagedResults":30,"./RawData":31,"./RequestHeaders":32,"./RequestInterceptor":33,"./RequestManager":34,"./RequestObject":35,"./ResponseObject":36,"./SearchField":37,"./SearchRequest":38,"./SourceInfo":39,"./SourceManga":40,"./SourceStateManager":41,"./SourceTag":42,"./TagSection":43,"./TrackedManga":44,"./TrackedMangaChapterReadAction":45,"./TrackerActionQueue":46}],48:[function(require,module,exports){
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
/* eslint-disable @typescript-eslint/indent */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const parser_1 = require("./parser");
exports.M1000_DOMAIN = 'https://manga1000.top';
const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Referer: exports.M1000_DOMAIN,
};
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1';
exports.Manga1000Info = {
    version: '0.7.0',
    name: 'Manga 1000',
    description: 'Extension that pulls manga from Manga1000.top.',
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    websiteBaseURL: exports.M1000_DOMAIN,
    sourceTags: [
        {
            text: 'Japanese',
            type: paperback_extensions_common_1.TagType.GREY,
        },
        {
            text: 'Search does not return titles',
            type: paperback_extensions_common_1.TagType.YELLOW
        }
    ],
};
class Manga1000 extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.requestManager = createRequestManager({
            requestsPerSecond: 3,
            interceptor: {
                interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    request.headers = Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), {
                        'user-agent': userAgent,
                        'referer': `${exports.M1000_DOMAIN}`
                    });
                    return request;
                }),
                interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () {
                    return response;
                })
            }
        });
        this.parser = new parser_1.Parser();
    }
    getMangaShareUrl(mangaId) {
        return `${exports.M1000_DOMAIN}/${mangaId}`;
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${exports.M1000_DOMAIN}/${mangaId}/`,
                method: 'GET',
                headers
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseMangaDetails($, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${exports.M1000_DOMAIN}/${mangaId}/`,
                method: 'GET',
                headers
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseChapters($, mangaId);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${exports.M1000_DOMAIN}/${mangaId}/${chapterId}/`,
                method: 'GET',
                headers
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseChapterDetails($, mangaId, chapterId);
        });
    }
    getSearchResults(query, metadata) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            if (page == -1)
                return createPagedResults({ results: [], metadata: { page: -1 } });
            const request = createRequestObject({
                url: `${exports.M1000_DOMAIN}/manga-list.html?name=${((_b = query.title) !== null && _b !== void 0 ? _b : '').replace(/ /g, '+')}&page=${page}`,
                method: 'GET',
                headers
            });
            const data = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(data.data);
            const manga = yield this.parser.parseSearchResults($);
            page++;
            if (manga.length < 18)
                page = -1;
            return createPagedResults({
                results: manga,
                metadata: { page: page },
            });
        });
    }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: exports.M1000_DOMAIN,
                method: 'GET',
                headers,
            });
            const response = yield this.requestManager.schedule(request, 1);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseHomeSections($, sectionCallback);
        });
    }
}
exports.Manga1000 = Manga1000;

},{"./parser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
class Parser {
    parseMangaDetails($, mangaId) {
        const titles = [];
        const title = $('.manga-info h3').first().text();
        titles.push(title);
        let desc = $('.summary-content').find('p').text();
        if (desc == '') {
            desc = $('.summary-content').find('p').next().text();
        }
        const image = $('.thumbnail').attr('src');
        const rating = 0;
        const status = paperback_extensions_common_1.MangaStatus.ONGOING;
        const author = this.parseAuthor($);
        return createManga({
            id: mangaId,
            titles: titles,
            image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
            rating,
            author,
            status,
            desc
        });
    }
    parseAuthor($) {
        var _a;
        let author = '';
        const detailSet = $('.manga-info').find('li');
        for (const detail of detailSet.toArray()) {
            const detailText = (_a = detail.attribs.text) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (!detailText)
                continue;
            if (detailText.includes('author')) {
                return author = $('a', detail).text();
            }
        }
        return author;
    }
    parseChapters($, mangaId) {
        var _a, _b, _c;
        const chapters = [];
        // const chapterList = $('.card-body.bg-light').find('a')
        // console.log(chapterList[0]?.attribs['title'])
        // console.log(chapterList[0])
        for (const chapter of $('.list-chapters.at-series').find('a').toArray()) {
            const id = (_b = (_a = chapter.attribs['href']) === null || _a === void 0 ? void 0 : _a.split(`${mangaId}/`)[1]) === null || _b === void 0 ? void 0 : _b.replace('/', '').trim();
            const chapNum = (_c = chapter.attribs['title']) === null || _c === void 0 ? void 0 : _c.replace('Chapter ', '').trim();
            if (id == undefined)
                continue;
            // if(id.includes('manga')) continue
            chapters.push(createChapter({
                id,
                mangaId,
                chapNum: Number(chapNum),
                langCode: paperback_extensions_common_1.LanguageCode.JAPANESE
            }));
        }
        // console.log("chapter length is ", chapters.length)
        // console.log(chapters[0])
        return chapters;
    }
    parseChapterDetails($, mangaId, id) {
        var _a, _b, _c;
        const pages = [];
        for (const img of $('.chapter-content').find('img').toArray()) {
            const imgUrl = (_b = (_a = $(img).attr('data-src')) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : (_c = $(img).attr('src')) === null || _c === void 0 ? void 0 : _c.trim();
            if (!imgUrl)
                continue;
            pages.push(imgUrl);
        }
        return createChapterDetails({
            id,
            mangaId,
            pages,
            longStrip: false,
        });
    }
    parseSearchResults($) {
        var _a, _b;
        const results = [];
        for (const result of $('#history').find('.thumb-wrapper').toArray()) {
            const id = (_a = $(result).attr('data-id')) !== null && _a !== void 0 ? _a : '';
            const image = (_b = $(result).find('.content.img-in-ratio.lazyloaded').attr('data-bg')) !== null && _b !== void 0 ? _b : '';
            const title = '';
            results.push(createMangaTile({
                id,
                image,
                title: createIconText({ text: title })
            }));
        }
        return results;
    }
    parseHomeSections($, sectionCallback) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const popularSection = createHomeSection({ id: '0', title: 'Popular Manga', type: paperback_extensions_common_1.HomeSectionType.singleRowNormal, view_more: false, });
        const recentlyUpdatedSection = createHomeSection({ id: '1', title: 'Recently Updated Manga', type: paperback_extensions_common_1.HomeSectionType.singleRowNormal, view_more: false, });
        const newMangaSection = createHomeSection({ id: '2', title: 'New Manga', type: paperback_extensions_common_1.HomeSectionType.singleRowNormal, view_more: false, });
        const popular = [];
        const recentlyUpdated = [];
        const newManga = [];
        for (let popularManga of $('.owl-stage-outer').find('.thumb-wrapper').toArray()) {
            const mangaId = (_a = $('a', popularManga).attr('href')) === null || _a === void 0 ? void 0 : _a.replace('/', '').trim();
            const title = ''; //Not provided by site
            const image = (_b = $('.content.img-in-ratio', popularManga).css('background-image').split('url("')[1]) === null || _b === void 0 ? void 0 : _b.replace('")', '').trim();
            //   console.log(image)
            popular.push(createMangaTile({
                id: mangaId,
                image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title,
                }),
            }));
        }
        popularSection.items = popular;
        sectionCallback(popularSection);
        for (let recentlyUpdatedManga of $('.thumb-item-flow.col-6.col-md-3', $('.row-last-update')).toArray()) {
            const mangaId = (_e = (_d = (_c = $('a', recentlyUpdatedManga).attr('href')) === null || _c === void 0 ? void 0 : _c.split('/')[1]) === null || _d === void 0 ? void 0 : _d.replace('/', '')) !== null && _e !== void 0 ? _e : '';
            if (mangaId == 'manga-list.html?sort=last_update')
                continue;
            const image = (_f = $(recentlyUpdatedManga).find('.content.img-in-ratio.lazyloaded').attr('data-bg')) !== null && _f !== void 0 ? _f : '';
            const title = ''; //Not provided by site
            // console.log("recent:", image)
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
        let newMangaDiv = $('.row-last-update').next();
        for (let newMangaItem of $('.thumb-item-flow.col-6.col-md-3', newMangaDiv).toArray()) {
            const mangaId = (_j = (_h = (_g = $('a', newMangaItem).attr('href')) === null || _g === void 0 ? void 0 : _g.split('/')[1]) === null || _h === void 0 ? void 0 : _h.replace('/', '')) !== null && _j !== void 0 ? _j : '';
            if (mangaId == 'manga-list.html?sort=last_update')
                continue;
            const image = (_k = $(newMangaItem).find('.content.img-in-ratio.lazyloaded').attr('data-bg')) !== null && _k !== void 0 ? _k : '';
            const title = ''; //Not provided by site
            console.log('new:', $('a', newMangaItem).attr('href'));
            newManga.push(createMangaTile({
                id: mangaId,
                image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title,
                }),
            }));
        }
        newMangaSection.items = newManga;
        sectionCallback(newMangaSection);
    }
}
exports.Parser = Parser;

},{"paperback-extensions-common":5}]},{},[48])(48)
});
