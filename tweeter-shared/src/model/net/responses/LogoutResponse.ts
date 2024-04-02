import { TweeterResponse } from "./TweeterResponse";

export class LogoutResponse extends TweeterResponse {
  public constructor(success: boolean, message: string | null) {
    super(success, message)
  }

  public static fromJson(json: LogoutResponse): LogoutResponse {
    interface ILogoutResponse {
      _success: boolean
      _message: string | null
    }

    let myObj: ILogoutResponse = json as unknown as ILogoutResponse;

    return new LogoutResponse(
      myObj._success,
      myObj._message
    );
  }
}
