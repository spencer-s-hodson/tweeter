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
}
