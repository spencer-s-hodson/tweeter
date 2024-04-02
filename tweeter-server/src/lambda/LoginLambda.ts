import { AuthenticateResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const loginHandler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
  return new UserService().login(event);
};
