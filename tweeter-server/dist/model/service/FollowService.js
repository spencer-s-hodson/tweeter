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
    }
    loadMoreFollowers(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // // make sure the request is okay
            // if (request.user == null || request.authToken == null) {
            //   throw new Error("Bad Request");
            // }
            // validate the authToken
            this.isValidAuthToken(request.authToken);
            // // no shot this is actually right lol
            // const stuff: DataPage<Follows> = await this.followsDAO.getPageOfFollowers(request.user.alias, request.pageSize, request.lastItem?.alias);
            // const followsItems = stuff.items;  // interface to make this users?
            // const hasMore = stuff.hasMorePages;
            // // getUser requires an alias and an authToken (is okay to do though?) (I think so?)
            // let users: User[] = []
            // for (let followsItem of followsItems) {
            //   // we are getting the followers so we get user by followerHandle
            //   const user: User | null = await Factory.factory.getUserDAO().getUser(followsItem.followerHandle)
            //   if (user == null) {
            //     throw new Error("This user does not exist!")
            //   }
            //   users.push(user);
            // }
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
            return new tweeter_shared_1.LoadMoreFollowersResponse(true, "successfully loaded more followers", userItems, hasMore);
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
}
exports.FollowService = FollowService;
