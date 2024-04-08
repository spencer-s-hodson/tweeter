import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class LoadMoreFollowersResponse extends TweeterResponse {
  private _userItems: User[];
  private _hasMore: boolean;

  constructor(success: boolean, message: string | null, userItems: User[], hasMore: boolean) {
    super(success, message);
    this._userItems = userItems;
    this._hasMore = hasMore;
  }

  public get userItems() {
    return this._userItems;
  }

  public get hasMore() {
    return this._hasMore;
  }

  public static fromJson(json: LoadMoreFollowersResponse) {
    let array: User[] = [];
    interface ILoadMoreFollowersResponse {
      _success: boolean,
      _message: string | null,
      _userItems: User[],
      _hasMore: boolean
    }

    console.log("json before we type cast: " + JSON.stringify(json));

    let myObj: ILoadMoreFollowersResponse = json as unknown as ILoadMoreFollowersResponse;

    // is this index or item?
    for (let i in myObj._userItems) {
      let item = myObj._userItems[i];
      if (item != null) {
        let deserializedItem = User.fromJson(JSON.stringify(item));
        if (deserializedItem != null) {
          array.push(deserializedItem);
        }
      }
    }

    console.log(array);

    return new LoadMoreFollowersResponse(
      myObj._success,
      myObj._message,
      array,
      myObj._hasMore
    );
  }
}