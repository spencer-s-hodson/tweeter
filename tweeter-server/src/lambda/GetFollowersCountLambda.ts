import { GetFollowersCountRequest, GetFollowersCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const getFollowersCountHandler = async (event: GetFollowersCountRequest): Promise<GetFollowersCountResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: GetFollowersCountRequest = GetFollowersCountRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new FollowService().getFollowersCount(deserializedEvent);
};
