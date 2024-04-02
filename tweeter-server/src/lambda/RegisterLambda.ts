import { RegisterRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const registerHandler = async (event: RegisterRequest): Promise<AuthenticateResponse> => {
  return new UserService().register(event);
};
