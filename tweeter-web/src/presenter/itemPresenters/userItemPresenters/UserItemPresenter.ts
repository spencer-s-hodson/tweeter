import { User } from "tweeter-shared";
import { View } from "../../Presenter";
import { PagedItemPresenter } from "../PagedItemPresenter";
import { FollowService } from "../../../model/service/FollowService";

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
  protected createService(): FollowService {
    return new FollowService();
  };
};
