import { TweeterResponse } from "./TweeterResponse";

export class FollowResponse extends TweeterResponse {
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

  public static fromJson(json: FollowResponse): FollowResponse {
    interface IFollowResponse {
      _success: boolean
      _message: string | null
      _followeesCount: number;
      _followersCount: number;
    }

    let myObj: IFollowResponse = json as unknown as IFollowResponse;

    return new FollowResponse(
      myObj._success,
      myObj._message,
      myObj._followeesCount,
      myObj._followersCount
    );
  }
}
