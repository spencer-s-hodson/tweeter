import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { TweeterRequest } from "./TweeterRequest";

export class PostStatusRequest extends TweeterRequest {
  private _authToken: AuthToken;
  private _newStatus: Status;

  public constructor(authToken: AuthToken, newStatus: Status) {
    super()
    this._authToken = authToken;
    this._newStatus = newStatus;
  }

  public get authToken() {
    return this._authToken;
  }

  public get newStatus() {
    return this._newStatus;
  }

  public static fromJson(json: PostStatusRequest): PostStatusRequest {
    interface IPostStatusRequest {
      _authToken: AuthToken;
      _newStatus: Status;
    }

    let myObj: IPostStatusRequest = json as unknown as IPostStatusRequest;

    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));
    const deserializedNewStatus = Status.fromJson(JSON.stringify(myObj._newStatus));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    if (deserializedNewStatus == null) {
      throw new Error("bad user");
    }

    return new PostStatusRequest(deserializedAuthToken, deserializedNewStatus);
  }
}
