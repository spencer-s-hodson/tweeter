import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { InfoMessageView, Presenter } from "./Presenter";

export interface LogoutView extends InfoMessageView {
  clearUserInfo: () => void;
};

export class LogoutPresenter extends Presenter {
  private service: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this.service = new UserService();
  };

  public async logOut(authToken: AuthToken) {
    this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Logging Out...", 0);
      
      await this.service.logout(authToken);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, this.getItemDescription());
  };

  protected get view(): LogoutView {
    return super.view as LogoutView;
  };

  protected getItemDescription(): string {
    return "log user out"
  };
};
