import { TweeterResponse } from "./TweeterResponse";

export class PostStatusResponse extends TweeterResponse {
  public constructor(success: boolean, message: string | null) {
    super(success, message);
  }

  public static fromJson(json: PostStatusResponse): PostStatusResponse {
    interface IPostStatusResponse {
      _success: boolean
      _message: string | null
    }

    let myObj: IPostStatusResponse = json as unknown as IPostStatusResponse;

    return new PostStatusResponse(
      myObj._success,
      myObj._message
    )
  }
}
