import { User } from "tweeter-shared";

export interface UserDAO {
  getUser: (user_alias: string) => Promise<User | null>,  // this will need some sort of value like the handle as a key
  putUser: (user_alias: string, user_password: string, user_first_name: string, user_last_name: string, user_image: string, following: number, followers: number) => Promise<void>
  putImage: (fileName: string, imageStringBase64Encoded: string) => Promise<string>
}
