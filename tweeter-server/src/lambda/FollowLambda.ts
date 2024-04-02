import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const followHandler = async (event: FollowRequest): Promise<FollowResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent = FollowRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new FollowService().follow(deserializedEvent);
}
