import { User } from "tweeter-shared";

export interface UserDAO {
  getUser: (user_alias: string) => Promise<User | null>,
  putUser: (user_alias: string, user_password: string, user_first_name: string, user_last_name: string, user_image: string, following: number, followers: number) => Promise<void>
  updateUser: (user_alias: string, new_count: number, update_followers: boolean) => Promise<void>
  putImage: (fileName: string, imageStringBase64Encoded: string) => Promise<string>
}
