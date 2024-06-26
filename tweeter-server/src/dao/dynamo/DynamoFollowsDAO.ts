import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Follows } from "../../entity/Follows";
import { DataPage } from "../../entity/DataPage";
import { DAO } from "../DAO"; // this doesn't so anything as of right now
import { FollowsDAO } from "../interfaces/FollowsDAO";

export class DynamoFollowsDAO extends DAO implements FollowsDAO {
  readonly tableName: string = "follows";
  readonly indexName = "follows_index";

  public async putItem(follower_handle: string, followee_handle: string): Promise<void> {
    const item = {
      follower_handle,
      followee_handle
    };
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  public async getItem(follower_handle: string, followee_handle: string): Promise<any> {
    const key = {
      follower_handle,
      followee_handle
    };
    const { Item } = await this.client.send(new GetCommand({ TableName: this.tableName, Key: key }));
    return Item;
  }

  public async deleteItem(follower_handle: string, followee_handle: string): Promise<void> {
    follower_handle = this.addAtSymbol(follower_handle);
    followee_handle = this.addAtSymbol(followee_handle);
    const params = {
      TableName: this.tableName,
      Key: {
        follower_handle,
        followee_handle
      }
    };
    await this.client.send(new DeleteCommand(params));
  }

  public async getPageOfFollowees(follower_handle: string, page_size: number, last_followee_handle: string | undefined): Promise<DataPage<Follows>> {
    follower_handle = this.addAtSymbol(follower_handle);
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'follower_handle = :fh',
      ExpressionAttributeValues: {
        ':fh': follower_handle,
      },
      Limit: page_size,
      ExclusiveStartKey: last_followee_handle ? { follower_handle: follower_handle, followee_handle: last_followee_handle } : undefined,
    };
  
    // Perform the query
    const result = await this.client.send(new QueryCommand(params));
    const items = result.Items as Follows[];
    const hasMorePages = result.LastEvaluatedKey == undefined;
  
    // Construct and return the DataPage object
    return new DataPage<Follows>(items, hasMorePages);
  }
  
  public async getPageOfFollowers(followee_handle: string, page_size: number, last_follower_handle: string | undefined): Promise<DataPage<Follows>> { 
    const params = {
      TableName: this.tableName,
      IndexName: "follows_index", // Assuming there's a GSI for querying by followee_handle
      KeyConditionExpression: 'followee_handle = :eh',
      ExpressionAttributeValues: {
        ':eh': followee_handle,
      },
      Limit: page_size,
      ExclusiveStartKey: last_follower_handle ? { followee_handle: followee_handle, follower_handle: last_follower_handle } : undefined,
    };
  
    const result = await this.client.send(new QueryCommand(params));
    const items = result.Items as Follows[]; // replace this
    const lastKey = result.LastEvaluatedKey ? result.LastEvaluatedKey.follower_handle : undefined;
  
    return new DataPage<Follows>(items, lastKey);
  }


  public async getFollowerHandles(followee_handle: string) {
    const params = {
      TableName: this.tableName,
      IndexName: "follows_index",
      KeyConditionExpression: 'followee_handle = :eh',
      ExpressionAttributeValues: {
        ':eh': followee_handle,
      },
    }

    const result = await this.client.send(new QueryCommand(params));  
    const items = result.Items as Follows[]; // replace this
    return items;
  }

  
  private addAtSymbol(handle: string) {
    if (handle[0] == "@") {
      return handle;
    }
    else {
      return "@" + handle;
    }
  }
}
