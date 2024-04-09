import { FakeData, FollowRequest, FollowResponse, GetFolloweesCountRequest, GetFolloweesCountResponse, GetFollowersCountRequest, GetFollowersCountResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, LoadMoreFolloweesRequest, LoadMoreFolloweesResponse, LoadMoreFollowersRequest, LoadMoreFollowersResponse, UnfollowRequest, UnfollowResponse, User } from "tweeter-shared";
import { Service } from "./Service";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { Factory } from "../../factory/Factory";
import { DataPage } from "../../entity/DataPage";
import { Follows } from "../../entity/Follows";
import { UserDAO } from "../../dao/interfaces/UserDAO";
import { stringify } from "uuid";

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
      const item: Follows = this.parseFollows(followsItem);
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
      const item: Follows = this.parseFollows(followsItem);
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
    const follows = this.parseFollows(dynamoFollows);
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
    await new Promise((f) => setTimeout(f, 2000));

    const followeesCountResponse: GetFolloweesCountResponse = await this.getFolloweesCount(new GetFolloweesCountRequest(request.authToken, request.userToFollow));
    const followersCountResponse: GetFollowersCountResponse = await this.getFollowersCount(new GetFollowersCountRequest(request.authToken, request.userToFollow));

    return new FollowResponse(true, "successfully followed a user", followeesCountResponse.numOfFollowees, followersCountResponse.numOfFollowers);
  };

  public async unfollow(request: UnfollowRequest): Promise<UnfollowResponse> {
    await new Promise((f) => setTimeout(f, 2000));

    const followeesCountResponse: GetFolloweesCountResponse = await this.getFolloweesCount(new GetFolloweesCountRequest(request.authToken, request.userToUnfollow));
    const followersCountResponse: GetFollowersCountResponse = await this.getFollowersCount(new GetFollowersCountRequest(request.authToken, request.userToUnfollow));

    return new UnfollowResponse(true, "successfully followed a user", followeesCountResponse.numOfFollowees, followersCountResponse.numOfFollowers);
  };


  private getCount(user: User | null, followers: boolean) {
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
    return followers ? dyanmoUser.followers : dyanmoUser.following;
  }
}
