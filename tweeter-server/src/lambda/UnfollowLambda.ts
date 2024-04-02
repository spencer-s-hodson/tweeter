import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const unfollowHandler = async (event: UnfollowRequest): Promise<UnfollowResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: UnfollowRequest = UnfollowRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new FollowService().unfollow(deserializedEvent);
}
