import { TweeterResponse } from "./TweeterResponse";

export class UnfollowResponse extends TweeterResponse {
  private _followeesCount: number;
  private _followersCount: number;

  public constructor(success: boolean, message: string | null, followeesCount: number, followersCount: number) {
    super(success, message);
    this._followeesCount = followeesCount;
    this._followersCount = followersCount;
  }

  public get followeesCount() {
    return this._followeesCount;
  }

  public get followersCount() {
    return this._followersCount;
  }

  public static fromJson(json: UnfollowResponse): UnfollowResponse {
    interface IUnfollowResponse {
      _success: boolean
      _message: string | null
      _followeesCount: number;
      _followersCount: number;
    }

    let myObj: IUnfollowResponse = json as unknown as IUnfollowResponse;

    return new UnfollowResponse(
      myObj._success,
      myObj._message,
      myObj._followeesCount,
      myObj._followersCount
    );
  }
}
