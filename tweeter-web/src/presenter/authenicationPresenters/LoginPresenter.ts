import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  // Login Presenter
  public checkSubmitButtonStatus(alias: string, password: string) {
    return !alias || !password;
  };

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string) {
    this.doAuthentication(() => this.service.login(alias, password), rememberMe, originalUrl)
  }

  protected getItemDesription(): string {
    return "log user in"
  };
};
