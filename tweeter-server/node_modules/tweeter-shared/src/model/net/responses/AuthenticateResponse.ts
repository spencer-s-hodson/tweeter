import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class AuthenticateResponse extends TweeterResponse {
  private _user: User;
  private _authToken: AuthToken

  constructor(succcess: boolean, message: string | null, user: User, authToken: AuthToken) {
    super(succcess, message)
    this._user = user;
    this._authToken = authToken;
  }

  public get user() {
    return this._user
  }

  public get authToken() {
    return this._authToken
  }

  public static fromJson(json: AuthenticateResponse): AuthenticateResponse {
    interface IAuthenticateResponse {
      _success: boolean
      _message: string | null
      _user: User
      _authToken: AuthToken
    }

    let myObj: IAuthenticateResponse = json as unknown as IAuthenticateResponse;

    const deserializedUser = User.fromJson(JSON.stringify(myObj._user));
    const deserializedToken = AuthToken.fromJson(JSON.stringify(myObj._authToken));

    if (deserializedUser === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(JSON.stringify(myObj._user))
      );
    }

    if (deserializedToken === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize token with json:\n" +
          JSON.stringify(JSON.stringify(myObj._authToken))
      );
    }

    return new AuthenticateResponse(
      myObj._success,
      myObj._message,
      deserializedUser,
      deserializedToken
    );
  }
}
