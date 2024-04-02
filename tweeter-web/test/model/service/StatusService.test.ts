import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

describe("Server Facade Tests", () => {
  let statusService: StatusService;

  beforeEach(() => {
    statusService = new StatusService();
  })

  /**
   * loop through fake data
   */
  it("Register a user", async () => {
    const authToken: AuthToken = new AuthToken("token", 10);
    const user: User = new User("spencer", "hodson", "spenztheman", "some-image");
    const pagesize: number = 10;
    const lastItem: Status = new Status("some-post", user, 10);

    const [statusItems, hasMore] = await statusService.loadMoreStoryItems(authToken, user, pagesize, lastItem);

    expect(statusItems).not.toBeNull();
    expect(hasMore).toBe(true);
  })
})
