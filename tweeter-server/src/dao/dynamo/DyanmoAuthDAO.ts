import { AuthDAO } from "../interfaces/AuthDAO";
import { DAO } from "../DAO";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoAuthDAO extends DAO implements AuthDAO {
  protected tableName: string = "authtokens";

  public async getAuth(token: string): Promise<any> {
    const key = {
      token
    };
    const { Item } = await this.client.send(new GetCommand({ TableName: this.tableName, Key: key }));
    return Item;
  }

  public async putAuth(token: string, timestamp: number, user_alias: string): Promise<void> {
    const item = {
      token,
      timestamp,
      user_alias
    };
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  public async deleteAuth(token: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        token
      }
    };
    await this.client.send(new DeleteCommand(params));
  }
}
