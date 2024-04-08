import { AuthToken } from "../../domain/AuthToken";
import { TweeterRequest } from "./TweeterRequest";

export class LogoutRequest extends TweeterRequest {
  private _authToken: AuthToken

  public constructor(authToken: AuthToken) {
    super();
    this._authToken = authToken;
  }

  public get authToken() {
    return this._authToken;
  }

  public static fromJson(json: LogoutRequest) {
    interface ILogoutRequest {
      _authToken: AuthToken
    }

    let myObj: ILogoutRequest = json as unknown as ILogoutRequest;

    const deserializedAuthToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));

    if (deserializedAuthToken == null) {
      throw new Error("bad auth");
    }

    return new LogoutRequest(deserializedAuthToken);
  }
}
