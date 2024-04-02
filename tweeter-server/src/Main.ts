import { AuthToken, Status, User,
  LoginRequest, RegisterRequest, LogoutRequest, GetUserRequest,

  LoadMoreFeedItemsRequest, LoadMoreStoryItemsRequest, PostStatusRequest,
  
  LoadMoreFollowersRequest, LoadMoreFolloweesRequest, GetIsFollowerStatusRequest, 
  GetFolloweesCountRequest, GetFollowersCountRequest,
  FollowRequest, UnfollowRequest
} from 'tweeter-shared'

import { loginHandler } from "./lambda/LoginLambda";
import { registerHandler } from './lambda/RegisterLambda';
import { logoutHandler } from './lambda/LogoutLambda';
import { getUserHandler } from './lambda/GetUserLambda'

import { loadMoreFeedItemsHandler } from './lambda/LoadMoreFeedItemsLambda';
import { loadMoreStoryItemsHandler } from './lambda/LoadMoreStoryItemsLambda';
import { postStatusHandler } from './lambda/PostStatusLambda';

import { loadMoreFollowersHandler } from './lambda/LoadMoreFollowersLambda';
import { loadMoreFolloweesHandler } from './lambda/LoadMoreFolloweesLambda';
import { getIsFollowerStatusHandler } from './lambda/GetIsFollowerStatusLambda';
import { getFolloweesCountHandler } from './lambda/GetFolloweesCountLambda'
import { getFollowersCountHandler } from './lambda/GetFollowersCountLambda';
import { followHandler } from './lambda/FollowLambda';
import { unfollowHandler } from './lambda/UnfollowLambda';

/**
 * User Service Tests
 */
async function testLogin() {
  let req = new LoginRequest('username', 'password')
  console.log(JSON.stringify(req))
  console.log(await loginHandler(req))
}

async function testRegister() {
  let req = new RegisterRequest(
    'alias',
    'password',
    'firstName',
    'lastName',
    'image'
  )
  console.log(JSON.stringify(req))
  console.log(await registerHandler(req))
}

async function testLogout() {
  let req = new LogoutRequest(new AuthToken('token', 123))
  console.log(JSON.stringify(req))
  console.log(await logoutHandler(req))
}

async function testGetUserByAlias() {
  let req = new GetUserRequest(new AuthToken('token', 123), 'userAlias')
  console.log(JSON.stringify(req))
  console.log(await getUserHandler(req))
}

/**
 * Status Service Tests
 */
async function testLoadMoreFeedItems() {
  let req = new LoadMoreFeedItemsRequest(
    new AuthToken('token', 123),  // auth
    new User('user', 'name', 'hello', 'hello'),  // user
    5,  // pageSize
    new Status("sick!", new User("spencer", "hodson", "@user1", "user one"), 1) // lastItem
  );

  console.log(JSON.stringify(req));
  console.log(await loadMoreFeedItemsHandler(req));
}

async function testLoadMoreStoryItems() {
  let req = new LoadMoreStoryItemsRequest(
    new AuthToken('token', 123),  // auth
    new User('user', 'name', 'hello', 'hello'),  // user
    5,  // pageSize
    new Status("sick!", new User("spencer", "hodson", "@user1", "user one"), 1) // lastItem
  );

  console.log(JSON.stringify(req));
  console.log(await loadMoreStoryItemsHandler(req));
}

async function testPostStatus() {
  let req = new PostStatusRequest(
    new AuthToken('token', 123),
    new Status("sick!", new User("spencer", "hodson", "@user1", "user one"), 1),
  );
  console.log(JSON.stringify(req))
  console.log(await postStatusHandler(req));
}

/**
 * Follow Service Tests
 */
async function testLoadMoreFollowers() {
  let req = new LoadMoreFollowersRequest(
    new AuthToken('token', 123),  // auth
    new User('user', 'name', 'hello', 'hello'),  // user
    5,
    new User("spencer", "hodson", "@user1", "user one")
  )

  console.log(JSON.stringify(req));
  console.log(await loadMoreFollowersHandler(req));
}

async function testLoadMoreFollowees() {
  let req = new LoadMoreFolloweesRequest(
    new AuthToken('token', 123),  // auth
    new User('user', 'name', 'hello', 'hello'),  // user
    5,
    new User("spencer", "hodson", "@user1", "user one")
  )

  console.log(JSON.stringify(req));
  console.log(await loadMoreFolloweesHandler(req));
}

async function testGetIsFollowerStatus() {
  let req = new GetIsFollowerStatusRequest(
    new AuthToken('token', 123),
    new User('user1', 'name1', 'hello1', 'hello1'),
    new User('user2', 'name2', 'hello2', 'hello2')
  )
  console.log(JSON.stringify(req))
  console.log(await getIsFollowerStatusHandler(req))
}

async function testGetFolloweesCount() {
  let req = new GetFolloweesCountRequest(
    new AuthToken('token', 123),
    new User('user', 'name', 'hello', 'hello')
  )
  console.log(JSON.stringify(req))
  console.log(await getFolloweesCountHandler(req))
}

async function testGetFollowersCount() {
  let req = new GetFollowersCountRequest(
    new AuthToken('token', 123),
    new User('user', 'name', 'hello', 'hello')
  )
  console.log(JSON.stringify(req))
  console.log(await getFollowersCountHandler(req))
}

async function testFollow() {
  let req = new FollowRequest(
    new AuthToken('token', 123),
    new User('user', 'name', 'hello', 'hello')
  )
  console.log(JSON.stringify(req))
  console.log(await followHandler(req))
}

async function testUnfollow() {
  let req = new UnfollowRequest(
    new AuthToken('token', 123),
    new User('user', 'name', 'hello', 'hello')
  )
  console.log(JSON.stringify(req))
  console.log(await unfollowHandler(req))
}

async function testMain() {
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
}

testMain()
