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
const Factory_1 = require("../../factory/Factory");
const AuthService_1 = require("./AuthService");
const Queue_1 = require("../../sqs/Queue");
// change these name
const POST_STATUS_QUEUE = "https://sqs.us-west-2.amazonaws.com/839064361653/postStatusQueue";
const UPDATE_FEED_QUEUE = "https://sqs.us-west-2.amazonaws.com/839064361653/updateFeedQueue";
class StatusService extends AuthService_1.AuthService {
    constructor() {
        super();
        this.storyDAO = Factory_1.Factory.factory.getStoryDAO();
        this.followsDAO = Factory_1.Factory.factory.getFollowsDAO();
        this.feedDAO = Factory_1.Factory.factory.getFeedDAO();
        this.sqs = new Queue_1.MySQS();
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
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            // get the feed
            const stuff = yield this.feedDAO.getPageOfFeed(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.timestamp);
            const dynamoItems = stuff.items;
            const hasMorePages = stuff.hasMorePages;
            let feed = [];
            for (let dynamoFeedItem of dynamoItems) {
                const item = yield this.dynamoFeedtoStatus(dynamoFeedItem);
                if (item) {
                    feed.push(item);
                }
                else {
                    throw new Error("[Internal Server Error]: Failed to retrieve post");
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
                throw new Error("[Bad Request]: Please enter all information");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            // get the posts that the user posted
            const stuff = yield this.storyDAO.getPageOfStories(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.timestamp);
            const dynamoItems = stuff.items;
            const hasMorePages = stuff.hasMorePages;
            let posts = [];
            for (let dynamoPostItem of dynamoItems) {
                const item = yield this.dynamoStorytoStatus(dynamoPostItem);
                if (item) {
                    posts.push(item);
                }
                else {
                    throw new Error("[Internal Server Error]: Failed to retrieve post");
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
                throw new Error("[Bad Request]: Please enter all information");
            }
            // validate authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            // get the user alias through the authToken
            const dynamoAuth = yield this.authDAO.getAuth(request.authToken.token);
            if (!dynamoAuth) {
                throw new Error("[Internal Server Error]: Failed to retrieve an authToken");
            }
            const user_alias = this.getAliasFromDynamoAuth(dynamoAuth);
            // put status in story and feed DB
            yield this.storyDAO.putStory(user_alias, request.newStatus.timestamp, request.newStatus.post);
            return new tweeter_shared_1.PostStatusResponse(true, "successfully posted a status");
        });
    }
    ;
    postUpdateFeedMessages(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request || !request.newStatus || !request.authToken) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            const author = yield this.userDAO.getUser(request.newStatus.user.alias);
            if (!author) {
                throw new Error("[Internal Server Error]: Failed to retrieve the author of the post");
            }
            let follows = yield this.followsDAO.getFollowerHandles(author.alias);
            const BATCH_SIZE = 250;
            for (let i = 0; i < follows.length; i += BATCH_SIZE) {
                const batch = follows.slice(i, i + BATCH_SIZE);
                const message = JSON.stringify({
                    status: request.newStatus,
                    followers: batch
                });
                try {
                    yield this.sqs.sendMessage(message, UPDATE_FEED_QUEUE);
                    console.log("Success, message sent.");
                }
                catch (err) {
                    throw new Error("[Internal Server Error]: Failed to send a message to the queue");
                }
            }
        });
    }
    // return new PostStatusResponse(true, "successfully posted a status");
    dynamoFeedtoStatus(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const myObj = item;
            const dynamoUser = yield this.userDAO.getUser(myObj.author);
            const user = this.dynamoUserToUser(dynamoUser);
            if (user) {
                return new tweeter_shared_1.Status(myObj.post, user, myObj.timestamp);
            }
            else {
                return null;
            }
        });
    }
    dynamoStorytoStatus(item) {
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
