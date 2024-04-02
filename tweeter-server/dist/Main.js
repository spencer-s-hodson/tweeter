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
const tweeter_shared_1 = require("tweeter-shared");
const LoginLambda_1 = require("./lambda/LoginLambda");
const RegisterLambda_1 = require("./lambda/RegisterLambda");
const LogoutLambda_1 = require("./lambda/LogoutLambda");
const GetUserLambda_1 = require("./lambda/GetUserLambda");
const LoadMoreFeedItemsLambda_1 = require("./lambda/LoadMoreFeedItemsLambda");
const LoadMoreStoryItemsLambda_1 = require("./lambda/LoadMoreStoryItemsLambda");
const PostStatusLambda_1 = require("./lambda/PostStatusLambda");
const LoadMoreFollowersLambda_1 = require("./lambda/LoadMoreFollowersLambda");
const LoadMoreFolloweesLambda_1 = require("./lambda/LoadMoreFolloweesLambda");
const GetIsFollowerStatusLambda_1 = require("./lambda/GetIsFollowerStatusLambda");
const GetFolloweesCountLambda_1 = require("./lambda/GetFolloweesCountLambda");
const GetFollowersCountLambda_1 = require("./lambda/GetFollowersCountLambda");
const FollowLambda_1 = require("./lambda/FollowLambda");
const UnfollowLambda_1 = require("./lambda/UnfollowLambda");
/**
 * User Service Tests
 */
function testLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoginRequest('username', 'password');
        console.log(JSON.stringify(req));
        console.log(yield (0, LoginLambda_1.loginHandler)(req));
    });
}
function testRegister() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.RegisterRequest('alias', 'password', 'firstName', 'lastName', 'image');
        console.log(JSON.stringify(req));
        console.log(yield (0, RegisterLambda_1.registerHandler)(req));
    });
}
function testLogout() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LogoutRequest(new tweeter_shared_1.AuthToken('token', 123));
        console.log(JSON.stringify(req));
        console.log(yield (0, LogoutLambda_1.logoutHandler)(req));
    });
}
function testGetUserByAlias() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.GetUserRequest(new tweeter_shared_1.AuthToken('token', 123), 'userAlias');
        console.log(JSON.stringify(req));
        console.log(yield (0, GetUserLambda_1.getUserHandler)(req));
    });
}
/**
 * Status Service Tests
 */
function testLoadMoreFeedItems() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoadMoreFeedItemsRequest(new tweeter_shared_1.AuthToken('token', 123), // auth
        new tweeter_shared_1.User('user', 'name', 'hello', 'hello'), // user
        5, // pageSize
        new tweeter_shared_1.Status("sick!", new tweeter_shared_1.User("spencer", "hodson", "@user1", "user one"), 1) // lastItem
        );
        console.log(JSON.stringify(req));
        console.log(yield (0, LoadMoreFeedItemsLambda_1.loadMoreFeedItemsHandler)(req));
    });
}
function testLoadMoreStoryItems() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoadMoreStoryItemsRequest(new tweeter_shared_1.AuthToken('token', 123), // auth
        new tweeter_shared_1.User('user', 'name', 'hello', 'hello'), // user
        5, // pageSize
        new tweeter_shared_1.Status("sick!", new tweeter_shared_1.User("spencer", "hodson", "@user1", "user one"), 1) // lastItem
        );
        console.log(JSON.stringify(req));
        console.log(yield (0, LoadMoreStoryItemsLambda_1.loadMoreStoryItemsHandler)(req));
    });
}
function testPostStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.PostStatusRequest(new tweeter_shared_1.AuthToken('token', 123), new tweeter_shared_1.Status("sick!", new tweeter_shared_1.User("spencer", "hodson", "@user1", "user one"), 1));
        console.log(JSON.stringify(req));
        console.log(yield (0, PostStatusLambda_1.postStatusHandler)(req));
    });
}
/**
 * Follow Service Tests
 */
function testLoadMoreFollowers() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoadMoreFollowersRequest(new tweeter_shared_1.AuthToken('token', 123), // auth
        new tweeter_shared_1.User('user', 'name', 'hello', 'hello'), // user
        5, new tweeter_shared_1.User("spencer", "hodson", "@user1", "user one"));
        console.log(JSON.stringify(req));
        console.log(yield (0, LoadMoreFollowersLambda_1.loadMoreFollowersHandler)(req));
    });
}
function testLoadMoreFollowees() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.LoadMoreFolloweesRequest(new tweeter_shared_1.AuthToken('token', 123), // auth
        new tweeter_shared_1.User('user', 'name', 'hello', 'hello'), // user
        5, new tweeter_shared_1.User("spencer", "hodson", "@user1", "user one"));
        console.log(JSON.stringify(req));
        console.log(yield (0, LoadMoreFolloweesLambda_1.loadMoreFolloweesHandler)(req));
    });
}
function testGetIsFollowerStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.GetIsFollowerStatusRequest(new tweeter_shared_1.AuthToken('token', 123), new tweeter_shared_1.User('user1', 'name1', 'hello1', 'hello1'), new tweeter_shared_1.User('user2', 'name2', 'hello2', 'hello2'));
        console.log(JSON.stringify(req));
        console.log(yield (0, GetIsFollowerStatusLambda_1.getIsFollowerStatusHandler)(req));
    });
}
function testGetFolloweesCount() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.GetFolloweesCountRequest(new tweeter_shared_1.AuthToken('token', 123), new tweeter_shared_1.User('user', 'name', 'hello', 'hello'));
        console.log(JSON.stringify(req));
        console.log(yield (0, GetFolloweesCountLambda_1.getFolloweesCountHandler)(req));
    });
}
function testGetFollowersCount() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.GetFollowersCountRequest(new tweeter_shared_1.AuthToken('token', 123), new tweeter_shared_1.User('user', 'name', 'hello', 'hello'));
        console.log(JSON.stringify(req));
        console.log(yield (0, GetFollowersCountLambda_1.getFollowersCountHandler)(req));
    });
}
function testFollow() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.FollowRequest(new tweeter_shared_1.AuthToken('token', 123), new tweeter_shared_1.User('user', 'name', 'hello', 'hello'));
        console.log(JSON.stringify(req));
        console.log(yield (0, FollowLambda_1.followHandler)(req));
    });
}
function testUnfollow() {
    return __awaiter(this, void 0, void 0, function* () {
        let req = new tweeter_shared_1.UnfollowRequest(new tweeter_shared_1.AuthToken('token', 123), new tweeter_shared_1.User('user', 'name', 'hello', 'hello'));
        console.log(JSON.stringify(req));
        console.log(yield (0, UnfollowLambda_1.unfollowHandler)(req));
    });
}
function testMain() {
    return __awaiter(this, void 0, void 0, function* () {
        // await testLogin();
        // await testRegister();
        // await testLogout()
        // await testGetUserByAlias()
        // await testLoadMoreFeedItems();
        // await testLoadMoreStoryItems();
        // await testPostStatus();
        // await testLoadMoreFollowers();
        // await testLoadMoreFollowees();
        // await testGetIsFollowerStatus()
        // await testGetFolloweesCount();
        // await testGetFollowersCount();
        // await testFollow();
        // await testUnfollow();
    });
}
testMain();
