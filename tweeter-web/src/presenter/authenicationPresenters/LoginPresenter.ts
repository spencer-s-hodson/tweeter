import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface LoginView {
  navigate: (url: string) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  displayErrorMessage: (message: string) => void;
  
}

export class LoginPresenter {
  private view: LoginView;
  private service: UserService;

  public constructor(view: LoginView) {
    this.view = view;
    this.service = new UserService();
  }

  public async doLogin(alias: string, password: string, url: string, rememberMe: boolean) {
    try {
      let [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!url) {
        this.view.navigate(url);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  };

  public checkSubmitButtonStatus(alias: string, password: string) {
    return !alias || !password;
  }
};