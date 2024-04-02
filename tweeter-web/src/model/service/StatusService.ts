import { AuthToken, LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse, LoadMoreStoryItemsRequest, LoadMoreStoryItemsResponse, PostStatusRequest, PostStatusResponse, Status, User } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreFeedItems(authToken: AuthToken, user: User, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
    const req: LoadMoreFeedItemsRequest = new LoadMoreFeedItemsRequest(authToken, user, pageSize, lastItem);
    console.log("REQUEST HERE: " + JSON.stringify(req));
    const resp: LoadMoreFeedItemsResponse = await this.serverFacade.loadMoreFeedItems(req);
    console.log("RESPONSE HERE: " + JSON.stringify(resp));
    return [resp.statusItems, resp.hasMore];
  };

  public async loadMoreStoryItems(authToken: AuthToken, user: User, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
    const req: LoadMoreStoryItemsRequest = new LoadMoreStoryItemsRequest(authToken, user, pageSize, lastItem);
    console.log("REQUEST HERE: " + JSON.stringify(req));
    const resp: LoadMoreStoryItemsResponse = await this.serverFacade.loadMoreStoryItems(req);
    console.log("RESPONSE HERE: " + JSON.stringify(resp));
    return [resp.statusItems, resp.hasMore];
  };

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const req: PostStatusRequest = new PostStatusRequest(authToken, newStatus);
    const resp: PostStatusResponse = await this.serverFacade.postStatus(req);
  };
}
