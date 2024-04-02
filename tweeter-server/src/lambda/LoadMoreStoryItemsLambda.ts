import { LoadMoreStoryItemsRequest, LoadMoreStoryItemsResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const loadMoreStoryItemsHandler = async (event: LoadMoreStoryItemsRequest): Promise<LoadMoreStoryItemsResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: LoadMoreStoryItemsRequest = LoadMoreStoryItemsRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  const response = await new StatusService().loadMoreStoryItems(deserializedEvent);
  console.log("Reponse Returned From Lambda: " + JSON.stringify(response));
  return response;
}
