import { AuthToken, FakeData, FollowRequest, FollowResponse, GetFolloweesCountRequest, GetFolloweesCountResponse, GetFollowersCountRequest, GetFollowersCountResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, LoadMoreFolloweesRequest, LoadMoreFolloweesResponse, LoadMoreFollowersRequest, LoadMoreFollowersResponse, UnfollowRequest, UnfollowResponse, User } from "tweeter-shared";
import { Service } from "./Service";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { Factory } from "../../factory/Factory";
import { DataPage } from "../../entity/DataPage";
import { Follows } from "../../entity/Follows";
import { UserDAO } from "../../dao/interfaces/UserDAO";

export class FollowService extends Service {
  private followsDAO: FollowsDAO;
  private userDAO: UserDAO;

  public constructor() {
    super()
    this.followsDAO = Factory.factory.getFollowsDAO();
    this.userDAO = Factory.factory.getUserDAO();
  }


  public async loadMoreFollowers(request: LoadMoreFollowersRequest): Promise<LoadMoreFollowersResponse> {
    // make sure the request is okay
    if (request.user == null || request.authToken == null) {
      throw new Error("Bad Request");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("Session Expired, please logout and log back in");
    }

    // no shot this is actually right lol
    const stuff: DataPage<Follows> = await this.followsDAO.getPageOfFollowers(request.user.alias, request.pageSize, request.lastItem?.alias);

    console.log("Stuff: " + JSON.stringify(stuff));

    const followsItems = stuff.items;
    const hasMore = stuff.hasMorePages;

    console.log("Follow Items: " + JSON.stringify(followsItems));
    console.log("Has More: " + JSON.stringify(hasMore));

    let users: User[] = []
    for (let followsItem of followsItems) {
      // parse followsItem
      const item: Follows = this.dynamoFollowsToFollows(followsItem);
      console.log("ITEM: " + JSON.stringify(item));
      // we are getting the followers so we get user by followerHandle
      const dynamoUser: User | null = await this.userDAO.getUser(item.follower_handle);

      // DEBUG
      console.log("DYNAO USER: " + JSON.stringify(dynamoUser));

      const user: User = this.dynamoUserToUser(dynamoUser);
      if (user == null) {
        throw new Error("This user does not exist!")
      }
      users.push(user);
    }

    return new LoadMoreFollowersResponse(true, "successfully loaded more followers", users, hasMore);
  };


  public async loadMoreFollowees(request: LoadMoreFolloweesRequest): Promise<LoadMoreFolloweesResponse> {
    // make sure the request is okay
    if (request.user == null || request.authToken == null) {
      throw new Error("Bad Request");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("Session Expired, please logout and log back in");
    }

    const stuff: DataPage<Follows> = await this.followsDAO.getPageOfFollowees(request.user.alias, request.pageSize, request.lastItem?.alias);

    const followsItems = stuff.items;
    const hasMore = stuff.hasMorePages;

    let users: User[] = []
    for (let followsItem of followsItems) {
      // parse followsItem
      const item: Follows = this.dynamoFollowsToFollows(followsItem);
      // we are getting the followers so we get user by followerHandle
      const dynamoUser: User | null = await this.userDAO.getUser(item.followee_handle);
      // then convert to actual user
      const user: User = this.dynamoUserToUser(dynamoUser);
      if (user == null) {
        throw new Error("This user does not exist!");
      }
      users.push(user);
    }

    return new LoadMoreFolloweesResponse(true, "successfully loaded more followers", users, hasMore);
  };

  public async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
    // make sure request is good
    if (!request.user || !request.selectedUser) {
      throw new Error("Bad Request");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("Bad AuthToken");
    }

    // get Follows
    const dynamoFollows: Follows = await this.followsDAO.getItem(request.user.alias, request.selectedUser.alias);
    const follows = this.dynamoFollowsToFollows(dynamoFollows);
    if (!follows) {
      return new GetIsFollowerStatusResponse(true, "selected user is not a follower", false);
    }
    else {
      return new GetIsFollowerStatusResponse(true, "selected user is a follower", true);
    }
  };

  public async getFolloweesCount(request: GetFolloweesCountRequest): Promise<GetFolloweesCountResponse> {
    // make sure the request is good
    if (!request.user) {
      throw new Error("Bad Request");
    }

    // is authenticated user
    if (!this.isValidAuthToken) {
      throw new Error("Bad Auth");
    }

    // get a user
    const dynamoUser = await this.userDAO.getUser(request.user.alias);

    const num = Number(this.getCount(dynamoUser, false));
    console.log(num);
    return new GetFolloweesCountResponse(true, "successfully got user's follower count", num);
  };


  public async getFollowersCount(request: GetFollowersCountRequest): Promise<GetFollowersCountResponse> {
    // make sure the request is good
    if (!request.user) {
      throw new Error("Bad Request");
    }

    // is authenticated user
    if (!this.isValidAuthToken) {
      throw new Error("Bad Auth");
    }

    // get a user
    const dynamoUser = await this.userDAO.getUser(request.user.alias);

    const num = Number(this.getCount(dynamoUser, true));
    console.log(num);
    return new GetFollowersCountResponse(true, "successfully got user's follower count", num);
  };


  public async follow(request: FollowRequest): Promise<FollowResponse> {
    // make sure request is good
    if (!request.userToFollow || !request.authToken) {
      throw new Error("Bad Request: ");
    }

    // validate authTokem
    if (!this.isValidAuthToken(request.authToken)) {
      return new FollowResponse(false, "AuthToken Expired, please sign in again", 0, 0);  // set it up so that everything retruns a tweeter response
    }

    /**
     * followerAlias = this is should be the username of the user that is going to follow someone
     * followeeAlias = this is shopuld be the username of the user that is going to be followed
     * 
     * EXAMPLE
     * followerAlias = @ClintEastwood
     * followeeAlias = @User0
     */
    const followerAlias: string = this.getAliasFromDynamoAuth(await this.authDAO.getAuth(request.authToken.token));
    const followeeAlias: string = request.userToFollow.alias;

    console.log("Follower Alias: " + followerAlias);
    console.log("Followee Alias: " + followeeAlias);

    // check to see if the user already is following the other use
    const dynamoFollows: Follows = await this.followsDAO.getItem(followerAlias, followeeAlias);
    if (dynamoFollows) {
      throw new Error(`${followerAlias} already follows ${followeeAlias}`);
    }

    // put a Follows object in DB, I'll have to rearrange the Auth table to it can keep track of users (get a user from the authtoken)
    await this.followsDAO.putItem(followerAlias, followeeAlias);

    // increment counts
    const followerCurrCount: number = Number(this.getCount(await this.userDAO.getUser(followeeAlias), true));
    const followeeCurrCount: number = Number(this.getCount(await this.userDAO.getUser(followerAlias), false));

    // const followerCurrCount: number = await this.followsDAO.getFollowersCount(followeeAlias); // User0's follower count
    // const followeeCurrCount: number = await this.followsDAO.getFolloweesCount(followerAlias); // ClintEastwood's following count

    console.log("Current Follower Count: " + followerCurrCount);
    console.log("Current Followee Count: " + followeeCurrCount);

    await this.userDAO.updateUser(followeeAlias, followerCurrCount + 1, true);  // User0's follower count +1
    await this.userDAO.updateUser(followerAlias, followeeCurrCount + 1, false); // ClintEastwood's following count + 1

    // return a response
    return new FollowResponse(true, "successfully followed a user", 0, 0);
  };


  public async unfollow(request: UnfollowRequest): Promise<UnfollowResponse> {
    // make sure request is good
    if (!request.userToUnfollow || !request.authToken) {
      throw new Error("Bad Request: ");
    }

    // validate authTokem
    if (!this.isValidAuthToken(request.authToken)) {
      return new UnfollowResponse(false, "AuthToken Expired, please sign in again", 0, 0);  // set it up so that everything retruns a tweeter response
    }

    /**
     * followerAlias = this is should be the username of the user that is going to follow someone
     * followeeAlias = this is shopuld be the username of the user that is going to be followed
     * 
     * EXAMPLE
     * followerAlias = @ClintEastwood
     * followeeAlias = @User0
     */
    const followerAlias: string = this.getAliasFromDynamoAuth(await this.authDAO.getAuth(request.authToken.token));
    const followeeAlias: string = request.userToUnfollow.alias;

    console.log("Follower Alias: " + followerAlias);
    console.log("Followee Alias: " + followeeAlias);

    // check to see if the user already is following the other use
    const dynamoFollows: Follows = await this.followsDAO.getItem(followerAlias, followeeAlias);
    if (!dynamoFollows) {
      throw new Error(`${followerAlias} already doesn't follow ${followeeAlias}`);
    }

    // delete a Follows object in DB, I'll have to rearrange the Auth table to it can keep track of users (get a user from the authtoken)
    await this.followsDAO.deleteItem(followerAlias, followeeAlias);

    // increment counts
    const followerCurrCount: number = Number(this.getCount(await this.userDAO.getUser(followeeAlias), true));
    const followeeCurrCount: number = Number(this.getCount(await this.userDAO.getUser(followerAlias), false));

    console.log("Current Follower Count: " + followerCurrCount);
    console.log("Current Followee Count: " + followeeCurrCount);

    await this.userDAO.updateUser(followeeAlias, followerCurrCount - 1, true);  // User0's follower count - 1
    await this.userDAO.updateUser(followerAlias, followeeCurrCount - 1, false); // ClintEastwood's following count - 1

    // return a response
    return new UnfollowResponse(true, "successfully followed a user", 0, 0);
  }


  private getCount(user: User | null, followers: boolean): number {
    interface DyanmoUser {
      user_first_name: string
      user_last_name: string
      user_alias: string
      user_password: string
      user_image: string
      following: string
      followers: string
    }
    const dyanmoUser: DyanmoUser = user as unknown as DyanmoUser;
    const response: string = followers ? dyanmoUser.followers : dyanmoUser.following;

    return Number(response);
  }

  
}
