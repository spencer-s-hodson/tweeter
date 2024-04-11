import SHA256 from "crypto-js/sha256";
import { AuthToken, AuthenticateResponse, GetUserRequest, GetUserResponse, LoginRequest, LogoutRequest, LogoutResponse, RegisterRequest, User } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { Service } from "./Service";

export class UserService extends Service {
  public constructor() {
    super();
    this.userDAO = Factory.factory.getUserDAO();
  }

  public async login(request: LoginRequest): Promise<AuthenticateResponse> {
    // make sure the request is okay
    if (!request || !request.alias || !request.password) {
      throw new Error("[Bad Request]: Please enter a username and a password");
    }

    // if the user doesn't exist then throw an error
    const existingUser: User | null = await this.userDAO.getUser(request.alias);
    if (existingUser == null) {
      throw new Error("[Unauthorized]: Invalid alias or password");
    }

    // create user and authToken
    const user = this.dynamoUserToUser(existingUser);
    const authToken = AuthToken.Generate();

    // put authToken in table
    await this.authDAO.putAuth(authToken.token, authToken.timestamp, user.alias);

    // return a login response
    return new AuthenticateResponse(true, `Successfully logged in ${existingUser.firstName}.`, user, authToken);
  };


  public async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    // make sure the request is okay
    if (!request || !request.alias || !request.password || !request.firstName || !request.lastName || !request.userImageBytes) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // check if the user already exists
    const existingUser: User | null = await this.userDAO.getUser(request.alias);
    if (existingUser != null) {
      throw new Error("[Unauthorized]: A user with this username already exists");
    }

    // hash the password
    const hashedPassword = UserService.hashPassword(request.password);

    // convert image string to actual image, puts the image in the S3 bucket
    const image_url: string = await this.userDAO.putImage(`${request.alias}-image`, request.userImageBytes);

    // put the user in the DB
    await this.userDAO.putUser(request.alias, hashedPassword, request.firstName, request.lastName, image_url, 0, 0);
    
    // create a user and authToken if all of this worked
    const user = new User(request.firstName, request.lastName, request.alias, image_url);
    const authToken = AuthToken.Generate();

    // put the authToken in table
    await this.authDAO.putAuth(authToken.token, authToken.timestamp, user.alias);

    // return the appropriate response
    return new AuthenticateResponse(true, `Successfully registered ${user.firstName} ${user.lastName}`, user, authToken);
  }


  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    // make sure the request is okay
    if (!request || !request.authToken) {
      throw new Error("[Bad Request]: Unable to logout the user");
    }

    // delete the authToken in the DB
    await this.authDAO.deleteAuth(request.authToken.token);

    return new LogoutResponse(true, "Successfuly logged user out");
  };


  public async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    // make sure the request is good
    if (!request || !request.alias || !request.authToken) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // get the authtoken from the database
    const auth = await this.authDAO.getAuth(request.authToken.token);
    if (!auth) {
      throw new Error("[Internal Server Error]: Couldn't get and authToken from the DB");
    }

    // get the user
    const user: User | null = await this.userDAO.getUser(request.alias);
    if (!user) {
      return new GetUserResponse(false, "couldn't find user", null);
    }
    else {
      const actualUser = this.dynamoUserToUser(user);
      return new GetUserResponse(true, "successfully found user", actualUser);
    }
  };

  // hashs the password
  private static hashPassword(password: string): string {
    return SHA256(password).toString();
  }
}
