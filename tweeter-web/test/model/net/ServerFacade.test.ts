import "isomorphic-fetch";
import { ServerFacade } from "../../../src/model/net/ServerFacade";
import { AuthToken, AuthenticateResponse, GetFolloweesCountRequest, GetFollowersCountRequest, GetFollowersCountResponse, LoadMoreFollowersRequest, LoadMoreFollowersResponse, RegisterRequest, User } from "tweeter-shared";

describe("Server Facade Tests", () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  })

  it("Register a user", async () => {
    const req: RegisterRequest = new RegisterRequest("spencer", "hodson", "spenztheman", "not-my-password", "some-image");
    const resp: AuthenticateResponse = await serverFacade.register(req);

    expect(resp.authToken).not.toBeNull();
    expect(resp.message).not.toBeNull();
    expect(resp.success).toBe(true);
    expect(resp.user.firstName).toBe("spencer");
    expect(resp.user.lastName).toBe("hodson");
    expect(resp.user.alias).toBe("@spenztheman");
  })

  /**
   * make sure im actually getting the right 5 users
   */
  it("Get followers for a user", async () => {
    const req: LoadMoreFollowersRequest = new LoadMoreFollowersRequest(
      new AuthToken("token", 123),
      new User("spencer", "hodson", "spenztheman", "some-image"),
      3,
      null
    )
    const resp: LoadMoreFollowersResponse = await serverFacade.loadMoreFollowers(req);
    
    

    expect(resp.success).toBe(true);
    expect(resp.message).not.toBeNull();
    expect(resp.hasMore).toBe(true);
    expect(resp.userItems).not.toBeNull();
  })

  /**
   * Make sure im getting back the right number
   */
  it("Get follower count for a user", async () => {
    const req: GetFollowersCountRequest = new GetFollowersCountRequest(
      new AuthToken("token", 123),
      new User("spencer", "hodson", "spenztheman", "some-image")
    )
    const resp: GetFollowersCountResponse = await serverFacade.getFollowersCount(req);

    expect(resp.success).toBe(true);
    expect(resp.message).not.toBeNull();
    expect(resp.numOfFollowers).not.toBe(0);
  })
})
