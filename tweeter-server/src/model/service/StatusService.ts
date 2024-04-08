import { FakeData, LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse, LoadMoreStoryItemsRequest, LoadMoreStoryItemsResponse, PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  // DAO's go up here
  
  public constructor() {
    super();
  }

  public async loadMoreFeedItems(request: LoadMoreFeedItemsRequest): Promise<LoadMoreFeedItemsResponse> {
    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }
    if (request.user == null) {
      throw new Error("Bad Request: User not found")
    }

    const [statusItems, hasMore] = FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);
    if (statusItems == null || hasMore == null) {
      throw new Error("Internal Server Error: Something went wrong when connecting to the database")
    }

    return new LoadMoreFeedItemsResponse(true, "successfully loaded more feed items", statusItems, hasMore);
  };

  public async loadMoreStoryItems(request: LoadMoreStoryItemsRequest): Promise<LoadMoreStoryItemsResponse> {
    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }
    if (request.user == null) {
      throw new Error("Bad Request: User not found")
    }

    const [statusItems, hasMore] = FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);
    if (statusItems == null || hasMore == null) {
      throw new Error("Internal Server Error: Something went wrong when connecting to the database")
    }    
    
    return new LoadMoreStoryItemsResponse(true, "successfully loaded more story items", statusItems, hasMore);
  };

  public async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }

    if (request.newStatus == null) {
      throw new Error("Bad Request: newStatus is null");
    }

    await new Promise((f) => setTimeout(f, 2000));
    return new PostStatusResponse(true, "successfuly posted status");
  };
}
