import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { AuthToken, Status } from "tweeter-shared";

const BATCH_SIZE = 25;

export const handler = async(event: any): Promise<any> => {
  let authTokenJSON = JSON.parse(event.Records[0].body).authToken;
  let statusJSON = JSON.parse(event.Records[0].body).status;

  let authToken = AuthToken.fromJson(JSON.stringify(authTokenJSON));
  let status = Status.fromJson(JSON.stringify(statusJSON));

  // call the service and handle the errors there?
}

