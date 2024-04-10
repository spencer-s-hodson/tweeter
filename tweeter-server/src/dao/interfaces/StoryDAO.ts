import { Status } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";

export interface StoryDAO {
  putStory: (user_alias: string, timestamp: number, post: string) => Promise<void>;
  getPageOfStories: (user_alias: string, page_size: number, last_timestamp: number | undefined) => Promise<DataPage<Status>>;
}
