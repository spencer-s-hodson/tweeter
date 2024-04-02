import { TweeterResponse } from "./TweeterResponse";

export class GetIsFollowerStatusResponse extends TweeterResponse {
  private _isFollower: boolean

  public constructor(success: boolean, message: string | null, isFollower: boolean) {
    super(success, message);
    this._isFollower = isFollower;
  }

  public get isFollower() {
    return this._isFollower;
  }

  public static fromJson(json: GetIsFollowerStatusResponse) {
    interface IGetIsFollowerStatusResponse {
      _success: boolean
      _message: string | null
      _isFollower: boolean
    }

    let myObj: IGetIsFollowerStatusResponse = json as unknown as IGetIsFollowerStatusResponse;

    return new GetIsFollowerStatusResponse(
      myObj._success,
      myObj._message,
      myObj._isFollower
    )
  }
}
