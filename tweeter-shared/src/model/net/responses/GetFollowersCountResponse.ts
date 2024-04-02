import { TweeterResponse } from "./TweeterResponse";

export class GetFollowersCountResponse extends TweeterResponse {
  private _numOfFollowers: number;

  public constructor(success: boolean, message: string | null, numOfFollowers: number) {
    super(success, message);
    this._numOfFollowers = numOfFollowers;
  }

  public get numOfFollowers() {
    return this._numOfFollowers;
  }

  public static fromJson(json: GetFollowersCountResponse): GetFollowersCountResponse {
    interface IGetFollowersCountResponse {
      _success: boolean
      _message: string | null
      _numOfFollowers: number
    }

    let myObj: IGetFollowersCountResponse = json as unknown as IGetFollowersCountResponse;

    return new GetFollowersCountResponse(
      myObj._success,
      myObj._message,
      myObj._numOfFollowers
    );
  }
}
