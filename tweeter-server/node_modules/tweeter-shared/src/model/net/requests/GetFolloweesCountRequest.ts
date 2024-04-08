import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class GetFolloweesCountRequest extends TweeterRequest {
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

  public static fromJson(json: GetFolloweesCountRequest): GetFolloweesCountRequest {
    interface IGetFolloweesCountRequest {
      _authToken: AuthToken;
      _user: User
    }

    let myObj: IGetFolloweesCountRequest = json as unknown as IGetFolloweesCountRequest

    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));
    const deserializedUser = User.fromJson(JSON.stringify(myObj._user));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    if (deserializedUser == null) {
      throw new Error("bad user");
    }

    return new GetFolloweesCountRequest(deserializedAuthToken, deserializedUser);
  }
}