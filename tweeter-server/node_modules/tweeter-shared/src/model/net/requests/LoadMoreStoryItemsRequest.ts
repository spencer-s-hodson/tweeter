import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class LoadMoreStoryItemsRequest extends TweeterRequest {
  private _authToken: AuthToken
  private _user: User
  private _pageSize: number
  private _lastItem: Status | null

  public constructor(authToken: AuthToken, user: User, pageSize: number, lastItem: Status | null) {
    super();
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

  public static fromJson(json: LoadMoreStoryItemsRequest): LoadMoreStoryItemsRequest {
    interface ILoadMoreStoryItemsRequest {
      _authToken: AuthToken
      _user: User
      _pageSize: number
      _lastItem: Status | null
    }

    console.log("json before we type cast: " + JSON.stringify(json));

    let myObj: ILoadMoreStoryItemsRequest = json as unknown as ILoadMoreStoryItemsRequest;

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
      deserializedLastItem = Status.fromJson(JSON.stringify(myObj._lastItem));
    }
    console.log("Deserialized lastItem: " + JSON.stringify(deserializedLastItem));
    console.log("Return Request: " + JSON.stringify(new LoadMoreStoryItemsRequest(deserializedAuthToken, deserializedUser, myObj._pageSize, deserializedLastItem)));
    return new LoadMoreStoryItemsRequest(deserializedAuthToken, deserializedUser, myObj._pageSize, deserializedLastItem);
  }
}
