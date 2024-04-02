import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class GetIsFollowerStatusRequest extends TweeterRequest {
  private _authToken: AuthToken;
  private _user: User;
  private _selectedUser: User;

  public constructor(authToken: AuthToken, user: User, selectedUser: User) {
    super()
    this._authToken = authToken;
    this._user = user;
    this._selectedUser = selectedUser;
  }

  public get authToken() {
    return this._authToken;
  }

  public get user() {
    return this._user;
  }

  public get selectedUser() {
    return this._selectedUser;
  }

  public static fromJson(json: GetIsFollowerStatusRequest): GetIsFollowerStatusRequest {
    interface IGetIsFollowerStatusRequest {
      _authToken: AuthToken;
      _user: User;
      _selectedUser: User;
    }

    let myObj: IGetIsFollowerStatusRequest = json as unknown as IGetIsFollowerStatusRequest;


    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));
    const deserializedUser = User.fromJson(JSON.stringify(myObj._user));
    const deserializedSelectedUser = User.fromJson(JSON.stringify(myObj._selectedUser));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    if (deserializedUser == null) {
      throw new Error("bad user");
    }

    if (deserializedSelectedUser == null) {
      throw new Error("bad user");
    }

    return new GetIsFollowerStatusRequest(deserializedAuthToken, deserializedUser, deserializedSelectedUser);
  }
}