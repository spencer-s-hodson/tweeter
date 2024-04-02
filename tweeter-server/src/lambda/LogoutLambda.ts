import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService"

export const logoutHandler = async (event: LogoutRequest): Promise<LogoutResponse> => {
  const deserializedEvent = LogoutRequest.fromJson(event);
  return new UserService().logout(deserializedEvent);
};
