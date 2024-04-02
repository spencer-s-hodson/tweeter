import { AuthToken, AuthenticateResponse, FakeData, GetUserRequest, GetUserResponse, LoginRequest, LogoutRequest, LogoutResponse, RegisterRequest } from "tweeter-shared";

export class UserService {
  public async login(request: LoginRequest): Promise<AuthenticateResponse> {
    if (request.alias == null || request.password == null) {
      throw new Error("Bad Request: Please enter a username and a password");
    }

    let user = FakeData.instance.firstUser;  // make sure database returns null if somethng bad happens
    
    if (user == null) {
      throw new Error("Internal Server Error: Invalid alias or password");
    }

    return new AuthenticateResponse(true, "nice", user, AuthToken.Generate());
  };

  public async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    if (request.alias == null || request.password == null || request.firstName == null || request.lastName == null || request.userImageBytes == null ) {
      throw new Error("Bad Request: Please enter all information");
    }

    let user = FakeData.instance.firstUser;

    if (user == null) {
      throw new Error("Internal Server Error: Failed to register use");
    }

    return new AuthenticateResponse(true, "nice", user, AuthToken.Generate());
  };

  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }

    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));

    return new LogoutResponse(true, "successfuly logged out");
  };

  public async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    if (request.alias == null) {
      throw new Error("Bad Request: User does not exist");
    }

    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }

    return new GetUserResponse(true, "successfully found user", FakeData.instance.findUserByAlias(request.alias));
  };
}
