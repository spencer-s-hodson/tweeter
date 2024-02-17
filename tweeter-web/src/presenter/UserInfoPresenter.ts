import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export default interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setIsFollower: (isFollower: boolean) => void;
  setFolloweesCount: (followeesCount: number) => void;
  setFollowersCount: (followersCount: number) => void;
  setDisplayedUser: (displayedUser: User) => void;
}

export class UserInfoPresenter {
  private _view: UserInfoView;
  private service: UserService;

  public constructor(view: UserInfoView) {
    this._view = view;
    this.service = new UserService();
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    try {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
          this._view.setIsFollower(await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!))
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public switchToLoggedInUser(displayedUser: User): void {
    this._view.setDisplayedUser(displayedUser);
  };

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      this._view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this._view.clearLastInfoMessage();
      this._view.setIsFollower(true);
      this._view.setFolloweesCount(followeesCount);
      this._view.setFollowersCount(followersCount);

    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    }
  };

  
  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      this._view.displayInfoMessage(
        `Removing ${displayedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this._view.clearLastInfoMessage();
      this._view.setIsFollower(false);
      this._view.setFolloweesCount(followeesCount);
      this._view.setFollowersCount(followersCount);

    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    }
  };
}
