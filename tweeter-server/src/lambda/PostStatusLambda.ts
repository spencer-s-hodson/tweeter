import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const postStatusHandler = async (event: PostStatusRequest): Promise<PostStatusResponse> => {
  const deserializedEvent: PostStatusRequest = PostStatusRequest.fromJson(event);
  const result = await new StatusService().postStatus(deserializedEvent);

  // if (result.success) {
  //   // send message to the first queue
  //   await this.sqs.sendMessage(JSON.stringify(request), POST_STATUS_QUEUE);
  // }

  return result;
};
