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
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
const Factory_1 = require("../../factory/Factory");
class FollowService extends Service_1.Service {
    constructor() {
        super();
        this.followsDAO = Factory_1.Factory.factory.getFollowsDAO();
        this.userDAO = Factory_1.Factory.factory.getUserDAO();
    }
    loadMoreFollowers(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // make sure the request is okay
            if (request.user == null || request.authToken == null) {
                throw new Error("Bad Request");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("Session Expired, please logout and log back in");
            }
            // no shot this is actually right lol
            const stuff = yield this.followsDAO.getPageOfFollowers(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.alias);
            console.log("Stuff: " + JSON.stringify(stuff));
            const followsItems = stuff.items;
            const hasMore = stuff.hasMorePages;
            console.log("Follow Items: " + JSON.stringify(followsItems));
            console.log("Has More: " + JSON.stringify(hasMore));
            let users = [];
            for (let followsItem of followsItems) {
                // parse followsItem
                const item = this.parseFollows(followsItem);
                console.log("ITEM: " + JSON.stringify(item));
                // we are getting the followers so we get user by followerHandle
                const dynamoUser = yield this.userDAO.getUser(item.follower_handle);
                // DEBUG
                console.log("DYNAO USER: " + JSON.stringify(dynamoUser));
                const user = this.dynamoUserToUser(dynamoUser);
                if (user == null) {
                    throw new Error("This user does not exist!");
                }
                users.push(user);
            }
            return new tweeter_shared_1.LoadMoreFollowersResponse(true, "successfully loaded more followers", users, hasMore);
        });
    }
    ;
    loadMoreFollowees(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // make sure the request is okay
            if (request.user == null || request.authToken == null) {
                throw new Error("Bad Request");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("Session Expired, please logout and log back in");
            }
            const stuff = yield this.followsDAO.getPageOfFollowees(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.alias);
            const followsItems = stuff.items;
            const hasMore = stuff.hasMorePages;
            let users = [];
            for (let followsItem of followsItems) {
                // parse followsItem
                const item = this.parseFollows(followsItem);
                // we are getting the followers so we get user by followerHandle
                const dynamoUser = yield this.userDAO.getUser(item.followee_handle);
                // then convert to actual user
                const user = this.dynamoUserToUser(dynamoUser);
                if (user == null) {
                    throw new Error("This user does not exist!");
                }
                users.push(user);
            }
            return new tweeter_shared_1.LoadMoreFolloweesResponse(true, "successfully loaded more followers", users, hasMore);
        });
    }
    ;
    getIsFollowerStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure request is good
            if (!request.user || !request.selectedUser) {
                throw new Error("Bad Request");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("Bad AuthToken");
            }
            // get Follows
            const dynamoFollows = yield this.followsDAO.getItem(request.user.alias, request.selectedUser.alias);
            const follows = this.parseFollows(dynamoFollows);
            if (!follows) {
                return new tweeter_shared_1.GetIsFollowerStatusResponse(true, "selected user is not a follower", false);
            }
            else {
                return new tweeter_shared_1.GetIsFollowerStatusResponse(true, "selected user is a follower", true);
            }
        });
    }
    ;
    getFolloweesCount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is good
            if (!request.user) {
                throw new Error("Bad Request");
            }
            // is authenticated user
            if (!this.isValidAuthToken) {
                throw new Error("Bad Auth");
            }
            // get a user
            const dynamoUser = yield this.userDAO.getUser(request.user.alias);
            const num = Number(this.getCount(dynamoUser, false));
            console.log(num);
            return new tweeter_shared_1.GetFolloweesCountResponse(true, "successfully got user's follower count", num);
        });
    }
    ;
    getFollowersCount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is good
            if (!request.user) {
                throw new Error("Bad Request");
            }
            // is authenticated user
            if (!this.isValidAuthToken) {
                throw new Error("Bad Auth");
            }
            // get a user
            const dynamoUser = yield this.userDAO.getUser(request.user.alias);
            const num = Number(this.getCount(dynamoUser, true));
            console.log(num);
            return new tweeter_shared_1.GetFollowersCountResponse(true, "successfully got user's follower count", num);
        });
    }
    ;
    follow(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((f) => setTimeout(f, 2000));
            const followeesCountResponse = yield this.getFolloweesCount(new tweeter_shared_1.GetFolloweesCountRequest(request.authToken, request.userToFollow));
            const followersCountResponse = yield this.getFollowersCount(new tweeter_shared_1.GetFollowersCountRequest(request.authToken, request.userToFollow));
            return new tweeter_shared_1.FollowResponse(true, "successfully followed a user", followeesCountResponse.numOfFollowees, followersCountResponse.numOfFollowers);
        });
    }
    ;
    unfollow(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((f) => setTimeout(f, 2000));
            const followeesCountResponse = yield this.getFolloweesCount(new tweeter_shared_1.GetFolloweesCountRequest(request.authToken, request.userToUnfollow));
            const followersCountResponse = yield this.getFollowersCount(new tweeter_shared_1.GetFollowersCountRequest(request.authToken, request.userToUnfollow));
            return new tweeter_shared_1.UnfollowResponse(true, "successfully followed a user", followeesCountResponse.numOfFollowees, followersCountResponse.numOfFollowers);
        });
    }
    ;
    getCount(user, followers) {
        const dyanmoUser = user;
        return followers ? dyanmoUser.followers : dyanmoUser.following;
    }
}
exports.FollowService = FollowService;
