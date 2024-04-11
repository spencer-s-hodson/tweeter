import { AuthToken } from "tweeter-shared";
import { Service } from "./Service";
import { Follows } from "../../entity/Follows";

export class AuthService extends Service {
  protected isValidAuthToken(authToken: AuthToken): boolean {
    const timeDifference: number = Date.now() - authToken.timestamp;

    // 20 minutes
    if (timeDifference >= 120000) {
      return false;
    }

    return true;
  }

  protected dynamoFollowsToFollows(follows: Follows) {
    interface IFollows {
      followee_handle: string
      follower_handle: string
    }
    const myObj: IFollows = follows as unknown as IFollows;

    return new Follows(
      myObj.follower_handle,
      myObj.followee_handle,
    )
  }

  protected getAliasFromDynamoAuth(authToken: AuthToken) {
    interface DynamoAuthToken {
      token: string
      timestap: number
      user_alias: string
    }
    const dynamoAuthToken: DynamoAuthToken = authToken as unknown as DynamoAuthToken;
    return dynamoAuthToken.user_alias;
  }
}
