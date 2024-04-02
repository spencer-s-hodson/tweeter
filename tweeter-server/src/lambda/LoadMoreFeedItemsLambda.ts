import { LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const loadMoreFeedItemsHandler = async (event: LoadMoreFeedItemsRequest): Promise<LoadMoreFeedItemsResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: LoadMoreFeedItemsRequest = LoadMoreFeedItemsRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new StatusService().loadMoreFeedItems(deserializedEvent);
};
