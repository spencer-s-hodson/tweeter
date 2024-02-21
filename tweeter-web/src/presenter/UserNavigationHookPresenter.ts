import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationHookView {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class UserNavigationHookPresenter {
  private view: UserNavigationHookView;
  private service: UserService;

  public constructor(view: UserNavigationHookView) {
    this.view = view;
    this.service = new UserService();
  };

  public async navigateToUser(event: React.MouseEvent, currentUser: User, authToken: AuthToken): Promise<void> {
    event.preventDefault();

    try {
      let alias = this.extractAlias(event.target.toString());

      let user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  public extractAlias(value: string): string {
    let index = value.indexOf("@");
    return value.substring(index);
  };
};
