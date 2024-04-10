import SHA256 from "crypto-js/sha256";
import { AuthToken, AuthenticateResponse, GetUserRequest, GetUserResponse, LoginRequest, LogoutRequest, LogoutResponse, RegisterRequest, User } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { UserDAO } from "../../dao/interfaces/UserDAO";
import { Service } from "./Service";

export class UserService extends Service {
  private userDAO: UserDAO;

  public constructor() {
    super();
    this.userDAO = Factory.factory.getUserDAO();
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
    await this.authDAO.putAuth(authToken.token, authToken.timestamp, user.alias);

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
    console.log(request.alias);
    const existingUser: User | null = await this.userDAO.getUser(request.alias);
    if (existingUser != null) {
      throw new Error("User already exists in DB!");  // should this return a bad AuthenticateResponse instead?
    }

    console.log("EXISTING USER: JSON.stringify(existingUser)");

    // hash the password
    const hashedPassword = UserService.hashPassword(request.password);

    // convert image string to actual image, puts the image in the S3 bucket
    const image_url: string = await this.userDAO.putImage(`${request.alias}-image`, request.userImageBytes);

    // put the user in the DB
    await this.userDAO.putUser(request.alias, hashedPassword, request.firstName, request.lastName, image_url, 1, 1);
    
    // create a user and authToken if all of this worked
    const user = new User(request.firstName, request.lastName, request.alias, image_url);
    const authToken = AuthToken.Generate();

    // put the authToken in table
    await this.authDAO.putAuth(authToken.token, authToken.timestamp, user.alias);

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
    // await this.initialize();

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
    const user: User | null = await this.userDAO.getUser(request.alias);
    if (user == null) {
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

  private async initialize() {
    // add user0 - user24 with put command
    for (let i = 0; i < 25; i++) {
      await this.userDAO.putUser(
        `@User${i}`, // alias
        "a",        // password
        "User",     // first name
        `${i}`,          // last name
        "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png",  // why doesn't this work
        1,          // following
        1           // followers
      );
    }

    // go mess with clint and flint in the database
    // and then go mess with the dynamo excercise
  }
}
