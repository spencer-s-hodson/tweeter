import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { InfoMessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends InfoMessageView {
  clearUserInfo: () => void;
};

export class AppNavbarPresenter extends Presenter {
  private _service: UserService | null = null;

  public constructor(view: AppNavbarView) {
    super(view);
  };

  public async logOut(authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Logging Out...", 0);
      
      await this.service.logout(authToken);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, this.getItemDescription());
  };

  protected get view(): AppNavbarView {
    return super.view as AppNavbarView;
  };

  public get service(): UserService {
    if (this._service == null) {
      this._service = new UserService();
    }
    return this._service;
  }

  protected getItemDescription(): string {
    return "log user out"
  };
};
