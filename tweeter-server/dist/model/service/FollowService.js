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
const Factory_1 = require("../../factory/Factory");
const AuthService_1 = require("./AuthService");
class FollowService extends AuthService_1.AuthService {
    constructor() {
        super();
        this.followsDAO = Factory_1.Factory.factory.getFollowsDAO();
    }
    loadMoreFollowers(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // make sure the request is okay
            if (!request.user || !request.authToken) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            // get the page of followers
            const stuff = yield this.followsDAO.getPageOfFollowers(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.alias);
            const followsItems = stuff.items;
            const hasMore = stuff.hasMorePages;
            let users = [];
            for (let followsItem of followsItems) {
                const item = this.dynamoFollowsToFollows(followsItem);
                const dynamoUser = yield this.userDAO.getUser(item.follower_handle);
                const user = this.dynamoUserToUser(dynamoUser);
                if (user == null) {
                    throw new Error("[Internal Server Error]: Failed to retrieve an existing user");
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
            if (!request.user || !request.authToken) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            const stuff = yield this.followsDAO.getPageOfFollowees(request.user.alias, request.pageSize, (_a = request.lastItem) === null || _a === void 0 ? void 0 : _a.alias);
            const followsItems = stuff.items;
            const hasMore = stuff.hasMorePages;
            let users = [];
            for (let followsItem of followsItems) {
                const item = this.dynamoFollowsToFollows(followsItem);
                const dynamoUser = yield this.userDAO.getUser(item.followee_handle);
                const user = this.dynamoUserToUser(dynamoUser);
                if (user == null) {
                    throw new Error("[Internal Server Error]: This user does not exist!");
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
                throw new Error("Bad Request: Please enter all information");
            }
            // validate the authToken
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
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
                throw new Error("[Bad Request]: Please enter all information");
            }
            // is authenticated user
            if (!this.isValidAuthToken) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            // get a user
            const dynamoUser = yield this.userDAO.getUser(request.user.alias);
            const num = Number(this.getCount(dynamoUser, false));
            return new tweeter_shared_1.GetFolloweesCountResponse(true, "successfully got user's follower count", num);
        });
    }
    ;
    getFollowersCount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is good
            if (!request.user) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // is authenticated user
            if (!this.isValidAuthToken) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            // get a user
            const dynamoUser = yield this.userDAO.getUser(request.user.alias);
            const num = Number(this.getCount(dynamoUser, true));
            return new tweeter_shared_1.GetFollowersCountResponse(true, "successfully got user's follower count", num);
        });
    }
    ;
    follow(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure request is good
            if (!request.userToFollow || !request.authToken) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // validate authTokem
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            const followerAlias = this.getAliasFromDynamoAuth(yield this.authDAO.getAuth(request.authToken.token));
            const followeeAlias = request.userToFollow.alias;
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
            yield this.userDAO.updateUser(followeeAlias, followerCurrCount + 1, true); // User0's follower count +1
            yield this.userDAO.updateUser(followerAlias, followeeCurrCount + 1, false); // ClintEastwood's following count + 1
            // return a response
            return new tweeter_shared_1.FollowResponse(true, "successfully followed a user", Number(this.getCount(yield this.userDAO.getUser(followeeAlias), false)), Number(this.getCount(yield this.userDAO.getUser(followeeAlias), true)));
        });
    }
    ;
    unfollow(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure request is good
            if (!request.userToUnfollow || !request.authToken) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // validate authTokem
            if (!this.isValidAuthToken(request.authToken)) {
                throw new Error("[Unauthorized]: Please resign in to perform this action");
            }
            const followerAlias = this.getAliasFromDynamoAuth(yield this.authDAO.getAuth(request.authToken.token));
            const followeeAlias = request.userToUnfollow.alias;
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
            yield this.userDAO.updateUser(followeeAlias, followerCurrCount - 1, true); // User0's follower count - 1
            yield this.userDAO.updateUser(followerAlias, followeeCurrCount - 1, false); // ClintEastwood's following count - 1
            // return a response
            return new tweeter_shared_1.UnfollowResponse(true, "successfully followed a user", Number(this.getCount(yield this.userDAO.getUser(followeeAlias), false)), Number(this.getCount(yield this.userDAO.getUser(followeeAlias), true)));
        });
    }
    getCount(user, followers) {
        const dyanmoUser = user;
        const response = followers ? dyanmoUser.followers : dyanmoUser.following;
        return Number(response);
    }
}
exports.FollowService = FollowService;
