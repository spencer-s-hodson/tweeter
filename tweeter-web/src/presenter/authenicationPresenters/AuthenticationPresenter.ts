import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "../Presenter";
import { UserService } from "../../model/service/UserService";

export interface AuthenticationView extends View {
  navigate: (url: string) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
};

export abstract class AuthenticationPresenter extends Presenter { 
  private _service: UserService;

  public constructor(view: AuthenticationView) {
    super(view);
    this._service = new UserService();
  };

  public async doAuthentication(operation: () => Promise<[User, AuthToken]>, rememberMe: boolean, url: string): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const [user, authToken] = await operation();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!url) {
        this.view.navigate(url);
      } else {
        this.view.navigate("/");
      };
    }, this.getItemDesription());
  };

  // Authentication Presenter
  public abstract checkSubmitButtonStatus(alias: string, password: string, firstName?: string, lastName?: string, imageUrl?: string): boolean;

  protected abstract getItemDesription(): string;

  protected get view() {
    return super.view as AuthenticationView;
  };

  protected get service() {
    return this._service;
  };
};
