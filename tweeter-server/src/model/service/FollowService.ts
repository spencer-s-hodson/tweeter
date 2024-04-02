import { FakeData, FollowRequest, FollowResponse, GetFolloweesCountRequest, GetFolloweesCountResponse, GetFollowersCountRequest, GetFollowersCountResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, LoadMoreFolloweesRequest, LoadMoreFolloweesResponse, LoadMoreFollowersRequest, LoadMoreFollowersResponse, UnfollowRequest, UnfollowResponse } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(request: LoadMoreFollowersRequest): Promise<LoadMoreFollowersResponse> {
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

    return new LoadMoreFollowersResponse(true, "successfully loaded more followers", userItems, hasMore);
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
}
