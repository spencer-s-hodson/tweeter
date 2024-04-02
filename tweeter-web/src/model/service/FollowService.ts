import { AuthToken, FakeData, FollowRequest, FollowResponse, GetFolloweesCountRequest, GetFolloweesCountResponse, GetFollowersCountRequest, GetFollowersCountResponse, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, LoadMoreFolloweesRequest, LoadMoreFolloweesResponse, LoadMoreFollowersRequest, LoadMoreFollowersResponse, UnfollowRequest, UnfollowResponse, User } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreFollowers(authToken: AuthToken, user: User, pageSize: number, lastItem: User | null): Promise<[User[], boolean]> {
    const req: LoadMoreFollowersRequest = new LoadMoreFollowersRequest(authToken, user, pageSize, lastItem);
    const resp: LoadMoreFollowersResponse = await this.serverFacade.loadMoreFollowers(req);
    return [resp.userItems, resp.hasMore];
  };

  public async loadMoreFollowees(authToken: AuthToken, user: User, pageSize: number, lastItem: User | null): Promise<[User[], boolean]> {
    const req: LoadMoreFolloweesRequest = new LoadMoreFolloweesRequest(authToken, user, pageSize, lastItem);
    const resp: LoadMoreFolloweesResponse = await this.serverFacade.loadMoreFollowees(req);
    return [resp.userItems, resp.hasMore];
  };

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const req: GetIsFollowerStatusRequest = new GetIsFollowerStatusRequest(authToken, user, selectedUser);
    const resp: GetIsFollowerStatusResponse = await this.serverFacade.getIsFollowerStatus(req);
    return resp.isFollower;
  };

  public async getFolloweesCount(authToken: AuthToken, user: User): Promise<number> {
    const req: GetFolloweesCountRequest = new GetFolloweesCountRequest(authToken, user);
    const resp: GetFolloweesCountResponse = await this.serverFacade.getFolloweesCount(req);
    return resp.numOfFollowees;
  };

  public async getFollowersCount(authToken: AuthToken, user: User): Promise<number> {
    const req: GetFollowersCountRequest = new GetFollowersCountRequest(authToken, user);
    const resp: GetFollowersCountResponse = await this.serverFacade.getFollowersCount(req);
    return resp.numOfFollowers;
  };

  public async follow(authToken: AuthToken, userToFollow: User): Promise<[followersCount: number, followeesCount: number]> {
    const req: FollowRequest = new FollowRequest(authToken, userToFollow);
    const resp: FollowResponse = await this.serverFacade.follow(req);
    return [resp.followersCount, resp.followeesCount];
  };

  public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followersCount: number, followeesCount: number]> {
    const req: UnfollowRequest = new UnfollowRequest(authToken, userToUnfollow);
    const resp: UnfollowResponse = await this.serverFacade.unfollow(req);
    return [resp.followersCount, resp.followeesCount];
  };
}
