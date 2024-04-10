import { AuthToken, FakeData, LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse, LoadMoreStoryItemsRequest, LoadMoreStoryItemsResponse, PostStatusRequest, PostStatusResponse, Status, User } from "tweeter-shared";
import { Service } from "./Service";
import { Factory } from "../../factory/Factory";
import { StoryDAO } from "../../dao/interfaces/StoryDAO";
import { DataPage } from "../../entity/DataPage";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { UserDAO } from "../../dao/interfaces/UserDAO";

export class StatusService extends Service {
  public storyDAO: StoryDAO
  public followsDAO: FollowsDAO
  public userDAO: UserDAO;

  public constructor() {
    super();
    this.storyDAO = Factory.factory.getStoryDAO();
    this.followsDAO = Factory.factory.getFollowsDAO();
    this.userDAO = Factory.factory.getUserDAO();
  }

  // LOADS THE POSTS OF THE USERS THE SELECTED USER FOLLOWS
  public async loadMoreFeedItems(request: LoadMoreFeedItemsRequest): Promise<LoadMoreFeedItemsResponse> {
    if (request.authToken == null) {
      throw new Error("Auth Error: Invalid auth token");
    }
    if (request.user == null) {
      throw new Error("Bad Request: User not found")
    }

    const [statusItems, hasMore] = FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);
    if (statusItems == null || hasMore == null) {
      throw new Error("Internal Server Error: Something went wrong when connecting to the database")
    }

    return new LoadMoreFeedItemsResponse(true, "successfully loaded more feed items", statusItems, hasMore);
  };

  // LOADS THE POSTS POSTED BY THE USER
  public async loadMoreStoryItems(request: LoadMoreStoryItemsRequest): Promise<LoadMoreStoryItemsResponse> {
    /**
     * Story DB Design
     * Partition Key: user_alias
     * Sort Key: timestamp
     * post: string
     */

    // make sure the request is okay
    if (!request || !request.authToken || !request.pageSize || !request.user) {
      throw new Error("[Bad Request]")
    }

    // validate the authToken
    if (this.isValidAuthToken(request.authToken)) {
      throw new Error("[Bad AuthToken]")
    }

    // get the posts that the user posted
    const stuff: DataPage<Status> = await this.storyDAO.getPageOfStories(request.user.alias, request.pageSize, request.lastItem?.timestamp)
    const postsFromDynamo = stuff.items;
    const hasMorePages = stuff.hasMorePages;

    let posts: Status[] = [];
    for (let postItem of postsFromDynamo) {
      const item: Status | null = await this.dynamoStatustoStatus(postItem);
      if (item) {
        posts.push(item);
      }
      else {
        throw new Error("Failed to retrieve post");
      }
    }

    // if (request.authToken == null) {
    //   throw new Error("Auth Error: Invalid auth token");
    // }
    // if (request.user == null) {
    //   throw new Error("Bad Request: User not found")
    // }

    // const [statusItems, hasMore] = FakeData.instance.getPageOfStatuses(request.lastItem, request.pageSize);
    // if (statusItems == null || hasMore == null) {
    //   throw new Error("Internal Server Error: Something went wrong when connecting to the database")
    // }

    return new LoadMoreStoryItemsResponse(true, "successfully loaded more story items", posts, hasMorePages);
  };


  public async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
    // make sure the request is good
    if (!request || !request.authToken || !request.newStatus) {
      throw new Error("[Bad Request]")
    }

    // validate authToken
    if (this.isValidAuthToken(request.authToken)) {
      throw new Error("Expired!")
    }

    // get the user
    const dynamoAuth: AuthToken | null = await this.authDAO.getAuth(request.authToken.token);
    if (!dynamoAuth) {
      throw new Error("[Bad Auth]")
    }
    const user_alias = this.getAliasFromDynamoAuth(dynamoAuth);

    // put status in story DB
    await this.storyDAO.putStory(user_alias, request.newStatus.timestamp, request.newStatus.post)

    // get all follows
    // const stuff: DataPage<Follows> = await this.followsDAO.getPageOfFollowers(user_alias, page_siz)  // PAGE SIZE??


    // put status in feed DB for every follows


    // return a response
    await new Promise((f) => setTimeout(f, 2000));
    return new PostStatusResponse(true, "successfully posted a status");












    // if (request.authToken == null) {
    //   throw new Error("Auth Error: Invalid auth token");
    // }

    // if (request.newStatus == null) {
    //   throw new Error("Bad Request: newStatus is null");
    // }

    // await new Promise((f) => setTimeout(f, 2000));
    // return new PostStatusResponse(true, "successfuly posted status");
  };

  private async dynamoStatustoStatus(item: Status): Promise<Status | null> {
    interface DynamoStatus {
      post: string
      user_alias: string
      timestamp: number
    }
    const myObj: DynamoStatus = item as unknown as DynamoStatus;
    const dynamoUser: User | null = await this.userDAO.getUser(myObj.user_alias)
    const user = this.dynamoUserToUser(dynamoUser);

    if (user) {
      return new Status(
        myObj.post,
        user,
        myObj.timestamp
      )
    }
    else {
      return null;
    }
  }
}
