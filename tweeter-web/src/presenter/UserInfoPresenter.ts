import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { InfoMessageView, Presenter } from "./Presenter";

export default interface UserInfoView extends InfoMessageView { 
  setIsFollower: (isFollower: boolean) => void;
  setFolloweesCount: (followeesCount: number) => void;
  setFollowersCount: (followersCount: number) => void;
  setDisplayedUser: (displayedUser: User) => void;
};

export class UserInfoPresenter extends Presenter {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User): Promise<void> {
    this.doFailureReportingOperation(async() => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
          this.view.setIsFollower(await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
      };
    }, "determine follower status");
  };

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.doFailureReportingOperation(async() => {
      this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
    }, "get followees count");
  };

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.doFailureReportingOperation(async() => {
      this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
    }, "get followers count");
  };

  public switchToLoggedInUser(displayedUser: User): void {
    this.view.setDisplayedUser(displayedUser);
  };

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {

    this.doFailureReportingOperation(async() => {
      this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);
      let [followersCount, followeesCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );
      this.view.clearLastInfoMessage();
      this.view.setIsFollower(true);
      this.view.setFolloweesCount(followeesCount);
      this.view.setFollowersCount(followersCount);
    }, "follow user");
  };


  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {

    this.doFailureReportingOperation(async() => {
      this.view.displayInfoMessage(
        `Removing ${displayedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();
      this.view.setIsFollower(false);
      this.view.setFolloweesCount(followeesCount);
      this.view.setFollowersCount(followersCount);
    }, "unfollow user");
  };

  protected get view(): UserInfoView {
    return super.view as UserInfoView;
  };
};
