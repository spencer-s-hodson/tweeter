import { LoadMoreFollowersRequest, LoadMoreFollowersResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const loadMoreFollowersHandler = async (event: LoadMoreFollowersRequest): Promise<LoadMoreFollowersResponse> => {
  const deserializedEvent = LoadMoreFollowersRequest.fromJson(event);
  return new FollowService().loadMoreFollowers(deserializedEvent);
};
