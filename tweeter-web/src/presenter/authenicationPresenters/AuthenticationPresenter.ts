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

  public async doAuthentication(alias: string, password: string, rememberMe: boolean, firstName?: string, lastName?: string, imageBytes?: Uint8Array, url?: string): Promise<void> {
    this.doFailureReportingOperation(async () => {
      let [user, authToken] = await this.getOperation(alias, password, firstName, lastName, imageBytes);  // either service.login or service.register

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!url) {
        this.view.navigate(url);
      } else {
        this.view.navigate("/");
      };
    }, this.getItemDesription());
  };

  public abstract checkSubmitButtonStatus(alias: string, password: string, firstName?: string, lastName?: string, imageUrl?: string): boolean;

  protected abstract getOperation(alias: string, password: string, firstName?: string, lastName?: string, imageBytes?: Uint8Array): Promise<[User, AuthToken]>;

  protected abstract getItemDesription(): string;

  protected get view() {
    return super.view as AuthenticationView;
  };

  protected get service() {
    return this._service;
  };
};
