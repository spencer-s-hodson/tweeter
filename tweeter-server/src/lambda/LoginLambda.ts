import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const loginHandler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
  const deserializedEvent: LoginRequest = LoginRequest.fromJson(event);
  return new UserService().login(deserializedEvent);
};
