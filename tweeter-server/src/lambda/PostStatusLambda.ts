import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const postStatusHandler = async (event: PostStatusRequest): Promise<PostStatusResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: PostStatusRequest = PostStatusRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new StatusService().postStatus(deserializedEvent);
};
