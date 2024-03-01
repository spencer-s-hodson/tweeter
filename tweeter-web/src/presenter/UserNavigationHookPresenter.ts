import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationHookView extends View {
  setDisplayedUser: (user: User) => void;
};

export class UserNavigationHookPresenter extends Presenter {
  private service: UserService;

  public constructor(view: UserNavigationHookView) {
    super(view);
    this.service = new UserService();
  };

  public async navigateToUser(event: React.MouseEvent, currentUser: User, authToken: AuthToken): Promise<void> {
    event.preventDefault();
    this.doFailureReportingOperation(async() => {
      let alias = this.extractAlias(event.target.toString());

      let user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        };
      };
    }, this.getItemDescription());
  };

  public extractAlias(value: string): string {
    let index = value.indexOf("@");
    return value.substring(index);
  };

  protected getItemDescription(): string {
    return "get user";
  };

  protected get view(): UserNavigationHookView {
    return super.view as UserNavigationHookView;
  };
};
