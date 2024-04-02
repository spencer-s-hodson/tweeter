export class TweeterResponse {
  private _success: boolean;
  private _message: string | null;

  constructor(success: boolean, message: string | null = null) {
    this._success = success;
    this._message = message;
  }

  public get success() {
    return this._success;
  }

  public get message() {
    return this._message;
  }
}

export interface ResponseJson {
  _success: boolean;
  _message: string;
}
