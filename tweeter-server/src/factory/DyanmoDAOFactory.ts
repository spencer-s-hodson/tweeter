import { DynamoAuthDAO } from "../dao/dynamo/DyanmoAuthDAO";
import { DynamoFeedDAO } from "../dao/dynamo/DynamoFeedDAO";
import { DynamoFollowsDAO } from "../dao/dynamo/DynamoFollowsDAO";
import { DynamoStoryDAO } from "../dao/dynamo/DynamoStoryDAO";
import { DynamoUserDAO } from "../dao/dynamo/DynamoUserDAO";

import { DAOFactory } from "./DAOFactory";

export class DynamoDAOFactory implements DAOFactory {
  public getAuthDAO(): DynamoAuthDAO {
    return new DynamoAuthDAO();
  }

  public getFeedDAO(): DynamoFeedDAO {
    return new DynamoFeedDAO();
  }

  public getFollowsDAO(): DynamoFollowsDAO {
    return new DynamoFollowsDAO();
  }

  public getStoryDAO(): DynamoStoryDAO {
    return new DynamoStoryDAO();
  }

  public getUserDAO(): DynamoUserDAO {
    return new DynamoUserDAO();
  }
}
