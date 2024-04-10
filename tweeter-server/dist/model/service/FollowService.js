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
                const item = this.dynamoFollowsToFollows(followsItem);
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
                const item = this.dynamoFollowsToFollows(followsItem);
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
            const follows = this.dynamoFollowsToFollows(dynamoFollows);
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
            // make sure request is good
            if (!request.userToFollow || !request.authToken) {
                throw new Error("Bad Request: ");
            }
            // validate authTokem
            if (!this.isValidAuthToken(request.authToken)) {
                return new tweeter_shared_1.FollowResponse(false, "AuthToken Expired, please sign in again", 0, 0); // set it up so that everything retruns a tweeter response
            }
            /**
             * followerAlias = this is should be the username of the user that is going to follow someone
             * followeeAlias = this is shopuld be the username of the user that is going to be followed
             *
             * EXAMPLE
             * followerAlias = @ClintEastwood
             * followeeAlias = @User0
             */
            const followerAlias = this.getAliasFromDynamoAuth(yield this.authDAO.getAuth(request.authToken.token));
            const followeeAlias = request.userToFollow.alias;
            console.log("Follower Alias: " + followerAlias);
            console.log("Followee Alias: " + followeeAlias);
            // check to see if the user already is following the other use
            const dynamoFollows = yield this.followsDAO.getItem(followerAlias, followeeAlias);
            if (dynamoFollows) {
                throw new Error(`${followerAlias} already follows ${followeeAlias}`);
            }
            // put a Follows object in DB, I'll have to rearrange the Auth table to it can keep track of users (get a user from the authtoken)
            yield this.followsDAO.putItem(followerAlias, followeeAlias);
            // increment counts
            const followerCurrCount = Number(this.getCount(yield this.userDAO.getUser(followeeAlias), true));
            const followeeCurrCount = Number(this.getCount(yield this.userDAO.getUser(followerAlias), false));
            // const followerCurrCount: number = await this.followsDAO.getFollowersCount(followeeAlias); // User0's follower count
            // const followeeCurrCount: number = await this.followsDAO.getFolloweesCount(followerAlias); // ClintEastwood's following count
            console.log("Current Follower Count: " + followerCurrCount);
            console.log("Current Followee Count: " + followeeCurrCount);
            yield this.userDAO.updateUser(followeeAlias, followerCurrCount + 1, true); // User0's follower count +1
            yield this.userDAO.updateUser(followerAlias, followeeCurrCount + 1, false); // ClintEastwood's following count + 1
            // return a response
            return new tweeter_shared_1.FollowResponse(true, "successfully followed a user", 0, 0);
            // await new Promise((f) => setTimeout(f, 2000));
            // const followeesCountResponse: GetFolloweesCountResponse = await this.getFolloweesCount(new GetFolloweesCountRequest(request.authToken, request.userToFollow));
            // const followersCountResponse: GetFollowersCountResponse = await this.getFollowersCount(new GetFollowersCountRequest(request.authToken, request.userToFollow));
        });
    }
    ;
    unfollow(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure request is good
            if (!request.userToUnfollow || !request.authToken) {
                throw new Error("Bad Request: ");
            }
            // validate authTokem
            if (!this.isValidAuthToken(request.authToken)) {
                return new tweeter_shared_1.UnfollowResponse(false, "AuthToken Expired, please sign in again", 0, 0); // set it up so that everything retruns a tweeter response
            }
            /**
             * followerAlias = this is should be the username of the user that is going to follow someone
             * followeeAlias = this is shopuld be the username of the user that is going to be followed
             *
             * EXAMPLE
             * followerAlias = @ClintEastwood
             * followeeAlias = @User0
             */
            const followerAlias = this.getAliasFromDynamoAuth(yield this.authDAO.getAuth(request.authToken.token));
            const followeeAlias = request.userToUnfollow.alias;
            console.log("Follower Alias: " + followerAlias);
            console.log("Followee Alias: " + followeeAlias);
            // check to see if the user already is following the other use
            const dynamoFollows = yield this.followsDAO.getItem(followerAlias, followeeAlias);
            if (!dynamoFollows) {
                throw new Error(`${followerAlias} already doesn't follow ${followeeAlias}`);
            }
            // delete a Follows object in DB, I'll have to rearrange the Auth table to it can keep track of users (get a user from the authtoken)
            yield this.followsDAO.deleteItem(followerAlias, followeeAlias);
            // increment counts
            const followerCurrCount = Number(this.getCount(yield this.userDAO.getUser(followeeAlias), true));
            const followeeCurrCount = Number(this.getCount(yield this.userDAO.getUser(followerAlias), false));
            // const followerCurrCount: number = await this.followsDAO.getFollowersCount(followeeAlias); // User0's follower count
            // const followeeCurrCount: number = await this.followsDAO.getFolloweesCount(followerAlias); // ClintEastwood's following count
            console.log("Current Follower Count: " + followerCurrCount);
            console.log("Current Followee Count: " + followeeCurrCount);
            yield this.userDAO.updateUser(followeeAlias, followerCurrCount - 1, true); // User0's follower count +1
            yield this.userDAO.updateUser(followerAlias, followeeCurrCount - 1, false); // ClintEastwood's following count + 1
            // return a response
            return new tweeter_shared_1.UnfollowResponse(true, "successfully followed a user", 0, 0);
        });
    }
    getCount(user, followers) {
        const dyanmoUser = user;
        const response = followers ? dyanmoUser.followers : dyanmoUser.following;
        return Number(response);
    }
    getAliasFromDynamoAuth(authToken) {
        const dynamoAuthToken = authToken;
        return dynamoAuthToken.user_alias;
    }
}
exports.FollowService = FollowService;
