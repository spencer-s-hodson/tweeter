import { GetUserRequest, GetUserResponse } from "tweeter-shared"
import { UserService } from "../model/service/UserService"

export const getUserHandler = async (event: GetUserRequest): Promise<GetUserResponse> => {
  console.log("Event before deserialization: " + JSON.stringify(event));
  const deserializedEvent: GetUserRequest = GetUserRequest.fromJson(event);
  console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
  return new UserService().getUser(deserializedEvent);
}
