import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class LoadMoreFolloweesResponse extends TweeterResponse {
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

  public static fromJson(json: LoadMoreFolloweesResponse) {
    let array: User[] = [];
    interface ILoadMoreFolloweesResponse {
      _success: boolean,
      _message: string | null,
      _userItems: User[],
      _hasMore: boolean
    }

    let myObj: ILoadMoreFolloweesResponse = json as unknown as ILoadMoreFolloweesResponse;

    for (let i in myObj._userItems) {
      let item = myObj._userItems[i];
      if (item != null) {
        let deserializedItem = User.fromJson(JSON.stringify(item));
        if (deserializedItem != null) {
          array.push(deserializedItem);
        }
      }
    }

    return new LoadMoreFolloweesResponse(
      myObj._success,
      myObj._message,
      array,
      myObj._hasMore
    );
  }
}
