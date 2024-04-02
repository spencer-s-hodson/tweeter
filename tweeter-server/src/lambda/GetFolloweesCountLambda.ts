import { GetFolloweesCountRequest, GetFolloweesCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const getFolloweesCountHandler = async (event: GetFolloweesCountRequest): Promise<GetFolloweesCountResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: GetFolloweesCountRequest = GetFolloweesCountRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new FollowService().getFolloweesCount(deserializedEvent);
};
