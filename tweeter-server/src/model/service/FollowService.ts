import { FollowRequest, FollowResponse, GetFolloweesCountRequest, GetFolloweesCountResponse, GetFollowersCountRequest, GetFollowersCountResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, LoadMoreFolloweesRequest, LoadMoreFolloweesResponse, LoadMoreFollowersRequest, LoadMoreFollowersResponse, UnfollowRequest, UnfollowResponse, User } from "tweeter-shared";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { Factory } from "../../factory/Factory";
import { DataPage } from "../../entity/DataPage";
import { Follows } from "../../entity/Follows";
import { AuthService } from "./AuthService";

export class FollowService extends AuthService {
  private followsDAO: FollowsDAO;


  public constructor() {
    super()
    this.followsDAO = Factory.factory.getFollowsDAO();
  }


  public async loadMoreFollowers(request: LoadMoreFollowersRequest): Promise<LoadMoreFollowersResponse> {
    // make sure the request is okay
    if (!request.user || !request.authToken) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    // get the page of followers
    const stuff: DataPage<Follows> = await this.followsDAO.getPageOfFollowers(request.user.alias, request.pageSize, request.lastItem?.alias);

    const followsItems = stuff.items;
    const hasMore = stuff.hasMorePages;

    let users: User[] = []
    for (let followsItem of followsItems) {
      const item: Follows = this.dynamoFollowsToFollows(followsItem);
      const dynamoUser: User | null = await this.userDAO.getUser(item.follower_handle);

      const user: User = this.dynamoUserToUser(dynamoUser);
      if (user == null) {
        throw new Error("[Internal Server Error]: Failed to retrieve an existing user")
      }
      users.push(user);
    }

    return new LoadMoreFollowersResponse(true, "successfully loaded more followers", users, hasMore);
  };


  public async loadMoreFollowees(request: LoadMoreFolloweesRequest): Promise<LoadMoreFolloweesResponse> {
    // make sure the request is okay
    if (!request.user || !request.authToken) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    const stuff: DataPage<Follows> = await this.followsDAO.getPageOfFollowees(request.user.alias, request.pageSize, request.lastItem?.alias);

    const followsItems = stuff.items;
    const hasMore = stuff.hasMorePages;

    let users: User[] = []
    for (let followsItem of followsItems) {
      const item: Follows = this.dynamoFollowsToFollows(followsItem);
      const dynamoUser: User | null = await this.userDAO.getUser(item.followee_handle);
      const user: User = this.dynamoUserToUser(dynamoUser);
      if (user == null) {
        throw new Error("[Internal Server Error]: This user does not exist!");
      }
      users.push(user);
    }

    return new LoadMoreFolloweesResponse(true, "successfully loaded more followers", users, hasMore);
  };

  public async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
    // make sure request is good
    if (!request.user || !request.selectedUser) {
      throw new Error("Bad Request: Please enter all information");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
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
      throw new Error("[Bad Request]: Please enter all information");
    }

    // is authenticated user
    if (!this.isValidAuthToken) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    // get a user
    const dynamoUser = await this.userDAO.getUser(request.user.alias);

    const num = Number(this.getCount(dynamoUser, false));
    return new GetFolloweesCountResponse(true, "successfully got user's follower count", num);
  };


  public async getFollowersCount(request: GetFollowersCountRequest): Promise<GetFollowersCountResponse> {
    // make sure the request is good
    if (!request.user) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // is authenticated user
    if (!this.isValidAuthToken) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    // get a user
    const dynamoUser = await this.userDAO.getUser(request.user.alias);

    const num = Number(this.getCount(dynamoUser, true));
    return new GetFollowersCountResponse(true, "successfully got user's follower count", num);
  };


  public async follow(request: FollowRequest): Promise<FollowResponse> {
    // make sure request is good
    if (!request.userToFollow || !request.authToken) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // validate authTokem
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    const followerAlias: string = this.getAliasFromDynamoAuth(await this.authDAO.getAuth(request.authToken.token));
    const followeeAlias: string = request.userToFollow.alias;

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

    await this.userDAO.updateUser(followeeAlias, followerCurrCount + 1, true);  // User0's follower count +1
    await this.userDAO.updateUser(followerAlias, followeeCurrCount + 1, false); // ClintEastwood's following count + 1

    // return a response
    return new FollowResponse(
      true,
      "successfully followed a user",
      Number(this.getCount(await this.userDAO.getUser(followeeAlias), false)),
      Number(this.getCount(await this.userDAO.getUser(followeeAlias), true))
    );
  };


  public async unfollow(request: UnfollowRequest): Promise<UnfollowResponse> {
    // make sure request is good
    if (!request.userToUnfollow || !request.authToken) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // validate authTokem
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    const followerAlias: string = this.getAliasFromDynamoAuth(await this.authDAO.getAuth(request.authToken.token));
    const followeeAlias: string = request.userToUnfollow.alias;

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

    await this.userDAO.updateUser(followeeAlias, followerCurrCount - 1, true);  // User0's follower count - 1
    await this.userDAO.updateUser(followerAlias, followeeCurrCount - 1, false); // ClintEastwood's following count - 1

    // return a response
    return new UnfollowResponse(
      true,
      "successfully followed a user",
      Number(this.getCount(await this.userDAO.getUser(followeeAlias), false)),
      Number(this.getCount(await this.userDAO.getUser(followeeAlias), true))
    );
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
