import { AuthToken, LoadMoreFeedItemsRequest, LoadMoreFeedItemsResponse, LoadMoreStoryItemsRequest, LoadMoreStoryItemsResponse, PostStatusRequest, PostStatusResponse, Status, User } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { StoryDAO } from "../../dao/interfaces/StoryDAO";
import { DataPage } from "../../entity/DataPage";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { FeedDAO } from "../../dao/interfaces/FeedDAO";
import { Follows } from "../../entity/Follows";
import { AuthService } from "./AuthService";
import { MySQS } from "../../sqs/Queue";

// change these name
const POST_STATUS_QUEUE = "https://sqs.us-west-2.amazonaws.com/839064361653/postStatusQueue";
const UPDATE_FEED_QUEUE = "https://sqs.us-west-2.amazonaws.com/839064361653/updateFeedQueue";

export class StatusService extends AuthService {
  public storyDAO: StoryDAO
  public followsDAO: FollowsDAO
  public feedDAO: FeedDAO;
  public sqs: MySQS;


  public constructor() {
    super();
    this.storyDAO = Factory.factory.getStoryDAO();
    this.followsDAO = Factory.factory.getFollowsDAO();
    this.feedDAO = Factory.factory.getFeedDAO();
    this.sqs = new MySQS();
  }


  public async loadMoreFeedItems(request: LoadMoreFeedItemsRequest): Promise<LoadMoreFeedItemsResponse> {
    // make sure the request is good
    if (!request || !request.authToken || !request.pageSize || !request.user) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    // get the feed
    const stuff: DataPage<Status> = await this.feedDAO.getPageOfFeed(request.user.alias, request.pageSize, request.lastItem?.timestamp);
    const dynamoItems: Status[] = stuff.items;
    const hasMorePages = stuff.hasMorePages;

    let feed: Status[] = [];
    for (let dynamoFeedItem of dynamoItems) {
      const item: Status | null = await this.dynamoFeedtoStatus(dynamoFeedItem);
      if (item) {
        feed.push(item);
      }
      else {
        throw new Error("[Internal Server Error]: Failed to retrieve post");
      }
    }

    // return a response
    return new LoadMoreFeedItemsResponse(true, "successfully loaded more feed items", feed, hasMorePages);
  };


  public async loadMoreStoryItems(request: LoadMoreStoryItemsRequest): Promise<LoadMoreStoryItemsResponse> {
    // make sure the request is okay
    if (!request || !request.authToken || !request.pageSize || !request.user) {
      throw new Error("[Bad Request]: Please enter all information")
    }

    // validate the authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    // get the posts that the user posted
    const stuff: DataPage<Status> = await this.storyDAO.getPageOfStories(request.user.alias, request.pageSize, request.lastItem?.timestamp);
    const dynamoItems = stuff.items;
    const hasMorePages = stuff.hasMorePages;

    let posts: Status[] = [];
    for (let dynamoPostItem of dynamoItems) {
      const item: Status | null = await this.dynamoStorytoStatus(dynamoPostItem);
      if (item) {
        posts.push(item);
      }
      else {
        throw new Error("[Internal Server Error]: Failed to retrieve post");
      }
    }

    // return a response
    return new LoadMoreStoryItemsResponse(true, "successfully loaded more story items", posts, hasMorePages);
  };


  public async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
    // make sure the request is good
    if (!request || !request.authToken || !request.newStatus) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    // validate authToken
    if (!this.isValidAuthToken(request.authToken)) {
      throw new Error("[Unauthorized]: Please resign in to perform this action");
    }

    // get the user alias through the authToken
    const dynamoAuth: AuthToken | null = await this.authDAO.getAuth(request.authToken.token);
    if (!dynamoAuth) {
      throw new Error("[Internal Server Error]: Failed to retrieve an authToken")
    }
    const user_alias = this.getAliasFromDynamoAuth(dynamoAuth);

    // put status in story and feed DB
    await this.storyDAO.putStory(user_alias, request.newStatus.timestamp, request.newStatus.post);

    return new PostStatusResponse(true, "successfully posted a status");
  };


  public async postUpdateFeedMessages(request: PostStatusRequest): Promise<void> {
    if (!request || !request.newStatus || !request.authToken) {
      throw new Error("[Bad Request]: Please enter all information");
    }

    const author: User | null = await this.userDAO.getUser(request.newStatus.user.alias);
    if (!author) {
      throw new Error("[Internal Server Error]: Failed to retrieve the author of the post");
    }

    let follows: Follows[] = await this.followsDAO.getFollowerHandles(author.alias);

    const BATCH_SIZE = 250;

    for (let i = 0; i < follows.length; i += BATCH_SIZE) {
      const batch = follows.slice(i, i + BATCH_SIZE);
      const message = JSON.stringify({
        status: request.newStatus,
        followers: batch
      })

      try {
        await this.sqs.sendMessage(message, UPDATE_FEED_QUEUE);
        console.log("Success, message sent.");
      } catch (err) {
        throw new Error("[Internal Server Error]: Failed to send a message to the queue");
      }

    }
  }


  // return new PostStatusResponse(true, "successfully posted a status");










  private async dynamoFeedtoStatus(item: Status): Promise<Status | null> {
    interface DynamoStatus {
      post: string
      user_alias: string
      timestamp: number
      author: string
    }


    const myObj: DynamoStatus = item as unknown as DynamoStatus;
    const dynamoUser: User | null = await this.userDAO.getUser(myObj.author)
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


  private async dynamoStorytoStatus(item: Status): Promise<Status | null> {
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
