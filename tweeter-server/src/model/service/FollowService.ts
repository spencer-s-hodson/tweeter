import { FakeData, FollowRequest, FollowResponse, GetFolloweesCountRequest, GetFolloweesCountResponse, GetFollowersCountRequest, GetFollowersCountResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, LoadMoreFolloweesRequest, LoadMoreFolloweesResponse, LoadMoreFollowersRequest, LoadMoreFollowersResponse, UnfollowRequest, UnfollowResponse, User } from "tweeter-shared";
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

  // MAKE SURE THIS RECURSES
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

      // DEBUG
      console.log("Follows After Parsing: " + item);

      // we are getting the followers so we get user by followerHandle
      // problem: this is return the shape of a dyamo user (put these functions in the DAO's!)
      const user: User | null = await this.userDAO.getUser(item.follower_handle)  // does this violate anything?
      console.log("THE USER: " + JSON.stringify(user));
      if (user == null) {
        throw new Error("This user does not exist!")
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

    return new LoadMoreFollowersResponse(true, "successfully loaded more followers", users, hasMore);
  };

  public async loadMoreFollowees(request: LoadMoreFolloweesRequest): Promise<LoadMoreFolloweesResponse> {
    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }
    if (request.user == null) {
      throw new Error("Bad Request: User not found")
    }

    const [userItems, hasMore] = FakeData.instance.getPageOfUsers(request.lastItem, request.pageSize, request.user);
    if (userItems == null || hasMore == null) {
      throw new Error("Internal Server Error: Something went wrong when connecting to the database")
    }   
    
    return new LoadMoreFolloweesResponse(true, "successfully loaded more followers", userItems, hasMore);
  };

  public async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
    return new GetIsFollowerStatusResponse(true, "successfully determined whether the selceted user is a follower or not", FakeData.instance.isFollower());
  };

  public async getFolloweesCount(request: GetFolloweesCountRequest): Promise<GetFolloweesCountResponse> {
    const followeeCount = await FakeData.instance.getFolloweesCount(request.user)
    return new GetFolloweesCountResponse(true, "successfully got user's followee count", followeeCount);
  };

  public async getFollowersCount(request: GetFollowersCountRequest): Promise<GetFollowersCountResponse> {
    const followerCount = await FakeData.instance.getFollowersCount(request.user);
    return new GetFollowersCountResponse(true, "successfully got user's follower count", followerCount);
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


  private parseFollows(follows: Follows) {
    // this needs to match what the incoming object looks like (idk why this is backwards)
    interface IFollows {
      followee_handle: string
      followee_name: string
      follower_handle: string
      follower_name: string
    }

    const myObj: IFollows = follows as unknown as IFollows;

    // this needs to match the constructor of the Follows class
    return new Follows(
      myObj.follower_handle,
      myObj.follower_name,
      myObj.followee_handle,
      myObj.followee_name
    )
  }
}
