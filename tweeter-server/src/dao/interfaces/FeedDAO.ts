import { Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";

export interface FeedDAO {
  putFeed: (user_alias: string, timestamp: number, post: string, author: string) => Promise<void>;
  getPageOfFeed: (user_alias: string, page_size: number, last_timestamp: number | undefined) => Promise<DataPage<Status>>;
}
