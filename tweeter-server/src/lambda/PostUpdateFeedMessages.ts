import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: any): Promise<void> => {
  const result = PostStatusRequest.fromJson(JSON.parse(event.Records[0].body));
  const deserializedEvent: PostStatusRequest = PostStatusRequest.fromJson(result);
  new StatusService().postUpdateFeedMessages(deserializedEvent);
}
