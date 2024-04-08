import { DataPage } from "../../entity/DataPage"
import { Follows } from "../../entity/Follows"

export interface FollowsDAO {
  putItem: (follower_handle: string, follower_name: string, followee_handle: string, followee_name: string) => Promise<void>
  getItem: (follower_handle: string, followee_handle: string) => Promise<any>
  updateItem: (follower_handle: string, followee_handle: string, new_follower_name: string, new_followee_name: string) => Promise<void>
  deleteItem: (follower_handle: string, followee_handle: string) => Promise<void>
  getPageOfFollowees: (follower_handle: string, page_size: number, last_followee_handle: string | undefined) => Promise<DataPage<Follows>>
  getPageOfFollowers: (followee_handle: string, page_size: number, last_follower_handle: string | undefined) => Promise<DataPage<Follows>>
}
