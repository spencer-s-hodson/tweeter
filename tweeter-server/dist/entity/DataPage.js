"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPage = void 0;
/**
 * A page of data returned by the database.
 *
 * @param <T> type of data objects being returned.
 */
class DataPage {
    constructor(items, hasMorePages) {
        this.items = items;
        this.hasMorePages = hasMorePages;
    }
}
exports.DataPage = DataPage;
