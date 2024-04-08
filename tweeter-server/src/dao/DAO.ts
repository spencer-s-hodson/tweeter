import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export abstract class DAO {
  protected readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));
  protected abstract tableName: string
}
