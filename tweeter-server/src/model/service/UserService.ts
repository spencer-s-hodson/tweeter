import SHA256 from "crypto-js/sha256";
import { AuthToken, AuthenticateResponse, GetUserRequest, GetUserResponse, LoginRequest, LogoutRequest, LogoutResponse, RegisterRequest, User } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { UserDAO } from "../../dao/interfaces/UserDAO";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";
import { Service } from "./Service";

export class UserService extends Service {
  private userDAO: UserDAO;
  // private authDAO: AuthDAO;

  public constructor() {
    super();
    this.userDAO = Factory.factory.getUserDAO();
    // this.authDAO = Factory.factory.getAuthDAO();
  }

  public async login(request: LoginRequest): Promise<AuthenticateResponse> {
    // make sure the request is okay
    if (request.alias == null || request.password == null) {
      throw new Error("Bad Request: Please enter a username and a password");
    }

    // if the user doesn't exist then throw an error
    const existingUser: User | null = await this.userDAO.getUser(request.alias);
    if (existingUser == null) {
      throw new Error("Internal Server Error: Invalid alias or password");
    }

    // create user and authToken
    const user = this.dynamoUserToUser(existingUser);
    const authToken = AuthToken.Generate();

    // put authToken in table
    await this.authDAO.putAuth(authToken.token, authToken.timestamp);

    // return a login response
    return new AuthenticateResponse(true, `Successfully logged in ${existingUser.firstName}.`, user, authToken);
  };


  // TODO: make sure the right error message is getting thrown
  public async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    // make sure the request is okay
    if (request.alias == null || request.password == null || request.firstName == null || request.lastName == null || request.userImageBytes == null) {
      throw new Error("Bad Request: Please enter all information");
    }

    // check if the user already exists
    const existingUser: User | null = await this.userDAO.getUser(request.alias);
    if (existingUser != null) {
      throw new Error("User already exists in DB!");  // should this return a bad AuthenticateResponse instead?
    }

    // hash the password
    const hashedPassword = UserService.hashPassword(request.password);

    // convert image string to actual image, puts the image in the S3 bucket
    const image_url: string = await this.userDAO.putImage(`${request.alias}-image`, request.userImageBytes);

    // put the user in the DB
    await this.userDAO.putUser(request.alias, hashedPassword, request.firstName, request.lastName, image_url);

    // create a user and authToken if all of this worked
    const user = new User(request.firstName, request.lastName, request.alias, image_url);
    const authToken = AuthToken.Generate();

    // put the authToken in table
    await this.authDAO.putAuth(authToken.token, authToken.timestamp);

    // return the appropriate response
    return new AuthenticateResponse(true, "success", user, authToken);
  }

  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    // make sure the request is okay
    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }

    // delete the authToken
    await this.authDAO.deleteAuth(request.authToken.token);

    return new LogoutResponse(true, "successfuly logged user out");
  };

  // test this
  public async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    // make sure the request is good
    if (request.alias == null) {
      throw new Error("Bad Request: User does not exist");
    }

    // get the authtoken from the database
    const auth = await this.authDAO.getAuth(request.authToken.token);
    if (auth == null) {
      throw new Error("Auth Error: Invalid auth token");
    }

    // get the user
    const dynamoUser: User | null = await this.userDAO.getUser(request.alias);
    if (dynamoUser == null) {
      return new GetUserResponse(false, "couldn't find user", null);
    }
    else {
      const actualUser = this.dynamoUserToUser(dynamoUser);
      return new GetUserResponse(true, "successfully found user", actualUser);
    }
  };

  // converts a dynamo user to a User object
  private dynamoUserToUser(user: User) {
    interface DyanmoUser {
      user_last_name: string,
      user_first_name: string
      user_alias: string
      user_password: string
      user_image: string
    }
    const dyanmoUser: DyanmoUser = user as unknown as DyanmoUser;
    return new User(dyanmoUser.user_first_name, dyanmoUser.user_last_name, dyanmoUser.user_alias, dyanmoUser.user_image); 
  }

  // hashs the password
  private static hashPassword(password: string): string {
    return SHA256(password).toString();
  }
}
