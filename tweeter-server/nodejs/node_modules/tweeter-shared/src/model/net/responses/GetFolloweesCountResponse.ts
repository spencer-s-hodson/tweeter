import { TweeterResponse } from "./TweeterResponse";

export class GetFolloweesCountResponse extends TweeterResponse {
  private _numOfFollowees: number;

  public constructor(success: boolean, message: string | null, numOfFollowees: number) {
    super(success, message);
    this._numOfFollowees = numOfFollowees;
  }

  public get numOfFollowees() {
    return this._numOfFollowees;
  }

  public static fromJson(json: GetFolloweesCountResponse): GetFolloweesCountResponse {
    interface IGetFolloweesCountResponse {
      _success: boolean
      _message: string | null
      _numOfFollowees: number
    }

    let myObj: IGetFolloweesCountResponse = json as unknown as IGetFolloweesCountResponse;
    
    return new GetFolloweesCountResponse(
      myObj._success,
      myObj._message,
      myObj._numOfFollowees
    );
  }
}
