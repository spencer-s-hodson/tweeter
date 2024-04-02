import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const getIsFollowerStatusHandler = async (event: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: GetIsFollowerStatusRequest = GetIsFollowerStatusRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new FollowService().getIsFollowerStatus(deserializedEvent);
}
