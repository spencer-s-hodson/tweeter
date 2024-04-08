import { AuthenticateResponse, 
  FollowRequest, FollowResponse, 
  GetFolloweesCountRequest, 
  GetFolloweesCountResponse, 
  GetFollowersCountRequest, 
  GetFollowersCountResponse, 
  GetIsFollowerStatusRequest, 
  GetIsFollowerStatusResponse, 
  GetUserRequest, 
  GetUserResponse, 
  LoadMoreFeedItemsRequest, 
  LoadMoreFeedItemsResponse, 
  LoadMoreFolloweesRequest, 
  LoadMoreFolloweesResponse, 
  LoadMoreFollowersRequest, 
  LoadMoreFollowersResponse, 
  LoadMoreStoryItemsRequest, 
  LoadMoreStoryItemsResponse, 
  LoginRequest, 
  LogoutRequest, 
  LogoutResponse, 
  PostStatusRequest, 
  PostStatusResponse, 
  RegisterRequest, 
  UnfollowRequest, 
  UnfollowResponse 
} from "tweeter-shared";

import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {

  private SERVER_URL = "https://zln97u7tt0.execute-api.us-west-2.amazonaws.com/Tweeter";

  private clientCommunicator;

  public constructor() {
    this.clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  }

  async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "/auth/login";
    const response: AuthenticateResponse = await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint);
    return AuthenticateResponse.fromJson(response);
  }

  async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    const endpoint = "/auth/register";
    const response: AuthenticateResponse = await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
    return AuthenticateResponse.fromJson(response);
   
  }

  async logut(request: LogoutRequest): Promise<LogoutResponse> {
    const endpoint = "/auth/logout";
    const response: LogoutResponse = await this.clientCommunicator.doPost<LogoutRequest, LogoutResponse>(request, endpoint);
    return LogoutResponse.fromJson(response);
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const endpoint = "/get/user";
    const response: GetUserResponse = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, endpoint);
    return GetUserResponse.fromJson(response);
  }

  async loadMoreFeedItems(request: LoadMoreFeedItemsRequest): Promise <LoadMoreFeedItemsResponse> {
    const endpoint = "/get/feed";
    const response: LoadMoreFeedItemsResponse = await this.clientCommunicator.doPost<LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse>(request, endpoint);
    return LoadMoreFeedItemsResponse.fromJson(response);
  }

  async loadMoreStoryItems(request: LoadMoreStoryItemsRequest): Promise <LoadMoreStoryItemsResponse> {
    const endpoint = "/get/story";
    const response: LoadMoreStoryItemsResponse = await this.clientCommunicator.doPost<LoadMoreStoryItemsRequest, LoadMoreStoryItemsResponse>(request, endpoint);
    return LoadMoreStoryItemsResponse.fromJson(response);
  }

  async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
    const endpoint = "/get/postStatus";
    const response: PostStatusResponse = await this.clientCommunicator.doPost<PostStatusRequest, PostStatusResponse>(request, endpoint);
    return PostStatusResponse.fromJson(response);
  }

  async loadMoreFollowers(request: LoadMoreFollowersRequest): Promise <LoadMoreFollowersResponse> {
    const endpoint = "/get/followers";
    const response: LoadMoreFollowersResponse = await this.clientCommunicator.doPost<LoadMoreFollowersRequest, LoadMoreFollowersResponse>(request, endpoint);
    return LoadMoreFollowersResponse.fromJson(response);
  }

  async loadMoreFollowees(request: LoadMoreFolloweesRequest): Promise <LoadMoreFolloweesResponse> {
    const endpoint = "/get/followees";
    const response: LoadMoreFolloweesResponse = await this.clientCommunicator.doPost<LoadMoreFolloweesRequest, LoadMoreFolloweesResponse>(request, endpoint);
    return LoadMoreFolloweesResponse.fromJson(response);
  }

  async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
    const endpoint = "/get/isFollower";
    const response: GetIsFollowerStatusResponse = await this.clientCommunicator.doPost<GetIsFollowerStatusRequest, GetIsFollowerStatusResponse>(request, endpoint);
    return GetIsFollowerStatusResponse.fromJson(response);
  }

  async getFollowersCount(request: GetFollowersCountRequest): Promise<GetFollowersCountResponse> {
    const endpoint = "/get/followersCount";
    const response: GetFollowersCountResponse = await this.clientCommunicator.doPost<GetFollowersCountRequest, GetFollowersCountResponse>(request, endpoint);
    return GetFollowersCountResponse.fromJson(response);
  }

  async getFolloweesCount(request: GetFolloweesCountRequest): Promise<GetFolloweesCountResponse> {
    const endpoint = "/get/followeesCount";
    const response: GetFolloweesCountResponse = await this.clientCommunicator.doPost<GetFolloweesCountRequest, GetFolloweesCountResponse>(request, endpoint);
    return GetFolloweesCountResponse.fromJson(response);
  }
  
  async follow(request: FollowRequest): Promise<FollowResponse> {
    const endpoint = "/follow";
    const response: FollowResponse = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(request, endpoint);
    return FollowResponse.fromJson(response);
  }

  async unfollow(request: UnfollowRequest): Promise<UnfollowResponse> {
    const endpoint = "/unfollow";
    const response: UnfollowResponse = await this.clientCommunicator.doPost<UnfollowRequest, UnfollowResponse>(request, endpoint);
    return UnfollowResponse.fromJson(response);
  }
}
