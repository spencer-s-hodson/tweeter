import { Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";
import { DAO } from "../DAO";
import { StoryDAO } from "../interfaces/StoryDAO";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoStoryDAO extends DAO implements StoryDAO {
  protected tableName: string = "story";

  public async putStory(user_alias: string, timestamp: number, post: string): Promise<void> {
    const item = {
      user_alias,
      timestamp,
      post
    }
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  public async getPageOfStories(user_alias: string, page_size: number, last_timestamp: number | undefined): Promise<DataPage<Status>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'user_alias = :ua',
      ExpressionAttributeValues: {
        ':ua': user_alias,
      },
      Limit: page_size,
      ExclusiveStartKey: last_timestamp ? { user_alias: user_alias, timestamp: last_timestamp } : undefined,
    };
  
    // Perform the query
    const result = await this.client.send(new QueryCommand(params));
    const items = result.Items as Status[];
    const hasMorePages = result.LastEvaluatedKey == undefined;
  
    // Construct and return the DataPage object
    return new DataPage<Status>(items, hasMorePages);
  }
}
