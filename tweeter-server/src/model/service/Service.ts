import { AuthToken, User } from "tweeter-shared";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";
import { Factory } from "../../factory/Factory";
import { UserDAO } from "../../dao/interfaces/UserDAO";

export class Service {
  protected authDAO: AuthDAO;
  protected userDAO: UserDAO;

  constructor() {
    this.authDAO = Factory.factory.getAuthDAO();
    this.userDAO = Factory.factory.getUserDAO();
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
}