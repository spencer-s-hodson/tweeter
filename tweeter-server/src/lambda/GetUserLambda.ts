import { GetUserRequest, GetUserResponse } from "tweeter-shared"
import { UserService } from "../model/service/UserService"

export const getUserHandler = async (event: GetUserRequest): Promise<GetUserResponse> => {
  const deserializedEvent: GetUserRequest = GetUserRequest.fromJson(event);
  return new UserService().getUser(deserializedEvent);
}
