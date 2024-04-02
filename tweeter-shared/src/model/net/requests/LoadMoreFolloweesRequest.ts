import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class LoadMoreFolloweesRequest extends TweeterRequest {
  private _authToken: AuthToken;
  private _user: User;
  private _pageSize: number;
  private _lastItem: User | null;

  public constructor(authToken: AuthToken, user: User, pageSize: number, lastItem: User | null) {
    super()
    this._authToken = authToken;
    this._user = user;
    this._pageSize = pageSize;
    this._lastItem = lastItem;
  }

  public get authToken() {
    return this._authToken;
  }

  public get user() {
    return this._user;
  }

  public get pageSize() {
    return this._pageSize;
  }

  public get lastItem() {
    return this._lastItem;
  }

  public static fromJson(json: LoadMoreFolloweesRequest) {
    interface ILoadMoreFolloweesRequest {
      _authToken: AuthToken
      _user: User
      _pageSize: number
      _lastItem: User | null
    }

    console.log("json before we type cast: " + JSON.stringify(json));

    let myObj: ILoadMoreFolloweesRequest = json as unknown as ILoadMoreFolloweesRequest;

    // DEBUGGING
    console.log("_authToken after casting: " + JSON.stringify(myObj._authToken));

    // auth stuff
    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));
    console.log("Deserialized _authToken: " + JSON.stringify(deserializedAuthToken));
    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    // user stuff
    const deserializedUser = User.fromJson(JSON.stringify(myObj._user));
    console.log("Deserialized _user: " + JSON.stringify(deserializedUser));
    if (deserializedUser == null) {
      throw new Error("bad user");
    }

    // lastItem Stuff
    let deserializedLastItem = null;
    if (myObj._lastItem != null) {
      deserializedLastItem = User.fromJson(JSON.stringify(myObj._lastItem));
    }
    console.log("Deserialized lastItem: " + JSON.stringify(deserializedLastItem));


    console.log("Return Request: " + JSON.stringify(new LoadMoreFolloweesRequest(deserializedAuthToken, deserializedUser, myObj._pageSize, deserializedLastItem)));
    return new LoadMoreFolloweesRequest(deserializedAuthToken, deserializedUser, myObj._pageSize, deserializedLastItem);
  }
}