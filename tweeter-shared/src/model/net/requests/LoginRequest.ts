import { TweeterRequest } from "./TweeterRequest";

export class LoginRequest extends TweeterRequest {
  private _alias: string;
  private _password: string;

  public constructor(username: string, password: string) {
    super();
    this._alias = username;
    this._password = password;
  }

  public get alias() {
    return this._alias;
  }

  public get password() {
    return this._password;
  }

  public static fromJson(json: LoginRequest) {
    interface ILoginRequest {
      _alias: string
      _password: string
    }

    let myObj: ILoginRequest = json as unknown as ILoginRequest;

    return new LoginRequest(myObj._alias, myObj._password);
  }
}
