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
const Follows_1 = require("../../entity/Follows");
class FollowService extends Service_1.Service {
    constructor() {
        super();
        this.followsDAO = Factory_1.Factory.factory.getFollowsDAO();
        this.userDAO = Factory_1.Factory.factory.getUserDAO();
    }
    // MAKE SURE THIS RECURSES
    loadMoreFollowers(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                // DEBUG
                console.log("Follows After Parsing: " + item);
                // we are getting the followers so we get user by followerHandle
                // problem: this is return the shape of a dyamo user (put these functions in the DAO's!)
                const user = yield this.userDAO.getUser(item.follower_handle); // does this violate anything?
                console.log("THE USER: " + JSON.stringify(user));
                if (user == null) {
                    throw new Error("This user does not exist!");
                }
                users.push(user);
            }
            console.log("USERS: " + JSON.stringify(users));
            // if (request.authToken == null) {
            //   throw new Error("Auth Error: Invalid auth token");
            // }
            // if (request.user == null) {
            //   throw new Error("Bad Request: User not found")
            // }
            // const [userItems, hasMore] = FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize, request.user);
            // if (userItems == null || hasMore == null) {
            //   throw new Error("Internal Server Error: Something went wrong when connecting to the database")
            // }   
            return new tweeter_shared_1.LoadMoreFollowersResponse(true, "successfully loaded more followers", users, hasMore);
        });
    }
    ;
    loadMoreFollowees(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.authToken == null) {
                throw new Error("Auth Error: Invalid auth token");
            }
            if (request.user == null) {
                throw new Error("Bad Request: User not found");
            }
            const [userItems, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize, request.user);
            if (userItems == null || hasMore == null) {
                throw new Error("Internal Server Error: Something went wrong when connecting to the database");
            }
            return new tweeter_shared_1.LoadMoreFolloweesResponse(true, "successfully loaded more followers", userItems, hasMore);
        });
    }
    ;
    getIsFollowerStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new tweeter_shared_1.GetIsFollowerStatusResponse(true, "successfully determined whether the selceted user is a follower or not", tweeter_shared_1.FakeData.instance.isFollower());
        });
    }
    ;
    getFolloweesCount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const followeeCount = yield tweeter_shared_1.FakeData.instance.getFolloweesCount(request.user);
            return new tweeter_shared_1.GetFolloweesCountResponse(true, "successfully got user's followee count", followeeCount);
        });
    }
    ;
    getFollowersCount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const followerCount = yield tweeter_shared_1.FakeData.instance.getFollowersCount(request.user);
            return new tweeter_shared_1.GetFollowersCountResponse(true, "successfully got user's follower count", followerCount);
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
    parseFollows(follows) {
        const myObj = follows;
        // this needs to match the constructor of the Follows class
        return new Follows_1.Follows(myObj.follower_handle, myObj.follower_name, myObj.followee_handle, myObj.followee_name);
    }
}
exports.FollowService = FollowService;
