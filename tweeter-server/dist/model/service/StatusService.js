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
    }
    // LOADS THE POSTS OF THE USERS THE SELECTED USER FOLLOWS
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
    // LOADS THE POSTS POSTED BY THE USER
    loadMoreStoryItems(request) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Story DB Design
             * Partition Key: user_alias
             * Sort Key: timestamp
             * post: string
             */
            var _a;
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
            const postsFromDynamo = stuff.items;
            const hasMorePages = stuff.hasMorePages;
            let posts = [];
            for (let postItem of postsFromDynamo) {
                const item = yield this.dynamoStatustoStatus(postItem);
                if (item) {
                    posts.push(item);
                }
                else {
                    throw new Error("Failed to retrieve post");
                }
            }
            // if (request.authToken == null) {
            //   throw new Error("Auth Error: Invalid auth token");
            // }
            // if (request.user == null) {
            //   throw new Error("Bad Request: User not found")
            // }
            // const [statusItems, hasMore] = FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);
            // if (statusItems == null || hasMore == null) {
            //   throw new Error("Internal Server Error: Something went wrong when connecting to the database")
            // }
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
            // get the user
            const dynamoAuth = yield this.authDAO.getAuth(request.authToken.token);
            if (!dynamoAuth) {
                throw new Error("[Bad Auth]");
            }
            const user_alias = this.getAliasFromDynamoAuth(dynamoAuth);
            // put status in story DB
            yield this.storyDAO.putStory(user_alias, request.newStatus.timestamp, request.newStatus.post);
            // get all follows
            // const stuff: DataPage<Follows> = await this.followsDAO.getPageOfFollowers(user_alias, page_siz)  // PAGE SIZE??
            // put status in feed DB for every follows
            // return a response
            // await new Promise((f) => setTimeout(f, 10000));
            return new tweeter_shared_1.PostStatusResponse(true, "successfully posted a status");
            // if (request.authToken == null) {
            //   throw new Error("Auth Error: Invalid auth token");
            // }
            // if (request.newStatus == null) {
            //   throw new Error("Bad Request: newStatus is null");
            // }
            // await new Promise((f) => setTimeout(f, 2000));
            // return new PostStatusResponse(true, "successfuly posted status");
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
