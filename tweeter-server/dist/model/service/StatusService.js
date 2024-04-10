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
const Factory_1 = require("../../factory/Factory");
class StatusService extends Service_1.Service {
    constructor() {
        super();
        this.storyDAO = Factory_1.Factory.factory.getStoryDAO();
        this.followsDAO = Factory_1.Factory.factory.getFollowsDAO();
        this.userDAO = Factory_1.Factory.factory.getUserDAO();
        this.feedDAO = Factory_1.Factory.factory.getFeedDAO();
    }
    loadMoreFeedItems(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is good
            if (!request || !request.authToken || !request.pageSize || !request.user) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Bad AuthToken]: Please resign in to perform this action");
            }
            // get the feed
            const stuff = yield this.feedDAO.getPageOfFeed(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.timestamp);
            const dynamoItems = stuff.items;
            const hasMorePages = stuff.hasMorePages;
            // DEBUG
            console.log("Dynamo Items: " + JSON.stringify(dynamoItems));
            console.log("hasMore: " + JSON.stringify(hasMorePages));
            let feed = [];
            for (let dynamoFeedItem of dynamoItems) {
                const item = yield this.dynamoStatustoStatus(dynamoFeedItem);
                console.log(JSON.stringify(item));
                if (item) {
                    feed.push(item);
                }
                else {
                    throw new Error("Failed to retrieve post");
                }
            }
            // return a response
            return new tweeter_shared_1.LoadMoreFeedItemsResponse(true, "successfully loaded more feed items", feed, hasMorePages);
        });
    }
    ;
    loadMoreStoryItems(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is okay
            if (!request || !request.authToken || !request.pageSize || !request.user) {
                throw new Error("[Bad Request]");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Bad AuthToken]");
            }
            // get the posts that the user posted
            const stuff = yield this.storyDAO.getPageOfStories(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.timestamp);
            const dynamoItems = stuff.items;
            const hasMorePages = stuff.hasMorePages;
            let posts = [];
            for (let dynamoPostItem of dynamoItems) {
                const item = yield this.dynamoStatustoStatus(dynamoPostItem);
                if (item) {
                    posts.push(item);
                }
                else {
                    throw new Error("Failed to retrieve post");
                }
            }
            // return a response
            return new tweeter_shared_1.LoadMoreStoryItemsResponse(true, "successfully loaded more story items", posts, hasMorePages);
        });
    }
    ;
    postStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is good
            if (!request || !request.authToken || !request.newStatus) {
                throw new Error("[Bad Request]");
            }
            // validate authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("Expired!");
            }
            // get the user alias through the authToken
            const dynamoAuth = yield this.authDAO.getAuth(request.authToken.token);
            if (!dynamoAuth) {
                throw new Error("[Bad Auth]");
            }
            const user_alias = this.getAliasFromDynamoAuth(dynamoAuth);
            // put status in story and feed DB
            yield this.storyDAO.putStory(user_alias, request.newStatus.timestamp, request.newStatus.post);
            // get all follows
            const follows = yield this.followsDAO.getFollowerHandles(user_alias);
            // put status in feed DB for every follows
            for (let dynamoFollow of follows) {
                const follow = this.dynamoFollowsToFollows(dynamoFollow);
                if (follow) {
                    yield this.feedDAO.putFeed(follow.follower_handle, request.newStatus.timestamp, request.newStatus.post);
                }
                else {
                    throw new Error("something bad happened");
                }
            }
            // return a response
            return new tweeter_shared_1.PostStatusResponse(true, "successfully posted a status");
        });
    }
    ;
    dynamoStatustoStatus(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const myObj = item;
            const dynamoUser = yield this.userDAO.getUser(myObj.user_alias);
            const user = this.dynamoUserToUser(dynamoUser);
            if (user) {
                return new tweeter_shared_1.Status(myObj.post, user, myObj.timestamp);
            }
            else {
                return null;
            }
        });
    }
}
exports.StatusService = StatusService;
