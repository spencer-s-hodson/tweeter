import { Buffer } from "buffer";
import { AuthToken, AuthenticateResponse, GetUserRequest, GetUserResponse, LoginRequest, LogoutRequest, LogoutResponse, RegisterRequest, User } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class UserService {
  private serverFacade: ServerFacade = new ServerFacade();

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const req: LoginRequest = new LoginRequest(alias, password);
    const resp: AuthenticateResponse = await this.serverFacade.login(req);
    return [resp.user, resp.authToken];
  };

  public async register(firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    let imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");
    const req: RegisterRequest = new RegisterRequest(firstName, lastName, alias, password, imageStringBase64);
    const resp: AuthenticateResponse = await this.serverFacade.register(req);
    return [resp.user, resp.authToken];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    const req: LogoutRequest = new LogoutRequest(authToken);
    const resp: LogoutResponse = await this.serverFacade.logut(req);
  };

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const req: GetUserRequest = new GetUserRequest(authToken, alias);
    const resp: GetUserResponse = await this.serverFacade.getUser(req);
    return resp.user;
  };
};
