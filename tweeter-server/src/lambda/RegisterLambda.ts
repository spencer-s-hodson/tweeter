import { RegisterRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export const registerHandler = async (event: RegisterRequest): Promise<AuthenticateResponse> => {
  const deserializedEvent: RegisterRequest = RegisterRequest.fromJson(event);
  return new UserService().register(deserializedEvent);
};
