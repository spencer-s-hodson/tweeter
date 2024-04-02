import { LoadMoreFollowersRequest, LoadMoreFollowersResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const loadMoreFollowersHandler = async (event: LoadMoreFollowersRequest): Promise<LoadMoreFollowersResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent = LoadMoreFollowersRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new FollowService().loadMoreFollowers(deserializedEvent);
};
