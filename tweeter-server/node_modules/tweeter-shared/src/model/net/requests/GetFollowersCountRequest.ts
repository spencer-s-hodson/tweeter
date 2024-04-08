import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class GetFollowersCountRequest extends TweeterRequest {
  private _authToken: AuthToken;
  private _user: User

  public constructor(authToken: AuthToken, user: User) {
    super();
    this._authToken = authToken;
    this._user = user;
  }

  public get authToken() {
    return this._authToken;
  }

  public get user() {
    return this._user;
  }

  public static fromJson(json: GetFollowersCountRequest): GetFollowersCountRequest {
    interface IGetFollowersCountRequest {
      _authToken: AuthToken;
      _user: User
    }

    let myObj: IGetFollowersCountRequest = json as unknown as IGetFollowersCountRequest

    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));
    const deserializedUser = User.fromJson(JSON.stringify(myObj._user));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    if (deserializedUser == null) {
      throw new Error("bad user");
    }

    return new GetFollowersCountRequest(deserializedAuthToken, deserializedUser);
  }
}