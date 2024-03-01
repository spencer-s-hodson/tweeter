import { AuthToken, User } from "tweeter-shared";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  public checkSubmitButtonStatus(alias: string, password: string) {
    return !alias || !password;
  };

  protected async getOperation(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.service.login(alias, password);
  };

  protected getItemDesription(): string {
    return "log user in"
  };
};
