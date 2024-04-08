import { DAO } from "../DAO";
import { FeedDAO } from "../interfaces/FeedDAO";

export class DynamoFeedDAO extends DAO implements FeedDAO {
  public tableName: string = "someTable";

}
