import { AuthToken, FakeData, LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse, LoadMoreStoryItemsRequest, LoadMoreStoryItemsResponse, PostStatusRequest, PostStatusResponse, Status, User } from "tweeter-shared";
import { Service } from "./Service";
import { Factory } from "../../factory/Factory";
import { StoryDAO } from "../../dao/interfaces/StoryDAO";
import { DataPage } from "../../entity/DataPage";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { UserDAO } from "../../dao/interfaces/UserDAO";
import { FeedDAO } from "../../dao/interfaces/FeedDAO";
import { Follows } from "../../entity/Follows";

export class StatusService extends Service {
  public storyDAO: StoryDAO
  public followsDAO: FollowsDAO
  public userDAO: UserDAO;
  public feedDAO: FeedDAO;


  public constructor() {
    super();
    this.storyDAO = Factory.factory.getStoryDAO();
    this.followsDAO = Factory.factory.getFollowsDAO();
    this.userDAO = Factory.factory.getUserDAO();
    this.feedDAO = Factory.factory.getFeedDAO();
  }


  public async loadMoreFeedItems(request: LoadMoreFeedItemsRequest): Promise<LoadMoreFeedItemsResponse> {
    console.log("Last Item: " + JSON.stringify(request.lastItem));
    
    // make sure the request is good
    if (!request || !request.authToken || !request.pageSize || !request.user) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Bad AuthToken]: Please resign in to perform this action");
    }

    // get the feed
    const stuff: DataPage<Status> = await this.feedDAO.getPageOfFeed(request.user.alias, request.pageSize, request.lastItem?.timestamp);
    const dynamoItems: Status[] = stuff.items;
    const hasMorePages = stuff.hasMorePages;

    // DEBUG
    console.log("Dynamo Items: " + JSON.stringify(dynamoItems));
    console.log("hasMore: " + JSON.stringify(hasMorePages))

    let feed: Status[] = [];
    for (let dynamoFeedItem of dynamoItems) {
      const item: Status | null = await this.dynamoStatustoStatus(dynamoFeedItem);
      console.log(JSON.stringify(item));
      if (item) {
        feed.push(item);
      }
      else {
        throw new Error("Failed to retrieve post");
      }
    }

    // return a response
    return new LoadMoreFeedItemsResponse(true, "successfully loaded more feed items", feed, hasMorePages);
  };


  public async loadMoreStoryItems(request: LoadMoreStoryItemsRequest): Promise<LoadMoreStoryItemsResponse> {
    // make sure the request is okay
    if (!request || !request.authToken || !request.pageSize || !request.user) {
      throw new Error("[Bad Request]")
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Bad AuthToken]")
    }

    // get the posts that the user posted
    const stuff: DataPage<Status> = await this.storyDAO.getPageOfStories(request.user.alias, request.pageSize, request.lastItem?.timestamp);
    const dynamoItems = stuff.items;
    const hasMorePages = stuff.hasMorePages;

    let posts: Status[] = [];
    for (let dynamoPostItem of dynamoItems) {
      const item: Status | null = await this.dynamoStatustoStatus(dynamoPostItem);
      if (item) {
        posts.push(item);
      }
      else {
        throw new Error("Failed to retrieve post");
      }
    }

    // return a response
    return new LoadMoreStoryItemsResponse(true, "successfully loaded more story items", posts, hasMorePages);
  };


  public async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
    // make sure the request is good
    if (!request || !request.authToken || !request.newStatus) {
      throw new Error("[Bad Request]");
    }

    // validate authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("Expired!");
    }

    // get the user alias through the authToken
    const dynamoAuth: AuthToken | null = await this.authDAO.getAuth(request.authToken.token);
    if (!dynamoAuth) {
      throw new Error("[Bad Auth]")
    }
    const user_alias = this.getAliasFromDynamoAuth(dynamoAuth);

    // put status in story and feed DB
    await this.storyDAO.putStory(user_alias, request.newStatus.timestamp, request.newStatus.post);


    // get all follows
    const follows: Follows[] = await this.followsDAO.getFollowerHandles(user_alias);

    // put status in feed DB for every follows
    for (let dynamoFollow of follows) {
      const follow = this.dynamoFollowsToFollows(dynamoFollow);
      if (follow) {
        await this.feedDAO.putFeed(follow.follower_handle, request.newStatus.timestamp, request.newStatus.post);
      }
      else {
        throw new Error("something bad happened")
      }
    }

    // return a response
    return new PostStatusResponse(true, "successfully posted a status");
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
