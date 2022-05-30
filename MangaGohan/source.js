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
exports.MangaGohan = exports.MangaGohanInfo = exports.MG_DOMAIN = void 0;
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/indent */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MangaGohanParser_1 = require("./MangaGohanParser");
exports.MG_DOMAIN = 'https://mangagohan.me';
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1';
const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Referer: 'https://mangagohan.me/?__cf_chl_tk=Vdie6FXxTJZv3.cpvMsRffoLHmwttqIvYSyp79VoXQI-1653012153-0-gaNycGzNCqU',
    'user-agent': userAgent
};
const method = 'GET';
exports.MangaGohanInfo = {
    version: '1.1.0',
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
        {
            text: 'CloudFlare',
            type: paperback_extensions_common_1.TagType.RED,
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
            requestTimeout: 6000,
            interceptor: {
                interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    request.headers = Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), {
                        'user-agent': userAgent,
                        'referer': 'https://mangagohan.me/?__cf_chl_tk=Vdie6FXxTJZv3.cpvMsRffoLHmwttqIvYSyp79VoXQI-1653012153-0-gaNycGzNCqU'
                    });
                    return request;
                }),
                interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () {
                    return response;
                })
            }
        });
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${exports.MG_DOMAIN}`,
            method,
            headers,
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
            const data = yield this.requestManager.schedule(request, 3);
            this.CloudFlareError(data.status);
            let $ = this.cheerio.load(data.data);
            return (0, MangaGohanParser_1.parseMangaDetails)($, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: encodeURI(`${exports.MG_DOMAIN}/manga/${mangaId}`),
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 3);
            this.CloudFlareError(data.status);
            let $ = this.cheerio.load(data.data);
            return (0, MangaGohanParser_1.parseChapters)($, mangaId);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: encodeURI(`${exports.MG_DOMAIN}/manga/${mangaId}/${chapterId}/`),
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 3);
            this.CloudFlareError(data.status);
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
                    url: `${exports.MG_DOMAIN}/?s=${encodeURI(query.title)}&post_type=wp-manga`,
                    method,
                    headers,
                });
            }
            if (query.includedTags)
                type = 'tag';
            request = createRequestObject({
                url: `${exports.MG_DOMAIN}/manga-genre/${encodeURI((_b = query.includedTags) === null || _b === void 0 ? void 0 : _b.map((x) => x.id)[0])}/page/${page.toString()}`,
                method,
                headers,
            });
            const data = yield this.requestManager.schedule(request, 3);
            this.CloudFlareError(data.status);
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
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            this.CloudFlareError(response.status);
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
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return (0, MangaGohanParser_1.parseTags)($);
        });
    }
    CloudFlareError(status) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass');
        }
    }
}
exports.MangaGohan = MangaGohan;

},{"./MangaGohanParser":49,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = exports.parseHomeSections = exports.parseSearchRequest = exports.parseChapterDetails = exports.parseChapters = exports.parseMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
// export class Parser {
//   parseMangaDetails($:CheerioStatic, mangaId: string): Manga {
//     const title = [$('.post-title').find('h1').first().text().split(' ')[0]!] ?? ''
//     const image = $('.summary_image').find('img').attr('data-src') ?? 'https://i.imgur.com/GYUxEX8.png'
//     const rating = Number($('.score.font-meta.total_votes').text()) ?? 0
const parseMangaDetails = ($, mangaId) => {
    var _a, _b;
    const titles = [(_a = $('.post-title').find('h1').first().text().replace('(Raw - Free)', '').trim()) !== null && _a !== void 0 ? _a : ''];
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
        if (!((_b = decodeURI($(link).attr('href').split('com/')[1])) === null || _b === void 0 ? void 0 : _b.startsWith('manga-genre')))
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
        // const id = $('a', href).text()
        const chapNum = $('a', href).text().replace(/第|話/g, '').trim();
        const id = `第${chapNum}話`;
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
    var _a;
    const pages = [];
    const links = $('.reading-content').find('img');
    for (const img of links.toArray()) {
        const page = (_a = img.attribs['data-src']) === null || _a === void 0 ? void 0 : _a.trim();
        // console.log(page)
        // img.attribs['data-src']?.trim() ?? 
        if (!page)
            continue;
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
    var _a, _b, _c, _d, _e, _f, _g;
    const tiles = [];
    let results;
    //If serch is a title
    if (type === 'title') {
        results = $('.tab-content-wrap').find('.row.c-tabs-item__content');
        for (let result of results.toArray()) {
            // const id = article.attribs.class[0].split('-')[1]
            const mangaId = (_b = (_a = $(result).find('.h4').find('a').first().attr('href')) === null || _a === void 0 ? void 0 : _a.split('manga/')[1]) !== null && _b !== void 0 ? _b : '';
            const image = $('.tab-thumb.c-image-hover > a > img', result).attr('data-src');
            const title = (_c = $(result).find('.h4').first().text().replace(/(Raw-Free)/g, '').trim()) !== null && _c !== void 0 ? _c : '';
            tiles.push(createMangaTile({
                id: mangaId,
                image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
                title: createIconText({
                    text: title,
                }),
            }));
        }
    }
    // TODO If there is a genre search
    if (type === 'tag') {
        results = $('.tab-content-wrap').find('.page-item-detail.manga');
        for (let result of results.toArray()) {
            const mangaId = (_e = (_d = $('h3.h5', result).find('a').first().attr('href')) === null || _d === void 0 ? void 0 : _d.split('manga/')[1]) !== null && _e !== void 0 ? _e : '';
            const image = (_f = $(result).find('img').first().attr('data-src')) !== null && _f !== void 0 ? _f : '';
            const title = (_g = $('h3.h5', result).find('a').first().text().trim()) !== null && _g !== void 0 ? _g : '';
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
    var _a, _b, _c, _d, _e, _f;
    const featuredSection = createHomeSection({ id: '0', title: 'Featured Manga', type: paperback_extensions_common_1.HomeSectionType.singleRowLarge, view_more: false, });
    const topSection = createHomeSection({ id: '1', title: 'Top Manga', type: paperback_extensions_common_1.HomeSectionType.singleRowNormal, view_more: false, });
    const recentlyUpdatedSection = createHomeSection({ id: '2', title: 'Reccently Updated Manga', type: paperback_extensions_common_1.HomeSectionType.singleRowNormal, view_more: false, });
    const featured = [];
    const top = [];
    const recentlyUpdated = [];
    //Retrieve Featured Manga Section
    for (let featuredManga of $('.popular-slider.style-1').find('.slider__item').toArray()) {
        const mangaId = (_b = (_a = decodeURI($('.slider__content', featuredManga).find('a').first().attr('href'))) === null || _a === void 0 ? void 0 : _a.split('/manga/')[1]) !== null && _b !== void 0 ? _b : '';
        const title = (_c = $('h4', featuredManga).find('a').first().text().replace(/(Raw-Free)/g, '').trim()) !== null && _c !== void 0 ? _c : '';
        const image = $('.slider__thumb', featuredManga).find('img').first().attr('data-src');
        featured.push(createMangaTile({
            id: mangaId,
            image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({ text: title, }),
        }));
    }
    featuredSection.items = featured;
    sectionCallback(featuredSection);
    for (let topManga of $('.c-blog__content').first().find('.page-item-detail.manga').toArray()) {
        const mangaId = decodeURI((_d = $('a', topManga).first().attr('href').split('/manga/')[1]) !== null && _d !== void 0 ? _d : '');
        const title = (_e = $(topManga).find('h3 > a').first().text().split(' ')[0]) !== null && _e !== void 0 ? _e : '';
        const image = $(topManga).find('img').first().attr('src');
        top.push(createMangaTile({
            id: mangaId,
            image: image !== null && image !== void 0 ? image : 'https://i.imgur.com/GYUxEX8.png',
            title: createIconText({
                text: title,
            }),
        }));
    }
    topSection.items = top;
    sectionCallback(topSection);
    for (let recentlyUpdatedManga of $('.main-col-inner.c-page').next().find('.page-item-detail.manga').toArray()) {
        const mangaId = (_f = $('a', recentlyUpdatedManga).first().attr('href')) === null || _f === void 0 ? void 0 : _f.split('/manga/')[1];
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
    for (const link of $('.container > div > div > ul').find('li > a').toArray()) {
        const id = decodeURI($(link).attr('href').split('me/manga-genre/')[1]);
        const label = $(link).text().trim();
        if (!id || !label)
            continue;
        if (!((_a = decodeURI($(link).attr('href').split('me/')[1])) === null || _a === void 0 ? void 0 : _a.startsWith('manga-genre')))
            continue;
        tags.push({ id: id, label: label });
    }
    console.log(tags);
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

},{"paperback-extensions-common":5}]},{},[48])(48)
});
