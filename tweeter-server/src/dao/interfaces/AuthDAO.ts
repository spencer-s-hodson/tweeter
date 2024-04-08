import { AuthToken } from "tweeter-shared";

export interface AuthDAO {
  getAuth: (token: string) => Promise<any>,
  putAuth: (token: string, timestamp: number) => Promise<void>,  // can the timestamp be a number?
  deleteAuth: (token: string) => Promise<void>
}
