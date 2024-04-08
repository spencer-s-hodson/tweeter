import { Status } from "../../domain/Status";
import { TweeterResponse } from "./TweeterResponse";

export class LoadMoreFeedItemsResponse extends TweeterResponse{
  private _statusItems: Status[];
  private _hasMore: boolean;

  public constructor(success: boolean, message: string | null, statusItems: Status[], hasMore: boolean) {
    super(success, message);
    this._statusItems = statusItems
    this._hasMore = hasMore;
  }

  public get statusItems() {
    return this._statusItems;
  }

  public get hasMore() {
    return this._hasMore;
  }

  public static fromJson(json: LoadMoreFeedItemsResponse): LoadMoreFeedItemsResponse {
    let array: Status[] = [];
    interface ILoadMoreFeedItemsResponse {
      _success: boolean
      _message: string | null
      _statusItems: Status[]
      _hasMore: boolean
    }

    console.log("json before we type cast: " + JSON.stringify(json));

    let myObj: ILoadMoreFeedItemsResponse = json as unknown as ILoadMoreFeedItemsResponse;
    console.log("myObj: " + JSON.stringify(myObj));

    // is this index or item?
    for (let i in myObj._statusItems) {
      let item = myObj._statusItems[i];
      if (item != null) {
        let deserializedItem = Status.fromJson(JSON.stringify(item));
        if (deserializedItem != null) {
          array.push(deserializedItem);
        }
      }
    }

    console.log("Array: " + array);

    return new LoadMoreFeedItemsResponse(
      myObj._success,
      myObj._message,
      array,
      myObj._hasMore
    );
  }
}
