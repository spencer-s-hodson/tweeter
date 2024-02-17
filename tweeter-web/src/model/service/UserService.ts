import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweesCount(user);
  };

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowersCount(user);
  };

  public async follow(authToken: AuthToken, userToFollow: User): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    let followersCount = await this.getFollowersCount(authToken, userToFollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  };

  public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the unfollowing message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
    let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);

    return [followersCount, followeesCount];
  };

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };

  public async register(firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    let imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    let user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  };
}
