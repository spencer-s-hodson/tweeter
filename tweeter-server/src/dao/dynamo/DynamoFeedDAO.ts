import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DAO } from "../DAO";
import { FeedDAO } from "../interfaces/FeedDAO";
import { Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";

export class DynamoFeedDAO extends DAO implements FeedDAO {
  public tableName: string = "feed";

  public async putFeed(user_alias: string, timestamp: number, post: string, author: string): Promise<void> {
    const item = {
      user_alias,
      timestamp,
      post,
      author
    }
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  public async getPageOfFeed(user_alias: string, page_size: number, last_timestamp: number | undefined): Promise<DataPage<Status>> {
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
    console.log(JSON.stringify(result));
    const items = result.Items as Status[];
    const hasMorePages = result.LastEvaluatedKey == undefined;
  
    // Construct and return the DataPage object
    return new DataPage<Status>(items, hasMorePages);
  }
}
