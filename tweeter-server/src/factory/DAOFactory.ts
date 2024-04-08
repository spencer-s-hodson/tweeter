import { AuthDAO } from "../dao/interfaces/AuthDAO";
import { FeedDAO } from "../dao/interfaces/FeedDAO";
import { FollowsDAO } from "../dao/interfaces/FollowsDAO";
import { StoryDAO } from "../dao/interfaces/StoryDAO";
import { UserDAO } from "../dao/interfaces/UserDAO";


export interface DAOFactory {
  getAuthDAO: () => AuthDAO
  getFeedDAO: () => FeedDAO
  getFollowsDAO: () => FollowsDAO
  getStoryDAO: () => StoryDAO
  getUserDAO: () => UserDAO
}
