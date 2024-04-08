import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../../dao/interfaces/AuthDAO";
import { Factory } from "../../factory/Factory";

export class Service {
  protected authDAO: AuthDAO;

  constructor() {
    this.authDAO = Factory.factory.getAuthDAO();
  }
  
  protected isValidAuthToken(authToken: AuthToken): boolean {
    const timeDifference: number = Date.now() - authToken.timestamp;

    // 20 minutes
    if (timeDifference >= 120000) {
      return false;
    }

    return true;
  }
}