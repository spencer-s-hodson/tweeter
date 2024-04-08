import { DAO } from "../DAO";
import { StoryDAO } from "../interfaces/StoryDAO";

export class DynamoStoryDAO extends DAO implements StoryDAO {
  protected tableName: string = "some table";
}
