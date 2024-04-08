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
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
class StatusService extends Service_1.Service {
    // DAO's go up here
    constructor() {
        super();
    }
    loadMoreFeedItems(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.authToken == null) {
                throw new Error("Auth Error: Invalid auth token");
            }
            if (request.user == null) {
                throw new Error("Bad Request: User not found");
            }
            const [statusItems, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);
            if (statusItems == null || hasMore == null) {
                throw new Error("Internal Server Error: Something went wrong when connecting to the database");
            }
            return new tweeter_shared_1.LoadMoreFeedItemsResponse(true, "successfully loaded more feed items", statusItems, hasMore);
        });
    }
    ;
    loadMoreStoryItems(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.authToken == null) {
                throw new Error("Auth Error: Invalid auth token");
            }
            if (request.user == null) {
                throw new Error("Bad Request: User not found");
            }
            const [statusItems, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);
            if (statusItems == null || hasMore == null) {
                throw new Error("Internal Server Error: Something went wrong when connecting to the database");
            }
            return new tweeter_shared_1.LoadMoreStoryItemsResponse(true, "successfully loaded more story items", statusItems, hasMore);
        });
    }
    ;
    postStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.authToken == null) {
                throw new Error("Auth Error: Invalid auth token");
            }
            if (request.newStatus == null) {
                throw new Error("Bad Request: newStatus is null");
            }
            yield new Promise((f) => setTimeout(f, 2000));
            return new tweeter_shared_1.PostStatusResponse(true, "successfuly posted status");
        });
    }
    ;
}
exports.StatusService = StatusService;
