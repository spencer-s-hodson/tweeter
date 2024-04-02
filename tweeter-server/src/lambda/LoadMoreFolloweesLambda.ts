import { LoadMoreFolloweesRequest, LoadMoreFolloweesResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const loadMoreFolloweesHandler = async (event: LoadMoreFolloweesRequest): Promise<LoadMoreFolloweesResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent = LoadMoreFolloweesRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new FollowService().loadMoreFollowees(deserializedEvent);
};
