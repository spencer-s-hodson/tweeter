import { LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const loadMoreFeedItemsHandler = async (event: LoadMoreFeedItemsRequest): Promise<LoadMoreFeedItemsResponse> => {
  const deserializedEvent: LoadMoreFeedItemsRequest = LoadMoreFeedItemsRequest.fromJson(event);
  return new StatusService().loadMoreFeedItems(deserializedEvent);
};
