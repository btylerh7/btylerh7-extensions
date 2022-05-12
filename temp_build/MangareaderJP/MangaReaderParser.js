"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
class Parser {
    parseMangaDetails($, mangaId) {
        var _a, _b, _c, _d, _e, _f;
        const image = (_a = $('.manga-poster-img').attr('src')) !== null && _a !== void 0 ? _a : '';
        const title = (_b = $('.manga-name').text()) !== null && _b !== void 0 ? _b : '';
        const desc = (_c = $('.description').text()) !== null && _c !== void 0 ? _c : '';
        let rating = 0;
        let status = paperback_extensions_common_1.MangaStatus.ONGOING;
        let author = '';
        let views = 0;
        for (const mangaDetail of $('.anisc-info .item').toArray()) {
            const detailTitle = $('.item-head').text().toLowerCase();
            if (detailTitle.includes('status'))
                status = this.mangaStatus($('.name', mangaDetail).text().toLowerCase());
            if (detailTitle.includes('authors'))
                author = (_d = $('a', mangaDetail).text().trim()) !== null && _d !== void 0 ? _d : '';
            if (detailTitle.includes('views'))
                views = Number((_e = $('.name', mangaDetail).text().replace(',', '').trim()) !== null && _e !== void 0 ? _e : '0');
            if (detailTitle.includes('score'))
                rating = Number((_f = $('.name', mangaDetail).text().trim()) !== null && _f !== void 0 ? _f : '0');
        }
        return createManga({
            id: mangaId,
            titles: [title],
            author: author,
            image: image,
            desc: this.encodeText(desc),
            status: status,
            rating: rating,
        });
    }
    mangaStatus(str) {
        if (str.includes('publishing'))
            return paperback_extensions_common_1.MangaStatus.ONGOING;
        if (str.includes('finished'))
            return paperback_extensions_common_1.MangaStatus.COMPLETED;
        if (str.includes('haitus'))
            return paperback_extensions_common_1.MangaStatus.HIATUS;
        if (str.includes('discontinued'))
            return paperback_extensions_common_1.MangaStatus.ABANDONED;
        if (str.includes('published'))
            return paperback_extensions_common_1.MangaStatus.UNKNOWN;
        return paperback_extensions_common_1.MangaStatus.ONGOING;
    }
}
exports.Parser = Parser;
