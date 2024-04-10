import { AuthToken, User } from "tweeter-shared";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";
import { Factory } from "../../factory/Factory";
import { Follows } from "../../entity/Follows";

export class Service {
  protected authDAO: AuthDAO;

  constructor() {
    this.authDAO = Factory.factory.getAuthDAO();
  }
  
  protected isValidAuthToken(authToken: AuthToken): boolean {
    return true;
    // const timeDifference: number = Date.now() - authToken.timestamp;

    // // 20 minutes
    // if (timeDifference >= 120000) {
    //   return false;
    // }

    // return true;
  }

  protected dynamoUserToUser(user: any) {
    interface DyanmoUser {
      user_first_name: string
      user_last_name: string
      user_alias: string
      user_password: string
      user_image: string
      following: string
      followers: string
    }
    const dyanmoUser: DyanmoUser = user as unknown as DyanmoUser;

    return new User(
      dyanmoUser.user_first_name,
      dyanmoUser.user_last_name,
      dyanmoUser.user_alias,
      dyanmoUser.user_image
    );
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

  protected dynamoAuthtoAuth(authToken: AuthToken) {
    interface DynamoAuthToken {
      user_alias: string
      token: string
      timestamp: number
    }
    const myObj: DynamoAuthToken = authToken as unknown as DynamoAuthToken;

    return new AuthToken(
      myObj.token,
      myObj.timestamp
    );
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