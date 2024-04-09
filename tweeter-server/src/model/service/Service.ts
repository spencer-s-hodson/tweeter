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

  protected parseFollows(follows: Follows) {
    interface IFollows {
      followee_handle: string
      followee_name: string
      follower_handle: string
      follower_name: string
    }
    const myObj: IFollows = follows as unknown as IFollows;

    return new Follows(
      myObj.follower_handle,
      myObj.follower_name,
      myObj.followee_handle,
      myObj.followee_name
    )
  }
}