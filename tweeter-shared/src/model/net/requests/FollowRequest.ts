import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class FollowRequest extends TweeterRequest {
  private _authToken: AuthToken;
  private _userToFollow: User

  public constructor(authToken: AuthToken, userToFollow: User) {
    super();
    this._authToken = authToken;
    this._userToFollow = userToFollow;
  }

  public get authToken() {
    return this._authToken;
  }

  public get userToFollow() {
    return this._userToFollow;
  }

  public static fromJson(json: FollowRequest): FollowRequest {
    interface IFollowRequest {
      _authToken: AuthToken;
      _userToFollow: User
    }

    let myObj: IFollowRequest = json as unknown as IFollowRequest;

    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));
    const deserializedUserToFollow = User.fromJson(JSON.stringify(myObj._userToFollow));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    if (deserializedUserToFollow == null) {
      throw new Error("bad user");
    }

    return new FollowRequest(deserializedAuthToken, deserializedUserToFollow);
  }
}
