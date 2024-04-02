import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class GetUserResponse extends TweeterResponse {
  private _user: User | null

  constructor(success: boolean, message: string | null, user: User | null) {
    super(success, message);
    this._user = user;
  }

  public get user() {
    return this._user;
  }

  public static fromJson(json: GetUserResponse): GetUserResponse {
    interface IGetUserResponse {
      _success: boolean
      _message: string | null
      _user: User | null
    }

    let myObj: IGetUserResponse = json as unknown as IGetUserResponse;

    const deserializedUser = User.fromJson(JSON.stringify(myObj._user))

    if (deserializedUser === null) {
      throw new Error(
        "AuthenticateResponse, could not deserialize user with json:\n" +
          JSON.stringify(myObj._user)
      );
    }

    return new GetUserResponse(
      myObj._success,
      myObj._message,
      deserializedUser
    )
  }
}
