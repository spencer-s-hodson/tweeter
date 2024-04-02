import { AuthToken } from "../../domain/AuthToken";
import { TweeterRequest } from "./TweeterRequest";

export class GetUserRequest extends TweeterRequest {
  private _authToken: AuthToken
  private _alias: string

  public constructor(authToken: AuthToken, alias: string) {
    super()
    this._authToken = authToken;
    this._alias = alias;
  }

  public get authToken() {
    return this._authToken;
  }

  public get alias() {
    return this._alias;
  }

  public static fromJson(json: GetUserRequest) {
    interface IGetUserRequest {
      _authToken: AuthToken
      _alias: string
    }

    let myObj: IGetUserRequest = json as unknown as IGetUserRequest;

    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    return new GetUserRequest(deserializedAuthToken, myObj._alias);
  }
}
