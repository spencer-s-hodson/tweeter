import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class UnfollowRequest extends TweeterRequest {
  private _authToken: AuthToken;
  private _userToUnfollow: User

  public constructor(authToken: AuthToken, userToUnfollow: User) {
    super();
    this._authToken = authToken;
    this._userToUnfollow = userToUnfollow;
  }

  public get authToken() {
    return this._authToken;
  }

  public get userToUnfollow() {
    return this._userToUnfollow;
  }

  public static fromJson(json: UnfollowRequest): UnfollowRequest {
    interface IUnfollowRequest {
      _authToken: AuthToken;
      _userToUnfollow: User
    }

    let myObj: IUnfollowRequest = json as unknown as IUnfollowRequest;

    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));
    const deserializedUserToUnfollow = User.fromJson(JSON.stringify(myObj._userToUnfollow));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    if (deserializedUserToUnfollow == null) {
      throw new Error("bad user");
    }

    return new UnfollowRequest(deserializedAuthToken, deserializedUserToUnfollow);
  }
}
